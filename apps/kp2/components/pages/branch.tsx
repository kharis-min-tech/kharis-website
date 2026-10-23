"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PlanVisitButton } from "@/components/PlanVisitButton";
import { YoutubeEmbed } from "@/components/YoutubeEmbed";
import { VisitInstead } from "@/components/VisitInstead";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  hasCoords,
  mapsEmbedUrl,
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
import { displayMessageTitle, formatMessageDate, type MessageVideo } from "@/lib/youtube";
import "@/components/branch-cards.css";

const BRANCH_MARK = "https://images.kharis.org/site-images/main/113a6a24b1d3741b/kharis-logo.png";

const GALLERY_FALLBACKS = [
  "https://images.kharis.org/site-images/kp2/9b547f88f3b4d297/worship.jpg",
  "https://images.kharis.org/site-images/kp2/234c625e119f9e2a/young-adults.jpg",
  "https://images.kharis.org/site-images/kp2/ca1bcf57dbf80629/community.jpg",
  "https://images.kharis.org/site-images/kp2/2bf8a23f06e5bb67/events-hero-worship.jpg",
  "https://images.kharis.org/site-images/kp2/2bf8a23f06e5bb67/praise-night.jpg",
  "https://images.kharis.org/site-images/kp2/d6b67a1d5d3003b0/events-sunday-service.jpg",
];

function galleryFor(branch: Branch) {
  return branch.gallery;
}

function GalleryCarousel({
  images,
  city,
  onOpen,
}: {
  images: string[];
  city: string;
  onOpen: (index: number) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(images.length > 1);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setCanScroll(el.scrollWidth > el.clientWidth + 4);
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [images.length, updateEdges]);

  function scrollByCard(direction: 1 | -1) {
    const el = scroller.current;
    const card = el?.querySelector("button");
    if (!el || !card) return;
    el.scrollBy({ left: direction * (card.clientWidth + 16), behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={scroller}
        onScroll={updateEdges}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth"
        role="region"
        aria-roledescription="carousel"
        aria-label={`Photos from ${city}`}
      >
        {images.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => onOpen(index)}
            className="group relative aspect-[4/5] w-[78%] shrink-0 snap-start overflow-hidden brutalist-border text-left sm:w-[calc(50%-8px)] md:w-[calc(25%-12px)]"
          >
            <img
              src={src}
              alt={`Gathering at ${city}`}
              loading={index < 4 ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <span className="flex h-12 w-12 items-center justify-center border-2 border-white/30 bg-black/50 text-white">
                <span className="material-symbols-outlined">zoom_in</span>
              </span>
            </span>
          </button>
        ))}
      </div>
      {canScroll ? (
        <>
          <button
            type="button"
            aria-label="Previous photos"
            disabled={atStart}
            onClick={() => scrollByCard(-1)}
            className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border-2 border-on-background bg-background text-on-background disabled:opacity-40"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            type="button"
            aria-label="Next photos"
            disabled={atEnd}
            onClick={() => scrollByCard(1)}
            className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border-2 border-on-background bg-background text-on-background disabled:opacity-40"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </>
      ) : null}
    </div>
  );
}

function usablePhone(phone: string) {
  const national = phone.replace(/\D/g, "").replace(/^44/, "");
  if (!national || /^0+$/.test(national)) return "";
  return phone.trim();
}

