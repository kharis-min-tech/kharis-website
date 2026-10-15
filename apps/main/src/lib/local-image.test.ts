import { describe, expect, it } from "vitest";
import { studioImage } from "./local-image";
import images from "./site-image-urls.json";

describe("migrated studio pictures", () => {
  it("resolves a saved local photo and keeps its query string", () => {
    expect(studioImage("/images/locations/london-sunday-smiles.jpg?v=2")).toBe(
      images["/images/locations/london-sunday-smiles.jpg"] + "?v=2",
    );
  });
  it("resolves the homepage video poster through R2", () => {
    expect(studioImage("/videos/hero-a-poster.jpg")).toBe(images["/videos/hero-a-poster.jpg"]);
  });
  it("preserves uploaded external pictures and rejects design placeholders", () => {
    expect(studioImage("https://images.kharis.org/branch-images/a/b.jpg")).toBe(
      "https://images.kharis.org/branch-images/a/b.jpg",
    );
    expect(studioImage("assets/design/placeholder.jpg")).toBeNull();
  });
});
