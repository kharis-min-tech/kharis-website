export const EVENT_STEPS = [
  { id: "basics", label: "Basics", hint: "Title, description and category" },
  { id: "when", label: "When & where", hint: "Date, time, location and branch" },
  { id: "repeat", label: "Repeat", hint: "One-off or weekly weekdays" },
  { id: "publish", label: "Publish & image", hint: "Sites, featured flag and cover" },
] as const;

export type EventStep = (typeof EVENT_STEPS)[number]["id"];

export type EventIssue = {
  step: EventStep;
  level: "error" | "warning";
  message: string;
};

export type EventCheckDraft = {
  title: string;
  date: string;
  time: string;
  branchId: string;
  recurrence: "none" | "weekly";
  days: number[];
  sites: string[];
  published: boolean;
  imageUrl: string;
  location: string;
};

export function checkEvent(
  draft: EventCheckDraft,
  { requireBranch = false }: { requireBranch?: boolean } = {},
): EventIssue[] {
  const issues: EventIssue[] = [];
  const error = (step: EventStep, message: string) =>
    issues.push({ step, level: "error", message });
  const warn = (step: EventStep, message: string) =>
    issues.push({ step, level: "warning", message });

  if (!draft.title.trim()) error("basics", "Add a title.");
  if (!draft.date || !draft.time) error("when", "Choose a date and start time.");
  if (requireBranch && !draft.branchId) error("when", "Choose one of your branches.");
  if (draft.recurrence === "weekly" && draft.days.length === 0) {
    error("repeat", "Choose at least one weekday.");
  }
  if (draft.published && draft.sites.length === 0) {
    error("publish", "Pick at least one site, or turn published off.");
  }
  if (!draft.location.trim()) warn("when", "A location helps people find the event.");
  if (!draft.imageUrl.trim()) warn("publish", "A cover image looks better on the websites.");

  return issues;
}

export function issuesFor(issues: EventIssue[], step: EventStep) {
  return issues.filter((issue) => issue.step === step);
}
