"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AreaField, TextField } from "@/components/studio/fields";
import { PageHeader } from "@/components/studio/page-header";
import { PickWorkspace } from "@/components/studio/pick-workspace";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { confirmDelete } from "@/lib/confirm";
import { deleteDailyMessage, listDailyMessages, saveDailyMessage } from "@/lib/content-repo";
import { lookupSermons, searchSermons } from "@/lib/sermon-search";
import type { CatalogueSermon } from "@/lib/sermon-catalogue";
import type { DailyMessageRow } from "@/lib/types";
import { useWorkspaceId } from "@/lib/workspace-context";
import { cn } from "@/lib/utils";

function todayIso() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function sermonLine(sermon: CatalogueSermon) {
  return [sermon.speaker, sermon.date, sermon.scripture].filter(Boolean).join(" · ");
}

export default function DailyMessagePage() {
  const workspace = useWorkspaceId();
  const [rows, setRows] = useState<DailyMessageRow[] | null>(null);
  const [known, setKnown] = useState<Record<string, CatalogueSermon>>({});
  const [error, setError] = useState("");
  const [date, setDate] = useState(todayIso);
  const [picked, setPicked] = useState<CatalogueSermon | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CatalogueSermon[]>([]);
  const [searching, setSearching] = useState(false);
  const [note, setNote] = useState("");
  const [editingId, setEditingId] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const remember = useCallback((sermons: CatalogueSermon[]) => {
    setKnown((current) => {
      const next = { ...current };
      for (const sermon of sermons) next[sermon.id] = sermon;
      return next;
    });
  }, []);

  const refresh = useCallback(() => {
    setError("");
    listDailyMessages()
      .then((next) => {
        setRows(next);
        const ids = next.map((row) => row.sermon_id ?? "").filter(Boolean);
        if (ids.length === 0) return;
        lookupSermons(ids)
          .then(remember)
          .catch(() => undefined);
      })
      .catch((caught) => {
        setRows([]);
        setError(caught instanceof Error ? caught.message : "Could not load daily messages.");
      });
  }, [remember]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const needle = query.trim();
    if (needle.length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setSearching(true);
      searchSermons(needle)
        .then((sermons) => {
          if (!cancelled) setResults(sermons);
        })
        .catch((caught) => {
          if (!cancelled) {
            setResults([]);
            toast.error(caught instanceof Error ? caught.message : "Search failed.");
          }
        })
        .finally(() => {
          if (!cancelled) setSearching(false);
        });
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  if (!workspace) return <PickWorkspace />;

  const today = todayIso();
  const upcoming = (rows ?? []).filter((row) => row.date >= today);
  const earlier = (rows ?? []).filter((row) => row.date < today).reverse();

  function titleFor(id: string | null) {
    if (!id) return "No sermon";
    return known[id]?.title ?? "Not in the sermon catalogue";
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    if (!workspace) return;
    if (!picked) {
      toast.error("Choose a sermon from the catalogue.");
      return;
    }
    setSaving(true);
    try {
      await saveDailyMessage({
        id: editingId,
        date,
        sermonId: picked.id,
        sermonTitle: picked.title,
        note,
        workspace,
      });
      remember([picked]);
      toast.success(editingId ? "Message updated" : "Message scheduled");
      setEditingId(undefined);
      setPicked(null);
      setQuery("");
      setNote("");
      refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not save the message.");
    } finally {
      setSaving(false);
    }
  }

  function edit(row: DailyMessageRow) {
    setEditingId(row.id);
    setDate(row.date.slice(0, 10));
    setNote(row.note ?? "");
    setQuery("");
    const match = row.sermon_id ? known[row.sermon_id] : undefined;
    setPicked(
      match ??
        (row.sermon_id
          ? {
              id: row.sermon_id,
              title: "Not in the sermon catalogue",
              speaker: "",
              date: "",
              scripture: "",
              series: "",
            }
          : null),
    );
  }

  async function remove(row: DailyMessageRow) {
    const confirmed = await confirmDelete(row.date);
    if (!confirmed) return;
    try {
      await deleteDailyMessage(row.id);
      toast.success("Removed");
      refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not delete the message.");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <form className="space-y-4" onSubmit={onSave}>
        <PageHeader
          title="Daily message"
          description="Choose a sermon from the Cloudflare catalogue for a date. The app plays that message. Saving the same date again replaces that day."
        />
        <TextField
          label="Date"
          type="date"
          required
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
        <SermonPicker
          query={query}
          onQuery={setQuery}
          searching={searching}
          results={results}
          picked={picked}
          onPick={(sermon) => {
            setPicked(sermon);
            setQuery("");
            setResults([]);
          }}
          onClear={() => setPicked(null)}
        />
        <AreaField label="Note" value={note} onChange={(event) => setNote(event.target.value)} />
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : editingId ? "Update" : "Schedule"}
          </Button>
          {editingId ? (
            <Button
              variant="outline"
              onClick={() => {
                setEditingId(undefined);
                setPicked(null);
                setNote("");
              }}
            >
              Cancel
            </Button>
          ) : null}
        </div>
      </form>
      <div>
        {rows === null ? (
          <Skeleton className="h-40" />
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <div className="space-y-6">
            <MessageGroup
              title="Upcoming"
              rows={upcoming}
              titleFor={titleFor}
              onEdit={edit}
              onDelete={remove}
            />
            <MessageGroup
              title="Earlier"
              rows={earlier}
              titleFor={titleFor}
              onEdit={edit}
              onDelete={remove}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SermonPicker({
  query,
  onQuery,
  searching,
  results,
  picked,
  onPick,
  onClear,
}: {
  query: string;
  onQuery: (value: string) => void;
  searching: boolean;
  results: CatalogueSermon[];
  picked: CatalogueSermon | null;
  onPick: (sermon: CatalogueSermon) => void;
  onClear: () => void;
}) {
  const needle = query.trim();
  return (
    <div>
      <Label htmlFor="sermon-search">Sermon</Label>
      {picked ? (
        <div className="mb-3 rounded-xl border border-primary/40 bg-primary/5 p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium">{picked.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {sermonLine(picked) || "From the sermon catalogue"}
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={onClear}>
              Change
            </Button>
          </div>
        </div>
      ) : (
        <p className="mb-2 text-xs text-muted-foreground">
          Search the catalogue by title, speaker, or scripture, then choose a sermon.
        </p>
      )}
      <Input
        id="sermon-search"
        value={query}
        placeholder="Search title, speaker or scripture"
        onChange={(event) => onQuery(event.target.value)}
      />
      {searching ? (
        <p className="mt-2 text-xs text-muted-foreground">Searching the catalogue…</p>
      ) : null}
      {!searching && needle.length >= 2 && results.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">No sermons match “{needle}”.</p>
      ) : null}
      {results.length > 0 ? (
        <ul className="mt-2 max-h-80 overflow-auto rounded-xl border border-border bg-card">
          {results.map((sermon) => {
            const selected = picked?.id === sermon.id;
            return (
              <li key={sermon.id} className="border-b border-border last:border-b-0">
                <button
                  type="button"
                  className={cn(
                    "w-full px-3 py-3 text-left transition-colors hover:bg-accent",
                    selected && "bg-primary/10",
                  )}
                  onClick={() => onPick(sermon)}
                >
                  <span className="block font-medium">{sermon.title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    {sermon.speaker ? <span>{sermon.speaker}</span> : null}
                    {sermon.date ? <span>{sermon.date}</span> : null}
                    {sermon.scripture ? (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-foreground">
                        {sermon.scripture}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function MessageGroup({
  title,
  rows,
  titleFor,
  onEdit,
  onDelete,
}: {
  title: string;
  rows: DailyMessageRow[];
  titleFor: (id: string | null) => string;
  onEdit: (row: DailyMessageRow) => void;
  onDelete: (row: DailyMessageRow) => void;
}) {
  return (
    <section>
      <h2 className="font-heading text-lg font-semibold">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">None scheduled.</p>
      ) : (
        <ul className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {rows.map((row) => (
            <li key={row.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {row.date.slice(0, 10)}
                </p>
                <p className="truncate font-medium">{titleFor(row.sermon_id)}</p>
                {row.note ? (
                  <p className="truncate text-sm text-muted-foreground">{row.note}</p>
                ) : null}
              </div>
              <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(row)}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
