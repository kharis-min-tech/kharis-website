"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PlanVisitButton } from "@/components/PlanVisitButton";
import { YoutubeEmbed } from "@/components/YoutubeEmbed";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  hasCoords,
  osmEmbedUrlAtZoom,
  splitServices,
  type Branch,
} from "@/lib/branches";
import {
  eventToCalendarItem,
  mapsDirectionsUrl,
  weeklyServiceToCalendarItem,
} from "@/lib/calendar";
import type { ChurchEvent } from "@/lib/events";
import {
  displayMessageTitle,
  formatMessageDate,
  type MessageVideo,
} from "@/lib/youtube";

const GALLERY_FALLBACKS = [
  "/assets/worship.jpg",
  "/assets/young-adults.jpg",
  "/assets/community.jpg",
  "/assets/events-hero-worship.jpg",
  "/assets/praise-night.jpg",
  "/assets/events-sunday-service.jpg",
];

function galleryFor(branch: Branch) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const src of [branch.image, ...GALLERY_FALLBACKS]) {
    if (!src || seen.has(src)) continue;
    seen.add(src);
    out.push(src);
    if (out.length >= 8) break;
  }
  return out;
}

function BranchNotFound() {
  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <SiteHeader />
      <main className="pt-[74px] max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-24">
        <h1 className="font-display-lg text-headline-lg uppercase mb-4">
          We couldn't find that branch
        </h1>
        <Link
          href="/branches"
          className="inline-block bg-primary text-on-primary font-body-md text-[13px] font-bold uppercase tracking-wide px-6 py-4 rounded-2xl vibe-glow"
        >
          Back to all branches
        </Link>
      </main>
    </div>
  );
}

function visitDirections(branch: Branch) {
  const dest = [branch.address, branch.postcode].filter(Boolean).join(", ");
  if (!dest || dest.toLowerCase().includes("coming soon")) return undefined;
  return mapsDirectionsUrl(dest);
}

function visitItem(branch: Branch, service = branch.serviceTimes[0]) {
  if (!service) return null;
  const location = [branch.address, branch.postcode].filter(Boolean).join(", ");
  return weeklyServiceToCalendarItem({
    uid: `branch-${branch.slug}-${service.day}-${service.time}`,
    title: `${service.label} · ${branch.name}`,
    description: `Join us at ${branch.name}. ${branch.blurb}`,
    location,
    day: service.day,
    time: service.time,
  });
}

function eventsForBranch(events: ChurchEvent[], branch: Branch) {
  const city = branch.city.toLowerCase();
  const name = branch.name.toLowerCase();
  const matched = events.filter((event) => {
    const loc = event.location.toLowerCase();
    return loc.includes(city) || loc.includes(name);
  });
  return (matched.length ? matched : events).slice(0, 4);
}

