# Website images

Upload new or replacement website pictures to the existing Cloudflare R2 `kharis-images` bucket and reference their `https://images.kharis.org/` URLs in application code. Use descriptive filenames and the existing content-hashed object key convention. Verify the public image before switching the source URL, and update the corresponding `site-image-urls.json` mapping.

For uploads, read `docs/performance/picture-migration.md` and use the existing upload helpers in `scripts/migrate-site-images.mjs`. Keep credentials in ignored environment files. Local originals may remain as migration or rollback inputs; published photo references must use Cloudflare URLs.
