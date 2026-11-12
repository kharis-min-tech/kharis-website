import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  branchImageFolderKey,
  isBranchId,
  isR2ObjectKey,
  publicUrlForKey,
} from "@/lib/branch-image-paths";
import { isMediaObjectKey } from "@/lib/media-paths";

/**
 * Studio uploads are stored in the `kharis-images` R2 bucket. On Cloudflare
 * Workers it is bound as `BUCKET` (see wrangler.jsonc); during local dev it
 * falls back to the S3-compatible R2 env vars when `BUCKET` is absent. Saved
 * addresses use R2_PUBLIC_URL (https://images.kharis.org) when configured.
 */

// Structural type for the subset of the R2 binding we use. Kept local so the
// build does not depend on generated Workers types being present.
interface R2BucketLike {
  put(
    key: string,
    value: Uint8Array | ArrayBuffer | string | ReadableStream,
    options?: { httpMetadata?: { contentType?: string } },
  ): Promise<unknown>;
  get(key: string): Promise<{
    arrayBuffer(): Promise<ArrayBuffer>;
    httpMetadata?: { contentType?: string };
  } | null>;
  delete(keys: string | string[]): Promise<void>;
  list(options?: {
    prefix?: string;
    cursor?: string;
  }): Promise<{ objects: Array<{ key: string }>; truncated: boolean; cursor?: string }>;
}

/** Custom domain for stored image addresses. Empty in local dev falls back to /api/media. */
export function branchImagePublicUrl(key: string, fallbackOrigin?: string) {
  const configured = process.env.R2_PUBLIC_URL?.trim() || cloudflarePublicUrl();
  const base = configured.replace(/\/$/, "");
  if (base) return publicUrlForKey(base, key);
  if (!fallbackOrigin) return null;
  return `${fallbackOrigin.replace(/\/$/, "")}/api/media/${key}`;
}

function cloudflarePublicUrl() {
  try {
    const env = getCloudflareContext().env as unknown as { R2_PUBLIC_URL?: string };
    return env.R2_PUBLIC_URL?.trim() ?? "";
  } catch {
    return "";
  }
}

function nativeBucket(): R2BucketLike | null {
  try {
    const env = getCloudflareContext().env as unknown as { BUCKET?: R2BucketLike };
    return env.BUCKET ?? null;
  } catch {
    return null;
  }
}

async function s3BucketFallback(): Promise<R2BucketLike | null> {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const endpoint =
    process.env.R2_ENDPOINT?.trim() ||
    (accountId ? `https://${accountId}.eu.r2.cloudflarestorage.com` : "");
  const Bucket = process.env.R2_BUCKET_NAME?.trim() || "kharis-images";
  if (!accessKeyId || !secretAccessKey || !endpoint) return null;

  const {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    DeleteObjectsCommand,
    ListObjectsV2Command,
  } = await import("@aws-sdk/client-s3");

  const client = new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });

  return {
    async put(key, value, options) {
      const Body =
        typeof value === "string"
          ? value
          : value instanceof Uint8Array
            ? value
            : value instanceof ArrayBuffer
              ? new Uint8Array(value)
              : new Uint8Array(await new Response(value).arrayBuffer());
      await client.send(
        new PutObjectCommand({
          Bucket,
          Key: key,
          Body,
          ContentType: options?.httpMetadata?.contentType,
        }),
      );
    },
    async get(key) {
      try {
        const res = await client.send(new GetObjectCommand({ Bucket, Key: key }));
        if (!res.Body) return null;
        const bytes = await res.Body.transformToByteArray();
        return {
          async arrayBuffer() {
            return bytes.buffer.slice(
              bytes.byteOffset,
              bytes.byteOffset + bytes.byteLength,
            ) as ArrayBuffer;
          },
          httpMetadata: { contentType: res.ContentType },
        };
      } catch {
        return null;
      }
    },
    async delete(keys) {
      const list = Array.isArray(keys) ? keys : [keys];
      if (list.length === 0) return;
      if (list.length === 1) {
        await client.send(new DeleteObjectCommand({ Bucket, Key: list[0] }));
        return;
      }
      await client.send(
        new DeleteObjectsCommand({
          Bucket,
          Delete: { Objects: list.map((Key) => ({ Key })) },
        }),
      );
    },
    async list(options) {
      const res = await client.send(
        new ListObjectsV2Command({
          Bucket,
          Prefix: options?.prefix,
          ContinuationToken: options?.cursor,
        }),
      );
      return {
        objects: (res.Contents ?? []).flatMap((item) => (item.Key ? [{ key: item.Key }] : [])),
        truncated: Boolean(res.IsTruncated),
        cursor: res.NextContinuationToken,
      };
    },
  };
}

/** The bound bucket, or S3 credentials fallback during local dev. */
async function bucket(): Promise<R2BucketLike | null> {
  return nativeBucket() ?? (await s3BucketFallback());
}

/** Writes a branch photo to R2. The upload route attaches the public address. */
export async function storeBranchImage(key: string, body: Uint8Array, contentType: string) {
  const store = await bucket();
  if (!store) return null;
  await store.put(key, body, { httpMetadata: { contentType } });
  return {
    key,
    publicUrl: null,
  };
}

/** Writes a studio video or picture to R2 under site-media/. Streams, so large videos are not buffered. */
export async function storeMediaObject(
  key: string,
  body: ReadableStream | Uint8Array,
  contentType: string,
) {
  const store = await bucket();
  if (!store || !isMediaObjectKey(key)) return null;
  await store.put(key, body, { httpMetadata: { contentType } });
  return { key };
}

export async function deleteMediaObject(key: string) {
  const store = await bucket();
  if (!store || !isMediaObjectKey(key)) return false;
  await store.delete(key);
  return true;
}

export async function readBranchImage(key: string) {
  const store = await bucket();
  const allowed = key.startsWith("branch-images/") || isMediaObjectKey(key);
  if (!store || !allowed || key.includes("..")) return null;
  const object = await store.get(key);
  if (!object) return null;
  return {
    bytes: new Uint8Array(await object.arrayBuffer()),
    contentType: object.httpMetadata?.contentType || "application/octet-stream",
  };
}

/** Creates branch-images/{branchId}/ for a branch that does not have one yet. Safe to call again. */
export async function ensureBranchImageFolder(branchId: string) {
  const store = await bucket();
  if (!store) return null;
  const key = branchImageFolderKey(branchId);
  await store.put(key, "keep", { httpMetadata: { contentType: "text/plain" } });
  return key;
}

/** Lists every object under branch-images/{branchId}/. */
export async function listBranchImageKeys(branchId: string) {
  const store = await bucket();
  if (!store || !isBranchId(branchId)) return [];
  const prefix = `branch-images/${branchId}/`;
  const keys: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await store.list({ prefix, cursor });
    for (const item of page.objects ?? []) {
      if (item.key && item.key.startsWith(prefix) && isR2ObjectKey(item.key)) keys.push(item.key);
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  return keys;
}

/** Removes objects that are no longer used. The folder marker stays unless the whole folder is removed. */
export async function deleteUnusedBranchImages(
  branchId: string,
  keep: Iterable<string>,
  removeFolder = false,
) {
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
  const store = await bucket();
  if (!store || keys.length === 0) return 0;
  let removed = 0;
  // The R2 binding deletes up to 1000 keys per call.
  for (let index = 0; index < keys.length; index += 1000) {
    const batch = keys.slice(index, index + 1000);
    await store.delete(batch);
    removed += batch.length;
  }
  return removed;
}
