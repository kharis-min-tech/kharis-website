import type { BranchDraft, BranchRow, PastorRole, ServiceDraft, VenueDraft } from "@/lib/branch-types";
import { emptyService, emptyVenue } from "@/lib/branch-types";
import { listGallery } from "@/lib/media-repo";
import { fail, getSupabase } from "@/lib/supabase";
import type { BranchOption } from "@/lib/types";
import { isWorkspaceId, type WorkspaceId } from "@/lib/workspaces";

function blank(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function timeValue(value: string) {
  if (!value) return null;
  return value.length === 5 ? `${value}:00` : value;
}

function asRole(value: string | null | undefined): PastorRole {
  return value === "lead" ? "lead" : "pastor";
}

export function emptyBranch(): BranchDraft {
  return {
    name: "",
    slug: "",
    city: "",
    shortDescription: "",
    description: "",
    heroImage: "",
    pastorName: "",
    pastorRole: "pastor",
    pastorPhoto: "",
    pastorBio: "",
    email: "",
    phone: "",
    givingLink: "",
    instagram: "",
    workspace: "general",
    published: false,
    sortOrder: "0",
    venues: [emptyVenue()],
    services: [emptyService()],
    gallery: [],
  };
}

export function branchToDraft(row: BranchRow, gallery: BranchDraft["gallery"]): BranchDraft {
  const venues = [...(row.venues ?? [])];
  const services = [...(row.services ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const venueDrafts: VenueDraft[] = venues.map((venue) => ({
    key: venue.id,
    id: venue.id,
    name: venue.name ?? "",
    address: venue.address_line1 ?? "",
    addressLine2: venue.address_line2 ?? "",
    city: venue.city ?? "",
    postcode: venue.postcode ?? "",
    country: venue.country ?? "",
    latitude: venue.latitude == null ? "" : String(venue.latitude),
    longitude: venue.longitude == null ? "" : String(venue.longitude),
    parkingInfo: venue.parking_info ?? "",
    transitInfo: venue.public_transport_info ?? "",
  }));

  return {
    id: row.id,
    name: row.name ?? "",
    slug: row.slug ?? "",
    city: row.subtitle ?? venueDrafts[0]?.city ?? "",
    shortDescription: row.short_description ?? "",
    description: row.description ?? "",
    heroImage: row.hero_image_url ?? "",
    pastorName: row.pastor_name ?? "",
    pastorRole: asRole(row.pastor_role),
    pastorPhoto: row.pastor_image_url ?? "",
    pastorBio: row.pastor_bio ?? "",
    email: row.contact_email ?? "",
    phone: row.contact_phone ?? "",
    givingLink: row.giving_link ?? "",
    instagram: row.instagram ?? "",
    workspace: isWorkspaceId(row.workspace) ? row.workspace : "general",
    published: Boolean(row.is_active),
    sortOrder: String(row.sort_order ?? 0),
    venues: venueDrafts.length ? venueDrafts : [emptyVenue()],
    services: services.length
      ? services.map((service) => ({
          key: service.id,
          id: service.id,
          day: service.day ?? "Sunday",
          time: (service.start_time ?? "").slice(0, 5),
          label: service.name ?? "",
          venueIndex: Math.max(0, venues.findIndex((venue) => venue.id === service.venue_id)),
        }))
      : [emptyService()],
    gallery,
  };
}

export async function listBranches() {
  const { data, error } = await getSupabase()
    .from("branches")
    .select("*, venues(*), services(*)")
    .order("sort_order", { ascending: true });
  fail(error);
  return (data ?? []) as BranchRow[];
}

export async function loadBranchDraft(row: BranchRow) {
  const gallery = await listGallery(row.id).catch(() => []);
  return branchToDraft(row, gallery);
}

export async function listBranchOptions(): Promise<BranchOption[]> {
  const { data, error } = await getSupabase().from("branches").select("id, name").order("name");
  fail(error);
  return (data ?? []) as BranchOption[];
}

function venuePayload(branchId: string, venue: VenueDraft) {
  const latitude = venue.latitude.trim() ? Number(venue.latitude) : null;
  const longitude = venue.longitude.trim() ? Number(venue.longitude) : null;
  return {
    branch_id: branchId,
    name: blank(venue.name),
    address_line1: blank(venue.address),
    address_line2: blank(venue.addressLine2),
    city: blank(venue.city),
    postcode: blank(venue.postcode),
    country: blank(venue.country) ?? "United Kingdom",
    latitude: latitude != null && Number.isFinite(latitude) ? latitude : null,
    longitude: longitude != null && Number.isFinite(longitude) ? longitude : null,
    parking_info: blank(venue.parkingInfo),
    public_transport_info: blank(venue.transitInfo),
  };
}

async function insertVenue(branchId: string, venue: VenueDraft) {
  const { data, error } = await getSupabase().from("venues").insert(venuePayload(branchId, venue)).select("id").single();
  fail(error);
  return (data as { id: string }).id;
}

async function insertService(branchId: string, service: ServiceDraft, venueId: string | null, sortOrder: number) {
  const day = service.day || "Sunday";
  const { data, error } = await getSupabase()
    .from("services")
    .insert({
      branch_id: branchId,
      name: blank(service.label) ?? day,
      type: day.toLowerCase() === "sunday" ? "sunday" : "midweek",
      day,
      start_time: timeValue(service.time),
      description: null,
      sort_order: sortOrder,
      is_active: true,
      venue_id: venueId,
    })
    .select("id")
    .single();
  fail(error);
  return (data as { id: string }).id;
}

async function deleteIds(table: "venues" | "services", ids: string[]) {
  if (!ids.length) return;
  const { error } = await getSupabase().from(table).delete().in("id", ids);
  fail(error);
}

export async function saveBranch(
  draft: BranchDraft,
  originalIds: { venues: string[]; services: string[] },
) {
  const name = draft.name.trim();
  const slug = draft.slug.trim();
  if (!name) throw new Error("A branch needs a name.");
  if (!slug) throw new Error("A branch needs a slug.");

  const sortOrder = Number(draft.sortOrder);
  const payload = {
    name,
    slug,
    subtitle: blank(draft.city),
    short_description: blank(draft.shortDescription),
    description: blank(draft.description),
    hero_image_url: blank(draft.heroImage),
    pastor_name: blank(draft.pastorName),
    pastor_role: draft.pastorRole,
    pastor_image_url: blank(draft.pastorPhoto),
    pastor_bio: blank(draft.pastorBio),
    contact_email: blank(draft.email),
    contact_phone: blank(draft.phone),
    instagram: blank(draft.instagram),
    giving_link: blank(draft.givingLink),
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    is_active: draft.published,
    workspace: draft.workspace,
    ...(draft.id ? { id: draft.id } : {}),
  };

  const saved = await getSupabase().from("branches").upsert(payload).select("id").single();
  fail(saved.error);
  const branchId = (saved.data as { id: string }).id;

  const oldVenueIds = originalIds.venues;
  const oldServiceIds = originalIds.services;
  const newVenueIds: string[] = [];
  const newServiceIds: string[] = [];

  try {
    const venueIdByIndex: (string | null)[] = [];
    for (const [index, venue] of draft.venues.entries()) {
      const hasContent = [venue.name, venue.address, venue.city, venue.postcode].some((value) => value.trim());
      if (!hasContent) {
        venueIdByIndex[index] = null;
        continue;
      }
      const venueId = await insertVenue(branchId, venue);
      venueIdByIndex[index] = venueId;
      newVenueIds.push(venueId);
    }

    const services = draft.services.filter((service) => service.label.trim() || service.day);
    for (const [index, service] of services.entries()) {
      const venueId = venueIdByIndex[service.venueIndex] ?? newVenueIds[0] ?? null;
      newServiceIds.push(await insertService(branchId, service, venueId, index));
    }

    await deleteIds("services", oldServiceIds);
    await deleteIds("venues", oldVenueIds);
  } catch (error) {
    await deleteIds("services", newServiceIds).catch(() => undefined);
    await deleteIds("venues", newVenueIds).catch(() => undefined);
    throw error;
  }

  return branchId;
}

export async function deleteBranch(id: string) {
  const supabase = getSupabase();
  const services = await supabase.from("services").delete().eq("branch_id", id);
  fail(services.error);
  const venues = await supabase.from("venues").delete().eq("branch_id", id);
  fail(venues.error);
  const media = await supabase.from("media").delete().or(`branch_id.eq.${id},owner_id.eq.${id}`);
  if (media.error && media.error.code !== "PGRST205") throw new Error(media.error.message);
  const branch = await supabase.from("branches").delete().eq("id", id);
  fail(branch.error);
}

export function workspaceForBranch(value: string | null | undefined): WorkspaceId {
  return isWorkspaceId(value) ? value : "general";
}
