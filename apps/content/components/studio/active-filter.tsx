"use client";

import { Eye, EyeOff } from "lucide-react";
import { ACTIVE_FILTERS, type ActiveFilter } from "@/lib/active-filter";
import { cn } from "@/lib/utils";

const LABELS: Record<ActiveFilter, string> = {
  active: "Active",
  inactive: "Inactive",
  all: "All",
};

/** Active / Inactive / All tabs with counts, styled like the message status filter. */
export function ActiveFilterTabs({
  value,
  counts,
  onChange,
}: {
  value: ActiveFilter;
  counts: Record<ActiveFilter, number>;
  onChange: (value: ActiveFilter) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Active filter"
      className="inline-flex rounded-lg border border-border bg-card p-0.5"
    >
      {ACTIVE_FILTERS.map((item) => (
        <button
          key={item}
          type="button"
          role="tab"
          aria-selected={value === item}
          onClick={() => onChange(item)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground",
            value === item && "bg-brand-soft text-brand hover:text-brand",
          )}
        >
          {LABELS[item]}
          <span className="ml-1.5 tabular-nums opacity-70">{counts[item]}</span>
        </button>
      ))}
    </div>
  );
}

/** A quiet "Show inactive (n)" link for lists inside a form. Hidden when nothing is inactive. */
export function ShowInactiveToggle({
  shown,
  count,
  onChange,
}: {
  shown: boolean;
  count: number;
  onChange: (shown: boolean) => void;
}) {
  if (!count) return null;
  const Icon = shown ? EyeOff : Eye;
  return (
    <button
      type="button"
      aria-pressed={shown}
      onClick={() => onChange(!shown)}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <Icon className="h-3.5 w-3.5" />
      {shown ? "Hide inactive" : `Show inactive (${count})`}
    </button>
  );
}
