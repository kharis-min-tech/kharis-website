import type { Metadata } from "next";
import Page from "@/components/pages/events";
import { getUpcomingEvents } from "@/lib/events";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Events & Gatherings | Kharis Phase 2",
  openGraph: {
    title: "Events & Gatherings | Kharis Phase 2",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default async function Events() {
  const events = await getUpcomingEvents();
  return <Page events={events} />;
}
