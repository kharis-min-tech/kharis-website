import { describe, expect, it } from "vitest";
import { isStaleDeployError } from "./stale-deploy";

/* The point of the predicate is that it must be exact in both directions. Miss
 * a chunk failure and the visitor is stuck on an error page no button can
 * clear; catch an ordinary bug by mistake and we reload the page out from
 * under them instead of showing it. */
describe("isStaleDeployError", () => {
  it("catches the ChunkLoadError a replaced deploy actually produces", () => {
    /* Copied from a real console after a deploy landed mid-session. */
    const error = Object.assign(
      new Error(
        "Loading chunk 9451 failed.\n(error: https://example.workers.dev/_next/static/chunks/app/messages/page-cc2b68525d4f9de0.js)",
      ),
      { name: "ChunkLoadError" },
    );
    expect(isStaleDeployError(error)).toBe(true);
  });

  it("catches it by message alone, when the name has been lost", () => {
    expect(isStaleDeployError(new Error("Loading chunk 9451 failed."))).toBe(true);
  });

  it("catches a stylesheet chunk", () => {
    expect(isStaleDeployError(new Error("Loading CSS chunk 225 failed."))).toBe(true);
  });

  it.each([
    "Failed to fetch dynamically imported module: https://example.com/a.js",
    "error loading dynamically imported module",
    "Importing a module script failed.",
  ])("catches the dynamic-import wording: %s", (message) => {
    expect(isStaleDeployError(new Error(message))).toBe(true);
  });

  it("leaves an ordinary application bug alone", () => {
    expect(
      isStaleDeployError(new Error("Cannot read properties of undefined (reading 'map')")),
    ).toBe(false);
  });

  it("leaves a failed data fetch alone", () => {
    expect(isStaleDeployError(new Error("Failed to fetch"))).toBe(false);
  });

  it("survives being handed something that is not an error", () => {
    expect(isStaleDeployError(null)).toBe(false);
    expect(isStaleDeployError(undefined)).toBe(false);
    expect(isStaleDeployError({})).toBe(false);
  });
});
