// Rebuild the compact globe asset after changing the source land coordinates.
import { readFile, mkdir, writeFile } from "node:fs/promises";
const source = new URL("../apps/main/src/data/worldDots.json", import.meta.url);
const output = new URL("../apps/main/public/maps/world-land-v1.bin", import.meta.url);
const points = JSON.parse(await readFile(source, "utf8")).filter((_, index) => index % 2 === 0);
const buffer = Buffer.alloc(points.length * 4);
points.forEach(([lng, lat], index) => {
  buffer.writeInt16LE(Math.round(lng * 100), index * 4);
  buffer.writeInt16LE(Math.round(lat * 100), index * 4 + 2);
});
await mkdir(new URL("../apps/main/public/maps/", import.meta.url), { recursive: true });
await writeFile(output, buffer);
console.log(`Wrote ${points.length} globe points in ${buffer.length} bytes.`);
