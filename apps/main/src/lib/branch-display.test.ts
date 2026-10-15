import { describe, expect, it } from "vitest";
import { branchDisplayName, directionsUrl, sundayVenue, venueAddress } from "./branch-display";

const venue = (fields: Partial<Parameters<typeof venueAddress>[0] & object>) => ({
  id: "v",
  name: "",
  address_line1: null,
  address_line2: null,
  city: null,
  postcode: null,
  latitude: null,
  longitude: null,
  ...fields,
});

describe("venueAddress", () => {
  it("drops generic venue names and repeated street lines", () => {
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

  it("keeps the fuller of two overlapping lines", () => {
    expect(
      venueAddress(
        venue({
          name: "Sunday Service",
          address_line1: "Tintagel Road",
          address_line2: "(The Community Hall), Tintagel Rd",
          city: "Orpington",
        }),
      ),
    ).toBe("Tintagel Road, The Community Hall, Orpington");
  });

  it("keeps a real venue name and drops one that repeats the first line", () => {
    expect(
      venueAddress(
        venue({
          name: "London Sunday Venue",
          address_line1: "Kensington Town Hall",
          address_line2: "Hornton St",
          city: "London",
        }),
      ),
    ).toBe("Kensington Town Hall, Hornton St, London");
    expect(
      venueAddress(
        venue({ name: "NARPO HOTELS", address_line1: "Narpo Hotels", city: "Achimota" }),
      ),
    ).toBe("NARPO HOTELS, Achimota");
  });
});

describe("venueAddress segments", () => {
  it("drops a street repeated inside the second line", () => {
    expect(
      venueAddress(
        venue({
          name: "Midweek Service",
          address_line1: "24 Jockey Road",
          address_line2: "Jockey Rd, Sutton Coldfield",
          city: "Sutton Coldfield",
        }),
      ),
    ).toBe("24 Jockey Road, Sutton Coldfield");
  });
});

describe("sundayVenue", () => {
  it("trusts venue names over a Sunday service saved against the midweek venue", () => {
    const branch = {
      venues: [
        venue({ id: "a", name: "Midweek Service" }),
        venue({ id: "b", name: "Sunday Service" }),
      ],
      services: [{ type: "sunday", venue_id: "a", is_active: true }],
    };
    expect(sundayVenue(branch)?.id).toBe("b");
  });

  it("uses the venue on the Sunday service", () => {
    const branch = {
      venues: [venue({ id: "a", name: "Midweek Service" }), venue({ id: "b", name: "Hall" })],
      services: [{ type: "sunday", venue_id: "b", is_active: true }],
    };
    expect(sundayVenue(branch)?.id).toBe("b");
  });

  it("skips midweek venues when the Sunday service has no venue", () => {
    const branch = {
      venues: [
        venue({ id: "a", name: "Midweek Service" }),
        venue({ id: "b", name: "Sunday Service" }),
      ],
      services: [{ type: "sunday", venue_id: null, is_active: true }],
    };
    expect(sundayVenue(branch)?.id).toBe("b");
  });
});

describe("directionsUrl", () => {
  it("searches by address and postcode", () => {
    expect(
      directionsUrl(
        venue({ address_line1: "6 Henley Road", city: "Reading", postcode: "RG4 6DX" }),
      ),
    ).toBe(
      "https://www.google.com/maps/search/?api=1&query=6%20Henley%20Road%2C%20Reading%2C%20RG4%206DX",
    );
  });
});

describe("branchDisplayName", () => {
  it("fixes the Chelmsford spelling and leaves other names alone", () => {
    expect(branchDisplayName("Chelmesford")).toBe("Chelmsford");
    expect(branchDisplayName("KP2 London")).toBe("KP2 London");
  });
});
