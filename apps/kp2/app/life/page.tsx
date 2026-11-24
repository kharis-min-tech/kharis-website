import Page from "@/components/pages/life";
import { fetchSiteContents, listOrFallback, listSlot } from "@/lib/site-contents";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Life at Kharis Phase 2",
  description:
    "Life at Kharis Phase 2 goes beyond Sundays. We grow, serve, and build relationships in Christ together as a family.",
  path: "/life",
});

export default async function Life() {
  const contents = await fetchSiteContents("kp2");
  // One entry per hero print; an empty string keeps the built-in photo.
  const printPhotos = listOrFallback(listSlot(contents, "life", "lifeHero"), ["", "", "", "", ""]);
  return <Page printPhotos={printPhotos} />;
}
