"use client";

import { DocumentsEditor } from "@/components/studio/documents-editor";
import { PickWorkspace } from "@/components/studio/pick-workspace";
import { useWorkspaceId } from "@/lib/workspace-context";

export default function DocumentsPage() {
  const workspace = useWorkspaceId();
  if (!workspace) return <PickWorkspace />;
  return <DocumentsEditor />;
}
