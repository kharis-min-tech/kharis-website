/**
 * Upload curated Site Contents guide stills to R2.
 *
 * Reads R2_* from apps/content/.env.local (or process env).
 * Usage:
 *   node scripts/upload-site-content-guides.mjs
 *   node scripts/upload-site-content-guides.mjs --dir tmp/site-content-guides
 */
import { createHash } from "node:crypto";
import { readdir, readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function loadEnvFile(filePath) {
  try {
    const text = await readFile(filePath, "utf8");
    for (const line of text.split(/\r?\n/)) {
      if (!line || line.trim().startsWith("#")) continue;
      const index = line.indexOf("=");
      if (index === -1) continue;
      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim();
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // optional
  }
}

await loadEnvFile(path.join(root, "apps/content/.env.local"));
await loadEnvFile(path.join(root, ".env.r2.local"));

const dirFlag = process.argv.indexOf("--dir");
const guidesDir =
  dirFlag >= 0 && process.argv[dirFlag + 1]
    ? path.resolve(process.argv[dirFlag + 1])
    : path.join(root, "tmp", "site-content-guides");

const bucket = process.env.R2_BUCKET_NAME || process.env.R2_BUCKET || "kharis-images";
const endpoint = (process.env.R2_ENDPOINT || "").replace(/\/$/, "");
const publicUrl = (process.env.R2_PUBLIC_URL || "https://images.kharis.org").replace(/\/$/, "");
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

if (!endpoint || !accessKeyId || !secretAccessKey) {
  throw new Error(
    "Set R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY (apps/content/.env.local).",
  );
}

await access(guidesDir);

const files = (await readdir(guidesDir)).filter((name) => /\.(png|jpe?g|webp)$/i.test(name));
if (!files.length) throw new Error(`No images in ${guidesDir}`);

const client = new S3Client({
  region: "auto",
  endpoint,
  credentials: { accessKeyId, secretAccessKey },
  maxAttempts: 3,
});

const mapping = {};

for (const file of files) {
  const body = await readFile(path.join(guidesDir, file));
  const hash = createHash("sha256").update(body).digest("hex").slice(0, 16);
  const base = file.replace(/\.[^.]+$/, "");
  const [workspace, page, section] = base.split("__");
  if (!workspace || !page || !section) {
    console.warn(`Skip unexpected name (want workspace__page__section.ext): ${file}`);
    continue;
  }
  const ext = path.extname(file).toLowerCase().replace(".", "") || "jpg";
  const contentType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  const key = `site-media/site-contents/guides/${workspace}/${page}-${section}-${hash}.${ext}`;
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  const url = `${publicUrl}/${key}`;
  mapping[`${workspace}/${page}/${section}`] = url;
  console.log(`Uploaded ${file} -> ${url}`);
}

console.log(JSON.stringify(mapping, null, 2));
client.destroy();
