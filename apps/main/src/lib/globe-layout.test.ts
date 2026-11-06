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
  expect(globeCallouts(branches, "world")).toEqual([]);
  expect(globeCallouts(branches, "Ghana")).toEqual([branches[1]]);
  expect(globeCallouts([], "world")).toEqual([]);
});

it("includes every branch in a country, including KP2 branches", () => {
  const uk = Array.from({ length: 20 }, (_, index) => ({
    slug: index < 14 ? `branch-${index}` : `kp2-branch-${index}`,
    lat: 52,
    lng: -1,
    country: "United Kingdom",
  }));
  const ghana = { slug: "accra", lat: 5.6, lng: -0.2, country: "Ghana" };
  expect(globeCallouts([...uk, ghana], "United Kingdom")).toEqual(uk);
});

it("gives every card its own non-overlapping place around the globe", () => {
  for (const width of [984, 1400, 1880]) {
    for (const count of [7, 20, 28]) {
      const height = Math.max(820, Math.ceil(count / 4) * 140 + 112);
      const cards = Array.from({ length: count }, (_, index) => {
        const card = globeCardPosition(index, count, width, height);
        return { ...card, height: card.width / 3 + 68 };
      });
      for (const [index, card] of cards.entries()) {
        expect(card.y).toBeGreaterThan(0);
        expect(card.y + card.height).toBeLessThan(height);
        expect(card.x).toBeGreaterThan(0);
        expect(card.x + card.width).toBeLessThan(width);
        for (const other of cards.slice(index + 1)) {
          const overlap =
            card.x < other.x + other.width &&
            card.x + card.width > other.x &&
            card.y < other.y + other.height &&
            card.y + card.height > other.y;
          expect(overlap).toBe(false);
        }
      }
    }
  }
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
