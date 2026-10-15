import staticEvents from "../data/events.json";

export type ChurchEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  timezone: string;
  city: string;
  location: string;
  address: string;
  description: string;
  image: string;
  category: "service" | "special" | "outreach";
  featured?: boolean;
};

export const EVENT_YEARS = [2024, 2025, 2026, 2027, 2028] as const;

export const EVENT_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** Committed fallback events — source of truth for types and offline dev. */
export const EVENTS: ChurchEvent[] = staticEvents.events as ChurchEvent[];

export function eventsForMonth(year: number, monthIndex: number) {
  const prefix = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
  return EVENTS.filter((e) => e.date.startsWith(prefix)).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

/** Soonest upcoming gatherings from kharis.org. */
export function happeningEvents(from = new Date()) {
  const stamp = from.toISOString().slice(0, 10);
  return EVENTS.filter((e) => e.date >= stamp).sort((a, b) => a.date.localeCompare(b.date));
}

export function featuredEvent() {
  return happeningEvents()[0] ?? EVENTS[EVENTS.length - 1]!;
}

export function formatEventDay(date: string) {
  const d = new Date(`${date}T12:00:00`);
  return d.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase();
}

export function formatEventDateNum(date: string) {
  return date.slice(8, 10);
}

export function formatEventMonthShort(date: string) {
  const d = new Date(`${date}T12:00:00`);
  return d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
}

export function formatEventCardDate(date: string) {
  const d = new Date(`${date}T12:00:00`);
  const weekday = d.toLocaleDateString("en-GB", { weekday: "long" });
  const day = d.getDate();
  const month = d.toLocaleDateString("en-GB", { month: "short" });
  const year = d.getFullYear();
  return `${weekday} ${day} ${month} ${year}`;
}

export function formatEventMonthYear(date: string) {
  const d = new Date(`${date}T12:00:00`);
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export function eventMonthKey(date: string | Date) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`;
}

export function groupEventsByMonth(events: ChurchEvent[]) {
  const map = new Map<string, ChurchEvent[]>();

  for (const event of events) {
    const key = eventMonthKey(`${event.date}T12:00:00`);
    const bucket = map.get(key);
    if (bucket) bucket.push(event);
    else map.set(key, [event]);
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, monthEvents]) => ({
      key,
      label: formatEventMonthYear(monthEvents[0]!.date),
      events: monthEvents,
    }));
}

/** "09:00", "19:00" or "7:00 pm" → "9:00 AM" / "7:00 PM". */
export function formatEventCardTime(time: string) {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*([ap]m)?$/i);
  if (!match) return time;
  const [, h, m, suffix] = match;
  let hour = Number(h);
  if (suffix) hour = (hour % 12) + (suffix.toLowerCase() === "pm" ? 12 : 0);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
}

export function formatEventLong(date: string, time: string) {
  const d = new Date(`${date}T12:00:00`);
  const long = d.toLocaleDateString("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `${long} · ${formatEventCardTime(time)}`;
}

export function googleCalendarUrl(event: ChurchEvent) {
  const match = formatEventCardTime(event.time).match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: event.description,
    location: `${event.location}, ${event.address}`,
    ctz: event.timezone,
  });
  if (match) {
    const hour = (Number(match[1]) % 12) + (match[3] === "PM" ? 12 : 0);
    const start = new Date(`${event.date}T${String(hour).padStart(2, "0")}:${match[2]}:00Z`);
    const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, "").slice(0, 15);
    params.set("dates", `${stamp(start)}/${stamp(new Date(start.getTime() + 60 * 60 * 1000))}`);
  } else {
    const end = new Date(`${event.date}T12:00:00Z`);
    end.setUTCDate(end.getUTCDate() + 1);
    params.set(
      "dates",
      `${event.date.replace(/-/g, "")}/${end.toISOString().slice(0, 10).replace(/-/g, "")}`,
    );
  }
  return `https://calendar.google.com/calendar/render?${params}`;
}
