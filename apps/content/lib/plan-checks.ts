import { describeReadingReference } from "./bible-reference";
import { daySummary, type ContentPlan, type PlanDay, type PlanItem } from "./content-plans";

export const PLAN_STEPS = [
  {
    id: "basics",
    label: "Basics",
    hint: "Title, summary and cover",
  },
  {
    id: "days",
    label: "Days",
    hint: "Order of days in the plan",
  },
  {
    id: "content",
    label: "Day content",
    hint: "Scripture, messages, videos, quizzes and info",
  },
  {
    id: "publish",
    label: "Publish",
    hint: "Draft, published or archived",
  },
] as const;

export type PlanStep = (typeof PLAN_STEPS)[number]["id"];

export type PlanIssue = {
  step: PlanStep;
  level: "error" | "warning";
  message: string;
};

function hasDayContent(plan: ContentPlan) {
  return plan.days.some((day) => day.items.length > 0);
}

function daysConfigured(plan: ContentPlan) {
  return plan.days.length > 1 || plan.days.some((day) => day.items.length > 0);
}

/** Full wizard path — always Basics → Days → Day content → Publish. */
export function visiblePlanSteps(_plan: ContentPlan): PlanStep[] {
  return PLAN_STEPS.map((item) => item.id);
}

/** True when a step is meaningfully finished (green check), not just free of errors. */
export function planStepSatisfied(plan: ContentPlan, step: PlanStep) {
  if (step === "basics") return Boolean(plan.title.trim());
  if (step === "days") return daysConfigured(plan);
  if (step === "content") return hasDayContent(plan);
  return plan.status === "published" || plan.status === "archived";
}

function checkItem(item: PlanItem, dayLabel: string, issues: PlanIssue[]) {
  const error = (message: string) => issues.push({ step: "content", level: "error", message });
  const warn = (message: string) => issues.push({ step: "content", level: "warning", message });

  if (item.type === "scripture") {
    if (!item.reference.trim()) {
      error(`${dayLabel}: add a scripture reference.`);
      return;
    }
    const described = describeReadingReference(item.reference);
    if (!described.ok) error(`${dayLabel}: ${described.message}`);
    return;
  }

  if (item.type === "message") {
    if (!item.sermonId.trim()) error(`${dayLabel}: pick a sermon from the catalogue.`);
    return;
  }

  if (item.type === "video") {
    if (!item.title.trim()) warn(`${dayLabel}: give the video a title.`);
    if (!item.videoUrl.trim()) error(`${dayLabel}: upload or paste a video URL.`);
    return;
  }

  if (item.type === "quiz") {
    if (!item.title.trim()) warn(`${dayLabel}: give the quiz a title.`);
    if (!item.questions.length) {
      error(`${dayLabel}: add at least one quiz question.`);
      return;
    }
    for (const [index, question] of item.questions.entries()) {
      const label = `${dayLabel} quiz Q${index + 1}`;
      if (!question.prompt.trim()) error(`${label}: add a question prompt.`);
      const filled = question.choices.map((choice) => choice.trim()).filter(Boolean);
      if (filled.length < 2) error(`${label}: need at least two answer choices.`);
      if (question.answerIndex < 0 || question.answerIndex >= question.choices.length) {
        error(`${label}: mark the correct answer.`);
      }
    }
    return;
  }

  if (!item.header.trim() && !item.text.trim()) {
    error(`${dayLabel}: info blocks need a header or body text.`);
  }
}

export function checkPlan(plan: ContentPlan): PlanIssue[] {
  const issues: PlanIssue[] = [];
  const error = (step: PlanStep, message: string) => issues.push({ step, level: "error", message });
  const warn = (step: PlanStep, message: string) =>
    issues.push({ step, level: "warning", message });

  if (!plan.title.trim()) error("basics", "Add a title.");
  if (!plan.summary.trim()) warn("basics", "A short summary helps people choose this plan.");
  if (!plan.coverImageUrl.trim()) warn("basics", "A cover image looks better in the app list.");
  if (plan.pace === "calendar" && !plan.startDate.trim()) {
    error("basics", "Calendar plans need a start date.");
  }
  if (
    plan.estimatedMinutesPerDay !== null &&
    plan.estimatedMinutesPerDay !== undefined &&
    plan.estimatedMinutesPerDay <= 0
  ) {
    warn("basics", "Estimated minutes should be greater than zero, or leave it blank.");
  }

  if (!plan.days.length) error("days", "Add at least one day.");
  for (const [index, day] of plan.days.entries()) {
    if (!day.title.trim()) error("days", `Day ${index + 1} needs a title.`);
  }

  const emptyDays = plan.days.filter((day) => day.items.length === 0);
  if (plan.days.length && emptyDays.length === plan.days.length) {
    warn("content", "Add content to at least one day.");
  } else if (emptyDays.length) {
    warn(
      "content",
      `${emptyDays.length} day${emptyDays.length === 1 ? "" : "s"} still empty (${emptyDays
        .map((day) => day.title || "Untitled")
        .join(", ")}).`,
    );
  }

  for (const [index, day] of plan.days.entries()) {
    const label = day.title.trim() || `Day ${index + 1}`;
    for (const item of day.items) checkItem(item, label, issues);
  }

  if (plan.status === "published") {
    const blocking = issues.filter((issue) => issue.level === "error");
    if (blocking.length) {
      error("publish", "Fix the errors above before publishing.");
    }
    if (!plan.days.some((day) => day.items.length > 0)) {
      error("publish", "Published plans need at least one day with content.");
    }
  }

  return issues;
}

export function issuesFor(issues: PlanIssue[], step: PlanStep) {
  return issues.filter((issue) => issue.step === step);
}

export function summarizeDay(day: PlanDay) {
  return daySummary(day);
}
