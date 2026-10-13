/** Keep in sync with `basePath` in next.config.mjs. */
export const BASE_PATH = "/kp2";

/** Prefix a root-relative public URL with the app base path. */
export function withBasePath(path: string) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === BASE_PATH || normalized.startsWith(`${BASE_PATH}/`)) {
    return normalized;
  }
  return `${BASE_PATH}${normalized}`;
}
