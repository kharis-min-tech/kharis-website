import { BRANCHES_DATA } from "@/data/branchesData";
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

/** Featured branches for the homepage carousel — sourced from branch data */
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
  return FEATURED_SLUGS.map((slug, i) => {
    const branch = BRANCHES_DATA[slug];
    if (!branch) {
      return null;
    }
    return {
      name: branch.name,
      href: `/locations/${slug}`,
      title: "KHARIS",
      subtitle: branch.city.toUpperCase(),
      address: branch.address,
      image: withBranchImage(branch.heroImage, slug),
      accent: ACCENTS[i % ACCENTS.length]!,
    };
  }).filter((slide): slide is BranchSlide => slide !== null);
}
