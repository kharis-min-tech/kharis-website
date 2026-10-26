type Camera = { lat: number; lng: number; zoom: number };

/** Ease the whole journey, turning towards the destination before the close-up. */
export function interpolateGlobeCamera(from: Camera, to: Camera, progress: number): Camera {
  const t = Math.max(0, Math.min(1, progress));
  const ease = t * t * (3 - 2 * t);
  const zoomTime = Math.max(0, (t - 0.15) / 0.85);
  const zoomEase = zoomTime * zoomTime * (3 - 2 * zoomTime);
  const longitude = ((((to.lng - from.lng + 180) % 360) + 360) % 360) - 180;
  return {
    lat: from.lat + (to.lat - from.lat) * ease,
    lng: from.lng + longitude * ease,
    zoom: Math.exp(Math.log(from.zoom) + Math.log(to.zoom / from.zoom) * zoomEase),
  };
}
