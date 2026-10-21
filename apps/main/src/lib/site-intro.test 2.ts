import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";
import { SITE_INTRO_BOOTSTRAP } from "./site-intro";

function firstPaint(pathname: string) {
  const dataset: Record<string, string> = {};
  runInNewContext(SITE_INTRO_BOOTSTRAP, {
    document: { documentElement: { dataset } },
    location: { pathname },
  });
  return dataset.siteIntro;
}

describe("homepage dove entrance", () => {
  it("shows the intro on every fresh homepage load", () => {
    expect(firstPaint("/")).toBe("pending");
    expect(firstPaint("/")).toBe("pending");
  });

  it.each(["/about", "/about/leadership", "/governance", "/locations", "/life"])(
    "skips the intro before first paint on %s",
    (pathname) => {
      expect(firstPaint(pathname)).toBe("seen");
    },
  );
});
