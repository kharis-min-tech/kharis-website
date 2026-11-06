import { expect, it } from "vitest";
import { newestMessage } from "./newest-message";

it("features the newest teaching even when a curated series comes first", () => {
  const older = { id: "older", title: "Acts", thumbnail: "older.jpg", publishedAt: "2026-07-20" };
  const latest = {
    id: "latest",
    title: "John",
    thumbnail: "latest.jpg",
    publishedAt: "2026-10-25",
  };
  const undated = { id: "undated", title: "Archive", thumbnail: "archive.jpg" };
  expect(newestMessage([older, undated, latest])).toBe(latest);
  expect(newestMessage([undated])).toBe(undated);
  expect(newestMessage([])).toBeUndefined();
});
