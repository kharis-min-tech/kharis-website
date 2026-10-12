import { localImage, studioImage } from "@/lib/local-image";
import { supabase } from "@/lib/supabase";

/** Phase 2 campuses live on /kp2. They are stored with a kp2- slug, not a separate workspace. */
export function isKharisBranch(row: {
  workspace?: string | null;
  slug?: string | null;
  name?: string | null;
}) {
  if (row.workspace === "kp2") return false;
  const slug = (row.slug ?? "").toLowerCase();
  const name = (row.name ?? "").toLowerCase();
  return !slug.startsWith("kp2-") && !name.includes("phase 2");
}


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
  galleryImages?: string[];
}


// ======================================================
// TYPE USED BY YOUR LOCATIONS CARDS
// ======================================================

export interface BranchItem {
  id: string;

  name: string;

  city: string;
  region: string;

  heroImage: string;

  postcode: string;
  address: string;

  description: string;

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


// ======================================================
// GET ALL BRANCH DATA FROM SUPABASE
// ======================================================

export async function listBranchData(): Promise<BranchData[]> {
  const { data, error } = await supabase
    .from("branches")
    .select(`
      *,
      venues (*),
      services (*)
    `)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });


  if (error) {
    console.error(
      "Failed to load branches from Supabase:",
      error
    );

    return [];
  }


  // Sort services inside each branch
  const branches = (data ?? []).map((branch) => ({
    ...branch,

    venues: branch.venues ?? [],

    services: [...(branch.services ?? [])].sort(
      (a, b) =>
        (a.sort_order ?? 0) - (b.sort_order ?? 0)
    ),
  }));


  return withStudioImages(branches.filter(isKharisBranch) as BranchData[]);
}


// ======================================================
// TURN SUPABASE BRANCH INTO LOCATION CARD DATA
// ======================================================

