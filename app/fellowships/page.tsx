import Page from "@/components/pages/fellowships";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Fellowships",
  description:
    "Find a Kharis Phase 2 fellowship near you — smaller circles, midweek community, and a place to belong.",
  path: "/fellowships",
});

export default function Fellowships() {
  return <Page />;
}
