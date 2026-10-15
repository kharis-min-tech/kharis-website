/**
 * Dry run: node scripts/migrate-site-images.mjs
 * Upload:  node --env-file=.env.r2.local scripts/migrate-site-images.mjs --upload
 * Switch:  node --env-file=.env.r2.local scripts/migrate-site-images.mjs --apply
 * --apply verifies every public object before changing any source URLs.
 */
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const imageTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};
const sha = (data) => createHash("sha256").update(data).digest("hex");
const apps = [
  {
    id: "main",
    publicDir: "apps/main/public/images",
    sourceDirs: ["apps/main/src"],
    localPrefix: "/images/",
  },
  {
    id: "main",
    publicDir: "apps/main/public/videos",
    sourceDirs: [],
    localPrefix: "/videos/",
  },
  {
    id: "kp2",
    publicDir: "apps/kp2/public/assets",
    sourceDirs: [
      "apps/kp2/app",
      "apps/kp2/components",
      "apps/kp2/lib",
      "apps/kp2/data",
      "apps/kp2/public",
    ],
    localPrefix: "/assets/",
  },
];
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries
      .filter((e) => !e.name.startsWith(".") && e.name !== "_original-black-canvas")
      .map((entry) => {
        const path = resolve(directory, entry.name);
        return entry.isDirectory() ? walk(path) : [path];
      }),
  );
  return files.flat().sort();
}
export async function inventory() {
  const result = [];
  for (const app of apps) {
    const directory = resolve(root, app.publicDir);
    const files = (await walk(directory)).filter((file) => imageTypes[extname(file).toLowerCase()]);
    for (const file of files) {
      const data = await readFile(file);
      const hash = sha(data);
      const path = relative(directory, file).split("\\").join("/");
      const key = `site-images/${app.id}/${hash.slice(0, 16)}/${path}`;
      result.push({
        app: app.id,
        file,
        source: app.localPrefix + path,
        key,
        hash,
        bytes: data.length,
        contentType: imageTypes[extname(file).toLowerCase()],
        url: `https://images.kharis.org/${key.split("/").map(encodeURIComponent).join("/")}`,
      });
    }
  }
  return result;
}
async function verifyPublic(image) {
  const response = await fetch(image.url, {
    signal: AbortSignal.timeout(30000),
    redirect: "error",
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Public image unavailable (${response.status}): ${image.key}`);
  const contentType = response.headers.get("content-type")?.split(";")[0];
  if (contentType !== image.contentType) throw new Error(`Incorrect Content-Type: ${image.key}`);
  if (sha(Buffer.from(await response.arrayBuffer())) !== image.hash)
    throw new Error(`Public checksum mismatch: ${image.key}`);
}
export async function uploadImages(images) {
  const endpoint = new URL(process.env.R2_ENDPOINT ?? "https://missing.invalid");
  if (
    endpoint.protocol !== "https:" ||
    !/^[a-f0-9]{32}\.eu\.r2\.cloudflarestorage\.com$/.test(endpoint.hostname) ||
    endpoint.pathname !== "/"
  ) {
    throw new Error(
      "R2_ENDPOINT must be the existing EU bucket's S3 endpoint, without a bucket path.",
    );
  }
  if (
    process.env.R2_BUCKET !== "kharis-images" ||
    process.env.R2_PUBLIC_URL !== "https://images.kharis.org"
  ) {
    throw new Error(
      "Expected R2_BUCKET=kharis-images and R2_PUBLIC_URL=https://images.kharis.org. Verify the intended church bucket first.",
    );
  }
  if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY)
    throw new Error("Run the local R2 setup wizard first.");
  // The SDK is already installed by the Cloudflare adapter's @opennextjs/aws dependency.
  const { S3Client, HeadObjectCommand, PutObjectCommand } = await import("@aws-sdk/client-s3");
  const client = new S3Client({
    region: "auto",
    endpoint: endpoint.origin,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
    maxAttempts: 3,
  });
  let completed = 0;
  // Serial uploads make failures easy to resume and avoid bursts against the bucket.
  for (const image of images) {
    let exists = false;
    try {
      const existing = await client.send(
        new HeadObjectCommand({ Bucket: "kharis-images", Key: image.key }),
      );
      if (existing.ContentLength !== image.bytes || existing.Metadata?.sha256 !== image.hash)
        throw new Error(`Existing object differs: ${image.key}`);
      exists = true;
    } catch (error) {
      if (error.$metadata?.httpStatusCode !== 404 && error.name !== "NotFound") throw error;
    }
    if (!exists) {
      await client.send(
        new PutObjectCommand({
          Bucket: "kharis-images",
          Key: image.key,
          Body: await readFile(image.file),
          ContentType: image.contentType,
          CacheControl: "public, max-age=31536000, immutable",
          Metadata: { sha256: image.hash },
          IfNoneMatch: "*",
        }),
      );
    }
    await verifyPublic(image);
    console.log(
      `${++completed}/${images.length} ${exists ? "Verified" : "Uploaded and verified"}: ${image.app}/${image.source}`,
    );
  }
  client.destroy();
}
export function replaceImageUrls(text, app, images) {
  const replacements = images
    .filter((image) => image.app === app)
    .sort((a, b) => b.source.length - a.source.length);
  let updated = text;
  for (const image of replacements) {
    const escaped = image.source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const path = app === "kp2" ? `(?:/kp2)?${escaped}` : escaped;
    // Match root-relative references, preserving existing external URLs and longer filenames.
    const pattern = new RegExp(`(^|[\\s\x22\x27\x60(=])${path}(?=$|[\\s\x22\x27\x60)?#])`, "gm");
    updated = updated.replace(pattern, (_, prefix) => prefix + image.url);
  }
  return updated;
}
export async function writeManifests(images) {
  for (const app of apps.filter((app) => app.sourceDirs.length)) {
    const output =
      app.id === "main"
        ? "apps/main/src/lib/site-image-urls.json"
        : "apps/kp2/lib/site-image-urls.json";
    const mapping = Object.fromEntries(
      images.filter((image) => image.app === app.id).map((image) => [image.source, image.url]),
    );
    await writeFile(resolve(root, output), JSON.stringify(mapping, null, 2) + "\n");
  }
}
async function applyUrls(images) {
  // Finish all remote verification before the first local file changes.
  for (const image of images) await verifyPublic(image);
  let changed = 0;
  for (const app of apps) {
    const files = new Set(
      (await Promise.all(app.sourceDirs.map((directory) => walk(resolve(root, directory))))).flat(),
    );
    for (const file of files) {
      if (
        /\.(test|spec)\./.test(file) ||
        !/\.(tsx?|css|jsx?|mjs|json)$/.test(file) ||
        file.endsWith("package.json") ||
        file.endsWith("site-image-urls.json")
      )
        continue;
      const original = await readFile(file, "utf8");
      const updated = replaceImageUrls(original, app.id, images);
      if (updated !== original) {
        await writeFile(file, updated);
        changed++;
      }
    }
  }
  await writeManifests(images);
  console.log(`Updated ${changed} source files. Original pictures remain available for rollback.`);
}
async function main() {
  const flags = new Set(process.argv.slice(2));
  if ([...flags].some((flag) => !["--upload", "--apply"].includes(flag)))
    throw new Error("Supported flags: --upload, --apply");
  const images = await inventory();
  console.log(
    `Inventory: ${images.length} pictures, ${(images.reduce((sum, image) => sum + image.bytes, 0) / 1024 / 1024).toFixed(1)} MiB, for the existing kharis-images bucket.`,
  );
  if (flags.has("--upload")) await uploadImages(images);
  if (flags.has("--apply")) await applyUrls(images);
  if (!flags.size) {
    for (const id of new Set(apps.map((app) => app.id)))
      console.log(`${id}: ${images.filter((image) => image.app === id).length} pictures`);
    console.log(
      "Dry run only. Use --upload to upload, then --apply after successful verification.",
    );
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
