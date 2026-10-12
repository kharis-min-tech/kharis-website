import type { BranchData, Venue } from "@/lib/branches";

function clean(value: string | null | undefined) {
  return value?.trim() ?? "";
}

/** Branch photos are remote files from Cloudflare. Local page images are not branch photos. */
export function remoteImage(url: string | null | undefined) {
  const value = clean(url);
  if (!/^https?:\/\//i.test(value) || /instagram\.com/i.test(value)) return "";
  return value;
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
    hero: remoteImage(branch.hero_image_url),
    portrait: remoteImage(branch.pastor_image_url),
    gallery: branch.gallery ?? [],
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
