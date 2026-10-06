import { supabase } from "@/lib/supabase";

export interface ContactVenue {
  id: string;
  name: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postcode: string | null;
  country: string | null;
}

export interface ContactLocation {
  id: string;
  slug: string;
  name: string;
  contact_email: string | null;
  contact_phone: string | null;
  pastor_name: string | null;
  pastor_role: "pastor" | "lead" | null;
  venues: ContactVenue[];
}

export async function getContactLocations(): Promise<ContactLocation[]> {
  const { data, error } = await supabase
    .from("branches")
    .select(`
      id,
      slug,
      name,
      contact_email,
      contact_phone,
      pastor_name,
      pastor_role,
      venues (
        id,
        name,
        address_line1,
        address_line2,
        city,
        postcode,
        country
      )
    `)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load contact locations:", error);
    return [];
  }

  return data ?? [];
}