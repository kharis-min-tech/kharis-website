import type { Metadata } from "next";
import { Suspense } from "react";
import { AboutExperience } from "@/components/AboutExperience";
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
      <SiteFooter />
    </main>
  );
}
