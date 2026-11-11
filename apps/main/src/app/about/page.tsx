import type { Metadata } from "next";
import { Suspense } from "react";
import { AboutExperience } from "@/components/AboutExperience";
import { VisitSection } from "@/components/VisitSection";
import { CHARACTER_SLIDES } from "@/lib/branch-slides";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "About | Kharis Church",
  description:
    "Discover the meaning of Kharis, our Statement of Faith, mission, vision, and Pastors David and Awo Antwi.",
};

export default function AboutPage() {
  return (
    <main className="bg-bg text-fg">
      <SiteHeader />
      <Suspense fallback={null}>
        <AboutExperience />
      </Suspense>
      <VisitSection slides={CHARACTER_SLIDES} />
      <SiteFooter />
    </main>
  );
}
