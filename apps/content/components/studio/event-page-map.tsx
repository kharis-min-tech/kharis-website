"use client";

import {
  CalendarDays,
  CircleAlert,
  CircleCheck,
  ImageIcon,
  MapPin,
  TriangleAlert,
} from "lucide-react";
import { EVENT_STEPS, issuesFor, type EventIssue, type EventStep } from "@/lib/event-checks";
import { cn, formatWhen, toTimestamp } from "@/lib/utils";

export type EventMapDraft = {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  branchName: string;
  category: string;
  recurrence: "none" | "weekly";
  days: number[];
  sites: string[];
  published: boolean;
  featured: boolean;
  imageUrl: string;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Filled({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
        ok ? "bg-success-soft text-success" : "bg-muted text-muted-foreground line-through",
      )}
    >
      {children}
    </span>
  );
}

export function EventPageMap({
  draft,
  step,
  issues,
  onStep,
}: {
  draft: EventMapDraft;
  step: EventStep;
  issues: EventIssue[];
  onStep: (step: EventStep) => void;
}) {
  const start = toTimestamp(draft.date, draft.time);
  const when = start ? formatWhen(start) : "Date & time";
  const place = draft.location.trim() || draft.branchName || "Location";

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <p className="studio-eyebrow">Page map</p>
      <h3 className="font-heading text-base font-semibold">Event card preview</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        How this event will look on the websites and in the app.
      </p>

      <div
        className={cn(
          "mt-4 overflow-hidden rounded-lg border transition",
          step === "publish" || step === "basics"
            ? "border-brand-line ring-2 ring-brand-soft"
            : "border-border",
        )}
      >
        <div className="relative h-24 bg-gradient-to-br from-brand/70 to-gold/60">
          {draft.imageUrl ? (
            <img
              src={draft.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="absolute right-2 top-2 h-4 w-4 text-white/70" />
          )}
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
            <Filled ok={draft.published && draft.sites.length > 0}>
              {draft.published ? "Published" : "Hidden"}
            </Filled>
            <Filled ok={draft.featured}>Featured</Filled>
          </div>
        </div>
        <div className="space-y-1.5 p-3">
          <p className="truncate text-sm font-semibold">{draft.title.trim() || "Event title"}</p>
          <p className="flex items-center gap-1.5 truncate text-[11px] text-muted-foreground">
            <CalendarDays className="h-3 w-3 shrink-0" />
            {when}
          </p>
          <p className="flex items-center gap-1.5 truncate text-[11px] text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            {place}
          </p>
          <div className="flex flex-wrap gap-1 pt-1">
            <Filled ok={Boolean(draft.category)}>{draft.category || "category"}</Filled>
            {draft.recurrence === "weekly" ? (
              <Filled ok={draft.days.length > 0}>
                Weekly {draft.days.map((day) => WEEKDAYS[day]).join(" · ") || "…"}
              </Filled>
            ) : (
              <Filled ok>One-off</Filled>
            )}
            {draft.sites.map((site) => (
              <Filled key={site} ok>
                {site}
              </Filled>
            ))}
          </div>
        </div>
      </div>

      <ol className="mt-4 space-y-1.5">
        {EVENT_STEPS.map((item) => {
          const stepIssues = issuesFor(issues, item.id);
          const current = item.id === step;
          const hasError = stepIssues.some((issue) => issue.level === "error");
          const hasWarning = stepIssues.some((issue) => issue.level === "warning");
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onStep(item.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition",
                  current ? "bg-brand-soft text-brand" : "hover:bg-muted",
                )}
              >
                {hasError ? (
                  <CircleAlert className="h-3.5 w-3.5 text-danger" />
                ) : hasWarning ? (
                  <TriangleAlert className="h-3.5 w-3.5 text-gold" />
                ) : (
                  <CircleCheck className="h-3.5 w-3.5 text-success" />
                )}
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
