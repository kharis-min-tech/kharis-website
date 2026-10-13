import type { WorkspaceId } from "@/lib/workspaces";

export type PastorRole = "pastor" | "lead";

export type VenueRow = {
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

export type ServiceRow = {
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

export type BranchRow = {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
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
  is_active: boolean | null;
  venues: VenueRow[] | null;
  services: ServiceRow[] | null;
};

export type VenueDraft = {
  key: string;
  id?: string;
  name: string;
  address: string;
  addressLine2: string;
  city: string;
  postcode: string;
  country: string;
  latitude: string;
  longitude: string;
  parkingInfo: string;
  transitInfo: string;
  imageUrl: string;
  imageKey: string;
};

export type ServiceDraft = {
  key: string;
  id?: string;
  day: string;
  time: string;
  label: string;
  venueIndex: number;
};

export type GalleryItem = {
  key: string;
  id?: string;
  url: string;
  path?: string;
};

export type BranchDraft = {
  id?: string;
  name: string;
  slug: string;
  city: string;
  shortDescription: string;
  description: string;
  heroImage: string;
  pastorName: string;
  pastorRole: PastorRole;
  pastorPhoto: string;
  pastorBio: string;
  email: string;
  phone: string;
  givingLink: string;
  instagram: string;
  workspace: WorkspaceId;
  published: boolean;
  sortOrder: string;
  venues: VenueDraft[];
  services: ServiceDraft[];
  gallery: GalleryItem[];
};

export function pastorRoleLabel(role: PastorRole) {
  return role === "lead" ? "Branch Lead" : "Pastor";
}

export function pastorPreview(name: string, role: PastorRole) {
  const label = pastorRoleLabel(role);
  const trimmed = name.trim();
  if (!trimmed) return label;
  if (trimmed.toLowerCase().startsWith(label.toLowerCase())) return trimmed;
  return `${label}: ${trimmed}`;
}

export function emptyVenue(): VenueDraft {
  return {
    key: crypto.randomUUID(),
    name: "",
    address: "",
    addressLine2: "",
    city: "",
    postcode: "",
    country: "United Kingdom",
    latitude: "",
    longitude: "",
    parkingInfo: "",
    transitInfo: "",
    imageUrl: "",
    imageKey: "",
  };
}

export function emptyService(): ServiceDraft {
  return {
    key: crypto.randomUUID(),
    day: "Sunday",
    time: "10:00",
    label: "",
    venueIndex: 0,
  };
}
