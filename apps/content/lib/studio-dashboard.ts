import type { EventRow } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

/** "daniel.boateng@kharis.org" → "Daniel". Falls back to "there". */
export function displayName(email: string | null | undefined) {
  const local = (email ?? "").split("@")[0] ?? "";
  const first = local.split(/[._+\-\d]+/).find(Boolean) ?? "";
  if (!first) return "there";
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

/** Two letters for an avatar: "daniel.boateng@…" → "DB", "grace@…" → "GR". */
export function initials(email: string | null | undefined) {
  const local = (email ?? "").split("@")[0] ?? "";
  const parts = local.split(/[._+\-\d]+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  return (parts[0] ?? "?").slice(0, 2).toUpperCase();
}

export function greeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** King James Version, which is public domain. */
export const DAILY_VERSES = [
  { text: "Be still, and know that I am God.", reference: "Psalm 46:10" },
  { text: "The Lord is my shepherd; I shall not want.", reference: "Psalm 23:1" },
  { text: "Let all things be done decently and in order.", reference: "1 Corinthians 14:40" },
  {
    text: "Trust in the Lord with all thine heart; and lean not unto thine own understanding.",
    reference: "Proverbs 3:5",
  },
  {
    text: "This is the day which the Lord hath made; we will rejoice and be glad in it.",
    reference: "Psalm 118:24",
  },
  {
    text: "Whatsoever ye do, do it heartily, as to the Lord, and not unto men.",
    reference: "Colossians 3:23",
  },
  {
    text: "Let your light so shine before men, that they may see your good works.",
    reference: "Matthew 5:16",
  },
  {
    text: "Thy word is a lamp unto my feet, and a light unto my path.",
    reference: "Psalm 119:105",
  },
  { text: "The joy of the Lord is your strength.", reference: "Nehemiah 8:10" },
  {
    text: "Commit thy works unto the Lord, and thy thoughts shall be established.",
    reference: "Proverbs 16:3",
  },
  {
    text: "Serve the Lord with gladness: come before his presence with singing.",
    reference: "Psalm 100:2",
  },
  {
    text: "I can do all things through Christ which strengtheneth me.",
    reference: "Philippians 4:13",
  },
] as const;

/** The same verse all day, a different one each calendar day. */
export function dailyVerse(date: Date) {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS);
  return DAILY_VERSES[day % DAILY_VERSES.length]!;
}

type Schedule = Pick<
  EventRow,
  "start_time" | "end_time" | "recurrence" | "recurrence_days" | "recurrence_until"
>;

/**
 * When the event next happens, at or after `now`. One-off events count while
 * they are still running. Weekly events repeat on recurrence_days (0 = Sunday)
 * at the start time, from the first date until recurrence_until.
 */
export function nextOccurrence(event: Schedule, now: Date): Date | null {
  const start = new Date(event.start_time);
  if (Number.isNaN(start.getTime())) return null;
  const days = event.recurrence_days ?? [];

  if (event.recurrence !== "weekly" || !days.length) {
    if (start >= now) return start;
    const end = event.end_time ? new Date(event.end_time) : null;
    return end && end >= now ? start : null;
  }

  const until = event.recurrence_until ? new Date(`${event.recurrence_until}T23:59:59`) : null;
  const base = start > now ? start : now;
  for (let offset = 0; offset < 8; offset += 1) {
    const candidate = new Date(base);
    candidate.setDate(base.getDate() + offset);
    candidate.setHours(start.getHours(), start.getMinutes(), 0, 0);
    if (!days.includes(candidate.getDay())) continue;
    if (candidate < now || candidate < start) continue;
    if (until && !Number.isNaN(until.getTime()) && candidate > until) return null;
    return candidate;
  }
  return null;
}

/** Events in the order they next happen, soonest first. */
export function upcomingEvents<T extends Schedule>(rows: T[], now: Date, limit = 5) {
  return rows
    .map((row) => ({ row, when: nextOccurrence(row, now) }))
    .filter((item): item is { row: T; when: Date } => item.when !== null)
    .sort((a, b) => a.when.getTime() - b.when.getTime())
    .slice(0, limit);
}

/** "just now", "5m ago", "3h ago", "2d ago", then a short date. */
export function timeAgo(iso: string | null | undefined, now: Date) {
  if (!iso) return "";
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return "";
  const minutes = Math.round((now.getTime() - then.getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return then.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
