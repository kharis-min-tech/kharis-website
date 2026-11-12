"use client";

import { Mail, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  EmptyState,
  ErrorNotice,
  IconTile,
  ListSkeleton,
  SearchInput,
  Toolbar,
} from "@/components/studio/blocks";
import { PageHeader } from "@/components/studio/page-header";
import { PickWorkspace } from "@/components/studio/pick-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <div>
      <PageHeader
        icon={<IconTile icon={Mail} className="h-12 w-12 rounded-2xl" />}
        title="Newsletter"
        description="Email addresses from the public signup. KP2 Website shows KP2 signups. General shows every site."
      />
      <Toolbar>
        <SearchInput
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search email"
          aria-label="Search newsletter emails"
        />
        {rows && !error ? (
          <span className="text-xs text-muted-foreground">
            {visible.length} subscriber{visible.length === 1 ? "" : "s"}
          </span>
        ) : null}
      </Toolbar>
      {rows === null ? (
        <ListSkeleton />
      ) : error ? (
        <ErrorNotice message={error} />
      ) : visible.length === 0 ? (
        <EmptyState icon={Mail} title={search.trim() ? "No matches" : "No subscribers yet"}>
          {search.trim()
            ? "Try a different search."
            : "Emails from the newsletter signup will show up here."}
        </EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="studio-eyebrow px-5 py-3">Email</th>
                <th className="studio-eyebrow px-5 py-3">Source</th>
                <th className="studio-eyebrow px-5 py-3">Signed up</th>
                <th className="px-5 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-accent/60">
                  <td className="px-5 py-3">
                    <a
                      className="font-medium underline-offset-2 hover:text-brand hover:underline"
                      href={`mailto:${row.email}`}
                    >
                      {row.email}
                    </a>
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={row.source === "kp2" ? "gold" : "default"}>
                      {sourceLabel(row.source)}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">
                    {formatWhen(row.created_at)}
                  </td>
                  <td className="px-5 py-2 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-danger hover:bg-danger-soft"
                      onClick={() => remove(row)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
