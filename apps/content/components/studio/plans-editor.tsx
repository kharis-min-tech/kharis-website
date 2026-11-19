"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  Copy,
  Plus,
  Route,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  EmptyState,
  ErrorNotice,
  GridSkeleton,
  IconTile,
  SearchInput,
  Toolbar,
} from "@/components/studio/blocks";
import { AreaField, SelectField, TextField, ToggleField } from "@/components/studio/fields";
import { ImageDrop, VideoDrop } from "@/components/studio/image-drop";
import { PageHeader } from "@/components/studio/page-header";
import { Panel } from "@/components/studio/panel";
import { PassagePicker } from "@/components/studio/passage-picker";
import { PickWorkspace } from "@/components/studio/pick-workspace";
import { PlansPageMap } from "@/components/studio/plans-page-map";
import { SermonPicker } from "@/components/studio/sermon-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { confirmDelete } from "@/lib/confirm";
import {
  PLAN_AUDIENCE_SUGGESTIONS,
  PLAN_ITEM_TYPES,
  PLAN_PACES,
  PLAN_STATUSES,
  daySummary,
  duplicateContentPlan,
  emptyContentPlan,
  emptyPlanDay,
  emptyPlanItem,
  emptyQuizQuestion,
  inferPlanMode,
  itemTypeLabel,
  modeLabel,
  paceLabel,
  statusLabel,
  type ContentPlan,
  type PlanDay,
  type PlanItem,
  type PlanItemType,
  type PlanPace,
  type PlanQuizItem,
  type PlanStatus,
} from "@/lib/content-plans";
import { deleteContentPlan, listContentPlans, saveContentPlan } from "@/lib/content-plans-repo";
import {
  PLAN_STEPS,
  checkPlan,
  issuesFor,
  planStepSatisfied,
  visiblePlanSteps,
  type PlanStep,
} from "@/lib/plan-checks";
import type { CatalogueSermon } from "@/lib/sermon-catalogue";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/lib/workspace-context";

function moveItem<T>(list: T[], index: number, delta: number) {
  const next = index + delta;
  if (next < 0 || next >= list.length) return list;
  const copy = [...list];
  const [row] = copy.splice(index, 1);
  copy.splice(next, 0, row!);
  return copy;
}

function patchDayItems(days: PlanDay[], dayIndex: number, items: PlanItem[]) {
  return days.map((day, index) => (index === dayIndex ? { ...day, items } : day));
}

function patchItemAt(
  days: PlanDay[],
  dayIndex: number,
  itemIndex: number,
  item: PlanItem,
): PlanDay[] {
  return days.map((day, index) => {
    if (index !== dayIndex) return day;
    return {
      ...day,
      items: day.items.map((current, i) => (i === itemIndex ? item : current)),
    };
  });
}

