"use client";

import { use } from "react";
import { SiteContentsPageEditor } from "@/components/studio/site-contents-editor";
import { PickWorkspace } from "@/components/studio/pick-workspace";
import { isSiteContentsWorkspace } from "@/lib/site-contents-schema";
import { useWorkspaceId } from "@/lib/workspace-context";

export default function SiteContentsPageRoute({ params }: { params: Promise<{ page: string }> }) {
  const { page } = use(params);
  const workspace = useWorkspaceId();
  if (!workspace) return <PickWorkspace />;
  if (!isSiteContentsWorkspace(workspace)) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Site contents belongs to the Kharis Website or KP2 Website workspace. Open one of those from
        the sidebar.
      </div>
    );
  }
  return <SiteContentsPageEditor workspace={workspace} pageId={page} />;
}
