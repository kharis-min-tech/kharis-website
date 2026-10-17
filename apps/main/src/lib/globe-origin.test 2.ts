import { describe, expect, it } from "vitest";
import { globeOrigin } from "./globe-origin";

describe("globe starting position", () => {
  it("keeps the Netherlands view stable across daylight saving changes", () => {
    expect(globeOrigin("Europe/Amsterdam", -60)).toEqual({ lat: 52, lng: 5 });
    expect(globeOrigin("Europe/Amsterdam", -120)).toEqual({ lat: 52, lng: 5 });
  });
  it("centres Ghana and Sierra Leone separately despite their shared time offset", () => {
    expect(globeOrigin("Africa/Accra", 0)).toEqual({ lat: 7.9, lng: -1.1 });
    expect(globeOrigin("Africa/Freetown", 0)).toEqual({ lat: 8.6, lng: -11.9 });
  });
  it("places Australia in the southern hemisphere", () => {
    expect(globeOrigin("Australia/Perth", -480)).toEqual({ lat: -25, lng: 120 });
  });
  it("wraps extreme UTC offsets into a valid longitude", () => {
    expect(globeOrigin("Pacific/Kiritimati", -840).lng).toBe(-150);
  });
  it("handles an unavailable offset", () => {
    expect(globeOrigin("UTC", NaN)).toEqual({ lat: 25, lng: 0 });
  });
});
