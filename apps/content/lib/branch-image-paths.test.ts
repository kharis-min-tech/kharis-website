import { describe, it, expect } from "vitest";
import {
  branchImageFolderKey,
  branchImageKeyFromUrl,
  branchImageObjectKey,
  isBranchId,
  isBranchImageCategory,
  isBranchImageContentType,
  isR2ObjectKey,
  publicUrlForKey,
} from "./branch-image-paths";

const UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("isBranchId", () => {
  it("accepts a uuid", () => expect(isBranchId(UUID)).toBe(true));
  it("rejects non-uuids and decorated values", () => {
    expect(isBranchId("nope")).toBe(false);
    expect(isBranchId("")).toBe(false);
    expect(isBranchId(`${UUID}/x`)).toBe(false);
  });
});

describe("isBranchImageContentType", () => {
  it("accepts the supported image types", () => {
    for (const t of ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]) {
      expect(isBranchImageContentType(t)).toBe(true);
    }
  });
  it("rejects anything else", () => {
    expect(isBranchImageContentType("image/svg+xml")).toBe(false);
    expect(isBranchImageContentType("application/pdf")).toBe(false);
  });
});

describe("isBranchImageCategory", () => {
  it("accepts the known categories", () => {
    for (const c of ["hero", "gallery", "venue", "pastor"]) {
      expect(isBranchImageCategory(c)).toBe(true);
    }
  });
  it("rejects unknown categories", () => expect(isBranchImageCategory("banner")).toBe(false));
});

describe("branchImageObjectKey", () => {
  it("builds branch-images/{id}/{category}/{uuid}.{ext}", () => {
    const key = branchImageObjectKey(UUID, "hero", "image/webp");
    expect(key).toMatch(new RegExp(`^branch-images/${UUID}/hero/[0-9a-f-]{36}\\.webp$`));
    expect(isR2ObjectKey(key)).toBe(true);
  });
  it("maps content types to file extensions", () => {
    expect(branchImageObjectKey(UUID, "gallery", "image/jpeg")).toMatch(/\.jpg$/);
  });
  it("gives a unique key each call", () => {
    expect(branchImageObjectKey(UUID, "hero", "image/png")).not.toBe(
      branchImageObjectKey(UUID, "hero", "image/png"),
    );
  });
});

describe("publicUrlForKey", () => {
  it("joins base and key, trimming a single trailing slash", () => {
    expect(publicUrlForKey("https://cdn.example.com", "branch-images/x.png")).toBe(
      "https://cdn.example.com/branch-images/x.png",
    );
    expect(publicUrlForKey("https://cdn.example.com/", "branch-images/x.png")).toBe(
      "https://cdn.example.com/branch-images/x.png",
    );
  });
});

describe("isR2ObjectKey", () => {
  it("accepts branch-images keys and rejects traversal / foreign / nullish", () => {
    expect(isR2ObjectKey("branch-images/a/b.png")).toBe(true);
    expect(isR2ObjectKey("branch-images/../secret")).toBe(false);
    expect(isR2ObjectKey("other/x")).toBe(false);
    expect(isR2ObjectKey(null)).toBe(false);
    expect(isR2ObjectKey(undefined)).toBe(false);
  });
});

describe("branchImageKeyFromUrl", () => {
  it("returns the key unchanged when given a raw key", () => {
    expect(branchImageKeyFromUrl("branch-images/a/b.png")).toBe("branch-images/a/b.png");
  });
  it("extracts the key from a full URL and strips the query string", () => {
    expect(branchImageKeyFromUrl("https://cdn.example.com/branch-images/a/b.png?v=2")).toBe(
      "branch-images/a/b.png",
    );
  });
  it("returns null for unrelated URLs and nullish input", () => {
    expect(branchImageKeyFromUrl("https://cdn.example.com/other/x.png")).toBeNull();
    expect(branchImageKeyFromUrl(null)).toBeNull();
    expect(branchImageKeyFromUrl(undefined)).toBeNull();
  });
});

describe("branchImageFolderKey", () => {
  it("is the .keep marker under the branch folder", () => {
    expect(branchImageFolderKey(UUID)).toBe(`branch-images/${UUID}/.keep`);
    expect(isR2ObjectKey(branchImageFolderKey(UUID))).toBe(true);
  });
});
