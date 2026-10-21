/** A coarse starting view without asking for, storing or transmitting location. */
export function globeOrigin(timeZone: string, offsetMinutes: number) {
  const known: Record<string, { lat: number; lng: number }> = {
    "Europe/London": { lat: 54, lng: -2 },
    "Europe/Amsterdam": { lat: 52, lng: 5 },
    "Africa/Accra": { lat: 7.9, lng: -1.1 },
    "Africa/Freetown": { lat: 8.6, lng: -11.9 },
    "America/New_York": { lat: 40, lng: -74 },
    "America/Los_Angeles": { lat: 34, lng: -118 },
    "Australia/Sydney": { lat: -34, lng: 151 },
  };
  if (known[timeZone]) return known[timeZone];
  const lat = timeZone.startsWith("Europe/")
    ? 50
    : timeZone.startsWith("Australia/") || timeZone.startsWith("Pacific/")
      ? -25
      : timeZone.startsWith("Africa/")
        ? 5
        : 25;
  const longitude = Number.isFinite(offsetMinutes) ? -offsetMinutes / 4 : 0;
  return { lat, lng: ((((longitude + 180) % 360) + 360) % 360) - 180 };
}
