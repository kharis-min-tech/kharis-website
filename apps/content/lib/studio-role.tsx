"use client";

import { createContext, useContext } from "react";
import type { StudioMe, StudioRole } from "@/lib/studio-api";

export type StudioAccess = {
  email: string;
  role: StudioRole;
  branchIds: string[];
  isSuperAdmin: boolean;
  canEditBranch: (id: string | null | undefined) => boolean;
  reload: () => void;
};

/** What the signed-in account may edit. RLS enforces the same rules on the server. */
export function studioAccess(
  me: (Pick<StudioMe, "role" | "branchIds"> & { email?: string }) | null,
  reload: () => void = () => undefined,
): StudioAccess {
  const role = me?.role ?? "none";
  const isSuperAdmin = role === "super_admin";
  const branchIds = role === "none" ? [] : (me?.branchIds ?? []);
  const editable = new Set(role === "branch_admin" ? branchIds : []);
  return {
    email: me?.email ?? "",
    role,
    branchIds,
    isSuperAdmin,
    canEditBranch: (id) => Boolean(id) && (isSuperAdmin || editable.has(id as string)),
    reload,
  };
}

const StudioRoleContext = createContext<StudioAccess>(studioAccess(null));

export function StudioRoleProvider({
  value,
  children,
}: {
  value: StudioAccess;
  children: React.ReactNode;
}) {
  return <StudioRoleContext.Provider value={value}>{children}</StudioRoleContext.Provider>;
}

export function useStudioRole() {
  return useContext(StudioRoleContext);
}
