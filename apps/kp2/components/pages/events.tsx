"use client";

import { KP2_PHOTOS } from "@/lib/photography";
import type { LocationPin } from "@/components/LocationsMapArt";

import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CATEGORY_ICON, EVENT_CATEGORIES, type ChurchEvent } from "@/lib/events";
import { eventToCalendarItem, mapsSearchUrl } from "@/lib/calendar";
import { PlanVisitButton } from "@/components/PlanVisitButton";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ComicFlip } from "@/components/ComicFlip";
import { EventsComingUp, EventsHero } from "@/components/EventsTop";
import { SundayServiceBanner } from "@/components/SundayServiceBanner";
import { ComicPanels } from "@/components/ComicPanels";
import { VisitInstead } from "@/components/VisitInstead";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function EventCard({ event }: { event: ChurchEvent }) {
  return (
    <article className="bg-surface border-2 border-on-background neo-shadow neo-button-hover transition-all flex flex-col group">
      <div className="p-stack-md border-b-2 border-on-background flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 font-label-sm text-outline uppercase mb-2 tracking-widest">
            <span className="material-symbols-outlined text-base align-middle">
              {CATEGORY_ICON[event.category]}
            </span>
            {event.category}
          </span>
          <h4 className="font-headline-md text-headline-md text-on-background uppercase leading-tight">
            {event.title}
          </h4>
        </div>
        <div className="self-start max-w-full shrink-0 bg-secondary-fixed text-on-secondary-fixed border-2 border-on-background px-3 py-2 font-label-md text-center leading-tight">
          {event.dayLabel.toUpperCase()}
          <br />
          {event.timeLabel}
        </div>
      </div>

      <div className="p-stack-md flex-grow flex flex-col gap-3">
        <p className="font-body-md text-on-surface-variant">{event.blurb}</p>
        <p className="font-label-md text-outline flex items-center gap-2">
          <span className="material-symbols-outlined text-base">place</span>
          {event.location}
        </p>
      </div>

      <div className="p-stack-md mt-auto bg-on-background">
        <PlanVisitButton
          item={eventToCalendarItem(event)}
          directionsUrl={mapsSearchUrl(event.location)}
          branchName={event.location}
          collectDetails
          className="flex w-full justify-between items-center text-surface font-label-md uppercase hover:text-primary-fixed-dim transition-colors"
        >
          {event.cta}
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
            calendar_add_on
          </span>
        </PlanVisitButton>
      </div>
    </article>
  );
}

