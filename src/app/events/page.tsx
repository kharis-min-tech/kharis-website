import type { Metadata } from "next";
import { EventsExperience } from "@/components/EventsExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getKharisEvents } from "@/lib/kharis-events";

export const metadata: Metadata = {
  title: "Events | Kharis Church",
  description:
    "Explore Kharis Church services, gatherings, and upcoming events. Find Sundays, midweek meetings, and special moments near you.",
};

export default async function EventsPage() {
  const events = await getKharisEvents();

  return (
    <main className="bg-bg text-fg">
      <SiteHeader tone="light" />
      <EventsExperience events={events} />
      <SiteFooter />
    </main>
  );
}
