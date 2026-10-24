"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/studio/page-header";
import { PickWorkspace } from "@/components/studio/pick-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { confirmDelete } from "@/lib/confirm";
import { deleteMessage, listMessages, setMessageStatus } from "@/lib/content-repo";
import { messageSource } from "@/lib/message-source";
import type { ContactMessage, ContactStatus } from "@/lib/types";
import { formatWhen } from "@/lib/utils";
import { useWorkspaceId } from "@/lib/workspace-context";
import { WORKSPACES } from "@/lib/workspaces";

const STATUSES: ContactStatus[] = ["new", "read", "archived"];

export function MessageInbox() {
  const workspace = useWorkspaceId();
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

  return (
    <div>
      <PageHeader
        title="Messages"
        description={
          fresh
            ? `${fresh} new in this view.`
            : "Contact form inbox. Each message is marked Main site or KP2. Reply opens the visitor's email."
        }
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <Select
          aria-label="Workspace filter"
          value={scope}
          onChange={(event) => setScope(event.target.value)}
          className="max-w-48"
        >
          <option value="all">All workspaces</option>
          {WORKSPACES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Status filter"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="max-w-40"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Input
          value={search}
          placeholder="Search"
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-xs"
        />
      </div>
      {rows === null ? (
        <div className="space-y-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          No messages.
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((row) => {
            const open = openId === row.id;
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
              <li key={row.id} className="rounded-xl border border-border bg-card p-4">
                <button
                  type="button"
                  className="flex w-full flex-wrap items-center gap-2 text-left"
                  onClick={() => setOpenId(open ? null : row.id)}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">
                      {row.first_name} {row.last_name}
                    </span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {row.topic} · {formatWhen(row.created_at)}
                    </span>
                  </span>
                  <Badge tone={row.status === "new" ? "default" : "muted"}>{row.status}</Badge>
                  {source ? <Badge tone="accent">{source}</Badge> : null}
                  {sameInbox ? null : <Badge tone="muted">{inbox}</Badge>}
                </button>
                {open ? (
                  <div className="mt-3 space-y-3">
                    <p className="whitespace-pre-wrap text-sm">{row.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {row.email}
                      {row.phone ? ` · ${row.phone}` : ""}
                      {row.branch_name ? ` · ${row.branch_name}` : ""}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {row.status !== "read" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void update(row.id, "read")}
                        >
                          Mark read
                        </Button>
                      ) : null}
                      {row.status !== "archived" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void update(row.id, "archived")}
                        >
                          Archive
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void update(row.id, "read")}
                        >
                          Restore
                        </Button>
                      )}
                      <a
                        className="inline-flex h-8 items-center rounded-md border border-border px-2.5 text-xs font-medium hover:bg-accent"
                        href={`mailto:${row.email}?subject=${subject}`}
                      >
                        Reply
                      </a>
                      <Button size="sm" variant="ghost" onClick={() => void remove(row)}>
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
