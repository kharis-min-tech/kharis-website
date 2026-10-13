"use client";

import { createContext, useContext } from "react";
import type { WorkspaceId } from "@/lib/workspaces";

const WorkspaceContext = createContext<WorkspaceId | null>(null);

export function WorkspaceProvider({
  value,
  children,
}: {
  value: WorkspaceId | null;
  children: React.ReactNode;
}) {
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspaceId() {
  return useContext(WorkspaceContext);
}
