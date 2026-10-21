import { describe, expect, it } from "vitest";
import { cleanText, isUuid, resolveBranch, type BranchRow } from "./contact-submission";

const LONDON = "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed";
const KP2 = "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b";
const branches: BranchRow[] = [
  { id: LONDON, name: "London", workspace: "general" },
  { id: KP2, name: "KP2 London", workspace: "kp2" },
];

describe("resolveBranch", () => {
  it("files by id and takes the name from the directory", () => {
    expect(resolveBranch(branches, LONDON, "anything")).toEqual({
      branch_id: LONDON,
      branch_name: "London",
      workspace: "kharis",
    });
  });

  it("sends KP2 branches to the KP2 inbox", () => {
    expect(resolveBranch(branches, KP2, "").workspace).toBe("kp2");
  });

  it("treats a KP2-named branch on the default workspace as KP2", () => {
    const rows: BranchRow[] = [{ id: KP2, name: "KP2 Romford", workspace: "general" }];
    expect(resolveBranch(rows, KP2, "").workspace).toBe("kp2");
  });

  it("matches older forms that only send a name", () => {
    expect(resolveBranch(branches, undefined, " kp2 london ")).toEqual({
      branch_id: KP2,
      branch_name: "KP2 London",
      workspace: "kp2",
    });
  });

  it("keeps an unknown name as text and an empty one as nothing", () => {
    expect(resolveBranch(branches, "not-a-uuid", "Leeds")).toEqual({
      branch_id: null,
      branch_name: "Leeds",
      workspace: "kharis",
    });
    expect(resolveBranch(branches, null, "").branch_name).toBeNull();
  });
});

describe("cleanText and isUuid", () => {
  it("trims and caps text", () => {
    expect(cleanText("  hi  ", 10)).toBe("hi");
    expect(cleanText("x".repeat(20), 5)).toBe("xxxxx");
    expect(cleanText(undefined, 5)).toBe("");
  });

  it("only accepts real uuids", () => {
    expect(isUuid(LONDON)).toBe(true);
    expect(isUuid("London")).toBe(false);
    expect(isUuid(42)).toBe(false);
  });
});
