import { supabase } from "@/lib/supabase";
import type { ContactLocation } from "@/lib/contact-branches";

export type { ContactLocation, ContactService, ContactVenue } from "@/lib/contact-branches";

export async function getContactLocations(): Promise<ContactLocation[]> {
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
