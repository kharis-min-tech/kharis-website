import type { Metadata } from "next";
import Page from "@/components/pages/events";
import { JsonLd } from "@/components/JsonLd";
import { getUpcomingEvents } from "@/lib/events";
import { listBranches } from "@/lib/branches";
import { eventsJsonLd, pageMeta } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: "Events",
  description:
    "Sunday services, conferences, worship nights and fellowships at Kharis Phase 2. See what's on and add a gathering to your calendar.",
  path: "/events",
});

export default async function Events() {
  const [events, branches] = await Promise.all([getUpcomingEvents(), listBranches()]);
  const branchPins = branches.map(({ slug, name, lat, lng }) => ({ slug, name, lat, lng }));
  return (
    <>
      <JsonLd data={eventsJsonLd(events)} />
      <Page events={events} branchPins={branchPins} />
    </>
  );
}
