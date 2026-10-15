import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactExperience } from "@/components/ContactExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getContactLocations } from "@/lib/contactLocations";

export const metadata: Metadata = {
  title: "Contact | Kharis Church",
  description:
    "Write to Kharis about a first visit, prayer, pastoral care or baptism, and find service times, directions and a map for every Kharis branch.",
};

export default async function ContactPage() {
  const locations = await getContactLocations();

  return (
    <main className="site-page text-fg">
      <SiteHeader />
      <Suspense fallback={null}>
        <ContactExperience locations={locations} />
      </Suspense>
      <SiteFooter />
    </main>
  );
}
