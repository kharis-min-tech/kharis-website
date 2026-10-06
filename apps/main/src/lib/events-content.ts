import staticEvents from "@/data/events.json";

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
  return EVENTS.filter((e) => e.date >= stamp).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
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

  return `${value.getFullYear()}-${String(
    value.getMonth() + 1
  ).padStart(2, "0")}`;
}

export function groupEventsByMonth(events: ChurchEvent[]) {
  const map = new Map<string, ChurchEvent[]>();

  for (const event of events) {
    const key = eventMonthKey(event.start_time);
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

export function formatEventCardTime(time: string, timezone: string) {
  const compact = time.replace(" ", "").replace("am", "AM").replace("pm", "PM");
  const tz = timezone.replace("GMT+01:00", "GMT+1");
  return `${compact} ${tz}`;
}

export function formatEventLong(date: string, time: string, timezone: string) {
  const d = new Date(`${date}T12:00:00`);
  const long = d.toLocaleDateString("en-GB", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `${long} ${time} (${timezone})`;
}

export function googleCalendarUrl(event: ChurchEvent) {
  const start = event.start_time?.replace(/-/g, "");
  const text = encodeURIComponent(event.title);
  const details = encodeURIComponent(event.description);
  const location = encodeURIComponent(`${event.location}, ${event.address}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${start}&details=${details}&location=${location}`;
}
