import Page from "@/components/pages/life";
import { getUpcomingEvents, type ChurchEvent } from "@/lib/events";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Life at Kharis Phase 2",
  description:
    "Life at Kharis Phase 2 goes beyond Sundays. We grow, serve, and build relationships in Christ together as a family.",
  path: "/life",
});

export default async function Life() {
  let events: ChurchEvent[] = [];
  try {
    events = await getUpcomingEvents();
  } catch {
    // The comic still reads without the diary.
  }
  return <Page events={events} />;
}
