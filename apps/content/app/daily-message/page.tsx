"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AreaField, SelectField, TextField } from "@/components/studio/fields";
import { PageHeader } from "@/components/studio/page-header";
import { PickWorkspace } from "@/components/studio/pick-workspace";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { confirmDelete } from "@/lib/confirm";
import {
  deleteDailyMessage,
  listDailyMessages,
  listSermons,
  saveDailyMessage,
} from "@/lib/content-repo";
import type { DailyMessageRow, SermonRow } from "@/lib/types";
import { useWorkspaceId } from "@/lib/workspace-context";

function todayIso() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export default function DailyMessagePage() {
  const workspace = useWorkspaceId();
  const [sermons, setSermons] = useState<SermonRow[]>([]);
  const [rows, setRows] = useState<DailyMessageRow[] | null>(null);
  const [error, setError] = useState("");
  const [date, setDate] = useState(todayIso);
  const [sermonId, setSermonId] = useState("");
  const [note, setNote] = useState("");
  const [editingId, setEditingId] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  function refresh() {
    setError("");
    listDailyMessages()
      .then(setRows)
      .catch((caught) => {
        setRows([]);
        setError(caught instanceof Error ? caught.message : "Could not load daily messages.");
      });
  }

  useEffect(() => {
    refresh();
    listSermons()
      .then(setSermons)
      .catch(() => setSermons([]));
  }, []);

  if (!workspace) return <PickWorkspace />;

  const today = todayIso();
  const upcoming = (rows ?? []).filter((row) => row.date >= today);
  const earlier = (rows ?? []).filter((row) => row.date < today).reverse();

  function sermonTitle(id: string | null) {
    return sermons.find((sermon) => sermon.id === id)?.title ?? "Sermon removed";
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await saveDailyMessage({ id: editingId, date, sermonId, note });
      toast.success(editingId ? "Message updated" : "Message scheduled");
      setEditingId(undefined);
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
    setSermonId(row.sermon_id ?? "");
    setNote(row.note ?? "");
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
          description="Pick a sermon for a date. Saving the same date again replaces that day."
        />
        <TextField
          label="Date"
          type="date"
          required
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
        <SelectField
          label="Sermon"
          required
          value={sermonId}
          onChange={(event) => setSermonId(event.target.value)}
        >
          <option value="">Choose a sermon</option>
          {sermons.map((sermon) => (
            <option key={sermon.id} value={sermon.id}>
              {sermon.title}
            </option>
          ))}
        </SelectField>
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
              sermonTitle={sermonTitle}
              onEdit={edit}
              onDelete={remove}
            />
            <MessageGroup
              title="Earlier"
              rows={earlier}
              sermonTitle={sermonTitle}
              onEdit={edit}
              onDelete={remove}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function MessageGroup({
  title,
  rows,
  sermonTitle,
  onEdit,
  onDelete,
}: {
  title: string;
  rows: DailyMessageRow[];
  sermonTitle: (id: string | null) => string;
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
                <p className="font-medium">{row.date.slice(0, 10)}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {sermonTitle(row.sermon_id)}
                </p>
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
