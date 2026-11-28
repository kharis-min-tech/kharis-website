"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LifeBook } from "@/components/life-book/LifeBook";
import type { ChurchEvent } from "@/lib/events";

/**
 * The comic book sits outside the usual `bg-background` page wrapper on purpose: in dark mode
 * that wrapper recolours every descendant (`.dark .bg-background *`), which would wash out the
 * ink lettering on the book's paper pages. The header and footer keep the wrapper as on every
 * other page.
 */
function LifePage({ events = [] }: { events?: ChurchEvent[] }) {
  return (
    <>
      <div className="bg-background text-on-background font-body-md">
        <SiteHeader />
      </div>

      <main className="pt-[74px] font-body-md" style={{ background: "var(--background)" }}>
        <LifeBook events={events} />
      </main>

      <div className="bg-background text-on-background font-body-md">
        <SiteFooter />
        <ThemeToggle />
      </div>
    </>
  );
}

export default LifePage;
