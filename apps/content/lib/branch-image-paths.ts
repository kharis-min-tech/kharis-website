export const BRANCH_IMAGE_CATEGORIES = ["hero", "gallery", "venue", "pastor"] as const;

export type BranchImageCategory = (typeof BRANCH_IMAGE_CATEGORIES)[number];

export const MAX_BRANCH_IMAGE_BYTES = 8 * 1024 * 1024;

export const BRANCH_IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
} as const;

export type BranchImageContentType = keyof typeof BRANCH_IMAGE_TYPES;

const BRANCH_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isBranchImageCategory(value: string): value is BranchImageCategory {
  return (BRANCH_IMAGE_CATEGORIES as readonly string[]).includes(value);
}

export function isBranchId(value: string) {
  return BRANCH_ID.test(value);
}

export function isBranchImageContentType(value: string): value is BranchImageContentType {
  return value in BRANCH_IMAGE_TYPES;
}

function safeBranchImageLabel(fileName: string | null | undefined) {
  const withoutExt = (fileName ?? "").replace(/\.[^.]+$/, "");
  return withoutExt.replace(/[^\w.-]+/g, "_").slice(0, 60);
}

/**
 * Object key only. R2 has no real folders; the slashes are part of the key.
 * Layout: branch-images/{branchId}/{hero|gallery|venue|pastor}/{uuid}[-label].{ext}
 */
export function branchImageObjectKey(
  branchId: string,
  category: BranchImageCategory,
  contentType: BranchImageContentType,
  fileName?: string | null,
) {
  const extension = BRANCH_IMAGE_TYPES[contentType];
  const label = safeBranchImageLabel(fileName);
  const leaf = label
    ? `${crypto.randomUUID()}-${label}.${extension}`
    : `${crypto.randomUUID()}.${extension}`;
  return `branch-images/${branchId}/${category}/${leaf}`;
}

export function publicUrlForKey(publicBase: string, key: string) {
  return `${publicBase.replace(/\/$/, "")}/${key}`;
}

export function isR2ObjectKey(path: string | null | undefined) {
  return Boolean(path?.startsWith("branch-images/") && !path.includes(".."));
}

/** Pulls branch-images/{id}/... out of a stored address. */
export function branchImageKeyFromUrl(url: string | null | undefined) {
  if (!url) return null;
  if (isR2ObjectKey(url)) return url.split(/[?#]/)[0] ?? null;
  const marker = "branch-images/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  const key = decodeURIComponent(url.slice(index).split(/[?#]/)[0] ?? "");
  return isR2ObjectKey(key) ? key : null;
}

/** Branch id from a branch-images/{id}/… key, or null when the key is not valid. */
export function branchIdFromImageKey(key: string | null | undefined) {
  if (!key || !isR2ObjectKey(key)) return null;
  const [, branchId] = key.split("/");
  return branchId && isBranchId(branchId) ? branchId : null;
}

/** Prefix marker. R2 has no folders; this object makes branch-images/{id}/ show up. */
export function branchImageFolderKey(branchId: string) {
  return `branch-images/${branchId}/.keep`;
}
