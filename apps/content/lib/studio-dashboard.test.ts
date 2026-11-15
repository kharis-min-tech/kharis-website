import { describe, expect, it } from "vitest";
import {
  DAILY_VERSES,
  dailyVerse,
  displayName,
  greeting,
  initials,
  nextOccurrence,
  timeAgo,
  upcomingEvents,
} from "./studio-dashboard";

function local(date: string, time = "00:00") {
  return new Date(`${date}T${time}:00`);
}

function event(overrides: Partial<Parameters<typeof nextOccurrence>[0]> = {}) {
  return {
    start_time: local("2026-11-01", "10:00").toISOString(),
    end_time: null,
    recurrence: "none" as const,
    recurrence_days: null,
    recurrence_until: null,
    ...overrides,
  };
}

describe("displayName and initials", () => {
  it("uses the first part of the email", () => {
    expect(displayName("daniel.boateng@kharis.org")).toBe("Daniel");
    expect(displayName("GRACE@kharis.org")).toBe("Grace");
    expect(displayName("")).toBe("there");
    expect(displayName(null)).toBe("there");
  });

  it("makes two-letter initials", () => {
    expect(initials("daniel.boateng@kharis.org")).toBe("DB");
    expect(initials("grace@kharis.org")).toBe("GR");
    expect(initials("")).toBe("?");
  });
});

describe("greeting", () => {
  it("follows the time of day", () => {
    expect(greeting(8)).toBe("Good morning");
    expect(greeting(13)).toBe("Good afternoon");
    expect(greeting(20)).toBe("Good evening");
  });
});

describe("dailyVerse", () => {
  it("is stable through a day and changes the next day", () => {
    const morning = dailyVerse(local("2026-11-12", "07:00"));
    expect(dailyVerse(local("2026-11-12", "22:00"))).toBe(morning);
    expect(dailyVerse(local("2026-11-13", "07:00"))).not.toBe(morning);
    expect(DAILY_VERSES).toContain(morning);
  });
});

describe("nextOccurrence", () => {
  const now = local("2026-11-12", "12:00");

  it("returns a future one-off event and drops a finished one", () => {
    const future = local("2026-11-20", "18:00");
    expect(nextOccurrence(event({ start_time: future.toISOString() }), now)).toEqual(future);
    expect(nextOccurrence(event(), now)).toBeNull();
  });

  it("keeps a one-off event that is still running", () => {
    const started = event({
      start_time: local("2026-11-12", "11:00").toISOString(),
      end_time: local("2026-11-12", "13:00").toISOString(),
    });
    expect(nextOccurrence(started, now)).toEqual(local("2026-11-12", "11:00"));
  });

  it("finds the next weekday for a weekly event", () => {
    // 12 Nov 2026 is a Thursday. Sundays (0) at 10:00 → 15 Nov.
    const weekly = event({ recurrence: "weekly", recurrence_days: [0] });
    expect(nextOccurrence(weekly, now)).toEqual(local("2026-11-15", "10:00"));
  });

  it("skips today when today's time has passed", () => {
    // Thursday (4) at 10:00 has passed at noon, so next Thursday.
    const weekly = event({ recurrence: "weekly", recurrence_days: [4] });
    expect(nextOccurrence(weekly, now)).toEqual(local("2026-11-19", "10:00"));
  });

  it("stops after recurrence_until", () => {
    const ended = event({
      recurrence: "weekly",
      recurrence_days: [0],
      recurrence_until: "2026-11-14",
    });
    expect(nextOccurrence(ended, now)).toBeNull();
  });

  it("does not repeat before the first date", () => {
    const later = event({
      start_time: local("2026-12-01", "19:00").toISOString(),
      recurrence: "weekly",
      recurrence_days: [2],
    });
    expect(nextOccurrence(later, now)).toEqual(local("2026-12-01", "19:00"));
  });

  it("returns null for a bad date", () => {
    expect(nextOccurrence(event({ start_time: "nope" }), now)).toBeNull();
  });
});

describe("upcomingEvents", () => {
  it("sorts by next date and drops past events", () => {
    const now = local("2026-11-12", "12:00");
    const rows = [
      { id: "past", ...event() },
      { id: "later", ...event({ start_time: local("2026-11-30", "10:00").toISOString() }) },
      { id: "sunday", ...event({ recurrence: "weekly", recurrence_days: [0] }) },
    ];
    expect(upcomingEvents(rows, now).map((item) => item.row.id)).toEqual(["sunday", "later"]);
    expect(upcomingEvents(rows, now, 1)).toHaveLength(1);
  });
});

describe("timeAgo", () => {
  it("reads like a feed", () => {
    const now = local("2026-11-12", "12:00");
    expect(timeAgo(local("2026-11-12", "11:59").toISOString(), now)).toBe("1m ago");
    expect(timeAgo(local("2026-11-12", "09:00").toISOString(), now)).toBe("3h ago");
    expect(timeAgo(local("2026-11-10", "12:00").toISOString(), now)).toBe("2d ago");
    expect(timeAgo(null, now)).toBe("");
  });
});