function BranchPage({
  branch,
  branches,
  featuredMessage,
  events,
}: {
  branch: Branch;
  branches: Branch[];
  featuredMessage: MessageVideo | null;
  events: ChurchEvent[];
}) {
  const router = useRouter();
  const nextVisit = visitItem(branch);
  const directions = visitDirections(branch);
  const { sunday, midweek } = splitServices(branch.services);
  const sundayList = (sunday.length ? sunday : branch.serviceTimes) as Array<{
    day: string;
    time: string;
    label: string;
    description?: string;
  }>;
  const gallery = galleryFor(branch);
  const campusEvents = eventsForBranch(events, branch);
  const others = branches.filter((item) => item.slug !== branch.slug);
  const giveHref = branch.givingLink || "/giving";
  const pastorLead = branch.pastorRole.toLowerCase().includes("pastor")
    ? "pastor"
    : "lead";

  const [zoomLevel, setZoomLevel] = useState(15);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [gallerySrc, setGallerySrc] = useState<string | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setBranchDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  const mapSrc = useMemo(
    () => (hasCoords(branch) ? osmEmbedUrlAtZoom(branch, zoomLevel) : ""),
    [branch, zoomLevel],
  );

  const welcomeParagraphs = [
    `I serve as the ${pastorLead} of ${branch.name}, part of the Kharis Phase 2 family.${branch.description ? ` ${branch.description}` : ""}`,
    "We love teaching the Word of God, and we long to see believers established in their faith and our city strengthened.",
    `Whether you are visiting ${branch.city} for a season or looking for a church to call home, there is a place for you here.`,
  ];

  function sendBranchMessage(event: FormEvent) {
    event.preventDefault();
    const to = branch.email;
    if (!to) {
      router.push("/contact");
      return;
    }
    const subject = encodeURIComponent(`Message for ${branch.name}`);
    const body = encodeURIComponent(
      `From: ${contactName}\nEmail: ${contactEmail}\n\n${contactMessage}`,
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="bg-background text-on-surface font-body-md">
      <SiteHeader />

      <main className="pt-[74px]">
        {/* Hero */}
        <section className="relative flex w-full min-h-0 items-center justify-center px-4 pt-6 pb-8 sm:min-h-[65vh] sm:px-5 sm:pt-10 sm:pb-16 md:px-8 max-w-[1536px] mx-auto">
          <div className="absolute inset-x-4 top-6 bottom-4 z-0 overflow-hidden rounded-2xl border border-on-background/10 sm:inset-x-5 sm:top-10 sm:bottom-8 md:inset-x-8">
            <img
              src={branch.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
          </div>

          <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-3 pt-12 pb-8 text-center text-white sm:px-6 sm:pt-16 sm:pb-12">
            <div className="mb-8 flex flex-col items-center gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:justify-center">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-black/40 backdrop-blur-md border border-white/30">
                <span className="material-symbols-outlined text-[18px] text-secondary-container">
                  location_on
                </span>
                <span className="font-body-md text-[12px] font-bold uppercase tracking-wider">
                  Kharis Phase 2 · {branch.city} Branch
                </span>
              </div>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setBranchDropdownOpen((open) => !open)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary font-body-md text-[12px] font-bold uppercase tracking-wider rounded-2xl border border-on-background/10"
                >
                  <span>Switch branch</span>
                  <span
                    className={`material-symbols-outlined text-[18px] transition-transform ${branchDropdownOpen ? "rotate-180" : ""}`}
                  >
                    expand_more
                  </span>
                </button>

                {branchDropdownOpen ? (
                  <div className="absolute left-1/2 top-full z-50 mt-2 max-h-[70vh] w-64 -translate-x-1/2 overflow-auto bg-surface-container-lowest text-on-surface rounded-2xl vibe-glow p-2">
                    <div className="mb-1 border-b-2 border-on-background/15 px-3 py-1.5 font-body-md text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                      Switch KP2 campus
                    </div>
                    {branches.map((item) => (
                      <button
                        key={item.slug}
                        type="button"
                        onClick={() => {
                          setBranchDropdownOpen(false);
                          router.push(`/branches/${item.slug}`);
                        }}
                        className={`flex w-full items-center justify-between px-3 py-2 text-left font-body-md text-[12px] font-bold transition-colors ${
                          item.slug === branch.slug
                            ? "bg-primary text-on-primary"
                            : "hover:bg-secondary-container hover:text-on-secondary-container"
                        }`}
                      >
                        <span>{item.name}</span>
                        <span className="text-[10px] opacity-80">{item.city}</span>
                      </button>
                    ))}
                    <div className="mt-1 border-t-2 border-on-background/15 pt-1.5">
                      <Link
                        href="/branches"
                        onClick={() => setBranchDropdownOpen(false)}
                        className="block w-full py-1.5 text-center font-body-md text-[12px] font-bold uppercase text-primary"
                      >
                        View all branches →
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <h1 className="mb-5 font-display-lg text-[1.85rem] uppercase leading-[1.05] sm:mb-6 sm:text-5xl md:text-6xl">
              Welcome to{" "}
              <span className="block text-secondary-container">{branch.name}</span>
            </h1>

            <p className="mb-8 max-w-2xl px-1 font-body-lg text-[0.95rem] leading-relaxed text-white/85 sm:mb-10 sm:text-lg">
              {branch.description}
            </p>

            <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row sm:gap-4">
              {nextVisit ? (
                <PlanVisitButton
                  item={nextVisit}
                  directionsUrl={directions}
                  className="flex items-center justify-center gap-2 bg-primary text-on-primary font-body-md text-[13px] font-bold uppercase tracking-wide px-7 py-3.5 rounded-2xl vibe-glow"
                >
                  Plan your visit
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </PlanVisitButton>
              ) : directions ? (
                <a
                  href={directions}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-primary text-on-primary font-body-md text-[13px] font-bold uppercase tracking-wide px-7 py-3.5 rounded-2xl vibe-glow"
                >
                  Plan your visit
                </a>
              ) : null}

              <a
                href="#events"
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/10 px-7 py-3.5 font-body-md text-[13px] font-bold uppercase tracking-wide text-white"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary-container">
                  calendar_month
                </span>
                Upcoming events
              </a>

              <Link
                href={giveHref}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/40 px-7 py-3.5 font-body-md text-[13px] font-bold uppercase tracking-wide text-white"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary-container">
                  favorite
                </span>
                Give
              </Link>
            </div>
          </div>
        </section>

        {/* Join us this Sunday */}
        <section id="services" className="py-16 px-margin-mobile md:px-margin-desktop max-w-[1536px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display-lg text-headline-lg uppercase leading-none mb-4">
              Join us this Sunday
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
              We can&apos;t wait to host you. Choose a service time that works best
              for you and your family.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <div className="bg-surface-container-lowest rounded-2xl vibe-glow p-6 sm:p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-on-background/15">
                    <div className="w-12 h-12 bg-secondary-container text-on-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined">schedule</span>
                    </div>
                    <div>
                      <h3 className="font-display-lg text-[24px] uppercase">Service times</h3>
                      <p className="font-body-md text-[12px] text-on-surface-variant">
                        Sunday & midweek gathering
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {sundayList.map((service) => {
                      const item = visitItem(branch, service);
                      return (
                        <div
                          key={`${service.day}-${service.time}-${service.label}`}
                          className="flex items-start gap-4 rounded-2xl p-4 border border-on-background/10 bg-background"
                        >
                          <div className="flex-shrink-0 w-20 text-center">
                            <span className="block font-display-lg text-[22px] text-primary leading-none mb-1">
                              {service.time}
                            </span>
                            <span className="font-body-md text-[10px] font-bold uppercase tracking-wider">
                              {service.day}
                            </span>
                          </div>
                          <div className="flex-grow pt-0.5">
                            <h4 className="font-body-md text-[14px] font-bold uppercase mb-1">
                              {service.label}
                            </h4>
                            {service.description ? (
                              <p className="font-body-md text-[13px] text-on-surface-variant leading-relaxed">
                                {service.description}
                              </p>
                            ) : null}
                          </div>
                          {item ? (
                            <PlanVisitButton
                              item={item}
                              directionsUrl={directions}
                              className="shrink-0 inline-flex items-center text-primary mt-1"
                              aria-label={`Add ${service.label} to your calendar`}
                            >
                              <span className="material-symbols-outlined">chevron_right</span>
                            </PlanVisitButton>
                          ) : null}
                        </div>
                      );
                    })}

                    {midweek.map((service) => {
                      const item = visitItem(branch, service);
                      return (
                        <div
                          key={service.id}
                          className="flex items-start gap-4 rounded-2xl p-4 border border-secondary-container bg-secondary-container/20"
                        >
                          <div className="flex-shrink-0 w-20 text-center">
                            <span className="block font-display-lg text-[22px] text-primary leading-none mb-1">
                              {service.time}
                            </span>
                            <span className="font-body-md text-[10px] font-bold uppercase tracking-wider">
                              {service.day}
                            </span>
                          </div>
                          <div className="flex-grow pt-0.5">
                            <span className="inline-block font-body-md text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
                              {service.day} · Midweek
                            </span>
                            <h4 className="font-body-md text-[14px] font-bold uppercase mb-1">
                              {service.label}
                            </h4>
                            {service.description ? (
                              <p className="font-body-md text-[13px] text-on-surface-variant leading-relaxed">
                                {service.description}
                              </p>
                            ) : null}
                          </div>
                          {item ? (
                            <PlanVisitButton
                              item={item}
                              directionsUrl={directions}
                              className="shrink-0 inline-flex items-center text-primary mt-1"
                              aria-label={`Add ${service.label} to your calendar`}
                            >
                              <span className="material-symbols-outlined">chevron_right</span>
                            </PlanVisitButton>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t-2 border-on-background/15 flex justify-between items-center gap-3 bg-background p-4">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                    </span>
                    <span className="font-body-md text-[12px] font-bold">
                      Warm welcome team on hand when you arrive
                    </span>
                  </div>
                  {nextVisit ? (
                    <PlanVisitButton
                      item={nextVisit}
                      directionsUrl={directions}
                      className="text-primary font-body-md text-[12px] font-bold uppercase shrink-0"
                    >
                      Reserve seats
                    </PlanVisitButton>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-surface-container-lowest rounded-2xl vibe-glow p-3 h-[500px] relative overflow-hidden">
                {hasCoords(branch) ? (
                  <div className="absolute inset-3 overflow-hidden">
                    <iframe
                      title={`Map of ${branch.name}`}
                      src={mapSrc}
                      className="h-full w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                ) : (
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] object-cover"
                  />
                )}

                <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
                  <div className="bg-surface-container-lowest/95 backdrop-blur-md p-4 max-w-xs pointer-events-auto rounded-2xl border border-on-background/10">
                    <h4 className="font-display-lg text-[18px] uppercase mb-1">{branch.name}</h4>
                    <p className="font-body-md text-[12px] text-on-surface-variant mb-3 leading-snug">
                      {[branch.address, branch.postcode].filter(Boolean).join(", ")}
                    </p>
                    {directions ? (
                      <a
                        href={directions}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary text-[12px] font-bold uppercase"
                      >
                        <span className="material-symbols-outlined text-[16px]">near_me</span>
                        Get directions
                      </a>
                    ) : null}
                  </div>

                  {hasCoords(branch) ? (
                    <div className="flex flex-col gap-2 pointer-events-auto">
                      <button
                        type="button"
                        onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
                        className="w-10 h-10 bg-surface-container-lowest rounded-2xl border border-on-background/10 flex items-center justify-center"
                        aria-label="Zoom in"
                      >
                        <span className="material-symbols-outlined">add</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setZoomLevel((z) => Math.max(z - 1, 10))}
                        className="w-10 h-10 bg-surface-container-lowest rounded-2xl border border-on-background/10 flex items-center justify-center"
                        aria-label="Zoom out"
                      >
                        <span className="material-symbols-outlined">remove</span>
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pastor welcome */}
        <section
          id="pastor"
          className="py-16 bg-surface-container-low border-y border-on-background/10"
        >
          <div className="max-w-[1536px] mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="md:col-span-5 relative">
                <div className="absolute -left-3 -top-3 z-10 hidden h-14 w-14 items-center justify-center bg-primary text-on-primary rounded-2xl border border-on-background/10 sm:flex">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <div className="aspect-[4/5] overflow-hidden rounded-2xl vibe-glow bg-on-background">
                  <img
                    src={branch.pastorImage}
                    alt={branch.pastor}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-background px-5 py-3 rounded-2xl vibe-glow">
                  <p className="font-body-md text-[11px] font-bold uppercase tracking-wider text-primary">
                    {branch.pastorRole || "Pastor"}
                  </p>
                  <p className="font-display-lg text-[18px] uppercase">{branch.pastor}</p>
                </div>
              </div>

              <div className="md:col-span-7 space-y-5">
                <h2 className="font-display-lg text-headline-lg uppercase leading-none">
                  Welcome to{" "}
                  <span className="text-primary">{branch.name}</span>
                </h2>
                <p className="font-body-md text-[13px] font-bold uppercase tracking-wider text-primary">
                  {branch.pastorRole} {branch.pastor}
                </p>
                <div className="space-y-4">
                  {welcomeParagraphs.map((para) => (
                    <p key={para.slice(0, 24)} className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
                <blockquote className="border-l-4 border-secondary-container pl-4 font-body-md text-body-md italic">
                  &ldquo;{branch.pastorBio}&rdquo;
                </blockquote>
                <div className="flex flex-wrap gap-3 pt-1">
                  {branch.phone ? (
                    <a
                      href={`tel:${branch.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-on-background/15 bg-background px-3 py-1.5 font-body-md text-[12px] font-bold"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">call</span>
                      {branch.phone}
                    </a>
                  ) : null}
                  {branch.email ? (
                    <a
                      href={`mailto:${branch.email}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-on-background/15 bg-background px-3 py-1.5 font-body-md text-[12px] font-bold break-all"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">mail</span>
                      {branch.email}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Watch */}
        <section id="watch" className="py-16 px-margin-mobile md:px-margin-desktop max-w-[1536px] mx-auto">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber text-[#1a0b00] px-3.5 py-1 font-body-md text-[12px] font-bold uppercase mb-3">
              Watch
            </div>
            <h2 className="font-display-lg text-headline-lg uppercase leading-none">
              Latest from {branch.name}
            </h2>
          </div>

          <div className="relative overflow-hidden rounded-2xl vibe-glow bg-on-background aspect-video">
            {featuredMessage ? (
              <>
                <YoutubeEmbed
                  id={featuredMessage.id}
                  title={displayMessageTitle(featuredMessage.title)}
                  thumbnail={featuredMessage.thumbnail || branch.image}
                />
                <div className="absolute bottom-4 left-4 right-4 pointer-events-none z-10">
                  <p className="font-display-lg text-[18px] uppercase text-white leading-tight">
                    {displayMessageTitle(featuredMessage.title)}
                  </p>
                  {featuredMessage.publishedAt ? (
                    <p className="font-body-md text-[12px] text-white/80">
                      {formatMessageDate(featuredMessage.publishedAt)}
                    </p>
                  ) : null}
                </div>
              </>
            ) : (
              <Link href="/messages" className="group relative block h-full w-full">
                <img
                  src={branch.image}
                  alt={`Worship at ${branch.city}`}
                  className="h-full w-full object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                  <span className="flex h-20 w-20 items-center justify-center bg-primary text-on-primary rounded-2xl border border-on-background/10">
                    <span className="material-symbols-outlined text-[40px]">play_arrow</span>
                  </span>
                  <span className="font-body-md text-[13px] font-bold uppercase tracking-wider text-white">
                    Watch on YouTube
                  </span>
                </div>
              </Link>
            )}
          </div>
        </section>

        {/* Gallery */}
        <section className="py-16 px-margin-mobile md:px-margin-desktop max-w-[1536px] mx-auto">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber text-[#1a0b00] px-3.5 py-1 font-body-md text-[12px] font-bold uppercase mb-3">
              Life at KP2 {branch.city}
            </div>
            <h2 className="font-display-lg text-headline-lg uppercase leading-none">
              Moments from our family
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.slice(0, 4).map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setGallerySrc(src)}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-on-background/10 text-left"
              >
                <img
                  src={src}
                  alt={`Gathering at ${branch.city}`}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white border border-white/30">
                    <span className="material-symbols-outlined">zoom_in</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Calendar */}
        <section
          id="events"
          className="py-16 px-margin-mobile md:px-margin-desktop max-w-[1536px] mx-auto"
        >
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display-lg text-headline-lg uppercase leading-none mb-2">
                This month at {branch.city}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Services, gatherings and what&apos;s coming up across Phase 2.
              </p>
            </div>
            <Link
              href="/events"
              className="font-body-md text-[12px] font-bold uppercase tracking-wide text-primary shrink-0"
            >
              See all events
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {campusEvents.map((event) => (
              <div
                key={event.slug}
                className="bg-surface-container-lowest rounded-2xl vibe-glow p-6 flex flex-col gap-3"
              >
                <p className="font-body-md text-[12px] font-bold uppercase tracking-wider text-primary">
                  {event.dayLabel} · {event.timeLabel}
                </p>
                <h3 className="font-display-lg text-[22px] uppercase leading-tight">
                  {event.title}
                </h3>
                <p className="font-body-md text-[13px] text-on-surface-variant">
                  {event.location}
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
                  {event.blurb}
                </p>
                <PlanVisitButton
                  item={eventToCalendarItem(event)}
                  directionsUrl={mapsDirectionsUrl(event.location)}
                  className="mt-auto self-start bg-primary text-on-primary font-body-md text-[12px] font-bold uppercase tracking-wide px-5 py-3 rounded-2xl border border-on-background/10"
                >
                  Plan your visit
                </PlanVisitButton>
              </div>
            ))}
            {campusEvents.length === 0 ? (
              <div className="md:col-span-2 p-8 rounded-2xl border border-on-background/10 bg-surface-container-lowest">
                <p className="font-display-lg text-[22px] uppercase mb-2">More dates soon</p>
                <p className="font-body-md text-on-surface-variant mb-4">
                  Check the events page for gatherings across Kharis Phase 2.
                </p>
                <Link
                  href="/events"
                  className="inline-block bg-primary text-on-primary font-body-md text-[12px] font-bold uppercase tracking-wide px-5 py-3 rounded-2xl border border-on-background/10"
                >
                  View events
                </Link>
              </div>
            ) : null}
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="py-16 px-margin-mobile md:px-margin-desktop max-w-[1536px] mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="font-display-lg text-headline-lg uppercase leading-none mb-4">
                Contact this campus
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-md">
                Questions about {branch.city}, parking, or your first Sunday? Send a note
                and the team will get back to you.
              </p>
              <ul className="space-y-2 font-body-md text-body-md">
                {branch.phone ? (
                  <li>
                    <a href={`tel:${branch.phone.replace(/\s/g, "")}`} className="hover:text-primary">
                      {branch.phone}
                    </a>
                  </li>
                ) : null}
                {branch.email ? (
                  <li>
                    <a href={`mailto:${branch.email}`} className="hover:text-primary break-all">
                      {branch.email}
                    </a>
                  </li>
                ) : null}
                {branch.instagram ? <li className="text-on-surface-variant">{branch.instagram}</li> : null}
              </ul>
            </div>
            <form
              onSubmit={sendBranchMessage}
              className="bg-surface-container-lowest rounded-2xl vibe-glow p-6 sm:p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <label className="flex flex-col gap-2">
                  <span className="font-label-md uppercase">Your name</span>
                  <input
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="rounded-2xl border border-on-background/10 p-4 font-body-md bg-background"
                    placeholder="Jane Doe"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="font-label-md uppercase">Email</span>
                  <input
                    required
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="rounded-2xl border border-on-background/10 p-4 font-body-md bg-background"
                    placeholder="hello@example.com"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2">
                <span className="font-label-md uppercase">Message</span>
                <textarea
                  required
                  rows={5}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="rounded-2xl border border-on-background/10 p-4 font-body-md bg-background resize-none"
                  placeholder={`How can the ${branch.city} team help?`}
                />
              </label>
              <button
                type="submit"
                className="bg-primary text-on-primary font-body-md text-[13px] font-bold uppercase tracking-wide px-8 py-4 rounded-2xl vibe-glow"
              >
                Send message
              </button>
            </form>
          </div>
        </section>

        {/* Parking + transit */}
        <section className="py-16 bg-surface-container-low border-t border-on-background/10">
          <div className="max-w-[1536px] mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl vibe-glow space-y-3">
                <div className="w-12 h-12 bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined">local_parking</span>
                </div>
                <h3 className="font-display-lg text-[24px] uppercase">Parking information</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {branch.parkingInfo}
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl vibe-glow space-y-3">
                <div className="w-12 h-12 bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined">train</span>
                </div>
                <h3 className="font-display-lg text-[24px] uppercase">Public transit</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {branch.transitInfo}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Other branches */}
        {others.length ? (
          <section className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-14 md:py-20">
            <div className="flex items-end justify-between gap-4 mb-8">
              <h2 className="font-display-lg text-headline-lg uppercase leading-none">
                Other branches
              </h2>
              <Link
                href="/branches"
                className="font-body-md text-[12px] font-bold uppercase tracking-wide text-primary shrink-0"
              >
                See all
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {others.slice(0, 3).map((item) => (
                <Link
                  key={item.slug}
                  href={`/branches/${item.slug}`}
                  className="group overflow-hidden rounded-2xl vibe-glow bg-surface-container-lowest block"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={item.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full bg-primary text-on-primary font-body-md text-[10px] font-bold uppercase tracking-wider px-3 py-1">
                      {item.region}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="font-display-lg text-[24px] uppercase leading-tight">{item.city}</p>
                    <p className="font-body-md text-[13px] text-on-surface-variant mb-3">
                      {item.address}
                    </p>
                    <p className="font-body-md text-[13px] font-bold uppercase tracking-wide">
                      {item.serviceTimes[0]?.day} · {item.serviceTimes[0]?.time}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter />
      {gallerySrc ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-on-background/80"
            aria-label="Close gallery"
            onClick={() => setGallerySrc(null)}
          />
          <img
            src={gallerySrc}
            alt=""
            className="relative z-10 max-h-[85vh] max-w-[90vw] object-contain rounded-2xl border border-on-background/10"
          />
        </div>
      ) : null}
    </div>
  );
}

export default BranchPage;
export { BranchNotFound };
