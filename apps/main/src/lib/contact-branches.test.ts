import { describe, expect, it } from "vitest";

import {
  branchDisplayName,
  branchSchedule,
  directionsUrl,
  formatServiceTime,
  isKp2Branch,
  isUkBranch,
  primaryVenue,
  publicPhone,
  telHref,
  venueAddress,
  type ContactLocation,
  type ContactService,
  type ContactVenue,
} from "./contact-branches";

const venue = (over: Partial<ContactVenue> = {}): ContactVenue => ({
  id: "v1",
  name: null,
  address_line1: null,
  address_line2: null,
  city: null,
  postcode: null,
  country: "United Kingdom",
  latitude: null,
  longitude: null,
  ...over,
});

const service = (over: Partial<ContactService> = {}): ContactService => ({
  id: Math.random().toString(36),
  name: "Sunday Service",
  type: "sunday",
  day: "Sunday",
  start_time: "10:00:00",
  venue_id: "v1",
  sort_order: 0,
  is_active: true,
  ...over,
});

const branch = (over: Partial<ContactLocation> = {}): ContactLocation => ({
  id: "b1",
  slug: "london",
  name: "London",
  contact_email: null,
  contact_phone: null,
  pastor_name: null,
  pastor_role: null,
  venues: [venue()],
  services: [],
  ...over,
});

describe("formatServiceTime", () => {
  it("formats database times", () => {
    expect(formatServiceTime("09:00:00")).toBe("9:00 AM");
    expect(formatServiceTime("13:30:00")).toBe("1:30 PM");
    expect(formatServiceTime("12:00:00")).toBe("12:00 PM");
    expect(formatServiceTime("00:15:00")).toBe("12:15 AM");
  });

  it("returns nothing for missing or broken times", () => {
    expect(formatServiceTime(null)).toBe("");
    expect(formatServiceTime("")).toBe("");
    expect(formatServiceTime("soon")).toBe("");
  });
});

describe("branchSchedule", () => {
  it("joins Sunday services and lists midweek ones, skipping inactive and duplicate rows", () => {
    const schedule = branchSchedule(
      branch({
        services: [
          service({ start_time: "13:00:00", sort_order: 2 }),
          service({ start_time: "11:00:00", sort_order: 1 }),
          service({ start_time: "08:00:00", is_active: false }),
          service({ type: "midweek", day: "Wednesday", start_time: "18:00:00" }),
          service({ type: "midweek", day: "Wednesday", start_time: "18:00:00" }),
        ],
      }),
    );
    expect(schedule.sunday).toBe("11:00 AM & 1:00 PM");
    expect(schedule.midweek).toEqual([{ day: "Wednesday", time: "6:00 PM" }]);
  });

  it("treats a Sunday evening service logged as midweek as another Sunday time", () => {
    const schedule = branchSchedule(
      branch({
        services: [
          service({ start_time: "12:00:00" }),
          service({ type: "midweek", day: "Sunday", start_time: "18:30:00" }),
        ],
      }),
    );
    expect(schedule.sunday).toBe("12:00 PM & 6:30 PM");
    expect(schedule.midweek).toEqual([]);
  });

  it("collapses a Sunday time listed twice", () => {
    const schedule = branchSchedule(
      branch({
        services: [service({ start_time: "13:00:00" }), service({ start_time: "13:00:00" })],
      }),
    );
    expect(schedule.sunday).toBe("1:00 PM");
  });
});

