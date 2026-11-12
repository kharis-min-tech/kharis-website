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
] as const;

export type MediaFolder = (typeof MEDIA_FOLDERS)[number];

export const MAX_MEDIA_IMAGE_BYTES = 8 * 1024 * 1024;
// Cloudflare Workers reject request bodies over 100MB on the Free and Pro plans.
export const MAX_MEDIA_VIDEO_BYTES = 95 * 1024 * 1024;

export const MEDIA_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;
export const MEDIA_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"] as const;

export function isMediaFolder(value: string): value is MediaFolder {
  return (MEDIA_FOLDERS as readonly string[]).includes(value);
}

export function isMediaContentType(value: string) {
  return (
    (MEDIA_IMAGE_TYPES as readonly string[]).includes(value) ||
    (MEDIA_VIDEO_TYPES as readonly string[]).includes(value)
  );
}

export function isVideoContentType(value: string) {
  return (MEDIA_VIDEO_TYPES as readonly string[]).includes(value);
}

export function isMediaObjectKey(key: string | null | undefined): key is `site-media/${string}` {
  return Boolean(key?.startsWith(MEDIA_PREFIX) && !key.includes(".."));
}

export function safeMediaName(name: string) {
  return name.replace(/[^\w.-]+/g, "_").slice(0, 80) || "file";
}

export function mediaObjectKey(folder: MediaFolder, fileName: string) {
  return `${MEDIA_PREFIX}${folder}/${crypto.randomUUID()}-${safeMediaName(fileName)}`;
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
