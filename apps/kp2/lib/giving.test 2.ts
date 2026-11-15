import { describe, expect, it } from "vitest";
import { resolveGivingLink } from "./giving";

describe("resolveGivingLink", () => {
  it("uses the content studio link when it is https", () => {
    expect(resolveGivingLink("kp2-london", "https://give.example/london")).toBe(
      "https://give.example/london",
    );
  });

  it("uses that branch's giving page when the studio link is empty", () => {
    expect(resolveGivingLink("kp2-london", null)).toBe(
      "https://give.tithe.ly/?formId=1f9358c0-6226-4abf-a526-4ef17e002c2f",
    );
    expect(resolveGivingLink("kp2-southampton", "  ")).toContain(
      "a79fdf6d-6849-4751-95ba-dd248b953ea5",
    );
  });

  it("ignores a studio value that is not https", () => {
    expect(resolveGivingLink("kp2-romford", "javascript:alert(1)")).toContain(
      "9bb02537-fd92-492a-bb76-3f2989c16c9d",
    );
  });
});