describe("venueAddress", () => {
  it("drops labels used as venue names and repeated lines", () => {
    expect(
      venueAddress(
        venue({
          name: "Sunday Service",
          address_line1: "Carnation Road",
          address_line2: "Carnation Road",
          city: "Rochester",
        }),
      ),
    ).toBe("Carnation Road, Rochester");
  });

  it("treats Rd and Road as the same line", () => {
    expect(
      venueAddress(
        venue({
          name: "Sunday Service",
          address_line1: "16 Victoria Road",
          address_line2: "16 Victoria Rd",
          city: "Chelmsford",
        }),
      ),
    ).toBe("16 Victoria Road, Chelmsford");
  });

  it("keeps the longer line when one contains the other", () => {
    expect(
      venueAddress(
        venue({
          name: "Birmingham Sunday Service",
          address_line1: "58 Chester Street",
          address_line2: "Hubert Street/58 Chester Street",
          city: "Birmingham",
        }),
      ),
    ).toBe("Hubert Street/58 Chester Street, Birmingham");
  });

  it("keeps a real venue name and the postcode", () => {
    expect(
      venueAddress(
        venue({
          name: "London Sunday Venue",
          address_line1: "Kensington Town Hall",
          address_line2: "Hornton St",
          city: "London",
          postcode: "W8 7NX",
        }),
      ),
    ).toBe("Kensington Town Hall, Hornton St, London, W8 7NX");
  });

  it("does not drop a short line that only appears inside another word", () => {
    expect(venueAddress(venue({ address_line1: "Wembley Park", city: "Ely" }))).toBe(
      "Wembley Park, Ely",
    );
  });
});

describe("primaryVenue", () => {
  it("uses the first Sunday service's venue", () => {
    const b = branch({
      venues: [
        venue({ id: "mid", city: "Midweek hall" }),
        venue({ id: "sun", city: "Sunday hall" }),
      ],
      services: [service({ venue_id: "sun" })],
    });
    expect(primaryVenue(b)?.id).toBe("sun");
  });

  it("falls back to the first venue, or nothing", () => {
    expect(primaryVenue(branch({ venues: [venue({ id: "only" })] }))?.id).toBe("only");
    expect(primaryVenue(branch({ venues: [] }))).toBeNull();
  });
});

describe("directionsUrl", () => {
  it("prefers coordinates", () => {
    expect(directionsUrl(venue({ latitude: 51.5, longitude: -0.19 }))).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=51.5%2C-0.19",
    );
  });

  it("falls back to the address and returns null with nothing to go on", () => {
    expect(directionsUrl(venue({ address_line1: "6 Henley Road", city: "Reading" }))).toContain(
      encodeURIComponent("6 Henley Road, Reading, United Kingdom"),
    );
    expect(directionsUrl(null)).toBeNull();
    expect(directionsUrl(venue({ country: null }))).toBeNull();
  });
});

describe("phones", () => {
  it("hides placeholder and too-short numbers", () => {
    expect(publicPhone("+44 0000 000000")).toBeNull();
    expect(publicPhone("123")).toBeNull();
    expect(publicPhone(null)).toBeNull();
    expect(publicPhone(" +44 20 7946 0123 ")).toBe("+44 20 7946 0123");
  });

  it("keeps the plus sign in tel links and drops the (0)", () => {
    expect(telHref("+44 (0) 20 7946 0123")).toBe("tel:+442079460123");
    expect(telHref("020 7946 0123")).toBe("tel:02079460123");
  });
});

describe("isUkBranch", () => {
  it("splits UK branches from the rest", () => {
    expect(isUkBranch(branch())).toBe(true);
    expect(isUkBranch(branch({ venues: [venue({ country: "Ghana" })] }))).toBe(false);
    expect(isUkBranch(branch({ venues: [] }))).toBe(true);
  });
});

describe("branchDisplayName", () => {
  it("fixes the Chelmsford spelling only", () => {
    expect(branchDisplayName("Chelmesford")).toBe("Chelmsford");
    expect(branchDisplayName("London")).toBe("London");
  });
});

describe("isKp2Branch", () => {
  it("goes by the workspace set in the content studio", () => {
    expect(isKp2Branch({ name: "KP2 London", workspace: "kp2" })).toBe(true);
    expect(isKp2Branch({ name: "Manchester", workspace: "kharis" })).toBe(false);
    expect(isKp2Branch({ name: "KP2 Manchester", workspace: "kharis" })).toBe(false);
  });

  it("falls back to the name when the workspace is the default or missing", () => {
    expect(isKp2Branch({ name: "KP2 Romford", workspace: "general" })).toBe(true);
    expect(isKp2Branch({ name: "Reading", workspace: "general" })).toBe(false);
    expect(isKp2Branch({ name: "KP2 Romford" })).toBe(true);
    expect(isKp2Branch({ name: "London", workspace: null })).toBe(false);
    expect(isKp2Branch({ name: "KP2X" })).toBe(false);
  });
});
