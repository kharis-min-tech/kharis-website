import { describe, it, expect } from "vitest";
import { BASE_PATH, withBasePath } from "./base-path";

describe("withBasePath", () => {
  it("prefixes root-relative paths with the base path", () => {
    expect(withBasePath("/assets/a.png")).toBe("/kp2/assets/a.png");
    expect(withBasePath("assets/a.png")).toBe("/kp2/assets/a.png");
  });

  it("is idempotent for already-prefixed paths", () => {
    expect(withBasePath("/kp2/assets/a.png")).toBe("/kp2/assets/a.png");
    expect(withBasePath(BASE_PATH)).toBe(BASE_PATH);
  });

  it("leaves absolute and data URLs untouched", () => {
    expect(withBasePath("https://x.com/a.png")).toBe("https://x.com/a.png");
    expect(withBasePath("http://x.com/a.png")).toBe("http://x.com/a.png");
    expect(withBasePath("data:image/png;base64,AAAA")).toBe("data:image/png;base64,AAAA");
  });

  it("passes an empty string through", () => {
    expect(withBasePath("")).toBe("");
  });
});
