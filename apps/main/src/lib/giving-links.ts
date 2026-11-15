import { siteGet } from "@/lib/kharis-api";
import { GIVING_BRANCHES, withStudioLinks, type GivingBranch } from "@/lib/giving";

/** The give page's branch list, with giving links from the content studio where set. */
export async function getGivingBranches(): Promise<GivingBranch[]> {
  const { data, error } =
    await siteGet<{ slug: string; giving_link: string | null }[]>("/branches");

  if (error || !data) return GIVING_BRANCHES;
  return withStudioLinks(
    GIVING_BRANCHES,
    data.map((branch) => ({ slug: branch.slug, giving_link: branch.giving_link })),
  );
}
