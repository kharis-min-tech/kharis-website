/**
 * Replace guideImage URLs in apps/content/lib/site-contents-defaults.ts
 * from upload-site-content-guides.mjs JSON mapping.
 *
 *   node scripts/apply-guide-mapping.mjs mapping.json
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultsPath = path.join(root, "apps/content/lib/site-contents-defaults.ts");

const mappingPath = process.argv[2];
if (!mappingPath) {
  throw new Error("Usage: node scripts/apply-guide-mapping.mjs <mapping.json>");
}

const mapping = JSON.parse(await readFile(path.resolve(mappingPath), "utf8"));
let src = await readFile(defaultsPath, "utf8");

const kharisMarker = "const KHARIS: WorkspaceMeta = {";
const kp2Marker = "const KP2: WorkspaceMeta = {";
let wired = 0;

for (const [key, url] of Object.entries(mapping)) {
  const [ws, page, section] = key.split("/");
  if (!ws || !page || !section) continue;

  const kharisStart = src.indexOf(kharisMarker);
  const kp2Start = src.indexOf(kp2Marker);
  if (kharisStart < 0 || kp2Start < 0) throw new Error("KHARIS/KP2 markers missing");

  const start = ws === "kp2" ? kp2Start : kharisStart;
  const end = ws === "kp2" ? src.length : kp2Start;
  const range = src.slice(start, end);

  const pageRe = new RegExp(`\\n  ${page}: \\{`);
  const pageMatch = pageRe.exec(range);
  if (!pageMatch) {
    console.warn(`Missing page ${ws}/${page}`);
    continue;
  }
  const pageAbs = start + pageMatch.index;
  const afterPage = src.slice(pageAbs + pageMatch[0].length, end);
  const nextPage = /\n  [a-zA-Z]+: \{/.exec(afterPage);
  const pageEnd = nextPage ? pageAbs + pageMatch[0].length + nextPage.index : end;
  const pageBlock = src.slice(pageAbs, pageEnd);

  const sectionRe = new RegExp(`(\\n\\s{4}${section}: \\{)`);
  const sectionMatch = sectionRe.exec(pageBlock);
  if (!sectionMatch) {
    console.warn(`Missing section ${ws}/${page}/${section}`);
    continue;
  }
  const sectionAbs = pageAbs + sectionMatch.index;
  const sectionTail = src.slice(sectionAbs, pageEnd);
  const defaultsIdx = sectionTail.indexOf("\n      defaults:");
  if (defaultsIdx < 0) {
    console.warn(`No defaults in ${ws}/${page}/${section}`);
    continue;
  }

  const beforeDefaults = sectionTail.slice(0, defaultsIdx);
  const afterDefaults = sectionTail.slice(defaultsIdx);
  const guideLine = `\n      guideImage: ${JSON.stringify(url)},`;

  const cleaned = beforeDefaults
    .replace(/\n\s+guideImage:\s*(?:"[^"]*"|`[^`]*`),?/g, "")
    .replace(/\n\s+guideImage:\s*\n\s*"[^"]*",?/g, "");

  const newSectionTail = cleaned + guideLine + afterDefaults;
  src = src.slice(0, sectionAbs) + newSectionTail + src.slice(pageEnd);
  wired += 1;
}

await writeFile(defaultsPath, src);
console.log(`Wired ${wired} guideImage URLs`);
