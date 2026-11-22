/**
 * Re-encode the home hero's clips to the size they are actually drawn at.
 *
 * Dry run: node scripts/transcode-hero-videos.mjs
 * Upload:  node --env-file=.env.r2.local scripts/transcode-hero-videos.mjs --upload
 * Switch:  node --env-file=.env.r2.local scripts/transcode-hero-videos.mjs --apply
 *
 * WHY
 * ---
 * The clips are 7-9MB each, 720p H.264 at roughly 2 Mbps. They are painted
 * into tiles on a curved band that are a few hundred pixels wide, and they are
 * rendered muted, so most of each file is resolution and an audio track that
 * nothing can use. PanoramaCarousel already defers loading them until the row
 * is on screen and the main thread is idle; this is the other half, which is
 * making the bytes themselves smaller.
 *
 * WHAT IT DOES NOT DO
 * -------------------
 * It never overwrites a published object. Output goes to a new content-hashed
 * key, exactly like scripts/migrate-site-images.mjs, so the URLs currently in
 * hero-media.ts keep working until --apply switches them and you have seen the
 * new ones load. --apply refuses to run until every new object verifies
 * public, which is the same rule the picture migration follows.
 *
 * FINDING FFMPEG
 * --------------
 * Checked in order: $FFMPEG_PATH, the ffmpeg-static package if it happens to
 * be installed, then PATH. ffprobe likewise. Any one of those is enough.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, stat, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { uploadImages } from "./migrate-site-images.mjs";

const run = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const HERO_MEDIA = resolve(root, "apps/main/src/lib/hero-media.ts");
const WORK = resolve(root, ".transcode");

/**
 * The widest the clip is ever painted, allowing for a 2x display. The tiles
 * are a few hundred CSS pixels on the band, so this is deliberately generous;
 * the saving comes from not shipping 1280 for it.
 */
const TARGET_WIDTH = Number(process.env.HERO_VIDEO_WIDTH ?? 960);
/** Constant Rate Factor. 28 is visibly fine for a muted, moving background. */
const CRF = Number(process.env.HERO_VIDEO_CRF ?? 28);

const sha = (data) => createHash("sha256").update(data).digest("hex");

async function which(name, pkg) {
  const fromEnv = process.env[`${name.toUpperCase()}_PATH`];
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  try {
    const mod = await import(pkg);
    const p = typeof mod.default === "string" ? mod.default : mod.default?.path || mod.path;
    if (p && existsSync(p)) return p;
  } catch {
    /* package not installed, fall through to PATH */
  }
  try {
    await run(name, ["-version"]);
    return name;
  } catch {
    return null;
  }
}

/** The video entries in hero-media.ts, in file order. */
async function heroVideos() {
  const text = await readFile(HERO_MEDIA, "utf8");
  const urls = [...text.matchAll(/type:\s*"video",\s*\n\s*src:\s*"([^"]+)"/g)].map((m) => m[1]);
  if (!urls.length) throw new Error("No video entries found in hero-media.ts");
  return [...new Set(urls)];
}

const nameOf = (url) => decodeURIComponent(url.split("/").pop());

async function download(url, file) {
  if (existsSync(file)) return;
  const res = await fetch(url, { redirect: "error" });
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
}

async function probe(ffprobe, file) {
  const { stdout } = await run(ffprobe, [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height,bit_rate,avg_frame_rate",
    "-show_entries",
    "format=duration,size",
    "-of",
    "json",
    file,
  ]);
  const json = JSON.parse(stdout);
  const v = json.streams?.[0] ?? {};
  return {
    width: v.width,
    height: v.height,
    fps: v.avg_frame_rate,
    duration: Number(json.format?.duration ?? 0),
    bytes: Number(json.format?.size ?? 0),
  };
}

async function encode(ffmpeg, input, output, width) {
  /* -an drops the audio track: every one of these is rendered muted, so the
     audio is bytes nothing can ever play.
     scale=...:-2 keeps the aspect and forces an even height, which H.264
     requires.
     +faststart moves the moov atom to the front so the browser can begin
     playing before the whole file has arrived. */
  await run(
    ffmpeg,
    [
      "-y",
      "-i",
      input,
      "-an",
      "-vf",
      `scale=${width}:-2:flags=lanczos`,
      "-c:v",
      "libx264",
      "-profile:v",
      "high",
      "-crf",
      String(CRF),
      "-preset",
      "slow",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      output,
    ],
    { maxBuffer: 1 << 26 },
  );
}

const mb = (n) => (n / 1048576).toFixed(2) + " MB";

async function main() {
  const upload = process.argv.includes("--upload");
  const apply = process.argv.includes("--apply");

  const ffmpeg = await which("ffmpeg", "ffmpeg-static");
  const ffprobe = await which("ffprobe", "ffprobe-static");
  if (!ffmpeg || !ffprobe) {
    console.error(
      "ffmpeg/ffprobe not found. Either install them on PATH, or run:\n" +
        "  npm install --save-dev ffmpeg-static ffprobe-static\n" +
        "or point FFMPEG_PATH / FFPROBE_PATH at the binaries.",
    );
    process.exit(1);
  }

  await mkdir(WORK, { recursive: true });
  const urls = await heroVideos();
  const results = [];

  for (const url of urls) {
    const name = nameOf(url);
    const source = resolve(WORK, name);
    const outName = name.replace(/\.[^.]+$/, "") + `-${TARGET_WIDTH}w.mp4`;
    const output = resolve(WORK, outName);

    await download(url, source);
    const before = await probe(ffprobe, source);

    if (before.width <= TARGET_WIDTH) {
      console.log(`${name}: already ${before.width}px wide, skipping`);
      continue;
    }
    if (!existsSync(output)) await encode(ffmpeg, source, output, TARGET_WIDTH);
    const after = await probe(ffprobe, output);

    const data = await readFile(output);
    const hash = sha(data);
    const key = `site-images/main/${hash.slice(0, 16)}/${outName}`;
    results.push({
      app: "main",
      file: output,
      source: `/videos/${outName}`,
      key,
      hash,
      bytes: data.length,
      contentType: "video/mp4",
      url: `https://images.kharis.org/${key.split("/").map(encodeURIComponent).join("/")}`,
      originalUrl: url,
      before,
      after,
    });

    console.log(
      `${name}\n` +
        `   before ${before.width}x${before.height}  ${mb(before.bytes)}\n` +
        `   after  ${after.width}x${after.height}  ${mb(after.bytes)}  ` +
        `(${Math.round((1 - after.bytes / before.bytes) * 100)}% smaller)`,
    );
  }

  if (!results.length) {
    console.log("Nothing to do.");
    return;
  }
  const saved = results.reduce((s, r) => s + (r.before.bytes - r.after.bytes), 0);
  console.log(`\nTotal saved: ${mb(saved)} across ${results.length} clips.`);

  if (upload) {
    await uploadImages(results);
    console.log("Uploaded and verified. Re-run with --apply to switch hero-media.ts.");
    return;
  }
  if (apply) {
    await uploadImages(results); // no-ops for objects already present, and verifies each
    let text = await readFile(HERO_MEDIA, "utf8");
    for (const r of results) {
      if (!text.includes(r.originalUrl)) throw new Error(`Not in hero-media.ts: ${r.originalUrl}`);
      text = text.split(r.originalUrl).join(r.url);
    }
    await writeFile(HERO_MEDIA, text);
    console.log(`Switched ${results.length} hero video URLs in hero-media.ts.`);
    return;
  }
  console.log("Dry run only. Use --upload to upload, then --apply to switch the URLs.");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
