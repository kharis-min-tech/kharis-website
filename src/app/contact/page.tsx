import type { Metadata } from "next";
import { ContactExperience } from "@/components/ContactExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getContactLocations } from "@/lib/contactLocations";



export const metadata: Metadata = {
  title: "Contact | Kharis Church",
  description:
    "Find a Kharis branch on the map, get directions, or send a message about a Sunday visit, prayer, giving, or pastoral care.",
};

export default async function ContactPage() {
    const locations = await getContactLocations();


  return (
    <main className="site-page text-fg">
      <SiteHeader />
      <ContactExperience locations={locations}  />
      <SiteFooter />
    </main>
  );
}
