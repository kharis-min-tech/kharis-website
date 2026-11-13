import { cache } from "react";
import {
  branchDisplayName,
  directionsUrl,
  placeholderDescription,
  remoteImage,
  sundayVenue,
  venueAddress,
} from "@/lib/branch-display";
import { kharisApiConfigured, siteGet } from "@/lib/kharis-api";
import { BRANCH_FIXTURE } from "@/lib/branch-fixture";

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
  video_url?: string | null;
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
  owner_type?: string | null;
  url: string | null;
};

async function mediaByBranch() {
  const galleries = new Map<string, string[]>();
  const videos = new Map<string, string>();
  const { data, error } = await siteGet<GalleryRow[]>(
    "/media?ownerType=branch-gallery,branch-video",
  );

  if (error || !data) return { galleries, videos };

  for (const row of data) {
    const id = row.branch_id || row.owner_id;
    if (!id) continue;
    if (row.owner_type === "branch-video") {
      const videoUrl = row.url?.trim() ?? "";
      if (videoUrl && !videos.has(id)) videos.set(id, videoUrl);
      continue;
    }
    const url = remoteImage(row.url);
    if (!url) continue;
    const list = galleries.get(id) ?? [];
    list.push(url);
    galleries.set(id, list);
  }

  return { galleries, videos };
}

// ======================================================
// GET ALL BRANCH DATA FROM SUPABASE
// ======================================================

// Share one directory read across cards, map and metadata within a server render.
export const listBranchData = cache(async (): Promise<BranchData[]> => {
  // Without credentials every query fails and the page used to render an empty
  // directory and an empty globe. Fall back to the development fixture, the
  // same way testimonies and messages already do.
  if (!kharisApiConfigured) return BRANCH_FIXTURE;

  const [{ data, error }, { galleries, videos }] = await Promise.all([
    siteGet<BranchData[]>("/branches"),
    mediaByBranch(),
  ]);

  if (error) {
    console.error("Failed to load branches from the Kharis API:", error);

    return [];
  }

  // Sort services inside each branch
  const branches = (data ?? []).map((branch) => ({
    ...branch,
    name: branchDisplayName(branch.name),

    venues: branch.venues ?? [],

    services: [...(branch.services ?? [])].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    ),

    gallery: galleries.get(branch.id) ?? [],
    video_url: videos.get(branch.id) ?? null,
  }));

  return branches as BranchData[];
});

// ======================================================
// TURN SUPABASE BRANCH INTO LOCATION CARD DATA
// ======================================================

const unique = (values: string[]) => [...new Set(values.filter(Boolean))];

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

// Our own photos for branches the studio has no photo for yet. Only add a branch here with photos taken there.
const SITE_PHOTOS: Record<string, string> = {
  london:
    "https://images.kharis.org/site-images/main/60262eef48c53cc5/locations/london-sunday-smiles.jpg",
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
  // Same development fallback as listBranchData. Without this the branch
  // detail pages rendered "Branch unavailable" offline even though the
  // directory that links to them was fully populated.
  if (!kharisApiConfigured) {
    return BRANCH_FIXTURE.find((branch) => branch.slug === slug) ?? null;
  }

  const [{ data, error, status }, { galleries, videos }] = await Promise.all([
    siteGet<BranchData>(`/branches/${encodeURIComponent(slug)}`),
    mediaByBranch(),
  ]);

  if (status === 404) return null;
  if (error) {
    console.error(`Failed to load branch "${slug}":`, error);

    return null;
  }

  if (!data) {
    return null;
  }

  return {
    ...data,
    name: branchDisplayName(data.name),

    venues: data.venues ?? [],

    services: [...(data.services ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),

    gallery: galleries.get(data.id) ?? [],
    video_url: videos.get(data.id) ?? null,
  } as BranchData;
}

export async function listBranchIds(): Promise<string[]> {
  const branches = await listBranchData();

  return branches.map((branch) => branch.slug);
}
