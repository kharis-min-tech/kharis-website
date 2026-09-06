import type { Metadata } from "next";
import Page from "@/components/pages/events";
import { JsonLd } from "@/components/JsonLd";
import { getUpcomingEvents } from "@/lib/events";
import { eventsJsonLd, pageMeta } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: "Events",
  description:
    "Sunday services, conferences, worship nights and fellowships at Kharis Phase 2. See what's on and add a gathering to your calendar.",
  path: "/events",
});

export default async function Events() {
  const events = await getUpcomingEvents();
  return (
    <>
      <JsonLd data={eventsJsonLd(events)} />
      <Page events={events} />
    </>
  );
}
