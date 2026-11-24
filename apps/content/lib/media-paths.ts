import { isBranchId } from "./branch-image-paths";

/**
 * Studio uploads that are not branch photos (videos, announcement, sermon,
 * testimony and event pictures). They live in the same `kharis-images` R2
 * bucket as branch photos, under their own prefix.
 */
export const MEDIA_PREFIX = "site-media/";

export const MEDIA_FOLDERS = [
  "department-videos",
  "branch-videos",
  "videos",
  "news",
  "sermons",
  "testimonies",
  "events",
  "uploads",
  "documents",
  "plans",
  "site-contents",
] as const;

export type MediaFolder = (typeof MEDIA_FOLDERS)[number];

/**
 * Folders whose uploads can belong to one branch, stored as
 * site-media/{folder}/{branchId}/… so a branch admin can manage them.
 * Every other folder, and older keys without a branch, are super admin only.
 */
export const BRANCH_MEDIA_FOLDERS = ["branch-videos", "events"] as const;

export const MAX_MEDIA_IMAGE_BYTES = 8 * 1024 * 1024;
// Cloudflare Workers reject request bodies over 100MB on the Free and Pro plans.
export const MAX_MEDIA_VIDEO_BYTES = 95 * 1024 * 1024;
export const MAX_MEDIA_DOCUMENT_BYTES = 20 * 1024 * 1024;

export const MEDIA_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;
export const MEDIA_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"] as const;
export const MEDIA_DOCUMENT_TYPES = ["application/pdf"] as const;

export function isMediaFolder(value: string): value is MediaFolder {
  return (MEDIA_FOLDERS as readonly string[]).includes(value);
}

export function isBranchMediaFolder(value: string) {
  return (BRANCH_MEDIA_FOLDERS as readonly string[]).includes(value);
}

export function isMediaContentType(value: string) {
  return (
    (MEDIA_IMAGE_TYPES as readonly string[]).includes(value) ||
    (MEDIA_VIDEO_TYPES as readonly string[]).includes(value) ||
    (MEDIA_DOCUMENT_TYPES as readonly string[]).includes(value)
  );
}

export function isVideoContentType(value: string) {
  return (MEDIA_VIDEO_TYPES as readonly string[]).includes(value);
}

export function isDocumentContentType(value: string) {
  return (MEDIA_DOCUMENT_TYPES as readonly string[]).includes(value);
}

export function isMediaObjectKey(key: string | null | undefined): key is `site-media/${string}` {
  return Boolean(key?.startsWith(MEDIA_PREFIX) && !key.includes(".."));
}

export function safeMediaName(name: string) {
  return name.replace(/[^\w.-]+/g, "_").slice(0, 80) || "file";
}

/** UTC year-month nest so flat folder dumps stay browsable in R2. */
export function mediaMonthScope(date = new Date()) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Object key under site-media/. Layout (left → right):
 *   site-media/{folder}/[{branchId}/]{subfolder|YYYY-MM}/{uuid}-{safeFileName}
 * Branch-scoped folders put the branch id next. An explicit subfolder (e.g. a
 * department name) is preferred; otherwise a YYYY-MM month folder is used so
 * every upload has a readable nest. Segments are sanitised so ".." cannot escape.
 */
export function mediaObjectKey(
  folder: MediaFolder,
  fileName: string,
  branchId?: string | null,
  subfolder?: string | null,
) {
  const branchScope =
    branchId && isBranchMediaFolder(folder) && isBranchId(branchId) ? `${branchId}/` : "";
  const nest = (subfolder ?? "")
    .split("/")
    .map((segment) => safeMediaName(segment))
    .filter((segment) => segment && segment !== "file")
    .join("/");
  const nestedScope = nest ? `${nest}/` : `${mediaMonthScope()}/`;
  return `${MEDIA_PREFIX}${folder}/${branchScope}${nestedScope}${crypto.randomUUID()}-${safeMediaName(fileName)}`;
}

/** The branch a site-media key was uploaded for, or null when it has none. */
export function branchIdFromMediaKey(key: string | null | undefined) {
  if (!isMediaObjectKey(key)) return null;
  const [folder, branchId, name] = key.slice(MEDIA_PREFIX.length).split("/");
  if (!folder || !branchId || !name) return null;
  return isBranchMediaFolder(folder) && isBranchId(branchId) ? branchId : null;
}

/** Pulls site-media/... out of a saved address (https://images.kharis.org/... or /api/media/...). */
export function mediaKeyFromUrl(url: string | null | undefined) {
  if (!url) return null;
  if (isMediaObjectKey(url)) return url.split("?")[0] ?? null;
  const index = url.indexOf(MEDIA_PREFIX);
  if (index === -1) return null;
  const key = decodeURIComponent(url.slice(index).split(/[?#]/)[0] ?? "");
  return isMediaObjectKey(key) ? key : null;
}
