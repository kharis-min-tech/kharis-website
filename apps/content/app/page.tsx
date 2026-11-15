"use client";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Church,
  Inbox,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  DateTile,
  IconTile,
  SectionCard,
  SectionLink,
  StatCard,
} from "@/components/studio/blocks";
import { SECTION_HINTS, WORKSPACE_ICONS, sectionIcon } from "@/components/studio/nav-meta";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { countRows, listEventSchedule, listRecentMessages } from "@/lib/content-repo";
import { studioRoleLabel } from "@/lib/studio-api";
import { dailyVerse, displayName, greeting, timeAgo, upcomingEvents } from "@/lib/studio-dashboard";
import { useStudioRole } from "@/lib/studio-role";
import type { ContactMessage, EventRow } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  hrefWithWorkspace,
  isWorkspaceId,
  workspacesForRole,
  type StudioWorkspace,
  type WorkspaceId,
} from "@/lib/workspaces";

type Pulse = {
  branches: number | null;
  newMessages: number | null;
  visitors: number | null;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function eventWorkspace(row: EventRow): WorkspaceId {
  if (isWorkspaceId(row.workspace)) return row.workspace;
  const site = row.sites?.find((item) => isWorkspaceId(item));
  return isWorkspaceId(site) ? site : "kharis";
}

function messageWorkspace(row: ContactMessage): WorkspaceId {
  return isWorkspaceId(row.workspace) ? row.workspace : "general";
}

function whenLabel(date: Date) {
  return date.toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default function OverviewPage() {
  const access = useStudioRole();
  const workspaces = workspacesForRole(access.role);
  const [now] = useState(() => new Date());
  const [pulse, setPulse] = useState<Pulse | undefined>(undefined);
  const [events, setEvents] = useState<EventRow[] | null>(null);
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      access.isSuperAdmin
        ? countRows("branches", {})
        : Promise.resolve<number | null>(access.branchIds.length),
      countRows("contact_messages", { status: "new" }),
      countRows("visitors", {}),
    ]).then(([branches, newMessages, visitors]) => {
      if (!cancelled) setPulse({ branches, newMessages, visitors });
    });
    listEventSchedule()
      .then((rows) => {
        if (!cancelled) setEvents(rows);
      })
      .catch(() => {
        if (!cancelled) setEvents([]);
      });
    listRecentMessages()
      .then((rows) => {
        if (!cancelled) setMessages(rows);
      })
      .catch(() => {
        if (!cancelled) setMessages([]);
      });
    return () => {
      cancelled = true;
    };
  }, [access.isSuperAdmin, access.branchIds]);

  const schedule = useMemo(() => {
    if (!events) return null;
    const mine = access.isSuperAdmin
      ? events
      : events.filter((row) => access.canEditBranch(row.branch_id));
    return upcomingEvents(mine, now, 50);
  }, [events, access, now]);

  const thisMonth = schedule?.filter((item) => item.when.getTime() - now.getTime() < 30 * DAY_MS);
  const verse = dailyVerse(now);
  const eventsHome = hrefWithWorkspace("/events", "kharis");

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            {now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="mt-1 font-heading text-[1.75rem] font-bold tracking-tight md:text-[2rem]">
            {greeting(now.getHours())}, {displayName(access.email)}!
          </h1>
          <Badge className="mt-2">{studioRoleLabel(access.role)}</Badge>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={access.isSuperAdmin ? "Total branches" : "Your branches"}
          value={pulse?.branches}
          hint={access.isSuperAdmin ? "Campuses on the websites" : "Branches you can edit"}
          icon={Church}
          tone="brand"
          href={hrefWithWorkspace("/branches", "general")}
        />
        <StatCard
          label="Upcoming events"
          value={thisMonth === undefined ? undefined : thisMonth.length}
          hint="In the next 30 days"
          icon={CalendarDays}
          tone="success"
          href={eventsHome}
        />
        <StatCard
          label="Visitors"
          value={pulse?.visitors}
          hint="Planned a visit"
          icon={UserPlus}
          tone="gold"
          href={hrefWithWorkspace("/visitors", "general")}
        />
        <StatCard
          label="New messages"
          value={pulse?.newMessages}
          hint={pulse?.newMessages ? "Waiting for a reply" : "Inbox is clear"}
          icon={Inbox}
          tone="danger"
          href={hrefWithWorkspace("/messages", "general")}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_18rem]">
        <SectionCard
          title="Upcoming events"
          action={<SectionLink href={eventsHome}>View all</SectionLink>}
        >
          {schedule === null ? (
            <RowsSkeleton />
          ) : schedule.length === 0 ? (
            <Quiet>No upcoming events. Add one from a workspace&apos;s Events page.</Quiet>
          ) : (
            <ul className="divide-y divide-border">
              {schedule.slice(0, 5).map(({ row, when }) => (
                <li key={row.id}>
                  <Link
                    href={hrefWithWorkspace("/events", eventWorkspace(row))}
                    className="flex items-center gap-3.5 px-5 py-3 transition-colors hover:bg-accent"
                  >
                    <DateTile date={when} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{row.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {[whenLabel(when), row.branch_name || row.location || "All campuses"]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    {row.recurrence === "weekly" ? <Badge tone="muted">Weekly</Badge> : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Recent messages"
          action={
            <SectionLink href={hrefWithWorkspace("/messages", "general")}>View all</SectionLink>
          }
        >
          {messages === null ? (
            <RowsSkeleton />
          ) : messages.length === 0 ? (
            <Quiet>
              {access.isSuperAdmin ? "No messages yet." : "No messages for your branches yet."}
            </Quiet>
          ) : (
            <ul className="divide-y divide-border">
              {messages.map((row) => {
                const name = `${row.first_name} ${row.last_name}`.trim() || row.email;
                return (
                  <li key={row.id}>
                    <Link
                      href={hrefWithWorkspace("/messages", messageWorkspace(row))}
                      className="flex items-center gap-3.5 px-5 py-3 transition-colors hover:bg-accent"
                    >
                      <Avatar label={initialsOf(name)} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {row.topic || row.message}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="text-[11px] text-muted-foreground">
                          {timeAgo(row.created_at, now)}
                        </span>
                        {row.status === "new" ? <Badge tone="gold">New</Badge> : null}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>

        <div className="flex flex-col gap-4">
          <QuickActions workspaces={workspaces} isSuperAdmin={access.isSuperAdmin} />
          <figure className="rounded-xl border border-gold-line bg-gradient-to-b from-gold-soft to-card p-5 shadow-card">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-gold">
              <BookOpen className="h-3.5 w-3.5" />
              Daily verse
            </p>
            <blockquote className="mt-3 font-heading text-[15px] italic leading-relaxed text-foreground/90">
              &ldquo;{verse.text}&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-xs font-semibold text-gold">
              — {verse.reference}
            </figcaption>
          </figure>
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="studio-eyebrow">Workspaces</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Kharis.org, the KP2 path and the mobile app all read from this studio.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {workspaces.map((workspace) => (
            <WorkspaceTile key={workspace.id} workspace={workspace} />
          ))}
        </div>
      </section>
    </div>
  );
}

function initialsOf(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`;
  return (parts[0] ?? "?").slice(0, 2);
}

function Quiet({ children }: { children: React.ReactNode }) {
  return <p className="px-5 py-8 text-center text-sm text-muted-foreground">{children}</p>;
}

function RowsSkeleton() {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex items-center gap-3.5">
          <Skeleton className="h-11 w-11 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function QuickActions({
  workspaces,
  isSuperAdmin,
}: {
  workspaces: StudioWorkspace[];
  isSuperAdmin: boolean;
}) {
  const allowed = new Set(
    workspaces.flatMap((workspace) => workspace.nav.map((item) => item.href)),
  );
  const actions: { href: string; label: string; icon: LucideIcon }[] = [
    { href: hrefWithWorkspace("/branches", "general"), label: "Manage branches", icon: Church },
    {
      href: hrefWithWorkspace("/events", "kharis"),
      label: "Add an event",
      icon: sectionIcon("/events"),
    },
    {
      href: hrefWithWorkspace("/announcements", "kharis"),
      label: "Post an announcement",
      icon: sectionIcon("/announcements"),
    },
    {
      href: hrefWithWorkspace("/daily", "app"),
      label: "Schedule daily reading",
      icon: sectionIcon("/daily"),
    },
    {
      href: hrefWithWorkspace("/users", "general"),
      label: "Invite a user",
      icon: sectionIcon("/users"),
    },
  ].filter((action) => isSuperAdmin || allowed.has(action.href.split("?")[0]!));

  return (
    <SectionCard title="Quick actions">
      <ul className="divide-y divide-border">
        {actions.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="group flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors hover:bg-accent"
            >
              <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-brand" />
              <span className="flex-1">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

function WorkspaceTile({ workspace }: { workspace: StudioWorkspace }) {
  const Icon = WORKSPACE_ICONS[workspace.id];
  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-brand-line hover:shadow-pop">
      <div className="flex items-start gap-4">
        <IconTile icon={Icon} />
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-base font-semibold">
            <Link
              href={`/workspace/${workspace.id}`}
              className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none"
            >
              {workspace.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{workspace.description}</p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-brand" />
      </div>
      <ul className="relative mt-4 flex flex-wrap gap-1.5">
        {workspace.nav.map((item) => {
          const SectionIcon = sectionIcon(item.href);
          return (
            <li key={item.href}>
              <Link
                href={hrefWithWorkspace(item.href, workspace.id)}
                title={SECTION_HINTS[item.href]}
                className={cn(
                  "relative z-10 inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/60 px-2 py-1 text-xs font-medium text-muted-foreground transition-colors",
                  "hover:border-brand-line hover:bg-brand-soft hover:text-foreground",
                )}
              >
                <SectionIcon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
