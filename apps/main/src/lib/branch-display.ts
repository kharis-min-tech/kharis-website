import type { BranchData, Venue } from "@/lib/branches";

function clean(value: string | null | undefined) {
  return value?.trim() ?? "";
}

/** Public host for the kharis-images R2 bucket. Override with NEXT_PUBLIC_R2_PUBLIC_URL. */
function branchImageHost() {
  return (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://images.kharis.org").replace(/\/$/, "");
}

/** Branch photos live in Cloudflare. Stored studio URLs are rewritten onto images.kharis.org. */
/** Branch names as the public sees them. The directory still spells Chelmsford "Chelmesford" (the slug keeps it). */
export function branchDisplayName(name: string) {
  return name.replace(/^Chelmesford\b/, "Chelmsford");
}

export function remoteImage(url: string | null | undefined) {
  const value = clean(url);
  if (!value || /instagram\.com/i.test(value)) return "";
  const key = value.match(/branch-images\/[^\s?#]+/i)?.[0];
  if (key) return `${branchImageHost()}/${key}`;
  if (/^https?:\/\//i.test(value)) return value;
  return "";
}

export function placeholderDescription(city: string) {
  return `A thriving congregation serving ${city}. Experience uplifting worship, relevant biblical teaching, and deep kingdom connections.`;
}

type VenueLike = Pick<
  Venue,
  "id" | "name" | "address_line1" | "address_line2" | "city" | "postcode" | "latitude" | "longitude"
>;
type BranchLike = {
  venues?: VenueLike[] | null;
  services?: Pick<Branch["services"][number], "type" | "venue_id" | "is_active">[] | null;
};
type Branch = BranchData;

const NOT_SUNDAY = /midweek|prayer|bible study|zoom/i;

/** Where people go on a Sunday: the venue on the Sunday service, else the first venue that isn't a midweek one. */
export function sundayVenue<V extends VenueLike>(
  branch: { venues?: V[] | null } & BranchLike,
): V | undefined {
  const venues = branch.venues ?? [];
  const sunday = (branch.services ?? []).find(
    (service) => service.is_active && service.type?.toLowerCase() === "sunday",
  );
  const linked = sunday?.venue_id
    ? venues.find((venue) => venue.id === sunday.venue_id)
    : undefined;
  const namedSunday = venues.find((venue) => /sunday/i.test(venue.name ?? ""));
  // A Sunday service saved against a venue called "Midweek Service" is a data slip: trust the names.
  if (linked && /midweek/i.test(linked.name ?? "") && namedSunday) return namedSunday;
  return linked ?? venues.find((venue) => !NOT_SUNDAY.test(venue.name ?? "")) ?? venues[0];
}

const normalise = (value: string) =>
  value
    .toLowerCase()
    .replace(/\broad\b/g, "rd")
    .replace(/\bstreet\b/g, "st")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Venue names like "Sunday Service" or "London Sunday Venue" say nothing about where to go. */
const GENERIC_VENUE = /^(.*\s)?(sunday|midweek)\s+(service|venue)$/i;

/** One readable address line: no repeated parts, no generic venue names. Postcode kept separate. */
export function venueAddress(venue: VenueLike | undefined, { withName = true } = {}) {
  if (!venue) return "";
  const name = clean(venue.name);
  // Compare comma-separated pieces, so "Jockey Rd, Sutton Coldfield" can't repeat "24 Jockey Road".
  const segments = [
    withName && !GENERIC_VENUE.test(name) ? name : "",
    ...[venue.address_line1, venue.address_line2, venue.city].flatMap((line) =>
      clean(line ?? undefined).split(","),
    ),
  ];
  const parts: string[] = [];
  for (const raw of segments) {
    const part = raw
      .trim()
      .replace(/^\((.*)\)$/, "$1")
      .replace(/\s{2,}/g, " ");
    if (!part) continue;
    const key = normalise(part);
    const overlap = parts.findIndex((kept) => {
      const other = normalise(kept);
      return other === key || other.includes(key) || key.includes(other);
    });
    if (overlap === -1) parts.push(part);
    else if (key.length > normalise(parts[overlap]!).length) parts[overlap] = part;
  }
  return parts.join(", ");
}

/** Directions by address rather than pin: some stored coordinates point at the wrong town. */
export function directionsUrl(venue: VenueLike | undefined) {
  if (!venue) return "";
  const query = [venueAddress(venue), clean(venue.postcode ?? undefined)]
    .filter(Boolean)
    .join(", ");
  if (query) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  if (typeof venue.latitude === "number" && typeof venue.longitude === "number") {
    return `https://www.google.com/maps/search/?api=1&query=${venue.latitude},${venue.longitude}`;
  }
  return "";
}

const mainVenue = (branch: BranchData) => sundayVenue(branch);

/** London’s page shape, with this branch’s name and city. Missing facts stay obviously unfinished. */
export function presentBranch(branch: BranchData) {
  const venue = mainVenue(branch);
  const city = clean(venue?.city) || branch.name.replace(/\s*branch$/i, "").trim() || "your city";
  const storedDescription = clean(branch.short_description) || clean(branch.description);
  const description = storedDescription || placeholderDescription(city);
  const tagline = clean(branch.hero_subtitle) || "Christians boldly holding their Bible.";
  const pastorName = clean(branch.pastor_name);
  const pastorBio = clean(branch.pastor_bio);
  const address = [venueAddress(venue), clean(venue?.postcode ?? undefined)]
    .filter(Boolean)
    .join(", ");
  const lat = venue?.latitude;
  const lng = venue?.longitude;
  const hasCoords =
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    (lat !== 0 || lng !== 0);

  return {
    city,
    description,
    tagline,
    hero: remoteImage(branch.hero_image_url),
    portrait: remoteImage(branch.pastor_image_url),
    gallery: branch.gallery ?? [],
    pastorName: pastorName || "Coming soon",
    pastorKnown: Boolean(pastorName),
    pastorRole: clean(branch.pastor_role) || "Pastor",
    quote:
      pastorBio || `We exist to build a home of faith, hope, and love for every soul in ${city}.`,
    welcome: [
      `Welcome to ${branch.name}, part of the Kharis Church family.`,
      `${tagline} We love teaching the Word of God, and we long to see believers established in their faith and our city strengthened.`,
      `Whether you are visiting ${city} for a season or looking for a church to call home, there is a place for you here.`,
    ],
    address: address || "Address coming soon",
    hasAddress: Boolean(address),
    parking: clean(venue?.parking_info) || "Parking details for this branch will be added soon.",
    transit:
      clean(venue?.public_transport_info) || "Travel details for this branch will be added soon.",
    lat: hasCoords ? lat : null,
    lng: hasCoords ? lng : null,
  };
}
