import { describe, expect, it } from "vitest";
import { BRANCH_ADMIN_PAGES, WORKSPACES, canOpenPath, workspacesForRole } from "./workspaces";

describe("workspacesForRole", () => {
  it("gives super admins every workspace, including Users", () => {
    expect(workspacesForRole("super_admin")).toBe(WORKSPACES);
    const general = WORKSPACES.find((workspace) => workspace.id === "general");
    expect(general?.nav.map((item) => item.href)).toContain("/users");
  });

  it("gives accounts with no role nothing", () => {
    expect(workspacesForRole("none")).toEqual([]);
  });

  it("keeps only branch sections for branch admins", () => {
    const workspaces = workspacesForRole("branch_admin");
    expect(workspaces.map((workspace) => workspace.id)).toEqual([
      "general",
      "app",
      "kharis",
      "kp2",
    ]);
    for (const workspace of workspaces) {
      for (const item of workspace.nav) expect(BRANCH_ADMIN_PAGES).toContain(item.href);
    }
    expect(Object.fromEntries(workspaces.map((w) => [w.id, w.description]))).toEqual({
      general: "Branches, Visitors and Messages for your branches.",
      app: "Events for your branches.",
      kharis: "Branches, Events and Messages for your branches.",
      kp2: "Branches, Events and Messages for your branches.",
    });
  });

  it("does not change the shared workspace list", () => {
    workspacesForRole("branch_admin");
    const general = WORKSPACES.find((workspace) => workspace.id === "general");
    expect(general?.nav.some((item) => item.href === "/sermons")).toBe(true);
  });
});

describe("canOpenPath", () => {
  it("lets super admins open anything", () => {
    expect(canOpenPath("super_admin", "/users")).toBe(true);
    expect(canOpenPath("super_admin", "/sermons")).toBe(true);
  });

  it("blocks every page for accounts with no role", () => {
    expect(canOpenPath("none", "/")).toBe(false);
    expect(canOpenPath("none", "/branches")).toBe(false);
  });

  it("lets branch admins open home, their workspaces and branch sections", () => {
    expect(canOpenPath("branch_admin", "/")).toBe(true);
    expect(canOpenPath("branch_admin", "/workspace/kp2")).toBe(true);
    expect(canOpenPath("branch_admin", "/branches")).toBe(true);
    expect(canOpenPath("branch_admin", "/events")).toBe(true);
    expect(canOpenPath("branch_admin", "/messages")).toBe(true);
    expect(canOpenPath("branch_admin", "/visitors")).toBe(true);
  });

  it("redirects branch admins away from everything else", () => {
    expect(canOpenPath("branch_admin", "/users")).toBe(false);
    expect(canOpenPath("branch_admin", "/sermons")).toBe(false);
    expect(canOpenPath("branch_admin", "/newsletter")).toBe(false);
    expect(canOpenPath("branch_admin", "/workspace/unknown")).toBe(false);
    expect(canOpenPath("branch_admin", "/branchesx")).toBe(false);
  });
});
