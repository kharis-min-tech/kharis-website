import {
  branchDisplayName,
  directionsUrl,
  placeholderDescription,
  remoteImage,
  sundayVenue,
  venueAddress,
} from "@/lib/branch-display";
import { supabase } from "@/lib/supabase";

// ======================================================
// TYPES
// ======================================================

export interface Venue {
  id: string;
  branch_id?: string;

  name: string;

  address_line1: string | null;
  address_line2: string | null;

  city: string | null;
  postcode: string | null;
  country: string | null;

  latitude: number | null;
  longitude: number | null;

  parking_info: string | null;
  public_transport_info: string | null;
  directions_text: string | null;
}

export interface Service {
  id: string;
  branch_id?: string;

  name: string;

  type: string;

  day: string;

  start_time: string;
  end_time: string | null;

  venue_id: string | null;

  description: string | null;

  sort_order: number;

  is_active: boolean;
}

export interface BranchData {
  id: string;

  name: string;
  slug: string;

  subtitle: string | null;
  /** "Kharis", or "Kharis Phase 2" for the KP2 young adults' branches. */
  group?: string | null;

  short_description: string | null;
  description: string | null;

  hero_image_url: string | null;
  hero_subtitle: string | null;

  gradient_start: string | null;
  gradient_end: string | null;

  pastor_name: string | null;
  pastor_image_url: string | null;
  pastor_bio: string | null;
  pastor_role: string | null;

  contact_email: string | null;
  contact_phone: string | null;

  instagram: string | null;

  sort_order: number;
  is_active: boolean;

  venues: Venue[];
  services: Service[];
  gallery: string[];
}

// ======================================================
// TYPE USED BY YOUR LOCATIONS CARDS
// ======================================================

export interface Gathering {
  /** e.g. "Midweek service", "Friday Revival Prayers" */
  label: string;
  day: string;
  time: string;
  /** Where it meets, when that isn't the Sunday venue. */
  place?: string;
}

export interface BranchItem {
  id: string;

  name: string;

  /** "KP2" for the young adults' branches, otherwise "Kharis". */
  family: "Kharis" | "KP2";
  /** Name without the "KP2" prefix, e.g. "Barking". */
  place: string;

  city: string;
  region: string;
  country: string;

  /** A real photo of the branch, or "" when only a placeholder graphic is stored. */
  photo: string;
  heroImage: string;

  postcode: string;
  address: string;
  directions: string;

  description: string;

  sundayTimes: string[];
  gatherings: Gathering[];
  serviceSummary: string;
  midweekSummary?: string;

  latitude?: number;
  longitude?: number;
}

// ======================================================
// FORMAT DATABASE TIME
//
// Supabase:
// 10:00:00
//
// Website:
// 10:00 AM
// ======================================================

function formatTime(time?: string | null): string {
  if (!time) return "";

  const [hourString, minute] = time.split(":");

  let hour = Number(hourString);

  const ampm = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12;

  return `${hour}:${minute} ${ampm}`;
}

type GalleryRow = {
  branch_id: string | null;
  owner_id: string | null;
  url: string | null;
};

async function galleriesByBranch() {
  const map = new Map<string, string[]>();
  const { data, error } = await supabase
    .from("media")
    .select("branch_id,owner_id,url,sort_order")
    .eq("owner_type", "branch-gallery")
    .order("sort_order", { ascending: true });

  if (error || !data) return map;

  for (const row of data as GalleryRow[]) {
    const id = row.branch_id || row.owner_id;
    const url = remoteImage(row.url);
    if (!id || !url) continue;
    const list = map.get(id) ?? [];
    list.push(url);
    map.set(id, list);
  }

  return map;
}

// ======================================================
// GET ALL BRANCH DATA FROM SUPABASE
// ======================================================

export async function listBranchData(): Promise<BranchData[]> {
  const [{ data, error }, galleries] = await Promise.all([
    supabase
      .from("branches")
      .select(
        `
      *,
      venues (*),
      services (*)
    `,
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    galleriesByBranch(),
  ]);

  if (error) {
    console.error("Failed to load branches from Supabase:", error);

    return [];
  }

  // Sort services inside each branch
  const branches = (data ?? []).map((branch) => ({
    ...branch,

    venues: branch.venues ?? [],

    services: [...(branch.services ?? [])].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    ),

    gallery: galleries.get(branch.id) ?? [],
  }));

  return branches as BranchData[];
}

// ======================================================
// TURN SUPABASE BRANCH INTO LOCATION CARD DATA
// ======================================================

const unique = (values: string[]) => [...new Set(values.filter(Boolean))];

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

// Our own photos for branches the studio has no photo for yet. Only add a branch here with photos taken there.
const SITE_PHOTOS: Record<string, string> = {
  london: "/images/locations/london-sunday-smiles.jpg",
};

