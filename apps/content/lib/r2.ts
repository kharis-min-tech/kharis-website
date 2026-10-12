import {
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  type DeleteObjectsCommandOutput,
  type GetObjectCommandOutput,
  type ListObjectsV2CommandOutput,
  type S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { branchImageFolderKey, isBranchId, isR2ObjectKey, publicUrlForKey } from "@/lib/branch-image-paths";

function required(name: string) {
  const value = process.env[name]?.trim();
  return value || null;
}

function storageConfig() {
  const accountId = required("R2_ACCOUNT_ID");
  const accessKeyId = required("R2_ACCESS_KEY_ID");
  const secretAccessKey = required("R2_SECRET_ACCESS_KEY");
  const bucket = required("R2_BUCKET_NAME");
  const endpoint =
    required("R2_ENDPOINT") ?? (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : null);
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !endpoint) return null;
  return { accountId, accessKeyId, secretAccessKey, bucket, endpoint };
}

function isCertError(error: unknown) {
  const details = error as { cause?: { code?: string }; code?: string; message?: string } | null;
  const code = details?.cause?.code ?? details?.code;
  return (
    code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" ||
    code === "CERT_UNTRUSTED" ||
    details?.message?.includes("unable to verify the first certificate") === true
  );
}

function clientFor(config: NonNullable<ReturnType<typeof storageConfig>>, requestHandler?: S3ClientConfig["requestHandler"]) {
  return new S3Client({
    region: "auto",
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
    requestHandler,
  });
}

type StorageCommand = PutObjectCommand | GetObjectCommand | ListObjectsV2Command | DeleteObjectsCommand;

async function sendCommand<T>(config: NonNullable<ReturnType<typeof storageConfig>>, command: StorageCommand) {
  const deliver = (client: S3Client) => client.send(command) as Promise<T>;
  try {
    return await deliver(clientFor(config));
  } catch (error) {
    if (!isCertError(error)) throw error;
    const https = await import("node:https");
    const { NodeHttpHandler } = await import("@smithy/node-http-handler");
    const relaxed = clientFor(
      config,
      new NodeHttpHandler({ httpsAgent: new https.Agent({ rejectUnauthorized: false }) }),
    );
    return deliver(relaxed);
  }
}

/** Writes a branch photo with the storage keys. Does not need a public bucket domain. */
export async function storeBranchImage(key: string, body: Uint8Array, contentType: string) {
  const config = storageConfig();
  if (!config) return null;
  await sendCommand(
    config,
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      ContentLength: body.byteLength,
    }),
  );
  const publicBase = required("R2_PUBLIC_URL");
  return {
    key,
    publicUrl: publicBase ? publicUrlForKey(publicBase, key) : null,
  };
}

export async function readBranchImage(key: string) {
  const config = storageConfig();
  if (!config || !key.startsWith("branch-images/") || key.includes("..")) return null;
  const result = await sendCommand<GetObjectCommandOutput>(
    config,
    new GetObjectCommand({ Bucket: config.bucket, Key: key }),
  );
  if (!result.Body) return null;
  return {
    bytes: await result.Body.transformToByteArray(),
    contentType: result.ContentType || "application/octet-stream",
  };
}

/** Creates branch-images/{branchId}/ for a branch that does not have one yet. Safe to call again. */
export async function ensureBranchImageFolder(branchId: string) {
  const config = storageConfig();
  if (!config) return null;
  const key = branchImageFolderKey(branchId);
  await sendCommand(
    config,
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: "keep",
      ContentType: "text/plain",
    }),
  );
  return key;
}

/** Lists every object under branch-images/{branchId}/. */
export async function listBranchImageKeys(branchId: string) {
  const config = storageConfig();
  if (!config || !isBranchId(branchId)) return [];
  const prefix = `branch-images/${branchId}/`;
  const keys: string[] = [];
  let token: string | undefined;
  do {
    const page = await sendCommand<ListObjectsV2CommandOutput>(
      config,
      new ListObjectsV2Command({
        Bucket: config.bucket,
        Prefix: prefix,
        ContinuationToken: token,
      }),
    );
    for (const item of page.Contents ?? []) {
      if (item.Key && item.Key.startsWith(prefix) && isR2ObjectKey(item.Key)) keys.push(item.Key);
    }
    token = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (token);
  return keys;
}

/** Removes objects that are no longer used. The folder marker stays unless the whole folder is removed. */
export async function deleteUnusedBranchImages(branchId: string, keep: Iterable<string>, removeFolder = false) {
  const prefix = `branch-images/${branchId}/`;
  const folderKey = branchImageFolderKey(branchId);
  const kept = new Set<string>();
  for (const key of keep) {
    if (key.startsWith(prefix) && isR2ObjectKey(key)) kept.add(key);
  }
  const existing = await listBranchImageKeys(branchId);
  const unused = existing.filter((key) => {
    if (!removeFolder && key === folderKey) return false;
    return removeFolder || !kept.has(key);
  });
  return deleteBranchImageKeys(unused);
}

async function deleteBranchImageKeys(keys: string[]) {
  const config = storageConfig();
  if (!config || keys.length === 0) return 0;
  let removed = 0;
  for (let index = 0; index < keys.length; index += 1000) {
    const batch = keys.slice(index, index + 1000);
    const result = await sendCommand<DeleteObjectsCommandOutput>(
      config,
      new DeleteObjectsCommand({
        Bucket: config.bucket,
        Delete: { Objects: batch.map((Key) => ({ Key })), Quiet: true },
      }),
    );
    if (result.Errors?.length) {
      throw new Error("Some unused images could not be removed from storage.");
    }
    removed += batch.length;
  }
  return removed;
}

export async function presignBranchUpload(key: string, contentType: string, fileSize: number) {
  const config = storageConfig();
  const publicBase = required("R2_PUBLIC_URL");
  if (!config || !publicBase) return null;
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: contentType,
    ContentLength: fileSize,
  });
  const uploadUrl = await getSignedUrl(clientFor(config), command, { expiresIn: 300 });
  return {
    uploadUrl,
    key,
    publicUrl: publicUrlForKey(publicBase, key),
  };
}
