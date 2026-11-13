import { describe, expect, it } from "vitest";
import { branchIdFromMediaKey, isBranchMediaFolder, mediaObjectKey } from "./media-paths";

const BRANCH = "6f1c2b8e-3c1a-4d2b-9e0f-1a2b3c4d5e6f";

describe("isBranchMediaFolder", () => {
  it("only accepts folders that can belong to a branch", () => {
    expect(isBranchMediaFolder("events")).toBe(true);
    expect(isBranchMediaFolder("branch-videos")).toBe(true);
    expect(isBranchMediaFolder("sermons")).toBe(false);
    expect(isBranchMediaFolder("uploads")).toBe(false);
  });
});

describe("mediaObjectKey", () => {
  it("puts branch uploads under the branch id", () => {
    const key = mediaObjectKey("events", "Easter poster.jpg", BRANCH);
    expect(key).toMatch(
      new RegExp(`^site-media/events/${BRANCH}/[0-9a-f-]{36}-Easter_poster\\.jpg$`),
    );
    expect(branchIdFromMediaKey(key)).toBe(BRANCH);
  });

  it("ignores a branch id for folders that are not branch scoped", () => {
    const key = mediaObjectKey("sermons", "talk.mp4", BRANCH);
    expect(key).not.toContain(BRANCH);
    expect(branchIdFromMediaKey(key)).toBeNull();
  });

  it("ignores a branch id that is not a uuid", () => {
    const key = mediaObjectKey("events", "a.png", "../other");
    expect(key).toMatch(/^site-media\/events\/[0-9a-f-]{36}-a\.png$/);
  });
});

describe("branchIdFromMediaKey", () => {
  it("returns null for older keys without a branch", () => {
    expect(branchIdFromMediaKey("site-media/events/abc-poster.jpg")).toBeNull();
  });

  it("returns null outside branch folders, for bad ids and for other prefixes", () => {
    expect(branchIdFromMediaKey(`site-media/news/${BRANCH}/a.jpg`)).toBeNull();
    expect(branchIdFromMediaKey("site-media/events/not-a-uuid/a.jpg")).toBeNull();
    expect(branchIdFromMediaKey(`branch-images/${BRANCH}/hero/a.jpg`)).toBeNull();
    expect(branchIdFromMediaKey(`site-media/events/${BRANCH}/../a.jpg`)).toBeNull();
    expect(branchIdFromMediaKey(null)).toBeNull();
  });
});
