/**
 * Re-encode the site's background clips to the size they are actually drawn at.
 *
 * Dry run: node scripts/transcode-site-videos.mjs
 * Upload:  node --env-file=.env.r2.local scripts/transcode-site-videos.mjs --upload
 * Switch:  node --env-file=.env.r2.local scripts/transcode-site-videos.mjs --apply
 *
 * WHY
 * ---
 * These are decoration, not cinema. Every one of them is muted, looped, and
 * painted into a tile a few hundred pixels wide - the hero's curved band, or a
 * wall of the Life tunnel. They were shipped at their edit resolution: the
 * three hero clips were 1920x1080 at 18-20 Mbps for three second loops, and
 * the football clip was 47.5MB. So most of each file is resolution nothing
 * displays and an audio track nothing can play.
 *
 * PanoramaCarousel defers the hero's clips until the row is on screen and the
 * main thread is idle. This is the other half: making the bytes smaller.
 *
 * WHAT IT DOES NOT DO
 * -------------------
 * It never overwrites a published object. Output goes to a new content-hashed
 * key, exactly like scripts/migrate-site-images.mjs, so the URLs in the source
 * files keep working until --apply switches them and you have seen the new
 * ones load. --apply refuses to run until every new object verifies public,
 * which is the same rule the picture migration follows.
 *
 * ADDING A SOURCE
 * ---------------
 * Put the file in SOURCE_FILES. Anything matching an images.kharis.org mp4 is
 * picked up wherever it appears, so a `src:` in hero-media.ts and a `video:`
 * in life-activities.ts both work without the script knowing the difference.
 *
 * FINDING FFMPEG
 * --------------
 * Checked in order: $FFMPEG_PATH, the ffmpeg-static package if it happens to
 * be installed, then PATH. ffprobe likewise. Any one of those is enough.
 * ffmpeg-static is a devDependency, so it is normally the one that answers -
 * note that resolving it only works from inside this repo.
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
/** Every file that names a background clip by URL. */
const SOURCE_FILES = [
  "apps/main/src/lib/hero-media.ts",
  "apps/main/src/lib/life-activities.ts",
].map((p) => resolve(root, p));
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

/**
 * Every distinct images.kharis.org mp4 named in SOURCE_FILES, with the files
 * that name it, so --apply knows where to rewrite each one.
 */
async function siteVideos() {
  const found = new Map();
  for (const file of SOURCE_FILES) {
    const text = await readFile(file, "utf8");
    for (const [url] of text.matchAll(/https:\/\/images\.kharis\.org\/[^"'\s]+\.mp4/g)) {
      if (!found.has(url)) found.set(url, []);
      if (!found.get(url).includes(file)) found.get(url).push(file);
    }
  }
  if (!found.size) throw new Error("No clips found in " + SOURCE_FILES.join(", "));
  return [...found.entries()].map(([url, files]) => ({ url, files }));
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
  const clips = await siteVideos();
  const results = [];

  for (const { url, files } of clips) {
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
      files,
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
    console.log("Uploaded and verified. Re-run with --apply to switch the source files.");
    return;
  }
  if (apply) {
    await uploadImages(results); // no-ops for objects already present, and verifies each
    /* Rewrite per file rather than globally: a clip can be named in more than
       one place, and each file is read and written once however many of them
       it carries. */
    const byFile = new Map();
    for (const r of results) {
      for (const f of r.files) {
        if (!byFile.has(f)) byFile.set(f, []);
        byFile.get(f).push(r);
      }
    }
    let switched = 0;
    for (const [file, items] of byFile) {
      let text = await readFile(file, "utf8");
      for (const r of items) {
        if (!text.includes(r.originalUrl)) throw new Error(`Not in ${file}: ${r.originalUrl}`);
        text = text.split(r.originalUrl).join(r.url);
        switched++;
      }
      await writeFile(file, text);
      console.log(`  ${items.length} switched in ${file.slice(root.length + 1)}`);
    }
    console.log(`Switched ${switched} clip reference(s).`);
    return;
  }
  console.log("Dry run only. Use --upload to upload, then --apply to switch the URLs.");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
