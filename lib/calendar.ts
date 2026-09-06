import type { ChurchEvent } from "@/lib/events";

export type CalendarItem = {
  uid: string;
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
  weekly?: boolean;
};

const WEEKDAY_INDEX: Record<string, number> = {
  sun: 0,
  sunday: 0,
  mon: 1,
  monday: 1,
  tue: 2,
  tues: 2,
  tuesday: 2,
  wed: 3,
  wednesday: 3,
  thu: 4,
  thur: 4,
  thurs: 4,
  thursday: 4,
  fri: 5,
  friday: 5,
  sat: 6,
  saturday: 6,
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

/** UTC stamp: 20260906T080000Z */
export function calendarStamp(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function icsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/[,;]/g, (ch) => `\\${ch}`);
}

function parseClock(time: string): { hours: number; minutes: number } | null {
  const match = time.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2] ?? 0);
  const ampm = match[3]?.toUpperCase();
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;
  if (hours > 23 || minutes > 59) return null;
  return { hours, minutes };
}

/** Next occurrence of a weekday + clock time in the visitor's local timezone. */
export function nextWeeklyOccurrence(day: string, time: string): Date | null {
  const weekday = WEEKDAY_INDEX[day.trim().toLowerCase()];
  const clock = parseClock(time);
  if (weekday === undefined || !clock) return null;

  const now = new Date();
  const next = new Date(now);
  next.setHours(clock.hours, clock.minutes, 0, 0);
  const delta = (weekday - now.getDay() + 7) % 7;
  next.setDate(now.getDate() + delta);
  if (next <= now) next.setDate(next.getDate() + 7);
  return next;
}

export function eventToCalendarItem(event: ChurchEvent): CalendarItem {
  return {
    uid: event.slug,
    title: event.title,
    description: event.blurb,
    location: event.location,
    start: event.starts,
    end: event.ends,
    weekly: event.weekly,
  };
}

export function weeklyServiceToCalendarItem(opts: {
  uid: string;
  title: string;
  description: string;
  location: string;
  day: string;
  time: string;
  durationHours?: number;
}): CalendarItem | null {
  const start = nextWeeklyOccurrence(opts.day, opts.time);
  if (!start) return null;
  const end = new Date(start.getTime() + (opts.durationHours ?? 2) * 60 * 60 * 1000);
  return {
    uid: opts.uid,
    title: opts.title,
    description: opts.description,
    location: opts.location,
    start: start.toISOString(),
    end: end.toISOString(),
    weekly: true,
  };
}

export function mapsSearchUrl(location: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

export function mapsDirectionsUrl(destination: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export function googleCalendarUrl(item: CalendarItem) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: item.title,
    dates: `${calendarStamp(item.start)}/${calendarStamp(item.end)}`,
    details: item.description,
    location: item.location,
  });
  if (item.weekly) params.set("recur", "RRULE:FREQ=WEEKLY");
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl(item: CalendarItem) {
  const params = new URLSearchParams({
    rru: "addevent",
    subject: item.title,
    startdt: new Date(item.start).toISOString(),
    enddt: new Date(item.end).toISOString(),
    body: item.description,
    location: item.location,
    path: "/calendar/action/compose",
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function icsContent(item: CalendarItem) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kharis Phase 2//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${item.uid}@kharisphase2.org`,
    `DTSTAMP:${calendarStamp(new Date().toISOString())}`,
    `DTSTART:${calendarStamp(item.start)}`,
    `DTEND:${calendarStamp(item.end)}`,
    item.weekly ? "RRULE:FREQ=WEEKLY" : null,
    `SUMMARY:${icsText(item.title)}`,
    `DESCRIPTION:${icsText(item.description)}`,
    `LOCATION:${icsText(item.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter((line): line is string => Boolean(line));

  return `${lines.join("\r\n")}\r\n`;
}

export function downloadIcs(item: CalendarItem) {
  const blob = new Blob([icsContent(item)], {
    type: "text/calendar;charset=utf-8",
  });
  const stamp = `${pad(new Date(item.start).getUTCMonth() + 1)}${pad(new Date(item.start).getUTCDate())}`;
  const safe = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "kharis-event";
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${safe}-${stamp}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function formatVisitWhen(item: CalendarItem) {
  const start = new Date(item.start);
  const date = start.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  });
  const time = start
    .toLocaleTimeString("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Europe/London",
    })
    .replace(":00", "")
    .toUpperCase();
  return item.weekly ? `Every ${date.split(",")[0]} · ${time}` : `${date} · ${time}`;
}
