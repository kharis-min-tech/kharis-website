import { calendarServices } from "./branch-calendar";
import type { Service } from "./branches";

/**
 * When this branch next gathers.
 *
 * Nobody opens a branch page to admire it. They open it to work out when to
 * turn up, and until now that answer was buried in a list of four services
 * and a month of repeated dates. This turns the data already on the page
 * into the one sentence a visitor actually came for.
 *
 * Deliberately computed from the SAME services the times list renders, so
 * the headline and the list can never disagree.
 */
export type NextGathering = {
  service: Service;
  /** The actual moment it starts, in the visitor's own timezone. */
  at: Date;
  /** "today", "tomorrow", or the weekday name. */
  when: string;
  /** "9:00 AM". */
  time: string;
  /** "in 2 days", "in 5 hours", "in 12 minutes" — or null while it is on. */
  countdown: string | null;
  /** The service is running right now. */
  live: boolean;
};

function endMinutes(service: Service) {
  const [h, m] = (service.end_time ?? "").split(":");
  const hour = Number(h);
  const minute = Number(m ?? 0);
  return Number.isFinite(hour) ? hour * 60 + (Number.isFinite(minute) ? minute : 0) : null;
}

/**
 * How long until it starts, in the largest unit that still says something
 * useful. "in 2 days" is what someone planning needs; "in 47 hours" is a
 * number they have to do arithmetic on. Under an hour it switches to minutes,
 * because at that range the minutes are the whole point.
 */
function countdownTo(at: Date, now: Date): string {
  const ms = at.getTime() - now.getTime();
  const minutes = Math.round(ms / 60_000);
  if (minutes < 1) return "starting now";
  if (minutes < 60) return `in ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `in ${hours} ${hours === 1 ? "hour" : "hours"}`;
  const days = Math.round(hours / 24);
  return `in ${days} ${days === 1 ? "day" : "days"}`;
}

function startMinutes(service: Service) {
  const [h, m] = (service.start_time ?? "").split(":");
  const hour = Number(h);
  const minute = Number(m ?? 0);
  return Number.isFinite(hour) ? hour * 60 + (Number.isFinite(minute) ? minute : 0) : null;
}

function formatTime(service: Service) {
  const total = startMinutes(service);
  if (total === null) return "";
  const hour = Math.floor(total / 60);
  const minute = total % 60;
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${ampm}`;
}

/**
 * `now` is injected rather than read here so this stays a pure function: the
 * caller passes the clock, which is also what keeps it testable and what
 * stops the server and the client disagreeing on a hydration boundary.
 */
export function nextGathering(services: Service[], now: Date): NextGathering | null {
  /* A service that is ON right now beats anything upcoming. Telling someone
   * the next gathering is in six days while the room is full is worse than
   * saying nothing. */
  const today = now.getDay();
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  for (const { service, weekday } of calendarServices(services)) {
    const from = startMinutes(service);
    const to = endMinutes(service);
    if (weekday !== today || from === null || to === null) continue;
    if (minutesNow >= from && minutesNow < to) {
      const at = new Date(now);
      at.setHours(Math.floor(from / 60), from % 60, 0, 0);
      return {
        service,
        at,
        when: "today",
        time: formatTime(service),
        countdown: null,
        live: true,
      };
    }
  }

  const candidates = calendarServices(services)
    .map(({ service, weekday }) => {
      const minutes = startMinutes(service);
      if (minutes === null) return null;

      const at = new Date(now);
      at.setHours(0, 0, 0, 0);
      /* Days until that weekday comes round again. Today counts only while
       * the service has not already started; a 9am service does not help
       * anyone reading the page at noon. */
      let delta = (weekday - at.getDay() + 7) % 7;
      const minutesNow = now.getHours() * 60 + now.getMinutes();
      if (delta === 0 && minutes <= minutesNow) delta = 7;
      at.setDate(at.getDate() + delta);
      at.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);

      return { service, at, delta };
    })
    .filter((entry): entry is { service: Service; at: Date; delta: number } => entry !== null)
    .sort((a, b) => a.at.getTime() - b.at.getTime());

  const next = candidates[0];
  if (!next) return null;

  const when = next.delta === 0 ? "today" : next.delta === 1 ? "tomorrow" : null;
  const countdown = countdownTo(next.at, now);

  return {
    service: next.service,
    at: next.at,
    when: when ?? next.at.toLocaleDateString("en-GB", { weekday: "long" }),
    time: formatTime(next.service),
    /* "tomorrow · in 1 day" says the same thing twice. Where the day name
     * already carries the distance, the countdown earns its place only if it
     * is finer than a day. */
    countdown: when === "tomorrow" && countdown === "in 1 day" ? null : countdown,
    live: false,
  };
}
