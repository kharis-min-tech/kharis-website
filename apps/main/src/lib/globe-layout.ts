export type GlobeLocation = { slug: string; lat: number; lng: number; country: string | null };

export function globeGeometry(width: number, height: number, zoom: number) {
  return {
    x: width / 2,
    y: height * 0.48,
    radius: Math.min(width * (width < 760 ? 0.49 : 0.34), height * 0.46) * zoom,
  };
}

export function projectGlobePoint(
  point: Pick<GlobeLocation, "lat" | "lng">,
  camera: { lat: number; lng: number; zoom: number },
  width: number,
  height: number,
) {
  const radians = Math.PI / 180;
  const lat = point.lat * radians,
    lng = (point.lng - camera.lng) * radians;
  const tilt = camera.lat * radians;
  const depth = Math.cos(lat) * Math.cos(lng);
  const sphere = globeGeometry(width, height, camera.zoom);
  return {
    x: sphere.x + Math.cos(lat) * Math.sin(lng) * sphere.radius,
    y: sphere.y - (Math.sin(lat) * Math.cos(tilt) - depth * Math.sin(tilt)) * sphere.radius,
    depth: Math.sin(lat) * Math.sin(tilt) + depth * Math.cos(tilt),
  };
}

/** A small, stable selection keeps dense UK branches from covering the globe. */
export function globeCallouts<T extends GlobeLocation>(
  branches: readonly T[],
  country: string,
): T[] {
  const available = branches.filter((branch) => country === "world" || branch.country === country);
  if (country !== "world") return available.slice(0, 6);
  const preferred = ["london", "accra", "freetown", "birmingham"];
  const picked = preferred.flatMap(
    (slug) => available.find((branch) => branch.slug === slug) ?? [],
  );
  for (const branch of available) {
    if (picked.length >= 4) break;
    if (!picked.some((item) => item.slug === branch.slug)) picked.push(branch);
  }
  return picked;
}

export function globeCardPosition(index: number, count: number, width: number, height: number) {
  const cardWidth = Math.max(156, Math.min(224, width * 0.19));
  const cardHeight = cardWidth * 0.52 + 66;
  const slots =
    count <= 4
      ? [
          [0, 0.07],
          [1, 0.64],
          [0, 0.64],
          [1, 0.07],
        ]
      : [
          [0, 0.04],
          [1, 0.04],
          [0, 0.35],
          [1, 0.35],
          [0, 0.66],
          [1, 0.66],
        ];
  const [right, top] = slots[index % slots.length];
  const x = right ? width - cardWidth - width * 0.035 : width * 0.035;
  const y = Math.min(height - cardHeight - 12, height * top);
  return {
    x,
    y,
    width: cardWidth,
    anchorX: x + (right ? 0 : cardWidth),
    anchorY: y + cardHeight / 2,
  };
}
