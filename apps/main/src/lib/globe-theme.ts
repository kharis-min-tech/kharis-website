/**
 * The AtomicGlobe palette, shared by the Locations globe and the footer one so
 * the two read as the same object seen twice rather than two globes.
 *
 * The backdrop is transparent in the footer's case — see FooterWorld, which
 * overrides it so the sphere sits on the footer surface instead of punching a
 * coloured panel into it.
 */
export const KHARIS_GLOBE_PALETTE = {
  backdrop: "#150934",
  ink: "#c4a0ff",
  backFade: 0.16,
  tint: "#9b7bff",
  accent: "#ffde59",
  labelFill: "#1f1038",
  labelInk: "#f3f0f7",
  accentInk: "#1c1c1f",
} as const;

/**
 * The footer globe's palette, which flips with the site theme.
 *
 * Purple land with yellow patches works on a white page and is wrong on a
 * near-black one: full-strength purple and full-strength yellow at the same
 * saturation, on a dark field, vibrate against each other. So the dark footer
 * inverts the pair — the land goes yellow and becomes the quiet mass, and the
 * patches go purple.
 *
 * The Locations globe keeps KHARIS_GLOBE_PALETTE in both themes. It draws on
 * its own fixed midnight backdrop rather than the page, so it never sits on
 * white and never had the problem.
 */
export const FOOTER_GLOBE_PALETTE = {
  light: {
    ...KHARIS_GLOBE_PALETTE,
    backdrop: "rgba(0,0,0,0)",
    // Deep purple against the pale purple land: same hue, darker shade, so
    // a patch reads as emphasis rather than as a different kind of thing.
    spotColor: "#4c08a8",
    // Also the route colour. The inherited yellow was invisible on white.
    accent: "#4c08a8",
  },
  dark: {
    ...KHARIS_GLOBE_PALETTE,
    backdrop: "rgba(0,0,0,0)",
    // The campaign yellow exactly, so the land matches the yellow in the
    // strapline beside it. An earlier warmer value read as orange, which is
    // a colour the dark theme does not otherwise use.
    ink: "#ffde59",
    tint: "#fff6cf",
    accent: "#fffbe8",
    // A patch is a brighter shade of the same yellow, not a second hue.
    // Purple patches on a yellow globe read as a rash rather than as places.
    spotColor: "#fffdf2",
  },
} as const;

/**
 * Where the churches are, in the order they come round.
 *
 * The footer globe shows these as bare pins with no names on them. The
 * component draws every forward-facing label and has no collision handling,
 * so at the footer's size the four UK cities piled into one unreadable stack.
 * The strapline underneath says the vision in words more succinctly than a
 * field of labels ever did, which leaves the globe free to do the one thing
 * it is good at: showing reach.
 *
 * The labels are still set on each place, and FooterWorld's CSS hides them.
 * They are what the Locations globe reads, and they are the fallback if that
 * CSS ever fails to load.
 */
export const GLOBE_CITIES = [
  { label: "London", lat: 51.5074, lng: -0.1278 },
  { label: "Birmingham", lat: 52.4862, lng: -1.8904 },
  { label: "Manchester", lat: 53.4808, lng: -2.2426 },
  { label: "Nottingham", lat: 52.9548, lng: -1.1581 },
  { label: "Accra", lat: 5.6037, lng: -0.187 },
  { label: "Freetown", lat: 8.4657, lng: -13.2317 },
] as const;

/**
 * Where we are going. The vision is 100 churches worldwide by 2030, and a
 * globe that only shows the six cities we are already in cannot say that.
 *
 * These are marked apart from the cities above by their label alone: the
 * component has one global marker style and no per-place colour, so the year
 * in the name is what stops a planned city reading as a church that already
 * exists. Do not drop the year.
 *
 * Spread right around the sphere on purpose, so there is always something on
 * the face that is turned towards you — including the Pacific half, which was
 * an empty blue blank on every rotation before these were added.
 *
 * All sit north of roughly five degrees south: the footer crops the globe at
 * its equator, so anything further south is never seen.
 *
 * These are placeholders for a real plan, not a commitment the church has
 * made. Swap them for the cities actually being worked towards; this array is
 * the only place to edit.
 */
export const GLOBE_VISION_CITIES = [
  // West and Central Africa
  { label: "Lagos", lat: 6.5244, lng: 3.3792 },
  { label: "Banjul", lat: 13.4549, lng: -16.579 },
  { label: "Abidjan", lat: 5.36, lng: -4.0083 },
  { label: "Kinshasa", lat: -4.4419, lng: 15.2663 },
  // East Africa
  { label: "Nairobi", lat: -1.2921, lng: 36.8219 },
  { label: "Kampala", lat: 0.3476, lng: 32.5825 },
  { label: "Addis Ababa", lat: 9.032, lng: 38.7469 },
  // Europe
  { label: "Paris", lat: 48.8566, lng: 2.3522 },
  { label: "Amsterdam", lat: 52.3676, lng: 4.9041 },
  { label: "Lisbon", lat: 38.7223, lng: -9.1393 },
  { label: "Berlin", lat: 52.52, lng: 13.405 },
  // North America and the Caribbean
  { label: "New York", lat: 40.7128, lng: -74.006 },
  { label: "Atlanta", lat: 33.749, lng: -84.388 },
  { label: "Toronto", lat: 43.6532, lng: -79.3832 },
  { label: "Houston", lat: 29.7604, lng: -95.3698 },
  { label: "Los Angeles", lat: 34.0522, lng: -118.2437 },
  { label: "Kingston", lat: 17.9712, lng: -76.7936 },
  // The Gulf and Asia
  { label: "Dubai", lat: 25.2048, lng: 55.2708 },
  { label: "Mumbai", lat: 19.076, lng: 72.8777 },
  { label: "Singapore", lat: 1.3521, lng: 103.8198 },
  { label: "Hong Kong", lat: 22.3193, lng: 114.1694 },
  { label: "Manila", lat: 14.5995, lng: 120.9842 },
] as const;

/** The suffix that marks a city as planned rather than planted. */
export const VISION_YEAR = "2030";
