import Page from "@/components/pages/fellowships";
import { getUpcomingEvents } from "@/lib/events";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Fellowships",
  description:
    "Find a Kharis Phase 2 fellowship near you — smaller circles, New Breeds, hangouts and midweek community.",
  path: "/fellowships",
});

export default async function Fellowships() {
  const events = await getUpcomingEvents();
  return <Page events={events} />;
}
