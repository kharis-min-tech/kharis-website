import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  branchIdFromMediaKey,
  isBranchMediaFolder,
  mediaMonthScope,
  mediaObjectKey,
} from "./media-paths";

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
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-14T12:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("puts branch uploads under the branch id and a month nest", () => {
    const key = mediaObjectKey("events", "Easter poster.jpg", BRANCH);
    expect(key).toMatch(
      new RegExp(`^site-media/events/${BRANCH}/2026-11/[0-9a-f-]{36}-Easter_poster\\.jpg$`),
    );
    expect(branchIdFromMediaKey(key)).toBe(BRANCH);
  });

  it("ignores a branch id for folders that are not branch scoped", () => {
    const key = mediaObjectKey("sermons", "talk.mp4", BRANCH);
    expect(key).not.toContain(BRANCH);
    expect(key).toMatch(/^site-media\/sermons\/2026-11\/[0-9a-f-]{36}-talk\.mp4$/);
    expect(branchIdFromMediaKey(key)).toBeNull();
  });

  it("ignores a branch id that is not a uuid and still nests by month", () => {
    const key = mediaObjectKey("events", "a.png", "../other");
    expect(key).toMatch(/^site-media\/events\/2026-11\/[0-9a-f-]{36}-a\.png$/);
  });

  it("nests department videos under a sanitised department folder", () => {
    const key = mediaObjectKey("department-videos", "intro.mp4", null, "Children's Church");
    expect(key).toMatch(
      /^site-media\/department-videos\/Children_s_Church\/[0-9a-f-]{36}-intro\.mp4$/,
    );
    expect(key).not.toContain("..");
    expect(key).not.toContain("2026-11");
  });

  it("exposes the current UTC year-month", () => {
    expect(mediaMonthScope()).toBe("2026-11");
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
