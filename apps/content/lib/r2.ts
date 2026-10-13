import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  branchImageFolderKey,
  isBranchId,
  isR2ObjectKey,
  publicUrlForKey,
} from "@/lib/branch-image-paths";

/**
 * Branch images are stored in the `kharis-images` R2 bucket, bound to this
 * Worker as `BUCKET` (see wrangler.jsonc). There are no S3 access keys: every
 * call goes through the native binding, and images are served back to the
 * browser through /api/media/[...key]. Saved addresses use R2_PUBLIC_URL
 * (https://images.kharis.org) when that host is set.
 */

// Structural type for the subset of the R2 binding we use. Kept local so the
// build does not depend on generated Workers types being present.
interface R2BucketLike {
  put(
    key: string,
    value: Uint8Array | ArrayBuffer | string,
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

/** The bound bucket, or null when the binding is unavailable (e.g. misconfigured dev). */
function bucket(): R2BucketLike | null {
  try {
    const env = getCloudflareContext().env as unknown as { BUCKET?: R2BucketLike };
    return env.BUCKET ?? null;
  } catch {
    return null;
  }
}

/** Writes a branch photo to R2. The upload route attaches the public address. */
export async function storeBranchImage(key: string, body: Uint8Array, contentType: string) {
  const store = bucket();
  if (!store) return null;
  await store.put(key, body, { httpMetadata: { contentType } });
  return {
    key,
    publicUrl: null,
  };
}

export async function readBranchImage(key: string) {
  const store = bucket();
  if (!store || !key.startsWith("branch-images/") || key.includes("..")) return null;
  const object = await store.get(key);
  if (!object) return null;
  return {
    bytes: new Uint8Array(await object.arrayBuffer()),
    contentType: object.httpMetadata?.contentType || "application/octet-stream",
  };
}

/** Creates branch-images/{branchId}/ for a branch that does not have one yet. Safe to call again. */
export async function ensureBranchImageFolder(branchId: string) {
  const store = bucket();
  if (!store) return null;
  const key = branchImageFolderKey(branchId);
  await store.put(key, "keep", { httpMetadata: { contentType: "text/plain" } });
  return key;
}

/** Lists every object under branch-images/{branchId}/. */
export async function listBranchImageKeys(branchId: string) {
  const store = bucket();
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
  const store = bucket();
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
