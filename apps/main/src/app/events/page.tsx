import type { Metadata } from "next";
import { EventsExperience } from "@/components/EventsExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { listServiceBranches } from "@/lib/service-branches";

export const metadata: Metadata = {
  title: "Events | Kharis Church",
  description: "Explore Kharis Church services, gatherings, and upcoming events.",
};

export default async function EventsPage() {
  const branches = await listServiceBranches();

  return (
    <main className="bg-bg text-fg">
      <SiteHeader tone="light" />

      <EventsExperience branches={branches} />

      <SiteFooter />
    </main>
  );
}
