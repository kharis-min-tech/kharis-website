/**
 * Uploads public/screenshots to the kharis-images R2 bucket and records their
 * images.kharis.org URLs in .vitepress/screenshot-urls.json.
 *
 * Dry run: node docs/scripts/upload-screenshots.mjs
 * Upload:  npm run screenshots:upload   (from apps/content)
 */
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { uploadImages } from "../../../../scripts/migrate-site-images.mjs";

const docs = fileURLToPath(new URL("../", import.meta.url));
const directory = resolve(docs, "public/screenshots");
const mappingFile = resolve(docs, ".vitepress/screenshot-urls.json");
const types = { ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp" };

async function inventory() {
  const names = (await readdir(directory)).filter((name) => types[extname(name).toLowerCase()]);
  const images = [];
  for (const name of names.sort()) {
    const file = resolve(directory, name);
    const data = await readFile(file);
    const hash = createHash("sha256").update(data).digest("hex");
    const key = `site-images/content-docs/${hash.slice(0, 16)}/screenshots/${name}`;
    images.push({
      app: "content-docs",
      file,
      source: `/screenshots/${name}`,
      key,
      hash,
      bytes: data.length,
      contentType: types[extname(name).toLowerCase()],
      url: `https://images.kharis.org/${key.split("/").map(encodeURIComponent).join("/")}`,
    });
  }
  return images;
}

const images = await inventory();
const megabytes = images.reduce((sum, image) => sum + image.bytes, 0) / 1024 / 1024;
console.log(`${images.length} screenshots, ${megabytes.toFixed(1)} MiB`);

if (process.argv.includes("--upload")) {
  await uploadImages(images);
  const mapping = Object.fromEntries(images.map((image) => [image.source, image.url]));
  await writeFile(mappingFile, `${JSON.stringify(mapping, null, 2)}\n`);
  console.log(`Wrote ${Object.keys(mapping).length} URLs to .vitepress/screenshot-urls.json`);
}
