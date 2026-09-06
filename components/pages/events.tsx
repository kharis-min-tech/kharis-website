"use client";

import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  CATEGORY_ICON,
  EVENT_CATEGORIES,
  type ChurchEvent,
} from "@/lib/events";
import { eventToCalendarItem, mapsSearchUrl } from "@/lib/calendar";
import { PlanVisitButton } from "@/components/PlanVisitButton";

const HERO_WORSHIP = "/assets/events-hero-worship.jpg";
const WORSHIP = "/assets/worship.jpg";
const PASTOR_DAVID = "/assets/leadership-pastor-david.jpg";

const SPECIAL_SERVICES = [
  {
    day: "BASS",
    time: "Monthly · Sunday",
    title: "Bring A Soul Sunday",
    note: "We fill the room with friends, family and first-timers — a high-energy Sunday built for souls.",
    image: "/assets/bass-sunday.jpg",
  },
  {
    day: "Sports Day",
    time: "Summer",
    title: "Sports Day",
    note: "Track, football and full-blown team rivalry — the church family outdoors for a day of games.",
    image: "/assets/sports-day.jpg",
  },
  {
    day: "Praise Night",
    time: "Seasonal",
    title: "Praise Night",
    note: "A night handed over to worship — live praise, testimony and the Word until the room shifts.",
    image: "/assets/praise-night.jpg",
  },
];

