export const CONTENT_PLANS_KEY = "content_plans";

function newKey() {
  return crypto.randomUUID();
}

export const PLAN_MODES = ["scriptures", "messages", "mixed"] as const;
export type PlanMode = (typeof PLAN_MODES)[number];

export const PLAN_STATUSES = ["draft", "published", "archived"] as const;
export type PlanStatus = (typeof PLAN_STATUSES)[number];

export const PLAN_PACES = ["self_paced", "calendar"] as const;
export type PlanPace = (typeof PLAN_PACES)[number];

export const PLAN_ITEM_TYPES = ["scripture", "message", "video", "quiz", "info"] as const;
export type PlanItemType = (typeof PLAN_ITEM_TYPES)[number];

export const PLAN_AUDIENCE_SUGGESTIONS = [
  "new believers",
  "fasting",
  "leaders",
  "youth",
  "families",
] as const;

export type PlanQuizQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
};

export type PlanScriptureItem = {
  id: string;
  type: "scripture";
  reference: string;
  note: string;
  reflectionPrompt: string;
};

export type PlanMessageItem = {
  id: string;
  type: "message";
  sermonId: string;
  sermonTitle: string;
  note: string;
  reflectionPrompt: string;
};

export type PlanVideoItem = {
  id: string;
  type: "video";
  title: string;
  videoUrl: string;
  posterUrl: string;
  caption: string;
};

export type PlanQuizItem = {
  id: string;
  type: "quiz";
  title: string;
  questions: PlanQuizQuestion[];
};

export type PlanInfoItem = {
  id: string;
  type: "info";
  header: string;
  text: string;
  imageUrl: string;
};

export type PlanItem =
  PlanScriptureItem | PlanMessageItem | PlanVideoItem | PlanQuizItem | PlanInfoItem;

export type PlanDay = {
  id: string;
  title: string;
  items: PlanItem[];
};

export type ContentPlan = {
  id: string;
  title: string;
  summary: string;
  coverImageUrl: string;
  mode: PlanMode;
  status: PlanStatus;
  pace: PlanPace;
  startDate: string;
  audience: string[];
  estimatedMinutesPerDay: number | null;
  sequentialUnlock: boolean;
  days: PlanDay[];
  updatedAt: string;
};

export type ContentPlansStore = {
  plans: ContentPlan[];
};

export function emptyQuizQuestion(): PlanQuizQuestion {
  return { id: newKey(), prompt: "", choices: ["", ""], answerIndex: 0 };
}

export function emptyPlanItem(type: PlanItemType): PlanItem {
  switch (type) {
    case "scripture":
      return { id: newKey(), type, reference: "", note: "", reflectionPrompt: "" };
    case "message":
      return {
        id: newKey(),
        type,
        sermonId: "",
        sermonTitle: "",
        note: "",
        reflectionPrompt: "",
      };
    case "video":
      return { id: newKey(), type, title: "", videoUrl: "", posterUrl: "", caption: "" };
    case "quiz":
      return { id: newKey(), type, title: "", questions: [emptyQuizQuestion()] };
    case "info":
      return { id: newKey(), type, header: "", text: "", imageUrl: "" };
  }
}

export function emptyPlanDay(index = 0): PlanDay {
  return {
    id: newKey(),
    title: index === 0 ? "Day 1" : `Day ${index + 1}`,
    items: [],
  };
}

export function emptyContentPlan(): ContentPlan {
  return {
    id: newKey(),
    title: "",
    summary: "",
    coverImageUrl: "",
    mode: "mixed",
    status: "draft",
    pace: "self_paced",
    startDate: "",
    audience: [],
    estimatedMinutesPerDay: null,
    sequentialUnlock: false,
    days: [emptyPlanDay(0)],
    updatedAt: "",
  };
}

export function emptyContentPlansStore(): ContentPlansStore {
  return { plans: [] };
}

export function modeLabel(mode: PlanMode) {
  if (mode === "scriptures") return "Scriptures only";
  if (mode === "messages") return "Messages only";
  return "Scriptures and messages";
}

export function statusLabel(status: PlanStatus) {
  if (status === "published") return "Published";
  if (status === "archived") return "Archived";
  return "Draft";
}

export function paceLabel(pace: PlanPace) {
  return pace === "calendar" ? "Calendar start" : "Self-paced";
}

export function itemTypeLabel(type: PlanItemType) {
  if (type === "scripture") return "Scripture";
  if (type === "message") return "Message";
  if (type === "video") return "Video";
  if (type === "quiz") return "Quiz";
  return "Info";
}

/** Quiz, info, and video stay available in every mode. */
export function allowedItemTypes(mode: PlanMode): PlanItemType[] {
  if (mode === "scriptures") return ["scripture", "video", "quiz", "info"];
  if (mode === "messages") return ["message", "video", "quiz", "info"];
  return ["scripture", "message", "video", "quiz", "info"];
}

