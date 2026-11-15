import { getStudioMe, type StudioMe } from "@/lib/studio-api";
import { studioData } from "@/lib/studio-data";

export type StudioSession = { me: StudioMe; token: string };

/** Checks the request's bearer token with the Kharis API. Null when it is missing or invalid. */
export async function studioUserFromRequest(request: Request): Promise<StudioSession | null> {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : "";
  if (!token) return null;
  try {
    const me = await getStudioMe(token);
    return me.id ? { me, token } : null;
  } catch {
    return null;
  }
}

/** R2 is outside RLS, so upload routes check the account's role before writing. */
export async function studioCanEditBranch(studio: StudioSession, branchId: string) {
  if (studio.me.role === "super_admin") return true;
  return studio.me.role === "branch_admin" && studio.me.branchIds.includes(branchId);
}

export async function studioIsSuperAdmin(studio: StudioSession) {
  return studio.me.role === "super_admin";
}

/** The branch row as the signed-in user sees it, or null. */
export async function studioBranch(studio: StudioSession, branchId: string) {
  const [row] = await studioData.list<{
    id: string;
    hero_image_url: string | null;
    pastor_image_url: string | null;
  }>("branches", { where: { id: branchId }, limit: 1 }, { token: studio.token });
  return row ?? null;
}

/** Media rows tied to a branch (by branch_id or owner_id). */
export async function studioBranchMedia(studio: StudioSession, branchId: string) {
  return studioData.list<{ url: string | null; storage_path: string | null }>(
    "media",
    { where: { branch: branchId } },
    { token: studio.token },
  );
}
