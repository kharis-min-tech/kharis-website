import { supabase, supabaseConfigured } from "@/lib/supabase";
import { BRANCH_FIXTURE } from "@/lib/branch-fixture";
import type { ContactLocation } from "@/lib/contact-branches";

export type { ContactLocation, ContactService, ContactVenue } from "@/lib/contact-branches";

export async function getContactLocations(): Promise<ContactLocation[]> {
  // The contact page runs its own query rather than going through
  // lib/branches, so it needs the development fallback too. Without it the
  // branch finder renders its "details aren't loading" empty state offline.
  if (!supabaseConfigured) {
    return BRANCH_FIXTURE.map((branch) => ({
      id: branch.id,
      slug: branch.slug,
      name: branch.name,
      contact_email: branch.contact_email,
      contact_phone: branch.contact_phone,
      pastor_name: branch.pastor_name,
      pastor_role: null,
      workspace: branch.group === "Kharis Phase 2" ? "kp2" : "kharis",
      venues: branch.venues.map((venue) => ({
        id: venue.id,
        name: venue.name,
        address_line1: venue.address_line1,
        address_line2: venue.address_line2,
        city: venue.city,
        postcode: venue.postcode,
        country: venue.country,
        latitude: venue.latitude,
        longitude: venue.longitude,
      })),
      services: branch.services.map((service) => ({
        id: service.id,
        name: service.name,
        type: service.type,
        day: service.day,
        start_time: service.start_time,
        venue_id: service.venue_id,
        sort_order: service.sort_order,
        is_active: service.is_active,
      })),
    }));
  }

  const { data, error } = await supabase
    .from("branches")
    .select(
      `
      id,
      slug,
      name,
      contact_email,
      contact_phone,
      pastor_name,
      pastor_role,
      workspace,
      venues (
        id,
        name,
        address_line1,
        address_line2,
        city,
        postcode,
        country,
        latitude,
        longitude
      ),
      services (
        id,
        name,
        type,
        day,
        start_time,
        venue_id,
        sort_order,
        is_active
      )
    `,
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load contact locations:", error);
    return [];
  }

  return (data ?? []).map((branch) => ({
    ...branch,
    venues: branch.venues ?? [],
    services: branch.services ?? [],
  }));
}