export function toBranchItem(
  branch: BranchData,
  placeholders: Set<string> = new Set(),
): BranchItem {
  const activeServices = (branch.services ?? [])
    .filter((service) => service.is_active)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const isSunday = (service: Service) => service.type?.toLowerCase() === "sunday";
  const sundayTimes = unique(activeServices.filter(isSunday).map((s) => formatTime(s.start_time)));

  // Everything else people can come to, each once (some branches have the same service saved twice).
  const mainVenue = sundayVenue(branch);
  const sundayPlace = venueAddress(mainVenue);
  const seen = new Set<string>();
  const gatherings: Gathering[] = [];
  for (const service of activeServices.filter((s) => !isSunday(s))) {
    const time = formatTime(service.start_time);
    const key = `${service.day}|${time}`;
    if (!time || seen.has(key)) continue;
    seen.add(key);
    const venue = branch.venues.find((v) => v.id === service.venue_id);
    // Some venues are named after what happens there ("Friday Revival Prayers"); use that as the label.
    const describesService = /prayer|bible|revival|study|worship/i.test(venue?.name ?? "");
    const place = venueAddress(venue, { withName: !describesService });
    gatherings.push({
      label:
        describesService && venue ? venue.name : `${titleCase(service.type || "midweek")} service`,
      day: service.day,
      time,
      place: place && place !== sundayPlace ? place.split(", ")[0] : undefined,
    });
  }

  const isKp2 = /phase 2/i.test(branch.group ?? "") || /^kp2\b/i.test(branch.name);
  const name = branchDisplayName(branch.name);
  const place = name
    .replace(/^kp2\s+/i, "")
    .replace(/\s+branch$/i, "")
    .trim();
  const hero = remoteImage(branch.hero_image_url);
  const photo =
    (hero && !placeholders.has(hero) ? hero : "") ||
    branch.gallery[0] ||
    SITE_PHOTOS[branch.slug] ||
    "";
  const city = mainVenue?.city ?? place;

  return {
    id: branch.slug,
    name,
    family: isKp2 ? "KP2" : "Kharis",
    place,
    city,
    region: branch.subtitle ?? mainVenue?.country ?? "United Kingdom",
    country: mainVenue?.country || branch.subtitle || "United Kingdom",
    photo,
    heroImage: photo || hero,
    postcode: mainVenue?.postcode ?? "",
    address: venueAddress(mainVenue),
    directions: directionsUrl(mainVenue),
    description: branch.short_description ?? branch.description ?? placeholderDescription(city),
    sundayTimes,
    gatherings,
    serviceSummary: sundayTimes.length
      ? `Sunday ${sundayTimes.join(" & ")}`
      : "Service information coming soon",
    midweekSummary: gatherings.length
      ? gatherings.map((g) => `${g.day} ${g.time}`).join(" & ")
      : undefined,
    latitude: mainVenue?.latitude ?? undefined,
    longitude: mainVenue?.longitude ?? undefined,
  };
}

/** A hero image stored on several branches is the studio's placeholder graphic, not a photo of that branch. */
export function placeholderHeroes(branches: BranchData[]) {
  const counts = new Map<string, number>();
  for (const branch of branches) {
    const hero = remoteImage(branch.hero_image_url);
    if (hero) counts.set(hero, (counts.get(hero) ?? 0) + 1);
  }
  return new Set([...counts].filter(([, n]) => n > 2).map(([url]) => url));
}

// ======================================================
// GET DATA SPECIFICALLY FOR LOCATIONS CARDS
// ======================================================

export async function listBranches(): Promise<BranchItem[]> {
  const branches = await listBranchData();
  const placeholders = placeholderHeroes(branches);
  return branches.map((branch) => toBranchItem(branch, placeholders));
}

// ======================================================
// GET ONE BRANCH BY SLUG
//
// Useful later for:
//
// /locations/reading
// /locations/london
// /locations/brighton
// ======================================================

export async function getBranchBySlug(slug: string): Promise<BranchData | null> {
  const [{ data, error }, galleries] = await Promise.all([
    supabase
      .from("branches")
      .select(
        `
      *,
      venues (*),
      services (*)
    `,
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .single(),
    galleriesByBranch(),
  ]);

  if (error) {
    console.error(`Failed to load branch "${slug}":`, error);

    return null;
  }

  if (!data) {
    return null;
  }

  return {
    ...data,

    venues: data.venues ?? [],

    services: [...(data.services ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),

    gallery: galleries.get(data.id) ?? [],
  } as BranchData;
}

export async function listBranchIds(): Promise<string[]> {
  const branches = await listBranchData();

  return branches.map((branch) => branch.slug);
}