function EventsPage({ events, branchPins }: { events: ChurchEvent[]; branchPins: LocationPin[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [query, setQuery] = useState("");

  const sorted = useMemo(
    () => [...events].sort((a, b) => new Date(a.starts).getTime() - new Date(b.starts).getTime()),
    [events],
  );

  const sundayService = sorted.find((e) => e.weekly && /sunday/i.test(e.dayLabel));
  const midweekService = sorted.find((e) => e.weekly && !/sunday|saturday/i.test(e.dayLabel));
  const comingUp = useMemo(() => {
    const later = (iso: string, weeks: number) =>
      iso ? new Date(new Date(iso).getTime() + weeks * WEEK_MS).toISOString() : iso;
    return sorted
      .flatMap((e) =>
        e.weekly
          ? [0, 1, 2, 3].map((w) => ({ ...e, starts: later(e.starts, w), ends: later(e.ends, w) }))
          : [e],
      )
      .sort((a, b) => new Date(a.starts).getTime() - new Date(b.starts).getTime())
      .slice(0, 3);
  }, [sorted]);
  const categories = useMemo(() => {
    const present = new Set(sorted.map((e) => e.category));
    return ["All", ...EVENT_CATEGORIES.filter((c) => present.has(c))];
  }, [sorted]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter((e) => {
      const matchesCategory = activeCategory === "All" || e.category === activeCategory;
      const matchesQuery =
        !q ||
        [e.title, e.blurb, e.location, e.category, e.dayLabel].join(" ").toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [sorted, activeCategory, query]);

  return (
    <div className="bg-background text-on-background font-body-md overflow-x-hidden">
      <SiteHeader />

      <main className="pt-[74px]">
        <EventsHero image={KP2_PHOTOS.serviceChoir.src} />

        <EventsComingUp events={comingUp} branchPins={branchPins} />

        <SundayServiceBanner
          when={sundayService ? `Every Sunday · ${sundayService.timeLabel}` : "Every Sunday"}
        />

        <ComicPanels
          midweekWhen={
            midweekService
              ? `Every ${midweekService.dayLabel.replace(/^every\s+/i, "")} · ${midweekService.timeLabel}`
              : "Every week"
          }
        />

        {/* WHAT'S ON — filter + search */}
        <section
          id="whats-on"
          className="bg-surface-container-low py-stack-lg border-y-4 border-on-background scroll-mt-24"
        >
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-stack-md gap-gutter">
              <div>
                <h3 className="font-headline-lg text-headline-lg uppercase text-on-background">
                  The <span className="text-primary underline decoration-4">Calendar</span>
                </h3>
                <p className="font-label-md text-outline uppercase tracking-widest">
                  {filtered.length} gathering{filtered.length === 1 ? "" : "s"} in the diary
                </p>
              </div>

              <label className="w-full lg:w-96 relative">
                <span className="sr-only">Search events</span>
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                  search
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="search"
                  placeholder="SEARCH EVENTS"
                  className="w-full pl-12 pr-4 py-4 bg-surface border-2 border-on-background font-label-md uppercase neo-shadow focus:ring-4 focus:ring-primary outline-none transition-all"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-3 mb-stack-lg">
              {categories.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    aria-pressed={active}
                    className={`font-label-md uppercase tracking-widest px-5 py-3 border-2 border-on-background transition-all neo-button-hover ${
                      active
                        ? "bg-primary text-on-primary neo-shadow"
                        : "bg-surface text-on-background hover:bg-primary-fixed"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {filtered.map((event) => (
                  <EventCard key={event.slug} event={event} />
                ))}
              </div>
            ) : sorted.length === 0 ? (
              <VisitInstead title="Nothing is on the diary yet">
                Services happen at a branch. Find a location and come this Sunday.
              </VisitInstead>
            ) : (
              <VisitInstead
                title="Nothing matches that yet"
                icon="event_busy"
                action={
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setActiveCategory("All");
                    }}
                    className="kp-depth-button kp-button-gold kp-empty-panel__cta"
                  >
                    Reset filters
                  </button>
                }
              >
                Try another category or clear your search.
              </VisitInstead>
            )}
          </div>
        </section>

        {/* FIRST TIME / SERVE STRIP */}
        <section className="bg-on-background text-surface py-stack-lg border-y-4 border-primary relative overflow-hidden">
          <div className="absolute inset-0 halftone-overlay opacity-10 pointer-events-none" />
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop relative z-10 grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {[
              {
                icon: "waving_hand",
                title: "First time?",
                copy: "Come as you are, arrive ten minutes early and look for the welcome team in purple.",
                cta: "Find a Branch",
                to: "/branches" as const,
              },
              {
                icon: "groups",
                title: "Bring a friend",
                copy: "Every gathering is easier with a friend. Invite someone and we'll save you both a seat.",
                cta: "See Life",
                to: "/life" as const,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border-2 border-surface p-stack-md flex flex-col gap-3 hover:bg-surface hover:text-on-background transition-colors group"
              >
                <span className="material-symbols-outlined text-4xl text-primary-fixed-dim group-hover:text-primary transition-colors">
                  {item.icon}
                </span>
                <h4 className="font-headline-md text-headline-md uppercase">{item.title}</h4>
                <p className="font-body-md opacity-90">{item.copy}</p>
                <Link
                  href={item.to}
                  className="mt-auto pt-2 font-label-md uppercase tracking-widest inline-flex items-center gap-2 hover:text-primary transition-colors"
                >
                  {item.cta}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        <NewsletterSignup
          title="Get the schedule in your inbox"
          copy="Never miss an update. Subscribe to our Weekly Briefing for event registration links, location changes and early access."
          placeholder="ENTER YOUR EMAIL"
          className="bg-secondary-container text-on-secondary-container"
          copyClassName="text-on-secondary-container"
        />
      </main>

      <SiteFooter />
      <ThemeToggle />
    </div>
  );
}

export default EventsPage;
