import { SITE_WORKSPACE } from "@/lib/site";
import { supabaseSelect } from "@/lib/supabase";

export type BranchService = {
  id: string;
  day: string;
  time: string;
  label: string;
  description: string;
  type: string;
};

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
  services: BranchService[];
  pastor: string;
  pastorRole: string;
  pastorImage: string;
  pastorBio: string;
  phone: string;
  email: string;
  instagram: string;
  blurb: string;
  description: string;
  tags: string[];
  image: string;
  givingLink: string | null;
  parkingInfo: string;
  transitInfo: string;
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
  parking_info: string | null;
  public_transport_info: string | null;
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
  pastor_image_url: string | null;
  pastor_bio: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  instagram: string | null;
  giving_link: string | null;
  sort_order: number | null;
  venues: VenueRow[] | null;
  services: ServiceRow[] | null;
};

const FALLBACK_IMAGE = "/assets/branch-slide-1.jpg";
const LOCAL_SLIDES = [
  "/assets/branch-slide-1.jpg",
  "/assets/branch-slide-2.jpg",
  "/assets/branch-slide-3.jpg",
  "/assets/branch-slide-4.jpg",
  "/assets/branch-slide-5.jpg",
];
const FALLBACK_PASTOR = "/assets/leadership-pastor-david.jpg";
const DEFAULT_PARKING = "Public parking is available near the venue.";
const DEFAULT_TRANSIT =
  "The venue is reachable by public transport. Check local bus and rail times before you travel.";

function formatTime(time?: string | null): string {
  if (!time) return "";
  const [hourString, minute = "00"] = time.split(":");
  let hour = Number(hourString);
  if (Number.isNaN(hour)) return time;
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

function cityFromName(name: string) {
  return name
    .replace(/^kharis phase 2\s*[—–-]?\s*/i, "")
    .replace(/^kp2\s*[—–-]?\s*/i, "")
    .trim();
}

function fallbackImageFor(slug: string) {
  const index =
    Math.abs([...slug].reduce((sum, ch) => sum + ch.charCodeAt(0), 0)) % LOCAL_SLIDES.length;
  return LOCAL_SLIDES[index]!;
}

function resolveBranchImage(url: string | null | undefined, slug: string) {
  if (!url || /assets\/design\//i.test(url)) return fallbackImageFor(slug);
  return url.startsWith("/") || url.startsWith("http") ? url : fallbackImageFor(slug);
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

  const mappedServices: BranchService[] = services.map((s, index) => ({
    id: s.id || `${row.slug}-service-${index}`,
    day: s.day || "Sunday",
    time: formatTime(s.start_time) || "TBC",
    label: s.name || s.description || s.type || "Gathering",
    description: s.description || "",
    type: s.type || "",
  }));

  const serviceTimes = mappedServices.map((s) => ({
    day: s.day,
    time: s.time,
    label: s.label,
  }));

  const blurb =
    row.short_description || row.description || `${row.name} — a Kharis Phase 2 campus.`;

  return {
    slug: row.slug,
    name: row.name,
    city: cityFromName(row.name) || mainVenue?.city || row.slug,
    region: row.subtitle || mainVenue?.country || "United Kingdom",
    address: address || "Location coming soon",
    postcode: mainVenue?.postcode || "",
    lat: mainVenue?.latitude ?? 0,
    lng: mainVenue?.longitude ?? 0,
    serviceTimes: serviceTimes.length
      ? serviceTimes
      : [{ day: "Sunday", time: "TBC", label: "Service information coming soon" }],
    services: mappedServices,
    pastor,
    pastorRole,
    pastorImage: row.pastor_image_url || FALLBACK_PASTOR,
    pastorBio: row.pastor_bio || `Welcome to ${row.name}.`,
    phone: row.contact_phone || "",
    email: row.contact_email || "",
    instagram: row.instagram || "",
    blurb,
    description: row.description || blurb,
    tags: ["Phase 2"].concat(mainVenue?.city ? [mainVenue.city] : []),
    image: resolveBranchImage(row.hero_image_url, row.slug),
    givingLink: row.giving_link,
    parkingInfo: mainVenue?.parking_info || DEFAULT_PARKING,
    transitInfo: mainVenue?.public_transport_info || DEFAULT_TRANSIT,
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

export function osmEmbedUrlAtZoom(branch: { lat: number; lng: number }, zoom = 15) {
  const { lat, lng } = branch;
  const span = (360 / Math.pow(2, zoom)) * 4;
  const latSpan = span * 0.6;
  const bbox = [lng - span, lat - latSpan, lng + span, lat + latSpan]
    .map((n) => n.toFixed(5))
    .join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function splitServices(services: BranchService[]) {
  const sunday = services.filter((s) => {
    const type = s.type.toLowerCase();
    const day = s.day.toLowerCase();
    if (type.includes("midweek")) return false;
    return type.includes("sunday") || day.startsWith("sun");
  });
  const midweek = services.filter((s) => !sunday.includes(s));
  if (sunday.length === 0) return { sunday: services, midweek: [] as BranchService[] };
  return { sunday, midweek };
}

export function sundaySummary(branch: Branch) {
  const { sunday } = splitServices(branch.services);
  const service = sunday[0] ?? branch.serviceTimes[0];
  if (!service) return "Service times coming soon";
  return `${service.day} · ${service.time}`;
}

export function midweekSummary(branch: Branch) {
  const { midweek } = splitServices(branch.services);
  const service = midweek[0];
  if (!service) return null;
  return `${service.day} · ${service.time}`;
}
