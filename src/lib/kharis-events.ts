import { unstable_cache } from "next/cache";
import {
  EVENTS as FALLBACK_EVENTS,
  type ChurchEvent,
} from "@/lib/events-content";

const KHARIS_EVENTS_API = "https://kharis.org/wp-json/wp/v2/ajde_events";
const SERVICE_TITLES = new Set(["Sunday Service", "Thursday Service"]);

const SUNDAY_IMAGE = "/images/events/sunday-service.jpg";
const THURSDAY_IMAGE = "/images/events/thursday-service.jpg";

const LOCATION_BY_SLUG: Record<
  string,
  { location: string; address: string; city: string }
> = {
  "event_location-kensington-town-hall": {
    location: "Kensington Town Hall",
    address: "Hornton Street, London W8 7NX",
    city: "London",
  },
  "event_location-the-lighthouse-theatre": {
    location: "The Lighthouse Theatre",
    address: "254-270 Camberwell Road, London",
    city: "London",
  },
};

type WpEvent = {
  id: number;
  link: string;
  title: { rendered: string };
  class_list?: string[];
};

function decodeTitle(raw: string) {
  return raw
    .replace(/&#8217;/g, "'")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, "");
}

function locationFromClasses(classList: string[] = []) {
  const slug = classList.find((c) => c.startsWith("event_location-"));
  if (slug && LOCATION_BY_SLUG[slug]) return LOCATION_BY_SLUG[slug];
  return LOCATION_BY_SLUG["event_location-kensington-town-hall"]!;
}

function unixToParts(unix: number) {
  const d = new Date(unix * 1000);
  const date = d.toLocaleDateString("en-CA", { timeZone: "Europe/London" });
  const time = d
    .toLocaleTimeString("en-GB", {
      timeZone: "Europe/London",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase()
    .replace(" ", " ");
  return { date, time };
}

function serviceTemplate(title: string, id: string, date: string): ChurchEvent {
  const isSunday = title === "Sunday Service";
  const venue = isSunday
    ? LOCATION_BY_SLUG["event_location-kensington-town-hall"]!
    : LOCATION_BY_SLUG["event_location-the-lighthouse-theatre"]!;

  return {
    id,
    title,
    date,
    time: isSunday ? "10:00 am" : "7:00 pm",
    timezone: "GMT+01:00",
    city: venue.city,
    location: venue.location,
    address: venue.address,
    description: isSunday
      ? "Join us for Sunday Service as we worship God and receive His Word together as a church family."
      : "Midweek gathering for prayer, worship, and the teaching of God’s Word.",
    image: isSunday ? SUNDAY_IMAGE : THURSDAY_IMAGE,
    category: "service",
  };
}

function generateRecurringServices(from: Date, to: Date): ChurchEvent[] {
  const out: ChurchEvent[] = [];
  const cursor = new Date(from);
  cursor.setHours(12, 0, 0, 0);

  while (cursor <= to) {
    const day = cursor.getDay();
    const date = cursor.toLocaleDateString("en-CA", { timeZone: "Europe/London" });

    if (day === 0) {
      out.push(serviceTemplate("Sunday Service", `gen-sun-${date}`, date));
    } else if (day === 4) {
      out.push(serviceTemplate("Thursday Service", `gen-thu-${date}`, date));
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return out;
}

async function fetchWpServiceEvents(): Promise<WpEvent[]> {
  const out: WpEvent[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const res = await fetch(
      `${KHARIS_EVENTS_API}?per_page=100&page=${page}&status=publish`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) break;

    totalPages = Number(res.headers.get("x-wp-totalpages") || "1");
    const batch = (await res.json()) as WpEvent[];
    for (const event of batch) {
      const title = decodeTitle(event.title.rendered);
      if (SERVICE_TITLES.has(title)) out.push({ ...event, title: { rendered: title } });
    }
    page += 1;
  }

  return out;
}

async function fetchEventStartUnix(link: string): Promise<number | null> {
  try {
    const res = await fetch(link, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/data-time="(\d+)-\d+"/);
    return match ? Number(match[1]) : null;
  } catch {
    return null;
  }
}

async function mapWpEvent(event: WpEvent): Promise<ChurchEvent | null> {
  const title = decodeTitle(event.title.rendered);
  if (!SERVICE_TITLES.has(title)) return null;

  const unix = await fetchEventStartUnix(event.link);
  if (!unix) return null;

  const { date, time } = unixToParts(unix);
  const venue = locationFromClasses(event.class_list);
  const isSunday = title === "Sunday Service";

  return {
    id: String(event.id),
    title,
    date,
    time,
    timezone: "GMT+01:00",
    city: venue.city,
    location: venue.location,
    address: venue.address,
    description: isSunday
      ? "Join us for Sunday Service as we worship God and receive His Word together as a church family."
      : "Midweek gathering for prayer, worship, and the teaching of God’s Word.",
    image: isSunday ? SUNDAY_IMAGE : THURSDAY_IMAGE,
    category: "service",
  };
}

async function fetchInBatches<T, R>(
  items: T[],
  size: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += size) {
    const batch = items.slice(i, i + size);
    const chunk = await Promise.all(batch.map(worker));
    results.push(...chunk);
  }
  return results;
}

function mergeEvents(
  generated: ChurchEvent[],
  fromApi: ChurchEvent[],
): ChurchEvent[] {
  const byKey = new Map<string, ChurchEvent>();

  for (const event of generated) {
    byKey.set(`${event.date}|${event.title}`, event);
  }

  for (const event of fromApi) {
    byKey.set(`${event.date}|${event.title}`, event);
  }

  return [...byKey.values()].sort((a, b) => a.date.localeCompare(b.date));
}

async function loadKharisEvents(): Promise<ChurchEvent[]> {
  try {
    const wpEvents = await fetchWpServiceEvents();
    const mapped = (
      await fetchInBatches(wpEvents, 10, mapWpEvent)
    ).filter((e): e is ChurchEvent => e !== null);

    const generated = generateRecurringServices(
      new Date("2024-01-01T12:00:00"),
      new Date("2028-12-31T12:00:00"),
    );

    const merged = mergeEvents(generated, mapped);
    return merged.length > 0 ? merged : FALLBACK_EVENTS;
  } catch {
    return FALLBACK_EVENTS;
  }
}

export const getKharisEvents = unstable_cache(
  loadKharisEvents,
  ["kharis-events-v1"],
  { revalidate: 3600 },
);
