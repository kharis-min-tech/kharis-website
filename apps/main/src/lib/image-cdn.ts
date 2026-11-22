/**
 * Cloudflare image transforms for the pictures on images.kharis.org.
 *
 * WHY THIS EXISTS
 * ---------------
 * Most pictures on the site go through `next/image`, which resizes them. A
 * handful of places cannot: the Life tunnel hands plain URLs to a vendored
 * WebGL-ish carousel, and the activity sheet draws its gallery with plain
 * `<img>` because it needs to swap `src` on a carousel without React
 * remounting an optimised wrapper each time.
 *
 * Those places were serving the full-resolution upload whatever size they
 * drew it at. The cost was not bytes so much as memory: a browser decodes a
 * JPEG to uncompressed RGBA regardless of the box it ends up in, so a
 * 2000x1333 photograph is 10.2MB of bitmap even as a 76px thumbnail. The
 * activity sheet renders seventeen of those at once, and the tunnel holds
 * eighteen more behind it, which is how a phone ended up holding ~230MB of
 * decoded images and being killed for it.
 *
 * Transforms are enabled on the images.kharis.org zone, so asking for a width
 * is all it takes. `format=auto` also hands back AVIF or WebP by Accept
 * header, so these paths get the modern formats that `next/image` gives
 * everywhere else.
 *
 * WHAT IT DELIBERATELY DOES NOT DO
 * --------------------------------
 * Anything that is not an images.kharis.org URL comes back untouched: local
 * `/images/...` paths in development, YouTube thumbnails, Supabase uploads.
 * Transforms only exist on that one zone, and a `/cdn-cgi/image/` prefix on
 * any other host is a 404, so silently passing through is the only safe
 * behaviour. A URL that already carries a transform is left alone too, so
 * calling this twice cannot nest one inside another.
 */

/** The only host with transforms enabled. */
const TRANSFORM_HOST = "https://images.kharis.org/";

/** Cloudflare already rejects anything outside 1..100; this keeps us inside it. */
const clampQuality = (q: number) => Math.min(100, Math.max(1, Math.round(q)));

export type CdnImageOptions = {
  /** Rendered width in CSS pixels. Pass the real drawn width, not the source's. */
  width?: number;
  /**
   * Rendered height. Only meaningful with `fit: "cover"`, which needs both
   * sides to know what box it is cropping to - a `cover` with width alone
   * behaves no differently from `scale-down`.
   */
  height?: number;
  /** Defaults to 80, matching SiteImage. */
  quality?: number;
  /**
   * `scale-down` is the default on purpose: it never enlarges a picture past
   * its own resolution, so asking for a width larger than the original costs
   * nothing and returns the original rather than an upscaled blur.
   */
  fit?: "scale-down" | "contain" | "cover";
  /** 1-250. Only worth it for something already being blurred in CSS. */
  blur?: number;
};

/**
 * A transformed URL for a picture on images.kharis.org, or `src` unchanged
 * when it is not one (or already carries a transform).
 */
export function cdnImage(src: string, options: CdnImageOptions = {}): string {
  if (!src.startsWith(TRANSFORM_HOST)) return src;
  if (src.includes("/cdn-cgi/image/")) return src;

  const { width, height, quality = 80, fit = "scale-down", blur } = options;

  const params = [`quality=${clampQuality(quality)}`, `fit=${fit}`, "format=auto"];
  if (height) params.unshift(`height=${Math.round(height)}`);
  if (width) params.unshift(`width=${Math.round(width)}`);
  if (blur) params.push(`blur=${Math.min(250, Math.max(1, Math.round(blur)))}`);

  const path = src.slice(TRANSFORM_HOST.length);
  return `${TRANSFORM_HOST}cdn-cgi/image/${params.join(",")}/${path}`;
}

/**
 * A `srcSet` across the given widths, for an `<img>` that also carries
 * `sizes`. Returns "" for a URL that cannot be transformed, which is also
 * what an `<img>` wants in that case - an empty srcSet is ignored, so the
 * plain `src` is used.
 */
export function cdnSrcSet(
  src: string,
  widths: readonly number[],
  options: Omit<CdnImageOptions, "width"> = {},
): string {
  if (!src.startsWith(TRANSFORM_HOST) || src.includes("/cdn-cgi/image/")) return "";
  return widths.map((w) => `${cdnImage(src, { ...options, width: w })} ${w}w`).join(", ");
}
