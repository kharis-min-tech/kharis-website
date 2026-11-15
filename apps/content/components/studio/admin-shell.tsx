"use client";

import { BookOpen, ExternalLink, Gauge, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/studio/blocks";
import { Mark } from "@/components/studio/mark";
import { WORKSPACE_ICONS, sectionIcon } from "@/components/studio/nav-meta";
import { ThemeToggle } from "@/components/studio/theme-toggle";
import { Button } from "@/components/ui/button";
import { countNewMessages } from "@/lib/content-repo";
import { studioRoleLabel } from "@/lib/studio-api";
import { initials } from "@/lib/studio-dashboard";
import { useStudioRole } from "@/lib/studio-role";
import { getSupabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { WorkspaceProvider } from "@/lib/workspace-context";
import { canOpenPath, hrefWithWorkspace, isWorkspaceId, workspacesForRole } from "@/lib/workspaces";

const navItem =
  "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";
const navActive =
  "bg-brand-soft font-semibold text-foreground before:absolute before:inset-y-1.5 before:-left-3 before:w-[3px] before:rounded-r-full before:bg-brand hover:bg-brand-soft";

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const { role } = useStudioRole();
  const workspaces = workspacesForRole(role);
  const allowed = canOpenPath(role, pathname);
  const workspaceParam = params.get("workspace");
  const pathWorkspace = pathname.startsWith("/workspace/") ? pathname.split("/")[2] : null;
  const workspace = isWorkspaceId(workspaceParam)
    ? workspaceParam
    : isWorkspaceId(pathWorkspace)
      ? pathWorkspace
      : null;
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState<number | null>(null);

  useEffect(() => {
    if (!allowed) router.replace("/");
  }, [allowed, router]);

  useEffect(() => {
    setOpen(false);
  }, [pathname, workspace]);

  useEffect(() => {
    if (!workspace) {
      setUnread(null);
      return;
    }
    let cancelled = false;
    countNewMessages(workspace)
      .then((count) => {
        if (!cancelled) setUnread(count);
      })
      .catch(() => {
        if (!cancelled) setUnread(null);
      });
    return () => {
      cancelled = true;
    };
  }, [workspace, pathname]);

  async function signOut() {
    await getSupabase().auth.signOut();
  }

  return (
    <WorkspaceProvider value={workspace}>
      <div className="min-h-screen md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
        {open ? (
          <button
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-[2px] md:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
        ) : null}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-sidebar transition-transform md:sticky md:top-0 md:h-screen md:w-auto md:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center gap-3 px-5 pb-4 pt-5">
            <Mark />
            <Link href="/" className="min-w-0">
              <span className="block font-heading text-[15px] font-bold leading-tight">
                Content Studio
              </span>
              <span className="block text-xs text-muted-foreground">Kharis Church</span>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Studio">
            <ul className="space-y-0.5">
              <li>
                <Link
                  href="/"
                  className={cn(navItem, pathname === "/" && navActive)}
                  aria-current={pathname === "/" ? "page" : undefined}
                >
                  <Gauge
                    className={cn("h-4 w-4", pathname === "/" ? "text-brand" : "opacity-80")}
                  />
                  Overview
                </Link>
              </li>
            </ul>

            <p className="studio-eyebrow mb-1.5 mt-6 px-3">Workspaces</p>
            <ul className="space-y-0.5">
              {workspaces.map((item) => {
                const Icon = WORKSPACE_ICONS[item.id];
                const current = workspace === item.id;
                const onHome = pathname === `/workspace/${item.id}`;
                return (
                  <li key={item.id}>
                    <Link
                      href={`/workspace/${item.id}`}
                      className={cn(navItem, current && "text-foreground", onHome && navActive)}
                      aria-current={onHome ? "page" : undefined}
                    >
                      <Icon className={cn("h-4 w-4", current ? "text-brand" : "opacity-80")} />
                      <span className="flex-1 truncate">{item.name}</span>
                    </Link>
                    {current ? (
                      <ul className="relative mb-2 ml-[1.15rem] mt-0.5 space-y-0.5 border-l border-border pl-2.5">
                        {item.nav.map((section) => {
                          const SectionIcon = sectionIcon(section.href);
                          const active = pathname === section.href;
                          return (
                            <li key={section.href}>
                              <Link
                                href={hrefWithWorkspace(section.href, item.id)}
                                className={cn(
                                  navItem,
                                  "py-1.5",
                                  active &&
                                    "bg-brand-soft font-semibold text-foreground hover:bg-brand-soft",
                                )}
                                aria-current={active ? "page" : undefined}
                              >
                                <SectionIcon
                                  className={cn(
                                    "h-[15px] w-[15px]",
                                    active ? "text-brand" : "opacity-70",
                                  )}
                                />
                                <span className="flex-1 truncate">{section.label}</span>
                                {section.href === "/messages" && unread ? (
                                  <span className="rounded-full bg-primary px-1.5 py-px text-[10px] font-bold text-primary-foreground">
                                    {unread}
                                  </span>
                                ) : null}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            <p className="studio-eyebrow mb-1.5 mt-6 px-3">Help</p>
            <ul className="space-y-0.5">
              <li>
                <a href="/documentation" target="_blank" rel="noopener" className={navItem}>
                  <BookOpen className="h-4 w-4 opacity-80" />
                  <span className="flex-1 truncate">Documentation</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2.5 border-t border-border px-4 py-3">
            <Avatar label={initials(email)} className="h-8 w-8 text-[11px]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold" title={email}>
                {email}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">{studioRoleLabel(role)}</p>
            </div>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => void signOut()}
              aria-label="Sign out"
              title="Sign out"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-2.5 backdrop-blur md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <Mark className="h-8 w-8" />
            <span className="font-heading text-sm font-bold">Content Studio</span>
          </header>
          <main className="mx-auto w-full max-w-[90rem] px-4 py-6 sm:px-6 md:px-10 md:py-9">
            {allowed ? children : null}
          </main>
        </div>
      </div>
    </WorkspaceProvider>
  );
}
