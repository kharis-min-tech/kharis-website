"use client";

import {
  Archive,
  ArchiveRestore,
  Check,
  ChevronDown,
  Church,
  Clock,
  Inbox,
  Mail,
  Phone,
  Reply,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Avatar,
  EmptyState,
  ErrorNotice,
  IconTile,
  ListSkeleton,
  SearchInput,
  Toolbar,
} from "@/components/studio/blocks";
import { PageHeader } from "@/components/studio/page-header";
import { PickWorkspace } from "@/components/studio/pick-workspace";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Button, buttonClasses } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { confirmDelete } from "@/lib/confirm";
import { deleteMessage, listMessages, setMessageStatus } from "@/lib/content-repo";
import { messageSource } from "@/lib/message-source";
import { timeAgo } from "@/lib/studio-dashboard";
import { useStudioRole } from "@/lib/studio-role";
import type { ContactMessage, ContactStatus } from "@/lib/types";
import { cn, formatWhen } from "@/lib/utils";
import { useWorkspaceId } from "@/lib/workspace-context";
import { WORKSPACES } from "@/lib/workspaces";

const STATUSES: ContactStatus[] = ["new", "read", "archived"];

const STATUS_TONES: Record<ContactStatus, BadgeTone> = {
  new: "gold",
  read: "muted",
  archived: "muted",
};

