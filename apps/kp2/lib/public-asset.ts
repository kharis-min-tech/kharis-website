/** `public/` is served under basePath, so `/assets/x` is `/kp2/assets/x`. */
export function publicAsset(url: string): string {
  if (/^https?:\/\//i.test(url) || url.startsWith("/kp2/")) return url;
  const file = url.match(/\/assets\/([^?#]+)/i);
  if (file && !/assets\/design\//i.test(url)) return `/kp2/assets/${file[1]}`;
  if (url.startsWith("/")) return `/kp2${url}`;
  return url;
}

/** Content-studio image. Remote and R2 URLs win. Placeholder `assets/...` paths do not. */
export function studioImage(url: string | null | undefined): string | null {
  const value = url?.trim();
  if (!value || /instagram\.com/i.test(value)) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("branch-images/")) {
    const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "");
    return base ? `${base}/${value}` : null;
  }
  if (/^assets\//i.test(value) || /\/assets\/design\//i.test(value)) return null;
  const resolved = publicAsset(value);
  return resolved.startsWith("/kp2/assets/") || resolved.startsWith("http") ? resolved : null;
}
