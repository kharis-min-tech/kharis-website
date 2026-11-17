import { describe, expect, it } from "vitest";
import { checkEvent } from "./event-checks";

const base = {
  title: "Sunday service",
  date: "2026-11-22",
  time: "10:00",
  branchId: "",
  recurrence: "none" as const,
  days: [] as number[],
  sites: ["kharis"],
  published: true,
  imageUrl: "",
  location: "",
};

describe("checkEvent", () => {
  it("requires a title and date", () => {
    const issues = checkEvent({ ...base, title: "", date: "" });
    expect(issues.some((issue) => issue.step === "basics" && issue.level === "error")).toBe(true);
    expect(issues.some((issue) => issue.step === "when" && issue.level === "error")).toBe(true);
  });

  it("requires weekdays for weekly repeats", () => {
    const issues = checkEvent({ ...base, recurrence: "weekly", days: [] });
    expect(issues.some((issue) => issue.step === "repeat" && issue.level === "error")).toBe(true);
  });

  it("requires a site when published", () => {
    const issues = checkEvent({ ...base, sites: [], published: true });
    expect(issues.some((issue) => issue.step === "publish" && issue.level === "error")).toBe(true);
  });
});
