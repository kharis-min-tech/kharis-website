"use client";

import { FileText } from "lucide-react";
import type { DocumentStep } from "@/lib/document-checks";
import type { SiteDocuments } from "@/lib/site-documents";
import { cn } from "@/lib/utils";

const POLICY_ORDER = ["safeguarding", "privacy", "cookies", "disclaimer"] as const;

export function DocumentsPageMap({
  documents,
  step,
  onStep,
}: {
  documents: SiteDocuments;
  step: DocumentStep;
  onStep: (step: DocumentStep) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <p className="studio-eyebrow">Page map</p>
      <h3 className="font-heading text-base font-semibold">Where these files appear</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Governance cards on kharis.org and KP2, plus Life fasting downloads.
      </p>

      <button
        type="button"
        onClick={() => onStep("governance")}
        className={cn(
          "mt-4 w-full rounded-lg border p-3 text-left transition",
          step === "governance"
            ? "border-brand-line bg-brand-soft"
            : "border-border hover:border-brand-line",
        )}
      >
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Governance
        </p>
        <ul className="mt-2 space-y-2">
          {POLICY_ORDER.map((id) => {
            const slot = documents.policies[id];
            return (
              <li key={id} className="flex items-start gap-2">
                <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium">{slot.title}</span>
                  <span
                    className={cn(
                      "text-[10px]",
                      slot.url ? "text-success" : "text-muted-foreground",
                    )}
                  >
                    {slot.url
                      ? "PDF linked"
                      : id === "cookies"
                        ? "Falls back to /cookies"
                        : "No PDF yet"}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </button>

      <button
        type="button"
        onClick={() => onStep("fasting")}
        className={cn(
          "mt-3 w-full rounded-lg border p-3 text-left transition",
          step === "fasting"
            ? "border-brand-line bg-brand-soft"
            : "border-border hover:border-brand-line",
        )}
      >
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Life · Fasting
        </p>
        <ul className="mt-2 space-y-2">
          {(["booklet", "schedule"] as const).map((id) => {
            const slot = documents.fasting[id];
            return (
              <li key={id} className="flex items-start gap-2">
                <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium">{slot.title}</span>
                  <span
                    className={cn(
                      "text-[10px]",
                      slot.url ? "text-success" : "text-muted-foreground",
                    )}
                  >
                    {slot.url ? "Download button shown" : "Hidden until uploaded"}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </button>
    </div>
  );
}
