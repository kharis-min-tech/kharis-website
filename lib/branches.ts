import { SITE_WORKSPACE } from "@/lib/site";
import { supabaseSelect } from "@/lib/supabase";

export type Branch = {
  slug: string;
  name: string;
  city: string;
  region: string;
  address: string;
  postcode: string;
  lat: number;
  lng: number;
  serviceTimes: { day: string; time: string; label: string }[];
  pastor: string;
  pastorRole: string;
  phone: string;
  email: string;
  instagram: string;
  blurb: string;
  tags: string[];
  image: string;
  givingLink: string | null;
};

type VenueRow = {
  id: string;
  name: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postcode: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
};

type ServiceRow = {
  id: string;
  name: string | null;
  type: string | null;
  day: string | null;
  start_time: string | null;
  description: string | null;
  sort_order: number | null;
  is_active: boolean | null;
  venue_id: string | null;
};

type BranchRow = {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  group: string | null;
  workspace: string | null;
  short_description: string | null;
  description: string | null;
  hero_image_url: string | null;
  pastor_name: string | null;
  pastor_role: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  instagram: string | null;
  giving_link: string | null;
  sort_order: number | null;
  venues: VenueRow[] | null;
  services: ServiceRow[] | null;
};

const FALLBACK_IMAGE = "/assets/branch-slide-1.jpg";

function formatTime(time?: string | null): string {
  if (!time) return "";
  const [hourString, minute = "00"] = time.split(":");
  let hour = Number(hourString);
  if (Number.isNaN(hour)) return time;
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

function roleLabel(role?: string | null): string {
  return role === "lead" ? "Branch Lead" : "Pastor";
}

function pastorDisplay(name?: string | null, role?: string | null) {
  const label = roleLabel(role);
  if (!name?.trim()) return { pastor: "The KP2 Team", pastorRole: label };
  const alreadyTitled = name.toLowerCase().startsWith(label.toLowerCase());
  return { pastor: name.trim(), pastorRole: alreadyTitled ? "" : label };
}

/** KP2 site: Phase 2 campuses, or rows explicitly tagged kp2. Never dump the main Kharis network. */
export function isKp2Location(row: {
  workspace?: string | null;
  group?: string | null;
  slug?: string | null;
  name?: string | null;
}): boolean {
  if (row.workspace === SITE_WORKSPACE) return true;
  if (row.workspace === "kharis") return false;
  const group = (row.group ?? "").toLowerCase();
  const slug = (row.slug ?? "").toLowerCase();
  const name = (row.name ?? "").toLowerCase();
  return group.includes("phase 2") || slug.startsWith("kp2-") || name.includes("phase 2");
}

function toBranch(row: BranchRow): Branch {
  const venues = row.venues ?? [];
  const services = [...(row.services ?? [])]
    .filter((s) => s.is_active !== false)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const sunday = services.find((s) => (s.type ?? "").toLowerCase() === "sunday");
  const mainVenue =
    (sunday?.venue_id ? venues.find((v) => v.id === sunday.venue_id) : undefined) ??
    venues[0];

  const address = [
    mainVenue?.name,
    mainVenue?.address_line1,
    mainVenue?.address_line2,
    mainVenue?.city,
  ]
    .filter(Boolean)
    .join(", ");

  const { pastor, pastorRole } = pastorDisplay(row.pastor_name, row.pastor_role);

  const serviceTimes = services.map((s) => ({
    day: s.day || "Sunday",
    time: formatTime(s.start_time) || "TBC",
    label: s.name || s.description || s.type || "Gathering",
  }));

  return {
    slug: row.slug,
    name: row.name,
    city: mainVenue?.city || row.name.replace(/^kharis phase 2\s*[—-]?\s*/i, "") || row.slug,
    region: row.subtitle || mainVenue?.country || "United Kingdom",
    address: address || "Location coming soon",
    postcode: mainVenue?.postcode || "",
    lat: mainVenue?.latitude ?? 0,
    lng: mainVenue?.longitude ?? 0,
    serviceTimes: serviceTimes.length
      ? serviceTimes
      : [{ day: "Sunday", time: "TBC", label: "Service information coming soon" }],
    pastor,
    pastorRole,
    phone: row.contact_phone || "",
    email: row.contact_email || "",
    instagram: row.instagram || "",
    blurb: row.short_description || row.description || `${row.name} — a Kharis Phase 2 campus.`,
    tags: ["Phase 2"].concat(mainVenue?.city ? [mainVenue.city] : []),
    image: row.hero_image_url || FALLBACK_IMAGE,
    givingLink: row.giving_link,
  };
}

export function hasCoords(branch: { lat: number; lng: number }) {
  return Number.isFinite(branch.lat) && Number.isFinite(branch.lng) && (branch.lat !== 0 || branch.lng !== 0);
}

export async function listBranches(): Promise<Branch[]> {
  const rows = await supabaseSelect<BranchRow>(
    "branches",
    "select=*,venues(*),services(*)&is_active=eq.true&order=sort_order.asc",
  );
  return rows.filter(isKp2Location).map(toBranch);
}

export async function getBranch(slug: string): Promise<Branch | null> {
  const rows = await supabaseSelect<BranchRow>(
    "branches",
    `select=*,venues(*),services(*)&slug=eq.${encodeURIComponent(slug)}&is_active=eq.true`,
  );
  const row = rows[0];
  if (!row || !isKp2Location(row)) return null;
  return toBranch(row);
}

export async function listBranchSlugs(): Promise<string[]> {
  const branches = await listBranches();
  return branches.map((b) => b.slug);
}

/** Great-circle distance in miles. */
export function distanceMiles(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function osmEmbedUrl(branch: { lat: number; lng: number }, zoomPad = 0.06) {
  const { lat, lng } = branch;
  const bbox = [lng - zoomPad, lat - zoomPad / 2, lng + zoomPad, lat + zoomPad / 2]
    .map((n) => n.toFixed(4))
    .join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}
