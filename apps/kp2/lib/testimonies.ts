import type { Testimonial } from "@/components/TestimonialCarousel";
import { publicAsset } from "@/lib/public-asset";
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
  "https://images.kharis.org/site-images/kp2/fb9675c9cc674137/testimony-1.jpg",
  "https://images.kharis.org/site-images/kp2/f1508812f09a9ccd/testimony-2.jpg",
  "https://images.kharis.org/site-images/kp2/2c9fe8d53a5b1d11/testimony-3.jpg",
];

const HOME_STYLES: Pick<Testimonial, "color" | "pattern" | "patternSize">[] = [
  {
    color: "#7c3aed",
    pattern: "radial-gradient(#a78bfa 1.5px, transparent 1.5px)",
    patternSize: "18px 18px",
  },
  {
    color: "#c44569",
    pattern:
      "repeating-linear-gradient(45deg, #f4a3b5 0px, #f4a3b5 1px, transparent 1px, transparent 14px)",
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
    pattern:
      "linear-gradient(#fdba74 1px, transparent 1px), linear-gradient(90deg, #fdba74 1px, transparent 1px)",
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

const FALLBACK_ROWS: TestimonyRow[] = [
  {
    name: "Kelvin Quakes",
    branch_name: "KP2 Birmingham",
    category: "Salvation",
    short_description: "Encountering Jesus for Myself",
    description:
      "I grew up thinking that being a 'good person' was enough, and I kept God at arm's length because I thought church was just for people who had their lives completely figured out. But one Sunday, a friend invited me to Kharis Church, and the message preached that morning felt like God was speaking directly to my heart. I gave my life to Christ that day, and my life has never been the same.",
    image_url: null,
    is_anonymous: false,
    workspace: "kp2",
    is_featured: true,
    is_featured_giving: false,
  },
  {
    name: "Melisaa Richards",
    branch_name: "KP2 London",
    category: "Healing",
    short_description: "Peace & Healing in the Storm",
    description:
      "When a family member of mine received a terrifying medical diagnosis last year, fear instantly tried to take over my life. The doctors were uncertain, and the future looked worrying. I reached out to the brethren in KP2 London, and right away, my friends surrounded me with encouragement and prayer. We stood on God's Word together, and to the glory of God, the next set of scans came back completely clear.",
    image_url: null,
    is_anonymous: false,
    workspace: "kp2",
    is_featured: true,
    is_featured_giving: false,
  },
  {
    name: "Anonymous",
    branch_name: "KP2 Southampton",
    category: "Freedom",
    short_description: "Freedom from Fear and Anxiety",
    description:
      "For years, I was trapped in cycles of fear and heavy anxiety that I couldn't shake on my own, no matter how hard I tried. Every time I thought I was making progress, old patterns and dark thoughts would pull me back under. When I finally came to Kharis Church and shared what I was going through, the Word of God and prayer broke that heaviness off my life. Today I walk in peace and freedom in Christ.",
    image_url: null,
    is_anonymous: true,
    workspace: "kp2",
    is_featured: true,
    is_featured_giving: false,
  },
  {
    name: "Tolu Igwe",
    branch_name: "KP2 Romford",
    category: "Healing",
    short_description: "Supernatural Strength & Exam Success",
    description:
      "Right in the middle of my GCSEs, I fell severely ill. I could barely study, and anxiety took over. I surrendered my health and my results to God, asking for supernatural strength. Not only did my health bounce back overnight, but I had absolute clarity during the exam papers and came out with top grades across all my subjects.",
    image_url: null,
    is_anonymous: false,
    workspace: "kp2",
    is_featured: true,
    is_featured_giving: false,
  },
  {
    name: "Kwame Nyarko",
    branch_name: "Accra",
    category: "Family",
    short_description: "Family and Marriage Reconciliation",
    description:
      "After a difficult season of division in our home, we brought our marriage and family before God in prayer with the church family. Through the teaching of the Word and pastoral counsel, Christ healed old wounds and restored unity, peace, and joy to our household.",
    image_url: null,
    is_anonymous: false,
    workspace: "general",
    is_featured: true,
    is_featured_giving: false,
  },
  {
    name: "Anonymous",
    branch_name: "Northampton",
    category: "Provision",
    short_description: "Housing Testimony",
    description:
      "We were facing an urgent housing deadline with doors closing at every turn. After praying with the church during service, we received an unexpected call that very week approving us for a home even better than what we had applied for. God truly provides for His children.",
    image_url: null,
    is_anonymous: true,
    workspace: "general",
    is_featured: true,
    is_featured_giving: false,
  },
];

async function loadPublished(): Promise<TestimonyRow[]> {
  const rows = await supabaseSelect<TestimonyRow>(
    "testimonies",
    `select=${SAFE_FIELDS}&is_published=eq.true`,
  );
  const filtered = rows.filter((row) =>
    SITE_WORKSPACES.includes(row.workspace as (typeof SITE_WORKSPACES)[number]),
  );
  return filtered.length > 0 ? filtered : FALLBACK_ROWS;
}

export async function getHomeTestimonials(): Promise<Testimonial[]> {
  const published = await loadPublished();
  const featured = published.filter((row) => row.is_featured);
  const rows = featured.length ? featured : published;
  return rows
    .map((row, i): Testimonial | null => {
      const style = HOME_STYLES[i % HOME_STYLES.length]!;
      const quote = quoteText(row);
      if (!quote) return null;
      const shortDesc = row.short_description?.trim() || "";
      const title =
        shortDesc && shortDesc.toLowerCase() !== quote.toLowerCase() ? shortDesc : undefined;
      return {
        quote,
        ...(title ? { title } : {}),
        name: displayName(row),
        location: row.branch_name || row.category || "Kharis Phase 2",
        ...style,
      };
    })
    .filter((row): row is Testimonial => row !== null);
}

export async function getGivingTestimonials(): Promise<GivingTestimony[]> {
  const published = await loadPublished();
  const giving = published.filter((row) => row.is_featured_giving);
  const rows = giving.length ? giving : published.filter((row) => row.is_featured);

  return rows
    .map((row, i) => {
      const quote = (row.description || row.short_description || "").trim();
      if (!quote) return null;
      return {
        name: displayName(row),
        role: row.category || row.branch_name || "Member",
        image: row.image_url
          ? publicAsset(row.image_url)
          : FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]!,
        quote: quote.startsWith('"') ? quote : `"${quote}"`,
      } satisfies GivingTestimony;
    })
    .filter((row): row is GivingTestimony => row !== null);
}