export function PlansEditor() {
  const workspace = useWorkspaceId();
  const [plans, setPlans] = useState<ContentPlan[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PlanStatus>("all");
  const [draft, setDraft] = useState<ContentPlan | null>(null);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState<PlanStep>("basics");
  const [triedSave, setTriedSave] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [audienceInput, setAudienceInput] = useState("");

  function refresh() {
    setError("");
    listContentPlans()
      .then((next) => setPlans(next))
      .catch((caught) => {
        setPlans([]);
        setError(caught instanceof Error ? caught.message : "Could not load plans.");
      });
  }

  useEffect(() => {
    refresh();
  }, [saving]);

  const visible = useMemo(() => {
    if (!plans) return [];
    const needle = query.trim().toLowerCase();
    return plans.filter((plan) => {
      if (statusFilter !== "all" && plan.status !== statusFilter) return false;
      if (!needle) return true;
      return `${plan.title} ${plan.summary} ${plan.audience.join(" ")} ${plan.mode}`
        .toLowerCase()
        .includes(needle);
    });
  }, [plans, query, statusFilter]);

  const issues = useMemo(() => (draft ? checkPlan(draft) : []), [draft]);
  const inferredMode = useMemo(() => (draft ? inferPlanMode(draft) : "mixed"), [draft]);
  const visibleSteps = useMemo(() => (draft ? visiblePlanSteps() : []), [draft]);
  const stepIndex = Math.max(0, visibleSteps.indexOf(step));
  const activeDay = draft?.days[activeDayIndex] ?? draft?.days[0] ?? null;
  const addableTypes = PLAN_ITEM_TYPES;

  useEffect(() => {
    if (!draft) return;
    if (!visibleSteps.includes(step)) {
      setStep(visibleSteps[visibleSteps.length - 1] ?? "basics");
    }
  }, [draft, step, visibleSteps]);

  if (!workspace) return <PickWorkspace />;

  function openNew() {
    setTriedSave(false);
    setStep("basics");
    setActiveDayIndex(0);
    setAudienceInput("");
    setDraft(emptyContentPlan());
  }

  function openEdit(plan: ContentPlan) {
    setTriedSave(false);
    setStep("basics");
    setActiveDayIndex(0);
    setAudienceInput("");
    setDraft({ ...plan, days: plan.days.map((day) => ({ ...day, items: [...day.items] })) });
  }

  function patch(partial: Partial<ContentPlan>) {
    setDraft((current) => (current ? { ...current, ...partial } : current));
  }

  function stepErrors(current: PlanStep) {
    if (!triedSave) return null;
    const list = issuesFor(issues, current);
    if (!list.length) return null;
    return (
      <ul className="mb-4 space-y-1 rounded-lg border border-danger-line bg-danger-soft px-3 py-2 text-sm text-danger">
        {list.map((issue) => (
          <li key={issue.message}>{issue.message}</li>
        ))}
      </ul>
    );
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    if (!draft) return;
    setTriedSave(true);
    const nextIssues = checkPlan(draft);
    const firstError = nextIssues.find((issue) => issue.level === "error");
    if (firstError) {
      setStep(firstError.step);
      toast.error(firstError.message);
      return;
    }
    setSaving(true);
    try {
      await saveContentPlan(draft);
      toast.success("Plan saved");
      setDraft(null);
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(plan: ContentPlan) {
    const confirmed = await confirmDelete(plan.title || "this plan");
    if (!confirmed) return;
    try {
      await deleteContentPlan(plan.id);
      toast.success("Plan deleted");
      setPlans((current) => current?.filter((item) => item.id !== plan.id) ?? current);
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Delete failed");
    }
  }

  async function onDuplicate(plan: ContentPlan) {
    setSaving(true);
    try {
      const copy = duplicateContentPlan(plan);
      await saveContentPlan(copy);
      toast.success("Plan duplicated");
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not duplicate");
    } finally {
      setSaving(false);
    }
  }

  function addAudienceTag(raw: string) {
    const tag = raw.trim().toLowerCase();
    if (!tag || !draft) return;
    if (draft.audience.includes(tag)) {
      setAudienceInput("");
      return;
    }
    patch({ audience: [...draft.audience, tag] });
    setAudienceInput("");
  }

  function updateActiveDay(partial: Partial<PlanDay>) {
    if (!draft) return;
    const days = draft.days.map((day, index) =>
      index === activeDayIndex ? { ...day, ...partial } : day,
    );
    patch({ days });
  }

  function addItem(type: PlanItemType) {
    if (!draft || !activeDay) return;
    const items = [...activeDay.items, emptyPlanItem(type)];
    patch({ days: patchDayItems(draft.days, activeDayIndex, items) });
  }

  return (
    <div>
      <PageHeader
        title="Plans"
        description="Multi-day programmes for the future app: scriptures, messages, videos, quizzes and info blocks. Author them here; the app UI comes later."
        icon={<IconTile icon={Route} className="h-12 w-12 rounded-2xl" />}
        action={
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" />
            New plan
          </Button>
        }
      />
      <Toolbar>
        <SearchInput
          value={query}
          placeholder="Search plans"
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select
          aria-label="Status"
          className="w-auto min-w-[10rem]"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as "all" | PlanStatus)}
        >
          <option value="all">All statuses</option>
          {PLAN_STATUSES.map((status) => (
            <option key={status} value={status}>
              {statusLabel(status)}
            </option>
          ))}
        </Select>
        {plans && !error ? (
          <span className="text-xs text-muted-foreground">
            {visible.length} plan{visible.length === 1 ? "" : "s"}
          </span>
        ) : null}
      </Toolbar>
      {plans === null ? (
        <GridSkeleton />
      ) : error ? (
        <ErrorNotice message={error} />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={Route}
          title={query.trim() || statusFilter !== "all" ? "No matches" : "No plans yet"}
          action={
            query.trim() || statusFilter !== "all" ? null : (
              <Button onClick={openNew}>
                <Plus className="h-4 w-4" />
                New plan
              </Button>
            )
          }
        >
          {query.trim() || statusFilter !== "all"
            ? "Try a different search or status filter."
            : "Create a multi-day reading or message plan for the app."}
        </EmptyState>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((plan) => (
            <li
              key={plan.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition hover:border-brand-line"
            >
              <button
                type="button"
                className="flex flex-1 flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                onClick={() => openEdit(plan)}
              >
                {plan.coverImageUrl ? (
                  <img
                    src={plan.coverImageUrl}
                    alt=""
                    className="h-32 w-full border-b border-border object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-32 items-center justify-center border-b border-border bg-gradient-to-br from-brand/20 to-gold/20">
                    <Route className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <span className="space-y-1 p-5">
                  <span className="block truncate font-semibold">
                    {plan.title.trim() || "Untitled plan"}
                  </span>
                  <span className="block line-clamp-2 text-sm text-muted-foreground">
                    {plan.summary.trim() || "No summary yet"}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {plan.days.length} day{plan.days.length === 1 ? "" : "s"}
                    {plan.estimatedMinutesPerDay
                      ? ` · ~${plan.estimatedMinutesPerDay} min/day`
                      : ""}
                  </span>
                </span>
              </button>
              <div className="flex flex-wrap items-center gap-1.5 border-t border-border px-4 py-2.5">
                <Badge tone="muted">{modeLabel(plan.mode)}</Badge>
                <Badge
                  tone={
                    plan.status === "published"
                      ? "success"
                      : plan.status === "archived"
                        ? "gold"
                        : "muted"
                  }
                >
                  {statusLabel(plan.status)}
                </Badge>
                {plan.audience.slice(0, 2).map((tag) => (
                  <Badge key={tag} tone="muted">
                    {tag}
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => void onDuplicate(plan)}
                >
                  <Copy className="h-3.5 w-3.5" />
                  Duplicate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-danger hover:bg-danger-soft"
                  onClick={() => void onDelete(plan)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {draft ? (
        <Panel title={draft.title.trim() || "New plan"} onClose={() => setDraft(null)}>
          <form className="space-y-4" onSubmit={onSave}>
            <ol
              className={cn(
                "grid gap-2",
                visibleSteps.length <= 2
                  ? "sm:grid-cols-2"
                  : visibleSteps.length === 3
                    ? "sm:grid-cols-3"
                    : "sm:grid-cols-4",
              )}
              aria-label="Steps"
            >
              {visibleSteps.map((stepId, index) => {
                const item = PLAN_STEPS.find((entry) => entry.id === stepId)!;
                const stepIssues = issuesFor(issues, stepId);
                const hasError = stepIssues.some((issue) => issue.level === "error");
                const satisfied = planStepSatisfied(draft, stepId);
                const current = stepId === step;
                return (
                  <li key={stepId}>
                    <button
                      type="button"
                      aria-current={current ? "step" : undefined}
                      onClick={() => setStep(stepId)}
                      className={cn(
                        "flex h-full w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition",
                        current
                          ? "border-brand-line bg-brand-soft shadow-card"
                          : "border-border bg-card hover:border-brand-line",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                          hasError && (triedSave || current)
                            ? "bg-danger text-white"
                            : stepIssues.length
                              ? "bg-gold-soft text-gold ring-1 ring-inset ring-gold-line"
                              : satisfied
                                ? "bg-success-soft text-success ring-1 ring-inset ring-success-line"
                                : "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
                        )}
                      >
                        {hasError && (triedSave || current) ? (
                          index + 1
                        ) : stepIssues.length ? (
                          index + 1
                        ) : satisfied ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{item.label}</span>
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {stepIssues.length
                            ? `${stepIssues.length} to check`
                            : satisfied
                              ? current
                                ? "Looks good"
                                : "Done"
                              : current
                                ? "In progress"
                                : "Waiting"}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
                <header className="mb-5">
                  <p className="studio-eyebrow">
                    Step {stepIndex + 1} of {visibleSteps.length}
                  </p>
                  <h2 className="font-heading text-xl font-semibold">
                    {PLAN_STEPS.find((item) => item.id === step)?.label}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {PLAN_STEPS.find((item) => item.id === step)?.hint}
                  </p>
                </header>

                <section hidden={step !== "basics"} className="space-y-4">
                  {stepErrors("basics")}
                  <TextField
                    label="Title"
                    required
                    value={draft.title}
                    onChange={(event) => patch({ title: event.target.value })}
                  />
                  <AreaField
                    label="Summary"
                    value={draft.summary}
                    onChange={(event) => patch({ summary: event.target.value })}
                  />
                  <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                    Mode is set automatically from the day content:{" "}
                    <span className="font-medium text-foreground">{modeLabel(inferredMode)}</span>
                  </p>
                  <SelectField
                    label="Pace"
                    value={draft.pace}
                    onChange={(event) => patch({ pace: event.target.value as PlanPace })}
                  >
                    {PLAN_PACES.map((pace) => (
                      <option key={pace} value={pace}>
                        {paceLabel(pace)}
                      </option>
                    ))}
                  </SelectField>
                  {draft.pace === "calendar" ? (
                    <TextField
                      label="Start date"
                      type="date"
                      value={draft.startDate}
                      onChange={(event) => patch({ startDate: event.target.value })}
                    />
                  ) : null}
                  <TextField
                    label="Estimated minutes per day"
                    type="number"
                    min={0}
                    placeholder="Optional"
                    value={draft.estimatedMinutesPerDay ?? ""}
                    onChange={(event) => {
                      const raw = event.target.value;
                      patch({
                        estimatedMinutesPerDay: raw === "" ? null : Number(raw),
                      });
                    }}
                  />
                  <div>
                    <Label htmlFor="plan-audience">Audience tags</Label>
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {draft.audience.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs"
                          onClick={() =>
                            patch({ audience: draft.audience.filter((item) => item !== tag) })
                          }
                        >
                          {tag} ×
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="plan-audience"
                        value={audienceInput}
                        placeholder="Add a tag"
                        onChange={(event) => setAudienceInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addAudienceTag(audienceInput);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addAudienceTag(audienceInput)}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {PLAN_AUDIENCE_SUGGESTIONS.filter((tag) => !draft.audience.includes(tag)).map(
                        (tag) => (
                          <button
                            key={tag}
                            type="button"
                            className="rounded-full border border-dashed border-border px-2 py-0.5 text-[11px] text-muted-foreground hover:border-brand-line"
                            onClick={() => addAudienceTag(tag)}
                          >
                            + {tag}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                  <ToggleField
                    label="Sequential unlock (finish a day before the next opens in the app)"
                    checked={draft.sequentialUnlock}
                    onChange={(sequentialUnlock) => patch({ sequentialUnlock })}
                  />
                  <ImageDrop
                    label="Cover image"
                    folder="plans"
                    value={draft.coverImageUrl}
                    onChange={(url) => patch({ coverImageUrl: url })}
                  />
                </section>

                <section hidden={step !== "days"} className="space-y-4">
                  {stepErrors("days")}
                  <ul className="space-y-3">
                    {draft.days.map((day, index) => (
                      <li
                        key={day.id}
                        className="rounded-xl border border-border bg-background p-3"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <TextField
                            label={`Day ${index + 1} title`}
                            value={day.title}
                            onChange={(event) => {
                              const days = draft.days.map((row, i) =>
                                i === index ? { ...row, title: event.target.value } : row,
                              );
                              patch({ days });
                            }}
                          />
                          <div className="flex gap-1 self-end pb-0.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={index === 0}
                              onClick={() => patch({ days: moveItem(draft.days, index, -1) })}
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={index === draft.days.length - 1}
                              onClick={() => patch({ days: moveItem(draft.days, index, 1) })}
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-danger"
                              disabled={draft.days.length <= 1}
                              onClick={() => {
                                const days = draft.days.filter((_, i) => i !== index);
                                patch({ days });
                                setActiveDayIndex((current) =>
                                  Math.min(current, Math.max(0, days.length - 1)),
                                );
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{daySummary(day)}</p>
                      </li>
                    ))}
                  </ul>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const days = [...draft.days, emptyPlanDay(draft.days.length)];
                      patch({ days });
                      setActiveDayIndex(days.length - 1);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Add day
                  </Button>
                </section>

                <section hidden={step !== "content"} className="space-y-4">
                  {stepErrors("content")}
                  <SelectField
                    label="Editing day"
                    value={String(activeDayIndex)}
                    onChange={(event) => setActiveDayIndex(Number(event.target.value))}
                  >
                    {draft.days.map((day, index) => (
                      <option key={day.id} value={index}>
                        {day.title.trim() || `Day ${index + 1}`}
                      </option>
                    ))}
                  </SelectField>
                  {activeDay ? (
                    <>
                      <TextField
                        label="Day title"
                        value={activeDay.title}
                        onChange={(event) => updateActiveDay({ title: event.target.value })}
                      />
                      <div className="flex flex-wrap gap-2">
                        {addableTypes.map((type) => (
                          <Button
                            key={type}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addItem(type)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                            {itemTypeLabel(type)}
                          </Button>
                        ))}
                      </div>
                      {activeDay.items.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No items on this day yet. Add scripture, a message, video, quiz or info.
                        </p>
                      ) : (
                        <ul className="space-y-4">
                          {activeDay.items.map((item, itemIndex) => (
                            <li
                              key={item.id}
                              className="rounded-xl border border-border bg-background p-4"
                            >
                              <div className="mb-3 flex flex-wrap items-center gap-2">
                                <Badge tone="muted">{itemTypeLabel(item.type)}</Badge>
                                <div className="ml-auto flex gap-1">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={itemIndex === 0}
                                    onClick={() =>
                                      patch({
                                        days: patchDayItems(
                                          draft.days,
                                          activeDayIndex,
                                          moveItem(activeDay.items, itemIndex, -1),
                                        ),
                                      })
                                    }
                                  >
                                    <ArrowUp className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={itemIndex === activeDay.items.length - 1}
                                    onClick={() =>
                                      patch({
                                        days: patchDayItems(
                                          draft.days,
                                          activeDayIndex,
                                          moveItem(activeDay.items, itemIndex, 1),
                                        ),
                                      })
                                    }
                                  >
                                    <ArrowDown className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-danger"
                                    onClick={() =>
                                      patch({
                                        days: patchDayItems(
                                          draft.days,
                                          activeDayIndex,
                                          activeDay.items.filter((_, i) => i !== itemIndex),
                                        ),
                                      })
                                    }
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                              <PlanItemFields
                                item={item}
                                onChange={(next) =>
                                  patch({
                                    days: patchItemAt(draft.days, activeDayIndex, itemIndex, next),
                                  })
                                }
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : null}
                </section>

                <section hidden={step !== "publish"} className="space-y-4">
                  {stepErrors("publish")}
                  <SelectField
                    label="Status"
                    value={draft.status}
                    onChange={(event) => patch({ status: event.target.value as PlanStatus })}
                  >
                    {PLAN_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {statusLabel(status)}
                      </option>
                    ))}
                  </SelectField>
                  <p className="text-sm text-muted-foreground">
                    Published plans are ready for the future app. Draft and archived stay in the
                    studio only. Progress tracking will use stable day and item IDs once the app
                    ships.
                  </p>
                  <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
                    <p>
                      <span className="font-medium">{draft.days.length}</span> day
                      {draft.days.length === 1 ? "" : "s"} ·{" "}
                      <span className="font-medium">
                        {draft.days.reduce((sum, day) => sum + day.items.length, 0)}
                      </span>{" "}
                      items · {modeLabel(inferredMode)}
                    </p>
                  </div>
                </section>

                <footer className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-5">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={stepIndex <= 0}
                      onClick={() => setStep(visibleSteps[stepIndex - 1]!)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    {stepIndex < visibleSteps.length - 1 ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setStep(visibleSteps[stepIndex + 1]!)}
                      >
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setDraft(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" disabled={saving}>
                      {saving ? "Saving…" : "Save plan"}
                    </Button>
                  </div>
                </footer>
              </div>

              <aside className="lg:sticky lg:top-4 lg:self-start">
                <PlansPageMap
                  plan={draft}
                  step={step}
                  activeDayIndex={activeDayIndex}
                  issues={issues}
                  onStep={setStep}
                  onDay={setActiveDayIndex}
                />
              </aside>
            </div>
          </form>
        </Panel>
      ) : null}
    </div>
  );
}

function PlanItemFields({
  item,
  onChange,
}: {
  item: PlanItem;
  onChange: (item: PlanItem) => void;
}) {
  if (item.type === "scripture") {
    return (
      <div className="space-y-3">
        <div>
          <Label>Passage</Label>
          <PassagePicker
            value={item.reference}
            onChange={(reference) => onChange({ ...item, reference })}
          />
        </div>
        <AreaField
          label="Note"
          value={item.note}
          onChange={(event) => onChange({ ...item, note: event.target.value })}
        />
        <AreaField
          label="Reflection prompt"
          value={item.reflectionPrompt}
          onChange={(event) => onChange({ ...item, reflectionPrompt: event.target.value })}
        />
      </div>
    );
  }

  if (item.type === "message") {
    const picked: CatalogueSermon | null = item.sermonId
      ? {
          id: item.sermonId,
          title: item.sermonTitle || "Selected sermon",
          speaker: "",
          date: "",
          scripture: "",
          series: "",
        }
      : null;
    return (
      <div className="space-y-3">
        <SermonPicker
          id={`plan-sermon-${item.id}`}
          picked={picked}
          onPick={(sermon) => onChange({ ...item, sermonId: sermon.id, sermonTitle: sermon.title })}
          onClear={() => onChange({ ...item, sermonId: "", sermonTitle: "" })}
        />
        <AreaField
          label="Note"
          value={item.note}
          onChange={(event) => onChange({ ...item, note: event.target.value })}
        />
        <AreaField
          label="Reflection prompt"
          value={item.reflectionPrompt}
          onChange={(event) => onChange({ ...item, reflectionPrompt: event.target.value })}
        />
      </div>
    );
  }

  if (item.type === "video") {
    return (
      <div className="space-y-3">
        <TextField
          label="Title"
          value={item.title}
          onChange={(event) => onChange({ ...item, title: event.target.value })}
        />
        <VideoDrop
          label="Video"
          folder="plans"
          value={item.videoUrl}
          onChange={(url) => onChange({ ...item, videoUrl: url })}
        />
        <ImageDrop
          label="Poster image"
          folder="plans"
          value={item.posterUrl}
          onChange={(url) => onChange({ ...item, posterUrl: url })}
        />
        <AreaField
          label="Caption"
          value={item.caption}
          onChange={(event) => onChange({ ...item, caption: event.target.value })}
        />
      </div>
    );
  }

  if (item.type === "quiz") {
    return <QuizFields item={item} onChange={onChange} />;
  }

  return (
    <div className="space-y-3">
      <TextField
        label="Header"
        value={item.header}
        onChange={(event) => onChange({ ...item, header: event.target.value })}
      />
      <AreaField
        label="Text"
        value={item.text}
        onChange={(event) => onChange({ ...item, text: event.target.value })}
      />
      <ImageDrop
        label="Image"
        folder="plans"
        value={item.imageUrl}
        onChange={(url) => onChange({ ...item, imageUrl: url })}
      />
    </div>
  );
}

function QuizFields({
  item,
  onChange,
}: {
  item: PlanQuizItem;
  onChange: (item: PlanQuizItem) => void;
}) {
  return (
    <div className="space-y-4">
      <TextField
        label="Quiz title"
        value={item.title}
        onChange={(event) => onChange({ ...item, title: event.target.value })}
      />
      {item.questions.map((question, qIndex) => (
        <div key={question.id} className="rounded-lg border border-border p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm font-medium">Question {qIndex + 1}</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-danger"
              disabled={item.questions.length <= 1}
              onClick={() =>
                onChange({
                  ...item,
                  questions: item.questions.filter((_, i) => i !== qIndex),
                })
              }
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <AreaField
            label="Prompt"
            value={question.prompt}
            onChange={(event) => {
              const questions = item.questions.map((row, i) =>
                i === qIndex ? { ...row, prompt: event.target.value } : row,
              );
              onChange({ ...item, questions });
            }}
          />
          <div className="mt-3 space-y-2">
            {question.choices.map((choice, cIndex) => (
              <div key={`${question.id}-${cIndex}`} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`answer-${question.id}`}
                  className="h-4 w-4 accent-[var(--primary)]"
                  checked={question.answerIndex === cIndex}
                  onChange={() => {
                    const questions = item.questions.map((row, i) =>
                      i === qIndex ? { ...row, answerIndex: cIndex } : row,
                    );
                    onChange({ ...item, questions });
                  }}
                />
                <Input
                  value={choice}
                  placeholder={`Choice ${cIndex + 1}`}
                  onChange={(event) => {
                    const questions = item.questions.map((row, i) => {
                      if (i !== qIndex) return row;
                      const choices = row.choices.map((value, j) =>
                        j === cIndex ? event.target.value : value,
                      );
                      return { ...row, choices };
                    });
                    onChange({ ...item, questions });
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={question.choices.length <= 2}
                  onClick={() => {
                    const questions = item.questions.map((row, i) => {
                      if (i !== qIndex) return row;
                      const choices = row.choices.filter((_, j) => j !== cIndex);
                      return {
                        ...row,
                        choices,
                        answerIndex: Math.min(row.answerIndex, choices.length - 1),
                      };
                    });
                    onChange({ ...item, questions });
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const questions = item.questions.map((row, i) =>
                  i === qIndex ? { ...row, choices: [...row.choices, ""] } : row,
                );
                onChange({ ...item, questions });
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              Add choice
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange({ ...item, questions: [...item.questions, emptyQuizQuestion()] })}
      >
        <Plus className="h-3.5 w-3.5" />
        Add question
      </Button>
    </div>
  );
}
