import { supabase } from "@/lib/supabase";

export type EventSite = "kharis" | "kp2" | "app" | "general";

export interface EventRow {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  branch_id: string | null;
  branch_name: string | null;
  start_time: string;
  end_time: string | null;
  recurrence: "none" | "weekly";
  recurrence_days: number[];
  recurrence_until: string | null;
  is_featured: boolean;
  image_url: string | null;
  sites: EventSite[];
}

export interface DisplayEvent extends EventRow {
  occurrence_date: Date;
}

/**
 * Get events from Supabase.
 *
 * getEvents("kharis") -> Kharis website events
 * getEvents("kp2")    -> KP2 website events
 * getEvents("app")    -> App events
 * getEvents()         -> All events
 */
export async function getEvents(
  site?: EventSite
): Promise<EventRow[]> {
  const query = supabase
    .from("events")
    .select(`
      id,
      title,
      description,
      location,
      branch_id,
      branch_name,
      start_time,
      end_time,
      recurrence,
      recurrence_days,
      recurrence_until,
      is_featured,
      image_url,
      sites
    `)
    .order("start_time", { ascending: true });


  const { data, error } = await query;

  if (error) {
    console.error("Failed to load events:", error);
    return [];
  }

  const events = (data ?? []) as EventRow[];

if (!site) {
  return events;
}

return events.filter(
  (event) =>
    event.sites?.includes(site) ||
    event.sites?.includes("general")
);
}

/**
 * Expands recurring events into individual dates.
 *
 * Example:
 * A weekly Thursday Bible study becomes individual
 * Thursday events for the requested period.
 */
export function expandEvents(
  events: EventRow[],
  daysAhead = 90
): DisplayEvent[] {
  const today = startOfDay(new Date());

  const windowEnd = new Date(today);
  windowEnd.setDate(windowEnd.getDate() + daysAhead);

  const output: DisplayEvent[] = [];

  for (const event of events) {
    // -------------------------
    // ONE-OFF EVENT
    // -------------------------
    if (event.recurrence === "none") {
      const occurrence = new Date(event.start_time);

      if (
        occurrence >= today &&
        occurrence <= endOfDay(windowEnd)
      ) {
        output.push({
          ...event,
          occurrence_date: occurrence,
        });
      }

      continue;
    }

    // -------------------------
    // WEEKLY EVENT
    // -------------------------
    if (event.recurrence === "weekly") {
      const baseDate = startOfDay(
        new Date(event.start_time)
      );

      const recurrenceUntil =
        event.recurrence_until
          ? endOfDay(
              new Date(
                `${event.recurrence_until}T00:00:00`
              )
            )
          : null;

      for (
        let day = new Date(today);
        day <= windowEnd;
        day.setDate(day.getDate() + 1)
      ) {
        const candidate = new Date(day);

        // Don't create occurrences before
        // the original event began.
        if (candidate < baseDate) {
          continue;
        }

        // Stop after recurrence_until.
        if (
          recurrenceUntil &&
          candidate > recurrenceUntil
        ) {
          continue;
        }

        // Check whether this weekday is selected.
        if (
          !event.recurrence_days?.includes(
            candidate.getDay()
          )
        ) {
          continue;
        }

        output.push({
          ...event,
          occurrence_date:
            combineDateWithEventTime(
              candidate,
              event.start_time
            ),
        });
      }
    }
  }

  // Sort all occurrences chronologically.
  return output.sort(
    (a, b) =>
      a.occurrence_date.getTime() -
      b.occurrence_date.getTime()
  );
}

/**
 * Convenience function:
 * fetch + expand in one call.
 *
 * getUpcomingEvents("kharis")
 * getUpcomingEvents("kp2")
 */
export async function getUpcomingEvents(
  site?: EventSite,
  daysAhead = 90
): Promise<DisplayEvent[]> {
  const events = await getEvents(site);

  return expandEvents(events, daysAhead);
}

/**
 * Get only featured upcoming events.
 * Useful for the homepage.
 */
export async function getFeaturedEvents(
  site?: EventSite,
  limit = 3,
  daysAhead = 90
): Promise<DisplayEvent[]> {
  const events = await getUpcomingEvents(
    site,
    daysAhead
  );

  return events
    .filter((event) => event.is_featured)
    .slice(0, limit);
}

// ============================================
// DATE HELPERS
// ============================================

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

function combineDateWithEventTime(
  date: Date,
  eventDateTime: string
): Date {
  const source = new Date(eventDateTime);

  const result = new Date(date);

  result.setHours(
    source.getHours(),
    source.getMinutes(),
    source.getSeconds(),
    0
  );

  return result;
}