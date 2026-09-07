import { listBranchData, getBranchCity, getMainVenue } from "@/lib/branches";
import { withBranchImage } from "@/lib/branch-images";

export type BranchSlide = {
  name: string;
  href: string;
  title: string;
  subtitle: string;
  address?: string;
  image: string;
  accent: string;
};

const ACCENTS = ["#FD7F20", "#800654"] as const;

/** Featured branches for the homepage carousel — sourced from live branch data */
const FEATURED_SLUGS = [
  "london",
  "birmingham",
  "accra",
  "freetown",
  "brighton",
  "bristol",
  "nottingham",
] as const;

export async function fetchBranchSlides(): Promise<BranchSlide[]> {
  const branches = await listBranchData();
  const bySlug = new Map(branches.map((branch) => [branch.slug, branch]));

  return FEATURED_SLUGS.flatMap((slug, i) => {
    const branch = bySlug.get(slug);
    if (!branch) return [];
    const venue = getMainVenue(branch);
    const city = getBranchCity(branch);
    return [
      {
        name: branch.name,
        href: `/locations/${slug}`,
        title: "KHARIS",
        subtitle: city.toUpperCase(),
        address: [venue?.name, venue?.city].filter(Boolean).join(", "),
        image: withBranchImage(branch.hero_image_url, slug),
        accent: ACCENTS[i % ACCENTS.length]!,
      },
    ];
  });
}
