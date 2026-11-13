"use client";

import { CircleAlert, CircleCheck, ExternalLink, ImageIcon, TriangleAlert } from "lucide-react";
import { BRANCH_STEPS, type BranchIssue, type BranchStep } from "@/lib/branch-checks";
import { branchPagePath, FAMILY_LABEL, type BranchFamily } from "@/lib/branch-family";
import { pastorPreview, type BranchDraft } from "@/lib/branch-types";
import { cn } from "@/lib/utils";

type SectionId =
  "hero" | "services" | "pastor" | "watch" | "gallery" | "events" | "contact" | "travel";

type PageSection = { id: SectionId; label: string; steps: BranchStep[] };

/** The branch page sections in the order each site renders them. */
const PAGE_SECTIONS: Record<BranchFamily, PageSection[]> = {
  kharis: [
    { id: "hero", label: "Welcome banner", steps: ["basics", "media"] },
    { id: "services", label: "Join us this Sunday", steps: ["visit"] },
    { id: "pastor", label: "Pastor", steps: ["pastor"] },
    { id: "watch", label: "A look at the branch", steps: ["media"] },
    { id: "gallery", label: "Gallery", steps: ["media"] },
    { id: "contact", label: "Get in touch", steps: ["contact"] },
    { id: "travel", label: "Parking and transport", steps: ["visit"] },
  ],
  kp2: [
    { id: "hero", label: "Welcome banner and Give button", steps: ["basics", "media", "contact"] },
    { id: "pastor", label: "Pastor", steps: ["pastor"] },
    { id: "services", label: "Service times and map", steps: ["visit"] },
    { id: "watch", label: "A look at the branch", steps: ["media"] },
    { id: "gallery", label: "Gallery", steps: ["media"] },
    { id: "events", label: "This month (from Events)", steps: [] },
    { id: "contact", label: "Get in touch", steps: ["contact"] },
    { id: "travel", label: "Parking and transport", steps: ["visit"] },
  ],
};

export type DraftPreviews = { hero?: string; pastor?: string; galleryQueued: number };

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

function SectionBody({
  id,
  draft,
  previews,
}: {
  id: SectionId;
  draft: BranchDraft;
  previews: DraftPreviews;
}) {
  const hero = previews.hero || draft.heroImage;
  const venue = draft.venues.find((item) => item.active && (item.address || item.postcode));
  switch (id) {
    case "hero":
      return (
        <span className="relative flex h-20 items-end overflow-hidden rounded-md bg-gradient-to-br from-brand/70 to-gold/60 p-2">
          {hero ? (
            <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <ImageIcon className="absolute right-2 top-2 h-4 w-4 text-white/70" />
          )}
          <span className="relative rounded bg-black/45 px-1.5 py-0.5 text-[11px] font-semibold text-white">
            Welcome to {draft.name.trim() || "…"}
          </span>
        </span>
      );
    case "pastor": {
      const photo = previews.pastor || draft.pastorPhoto;
      return (
        <span className="flex items-center gap-2">
          {photo ? (
            <img src={photo} alt="" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <span className="h-8 w-8 rounded-full bg-muted" />
          )}
          <span className="truncate text-[11px]">
            {draft.pastorName.trim()
              ? pastorPreview(draft.pastorName, draft.pastorRole)
              : "Coming soon"}
          </span>
        </span>
      );
    }
    case "services": {
      const times = draft.services
        .filter((service) => service.active)
        .slice(0, 2)
        .map((service) => `${service.day.slice(0, 3)} ${service.time || "TBC"}`);
      return (
        <span className="block truncate text-[11px]">
          {times.join(" · ") || "No service times"}
          {" · "}
          {venue ? [venue.address, venue.postcode].filter(Boolean).join(", ") : "No address"}
        </span>
      );
    }
    case "watch":
      return <Filled ok={Boolean(draft.videoUrl.trim())}>Video</Filled>;
    case "gallery": {
      const count = draft.gallery.length + previews.galleryQueued;
      return (
        <Filled ok={count > 0}>
          {count} photo{count === 1 ? "" : "s"}
        </Filled>
      );
    }
    case "events":
      return <span className="text-[11px]">Comes from the Events page</span>;
    case "contact":
      return (
        <span className="flex flex-wrap gap-1">
          <Filled ok={Boolean(draft.email.trim())}>Email</Filled>
          <Filled ok={Boolean(draft.phone.trim())}>Phone</Filled>
          <Filled ok={Boolean(draft.instagram.trim())}>Instagram</Filled>
          <Filled ok={Boolean(draft.givingLink.trim())}>Giving link</Filled>
        </span>
      );
    case "travel":
      return (
        <span className="flex flex-wrap gap-1">
          <Filled ok={draft.venues.some((item) => item.active && item.parkingInfo.trim())}>
            Parking
          </Filled>
          <Filled ok={draft.venues.some((item) => item.active && item.transitInfo.trim())}>
            Transport
          </Filled>
        </span>
      );
  }
}

