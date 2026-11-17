"use client";

import { SunMedium } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { EmptyState, ErrorNotice, IconTile, SectionCard } from "@/components/studio/blocks";
import { AreaField, TextField } from "@/components/studio/fields";
import { PageHeader } from "@/components/studio/page-header";
import { PickWorkspace } from "@/components/studio/pick-workspace";
import { SermonPicker } from "@/components/studio/sermon-picker";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { confirmDelete } from "@/lib/confirm";
import { deleteDailyMessage, listDailyMessages, saveDailyMessage } from "@/lib/content-repo";
import { lookupSermons } from "@/lib/sermon-search";
import type { CatalogueSermon } from "@/lib/sermon-catalogue";
import type { DailyMessageRow } from "@/lib/types";
import { useWorkspaceId } from "@/lib/workspace-context";

function todayIso() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export default function DailyMessagePage() {
  const workspace = useWorkspaceId();
  const [rows, setRows] = useState<DailyMessageRow[] | null>(null);
  const [known, setKnown] = useState<Record<string, CatalogueSermon>>({});
  const [error, setError] = useState("");
  const [date, setDate] = useState(todayIso);
  const [picked, setPicked] = useState<CatalogueSermon | null>(null);
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
    <div>
      <PageHeader
        icon={<IconTile icon={SunMedium} className="h-12 w-12 rounded-2xl" />}
        title="Daily message"
        description="Choose a sermon from the Cloudflare catalogue for a date. The app plays that message. Saving the same date again replaces that day."
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <SectionCard
          title={editingId ? "Update schedule" : "Schedule a day"}
          className="studio-card-enter"
          bodyClassName="p-5"
        >
          <form className="space-y-4" onSubmit={onSave}>
            <TextField
              label="Date"
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <SermonPicker picked={picked} onPick={setPicked} onClear={() => setPicked(null)} />
            <AreaField
              label="Note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : editingId ? "Update" : "Schedule"}
              </Button>
              {editingId ? (
                <Button
                  type="button"
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
        </SectionCard>

        <div className="space-y-6">
          {rows === null ? (
            <Skeleton className="h-40" />
          ) : error ? (
            <ErrorNotice message={error} onRetry={refresh} />
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
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
    <SectionCard title={title} className="studio-card-enter" bodyClassName="p-5">
      {rows.length === 0 ? (
        <EmptyState title="None scheduled">
          Schedule a catalogue sermon for a date on the left.
        </EmptyState>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-background">
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
    </SectionCard>
  );
}
