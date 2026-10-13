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

const SAFE_TESTIMONY_FIELDS = `
  name,
  branch_name,
  category,
  short_description,
  description,
  image_url,
  is_anonymous
`;

/** Featured testimonies from the content studio. */
export async function getTestimonies(
  workspace: TestimonyWorkspace,
  type: TestimonyFeatureType = "featured",
): Promise<Testimony[]> {
  const featureColumn = type === "giving" ? "is_featured_giving" : "is_featured";

  const { data, error } = await supabase
    .from("testimonies")
    .select(SAFE_TESTIMONY_FIELDS)
    .in("workspace", [workspace, "general"])
    .eq(featureColumn, true);

  if (error) {
    console.error(`Failed to load ${workspace} ${type} testimonies:`, error);

    return [];
  }

  return ((data ?? []) as Testimony[]).map((row) =>
    row.is_anonymous ? { ...row, name: "Anonymous" } : row,
  );
}
