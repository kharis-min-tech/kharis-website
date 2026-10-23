import { describe, expect, it } from "vitest";
import {
  describeReadingReference,
  passageFromReference,
  referenceFromPassage,
} from "./bible-reference";

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

  it("turns a book and chapter into the reference the phone opens", () => {
    expect(passageFromReference("John 3")).toMatchObject({
      book: "John",
      chapter: 3,
      verseStart: null,
      verseEnd: null,
    });
    expect(passageFromReference("Psalm 23")).toMatchObject({ book: "Psalms", chapter: 23 });
    expect(referenceFromPassage({ book: "John", chapter: 3, verseStart: 16, verseEnd: 18 })).toBe(
      "John 3:16-18",
    );
    expect(
      referenceFromPassage({ book: "Psalms", chapter: 23, verseStart: null, verseEnd: null }),
    ).toBe("Psalms 23");
    expect(referenceFromPassage({ book: "Jude", chapter: 9, verseStart: 3, verseEnd: null })).toBe(
      "Jude 1:3",
    );
  });

  it("rejects a chapter the book does not have", () => {
    const check = describeReadingReference("John 99");
    expect(check.ok).toBe(false);
    if (!check.ok) expect(check.message).toContain("21 chapter");
  });
});
