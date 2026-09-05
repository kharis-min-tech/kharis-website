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

const HOME_STYLES: Pick<Testimonial, "color" | "pattern" | "patternSize">[] = [
  {
    color: "#7c3aed",
    pattern: "radial-gradient(#a78bfa 1.5px, transparent 1.5px)",
    patternSize: "18px 18px",
  },
  {
    color: "#c44569",
    pattern: "repeating-linear-gradient(45deg, #f4a3b5 0px, #f4a3b5 1px, transparent 1px, transparent 14px)",
    patternSize: "auto",
  },
  {
    color: "#4f46e5",
    pattern:
      "url(\"data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 3l1.5 4.5h4.5l-3.75 2.75 1.5 4.5L16 12.5l-3.75 2.25 1.5-4.5L9 7.5h4.5z' fill='%234f46e5' fill-opacity='0.12'/%3E%3C/svg%3E\")",
    patternSize: "32px 32px",
  },
  {
    color: "#e85d3a",
    pattern: "linear-gradient(#fdba74 1px, transparent 1px), linear-gradient(90deg, #fdba74 1px, transparent 1px)",
    patternSize: "22px 22px",
  },
  {
    color: "#e84393",
    pattern:
      "url(\"data:image/svg+xml,%3Csvg width='40' height='20' viewBox='0 0 40 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q10 0 20 10 T40 10' stroke='%23e84393' stroke-opacity='0.15' fill='none' stroke-width='1.5'/%3E%3C/svg%3E\")",
    patternSize: "40px 20px",
  },
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
