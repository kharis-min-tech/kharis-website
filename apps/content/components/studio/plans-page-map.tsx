"use client";

import {
  BookOpen,
  CircleAlert,
  CircleCheck,
  Clapperboard,
  HelpCircle,
  ImageIcon,
  Info,
  Mic,
  TriangleAlert,
} from "lucide-react";
import {
  daySummary,
  inferPlanMode,
  itemTypeLabel,
  modeLabel,
  paceLabel,
  statusLabel,
  type ContentPlan,
  type PlanItem,
} from "@/lib/content-plans";
import {
  PLAN_STEPS,
  issuesFor,
  planStepSatisfied,
  visiblePlanSteps,
  type PlanIssue,
  type PlanStep,
} from "@/lib/plan-checks";
import { cn } from "@/lib/utils";

function itemLine(item: PlanItem) {
  if (item.type === "scripture") return item.reference.trim() || "Scripture";
  if (item.type === "message") return item.sermonTitle.trim() || "Message";
  if (item.type === "video") return item.title.trim() || "Video";
  if (item.type === "quiz") {
    const count = item.questions.length;
    return `${item.title.trim() || "Quiz"} · ${count} question${count === 1 ? "" : "s"}`;
  }
  return item.header.trim() || "Info";
}

function ItemIcon({ type }: { type: PlanItem["type"] }) {
  if (type === "scripture") return <BookOpen className="h-3 w-3 shrink-0" />;
  if (type === "message") return <Mic className="h-3 w-3 shrink-0" />;
  if (type === "video") return <Clapperboard className="h-3 w-3 shrink-0" />;
  if (type === "quiz") return <HelpCircle className="h-3 w-3 shrink-0" />;
  return <Info className="h-3 w-3 shrink-0" />;
}

export function PlansPageMap({
  plan,
  step,
  activeDayIndex,
  issues,
  onStep,
  onDay,
}: {
  plan: ContentPlan;
  step: PlanStep;
  activeDayIndex: number;
  issues: PlanIssue[];
  onStep: (step: PlanStep) => void;
  onDay: (index: number) => void;
}) {
  const minutes =
    plan.estimatedMinutesPerDay && plan.estimatedMinutesPerDay > 0
      ? `~${plan.estimatedMinutesPerDay} min/day`
      : null;
  const mode = inferPlanMode(plan);
  const steps = visiblePlanSteps();

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <p className="studio-eyebrow">Page map</p>
      <h3 className="font-heading text-base font-semibold">App plan preview</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Rough phone layout for the future app. Authored now; app UI comes later.
      </p>

      <div
        className={cn(
          "mx-auto mt-4 w-full max-w-[240px] overflow-hidden rounded-[1.6rem] border-2 bg-background shadow-inner",
          step === "basics" || step === "publish"
            ? "border-brand-line ring-2 ring-brand-soft"
            : "border-border",
        )}
      >
        <div className="relative h-28 bg-gradient-to-br from-brand/70 to-gold/60">
          {plan.coverImageUrl ? (
            <img
              src={plan.coverImageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="absolute right-3 top-3 h-4 w-4 text-white/70" />
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
            <p className="truncate text-sm font-semibold text-white">
              {plan.title.trim() || "Plan title"}
            </p>
            <p className="mt-0.5 truncate text-[10px] text-white/80">
              {[modeLabel(mode), minutes, paceLabel(plan.pace)].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>

        <div className="max-h-72 space-y-2 overflow-y-auto p-2.5">
          {plan.days.map((day, index) => {
            const active = index === activeDayIndex && (step === "days" || step === "content");
            return (
              <button
                key={day.id}
                type="button"
                onClick={() => {
                  onDay(index);
                  onStep("content");
                }}
                className={cn(
                  "w-full rounded-lg border px-2.5 py-2 text-left transition",
                  active
                    ? "border-brand-line bg-brand-soft"
                    : "border-border bg-card hover:border-brand-line",
                )}
              >
                <p className="truncate text-[11px] font-semibold">
                  {day.title.trim() || `Day ${index + 1}`}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                  {daySummary(day)}
                </p>
                {day.items.length ? (
                  <ul className="mt-1.5 space-y-1">
                    {day.items.slice(0, 4).map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-1.5 truncate text-[10px] text-muted-foreground"
                      >
                        <ItemIcon type={item.type} />
                        <span className="truncate">
                          {itemTypeLabel(item.type)}: {itemLine(item)}
                        </span>
                      </li>
                    ))}
                    {day.items.length > 4 ? (
                      <li className="text-[10px] text-muted-foreground">
                        +{day.items.length - 4} more
                      </li>
                    ) : null}
                  </ul>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="border-t border-border px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {statusLabel(plan.status)}
            {plan.audience.length ? ` · ${plan.audience.slice(0, 2).join(", ")}` : ""}
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-1.5">
        {steps.map((stepId) => {
          const item = PLAN_STEPS.find((entry) => entry.id === stepId)!;
          const stepIssues = issuesFor(issues, stepId);
          const errors = stepIssues.filter((issue) => issue.level === "error").length;
          const warnings = stepIssues.filter((issue) => issue.level === "warning").length;
          const satisfied = planStepSatisfied(plan, stepId);
          return (
            <li key={stepId}>
              <button
                type="button"
                onClick={() => onStep(stepId)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition hover:bg-muted",
                  step === stepId && "bg-brand-soft",
                )}
              >
                {errors ? (
                  <CircleAlert className="h-3.5 w-3.5 text-danger" />
                ) : warnings ? (
                  <TriangleAlert className="h-3.5 w-3.5 text-gold" />
                ) : satisfied ? (
                  <CircleCheck className="h-3.5 w-3.5 text-success" />
                ) : (
                  <span className="h-3.5 w-3.5 rounded-full border border-border" />
                )}
                <span className="font-medium">{item.label}</span>
                <span className="ml-auto text-muted-foreground">
                  {errors
                    ? `${errors} error${errors === 1 ? "" : "s"}`
                    : warnings
                      ? `${warnings} note${warnings === 1 ? "" : "s"}`
                      : satisfied
                        ? "OK"
                        : "Waiting"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
