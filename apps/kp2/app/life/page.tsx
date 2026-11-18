import Page from "@/components/pages/life";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Life at Kharis Phase 2",
  description:
    "Life at Kharis Phase 2 goes beyond Sundays. We grow, serve, and build relationships in Christ together as a family.",
  path: "/life",
});

export default function Life() {
  return <Page />;
}
