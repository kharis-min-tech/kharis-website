import type { Metadata } from "next";
import { Suspense } from "react";
import { AboutPageSwitch } from "@/components/AboutPageSwitch";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About | Kharis Church",
  description:
    "Discover the meaning of Kharis, our Statement of Faith, mission, vision, and Pastors David and Awo Antwi.",
};

export default function AboutPage() {
  return (
    <main className="bg-bg text-fg">
      <Suspense fallback={null}>
        <AboutPageSwitch />
      </Suspense>
      <SiteFooter />
    </main>
  );
}
