import { describe, expect, it } from "vitest";
import { activeCounts, isActive, matchesActiveFilter } from "./active-filter";

describe("isActive", () => {
  it("treats a missing value as active, like the column default", () => {
    expect(isActive({ is_active: true })).toBe(true);
    expect(isActive({ is_active: null })).toBe(true);
    expect(isActive({})).toBe(true);
    expect(isActive({ is_active: false })).toBe(false);
  });
});

describe("matchesActiveFilter", () => {
  it("keeps the rows for each tab", () => {
    expect(matchesActiveFilter("active", true)).toBe(true);
    expect(matchesActiveFilter("active", false)).toBe(false);
    expect(matchesActiveFilter("inactive", false)).toBe(true);
    expect(matchesActiveFilter("inactive", true)).toBe(false);
    expect(matchesActiveFilter("all", false)).toBe(true);
  });
});

describe("activeCounts", () => {
  it("counts each tab", () => {
    const rows = [{ is_active: true }, { is_active: false }, { is_active: null }];
    expect(activeCounts(rows, isActive)).toEqual({ active: 2, inactive: 1, all: 3 });
  });
});
