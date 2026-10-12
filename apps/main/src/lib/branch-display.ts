import type { BranchData, Venue } from "@/lib/branches";

/** Shared worship photos. Used only when a branch has no studio image yet. */
export const TEMPLATE_GALLERY = [
  "/images/branch-slide-1.jpg",
  "/images/branch-slide-2.jpg",
  "/images/branch-slide-3.jpg",
  "/images/branch-slide-4.jpg",
];

const TEMPLATE_HERO = "/images/branch-slide-1.jpg";
const TEMPLATE_PORTRAIT = "/images/community.jpg";

function clean(value: string | null | undefined) {
  return value?.trim() ?? "";
}

/** Keep a real studio URL. Relative placeholder paths are not files on this site. */
export function templateImage(url: string | null | undefined, fallback: string) {
  const value = clean(url);
  if (!value || /instagram\.com/i.test(value)) return fallback;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/images/") || value.startsWith("/videos/")) return value;
  return fallback;
}

export function placeholderDescription(city: string) {
  return `A thriving congregation serving ${city}. Experience uplifting worship, relevant biblical teaching, and deep kingdom connections.`;
}

function mainVenue(branch: BranchData): Venue | undefined {
  const sunday = (branch.services ?? []).find(
    (service) => service.is_active && service.type?.toLowerCase() === "sunday",
  );
  if (sunday?.venue_id) {
    const match = branch.venues?.find((venue) => venue.id === sunday.venue_id);
    if (match) return match;
  }
  return branch.venues?.[0];
}

/** London’s page shape, with this branch’s name and city. Missing facts stay obviously unfinished. */
export function presentBranch(branch: BranchData) {
  const venue = mainVenue(branch);
  const city =
    clean(venue?.city) ||
    branch.name.replace(/\s*branch$/i, "").trim() ||
    "your city";
  const storedDescription = clean(branch.short_description) || clean(branch.description);
  const description = storedDescription || placeholderDescription(city);
  const tagline = clean(branch.hero_subtitle) || "Christians boldly holding their Bible.";
  const pastorName = clean(branch.pastor_name);
  const pastorBio = clean(branch.pastor_bio);
  const address = [venue?.name, venue?.address_line1, venue?.address_line2, venue?.city, venue?.postcode]
    .map((part) => clean(part ?? undefined))
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
    hero: templateImage(branch.hero_image_url, TEMPLATE_HERO),
    portrait: templateImage(branch.pastor_image_url, TEMPLATE_PORTRAIT),
    pastorName: pastorName || "Coming soon",
    pastorKnown: Boolean(pastorName),
    pastorRole: clean(branch.pastor_role) || "Pastor",
    quote:
      pastorBio ||
      `We exist to build a home of faith, hope, and love for every soul in ${city}.`,
    welcome: [
      `Welcome to ${branch.name}, part of the Kharis Church family.`,
      `${tagline} We love teaching the Word of God, and we long to see believers established in their faith and our city strengthened.`,
      `Whether you are visiting ${city} for a season or looking for a church to call home, there is a place for you here.`,
    ],
    address: address || "Address coming soon",
    hasAddress: Boolean(address),
    parking: clean(venue?.parking_info) || "Parking details for this branch will be added soon.",
    transit: clean(venue?.public_transport_info) || "Travel details for this branch will be added soon.",
    lat: hasCoords ? lat : null,
    lng: hasCoords ? lng : null,
  };
}
