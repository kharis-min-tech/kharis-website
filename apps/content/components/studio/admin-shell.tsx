"use client";

import {
  BookOpen,
  Calendar,
  Inbox,
  LogOut,
  Megaphone,
  Menu,
  Mic,
  Quote,
  Radio,
  SunMedium,
  Users,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Mark } from "@/components/studio/mark";
import { Button } from "@/components/ui/button";
import { countNewMessages } from "@/lib/content-repo";
import { getSupabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { WorkspaceProvider } from "@/lib/workspace-context";
import { hrefWithWorkspace, isWorkspaceId, WORKSPACES } from "@/lib/workspaces";

const ICONS: Record<string, LucideIcon> = {
  "/branches": Users,
  "/sermons": Mic,
  "/testimonies": Quote,
  "/visitors": Users,
  "/messages": Inbox,
  "/events": Calendar,
  "/announcements": Megaphone,
  "/daily": BookOpen,
  "/daily-message": SunMedium,
  "/daily-prayers": BookOpen,
  "/live": Radio,
  "/featured-video": Video,
};

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const workspaceParam = params.get("workspace");
  const pathWorkspace = pathname.startsWith("/workspace/") ? pathname.split("/")[2] : null;
  const workspace = isWorkspaceId(workspaceParam) ? workspaceParam : isWorkspaceId(pathWorkspace) ? pathWorkspace : null;
  const current = WORKSPACES.find((item) => item.id === workspace) ?? null;
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState<number | null>(null);

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
          <button className="fixed inset-0 z-30 bg-black/40 md:hidden" aria-label="Close menu" onClick={() => setOpen(false)} />
        ) : null}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-sidebar transition-transform md:static md:w-auto md:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center gap-3 border-b border-border px-4 py-4">
            <Mark />
            <div>
              <Link href="/" className="font-heading text-sm font-semibold">
                Content Studio
              </Link>
              <p className="text-xs text-muted-foreground">content.kharis.org</p>
            </div>
          </div>
          <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4" aria-label="Studio">
            <div>
              <p className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Workspaces</p>
              <ul className="mt-2 space-y-1">
                {WORKSPACES.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/workspace/${item.id}`}
                      className={cn(
                        "block rounded-md px-2 py-1.5 text-sm hover:bg-accent",
                        workspace === item.id && "bg-accent font-medium",
                      )}
                      aria-current={workspace === item.id ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {current ? (
              <div>
                <p className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{current.name}</p>
                <ul className="mt-2 space-y-1">
                  {current.nav.map((item) => {
                    const Icon = ICONS[item.href] ?? BookOpen;
                    const active = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={hrefWithWorkspace(item.href, workspace)}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent",
                            active && "bg-primary/15 font-medium text-primary",
                          )}
                          aria-current={active ? "page" : undefined}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="flex-1">{item.label}</span>
                          {item.href === "/messages" && unread ? (
                            <span className="rounded-md bg-primary px-1.5 text-xs text-primary-foreground">{unread}</span>
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <p className="px-2 text-sm text-muted-foreground">Choose a workspace to see its sections.</p>
            )}
          </nav>
        </aside>
        <div className="min-w-0">
          <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur">
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" onClick={() => setOpen((value) => !value)}>
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-sm font-semibold">{current?.name ?? "Content Studio"}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </header>
          <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </WorkspaceProvider>
  );
}