export function toBranchItem(
  branch: BranchData
): BranchItem {

  // ------------------------------------------
  // ACTIVE SERVICES ONLY
  // ------------------------------------------

  const activeServices = (branch.services ?? [])
    .filter((service) => service.is_active)
    .sort(
      (a, b) =>
        (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );


  // ------------------------------------------
  // SUNDAY SERVICES
  // ------------------------------------------

  const sundayServices = activeServices.filter(
    (service) =>
      service.type?.toLowerCase() === "sunday"
  );


  // ------------------------------------------
  // MIDWEEK SERVICE
  // ------------------------------------------

  const midweekServices = activeServices.filter(
    (service) =>
      service.type?.toLowerCase() === "midweek"
  );


  // ------------------------------------------
  // MAIN SUNDAY SERVICE
  //
  // Used to determine the primary venue shown
  // on the locations page.
  // ------------------------------------------

  const mainSundayService = sundayServices[0];


  // ------------------------------------------
  // FIND MAIN VENUE
  // ------------------------------------------

  let mainVenue: Venue | undefined;


  if (mainSundayService?.venue_id) {
    mainVenue = branch.venues.find(
      (venue) =>
        venue.id === mainSundayService.venue_id
    );
  }


  // If no Sunday venue exists,
  // fall back to the first venue.

  if (!mainVenue) {
    mainVenue = branch.venues?.[0];
  }


  // ------------------------------------------
  // ADDRESS
  // ------------------------------------------

  const address = [
    mainVenue?.name,
    mainVenue?.address_line1,
    mainVenue?.address_line2,
    mainVenue?.city,
  ]
    .filter(Boolean)
    .join(", ");


  // ------------------------------------------
  // SUNDAY SERVICE TEXT
  //
  // One service:
  // Sunday 10:00 AM
  //
  // Two services:
  // Sunday 10:00 AM & 1:00 PM
  // ------------------------------------------

  let serviceSummary =
    "Service information coming soon";


  if (sundayServices.length > 0) {
    const sundayTimes = sundayServices
      .map((service) =>
        formatTime(service.start_time)
      )
      .filter(Boolean)
      .join(" & ");


    serviceSummary = `Sunday ${sundayTimes}`;
  }


  // ------------------------------------------
  // MIDWEEK TEXT
  //
  // Example:
  // Tuesday 7:00 PM
  // ------------------------------------------

  let midweekSummary: string | undefined;


  if (midweekServices.length > 0) {
    midweekSummary = midweekServices
      .map(
        (service) =>
          `${service.day} ${formatTime(
            service.start_time
          )}`
      )
      .join(" & ");
  }


  // ------------------------------------------
  // FINAL LOCATION CARD
  // ------------------------------------------

  return {
    id: branch.slug,

    name: branch.name,

    city:
      mainVenue?.city ??
      branch.name.replace(/ Branch$/i, ""),

    region:
      branch.subtitle ??
      mainVenue?.country ??
      "United Kingdom",

    heroImage: localImage(branch.hero_image_url, "/images/branch-slide-1.jpg"),

    postcode:
      mainVenue?.postcode ?? "",

    address,

    description:
      branch.short_description ??
      branch.description ??
      "",

    serviceSummary,

    midweekSummary,

    latitude:
      mainVenue?.latitude ?? undefined,

    longitude:
      mainVenue?.longitude ?? undefined,
  };
}


// ======================================================
// GET DATA SPECIFICALLY FOR LOCATIONS CARDS
// ======================================================

export async function listBranches(): Promise<
  BranchItem[]
> {
  const branches = await listBranchData();

  return branches.map(toBranchItem);
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

export async function getBranchBySlug(
  slug: string
): Promise<BranchData | null> {

  const { data, error } = await supabase
    .from("branches")
    .select(`
      *,
      venues (*),
      services (*)
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();


  if (error) {
    console.error(
      `Failed to load branch "${slug}":`,
      error
    );

    return null;
  }


  if (!data || !isKharisBranch(data)) {
    return null;
  }


  const [branch] = await withStudioImages([
    {
      ...data,
      venues: data.venues ?? [],
      services: [...(data.services ?? [])].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
      ),
    } as BranchData,
  ]);
  return branch ?? null;
}

type StudioMedia = {
  owner_id: string | null;
  owner_type: string | null;
  url: string | null;
  sort_order: number | null;
};

/** Gallery, and hero/pastor uploads saved on media rows when the column is still a placeholder. */
async function withStudioImages(branches: BranchData[]): Promise<BranchData[]> {
  if (!branches.length) return branches;
  const { data, error } = await supabase
    .from("media")
    .select("owner_id, owner_type, url, sort_order")
    .in("owner_type", ["branch-gallery", "branch-hero", "branch-pastor"])
    .in("owner_id", branches.map((branch) => branch.id))
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load branch images:", error);
    return branches;
  }

  const gallery = new Map<string, string[]>();
  const hero = new Map<string, string>();
  const pastor = new Map<string, string>();
  for (const row of (data ?? []) as StudioMedia[]) {
    if (!row.owner_id) continue;
    const src = studioImage(row.url);
    if (!src) continue;
    if (row.owner_type === "branch-gallery") {
      const list = gallery.get(row.owner_id) ?? [];
      list.push(src);
      gallery.set(row.owner_id, list);
    } else if (row.owner_type === "branch-hero" && !hero.has(row.owner_id)) {
      hero.set(row.owner_id, src);
    } else if (row.owner_type === "branch-pastor" && !pastor.has(row.owner_id)) {
      pastor.set(row.owner_id, src);
    }
  }

  return branches.map((branch) => {
    const columnHero = studioImage(branch.hero_image_url);
    const columnPastor = studioImage(branch.pastor_image_url);
    return {
      ...branch,
      hero_image_url: columnHero ?? hero.get(branch.id) ?? branch.hero_image_url,
      pastor_image_url: columnPastor ?? pastor.get(branch.id) ?? branch.pastor_image_url,
      galleryImages: gallery.get(branch.id) ?? [],
    };
  });
}

export async function listBranchIds(): Promise<string[]> {
  const branches = await listBranchData();

  return branches.map((branch) => branch.slug);
}