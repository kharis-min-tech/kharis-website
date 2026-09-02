import type { Metadata } from "next";
import { ContactExperience } from "@/components/ContactExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Contact | Kharis Church",
  description:
    "Find a Kharis branch on the map, get directions, or send a message about a Sunday visit, prayer, giving, or pastoral care.",
};

export default function ContactPage() {
  return (
    <main className="site-page text-fg">
      <SiteHeader />
      <ContactExperience />
      <SiteFooter />
    </main>
  );
}
