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

/** Object key only. R2 has no real folders; the slashes are part of the key. */
export function branchImageObjectKey(branchId: string, category: BranchImageCategory, contentType: BranchImageContentType) {
  const extension = BRANCH_IMAGE_TYPES[contentType];
  return `branch-images/${branchId}/${category}/${crypto.randomUUID()}.${extension}`;
}

export function publicUrlForKey(publicBase: string, key: string) {
  return `${publicBase.replace(/\/$/, "")}/${key}`;
}

export function isR2ObjectKey(path: string | null | undefined) {
  return Boolean(path?.startsWith("branch-images/"));
}
