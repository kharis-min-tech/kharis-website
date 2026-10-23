import { describe, expect, it } from "vitest";
import { describeReadingReference } from "./bible-reference";

describe("describeReadingReference", () => {
  it("reads a verse, a chapter, and a range", () => {
    expect(describeReadingReference("John 3:16")).toMatchObject({ passages: ["John 3:16"] });
    expect(describeReadingReference("Psalm 23")).toMatchObject({ passages: ["Psalms 23"] });
    expect(describeReadingReference("1 Cor 13:4-7")).toMatchObject({
      passages: ["1 Corinthians 13:4-7"],
    });
  });

  it("keeps several passages and a continued book", () => {
    expect(describeReadingReference("Romans 8:1-11; Psalm 23")).toMatchObject({
      passages: ["Romans 8:1-11", "Psalms 23"],
    });
    expect(describeReadingReference("John 3:16 and 3:17")).toMatchObject({
      passages: ["John 3:16", "John 3:17"],
    });
  });

  it("treats a number in a one-chapter book as a verse", () => {
    expect(describeReadingReference("Jude 3")).toMatchObject({ passages: ["Jude 1:3"] });
  });

  it("rejects a chapter the book does not have", () => {
    const check = describeReadingReference("John 99");
    expect(check.ok).toBe(false);
    if (!check.ok) expect(check.message).toContain("21 chapter");
  });
});