function useCountdown(target: string) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now === null) return null;
  const diff = Math.max(0, new Date(target).getTime() - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CountdownBlock({ target }: { target: string }) {
  const c = useCountdown(target);
  const units = [
    { label: "Days", value: c?.days },
    { label: "Hrs", value: c?.hours },
    { label: "Min", value: c?.minutes },
    { label: "Sec", value: c?.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {units.map((u) => (
        <div
          key={u.label}
          className="bg-surface border-2 border-on-background neo-shadow px-2 py-3 text-center"
        >
          <span className="block font-display-lg text-headline-lg text-on-background tabular-nums">
            {u.value === undefined ? "--" : String(u.value).padStart(2, "0")}
          </span>
          <span className="block font-label-sm uppercase tracking-widest text-outline">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}

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

function EventsPage({ events }: { events: ChurchEvent[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [query, setQuery] = useState("");

  const sorted = useMemo(
    () =>
      [...events].sort(
        (a, b) => new Date(a.starts).getTime() - new Date(b.starts).getTime(),
      ),
    [events],
  );

  const featured = sorted.find((e) => e.featured) ?? sorted[0];
  const categories = useMemo(() => {
    const present = new Set(sorted.map((e) => e.category));
    return ["All", ...EVENT_CATEGORIES.filter((c) => present.has(c))];
  }, [sorted]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter((e) => {
      const matchesCategory =
        activeCategory === "All" || e.category === activeCategory;
      const matchesQuery =
        !q ||
        [e.title, e.blurb, e.location, e.category, e.dayLabel]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [sorted, activeCategory, query]);

  return (
    <div className="bg-background text-on-background font-body-md overflow-x-hidden">
      <SiteHeader />

      <main className="mt-20">
        {/* HERO */}
        <section className="relative bg-on-background text-surface py-stack-lg min-h-[60vh] flex flex-col justify-center overflow-hidden border-b-4 border-primary">
          <img
            src={HERO_WORSHIP}
            alt="Kharis Phase 2 congregation worshipping together"
            className="absolute inset-0 w-full h-full object-cover opacity-25 grayscale"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 halftone-overlay opacity-20 pointer-events-none" />
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
            <div className="max-w-4xl">
              <span className="inline-block bg-secondary-container text-on-secondary-container font-label-md px-4 py-1 border-2 border-surface mb-6 uppercase tracking-widest animate-bounce motion-reduce:animate-none">
                Experience the Culture
              </span>
              <h1 className="font-display-lg text-display-lg mb-4 text-surface-bright">
                EVENTS
              </h1>
              <p className="font-headline-md text-headline-md text-primary-fixed-dim uppercase italic max-w-2xl mb-stack-md">
                Don't miss a moment of the movement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#whats-on"
                  className="inline-block bg-primary text-on-primary font-headline-md text-headline-md px-8 py-4 border-4 border-surface neo-shadow-lg neo-button-hover transition-all text-center uppercase"
                >
                  See What's On
                </a>
                {featured ? (
                  <PlanVisitButton
                    item={eventToCalendarItem(featured)}
                    directionsUrl={mapsSearchUrl(featured.location)}
                    className="inline-block bg-surface text-on-background font-headline-md text-headline-md px-8 py-4 border-4 border-surface neo-shadow-lg neo-button-hover transition-all text-center uppercase"
                  >
                    Plan Your Visit
                  </PlanVisitButton>
                ) : (
                  <Link
                    href="/branches"
                    className="inline-block bg-surface text-on-background font-headline-md text-headline-md px-8 py-4 border-4 border-surface neo-shadow-lg neo-button-hover transition-all text-center uppercase"
                  >
                    Plan Your Visit
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* NEXT UP + COUNTDOWN */}
        {featured ? (
        <section className="bg-surface-container-low h-screen pt-stack-lg border-b-4 border-on-background overflow-hidden">
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop h-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch h-full">
              <div className="lg:col-span-7 relative border-2 border-on-background neo-shadow-lg overflow-hidden group">
                <img
                  src={featured.image || WORSHIP}
                  alt={`${featured.title} at Kharis Phase 2`}
                  className="w-full h-full min-h-[320px] object-cover grayscale-[25%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700"
                  loading="lazy"
                  decoding="async"
                />
                <span className="absolute top-4 left-4 bg-primary text-on-primary font-label-md px-4 py-2 border-2 border-on-background uppercase neo-shadow">
                  Next Up
                </span>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-stack-md justify-center bg-surface border-2 border-on-background neo-shadow-lg p-stack-md overflow-y-auto">
                <div>
                  <span className="font-label-sm uppercase tracking-widest text-outline">
                    {featured.dayLabel} · {featured.timeLabel}
                  </span>
                  <h2 className="font-headline-lg text-headline-lg uppercase leading-tight text-on-background mt-2">
                    {featured.title}
                  </h2>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  {featured.blurb}
                </p>
                <CountdownBlock target={featured.starts} />
                <div className="flex flex-col sm:flex-row gap-4">
                  <PlanVisitButton
                    item={eventToCalendarItem(featured)}
                    directionsUrl={mapsSearchUrl(featured.location)}
                    className="flex-1 bg-primary-container text-on-primary-container font-headline-md text-headline-md px-6 py-4 border-4 border-on-background neo-shadow neo-button-hover transition-all text-center uppercase"
                  >
                    {featured.cta}
                  </PlanVisitButton>
                  <Link
                    href="/messages"
                    className="flex-1 bg-surface text-on-background font-headline-md text-headline-md px-6 py-4 border-4 border-on-background neo-shadow neo-button-hover transition-all text-center uppercase"
                  >
                    Watch Online
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        ) : null}

        {/* SPECIAL SERVICES */}
        <section className="bg-surface py-stack-lg">
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="mb-stack-lg">
              <h3 className="font-headline-lg text-headline-lg uppercase text-on-background">
                Our Special{" "}
                <span className="text-primary underline decoration-4">
                  Events
                </span>
              </h3>
              <p className="font-label-md text-outline uppercase tracking-widest">
                The moments we mark out through the year
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {SPECIAL_SERVICES.map((slot) => (
                <div
                  key={slot.title}
                  className="border-2 border-on-background neo-shadow neo-button-hover transition-all bg-surface overflow-hidden group"
                >
                  <div className="aspect-[16/10] overflow-hidden border-b-2 border-on-background">
                    <img
                      src={slot.image}
                      alt={slot.title}
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-stack-md flex flex-col gap-2">
                    <span className="font-label-sm uppercase tracking-widest text-primary">
                      {slot.day} · {slot.time}
                    </span>
                    <h4 className="font-headline-md text-headline-md uppercase text-on-background">
                      {slot.title}
                    </h4>
                    <p className="font-body-md text-on-surface-variant">
                      {slot.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT'S ON — filter + search */}
        <section
          id="whats-on"
          className="bg-surface-container-low py-stack-lg border-y-4 border-on-background scroll-mt-24"
        >
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-stack-md gap-gutter">
              <div>
                <h3 className="font-headline-lg text-headline-lg uppercase text-on-background">
                  What's{" "}
                  <span className="text-primary underline decoration-4">On</span>
                </h3>
                <p className="font-label-md text-outline uppercase tracking-widest">
                  {filtered.length} gathering{filtered.length === 1 ? "" : "s"}{" "}
                  in the diary
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
                {filtered.map((event) => (
                  <EventCard key={event.slug} event={event} />
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-on-background bg-surface p-stack-lg text-center">
                <span className="material-symbols-outlined text-5xl text-outline">
                  event_busy
                </span>
                <h4 className="font-headline-md text-headline-md uppercase mt-4 text-on-background">
                  Nothing matches that yet
                </h4>
                <p className="font-body-md text-on-surface-variant mt-2">
                  Try another category or clear your search — there's always
                  something happening.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setActiveCategory("All");
                  }}
                  className="mt-stack-md inline-block bg-primary text-on-primary font-label-md uppercase px-6 py-3 border-2 border-on-background neo-shadow neo-button-hover transition-all"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* HEAD PASTOR */}
        <section className="bg-surface py-stack-lg">
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
              <div className="md:col-span-7">
                <div className="relative neo-shadow-lg border-2 border-on-background group overflow-hidden">
                  <div className="aspect-video w-full">
                    <img
                      alt="Pastor David Antwi, Head Pastor of Kharis Ministries"
                      className="w-full h-full object-cover object-top grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                      src={PASTOR_DAVID}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="absolute top-4 left-4 bg-primary text-on-primary font-label-md px-4 py-2 border-2 border-on-background uppercase neo-shadow">
                    Head Pastor
                  </div>
                </div>
              </div>
              <div className="md:col-span-5 flex flex-col gap-stack-md">
                <h2 className="font-headline-lg text-headline-lg text-on-background uppercase leading-tight">
                  Pastor <span className="text-primary italic">David</span>{" "}
                  Antwi
                </h2>
                <div className="flex gap-4 items-center flex-wrap">
                  <span className="bg-secondary-container text-on-secondary-container font-label-md px-3 py-1 border-2 border-on-background">
                    HEAD PASTOR
                  </span>
                  <span className="font-label-md text-outline">
                    KHARIS MINISTRIES
                  </span>
                </div>
                <p className="text-body-lg font-body-lg text-on-surface-variant">
                  Pastor David leads and teaches across our gatherings — from
                  Sunday Culture to our conferences and nights of worship.
                  Expect scripture handled with care, a heart for the city, and
                  a call to live the faith out loud wherever you are.
                </p>
                <div className="pt-2">
                  <Link
                    href="/messages"
                    className="inline-block bg-primary-container text-on-primary-container font-headline-md text-headline-md px-10 py-4 border-4 border-on-background neo-shadow-lg neo-button-hover transition-all w-full md:w-auto text-center uppercase"
                  >
                    Hear Him Preach
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FIRST TIME / SERVE STRIP */}
        <section className="bg-on-background text-surface py-stack-lg border-y-4 border-primary relative overflow-hidden">
          <div className="absolute inset-0 halftone-overlay opacity-10 pointer-events-none" />
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop relative z-10 grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {[
              {
                icon: "waving_hand",
                title: "First time?",
                copy: "Come as you are, arrive ten minutes early and look for the welcome team in purple.",
                cta: "Plan Your Visit",
                to: "/branches" as const,
              },
              {
                icon: "groups",
                title: "Bring your people",
                copy: "Every gathering is easier with a friend. Invite someone and we'll save you both a seat.",
                cta: "Find a Fellowship",
                to: "/fellowships" as const,
              },
              {
                icon: "handshake",
                title: "Serve an event",
                copy: "Hospitality, sound, media, kids — events run on volunteers who show up early.",
                cta: "Join a Department",
                to: "/departments" as const,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border-2 border-surface p-stack-md flex flex-col gap-3 hover:bg-surface hover:text-on-background transition-colors group"
              >
                <span className="material-symbols-outlined text-4xl text-primary-fixed-dim group-hover:text-primary transition-colors">
                  {item.icon}
                </span>
                <h4 className="font-headline-md text-headline-md uppercase">
                  {item.title}
                </h4>
                <p className="font-body-md opacity-90">{item.copy}</p>
                <Link
                  href={item.to}
                  className="mt-auto pt-2 font-label-md uppercase tracking-widest inline-flex items-center gap-2 hover:text-primary transition-colors"
                >
                  {item.cta}
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="py-stack-lg bg-secondary-container border-b-4 border-on-background">
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop text-center">
            <h3 className="font-headline-lg text-headline-lg uppercase mb-4 text-on-secondary-container">
              Get the schedule in your inbox
            </h3>
            <p className="font-body-lg text-on-secondary-container mb-stack-md max-w-2xl mx-auto">
              Never miss an update. Subscribe to our Weekly Briefing for event
              registration links, location changes and early access.
            </p>
            <form
              className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <label className="flex-grow">
                <span className="sr-only">Email address</span>
                <input
                  className="w-full p-4 bg-surface border-2 border-on-background font-label-md focus:ring-4 focus:ring-primary outline-none transition-all"
                  placeholder="ENTER YOUR EMAIL"
                  type="email"
                  required
                />
              </label>
              <button
                type="submit"
                className="bg-on-background text-surface font-headline-md px-8 py-4 border-2 border-on-background neo-shadow-lg neo-button-hover transition-all uppercase"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <SiteFooter />
      <ThemeToggle />
    </div>
  );
}

export default EventsPage;
