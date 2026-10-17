/** Pure helpers for /api/contact: tidy input and decide where a message is filed. */

import { isKp2Branch } from "./contact-branches";

export const LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  branch: 120,
  message: 12000,
} as const;

/** Trimmed text, cut to a maximum length. */
export function cleanText(value: unknown, max: number): string {
  return String(value ?? "")
    .trim()
    .slice(0, max);
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value);
}

export type BranchRow = { id: string; name: string; workspace: string | null };

/**
 * The branch a message is filed under. An id from the form wins; otherwise the name is matched
 * against the directory (older forms only send a name). Unknown names are kept as plain text.
 */
export function resolveBranch(
  branches: BranchRow[],
  branchId: unknown,
  branchName: string,
): { branch_id: string | null; branch_name: string | null; workspace: "kharis" | "kp2" } {
  const byId = isUuid(branchId) ? branches.find((b) => b.id === branchId) : undefined;
  const wanted = branchName.trim().toLowerCase();
  const match =
    byId ?? (wanted ? branches.find((b) => b.name.trim().toLowerCase() === wanted) : undefined);

  if (match) {
    return {
      branch_id: match.id,
      branch_name: match.name,
      workspace: isKp2Branch(match) ? "kp2" : "kharis",
    };
  }
  return { branch_id: null, branch_name: branchName.trim() || null, workspace: "kharis" };
}
