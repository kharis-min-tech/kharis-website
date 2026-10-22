import { describe, expect, it } from "vitest";
import { publicAsset, studioImage } from "./public-asset";
import images from "./site-image-urls.json";

describe("KP2 migrated pictures", () => {
  it("resolves saved picture paths with or without the KP2 prefix", () => {
    expect(publicAsset("/assets/worship.jpg")).toBe(images["/assets/worship.jpg"]);
    expect(publicAsset("/kp2/assets/worship.jpg?v=2")).toBe(images["/assets/worship.jpg"] + "?v=2");
  });
  it("keeps videos on the existing KP2 route", () => {
    expect(publicAsset("/assets/crowd.mp4")).toBe("/kp2/assets/crowd.mp4");
  });
  it("preserves external pictures and rejects design placeholders", () => {
    expect(studioImage("https://images.kharis.org/branch-images/a/b.jpg")).toBe(
      "https://images.kharis.org/branch-images/a/b.jpg",
    );
    expect(studioImage("assets/design/placeholder.jpg")).toBeNull();
  });
});
