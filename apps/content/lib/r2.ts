import { GetObjectCommand, PutObjectCommand, S3Client, type GetObjectCommandOutput, type S3ClientConfig } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { branchImageFolderKey, publicUrlForKey } from "@/lib/branch-image-paths";

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

async function sendCommand<T>(config: NonNullable<ReturnType<typeof storageConfig>>, command: PutObjectCommand | GetObjectCommand) {
  const deliver = (client: S3Client) => client.send(command as PutObjectCommand) as Promise<T>;
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
