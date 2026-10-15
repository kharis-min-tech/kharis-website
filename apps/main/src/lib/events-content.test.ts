import { describe, expect, it } from "vitest";
import { googleCalendarUrl, type ChurchEvent } from "./events-content";

describe("Google Calendar links", () => {
  it("uses the event date, time and timezone instead of an absent start_time", () => {
    const event: ChurchEvent = {
      id: "test",
      title: "Sunday",
      date: "2026-10-18",
      time: "09:00",
      timezone: "Europe/London",
      city: "London",
      location: "Town Hall",
      address: "London",
      description: "Welcome",
      image: "",
      category: "service",
    };
    const url = new URL(googleCalendarUrl(event));
    expect(url.searchParams.get("dates")).toBe("20261018T090000/20261018T100000");
    expect(url.searchParams.get("ctz")).toBe("Europe/London");
  });
});