function instagramHandle(value: string) {
  const trimmed = value.trim();
  const fromUrl = trimmed.match(/instagram\.com\/([^/?#]+)/i)?.[1];
  const handle = (fromUrl || trimmed).replace(/^@/, "").replace(/\/$/, "");
  if (!handle || /^https?:/i.test(handle)) return "";
  return `@${handle}`;
}

function instagramHref(value: string) {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://instagram.com/${trimmed.replace(/^@/, "")}`;
}

function BranchNotFound() {
  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <SiteHeader />
      <main className="pt-[74px] max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-24">
        <h1 className="font-display-lg text-headline-lg uppercase mb-4">
          We couldn&apos;t find that branch
        </h1>
        <Link
          href="/branches"
          className="inline-block bg-primary text-on-primary font-body-md text-[13px] font-bold uppercase tracking-wide px-6 py-4 brutalist-border brutalist-shadow"
        >
          Back to all branches
        </Link>
      </main>
      <ThemeToggle />
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

  const [zoomLevel, setZoomLevel] = useState(15);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
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

  useEffect(() => {
    if (galleryIndex === null) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setGalleryIndex(null);
      if (event.key === "ArrowRight") {
        setGalleryIndex((current) => (current === null ? 0 : (current + 1) % gallery.length));
      }
      if (event.key === "ArrowLeft") {
        setGalleryIndex((current) =>
          current === null ? 0 : (current - 1 + gallery.length) % gallery.length,
        );
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [galleryIndex, gallery.length]);

  const mapSrc = useMemo(
    () => (hasCoords(branch) ? osmEmbedUrlAtZoom(branch, zoomLevel) : mapsEmbedUrl(branch)),
    [branch, zoomLevel],
  );

  function sendBranchMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const to = branch.email;
    if (!to) {
      router.push("/contact");
      return;
    }
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || contactName).trim();
    const email = String(data.get("email") || contactEmail).trim();
    const phone = String(data.get("phone") || "").trim();
    const message = String(data.get("message") || contactMessage).trim();
    const subject = encodeURIComponent(`Message for ${branch.name}`);
    const phoneLine = phone ? `\nPhone: ${phone}` : "";
    const body = encodeURIComponent(`From: ${name}\nEmail: ${email}${phoneLine}\n\n${message}`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden">
      <SiteHeader />

      <main className="kp-branch-page pt-[74px]">
        {/* Hero */}
        <section className="kp-branch-hero relative flex w-full min-h-0 items-center justify-center px-4 pt-6 pb-8 sm:px-5 sm:pt-8 sm:pb-10 md:min-h-[32rem] md:px-8 lg:min-h-[65vh] max-w-[1536px] mx-auto">
          <div className="kp-branch-hero-fallback absolute inset-x-4 top-6 bottom-4 z-0 overflow-hidden brutalist-border sm:inset-x-5 sm:top-10 sm:bottom-8 md:inset-x-8">
            {branch.image ? (
              <img
                src={branch.image}
                alt=""
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <div
              className={`absolute inset-0 ${branch.image ? "bg-gradient-to-t from-black/80 via-black/35 to-black/25" : "bg-gradient-to-t from-[#12041f]/45 via-transparent to-transparent"}`}
            />
          </div>

          <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-3 pt-12 pb-8 text-center text-white sm:px-6 sm:pt-16 sm:pb-12">
            <div className="mb-8 flex flex-col items-center gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:justify-center">
              <div className="inline-flex max-w-full items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md border-2 border-white/30">
                <span className="material-symbols-outlined shrink-0 text-[18px] text-secondary-container">
                  location_on
                </span>
                <span className="font-body-md text-[12px] font-bold uppercase tracking-wider text-balance">
                  Kharis Phase 2 · {branch.city} Branch
                </span>
              </div>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setBranchDropdownOpen((open) => !open)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary font-body-md text-[12px] font-bold uppercase tracking-wider brutalist-border"
                >
                  <span>Switch branch</span>
                  <span
                    className={`material-symbols-outlined text-[18px] transition-transform ${branchDropdownOpen ? "rotate-180" : ""}`}
                  >
                    expand_more
                  </span>
                </button>

                {branchDropdownOpen ? (
                  <div className="absolute left-1/2 top-full z-50 mt-2 max-h-[70vh] w-64 -translate-x-1/2 overflow-auto bg-surface-container-lowest text-on-surface brutalist-border brutalist-shadow p-2">
                    <div className="mb-1 border-b-2 border-on-background/15 px-3 py-1.5 font-body-md text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                      Switch KP2 branch
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

            <h1 className="mb-5 font-display-lg text-[1.85rem] uppercase leading-[1.05] sm:mb-6 sm:text-5xl lg:text-6xl">
              Welcome to <span className="block text-secondary-container">{branch.name}</span>
            </h1>

            <p className="mb-8 max-w-2xl px-1 font-body-lg text-[0.95rem] leading-relaxed text-white/85 sm:mb-10 sm:text-lg">
              {branch.description}
            </p>

            <div className="kp-branch-actions">
              {nextVisit ? (
                <PlanVisitButton
                  item={nextVisit}
                  directionsUrl={directions}
                  className="flex items-center justify-center gap-2 bg-primary text-on-primary font-body-md text-[13px] font-bold uppercase tracking-wide px-7 py-3.5 brutalist-border brutalist-shadow"
                >
                  Plan your visit
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </PlanVisitButton>
              ) : directions ? (
                <a
                  href={directions}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-primary text-on-primary font-body-md text-[13px] font-bold uppercase tracking-wide px-7 py-3.5 brutalist-border brutalist-shadow"
                >
                  Plan your visit
                </a>
              ) : null}

              <a
                href="#events"
                className="flex items-center justify-center gap-2 border-2 border-white/40 bg-white/10 px-7 py-3.5 font-body-md text-[13px] font-bold uppercase tracking-wide text-white"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary-container">
                  event
                </span>
                Upcoming events
              </a>

              <Link
                href={giveHref}
                className="flex items-center justify-center gap-2 border-2 border-white/40 px-7 py-3.5 font-body-md text-[13px] font-bold uppercase tracking-wide text-white"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary-container">
                  favorite
                </span>
                Give
              </Link>

              <a
                href="#contact"
                className="flex items-center justify-center gap-2 bg-white text-on-background px-7 py-3.5 font-body-md text-[13px] font-bold uppercase tracking-wide brutalist-border"
              >
                <span className="material-symbols-outlined text-[18px]">mail</span>
                Contact Us
              </a>
            </div>
          </div>
        </section>

        <section
          className="px-margin-mobile md:px-margin-desktop max-w-[1536px] mx-auto py-10"
          aria-labelledby="branch-pastor-heading"
        >
          <div className="kp-pastor">
            <div className="kp-pastor__photo">
              {branch.pastorImage ? (
                <img
                  src={branch.pastorImage}
                  alt={branch.pastor === "Coming soon" ? "" : branch.pastor}
                  className="kp-pastor__portrait"
                />
              ) : (
                <span className="kp-branch-card__fallback">
                  <img src={BRANCH_MARK} alt="" />
                  <span>{branch.city || branch.name}</span>
                </span>
              )}
            </div>
            <div className="kp-pastor__words">
              <p className="kp-pastor__kicker">
                {branch.pastor === "Coming soon"
                  ? branch.city
                  : [branch.pastorRole || "Pastor", branch.city].filter(Boolean).join(" · ")}
              </p>
              <h2 id="branch-pastor-heading" className="kp-pastor__name">
                {branch.pastor === "Coming soon" ? branch.name : branch.pastor}
              </h2>
              <span className="kp-pastor__rule" aria-hidden="true" />
              <p className="kp-pastor__bio">
                {branch.pastor === "Coming soon"
                  ? `You are welcome at ${branch.name}. Come and gather with us in ${branch.city}.`
                  : branch.pastorBio}
              </p>
            </div>
          </div>
        </section>

        {/* Join us this Sunday */}
        <section
          id="services"
          className="py-16 px-margin-mobile md:px-margin-desktop max-w-[1536px] mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="font-display-lg text-headline-lg uppercase leading-none mb-4">
              Join us this Sunday
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
              We can&apos;t wait to host you. Choose a service time that works best for you and your
              family.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <div className="bg-surface-container-lowest brutalist-border brutalist-shadow p-6 sm:p-8 h-full flex flex-col justify-between">
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
                          className="flex items-start gap-4 p-4 border-2 border-on-background/15 bg-background"
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
                          className="flex items-start gap-4 p-4 border-2 border-secondary-container bg-secondary-container/20"
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

                <div className="kp-service-note mt-8 border-t-2 border-on-background/15 flex justify-between items-center gap-3 bg-background p-4">
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
              <div className="kp-branch-map bg-surface-container-lowest brutalist-border brutalist-shadow p-3">
                <div className="kp-branch-map__frame">
                  {mapSrc ? (
                    <iframe
                      title={`Map of ${branch.name}`}
                      src={mapSrc}
                      className="h-full w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : branch.image ? (
                    <img
                      src={branch.image}
                      alt={branch.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-surface-container" />
                  )}
                  {hasCoords(branch) ? (
                    <div className="kp-branch-map__zoom">
                      <button
                        type="button"
                        onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
                        className="w-10 h-10 bg-surface-container-lowest brutalist-border flex items-center justify-center"
                        aria-label="Zoom in"
                      >
                        <span className="material-symbols-outlined">add</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setZoomLevel((z) => Math.max(z - 1, 10))}
                        className="w-10 h-10 bg-surface-container-lowest brutalist-border flex items-center justify-center"
                        aria-label="Zoom out"
                      >
                        <span className="material-symbols-outlined">remove</span>
                      </button>
                    </div>
                  ) : null}
                </div>
                <div className="kp-branch-map__card bg-surface-container-lowest/95 backdrop-blur-md brutalist-border">
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
              </div>
            </div>
          </div>
        </section>

        {/* Watch */}
        <section
          id="watch"
          className="py-16 px-margin-mobile md:px-margin-desktop max-w-[1536px] mx-auto"
        >
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-1.5 border-2 border-on-background/20 bg-secondary-container text-on-secondary-container px-3.5 py-1 font-body-md text-[12px] font-bold uppercase mb-3">
              Watch
            </div>
            <h2 className="font-display-lg text-headline-lg uppercase leading-none">
              Latest from {branch.name}
            </h2>
          </div>

          <div className="relative overflow-hidden brutalist-border brutalist-shadow bg-on-background aspect-video">
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
            ) : branch.image ? (
              <Link href="/messages" className="group relative block h-full w-full">
                <img
                  src={branch.image}
                  alt={`Worship at ${branch.city}`}
                  className="h-full w-full object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                  <span className="flex h-20 w-20 items-center justify-center bg-primary text-on-primary brutalist-border">
                    <span className="material-symbols-outlined text-[40px]">play_arrow</span>
                  </span>
                  <span className="font-body-md text-[13px] font-bold uppercase tracking-wider text-white">
                    Watch on YouTube
                  </span>
                </div>
              </Link>
            ) : (
              <Link
                href="/messages"
                className="flex h-full w-full items-center justify-center font-body-md text-[13px] font-bold uppercase tracking-wider text-white"
              >
                Watch on YouTube
              </Link>
            )}
          </div>
        </section>

        {/* Gallery */}
        <section className="py-16 px-margin-mobile md:px-margin-desktop max-w-[1536px] mx-auto">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-1.5 border-2 border-on-background/20 bg-secondary-container text-on-secondary-container px-3.5 py-1 font-body-md text-[12px] font-bold uppercase mb-3">
              Life at KP2 {branch.city}
            </div>
            <h2 className="font-display-lg text-headline-lg uppercase leading-none">
              Moments from our family
            </h2>
          </div>
          {gallery.length ? (
            <GalleryCarousel images={gallery} city={branch.city} onOpen={setGalleryIndex} />
          ) : (
            <div className="kp-branch-empty">
              <span className="kp-branch-card__fallback">
                <img src={BRANCH_MARK} alt="" />
                <span>{branch.name}</span>
              </span>
            </div>
          )}
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
                className="bg-surface-container-lowest brutalist-border brutalist-shadow p-6 flex flex-col gap-3"
              >
                <p className="font-body-md text-[12px] font-bold uppercase tracking-wider text-primary">
                  {event.dayLabel} · {event.timeLabel}
                </p>
                <h3 className="font-display-lg text-[22px] uppercase leading-tight">
                  {event.title}
                </h3>
                <p className="font-body-md text-[13px] text-on-surface-variant">{event.location}</p>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
                  {event.blurb}
                </p>
                <PlanVisitButton
                  item={eventToCalendarItem(event)}
                  directionsUrl={mapsDirectionsUrl(event.location)}
                  className="mt-auto self-start bg-primary text-on-primary font-body-md text-[12px] font-bold uppercase tracking-wide px-5 py-3 brutalist-border"
                >
                  Plan your visit
                </PlanVisitButton>
              </div>
            ))}
            {campusEvents.length === 0 ? (
              <div className="md:col-span-2">
                <VisitInstead
                  title="Sunday is the gathering"
                  action={
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <Link
                        href="#services"
                        className="kp-depth-button kp-button-purple kp-empty-panel__cta !mt-0"
                      >
                        Sunday service
                      </Link>
                      <Link
                        href="/branches"
                        className="kp-depth-button kp-button-gold kp-empty-panel__cta !mt-0"
                      >
                        Find a branch
                      </Link>
                    </div>
                  }
                >
                  Nothing else is dated for {branch.city} yet. Come to Sunday service, or find
                  another branch.
                </VisitInstead>
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
                Contact this branch
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-md">
                Questions about {branch.city}, parking, or your first Sunday? Send a note and the
                team will get back to you.
              </p>
              <ul className="border-2 border-on-background bg-surface-container-lowest brutalist-shadow divide-y-2 divide-on-background/15">
                {usablePhone(branch.phone) ? (
                  <li>
                    <a
                      href={`tel:${usablePhone(branch.phone).replace(/\s/g, "")}`}
                      className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-secondary-container"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-on-background text-background">
                        <span className="material-symbols-outlined text-[22px]">phone</span>
                      </span>
                      <span className="min-w-0">
                        <span className="block font-body-md text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                          Phone
                        </span>
                        <span className="block font-body-md text-[16px]">
                          {usablePhone(branch.phone)}
                        </span>
                      </span>
                    </a>
                  </li>
                ) : null}
                {branch.email ? (
                  <li>
                    <a
                      href={`mailto:${branch.email}`}
                      className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-secondary-container"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-on-background text-background">
                        <span className="material-symbols-outlined text-[22px]">mail</span>
                      </span>
                      <span className="min-w-0">
                        <span className="block font-body-md text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                          Email
                        </span>
                        <span className="block truncate font-body-md text-[16px]">
                          {branch.email}
                        </span>
                      </span>
                    </a>
                  </li>
                ) : null}
                {instagramHandle(branch.instagram) ? (
                  <li>
                    <a
                      href={instagramHref(branch.instagram)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-secondary-container"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-on-background text-background">
                        <span className="material-symbols-outlined text-[22px]">photo_camera</span>
                      </span>
                      <span className="min-w-0">
                        <span className="block font-body-md text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                          Instagram
                        </span>
                        <span className="block truncate font-body-md text-[16px]">
                          {instagramHandle(branch.instagram)}
                        </span>
                      </span>
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
            <form
              onSubmit={sendBranchMessage}
              className="bg-surface-container-lowest brutalist-border brutalist-shadow p-6 sm:p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <label className="flex flex-col gap-2">
                  <span className="font-label-md uppercase">Your name</span>
                  <input
                    required
                    name="name"
                    autoComplete="name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="rounded-none brutalist-border p-4 font-body-md bg-background text-on-surface"
                    placeholder="Jane Doe"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="font-label-md uppercase">Email</span>
                  <input
                    required
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="rounded-none brutalist-border p-4 font-body-md bg-background text-on-surface"
                    placeholder="hello@example.com"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2">
                <span className="font-label-md uppercase">Phone</span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  className="rounded-none brutalist-border p-4 font-body-md bg-background text-on-surface"
                  placeholder="+44 20 0000 0000"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-label-md uppercase">Message</span>
                <textarea
                  required
                  name="message"
                  rows={5}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="rounded-none brutalist-border p-4 font-body-md bg-background text-on-surface resize-none"
                  placeholder={`How can the ${branch.city} team help?`}
                />
              </label>
              <button
                type="submit"
                className="bg-primary text-on-primary font-body-md text-[13px] font-bold uppercase tracking-wide px-8 py-4 brutalist-border brutalist-shadow"
              >
                Send message
              </button>
            </form>
          </div>
        </section>

        {/* Parking + transit */}
        <section className="py-16 bg-surface-container-low border-t-4 border-on-background">
          <div className="max-w-[1536px] mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container-lowest p-6 sm:p-8 brutalist-border brutalist-shadow space-y-3">
                <div className="w-12 h-12 bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined">local_parking</span>
                </div>
                <h3 className="font-display-lg text-[24px] uppercase">Parking information</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {branch.parkingInfo}
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 sm:p-8 brutalist-border brutalist-shadow space-y-3">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.slice(0, 3).map((item) => (
                <Link
                  key={item.slug}
                  href={`/branches/${item.slug}`}
                  className="group overflow-hidden brutalist-border brutalist-shadow bg-surface-container-lowest block"
                >
                  <div className="relative h-40 overflow-hidden bg-[#150934]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="kp-branch-card__fallback">
                        <img src={BRANCH_MARK} alt="" />
                        <span>{item.city || item.name}</span>
                      </span>
                    )}
                    {item.image ? (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    ) : null}
                    <span className="absolute left-3 top-3 z-10 bg-primary text-on-primary font-body-md text-[10px] font-bold uppercase tracking-wider px-3 py-1">
                      {item.region}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="font-display-lg text-[24px] uppercase leading-tight">
                      {item.city}
                    </p>
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
      <ThemeToggle />

      {galleryIndex !== null && gallery[galleryIndex] ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-on-background/80"
            aria-label="Close gallery"
            onClick={() => setGalleryIndex(null)}
          />
          {gallery.length > 1 ? (
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() =>
                setGalleryIndex((current) =>
                  current === null ? 0 : (current - 1 + gallery.length) % gallery.length,
                )
              }
              className="absolute left-4 z-20 flex h-12 w-12 items-center justify-center border-2 border-background bg-background text-on-background"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
          ) : null}
          <img
            src={gallery[galleryIndex]}
            alt={`Gathering at ${branch.city}`}
            className="relative z-10 max-h-[85vh] max-w-[90vw] object-contain brutalist-border"
          />
          {gallery.length > 1 ? (
            <button
              type="button"
              aria-label="Next photo"
              onClick={() =>
                setGalleryIndex((current) =>
                  current === null ? 0 : (current + 1) % gallery.length,
                )
              }
              className="absolute right-4 z-20 flex h-12 w-12 items-center justify-center border-2 border-background bg-background text-on-background"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default BranchPage;
export { BranchNotFound };
