"use client";

import { KP2_PHOTOS } from "@/lib/photography";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ComicPanels } from "@/components/ComicPanels";
import "@/components/events-top.css";

function LifePage() {
  return (
    <div className="bg-background text-on-background font-body-md overflow-x-hidden">
      <SiteHeader />

      <main className="pt-[74px]">
        <header className="kp-ev-hero">
          <img
            src={KP2_PHOTOS.serviceChoir.src}
            alt={KP2_PHOTOS.serviceChoir.alt}
            className="kp-ev-hero__img"
            loading="eager"
            decoding="async"
          />
          <div className="kp-ev-hero__veil" aria-hidden="true" />
          <div className="kp-ev-hero__dots" aria-hidden="true" />
          <div className="kp-ev-hero__copy">
            <p className="kp-ev-hero__eyebrow">Kharis Phase 2</p>
            <h1 className="kp-ev-hero__heading">
              Life at <span>Kharis Phase 2</span>
            </h1>
            <p className="kp-ev-hero__tag" style={{ maxWidth: "42rem" }}>
              Life at Kharis Phase 2 goes beyond Sundays. We grow, serve, and build relationships in
              Christ together as a family. See what life at KP2 looks like.
            </p>
          </div>
        </header>

        <ComicPanels />
      </main>

      <SiteFooter />
      <ThemeToggle />
    </div>
  );
}

export default LifePage;
