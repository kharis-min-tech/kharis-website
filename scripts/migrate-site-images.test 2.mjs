import { test } from "node:test";
import assert from "node:assert/strict";
import { inventory, replaceImageUrls } from "./migrate-site-images.mjs";
const images = [
  {
    app: "main",
    source: "/images/photo.jpg",
    url: "https://images.kharis.org/site-images/main/hash/photo.jpg",
  },
  {
    app: "kp2",
    source: "/assets/photo.jpg",
    url: "https://images.kharis.org/site-images/kp2/hash/photo.jpg",
  },
];
test("updates JSX and CSS while leaving external URLs and similar filenames intact", () => {
  const source = `<img src="/images/photo.jpg"/><img src="https://example.com/images/photo.jpg"/><img src="/images/photo.jpg.backup"/> url('/images/photo.jpg')`;
  const actual = replaceImageUrls(source, "main", images);
  assert.ok(actual.includes(`src="${images[0].url}"`));
  assert.ok(actual.includes("https://example.com/images/photo.jpg"));
  assert.ok(actual.includes("/images/photo.jpg.backup"));
  assert.ok(actual.includes(`url('${images[0].url}')`));
});
test("handles both KP2 base-path forms and is idempotent", () => {
  const source = `"/assets/photo.jpg" url(/kp2/assets/photo.jpg)`;
  const actual = replaceImageUrls(source, "kp2", images);
  assert.equal(actual, `"${images[1].url}" url(${images[1].url})`);
  assert.equal(replaceImageUrls(actual, "kp2", images), actual);
});
test("keeps URL query strings and fragments", () => {
  assert.equal(
    replaceImageUrls('"/images/photo.jpg?v=2#crop"', "main", images),
    `"${images[0].url}?v=2#crop"`,
  );
});
test("uses distinct content-addressed keys without uploading backup originals or video", async () => {
  const files = await inventory();
  assert.ok(files.length > 0);
  assert.ok(files.some((file) => file.source.startsWith("/videos/")));
  assert.equal(new Set(files.map((file) => file.key)).size, files.length);
  assert.ok(
    files.every((file) =>
      file.key.startsWith(`site-images/${file.app}/${file.hash.slice(0, 16)}/`),
    ),
  );
  assert.ok(
    files.every(
      (file) => !file.file.includes("_original-black-canvas") && !file.file.endsWith(".mp4"),
    ),
  );
});

test("matches whitespace-delimited paths and escapes image filename dots", () => {
  assert.equal(replaceImageUrls(" /images/photo.jpg ", "main", images), ` ${images[0].url} `);
  assert.equal(replaceImageUrls('"/images/photoXjpg"', "main", images), '"/images/photoXjpg"');
});
