"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  splitFellowshipEvents,
  type ChurchEvent,
} from "@/lib/events";
import { eventToCalendarItem, mapsSearchUrl } from "@/lib/calendar";
import { PlanVisitButton } from "@/components/PlanVisitButton";

const YOUNG_ADULTS = "/assets/young-adults.jpg";
const COMMUNITY = "/assets/community.jpg";
const BRANCH_SLIDE_2 = "/assets/branch-slide-2.jpg";
const BRANCH_SLIDE_4 = "/assets/branch-slide-4.jpg";
const BRANCH_SLIDE_5 = "/assets/branch-slide-5.jpg";

const FALLBACK_IMAGES = [COMMUNITY, BRANCH_SLIDE_4, BRANCH_SLIDE_5];

function eventDateBadge(event: ChurchEvent) {
  if (event.dayLabel.toLowerCase().startsWith("every ")) {
    return event.dayLabel.replace(/^Every /i, "").slice(0, 3).toUpperCase();
  }
  return new Date(event.starts)
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      timeZone: "Europe/London",
    })
    .toUpperCase();
}

function eventBlurb(text: string) {
  const clean = text.trim();
  if (clean.length <= 110) return clean;
  return `${clean.slice(0, 110).replace(/\s+\S*$/, "").trim()}…`;
}

function HangoutCard({
  event,
  index,
  featured,
}: {
  event: ChurchEvent;
  index: number;
  featured?: boolean;
}) {
  const image = event.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  const place = event.location.split(",")[0]?.trim() || event.location;

  return (
    <article className="bg-surface-container-lowest border-heavier neo-shadow hover-lift group flex flex-col">
      <div className="h-48 border-b-2 border-on-background relative overflow-hidden">
        <img
          src={image}
          alt={`${event.title} at Kharis Phase 2`}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 font-label-md border-heavy">
          {eventDateBadge(event)}
        </div>
      </div>
      <div className="p-stack-md space-y-base flex flex-col flex-1">
        <div className="flex flex-wrap gap-2">
          <span
            className={`px-2 py-0.5 font-label-sm text-[10px] border uppercase ${
              featured
                ? "bg-secondary-fixed text-on-secondary-fixed-variant"
                : "bg-surface-variant text-on-surface-variant"
            }`}
          >
            {event.category}
          </span>
          <span className="px-2 py-0.5 font-label-sm text-[10px] border bg-surface-variant text-on-surface-variant uppercase">
            {place}
          </span>
        </div>
        <h3 className="font-headline-md text-headline-md uppercase">{event.title}</h3>
        <p className="font-body-md text-on-surface-variant line-clamp-2">
          {eventBlurb(event.blurb)}
        </p>
        <div className="pt-base mt-auto border-t-2 border-on-background flex justify-between items-center gap-3">
          <span className="font-label-md">{event.timeLabel}</span>
          <PlanVisitButton
            item={eventToCalendarItem(event)}
            directionsUrl={mapsSearchUrl(event.location)}
            className="inline-flex items-center gap-1 font-label-md uppercase text-primary"
          >
            Remind me
            <span className="material-symbols-outlined text-lg">calendar_add_on</span>
          </PlanVisitButton>
        </div>
      </div>
    </article>
  );
}

