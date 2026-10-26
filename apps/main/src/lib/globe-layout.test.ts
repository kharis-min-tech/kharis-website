import { expect, it } from "vitest";
import { globeCallouts, globeCardPosition, globeGeometry, projectGlobePoint } from "./globe-layout";

it("projects the same location as the camera at the centre, with the opposite side hidden", () => {
  const camera = { lat: 30, lng: -4, zoom: 1.05 };
  const centre = globeGeometry(1440, 760, camera.zoom);
  const point = projectGlobePoint(camera, camera, 1440, 760);
  expect(point.x).toBeCloseTo(centre.x);
  expect(point.y).toBeCloseTo(centre.y);
  expect(point.depth).toBeCloseTo(1);
  expect(projectGlobePoint({ lat: -30, lng: 176 }, camera, 1440, 760).depth).toBeCloseTo(-1);
});

it("uses real branches from each country and filters country close-ups", () => {
  const branches = [
    { slug: "london", lat: 51.5, lng: 0, country: "United Kingdom" },
    { slug: "accra", lat: 5.6, lng: -0.2, country: "Ghana" },
    { slug: "freetown", lat: 8.5, lng: -13.2, country: "Sierra Leone" },
    { slug: "birmingham", lat: 52.5, lng: -1.9, country: "United Kingdom" },
  ];
  expect(globeCallouts(branches, "world")).toEqual(branches);
  expect(globeCallouts(branches, "Ghana")).toEqual([branches[1]]);
  expect(globeCallouts([], "world")).toEqual([]);
});

it("keeps cards inside the scene and clear of the opposite column", () => {
  for (const width of [760, 1024, 1440]) {
    for (const count of [4, 6]) {
      for (let i = 0; i < count; i++) {
        const card = globeCardPosition(i, count, width, 760);
        expect(card.x).toBeGreaterThan(0);
        expect(card.x + card.width).toBeLessThan(width);
        expect(card.y).toBeGreaterThan(0);
        expect(card.anchorX).toBeGreaterThanOrEqual(card.x);
        expect(card.anchorX).toBeLessThanOrEqual(card.x + card.width);
      }
    }
  }
});
