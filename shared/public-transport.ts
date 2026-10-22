const TRAVEL_ADVICE =
  "Check live public transport routes to the venue, or contact the branch for travel advice.";

/** This repeated imported sentence is placeholder copy, not verified travel guidance. */
const IMPORTED_STATION_PLACEHOLDER = /^The venue is approximately five minutes from .+ Station\.$/i;

export function publicTransportInfo(value?: string | null) {
  const text = value?.trim() ?? "";
  return !text || IMPORTED_STATION_PLACEHOLDER.test(text) ? TRAVEL_ADVICE : text;
}