/** Derive mode from scripture/message items so authors don't pick it by hand. */
export function inferPlanMode(plan: Pick<ContentPlan, "days">): PlanMode {
  let hasScripture = false;
  let hasMessage = false;
  for (const day of plan.days) {
    for (const item of day.items) {
      if (item.type === "scripture") hasScripture = true;
      if (item.type === "message") hasMessage = true;
    }
  }
  if (hasScripture && !hasMessage) return "scriptures";
  if (hasMessage && !hasScripture) return "messages";
  return "mixed";
}

export function daySummary(day: PlanDay) {
  const counts: Partial<Record<PlanItemType, number>> = {};
  for (const item of day.items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  const parts = PLAN_ITEM_TYPES.filter((type) => counts[type]).map(
    (type) =>
      `${counts[type]} ${itemTypeLabel(type).toLowerCase()}${counts[type] === 1 ? "" : "s"}`,
  );
  return parts.length ? parts.join(" · ") : "No items yet";
}

export function duplicateContentPlan(plan: ContentPlan): ContentPlan {
  const now = new Date().toISOString();
  return normalizeContentPlan(
    {
      ...plan,
      id: newKey(),
      title: plan.title.trim() ? `${plan.title.trim()} (copy)` : "",
      status: "draft",
      days: plan.days.map((day) => ({
        ...day,
        id: newKey(),
        items: day.items.map((item) => {
          if (item.type === "quiz") {
            return {
              ...item,
              id: newKey(),
              questions: item.questions.map((question) => ({ ...question, id: newKey() })),
            };
          }
          return { ...item, id: newKey() };
        }),
      })),
      updatedAt: now,
    },
    now,
  );
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asNullableInt(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n);
}

function parseAudience(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const tags = value.map((tag) => asString(tag).trim().toLowerCase()).filter(Boolean);
  return [...new Set(tags)];
}

function parseQuestion(value: unknown): PlanQuizQuestion | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const choicesRaw = Array.isArray(row.choices) ? row.choices : [];
  const choices = choicesRaw.map((choice) => asString(choice)).filter((choice) => choice.length);
  const prompt = asString(row.prompt).trim();
  if (!prompt && choices.length === 0) return null;
  const answerIndex = Math.min(
    Math.max(0, Math.floor(asNumber(row.answerIndex, 0))),
    Math.max(0, (choices.length || 2) - 1),
  );
  return {
    id: asString(row.id).trim() || newKey(),
    prompt,
    choices: choices.length >= 2 ? choices : [...choices, "", ""].slice(0, 2),
    answerIndex,
  };
}

function parseItem(value: unknown, mode: PlanMode): PlanItem | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const type = asString(row.type) as PlanItemType;
  if (!PLAN_ITEM_TYPES.includes(type)) return null;
  if (!allowedItemTypes(mode).includes(type)) return null;
  const id = asString(row.id).trim() || newKey();
  if (type === "scripture") {
    return {
      id,
      type,
      reference: asString(row.reference).trim(),
      note: asString(row.note),
      reflectionPrompt: asString(row.reflectionPrompt),
    };
  }
  if (type === "message") {
    return {
      id,
      type,
      sermonId: asString(row.sermonId).trim(),
      sermonTitle: asString(row.sermonTitle).trim(),
      note: asString(row.note),
      reflectionPrompt: asString(row.reflectionPrompt),
    };
  }
  if (type === "video") {
    return {
      id,
      type,
      title: asString(row.title).trim(),
      videoUrl: asString(row.videoUrl).trim(),
      posterUrl: asString(row.posterUrl).trim(),
      caption: asString(row.caption),
    };
  }
  if (type === "quiz") {
    const questions = Array.isArray(row.questions)
      ? row.questions
          .map(parseQuestion)
          .filter((question): question is PlanQuizQuestion => Boolean(question))
      : [];
    return {
      id,
      type,
      title: asString(row.title).trim(),
      questions: questions.length ? questions : [emptyQuizQuestion()],
    };
  }
  return {
    id,
    type: "info",
    header: asString(row.header).trim(),
    text: asString(row.text),
    imageUrl: asString(row.imageUrl).trim(),
  };
}

function parseDay(value: unknown, mode: PlanMode, index: number): PlanDay | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const items = Array.isArray(row.items)
    ? row.items
        .map((item) => parseItem(item, mode))
        .filter((item): item is PlanItem => Boolean(item))
    : [];
  return {
    id: asString(row.id).trim() || newKey(),
    title: asString(row.title).trim() || `Day ${index + 1}`,
    items,
  };
}

