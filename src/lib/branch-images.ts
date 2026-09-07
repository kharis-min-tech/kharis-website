export const FALLBACK_BRANCH_IMAGE = "/images/branch-slide-1.jpg";
export const FALLBACK_PASTOR_IMAGE = "/images/community.jpg";

const BRANCH_IMAGE_FALLBACKS = [
  "/images/branch-slide-1.jpg",
  "/images/branch-slide-2.jpg",
  "/images/branch-slide-3.jpg",
  "/images/branch-slide-4.jpg",
  "/images/branch-slide-5.jpg",
  "/images/worship.jpg",
  "/images/community.jpg",
] as const;

export function isMissingImage(url?: string | null): boolean {
  const value = url?.trim();
  if (!value) return true;
  const path = value.replace(/^https?:\/\/[^/]+/i, "").replace(/^\//, "");
  if (path.startsWith("assets/")) return true;
  return false;
}

function pickFallback(seed = ""): string {
  if (!seed) return FALLBACK_BRANCH_IMAGE;
  const index =
    [...seed].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) %
    BRANCH_IMAGE_FALLBACKS.length;
  return BRANCH_IMAGE_FALLBACKS[index] ?? FALLBACK_BRANCH_IMAGE;
}

/** Use a real photo when the branch has one; otherwise a church dummy image. */
export function withBranchImage(
  url?: string | null,
  seed = "",
): string {
  if (isMissingImage(url)) return pickFallback(seed);
  return url!.trim();
}

export function withPastorImage(url?: string | null): string {
  if (isMissingImage(url)) return FALLBACK_PASTOR_IMAGE;
  return url!.trim();
}
