import Page from "@/components/pages/life";
import { getUpcomingEvents } from "@/lib/events";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Life",
  description:
    "Kharis Life: campus culture, small groups, socials and the everyday community of Kharis Phase 2.",
  path: "/life",
});

export default async function Life() {
  const upcoming = (await getUpcomingEvents()).slice(0, 3);
  return <Page upcoming={upcoming} />;
}
