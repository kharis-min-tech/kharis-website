import { describe, expect, it } from "vitest";
import { studioAccess } from "./studio-role";

describe("studioAccess", () => {
  it("gives nothing when the account is unknown", () => {
    const access = studioAccess(null);
    expect(access.role).toBe("none");
    expect(access.isSuperAdmin).toBe(false);
    expect(access.branchIds).toEqual([]);
    expect(access.canEditBranch("b1")).toBe(false);
  });

  it("ignores branch ids on an account with no role", () => {
    const access = studioAccess({ role: "none", branchIds: ["b1"] });
    expect(access.branchIds).toEqual([]);
    expect(access.canEditBranch("b1")).toBe(false);
  });

  it("limits a branch admin to their branches", () => {
    const access = studioAccess({ role: "branch_admin", branchIds: ["b1", "b2"] });
    expect(access.isSuperAdmin).toBe(false);
    expect(access.canEditBranch("b1")).toBe(true);
    expect(access.canEditBranch("b3")).toBe(false);
    expect(access.canEditBranch(null)).toBe(false);
    expect(access.canEditBranch("")).toBe(false);
  });

  it("lets a super admin edit any branch, but not a missing one", () => {
    const access = studioAccess({ role: "super_admin", branchIds: [] });
    expect(access.isSuperAdmin).toBe(true);
    expect(access.canEditBranch("anything")).toBe(true);
    expect(access.canEditBranch(undefined)).toBe(false);
  });

  it("passes reload through", () => {
    let calls = 0;
    studioAccess(null, () => {
      calls += 1;
    }).reload();
    expect(calls).toBe(1);
  });
});
