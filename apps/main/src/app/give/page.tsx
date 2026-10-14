import type { Metadata } from "next";
import { GiveExperience } from "@/components/GiveExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Give | Kharis Church",
  description:
    "Your generosity powers the mission. Give online, through the Kharis Hub app, or by bank transfer.",
};

export default function GivePage() {
  return (
    <main className="bg-bg text-fg">
      <SiteHeader />
      <GiveExperience />
      <SiteFooter />
    </main>
  );
}