export function MessageInbox() {
  const workspace = useWorkspaceId();
  const { isSuperAdmin } = useStudioRole();
  const [scope, setScope] = useState(workspace ?? "all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<ContactMessage[] | null>(null);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (workspace) setScope(workspace);
  }, [workspace]);

  useEffect(() => {
    let cancelled = false;
    setRows(null);
    setError("");
    listMessages({ workspace: scope, status })
      .then((next) => {
        if (!cancelled) setRows(next);
      })
      .catch((caught) => {
        if (cancelled) return;
        setRows([]);
        setError(caught instanceof Error ? caught.message : "Could not load messages.");
      });
    return () => {
      cancelled = true;
    };
  }, [scope, status]);

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!rows) return [];
    if (!needle) return rows;
    return rows.filter((row) =>
      `${row.first_name} ${row.last_name} ${row.email} ${row.topic} ${row.branch_name ?? ""} ${row.message}`
        .toLowerCase()
        .includes(needle),
    );
  }, [rows, search]);

  if (!workspace) return <PickWorkspace />;

  async function update(id: string, next: ContactStatus) {
    try {
      await setMessageStatus(id, next);
      setRows(
        (current) =>
          current?.map((row) => (row.id === id ? { ...row, status: next } : row)) ?? current,
      );
      toast.success(next === "archived" ? "Archived" : "Marked read");
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not update the message.");
    }
  }

  async function remove(row: ContactMessage) {
    const confirmed = await confirmDelete(`${row.first_name} ${row.last_name}`);
    if (!confirmed) return;
    try {
      await deleteMessage(row.id);
      setRows((current) => current?.filter((item) => item.id !== row.id) ?? current);
      toast.success("Message deleted");
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not delete the message.");
    }
  }

  const fresh = visible.filter((row) => row.status === "new").length;
  const now = new Date();

  return (
    <div>
      <PageHeader
        icon={<IconTile icon={Inbox} className="h-12 w-12 rounded-2xl" />}
        title="Messages"
        description={
          fresh
            ? `${fresh} new in this view.`
            : "Contact form inbox. Each message is marked Main site or KP2. Reply opens the visitor's email."
        }
      />
      <Toolbar>
        <div
          role="tablist"
          aria-label="Status filter"
          className="inline-flex rounded-lg border border-border bg-card p-0.5"
        >
          {["all", ...STATUSES].map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={status === item}
              onClick={() => setStatus(item)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold capitalize text-muted-foreground transition-colors hover:text-foreground",
                status === item && "bg-brand-soft text-brand hover:text-brand",
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <Select
          aria-label="Workspace filter"
          value={scope}
          onChange={(event) => setScope(event.target.value)}
          className="h-9 w-auto"
        >
          <option value="all">All workspaces</option>
          {WORKSPACES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
        <SearchInput
          value={search}
          placeholder="Search name, email or message"
          onChange={(event) => setSearch(event.target.value)}
          className="sm:ml-auto"
        />
      </Toolbar>
      {rows === null ? (
        <ListSkeleton rows={4} />
      ) : error ? (
        <ErrorNotice message={error} />
      ) : visible.length === 0 ? (
        <EmptyState icon={Inbox} title={search.trim() ? "No matches" : "All caught up"}>
          {search.trim()
            ? "Try a different search."
            : isSuperAdmin
              ? "No messages in this view."
              : "No messages for your branches here yet. Messages sent to your branches will show up in this inbox."}
        </EmptyState>
      ) : (
        <ul className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
          {visible.map((row) => {
            const open = openId === row.id;
            const name = `${row.first_name} ${row.last_name}`.trim() || row.email;
            const subject = encodeURIComponent(`Re: ${row.topic}`);
            const source = messageSource(row.message, row.workspace);
            const inbox =
              row.workspace === "kp2"
                ? "KP2 inbox"
                : row.workspace === "kharis"
                  ? "Main inbox"
                  : row.workspace;
            const sameInbox =
              (source === "KP2" && row.workspace === "kp2") ||
              (source === "Main site" && row.workspace === "kharis");
            return (
              <li
                key={row.id}
                className={cn("border-b border-border last:border-b-0", open && "bg-muted/40")}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  className="flex w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  onClick={() => setOpenId(open ? null : row.id)}
                >
                  <span className="relative">
                    <Avatar label={initialsOf(name)} />
                    {row.status === "new" ? (
                      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-gold ring-2 ring-card" />
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block truncate text-sm",
                        row.status === "new" ? "font-semibold" : "font-medium",
                      )}
                    >
                      {name}
                    </span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {row.topic}
                      {row.message ? ` — ${row.message}` : ""}
                    </span>
                  </span>
                  <span className="hidden shrink-0 flex-wrap justify-end gap-1.5 sm:flex">
                    {source ? <Badge tone="accent">{source}</Badge> : null}
                    {sameInbox ? null : <Badge tone="muted">{inbox}</Badge>}
                    <Badge tone={STATUS_TONES[row.status]} className="capitalize">
                      {row.status}
                    </Badge>
                  </span>
                  <span
                    className="w-16 shrink-0 text-right text-xs text-muted-foreground"
                    title={formatWhen(row.created_at)}
                  >
                    {timeAgo(row.created_at, now)}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                      open && "rotate-180",
                    )}
                  />
                </button>
                {open ? (
                  <div className="space-y-4 px-5 pb-5 pl-[4.4rem]">
                    <p className="whitespace-pre-wrap rounded-lg border border-border bg-card p-4 text-sm leading-relaxed">
                      {row.message}
                    </p>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{row.email}</span>
                      </div>
                      {row.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{row.phone}</span>
                        </div>
                      ) : null}
                      {row.branch_name ? (
                        <div className="flex items-center gap-1.5">
                          <Church className="h-3.5 w-3.5" />
                          <span>{row.branch_name}</span>
                        </div>
                      ) : null}
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatWhen(row.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a
                        className={buttonClasses("default", "sm")}
                        href={`mailto:${row.email}?subject=${subject}`}
                      >
                        <Reply className="h-3.5 w-3.5" />
                        Reply
                      </a>
                      {row.status !== "read" && row.status !== "archived" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void update(row.id, "read")}
                        >
                          <Check className="h-3.5 w-3.5" />
                          Mark read
                        </Button>
                      ) : null}
                      {row.status !== "archived" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void update(row.id, "archived")}
                        >
                          <Archive className="h-3.5 w-3.5" />
                          Archive
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void update(row.id, "read")}
                        >
                          <ArchiveRestore className="h-3.5 w-3.5" />
                          Restore
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-danger hover:bg-danger-soft"
                        onClick={() => void remove(row)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function initialsOf(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`;
  return (parts[0] ?? "?").slice(0, 2);
}
