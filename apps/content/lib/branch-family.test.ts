import { describe, expect, it } from "vitest";
import { branchFamily, branchPagePath, defaultFamily } from "./branch-family";

describe("branchFamily", () => {
  it("takes a saved kp2 or kharis workspace at its word", () => {
    expect(branchFamily({ workspace: "kp2", name: "London" })).toBe("kp2");
    expect(branchFamily({ workspace: "kharis", name: "KP2 London" })).toBe("kharis");
  });

  it("reads rows still on the general default like the websites do", () => {
    expect(branchFamily({ workspace: "general", name: "KP2 Romford" })).toBe("kp2");
    expect(
      branchFamily({ workspace: "general", name: "Southampton", slug: "kp2-southampton" }),
    ).toBe("kp2");
    expect(branchFamily({ workspace: null, name: "Barking", group: "Kharis Phase 2" })).toBe("kp2");
    expect(branchFamily({ workspace: "general", name: "Reading", group: "Kharis" })).toBe("kharis");
    expect(branchFamily({ name: "KP2X" })).toBe("kharis");
  });
});

describe("defaultFamily", () => {
  it("starts new branches in KP2 only from the KP2 workspace", () => {
    expect(defaultFamily("kp2")).toBe("kp2");
    expect(defaultFamily("kharis")).toBe("kharis");
    expect(defaultFamily("general")).toBe("kharis");
    expect(defaultFamily(null)).toBe("kharis");
  });
});

describe("branchPagePath", () => {
  it("points at the site that shows the branch", () => {
    expect(branchPagePath("kharis", "london")).toBe("kharis.org/locations/london");
    expect(branchPagePath("kp2", "kp2-london")).toBe("kharis.org/kp2/branches/kp2-london");
  });
});
