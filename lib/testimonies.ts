import type { Testimonial } from "@/components/TestimonialCarousel";
import { SITE_WORKSPACES } from "@/lib/site";
import { supabaseSelect } from "@/lib/supabase";

export type GivingTestimony = {
  name: string;
  role: string;
  image: string;
  quote: string;
};

type TestimonyRow = {
  name: string;
  branch_name: string | null;
  category: string | null;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  is_anonymous: boolean | null;
  workspace: string | null;
  is_featured: boolean | null;
  is_featured_giving: boolean | null;
};

const SAFE_FIELDS =
  "name,branch_name,category,short_description,description,image_url,is_anonymous,workspace,is_featured,is_featured_giving";

const FALLBACK_IMAGES = [
  "/assets/testimony-1.jpg",
  "/assets/testimony-2.jpg",
  "/assets/testimony-3.jpg",
];

const HOME_STYLES: Pick<Testimonial, "color">[] = [
  { color: "#3D5AFE" },
  { color: "#FF2FA3" },
  { color: "#FF8A1E" },
  { color: "#7C9CFF" },
  { color: "#FF5C8A" },
];

function displayName(row: TestimonyRow) {
  if (row.is_anonymous) return "Anonymous";
  return row.name?.trim() || "Anonymous";
}

function quoteText(row: TestimonyRow) {
  return (row.description || row.short_description || "").trim();
}

async function loadPublished(): Promise<TestimonyRow[]> {
  const rows = await supabaseSelect<TestimonyRow>(
    "testimonies",
    `select=${SAFE_FIELDS}&is_published=eq.true`,
  );
  return rows.filter((row) => SITE_WORKSPACES.includes(row.workspace as (typeof SITE_WORKSPACES)[number]));
}

export async function getHomeTestimonials(): Promise<Testimonial[]> {
  const rows = (await loadPublished()).filter((row) => row.is_featured);
  return rows
    .map((row, i) => {
      const style = HOME_STYLES[i % HOME_STYLES.length]!;
      const quote = quoteText(row);
      if (!quote) return null;
      return {
        quote,
        name: displayName(row),
        location: row.branch_name || row.category || "Kharis Phase 2",
        ...style,
      } satisfies Testimonial;
    })
    .filter((row): row is Testimonial => row !== null);
}

export async function getGivingTestimonials(): Promise<GivingTestimony[]> {
  const rows = (await loadPublished()).filter((row) => row.is_featured_giving);

  return rows
    .map((row, i) => {
      const quote = (row.description || row.short_description || "").trim();
      if (!quote) return null;
      return {
        name: displayName(row),
        role: row.category || row.branch_name || "Member",
        image: row.image_url || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]!,
        quote: quote.startsWith('"') ? quote : `"${quote}"`,
      } satisfies GivingTestimony;
    })
    .filter((row): row is GivingTestimony => row !== null);
}
