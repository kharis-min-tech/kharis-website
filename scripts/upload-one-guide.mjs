import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

async function loadEnv(filePath) {
  try {
    const text = await readFile(filePath, "utf8");
    for (const line of text.split(/\r?\n/)) {
      if (!line || line.trim().startsWith("#")) continue;
      const i = line.indexOf("=");
      if (i === -1) continue;
      const key = line.slice(0, i).trim();
      const value = line.slice(i + 1).trim();
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {}
}
await loadEnv("apps/content/.env.local");
await loadEnv(".env.r2.local");
const body = await readFile("tmp/site-content-guides/kharis__home__hero.jpg");
const hash = createHash("sha256").update(body).digest("hex").slice(0, 16);
const key = "site-media/site-contents/guides/kharis/home-hero-" + hash + ".jpg";
const client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT.replace(/\/$/, ""),
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
await client.send(
  new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME || process.env.R2_BUCKET || "kharis-images",
    Key: key,
    Body: body,
    ContentType: "image/jpeg",
    CacheControl: "public, max-age=31536000, immutable",
  }),
);
console.log("https://images.kharis.org/" + key);
client.destroy();
