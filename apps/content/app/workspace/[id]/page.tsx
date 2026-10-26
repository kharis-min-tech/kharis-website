"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/studio/page-header";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { countRows } from "@/lib/content-repo";
import { hrefWithWorkspace, workspaceById, type WorkspaceId } from "@/lib/workspaces";

const COUNTS: Record<string, (workspace: WorkspaceId) => Promise<number | null>> = {
  "/branches": () => countRows("branches", {}),
  "/sermons": () => countRows("sermons", {}),
  "/visitors": () => countRows("visitors", {}),
  "/events": (workspace) => countRows("events", { workspace }),
  "/announcements": (workspace) => countRows("news", { workspace }),
  "/testimonies": (workspace) => countRows("testimonies", { workspace }),
  "/daily": (workspace) => countRows("daily_entries", { workspace, kind: "reading" }),
  "/daily-prayers": (workspace) => countRows("daily_entries", { workspace, kind: "prayer" }),
  "/daily-message": () => countRows("daily_messages", {}),
  "/bible": () => Promise.resolve(null),
  "/sermon-library": () => Promise.resolve(null),
  "/live": () => countRows("app_config", { key: "live_stream" }),
  "/featured-video": (workspace) => countRows("featured_videos", { workspace }),
  "/messages": (workspace) => countRows("contact_messages", { workspace }),
  "/newsletter": (workspace) =>
    workspace === "general"
      ? countRows("newsletter_subscribers", {})
      : countRows("newsletter_subscribers", { source: workspace }),
};

export default function WorkspacePage() {
  const params = useParams<{ id: string }>();
  const workspace = workspaceById(params.id);
  const [counts, setCounts] = useState<Record<string, number | null>>({});

  useEffect(() => {
    if (!workspace) return;
    let cancelled = false;
    Promise.all(
      workspace.nav.map(async (item) => {
        const load = COUNTS[item.href];
        const count = load ? await load(workspace.id) : null;
        return [item.href, count] as const;
      }),
    ).then((entries) => {
      if (!cancelled) setCounts(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, [workspace]);

  if (!workspace) {
    return (
      <div>
        <h1 className="font-heading text-2xl font-semibold">Unknown workspace</h1>
        <Link href="/" className={buttonClasses("outline", "default", "mt-4")}>
          Back to workspaces
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={workspace.name} description={workspace.description} />
      <div className="grid gap-3 sm:grid-cols-2">
        {workspace.nav.map((item) => (
          <Link key={item.href} href={hrefWithWorkspace(item.href, workspace.id)}>
            <Card className="flex items-center justify-between p-4 transition-colors hover:bg-accent">
              <span className="font-medium">{item.label}</span>
              {item.href in counts ? (
                <span className="text-sm text-muted-foreground">{counts[item.href] ?? "—"}</span>
              ) : (
                <Skeleton className="h-4 w-8" />
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
