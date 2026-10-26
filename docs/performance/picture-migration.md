# Site pictures in Cloudflare R2

The migration uses the existing EU `kharis-images` bucket and its public host `https://images.kharis.org`. Current source inventory: 167 main-site pictures (including video posters) and 105 KP2 pictures, 149.9 MiB combined. Videos and the unused original app-screen canvases are excluded.

Objects use `site-images/main/<content-hash>/<relative-path>` and `site-images/kp2/<content-hash>/<relative-path>`. Existing branch uploads under `branch-images/` are untouched. Each upload has its original MIME type and immutable, year-long cache headers. Content hashes prevent replacing existing different pictures.

Use a bucket-scoped R2 S3 token with Object Read & Write access only to `kharis-images`. Store `R2_ENDPOINT` (the EU S3 endpoint without a bucket suffix), `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET=kharis-images` and `R2_PUBLIC_URL=https://images.kharis.org` in the ignored root `.env.r2.local` file. Never commit credentials.

See [Cloudflare's S3 credential instructions](https://developers.cloudflare.com/r2/get-started/s3/).

```sh
node scripts/migrate-site-images.mjs
node --env-file=.env.r2.local scripts/migrate-site-images.mjs --upload
node --env-file=.env.r2.local scripts/migrate-site-images.mjs --apply
node --test scripts/migrate-site-images.test.mjs
```

The first command inventories local pictures without network or source changes. Uploads resume by checking each content-addressed object. Both upload and apply verify each public URL's MIME type and SHA-256 checksum. Apply checks every picture before rewriting any source paths, including CSS and KP2 base-path references. Local originals are retained for rollback. The script does not deploy the site or alter bucket policies.

Rebuilding the mapping preserves legacy paths that intentionally select replacement photographs. For example, a saved testimony image path can continue to resolve to the selected KP2 photograph instead of reverting to its older local original. Newly generated photography paths must also resolve through the image mapping.

## Completed migration

The original 122 objects were uploaded to the existing EU bucket and their public content types and SHA-256 checksums verified. Source references across 54 files were switched to the public Cloudflare URLs. A generated image mapping also resolves legacy picture paths saved in Content Studio. Browser checks confirmed main-site photos and KP2 photos loaded from images.kharis.org. Public R2 credentials stay in the ignored local environment file with mode 600.

## KP2 photography and Life follow-up

All 272 pictures in the current local inventory were uploaded or found already present in the existing EU bucket, then verified through `images.kharis.org` using their MIME types and SHA-256 checksums. This includes all 38 selected KP2 KOffice photographs, baptism photos, and the children’s illustrations. The refreshed bucket-scoped credentials remain in the ignored `.env.r2.local` file with mode 600.

Source references and both image mappings use the verified Cloudflare URLs. Legacy aliases continue to select the replacement photographs, and the KP2 photography helper resolves its generated paths through the mapping. Local originals remain as rollback inputs. Third-party video and recording thumbnail URLs retain their existing providers.
