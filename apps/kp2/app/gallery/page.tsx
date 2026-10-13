import Page from "@/components/pages/gallery";
import { pageMeta } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMeta({
  title: "Gallery",
  description:
    "Photos and moments from Kharis Phase 2. Worship, fellowship, and life in the house.",
  path: "/gallery",
});

export default function Gallery() {
  return <Page />;
}
