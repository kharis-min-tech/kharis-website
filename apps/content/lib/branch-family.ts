import type { WorkspaceId } from "@/lib/workspaces";

/** Which network a branch belongs to. Saved as the branch's workspace. */
export type BranchFamily = "kharis" | "kp2";

export const FAMILY_LABEL: Record<BranchFamily, string> = {
  kharis: "Kharis Church",
  kp2: "KP2",
};

type FamilyFields = {
  workspace?: string | null;
  name?: string | null;
  slug?: string | null;
  group?: string | null;
};

/**
 * KP2 or Kharis. A branch saved as kp2 or kharis is taken at its word; rows still on the
 * old "general" default are read the way the websites read them, from the group, slug or a
 * "KP2" name prefix.
 */
export function branchFamily(row: FamilyFields): BranchFamily {
  if (row.workspace === "kp2") return "kp2";
  if (row.workspace === "kharis") return "kharis";
  const named = /^kp2\b/i.test((row.name ?? "").trim());
  const slugged = (row.slug ?? "").toLowerCase().startsWith("kp2-");
  const grouped = /phase 2/i.test(row.group ?? "");
  return named || slugged || grouped ? "kp2" : "kharis";
}

/** The family a new branch starts in, from the workspace the studio is open in. */
export function defaultFamily(workspace: WorkspaceId | null): BranchFamily {
  return workspace === "kp2" ? "kp2" : "kharis";
}

/** Where the branch page lives on the public site, without the scheme. */
export function branchPagePath(family: BranchFamily, slug: string) {
  const tail = slug.trim() || "…";
  return family === "kp2" ? `kharis.org/kp2/branches/${tail}` : `kharis.org/locations/${tail}`;
}
