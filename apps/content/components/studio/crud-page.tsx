"use client";

import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Avatar,
  EmptyState,
  ErrorNotice,
  GridSkeleton,
  IconTile,
  SearchInput,
  Toolbar,
} from "@/components/studio/blocks";
import { ImageDrop } from "@/components/studio/image-drop";
import { sectionIcon } from "@/components/studio/nav-meta";
import { PassagePicker } from "@/components/studio/passage-picker";
import { PageHeader } from "@/components/studio/page-header";
import { Panel } from "@/components/studio/panel";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { confirmDelete } from "@/lib/confirm";

function initialsOf(name: string) {
  const parts = name.split(/\s+/).filter((part) => /\w/.test(part));
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`;
  return (parts[0] ?? "?").slice(0, 2);
}

export type Field =
  | {
      key: string;
      label: string;
      kind: "text" | "textarea" | "date" | "url" | "time";
      placeholder?: string;
      detail?: (value: string) => string;
    }
  | { key: string; label: string; kind: "select"; options: { value: string; label: string }[] }
  | { key: string; label: string; kind: "toggle" }
  | { key: string; label: string; kind: "image"; folder: string }
  | { key: string; label: string; kind: "passage" };

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
  emptyText = "Nothing here yet.",
}: {
  title: string;
  description?: string;
  emptyText?: string;
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
  const pathname = usePathname();
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
        icon={<IconTile icon={sectionIcon(pathname)} className="h-12 w-12 rounded-2xl" />}
        title={title}
        description={description}
        action={
          <Button onClick={() => setEditing({ draft: blank() })}>
            <Plus className="h-4 w-4" />
            New
          </Button>
        }
      />
      <Toolbar>
        <SearchInput
          value={query}
          placeholder={`Search ${title.toLowerCase()}`}
          onChange={(event) => setQuery(event.target.value)}
        />
        {rows && !error ? (
          <span className="text-xs text-muted-foreground">
            {visible.length === rows.length
              ? `${rows.length} total`
              : `${visible.length} of ${rows.length}`}
          </span>
        ) : null}
      </Toolbar>
      {rows === null ? (
        <GridSkeleton />
      ) : error ? (
        <ErrorNotice message={error} onRetry={refresh} />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={rows.length ? Search : sectionIcon(pathname)}
          title={rows.length ? "No matches" : "Nothing here yet"}
          action={
            rows.length ? null : (
              <Button onClick={() => setEditing({ draft: blank() })}>
                <Plus className="h-4 w-4" />
                Add the first one
              </Button>
            )
          }
        >
          {rows.length ? "Try a different search." : emptyText}
        </EmptyState>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((row) => {
            const name = titleOf(row) || "Untitled";
            return (
              <li
                key={row.id}
                className="group flex flex-col rounded-xl border border-border bg-card shadow-card transition hover:border-brand-line"
              >
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-start gap-3.5 rounded-t-xl p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  onClick={() => setEditing({ id: row.id, draft: toDraft(row) })}
                >
                  <Avatar label={initialsOf(name)} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{name}</span>
                    {metaOf ? (
                      <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">
                        {metaOf(row)}
                      </span>
                    ) : null}
                  </span>
                </button>
                <div className="flex items-center justify-end gap-1 border-t border-border px-3 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditing({ id: row.id, draft: toDraft(row) })}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-danger hover:bg-danger-soft"
                    onClick={() => void onDelete(row)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </li>
            );
          })}
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

function selectOptions(options: { value: string; label: string }[], value: string) {
  if (!value || options.some((option) => option.value === value)) return options;
  return [{ value, label: value }, ...options];
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
  if (field.kind === "passage") {
    return <PassagePicker value={value} onChange={onChange} />;
  }
  return (
    <div>
      <Label htmlFor={field.key}>{field.label}</Label>
      {field.kind === "textarea" ? (
        <Textarea id={field.key} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : field.kind === "select" ? (
        <Select id={field.key} value={value} onChange={(event) => onChange(event.target.value)}>
          {selectOptions(field.options, value).map((option) => (
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
      {"detail" in field && field.detail ? (
        <p className="mt-1 text-xs text-muted-foreground">{field.detail(value)}</p>
      ) : null}
    </div>
  );
}
