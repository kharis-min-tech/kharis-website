import type { Metadata } from "next";
import { EventsExperience } from "@/components/EventsExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { listServiceBranches } from "@/lib/service-branches";
import { fetchSiteContents, mediaOrFallback, singleSlot } from "@/lib/site-contents";

export const metadata: Metadata = {
  title: "Events | Kharis Church",
  description: "Explore Kharis Church services, gatherings, and upcoming events.",
};

const EVENTS_HERO_FALLBACK =
  "https://images.kharis.org/site-images/main/4ad6b94f8e2d8cf0/events-hero-banquet.jpg";

export default async function EventsPage() {
  const [branches, contents] = await Promise.all([
    listServiceBranches(),
    fetchSiteContents("kharis"),
  ]);

  return (
    <main className="bg-bg text-fg">
      <SiteHeader />

      <EventsExperience
        branches={branches}
        heroImage={mediaOrFallback(singleSlot(contents, "events", "hero"), EVENTS_HERO_FALLBACK)}
      />

      <SiteFooter />
    </main>
  );
}
