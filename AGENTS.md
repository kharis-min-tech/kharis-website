# Website images

Upload new or replacement website pictures to the existing Cloudflare R2 `kharis-images` bucket and reference their `https://images.kharis.org/` URLs in application code. Use descriptive filenames and the existing content-hashed object key convention. Verify the public image before switching the source URL, and update the corresponding `site-image-urls.json` mapping.

For uploads, read `docs/performance/picture-migration.md` and use the existing upload helpers in `scripts/migrate-site-images.mjs`. Keep credentials in ignored environment files. Local originals may remain as migration or rollback inputs; published photo references must use Cloudflare URLs.

## Where originals live

The main app's originals are in **`apps/main/media-originals/`**, not in `apps/main/public/`. Put new originals there.

Everything under `public/` is uploaded to Cloudflare as a static asset on every deploy, so an original kept there is deployed to serve nothing once its published reference is an `images.kharis.org` URL. That was 160MB of a 164MB `public/`. Only files actually requested at a `/images/...`, `/videos/...` or `/documents/...` path belong in `public/`.

## Resizing

Image transforms are enabled on the `images.kharis.org` zone. Use `apps/main/src/lib/image-cdn.ts` (`cdnImage`, `cdnSrcSet`) wherever a picture is drawn with a plain `<img>` rather than `next/image` — it asks Cloudflare for the size actually drawn, and `format=auto` returns AVIF or WebP. It passes through any URL not on that host untouched.

This matters more for memory than for bytes: a browser decodes to uncompressed RGBA regardless of display size, so a 2000x1333 photograph costs 10.2MB of bitmap even inside a 76px thumbnail. See `docs/performance/media-quality.md`.
