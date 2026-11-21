"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { EventsReel } from "@/components/EventsReel";
import { CampChapter, EventChapter } from "@/components/EventChapter";
import { SIGNATURE_EVENTS } from "@/lib/signature-events";
import "@/components/events-reel.css";

function NextOne() {
  const names = SIGNATURE_EVENTS.map((ev) => ev.name);
  const run = [...names, ...names];
  return (
    <section className="kp-next" aria-labelledby="kp-next-title">
      <div className="kp-next__marquee" aria-hidden="true">
        <div className="kp-next__track">
          {[0, 1].map((copy) => (
            <span key={copy} className="kp-next__run">
              {run.map((name, i) => (
                <span key={`${copy}-${i}`}>
                  {name}
                  <span className="kp-next__star">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <div className="kp-next__copy">
        <h2 id="kp-next-title" className="kp-next__title">
          See you at the next one
        </h2>
        <p className="kp-next__lede">
          Every one of these started with someone saying “come with me”. Find your nearest KP2
          family and come along.
        </p>
        <div className="kp-next__actions">
          <Link href="/branches" className="kp-next__btn kp-next__btn--solid">
            Find a branch
            <span className="material-symbols-outlined" aria-hidden="true">
              location_on
            </span>
          </Link>
          <Link href="/life" className="kp-next__btn">
            Back to Life at KP2
            <span className="material-symbols-outlined" aria-hidden="true">
              north_east
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function EventsPage() {
  return (
    <div className="bg-background text-on-background font-body-md overflow-x-hidden">
      <SiteHeader />

      <main className="kp-events pt-[74px]">
        <EventsReel />
        {SIGNATURE_EVENTS.map((ev) =>
          ev.camps ? <CampChapter key={ev.id} ev={ev} /> : <EventChapter key={ev.id} ev={ev} />,
        )}
        <NextOne />
      </main>

      <SiteFooter />
      <ThemeToggle />
    </div>
  );
}
