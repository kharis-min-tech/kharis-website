import type { Metadata } from "next";
import Page from "@/components/pages/fellowships";
import { getUpcomingEvents } from "@/lib/events";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Fellowships | Kharis Phase 2",
  openGraph: {
    title: "Fellowships | Kharis Phase 2",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default async function Fellowships() {
  const events = await getUpcomingEvents();
  return <Page events={events} />;
}
