"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/studio/page-header";
import { PickWorkspace } from "@/components/studio/pick-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { confirmDelete } from "@/lib/confirm";
import { deleteNewsletter, listNewsletter } from "@/lib/content-repo";
import type { NewsletterSubscriber } from "@/lib/types";
import { formatWhen } from "@/lib/utils";
import { useWorkspaceId } from "@/lib/workspace-context";

function sourceLabel(source: string) {
  if (source === "kp2") return "KP2";
  if (source === "kharis") return "Main site";
  return source;
}

export function NewsletterList() {
  const workspace = useWorkspaceId();
  const [rows, setRows] = useState<NewsletterSubscriber[] | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!workspace) return;
    let cancelled = false;
    setRows(null);
    setError("");
    listNewsletter(workspace)
      .then((next) => {
        if (!cancelled) setRows(next);
      })
      .catch((caught) => {
        if (cancelled) return;
        setRows([]);
        setError(caught instanceof Error ? caught.message : "Could not load newsletter emails.");
      });
    return () => {
      cancelled = true;
    };
  }, [workspace]);

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!rows || !needle) return rows ?? [];
    return rows.filter((row) => row.email.toLowerCase().includes(needle));
  }, [rows, search]);

  if (!workspace) return <PickWorkspace />;

  async function remove(row: NewsletterSubscriber) {
    const confirmed = await confirmDelete(row.email);
    if (!confirmed) return;
    try {
      await deleteNewsletter(row.id);
      setRows((current) => current?.filter((item) => item.id !== row.id) ?? current);
      toast.success("Removed");
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not remove that email.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Newsletter"
        description="Email addresses from the public signup. KP2 Website shows KP2 signups. General shows every site."
      />
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search email"
        aria-label="Search newsletter emails"
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {rows === null ? (
        <Skeleton className="h-24 w-full" />
      ) : visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          No newsletter emails yet.
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          {visible.map((row) => (
            <li key={row.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <a
                className="font-medium underline-offset-2 hover:underline"
                href={`mailto:${row.email}`}
              >
                {row.email}
              </a>
              <Badge tone="accent">{sourceLabel(row.source)}</Badge>
              <span className="text-sm text-muted-foreground">{formatWhen(row.created_at)}</span>
              <Button className="ml-auto" variant="ghost" onClick={() => remove(row)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
