import { describe, expect, it } from "vitest";
import { interpolateGlobeCamera } from "./globe-camera";

describe("globe camera journeys", () => {
  const world = { lat: 30, lng: -4, zoom: 1.35 };
  const ghana = { lat: 7.9, lng: -1.1, zoom: 9 };

  it("starts without a jump and arrives at the country", () => {
    expect(interpolateGlobeCamera(world, ghana, 0)).toEqual(world);
    const arrival = interpolateGlobeCamera(world, ghana, 1);
    expect(arrival.lat).toBeCloseTo(ghana.lat);
    expect(arrival.lng).toBeCloseTo(ghana.lng);
    expect(arrival.zoom).toBeCloseTo(ghana.zoom);
  });

  it("turns first, keeping the initial zoom gentle", () => {
    const early = interpolateGlobeCamera(world, ghana, 0.1);
    expect(early.zoom).toBeCloseTo(world.zoom);
    expect(early.lat).toBeLessThan(world.lat);
    expect(interpolateGlobeCamera(world, ghana, 0.5).zoom).toBeLessThan(4);
  });

  it("crosses the date line by the shortest route", () => {
    expect(interpolateGlobeCamera({ ...world, lng: 170 }, { ...world, lng: -170 }, 0.5).lng).toBe(
      180,
    );
    expect(interpolateGlobeCamera({ ...world, lng: -170 }, { ...world, lng: 170 }, 0.5).lng).toBe(
      -180,
    );
  });
});
