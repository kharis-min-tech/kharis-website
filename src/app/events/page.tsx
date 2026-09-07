import type { Metadata } from "next";
import { EventsExperience } from "@/components/EventsExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getUpcomingEvents } from "@/lib/events";
import type { ChurchEvent } from "@/lib/events-content";

export const metadata: Metadata = {
  title: "Events | Kharis Church",
  description:
    "Explore Kharis Church services, gatherings, and upcoming events.",
};

export default async function EventsPage() {
  const events = await getUpcomingEvents("kharis");

  const displayEvents: ChurchEvent[] = events.map((event) => {
    const occurrence = event.occurrence_date;

    const date = occurrence.toLocaleDateString("en-CA", {
      timeZone: "Europe/London",
    });

    const time = occurrence.toLocaleTimeString("en-GB", {
      timeZone: "Europe/London",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return {
      id: event.id,
      title: event.title,
      date,
      time,
      timezone: "Europe/London",
      city: event.branch_name ?? "",
      location: event.location ?? "",
      address: event.location ?? "",
      description: event.description ?? "",
      image: event.image_url ?? "/images/events/hero-worship.jpg",
      category: "service" as const,
    };
  });

  return (
    <main className="bg-bg text-fg">
      <SiteHeader tone="light" />

      <EventsExperience events={displayEvents} />

      <SiteFooter />
    </main>
  );
}
