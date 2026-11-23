import { describe, expect, it } from "vitest";
import { cdnImage, cdnSrcSet } from "./image-cdn";

const PHOTO =
  "https://images.kharis.org/site-images/main/a080e8123b487573/vision-church-family.jpg";

describe("cdnImage", () => {
  it("puts the transform between the host and the object key", () => {
    expect(cdnImage(PHOTO, { width: 160 })).toBe(
      "https://images.kharis.org/cdn-cgi/image/width=160,quality=80,fit=scale-down,format=auto/site-images/main/a080e8123b487573/vision-church-family.jpg",
    );
  });

  it("defaults to quality 80, matching SiteImage", () => {
    expect(cdnImage(PHOTO, { width: 100 })).toContain("quality=80");
  });

  it("never upscales, so asking for more than the source has is safe", () => {
    expect(cdnImage(PHOTO, { width: 4000 })).toContain("fit=scale-down");
  });

  it("omits width when none is given, so format and quality alone still apply", () => {
    expect(cdnImage(PHOTO)).toBe(
      "https://images.kharis.org/cdn-cgi/image/quality=80,fit=scale-down,format=auto/site-images/main/a080e8123b487573/vision-church-family.jpg",
    );
  });

  it("sends both sides for a square crop, which is what fit=cover needs", () => {
    expect(cdnImage(PHOTO, { width: 160, height: 160, fit: "cover" })).toContain(
      "width=160,height=160,quality=80,fit=cover",
    );
  });

  it("carries blur through for the backdrop wash", () => {
    expect(cdnImage(PHOTO, { width: 48, blur: 40 })).toContain("blur=40");
  });

  it("clamps quality and blur into the ranges Cloudflare accepts", () => {
    expect(cdnImage(PHOTO, { quality: 250 })).toContain("quality=100");
    expect(cdnImage(PHOTO, { quality: 0 })).toContain("quality=1");
    expect(cdnImage(PHOTO, { blur: 900 })).toContain("blur=250");
  });

  /* Transforms exist on the images.kharis.org zone and nowhere else, so a
     /cdn-cgi/image/ prefix on any other host is a 404. Passing those through
     untouched is the whole safety property of this helper. */
  it.each([
    ["a local public path", "/images/hero/sunday-service-stage.jpg"],
    ["a YouTube thumbnail", "https://i.ytimg.com/vi/abc123/maxresdefault.jpg"],
    ["a Supabase upload", "https://cqgyiqxhpxwasogpdghx.supabase.co/storage/v1/x.jpg"],
    ["a relative path", "./local.png"],
  ])("leaves %s alone", (_label, src) => {
    expect(cdnImage(src, { width: 160 })).toBe(src);
  });

  it("is idempotent, so calling it twice cannot nest transforms", () => {
    const once = cdnImage(PHOTO, { width: 160 });
    expect(cdnImage(once, { width: 900 })).toBe(once);
  });

  it("preserves percent-encoding in the object key", () => {
    const encoded = "https://images.kharis.org/site-videos/main/Glory%20to%20the%20lamb.jpg";
    expect(cdnImage(encoded, { width: 200 })).toContain("/Glory%20to%20the%20lamb.jpg");
  });
});

describe("cdnSrcSet", () => {
  it("pairs each width with its own descriptor", () => {
    const set = cdnSrcSet(PHOTO, [640, 960]);
    expect(set).toContain("width=640");
    expect(set).toContain(" 640w");
    expect(set).toContain("width=960");
    expect(set).toContain(" 960w");
    expect(set.split(", ")).toHaveLength(2);
  });

  /* An empty srcSet is ignored by the browser, which falls back to `src` -
     exactly what an untransformable URL needs. */
  it("returns an empty string for a host without transforms", () => {
    expect(cdnSrcSet("/images/local.jpg", [640, 960])).toBe("");
  });
});