function FellowshipsPage({ events }: { events: ChurchEvent[] }) {
  const { fellowships, others } = splitFellowshipEvents(events);
  return (
    <div className="bg-background text-on-background font-body-md overflow-x-hidden">
      <SiteHeader />
      <main>
        {/* HERO */}
        <section className="relative bg-on-background text-background overflow-hidden min-h-[60vh] md:min-h-[80vh] flex items-center border-b-4 border-primary pt-28 md:pt-32 pb-stack-lg">
          <div className="halftone-bg absolute inset-0 pointer-events-none opacity-25"></div>
          <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-primary/25 to-transparent"></div>
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop relative z-10 grid md:grid-cols-2 gap-stack-lg items-center">
            <div className="space-y-stack-md">
              <div
                className="inline-block bg-secondary-container text-on-secondary-container px-4 py-1 border-heavy font-label-md uppercase tracking-widest animate-bounce motion-reduce:animate-none"
              >
                Community First
              </div>
              <h1
                className="font-display-lg text-display-lg text-primary-fixed-dim uppercase leading-none"
              >
                FELLOWSHIPS
              </h1>
              <p
                className="font-body-lg text-body-lg max-w-md opacity-90 border-l-4 border-primary pl-6"
              >
                Smaller circles, deeper connections. Find your people, grow your faith, and do
                life together in a space built for you.
              </p>
              <div className="pt-base flex flex-wrap gap-stack-sm">
                <a
                  className="bg-primary text-on-primary font-headline-md text-headline-md px-8 py-4 border-heavy neo-shadow-lg hover-lift hover-press flex items-center gap-2"
                  href="#fellowship"
                >
                  FIND YOUR FELLOWSHIP
                  <span className="material-symbols-outlined">arrow_downward</span>
                </a>
                <a
                  className="border-2 border-background px-8 py-4 font-headline-md text-headline-md hover:bg-background hover:text-on-background transition-colors flex items-center gap-2"
                  href="#hangouts"
                >
                  UPCOMING EVENTS
                </a>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="border-heavier p-2 bg-background transform rotate-2 neo-shadow-lg overflow-hidden">
                <img
                  alt="Young adults fellowship at Kharis"
                  className="w-full grayscale hover:grayscale-0 transition-all duration-500 object-cover aspect-square"
                  src={YOUNG_ADULTS}
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-secondary-container text-on-secondary-container p-4 border-heavy neo-shadow transform -rotate-3 font-label-md max-w-[200px]">
                JOIN THE MOVEMENT. WE'RE BETTER TOGETHER.
              </div>
            </div>
          </div>
        </section>

        {/* THE ARMS */}
        <section
          className="py-stack-lg bg-surface-container-low border-b-4 border-on-background overflow-hidden"
          id="fellowship"
        >
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-stack-lg max-w-3xl mx-auto space-y-stack-sm">
              <div className="inline-block bg-secondary-container text-on-secondary-container px-4 py-1 border-heavy font-label-md uppercase tracking-widest">
                No tribes. Just family.
              </div>
              <h2 className="font-display-lg text-headline-lg-mobile md:text-headline-lg uppercase inline-block border-x-4 border-primary px-6 md:px-8">
                FIND YOUR FELLOWSHIP
              </h2>
              <p className="font-body-md text-on-surface-variant">
                One family, one mission — bringing Kharis closer to wherever you are.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <article className="bg-secondary-fixed text-on-secondary-fixed-variant border-heavier neo-shadow-lg flex flex-col relative group overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="halftone absolute inset-0 opacity-10 pointer-events-none"></div>

                <div className="relative h-56 md:h-72 border-b-4 border-on-background overflow-hidden">
                  <img
                    src={BRANCH_SLIDE_2}
                    alt="New Breeds fellowship"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-4 right-4 bg-on-secondary-fixed-variant text-secondary-fixed px-3 py-1 font-label-md border-heavy uppercase">
                    New Areas
                  </div>

                  {/* Comic starburst badge */}
                  <div className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 w-28 h-28 md:w-36 md:h-36 flex items-center justify-center transform -rotate-12 group-hover:-rotate-6 transition-transform duration-500">
                    <svg
                      viewBox="0 0 100 100"
                      className="absolute inset-0 w-full h-full fill-primary"
                      aria-hidden="true"
                    >
                      <polygon points="50,0 61,35 97,35 68,57 79,91 50,70 21,91 32,57 3,35 39,35" />
                    </svg>
                    <span className="relative z-10 text-on-primary font-label-md text-[10px] md:text-xs uppercase text-center leading-tight px-2">
                      New<br />Breed
                    </span>
                  </div>
                </div>

                <div className="relative z-10 p-stack-md md:p-stack-lg flex flex-col">
                  <div className="flex items-center gap-4">
                    <span
                      className="material-symbols-outlined text-5xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      local_mall
                    </span>
                    <h3 className="font-display-lg text-headline-lg uppercase leading-none">
                      NEW BREEDS
                    </h3>
                  </div>
                  <p className="font-body-md mt-stack-sm opacity-90">
                    A taste of Kharis in a local area where there may not be a branch yet.
                  </p>
                  <div className="mt-stack-md pt-stack-sm">
                    <Link
                      href="/branches"
                      className="inline-flex items-center gap-2 bg-background text-on-background px-6 py-3 border-heavy font-headline-md text-label-md hover-lift hover-press"
                    >
                      Find out more
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* HANGOUTS */}
        <section className="py-stack-lg bg-surface relative" id="hangouts">
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-stack-lg gap-stack-md">
              <div className="max-w-xl">
                <h2 className="font-headline-lg text-headline-lg uppercase mb-2">
                  Upcoming Fellowships
                </h2>
                <div className="h-1.5 w-32 bg-primary mb-4"></div>
                <p className="font-body-md text-on-surface-variant">
                  Hangouts, New Breeds, and midweek circles — then the rest of
                  the KP2 calendar so you never miss a gathering.
                </p>
              </div>
              <Link
                href="/events"
                className="font-label-md uppercase tracking-tighter border-b-4 border-primary pb-1 hover:text-primary transition-colors self-start md:self-auto"
              >
                View All Events
              </Link>
            </div>

            {fellowships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {fellowships.map((event, index) => (
                  <HangoutCard
                    key={event.slug}
                    event={event}
                    index={index}
                    featured
                  />
                ))}
              </div>
            ) : others.length > 0 ? (
              <div className="border-2 border-dashed border-on-background bg-surface-container-low p-stack-md md:p-stack-lg mb-stack-lg">
                <p className="font-body-md text-on-surface-variant">
                  No fellowship nights on the calendar yet. When they&apos;re
                  announced they&apos;ll show up here first.
                </p>
              </div>
            ) : null}

            {others.length > 0 ? (
              <div className={fellowships.length > 0 ? "mt-stack-lg" : ""}>
                <div className="mb-stack-md">
                  <h3 className="font-headline-md text-headline-md uppercase">
                    Also happening
                  </h3>
                  <p className="font-body-md text-on-surface-variant mt-2">
                    Sunday, conferences, and everything else coming up.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                  {others.map((event, index) => (
                    <HangoutCard
                      key={event.slug}
                      event={event}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {events.length === 0 ? (
              <div className="border-2 border-dashed border-on-background bg-surface-container-low p-stack-lg text-center">
                <span className="material-symbols-outlined text-5xl text-outline">
                  event_busy
                </span>
                <h3 className="font-headline-md text-headline-md uppercase mt-4">
                  Nothing on the calendar yet
                </h3>
                <p className="font-body-md text-on-surface-variant mt-2">
                  Check back soon, or see the full events page for the latest.
                </p>
                <Link
                  href="/events"
                  className="mt-stack-md inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 border-heavy font-headline-md text-label-md hover-lift hover-press"
                >
                  View all events
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            ) : null}
          </div>
        </section>

        {/* CTA */}
        <section className="py-stack-lg bg-surface-container-low border-t-4 border-on-background relative overflow-hidden">
          <div className="halftone absolute inset-0 opacity-5"></div>
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop text-center">
            <div className="max-w-3xl mx-auto space-y-stack-md relative z-10">
              <h2 className="font-display-lg text-headline-lg-mobile md:text-display-lg uppercase leading-none">
                DON'T DO LIFE ALONE
              </h2>
              <p className="font-body-lg text-on-surface-variant">
                Whether you're looking for a squad to play ball with or a community to wrestle
                with deep theological questions, there's a space for you here.
              </p>
              <form
                className="flex flex-col md:flex-row gap-stack-md justify-center items-stretch md:items-center pt-base"
                onSubmit={(e) => e.preventDefault()}
              >
                <label className="sr-only" htmlFor="fellowship-email">
                  Your email address
                </label>
                <input
                  id="fellowship-email"
                  className="w-full md:w-80 px-6 py-4 border-heavier bg-surface-container-lowest text-on-background font-label-md placeholder:text-on-surface-variant focus:outline-none focus:ring-4 focus:ring-primary/40"
                  placeholder="YOUR EMAIL ADDRESS"
                  type="email"
                />
                <button
                  type="submit"
                  className="w-full md:w-auto bg-primary text-on-primary px-10 py-4 border-heavy neo-shadow-lg font-headline-md text-headline-md hover-lift hover-press uppercase tracking-wider"
                >
                  Get Plugged In
                </button>
              </form>
              <p className="font-label-sm text-on-surface-variant uppercase">
                Join 500+ young adults already in fellowships.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <ThemeToggle />
    </div>
  );
}

export default FellowshipsPage;
