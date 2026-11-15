"use client";

import { ArrowRight, Compass } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { EmptyState, IconTile } from "@/components/studio/blocks";
import { SECTION_HINTS, WORKSPACE_ICONS, sectionIcon } from "@/components/studio/nav-meta";
import { PageHeader } from "@/components/studio/page-header";
import { buttonClasses } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { countRows } from "@/lib/content-repo";
import { useStudioRole, type StudioAccess } from "@/lib/studio-role";
import { hrefWithWorkspace, workspacesForRole, type WorkspaceId } from "@/lib/workspaces";

const COUNTS: Record<
  string,
  (workspace: WorkspaceId, access: StudioAccess) => Promise<number | null>
> = {
  "/branches": (_workspace, access) =>
    access.isSuperAdmin ? countRows("branches", {}) : Promise.resolve(access.branchIds.length),
  "/sermons": () => countRows("sermons", {}),
  "/visitors": () => countRows("visitors", {}),
  "/events": (workspace, access) =>
    countRows("events", { workspace }, access.isSuperAdmin ? undefined : access.branchIds),
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
  const access = useStudioRole();
  const workspace = useMemo(
    () => workspacesForRole(access.role).find((item) => item.id === params.id) ?? null,
    [access.role, params.id],
  );
  const [counts, setCounts] = useState<Record<string, number | null>>({});

  useEffect(() => {
    if (!workspace) return;
    let cancelled = false;
    Promise.all(
      workspace.nav.map(async (item) => {
        const load = COUNTS[item.href];
        const count = load ? await load(workspace.id, access) : null;
        return [item.href, count] as const;
      }),
    ).then((entries) => {
      if (!cancelled) setCounts(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, [workspace, access]);

  if (!workspace) {
    return (
      <EmptyState
        icon={Compass}
        title="Unknown workspace"
        action={
          <Link href="/" className={buttonClasses("outline")}>
            Back to overview
          </Link>
        }
      >
        That workspace doesn&apos;t exist, or your account can&apos;t open it.
      </EmptyState>
    );
  }

  return (
    <div>
      <PageHeader
        back={{ href: "/", label: "Overview" }}
        icon={<IconTile icon={WORKSPACE_ICONS[workspace.id]} className="h-12 w-12 rounded-2xl" />}
        title={workspace.name}
        description={workspace.description}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {workspace.nav.map((item) => {
          const Icon = sectionIcon(item.href);
          const loaded = item.href in counts;
          const count = counts[item.href];
          return (
            <Link
              key={item.href}
              href={hrefWithWorkspace(item.href, workspace.id)}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-brand-line hover:shadow-pop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-start justify-between gap-3">
                <IconTile icon={Icon} />
                {!loaded ? (
                  <Skeleton className="h-7 w-10" />
                ) : count === null || count === undefined ? null : (
                  <span className="font-heading text-2xl font-bold leading-none text-brand">
                    {count}
                  </span>
                )}
              </div>
              <p className="mt-4 font-heading text-[15px] font-semibold">{item.label}</p>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">
                {SECTION_HINTS[item.href]}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand">
                Open
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
