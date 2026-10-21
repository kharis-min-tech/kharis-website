import { describe, expect, it } from "vitest";
import { calendarServices } from "./branch-calendar";
import type { Service } from "./branches";
const gathering = (day: string, is_active = true): Service => ({
  id: day,
  name: "Gathering",
  day,
  is_active,
  type: "midweek",
  start_time: "19:00",
  end_time: null,
  venue_id: null,
  description: null,
  sort_order: 0,
});
describe("branch calendar", () => {
  it("respects every stored weekday, including Monday and Wednesday", () => {
    expect(
      calendarServices([gathering("Monday"), gathering("Wed"), gathering("Thursday")]).map(
        (item) => item.weekday,
      ),
    ).toEqual([1, 3, 4]);
  });
  it("does not list inactive services or invent Sundays for unknown days", () => {
    expect(calendarServices([gathering("Friday", false), gathering("TBC"), gathering("")])).toEqual(
      [],
    );
  });
});
