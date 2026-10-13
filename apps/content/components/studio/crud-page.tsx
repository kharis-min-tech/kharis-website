"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ImageDrop } from "@/components/studio/image-drop";
import { PageHeader } from "@/components/studio/page-header";
import { Panel } from "@/components/studio/panel";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { confirmDelete } from "@/lib/confirm";

export type Field =
  | {
      key: string;
      label: string;
      kind: "text" | "textarea" | "date" | "url" | "time";
      placeholder?: string;
    }
  | { key: string; label: string; kind: "select"; options: { value: string; label: string }[] }
  | { key: string; label: string; kind: "toggle" }
  | { key: string; label: string; kind: "image"; folder: string };

export type Draft = Record<string, string>;

type Row = { id: string };

export function CrudPage<T extends Row>({
  title,
  description,
  loadKey,
  fields,
  load,
  blank,
  toDraft,
  save,
  remove,
  titleOf,
  metaOf,
  searchOf,
}: {
  title: string;
  description?: string;
  loadKey: string;
  fields: Field[];
  load: () => Promise<T[]>;
  blank: () => Draft;
  toDraft: (row: T) => Draft;
  save: (draft: Draft, id?: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  titleOf: (row: T) => string;
  metaOf?: (row: T) => string;
  searchOf: (row: T) => string;
}) {
  const [rows, setRows] = useState<T[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<{ id?: string; draft: Draft } | null>(null);
  const [saving, setSaving] = useState(false);
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((value) => value + 1), []);

  useEffect(() => {
    let cancelled = false;
    setError("");
    setRows(null);
    load()
      .then((next) => {
        if (!cancelled) setRows(next);
      })
      .catch((caught) => {
        if (cancelled) return;
        setRows([]);
        setError(caught instanceof Error ? caught.message : "Could not load this list.");
      });
    return () => {
      cancelled = true;
    };
    // `load` is recreated by the page; loadKey is the stable scope (workspace, kind).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadKey, tick]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!rows) return [];
    if (!needle) return rows;
    return rows.filter((row) => searchOf(row).toLowerCase().includes(needle));
  }, [query, rows, searchOf]);

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      await save(editing.draft, editing.id);
      toast.success(editing.id ? "Saved" : "Created");
      setEditing(null);
      refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(row: T) {
    const confirmed = await confirmDelete(titleOf(row) || "this item");
    if (!confirmed) return;
    try {
      await remove(row.id);
      toast.success("Deleted");
      refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Delete failed");
    }
  }

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        action={<Button onClick={() => setEditing({ draft: blank() })}>New</Button>}
      />
      <Input
        value={query}
        placeholder="Search"
        onChange={(event) => setQuery(event.target.value)}
        className="mb-4 max-w-sm"
      />
      {rows === null ? (
        <div className="space-y-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-border p-6">
          <p className="text-sm text-destructive">{error}</p>
          <Button className="mt-3" variant="outline" onClick={refresh}>
            Try again
          </Button>
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          Nothing here yet.
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {visible.map((row) => (
            <li key={row.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => setEditing({ id: row.id, draft: toDraft(row) })}
              >
                <p className="truncate font-medium">{titleOf(row) || "Untitled"}</p>
                {metaOf ? (
                  <p className="truncate text-sm text-muted-foreground">{metaOf(row)}</p>
                ) : null}
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing({ id: row.id, draft: toDraft(row) })}
              >
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => void onDelete(row)}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
      {editing ? (
        <Panel
          title={editing.id ? `Edit ${title}` : `New ${title}`}
          onClose={() => setEditing(null)}
        >
          <form className="space-y-4" onSubmit={onSave}>
            {fields.map((field) => (
              <FieldControl
                key={field.key}
                field={field}
                value={editing.draft[field.key] ?? ""}
                onChange={(value) =>
                  setEditing({ ...editing, draft: { ...editing.draft, [field.key]: value } })
                }
              />
            ))}
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </Panel>
      ) : null}
    </div>
  );
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string;
  onChange: (value: string) => void;
}) {
  if (field.kind === "toggle") {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="h-4 w-4 accent-[var(--primary)]"
          checked={value === "true"}
          onChange={(event) => onChange(event.target.checked ? "true" : "false")}
        />
        {field.label}
      </label>
    );
  }
  if (field.kind === "image") {
    return (
      <ImageDrop label={field.label} folder={field.folder} value={value} onChange={onChange} />
    );
  }
  return (
    <div>
      <Label htmlFor={field.key}>{field.label}</Label>
      {field.kind === "textarea" ? (
        <Textarea id={field.key} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : field.kind === "select" ? (
        <Select id={field.key} value={value} onChange={(event) => onChange(event.target.value)}>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          id={field.key}
          type={field.kind === "text" ? "text" : field.kind}
          placeholder={"placeholder" in field ? field.placeholder : undefined}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  );
}
