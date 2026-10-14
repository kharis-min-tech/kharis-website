import { supabase } from "@/lib/supabase";
import { GIVING_BRANCHES, withStudioLinks, type GivingBranch } from "@/lib/giving";

/** The give page's branch list, with giving links from the content studio where set. */
export async function getGivingBranches(): Promise<GivingBranch[]> {
  const { data, error } = await supabase
    .from("branches")
    .select("slug, giving_link")
    .eq("is_active", true);

  if (error || !data) return GIVING_BRANCHES;
  return withStudioLinks(GIVING_BRANCHES, data);
}
