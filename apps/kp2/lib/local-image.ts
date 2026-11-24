/**
 * Studio-saved media URL when present, otherwise the hardcoded CDN fallback.
 * Remote https URLs and site-media keys are accepted as stored.
 */
export function studioImage(url: string | null | undefined): string | null {
  const value = url?.trim();
  if (!value || /instagram\.com/i.test(value)) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("site-media/") || value.startsWith("branch-images/")) {
    const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "");
    return base ? `${base}/${value}` : null;
  }
  return null;
}

export function localImage(url: string | null | undefined, fallback: string) {
  return studioImage(url) ?? fallback;
}
