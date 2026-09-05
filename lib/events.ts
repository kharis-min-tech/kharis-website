import { SITE_WORKSPACE, SITE_WORKSPACES } from "@/lib/site";
import { supabaseSelect } from "@/lib/supabase";

export type EventCategory =
  | "Weekly"
  | "Conference"
  | "Worship"
  | "Fellowship"
  | "Outreach"
  | "Social";

export type ChurchEvent = {
  slug: string;
  title: string;
  category: EventCategory;
  /** ISO date-time, used for sorting + the countdown. */
  starts: string;
  dayLabel: string;
  timeLabel: string;
  location: string;
  blurb: string;
  cta: string;
  featured?: boolean;
  image?: string;
};

type EventSite = "kharis" | "kp2" | "app" | "general";

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  branch_name: string | null;
  start_time: string;
  end_time: string | null;
  recurrence: "none" | "weekly";
  recurrence_days: number[] | null;
  recurrence_until: string | null;
  is_featured: boolean | null;
  image_url: string | null;
  sites: EventSite[] | null;
  workspace: string | null;
};

type DisplayEvent = EventRow & { occurrence_date: Date };

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const EVENT_CATEGORIES: EventCategory[] = [
  "Weekly",
  "Conference",
  "Worship",
  "Fellowship",
  "Outreach",
  "Social",
];

export const CATEGORY_ICON: Record<EventCategory, string> = {
  Weekly: "event_repeat",
  Conference: "campaign",
  Worship: "music_note",
  Fellowship: "groups",
  Outreach: "volunteer_activism",
  Social: "celebration",
};

function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

function combineDateWithEventTime(date: Date, eventDateTime: string): Date {
  const source = new Date(eventDateTime);
  const result = new Date(date);
  result.setHours(source.getHours(), source.getMinutes(), source.getSeconds(), 0);
  return result;
}

function isForThisSite(event: EventRow): boolean {
  const sites = event.sites ?? [];
  if (sites.length === 0) {
    return event.workspace === SITE_WORKSPACE || event.workspace === "general";
  }
  return SITE_WORKSPACES.some((site) => sites.includes(site));
}

function inferCategory(event: EventRow): EventCategory {
  if (event.recurrence === "weekly") return "Weekly";
  const hay = `${event.title} ${event.description ?? ""}`.toLowerCase();
  if (/worship|praise/.test(hay)) return "Worship";
  if (/conference|summit|bible speak/.test(hay)) return "Conference";
  if (/outreach|mission|street/.test(hay)) return "Outreach";
  if (/fellowship|hangout|social/.test(hay)) return "Fellowship";
  return "Social";
}

function expandEvents(events: EventRow[], daysAhead = 90): DisplayEvent[] {
  const today = startOfDay(new Date());
  const windowEnd = new Date(today);
  windowEnd.setDate(windowEnd.getDate() + daysAhead);
  const output: DisplayEvent[] = [];

  for (const event of events) {
    if (event.recurrence === "weekly") {
      const baseDate = startOfDay(new Date(event.start_time));
      const recurrenceUntil = event.recurrence_until
        ? endOfDay(new Date(`${event.recurrence_until}T00:00:00`))
        : null;

      for (let day = new Date(today); day <= windowEnd; day.setDate(day.getDate() + 1)) {
        const candidate = new Date(day);
        if (candidate < baseDate) continue;
        if (recurrenceUntil && candidate > recurrenceUntil) continue;
        if (!event.recurrence_days?.includes(candidate.getDay())) continue;
        output.push({
          ...event,
          occurrence_date: combineDateWithEventTime(candidate, event.start_time),
        });
      }
      continue;
    }

    const occurrence = new Date(event.start_time);
    if (occurrence >= today && occurrence <= endOfDay(windowEnd)) {
      output.push({ ...event, occurrence_date: occurrence });
    }
  }

  return output.sort((a, b) => a.occurrence_date.getTime() - b.occurrence_date.getTime());
}

/** Weekly series: keep only the next occurrence so the grid isn't 13 copies of Sunday. */
function nextOccurrencePerSeries(events: DisplayEvent[]): DisplayEvent[] {
  const seen = new Set<string>();
  const out: DisplayEvent[] = [];
  for (const event of events) {
    if (event.recurrence === "weekly") {
      if (seen.has(event.id)) continue;
      seen.add(event.id);
    }
    out.push(event);
  }
  return out;
}

function londonDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Europe/London",
  });
}

function londonTime(date: Date) {
  return date.toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Europe/London",
  }).replace(":00", "").toUpperCase();
}

function toChurchEvent(event: DisplayEvent): ChurchEvent {
  const weekly = event.recurrence === "weekly";
  const weekday = WEEKDAYS[event.occurrence_date.getDay()] ?? "Sunday";
  return {
    slug: `${event.id}-${event.occurrence_date.getTime()}`,
    title: event.title,
    category: inferCategory(event),
    starts: event.occurrence_date.toISOString(),
    dayLabel: weekly ? `Every ${weekday}` : londonDate(event.occurrence_date),
    timeLabel: londonTime(event.occurrence_date),
    location: event.location || event.branch_name || "Kharis Phase 2",
    blurb: event.description || "Join us — all welcome.",
    cta: "Plan Your Visit",
    featured: Boolean(event.is_featured),
    image: event.image_url || undefined,
  };
}

export async function getUpcomingEvents(): Promise<ChurchEvent[]> {
  const rows = await supabaseSelect<EventRow>(
    "events",
    [
      "select=id,title,description,location,branch_name,start_time,end_time,recurrence,recurrence_days,recurrence_until,is_featured,image_url,sites,workspace",
      "order=start_time.asc",
    ].join("&"),
  );

  const scoped = rows.filter(isForThisSite);
  return nextOccurrencePerSeries(expandEvents(scoped)).map(toChurchEvent);
}