function parsePlan(value: unknown): ContentPlan | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const statusRaw = asString(row.status) as PlanStatus;
  const status = PLAN_STATUSES.includes(statusRaw) ? statusRaw : "draft";
  const paceRaw = asString(row.pace) as PlanPace;
  const pace = PLAN_PACES.includes(paceRaw) ? paceRaw : "self_paced";
  const daysRaw = Array.isArray(row.days) ? row.days : [];
  // Parse with mixed so scripture and message items both survive; mode is inferred.
  const days = daysRaw
    .map((day, index) => parseDay(day, "mixed", index))
    .filter((day): day is PlanDay => Boolean(day));
  const safeDays = days.length ? days : [emptyPlanDay(0)];
  return {
    id: asString(row.id).trim() || newKey(),
    title: asString(row.title).trim(),
    summary: asString(row.summary),
    coverImageUrl: asString(row.coverImageUrl).trim(),
    mode: inferPlanMode({ days: safeDays }),
    status,
    pace,
    startDate: asString(row.startDate).trim(),
    audience: parseAudience(row.audience),
    estimatedMinutesPerDay: asNullableInt(row.estimatedMinutesPerDay),
    sequentialUnlock: Boolean(row.sequentialUnlock),
    days: safeDays,
    updatedAt: asString(row.updatedAt).trim(),
  };
}

export function parseContentPlansStore(value: unknown): ContentPlansStore {
  const root = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const plans = Array.isArray(root.plans)
    ? root.plans.map(parsePlan).filter((plan): plan is ContentPlan => Boolean(plan))
    : [];
  return { plans };
}

function normalizeQuestion(question: PlanQuizQuestion): PlanQuizQuestion {
  const choices = question.choices.map((choice) => choice.trim()).filter(Boolean);
  const safeChoices =
    choices.length >= 2 ? choices : [...choices, "Option A", "Option B"].slice(0, 2);
  return {
    id: question.id || newKey(),
    prompt: question.prompt.trim(),
    choices: safeChoices,
    answerIndex: Math.min(Math.max(0, question.answerIndex), safeChoices.length - 1),
  };
}

function normalizeItem(item: PlanItem): PlanItem {
  if (item.type === "scripture") {
    return {
      ...item,
      id: item.id || newKey(),
      reference: item.reference.trim(),
      note: item.note.trim(),
      reflectionPrompt: item.reflectionPrompt.trim(),
    };
  }
  if (item.type === "message") {
    return {
      ...item,
      id: item.id || newKey(),
      sermonId: item.sermonId.trim(),
      sermonTitle: item.sermonTitle.trim(),
      note: item.note.trim(),
      reflectionPrompt: item.reflectionPrompt.trim(),
    };
  }
  if (item.type === "video") {
    return {
      ...item,
      id: item.id || newKey(),
      title: item.title.trim(),
      videoUrl: item.videoUrl.trim(),
      posterUrl: item.posterUrl.trim(),
      caption: item.caption.trim(),
    };
  }
  if (item.type === "quiz") {
    const questions = item.questions.map(normalizeQuestion).filter((question) => question.prompt);
    return {
      ...item,
      id: item.id || newKey(),
      title: item.title.trim(),
      questions: questions.length ? questions : [emptyQuizQuestion()],
    };
  }
  return {
    ...item,
    id: item.id || newKey(),
    header: item.header.trim(),
    text: item.text.trim(),
    imageUrl: item.imageUrl.trim(),
  };
}

export function normalizeContentPlan(
  plan: ContentPlan,
  now = new Date().toISOString(),
): ContentPlan {
  const pace = PLAN_PACES.includes(plan.pace) ? plan.pace : "self_paced";
  const status = PLAN_STATUSES.includes(plan.status) ? plan.status : "draft";
  const audience = [
    ...new Set(plan.audience.map((tag) => tag.trim().toLowerCase()).filter(Boolean)),
  ];
  const days = (plan.days.length ? plan.days : [emptyPlanDay(0)]).map((day, index) => ({
    id: day.id || newKey(),
    title: day.title.trim() || `Day ${index + 1}`,
    items: day.items.map(normalizeItem),
  }));
  return {
    id: plan.id || newKey(),
    title: plan.title.trim(),
    summary: plan.summary.trim(),
    coverImageUrl: plan.coverImageUrl.trim(),
    mode: inferPlanMode({ days }),
    status,
    pace,
    startDate: pace === "calendar" ? plan.startDate.trim() : "",
    audience,
    estimatedMinutesPerDay:
      plan.estimatedMinutesPerDay === null || plan.estimatedMinutesPerDay === undefined
        ? null
        : Math.max(0, Math.round(plan.estimatedMinutesPerDay)),
    sequentialUnlock: Boolean(plan.sequentialUnlock),
    days,
    updatedAt: now,
  };
}
