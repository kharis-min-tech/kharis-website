"use client";

import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  DateTile,
  EmptyState,
  ErrorNotice,
  GridSkeleton,
  IconTile,
  SearchInput,
  Toolbar,
} from "@/components/studio/blocks";
import { AreaField, SelectField, TextField, ToggleField } from "@/components/studio/fields";
import { ImageDrop } from "@/components/studio/image-drop";
import { PageHeader } from "@/components/studio/page-header";
import { Panel } from "@/components/studio/panel";
import { PickWorkspace } from "@/components/studio/pick-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { branchOptionLabel, listBranchOptions } from "@/lib/branches-repo";
import { confirmDelete } from "@/lib/confirm";
import { deleteEvent, listEvents, saveEvent } from "@/lib/content-repo";
import { useStudioRole } from "@/lib/studio-role";
import type { BranchOption, EventCategory, EventRow, EventSite } from "@/lib/types";
import { cn, formatWhen, splitTimestamp, toTimestamp } from "@/lib/utils";
import { useWorkspaceId } from "@/lib/workspace-context";

const CATEGORIES: EventCategory[] = ["service", "fellowship", "conference", "camp", "general"];
const SITES: { id: EventSite; label: string }[] = [
  { id: "kharis", label: "Kharis website" },
  { id: "kp2", label: "KP2 website" },
  { id: "app", label: "Mobile app" },
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type EventDraft = {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime: string;
  location: string;
  branchId: string;
  category: EventCategory;
  recurrence: "none" | "weekly";
  days: number[];
  until: string;
  sites: EventSite[];
  published: boolean;
  featured: boolean;
  imageUrl: string;
};

function blank(workspace: string, branchId = ""): EventDraft {
  const site = SITES.some((item) => item.id === workspace) ? [workspace as EventSite] : [];
  return {
    title: "",
    description: "",
    date: "",
    time: "10:00",
    endTime: "",
    location: "",
    branchId,
    category: "general",
    recurrence: "none",
    days: [],
    until: "",
    sites: site,
    published: true,
    featured: false,
    imageUrl: "",
  };
}

function fromRow(row: EventRow): EventDraft {
  const start = splitTimestamp(row.start_time);
  const end = splitTimestamp(row.end_time);
  const sites = (row.sites ?? []).filter((site): site is EventSite =>
    SITES.some((item) => item.id === site),
  );
  return {
    id: row.id,
    title: row.title ?? "",
    description: row.description ?? "",
    date: start.date,
    time: start.time,
    endTime: end.time,
    location: row.location ?? "",
    branchId: row.branch_id ?? "",
    category: row.category ?? "general",
    recurrence: row.recurrence === "weekly" ? "weekly" : "none",
    days: row.recurrence_days ?? [],
    until: row.recurrence_until ?? "",
    sites,
    published: sites.length > 0,
    featured: Boolean(row.is_featured),
    imageUrl: row.image_url ?? "",
  };
}

export function EventManager() {
  const workspace = useWorkspaceId();
  const { isSuperAdmin, canEditBranch } = useStudioRole();
  const [rows, setRows] = useState<EventRow[] | null>(null);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<EventDraft | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!workspace) return;
    let cancelled = false;
    setRows(null);
    setError("");
    listEvents(workspace)
      .then((next) => {
        if (!cancelled) setRows(next);
      })
      .catch((caught) => {
        if (cancelled) return;
        setRows([]);
        setError(caught instanceof Error ? caught.message : "Could not load events.");
      });
    listBranchOptions()
      .then((next) => {
        if (!cancelled) setBranches(next);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [workspace, saving]);

  const branchChoices = useMemo(
    () => branches.filter((branch) => canEditBranch(branch.id)),
    [branches, canEditBranch],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!rows) return [];
    const editable = isSuperAdmin ? rows : rows.filter((row) => canEditBranch(row.branch_id));
    if (!needle) return editable;
    return editable.filter((row) =>
      `${row.title} ${row.location ?? ""} ${row.branch_name ?? ""}`.toLowerCase().includes(needle),
    );
  }, [query, rows, isSuperAdmin, canEditBranch]);

  if (!workspace) return <PickWorkspace />;

  function openNew(scope: string) {
    const onlyBranch = !isSuperAdmin && branchChoices.length === 1 ? branchChoices[0]!.id : "";
    setDraft(blank(scope, onlyBranch));
  }

  function patch(partial: Partial<EventDraft>) {
    setDraft((current) => (current ? { ...current, ...partial } : current));
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    if (!draft || !workspace) return;
    if (draft.recurrence === "weekly" && draft.days.length === 0) {
      toast.error("Choose at least one weekday.");
      return;
    }
    if (!isSuperAdmin && !canEditBranch(draft.branchId)) {
      toast.error("Choose one of your branches.");
      return;
    }
    const startTime = toTimestamp(draft.date, draft.time);
    if (!startTime) {
      toast.error("Choose a date and time.");
      return;
    }
    setSaving(true);
    try {
      const branch = branches.find((item) => item.id === draft.branchId);
      await saveEvent({
        id: draft.id,
        title: draft.title,
        description: draft.description,
        location: draft.location,
        branchId: draft.branchId,
        branchName: branch?.name ?? "",
        startTime,
        endTime: draft.endTime ? toTimestamp(draft.date, draft.endTime) : null,
        category: draft.category,
        recurrence: draft.recurrence,
        recurrenceDays: draft.days,
        recurrenceUntil: draft.until,
        sites: draft.published ? draft.sites : [],
        featured: draft.featured,
        imageUrl: draft.imageUrl,
        workspace,
      });
      toast.success("Event saved");
      setDraft(null);
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(row: EventRow) {
    const confirmed = await confirmDelete(row.title);
    if (!confirmed) return;
    try {
      await deleteEvent(row.id);
      toast.success("Event deleted");
      setRows((current) => current?.filter((item) => item.id !== row.id) ?? current);
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Delete failed");
    }
  }

  return (
    <div>
      <PageHeader
        title="Events"
        description="Category, which sites show it, and an optional weekly repeat. Unpublished events are hidden because their site list is cleared."
        icon={<IconTile icon={CalendarDays} className="h-12 w-12 rounded-2xl" />}
        action={
          <Button onClick={() => openNew(workspace)}>
            <Plus className="h-4 w-4" />
            New event
          </Button>
        }
      />
      <Toolbar>
        <SearchInput
          value={query}
          placeholder="Search events"
          onChange={(event) => setQuery(event.target.value)}
        />
        {rows && !error ? (
          <span className="text-xs text-muted-foreground">
            {visible.length} event{visible.length === 1 ? "" : "s"}
          </span>
        ) : null}
      </Toolbar>
      {rows === null ? (
        <GridSkeleton />
      ) : error ? (
        <ErrorNotice message={error} />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title={query.trim() ? "No matches" : "No events yet"}
          action={
            query.trim() ? null : (
              <Button onClick={() => openNew(workspace)}>
                <Plus className="h-4 w-4" />
                New event
              </Button>
            )
          }
        >
          {query.trim()
            ? "Try a different search."
            : isSuperAdmin
              ? "No events in this workspace."
              : "No events for your branches in this workspace yet."}
        </EmptyState>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((row) => {
            const start = new Date(row.start_time);
            const hidden = (row.sites ?? []).length === 0;
            return (
              <li
                key={row.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition hover:border-brand-line"
              >
                <button
                  type="button"
                  className="flex flex-1 flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  onClick={() => setDraft(fromRow(row))}
                >
                  {row.image_url ? (
                    <img
                      src={row.image_url}
                      alt=""
                      className="h-32 w-full border-b border-border object-cover"
                      loading="lazy"
                    />
                  ) : null}
                  <span className="flex items-start gap-3.5 p-5">
                    {Number.isNaN(start.getTime()) ? null : <DateTile date={start} />}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{row.title}</span>
                      <span className="mt-0.5 block truncate text-sm text-muted-foreground">
                        {formatWhen(row.start_time)}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {row.branch_name || row.location || "All campuses"}
                      </span>
                    </span>
                  </span>
                </button>
                <div className="flex flex-wrap items-center gap-1.5 border-t border-border px-4 py-2.5">
                  {row.category ? (
                    <Badge tone="muted" className="capitalize">
                      {row.category}
                    </Badge>
                  ) : null}
                  {row.recurrence === "weekly" ? <Badge>Weekly</Badge> : null}
                  {hidden ? <Badge tone="gold">Hidden</Badge> : null}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-danger hover:bg-danger-soft"
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
      {draft ? (
        <Panel title={draft.id ? "Edit event" : "New event"} onClose={() => setDraft(null)}>
          <form className="space-y-4" onSubmit={onSave}>
            <TextField
              label="Title"
              required
              value={draft.title}
              onChange={(event) => patch({ title: event.target.value })}
            />
            <AreaField
              label="Description"
              value={draft.description}
              onChange={(event) => patch({ description: event.target.value })}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <TextField
                label="Date"
                type="date"
                required
                value={draft.date}
                onChange={(event) => patch({ date: event.target.value })}
              />
              <TextField
                label="Start"
                type="time"
                required
                value={draft.time}
                onChange={(event) => patch({ time: event.target.value })}
              />
              <TextField
                label="End"
                type="time"
                value={draft.endTime}
                onChange={(event) => patch({ endTime: event.target.value })}
              />
            </div>
            <TextField
              label="Location"
              value={draft.location}
              onChange={(event) => patch({ location: event.target.value })}
            />
            <SelectField
              label="Branch"
              required={!isSuperAdmin}
              value={draft.branchId}
              onChange={(event) => patch({ branchId: event.target.value })}
            >
              {isSuperAdmin ? (
                <option value="">No branch (all campuses)</option>
              ) : (
                <option value="" disabled>
                  Choose a branch
                </option>
              )}
              {branchChoices.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branchOptionLabel(branch)}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Category"
              value={draft.category}
              onChange={(event) => patch({ category: event.target.value as EventCategory })}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Repeats"
              value={draft.recurrence}
              onChange={(event) =>
                patch({ recurrence: event.target.value as EventDraft["recurrence"] })
              }
            >
              <option value="none">Does not repeat</option>
              <option value="weekly">Weekly</option>
            </SelectField>
            {draft.recurrence === "weekly" ? (
              <div className="space-y-3">
                <p className="text-sm font-medium">Weekdays</p>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAYS.map((label, index) => {
                    const checked = draft.days.includes(index);
                    return (
                      <label
                        key={label}
                        className={cn(
                          "cursor-pointer rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-brand-line has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                          checked && "border-brand-line bg-brand-soft text-brand",
                        )}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={checked}
                          onChange={() =>
                            patch({
                              days: checked
                                ? draft.days.filter((day) => day !== index)
                                : [...draft.days, index].sort(),
                            })
                          }
                        />
                        {label}
                      </label>
                    );
                  })}
                </div>
                <TextField
                  label="Repeat until"
                  type="date"
                  value={draft.until}
                  onChange={(event) => patch({ until: event.target.value })}
                />
              </div>
            ) : null}
            <fieldset>
              <legend className="mb-2 text-sm font-medium">Show on</legend>
              <div className="flex flex-wrap gap-4">
                {SITES.map((site) => (
                  <label key={site.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[var(--primary)]"
                      checked={draft.sites.includes(site.id)}
                      onChange={(event) =>
                        patch({
                          sites: event.target.checked
                            ? [...draft.sites, site.id]
                            : draft.sites.filter((item) => item !== site.id),
                        })
                      }
                    />
                    {site.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <ToggleField
              label="Published"
              checked={draft.published}
              onChange={(published) => patch({ published })}
            />
            <ToggleField
              label="Featured"
              checked={draft.featured}
              onChange={(featured) => patch({ featured })}
            />
            <ImageDrop
              label="Cover image"
              folder="events"
              mediaBranchId={draft.branchId || null}
              value={draft.imageUrl}
              onChange={(imageUrl) => patch({ imageUrl })}
            />
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save event"}
            </Button>
          </form>
        </Panel>
      ) : null}
    </div>
  );
}
