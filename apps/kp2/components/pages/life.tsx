"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ComicPanels } from "@/components/ComicPanels";
import { LifeHero } from "@/components/LifeHero";

function LifePage() {
  return (
    <div className="bg-background text-on-background font-body-md overflow-x-hidden">
      <SiteHeader />

      <main className="pt-[74px]">
        <LifeHero />

        <ComicPanels />
      </main>

      <SiteFooter />
      <ThemeToggle />
    </div>
  );
}

export default LifePage;
