import { supabase } from "@/lib/supabase";

export type TestimonyWorkspace = "kharis" | "kp2";
export type TestimonyFeatureType = "featured" | "giving";

export interface Testimony {
  name: string;
  branch_name: string | null;
  category: string | null;
  short_description: string | null;
  description: string;
  image_url: string | null;
  is_anonymous: boolean;
}

/** Original homepage carousel copy — used when featured DB rows are sparse. */
const FALLBACK_FEATURED: Testimony[] = [
  {
    name: "Amaka O.",
    branch_name: "London",
    category: null,
    short_description: null,
    description:
      "Christ found me when I had nothing left. Through Kharis I learned to trust Jesus again, and my home has peace.",
    image_url: null,
    is_anonymous: false,
  },
  {
    name: "James T.",
    branch_name: "Birmingham",
    category: null,
    short_description: null,
    description:
      "I came broken, and God met me in the Word. Jesus healed what counselling alone could not. Glory to God.",
    image_url: null,
    is_anonymous: false,
  },
  {
    name: "Grace A.",
    branch_name: "Brighton",
    category: null,
    short_description: null,
    description:
      "Sunday after Sunday, Christ has been strengthening my faith. I am not the same person who first walked through those doors.",
    image_url: null,
    is_anonymous: false,
  },
  {
    name: "Daniel K.",
    branch_name: "Accra",
    category: null,
    short_description: null,
    description:
      "The gospel was preached clearly, and I gave my life to Jesus. His grace carried me through the darkest season of my life.",
    image_url: null,
    is_anonymous: false,
  },
  {
    name: "Sarah M.",
    branch_name: "Croydon",
    category: null,
    short_description: null,
    description:
      "Prayer, the Word, and the love of the brethren pointed me to Christ. He restored my marriage and my hope.",
    image_url: null,
    is_anonymous: false,
  },
  {
    name: "Michael B.",
    branch_name: "Luton",
    category: null,
    short_description: null,
    description:
      "I used to live for myself. Now I live for Jesus. Kharis helped me see that Christ alone is enough.",
    image_url: null,
    is_anonymous: false,
  },
  {
    name: "Ruth N.",
    branch_name: "Nottingham",
    category: null,
    short_description: null,
    description:
      "In worship I met Jesus afresh. He lifted my anxiety and filled me with His peace and joy.",
    image_url: null,
    is_anonymous: false,
  },
  {
    name: "Peter O.",
    branch_name: "Coventry",
    category: null,
    short_description: null,
    description:
      "The teaching pointed me to Christ crucified. I was baptised and now serve gladly in my local branch.",
    image_url: null,
    is_anonymous: false,
  },
];

const MIN_FEATURED_CARDS = 4;

const SAFE_TESTIMONY_FIELDS = `
  name,
  branch_name,
  category,
  short_description,
  description,
  image_url,
  is_anonymous
`;

function withFeaturedFallback(rows: Testimony[]): Testimony[] {
  if (rows.length >= MIN_FEATURED_CARDS) return rows;
  const seen = new Set(rows.map((r) => r.name.toLowerCase()));
  const padded = [...rows];
  for (const item of FALLBACK_FEATURED) {
    if (padded.length >= FALLBACK_FEATURED.length) break;
    if (seen.has(item.name.toLowerCase())) continue;
    padded.push(item);
    seen.add(item.name.toLowerCase());
  }
  return padded.length > 0 ? padded : FALLBACK_FEATURED;
}

export async function getTestimonies(
  workspace: TestimonyWorkspace,
  type: TestimonyFeatureType = "featured"
): Promise<Testimony[]> {
  const featureColumn =
    type === "giving"
      ? "is_featured_giving"
      : "is_featured";

  const { data, error } = await supabase
    .from("testimonies")
    .select(SAFE_TESTIMONY_FIELDS)
    .eq("workspace", workspace)
    .eq(featureColumn, true);

  if (error) {
    console.error(
      `Failed to load ${workspace} ${type} testimonies:`,
      error
    );

    return type === "featured" ? FALLBACK_FEATURED : [];
  }

  const rows = (data ?? []) as Testimony[];
  return type === "featured" ? withFeaturedFallback(rows) : rows;
}
