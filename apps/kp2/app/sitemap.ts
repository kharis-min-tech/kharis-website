import type { MetadataRoute } from "next";
import { listBranchSlugs } from "@/lib/branches";
import { STATIC_PATHS, siteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteUrl();
  const now = new Date();
  let slugs: string[] = [];
  try {
    slugs = await listBranchSlugs();
  } catch {
    slugs = [];
  }

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: path === "/" ? origin : `${origin}${path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/events" || path === "/messages" ? "daily" : "weekly",
    priority:
      path === "/"
        ? 1
        : path === "/events" || path === "/messages" || path === "/branches"
          ? 0.85
          : 0.7,
  }));

  const branchEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${origin}/branches/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...branchEntries];
}