/** A sketch of the public branch page that lights up the parts the current step fills in. */
export function BranchPageMap({
  draft,
  step,
  issues,
  previews,
  liveUrl,
  onStep,
}: {
  draft: BranchDraft;
  step: BranchStep;
  issues: BranchIssue[];
  previews: DraftPreviews;
  liveUrl?: string;
  onStep: (step: BranchStep) => void;
}) {
  const sections = PAGE_SECTIONS[draft.family];
  const errors = issues.filter((issue) => issue.level === "error");
  const warnings = issues.filter((issue) => issue.level === "warning");

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2">
          <span className="flex gap-1" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-danger/50" />
            <span className="h-2 w-2 rounded-full bg-gold/60" />
            <span className="h-2 w-2 rounded-full bg-success/50" />
          </span>
          <span className="min-w-0 flex-1 truncate rounded bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
            {branchPagePath(draft.family, draft.slug)}
          </span>
          {liveUrl ? (
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Open the live page"
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
        <div className="space-y-1.5 p-3">
          <p className="studio-eyebrow pb-1">
            Where this appears · {FAMILY_LABEL[draft.family]} site
          </p>
          {sections.map((section) => {
            const current = section.steps.includes(step);
            const target = section.steps[0];
            return (
              <button
                key={section.id}
                type="button"
                disabled={!target}
                onClick={() => target && onStep(target)}
                className={cn(
                  "block w-full rounded-lg border px-2.5 py-2 text-left transition",
                  current
                    ? "border-brand-line bg-brand-soft text-foreground ring-1 ring-brand-line"
                    : "border-border text-muted-foreground opacity-60 hover:opacity-100",
                  !target && "cursor-default border-dashed hover:opacity-60",
                )}
              >
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide">
                  {section.label}
                </span>
                <SectionBody id={section.id} draft={draft} previews={previews} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <p className="studio-eyebrow mb-2">Before you publish</p>
        {issues.length ? (
          <ul className="space-y-1.5">
            {[...errors, ...warnings].map((issue) => (
              <li key={`${issue.step}-${issue.message}`}>
                <button
                  type="button"
                  onClick={() => onStep(issue.step)}
                  className="flex w-full items-start gap-2 text-left text-xs hover:underline"
                >
                  {issue.level === "error" ? (
                    <CircleAlert className="mt-px h-3.5 w-3.5 shrink-0 text-danger" />
                  ) : (
                    <TriangleAlert className="mt-px h-3.5 w-3.5 shrink-0 text-gold" />
                  )}
                  <span>
                    <span className="font-medium">
                      {BRANCH_STEPS.find((item) => item.id === issue.step)?.label}:
                    </span>{" "}
                    {issue.message}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="flex items-center gap-2 text-xs text-success">
            <CircleCheck className="h-3.5 w-3.5" />
            Everything a visitor needs is filled in.
          </p>
        )}
        {errors.length ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Red items stop the save. Amber items can wait, but the page will look unfinished.
          </p>
        ) : null}
      </div>
    </div>
  );
}
