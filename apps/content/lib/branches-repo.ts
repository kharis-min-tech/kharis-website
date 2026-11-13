import type {
  BranchDraft,
  BranchRow,
  PastorRole,
  ServiceDraft,
  VenueDraft,
} from "@/lib/branch-types";
import { emptyService, emptyVenue } from "@/lib/branch-types";
import { isActive } from "@/lib/active-filter";
import {
  getBranchVideo,
  listGallery,
  listVenueImages,
  type VenueImageRecord,
} from "@/lib/media-repo";
import { branchFamily, type BranchFamily } from "@/lib/branch-family";
import { studioData } from "@/lib/studio-data";
import type { BranchOption } from "@/lib/types";
import { isWorkspaceId, type WorkspaceId } from "@/lib/workspaces";

export const DEFAULT_COUNTRY = "United Kingdom";

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

export function emptyBranch(family: BranchFamily = "kharis"): BranchDraft {
  return {
    name: "",
    slug: "",
    country: DEFAULT_COUNTRY,
    shortDescription: "",
    description: "",
    heroImage: "",
    videoUrl: "",
    pastorName: "",
    pastorRole: "pastor",
    pastorPhoto: "",
    pastorBio: "",
    email: "",
    phone: "",
    givingLink: "",
    instagram: "",
    family,
    published: false,
    sortOrder: "0",
    venues: [emptyVenue()],
    services: [emptyService()],
    gallery: [],
  };
}

export function venueHasContent(
  venue: Pick<VenueDraft, "name" | "address" | "city" | "postcode" | "imageUrl">,
) {
  return [venue.name, venue.address, venue.city, venue.postcode, venue.imageUrl].some((value) =>
    value.trim(),
  );
}

export function branchToDraft(
  row: BranchRow,
  gallery: BranchDraft["gallery"],
  venueImages: VenueImageRecord[] = [],
  videoUrl = "",
): BranchDraft {
  const venues = [...(row.venues ?? [])];
  const services = [...(row.services ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );
  const venueDrafts: VenueDraft[] = venues.map((venue, index) => {
    const image = venueImages.find((item) => item.sortOrder === index);
    return {
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
      imageUrl: image?.url ?? "",
      imageKey: image?.path ?? "",
      active: isActive(venue),
    };
  });

  return {
    id: row.id,
    name: row.name ?? "",
    slug: row.slug ?? "",
    country: row.subtitle ?? (venueDrafts[0]?.country || DEFAULT_COUNTRY),
    shortDescription: row.short_description ?? "",
    description: row.description ?? "",
    heroImage: row.hero_image_url ?? "",
    videoUrl,
    pastorName: row.pastor_name ?? "",
    pastorRole: asRole(row.pastor_role),
    pastorPhoto: row.pastor_image_url ?? "",
    pastorBio: row.pastor_bio ?? "",
    email: row.contact_email ?? "",
    phone: row.contact_phone ?? "",
    givingLink: row.giving_link ?? "",
    instagram: row.instagram ?? "",
    family: branchFamily(row),
    published: isActive(row),
    sortOrder: String(row.sort_order ?? 0),
    venues: venueDrafts.length ? venueDrafts : [emptyVenue()],
    services: services.length
      ? services.map((service) => ({
          key: service.id,
          id: service.id,
          day: service.day ?? "Sunday",
          time: (service.start_time ?? "").slice(0, 5),
          label: service.name ?? "",
          venueIndex: Math.max(
            0,
            venues.findIndex((venue) => venue.id === service.venue_id),
          ),
          active: isActive(service),
        }))
      : [emptyService()],
    gallery,
  };
}

export async function listBranches() {
  return studioData.list<BranchRow>("branches", { view: "full", order: "sort_order" });
}

export async function loadBranchDraft(row: BranchRow) {
  const [gallery, venueImages, videoUrl] = await Promise.all([
    listGallery(row.id).catch(() => []),
    listVenueImages(row.id).catch(() => []),
    getBranchVideo(row.id).catch(() => ""),
  ]);
  return branchToDraft(row, gallery, venueImages, videoUrl);
}

export async function listBranchOptions(): Promise<BranchOption[]> {
  return studioData.list<BranchOption>("branches", { view: "options", order: "name" });
}

/** The branch name for pickers, marked when the branch is deactivated. */
export function branchOptionLabel(branch: BranchOption) {
  return isActive(branch) ? branch.name : `${branch.name} (inactive)`;
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
    is_active: venue.active,
  };
}

async function insertVenue(branchId: string, venue: VenueDraft) {
  const row = await studioData.insert<{ id: string }>("venues", venuePayload(branchId, venue));
  return row.id;
}

async function insertService(
  branchId: string,
  service: ServiceDraft,
  venueId: string | null,
  sortOrder: number,
) {
  const day = service.day || "Sunday";
  const row = await studioData.insert<{ id: string }>("services", {
    branch_id: branchId,
    name: blank(service.label) ?? day,
    type: day.toLowerCase() === "sunday" ? "sunday" : "midweek",
    day,
    start_time: timeValue(service.time),
    description: null,
    sort_order: sortOrder,
    is_active: service.active,
    venue_id: venueId,
  });
  return row.id;
}

async function deleteIds(table: "venues" | "services", ids: string[]) {
  if (!ids.length) return;
  await studioData.removeWhere(table, { id: ids });
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
    subtitle: blank(draft.country),
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
    workspace: draft.family,
  };

  // Branch admins may update their branch but not create one, so an upsert would be refused.
  let branchId = draft.id ?? "";
  if (branchId) await studioData.update("branches", branchId, payload);
  else branchId = (await studioData.insert<{ id: string }>("branches", payload)).id;

  const oldVenueIds = originalIds.venues;
  const oldServiceIds = originalIds.services;
  const newVenueIds: string[] = [];
  const newServiceIds: string[] = [];

  try {
    const venueIdByIndex: (string | null)[] = [];
    for (const [index, venue] of draft.venues.entries()) {
      const hasContent = venueHasContent(venue);
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

export async function saveBranchImageUrl(
  branchId: string,
  field: "hero_image_url" | "pastor_image_url",
  url: string,
) {
  await studioData.update("branches", branchId, { [field]: url });
}

/** Deactivating hides the branch but keeps its venues, services, media, events and messages. */
export async function setBranchActive(id: string, active: boolean) {
  if (active) await studioData.update("branches", id, { is_active: true });
  else await studioData.deactivateBranch(id);
}

export function workspaceForBranch(value: string | null | undefined): WorkspaceId {
  return isWorkspaceId(value) ? value : "general";
}
