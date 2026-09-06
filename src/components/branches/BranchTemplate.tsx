"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Clock,
  Calendar,
  Navigation,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  Heart,
  Car,
  Train,
  Phone,
  Mail,
  ChevronDown,
  Play,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { BranchData } from "@/lib/branches";
import { listBranches } from "@/lib/branches";
import { DEFAULT_GALLERY_IMAGES } from "@/data/branchesData";
import PlanVisitModal from "@/components/PlanVisitModal";
import GiveModal from "@/components/GiveModal";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import BranchGallery from "@/components/branches/BranchGallery";
import BranchMonthCalendar from "@/components/branches/BranchMonthCalendar";
import BranchContactForm from "@/components/branches/BranchContactForm";
import BranchMediaModal from "@/components/branches/BranchMediaModal";
import { BranchFallbackImage } from "@/components/branches/BranchFallbackImage";
import {
  FALLBACK_PASTOR_IMAGE,
  withBranchImage,
} from "@/lib/branch-images";

interface BranchTemplateProps {
  branchData: BranchData;
  branches?: BranchData[];
  onNavigateBranch?: (slug: string) => void;
  onNavigateDirectory?: () => void;
  /** Extra data-driven sections rendered before the footer. */
  extraSections?: React.ReactNode;
}

function formatServiceTime(time?: string | null) {
  if (!time) return "";

  const [hourString, minute] = time.split(":");
  const hour = Number(hourString);

  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute} ${ampm}`;
}

export function BranchTemplate({
  branchData,
  branches = [],
  onNavigateBranch,
  onNavigateDirectory,
  extraSections,
}: BranchTemplateProps) {
  const router = useRouter();
  const currentBranch = branchData;

  const sundayServices = (currentBranch.services ?? [])
    .filter(
      (service) =>
        service.is_active && service.type?.toLowerCase() === "sunday",
    )
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const midweekServices = (currentBranch.services ?? [])
    .filter(
      (service) =>
        service.is_active && service.type?.toLowerCase() === "midweek",
    )
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const welcomeParagraphs: string[] = currentBranch.welcomeParagraphs?.length
    ? currentBranch.welcomeParagraphs
    : [
        `I serve as the ${currentBranch.pastor_role.toLowerCase().includes("pastor") ? "pastor" : "lead"} of ${currentBranch.name}, part of the Kharis Church family. ${currentBranch.description}`,
        `${currentBranch.tagline} We love teaching the Word of God, and we long to see believers established in their faith and our city strengthened.`,
        `Whether you are visiting ${currentBranch.city} for a season or looking for a church to call home, there is a place for you here.`,
      ];

  const galleryImages: string[] = (
    currentBranch.galleryImages?.length
      ? currentBranch.galleryImages
      : DEFAULT_GALLERY_IMAGES
  ).map((src, i) => withBranchImage(src, `${currentBranch.slug}-gallery-${i}`));

  const [zoomLevel, setZoomLevel] = useState(15);

  const mainSundayService = sundayServices[0];

  const mainVenue =
    currentBranch.venues.find(
      (venue) => venue.id === mainSundayService?.venue_id,
    ) ?? currentBranch.venues[0];

  const lat = mainVenue?.latitude ?? 51.4543;
  const lng = mainVenue?.longitude ?? -0.9781;

  const city = mainVenue?.city ?? currentBranch.name.replace(/ Branch$/i, "");

  const fullAddress = [
    mainVenue?.name,
    mainVenue?.address_line1,
    mainVenue?.address_line2,
    mainVenue?.city,
    mainVenue?.postcode,
  ]
    .filter(Boolean)
    .join(", "); // OpenStreetMap embed: bbox size derived from the zoom level.
  const span = (360 / Math.pow(2, zoomLevel)) * 4;
  const latSpan = span * 0.6;
  const mapEmbedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${(lng - span).toFixed(5)}%2C${(lat - latSpan).toFixed(5)}%2C${(lng + span).toFixed(5)}%2C${(lat + latSpan).toFixed(5)}&layer=mapnik&marker=${lat}%2C${lng}`;

  const [isPlanVisitOpen, setIsPlanVisitOpen] = useState(false);
  const [isGiveOpen, setIsGiveOpen] = useState(false);
  const [selectedEventRsvp, setSelectedEventRsvp] = useState<string | null>(
    null,
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [mediaModal, setMediaModal] = useState<{
    type: "image" | "video";
    src?: string;
  } | null>(null);

  // useEffect(() => {
  //   document.documentElement.classList.add("branch-light");
  //   return () => document.documentElement.classList.remove("branch-light");
  // }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen font-sans text-[var(--page-fg)] overflow-x-hidden pt-[4.5rem] selection:bg-[#800654] selection:text-white flex flex-col bg-[var(--page-bg)] text-white">
      <SiteHeader tone="light" />

      {/* Main Content Area */}
      <main className="w-full">
        {/* HERO SECTION */}
        <section className="branch-hero relative flex w-full min-h-0 items-center justify-center px-4 pt-6 pb-8 sm:min-h-[65vh] sm:px-5 sm:pt-10 sm:pb-16 md:px-8 max-w-[1536px] mx-auto">
          <div className="absolute inset-x-4 top-6 bottom-4 z-0 overflow-hidden rounded-[1.75rem] border border-white/10 shadow-lg sm:inset-x-5 sm:top-10 sm:bottom-8 sm:rounded-3xl md:inset-x-8">
            <BranchFallbackImage
              src={currentBranch.hero_image_url}
              seed={currentBranch.slug}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-90 scale-105 transform hover:scale-100 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
          </div>

          <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-3 pt-12 pb-8 text-center text-white sm:px-6 sm:pt-16 sm:pb-12">
            <div className="mb-8 flex flex-col items-center gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm">
                <MapPin className="w-4 h-4 text-[#d4920a]" />
                <span className="font-semibold text-xs text-white uppercase tracking-wider">
                  Kharis Church UK • {currentBranch.city} Branch
                </span>
              </div>

              {/* Branch switcher */}
              <div className="relative">
                <button
                  onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#800654] border border-[#800654] font-semibold text-xs text-white uppercase tracking-wider shadow-sm transition-all hover:bg-[#5c033c] cursor-pointer"
                >
                  <span>Switch branch</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${branchDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {branchDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute left-1/2 top-full z-50 mt-2 max-h-[70vh] w-64 -translate-x-1/2 overflow-auto rounded-2xl border border-white/10 bg-[#15131f] p-2 shadow-2xl"
                    >
                      <div className="mb-1 border-b border-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Switch Kharis Branch
                      </div>
                      {branches.map((b) => (
                        <button
                          key={b.slug}
                          onClick={() => {
                            setBranchDropdownOpen(false);
                            if (onNavigateBranch) onNavigateBranch(b.slug);
                            else router.push(`/locations/${b.slug}`);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold transition-colors cursor-pointer ${
                            b.slug === currentBranch.slug
                              ? "bg-[#800654] text-white"
                              : "text-gray-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <span>{b.name}</span>
                          <span className="text-[10px] opacity-80">
                            {b.region}
                          </span>
                        </button>
                      ))}
                      <div className="mt-1 border-t border-white/10 pt-1.5">
                        <button
                          onClick={() => {
                            setBranchDropdownOpen(false);
                            if (onNavigateDirectory) onNavigateDirectory();
                            else router.push("/locations");
                          }}
                          className="w-full py-1.5 text-center text-xs font-extrabold text-[#e8a33d] hover:underline cursor-pointer"
                        >
                          View all branches →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <h1 className="mb-5 text-[1.85rem] font-extrabold leading-[1.18] tracking-tight text-white! sm:mb-6 sm:text-5xl md:text-6xl">
              Welcome to <br />
              <span className="bg-gradient-to-r from-[#e8a33d] via-[#d4920a] to-[#ffffff] bg-clip-text text-transparent">
                {currentBranch.name}
              </span>
            </h1>

            <p className="mb-8 max-w-2xl px-1 text-[0.95rem] font-medium leading-relaxed text-gray-300 sm:mb-10 sm:text-lg md:text-xl">
              {currentBranch.description}
            </p>

            <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row sm:gap-4">
              <button
                onClick={() => setIsPlanVisitOpen(true)}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#800654] px-7 py-3.5 text-sm font-extrabold text-white! shadow-xl shadow-[#800654]/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#5c033c] sm:px-8 sm:py-4"
              >
                <span>Plan Your Visit</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#events"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-extrabold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/20 sm:px-8 sm:py-4"
              >
                <Calendar className="w-4 h-4 text-[#e8a33d]" />
                <span>Upcoming Events</span>
              </a>

              <button
                onClick={() => setIsGiveOpen(true)}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/20 bg-transparent px-7 py-3.5 text-sm font-extrabold text-white transition-all duration-300 hover:bg-white/10 sm:px-8 sm:py-4"
              >
                <Heart className="w-4 h-4 text-[#e8a33d] fill-current" />
                <span>Give</span>
              </button>
            </div>
          </div>
        </section>

        {/* SERVICE TIMES & LOCATION BENTO GRID SECTION */}
        <section
          id="services"
          className="py-16 px-5 md:px-8 max-w-[1536px] mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Join Us This Sunday
            </h2>
            <p className="text-base font-medium text-fg-soft max-w-2xl mx-auto">
              We can't wait to host you. Choose a service time that works best
              for you and your family.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-[#15131f] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#e8a33d]">
                      <Clock className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white!">
                        Service Times
                      </h3>
                      <p className="text-xs font-semibold text-gray-400">
                        Sunday & Midweek Gathering
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {sundayServices.map((service, index) => (
                      <div
                        key={index}
                        onClick={() => setIsPlanVisitOpen(true)}
                        className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group cursor-pointer border relative overflow-hidden bg-black/30 border-white/10"
                      >
                        <div className="flex-shrink-0 w-20 text-center">
                          <span className="block text-2xl font-extrabold text-[#e8a33d] mb-0.5">
                            {formatServiceTime(service.start_time)}
                          </span>
                          <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full"></span>
                        </div>

                        <div className="flex-grow pt-0.5">
                          <h4 className="text-sm font-bold text-white! mb-1 group-hover:text-[#e8a33d] transition-colors">
                            {service.name}
                          </h4>
                          <p className="text-xs font-medium text-gray-300 leading-relaxed">
                            {service.description}
                          </p>
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors pt-1" />
                      </div>
                    ))}

                    {currentBranch.midweek && (
                      <div
                        onClick={() => setIsPlanVisitOpen(true)}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-black/30 border border-[#e8a33d]/30 hover:bg-white/5 transition-colors group cursor-pointer relative overflow-hidden"
                      >
                        <div className="flex-shrink-0 w-20 text-center">
                          <span className="block text-2xl font-extrabold text-[#e8a33d] mb-0.5">
                            {currentBranch.midweek.time}
                          </span>
                          <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full">
                            {currentBranch.midweek.ampm}
                          </span>
                        </div>
                        <div className="flex-grow pt-0.5">
                          <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#e8a33d] mb-1">
                            {currentBranch.midweek.day} · Midweek
                          </span>
                          <h4 className="text-sm font-bold text-white mb-1 group-hover:text-[#e8a33d] transition-colors">
                            {currentBranch.midweek.name}
                          </h4>
                          <p className="text-xs font-medium text-gray-300 leading-relaxed">
                            {currentBranch.midweek.description}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors pt-1" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center bg-black/40 p-4 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4920a] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#d4920a]"></span>
                    </span>
                    <span className="text-xs font-bold text-white">
                      Warm welcome team on hand when you arrive
                    </span>
                  </div>
                  <button
                    onClick={() => setIsPlanVisitOpen(true)}
                    className="text-[#e8a33d] hover:underline text-xs font-bold cursor-pointer"
                  >
                    Reserve Seats
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-[#15131f] rounded-3xl p-3 border border-white/10 shadow-sm h-[500px] relative overflow-hidden group">
                <div className="absolute inset-3 rounded-2xl overflow-hidden">
                  <iframe
                    title={`Map of ${currentBranch.name}`}
                    src={mapEmbedSrc}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
                  <div className="bg-[#15131f]/95 backdrop-blur-md p-4 rounded-2xl max-w-xs pointer-events-auto shadow-lg border border-white/10 text-white">
                    <h4 className="font-bold text-sm text-white! mb-1">
                      {currentBranch.name}
                    </h4>
                    <p className="font-medium text-xs text-gray-300 mb-3 leading-snug">
                      {currentBranch.fullAddress}
                    </p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(currentBranch.fullAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#e8a33d] text-xs font-bold hover:underline"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Get Directions</span>
                    </a>
                  </div>

                  <div className="flex flex-col gap-2 pointer-events-auto">
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
                      className="w-10 h-10 bg-[#15131f]/90 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:text-[#e8a33d] transition-colors shadow-md border border-white/10 cursor-pointer"
                      aria-label="Zoom In"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(z - 1, 10))}
                      className="w-10 h-10 bg-[#15131f]/90 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:text-[#e8a33d] transition-colors shadow-md border border-white/10 cursor-pointer"
                      aria-label="Zoom Out"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WELCOME / LEAD PASTOR SECTION */}
        <section
          id="pastor"
          className="py-16 bg-[#15131f] border-y border-white/10"
        >
          <div className="max-w-[1536px] mx-auto px-5 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="md:col-span-5 relative">
                <div className="absolute -left-3 -top-3 z-10 hidden h-14 w-14 items-center justify-center rounded-2xl bg-[#800654] text-white shadow-lg sm:flex">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="aspect-4/5 overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl">
                  <BranchFallbackImage
                    src={currentBranch.pastor_image_url}
                    fallback={FALLBACK_PASTOR_IMAGE}
                    alt={currentBranch.pastor_name ?? "Branch pastor"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 rounded-2xl border border-white/10 bg-[#0d0710] px-5 py-3 shadow-xl">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#e8a33d]">
                    {currentBranch.pastor_role}
                  </p>
                  <p className="text-sm font-bold text-white">
                    {currentBranch.pastor_name}
                  </p>
                </div>
              </div>

              <div className="md:col-span-7 space-y-5">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white!">
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-[#e8a33d] to-[#d4920a] bg-clip-text text-transparent">
                    {currentBranch.name}
                  </span>
                </h2>

                <p className="text-sm font-bold uppercase tracking-wider text-[#e8a33d]">
                  {currentBranch.pastor_role} {currentBranch.pastor_name}
                </p>

                <div className="space-y-4">
                  {welcomeParagraphs.map((para, i) => (
                    <p
                      key={i}
                      className="text-base font-medium leading-relaxed text-gray-300"
                    >
                      {para}
                    </p>
                  ))}
                </div>

                <blockquote className="my-2 border-l-4 border-[#d4920a] pl-4 text-base font-medium italic leading-relaxed text-white">
                  "{currentBranch.pastor_bio}"
                </blockquote>

                <div className="flex flex-wrap gap-3 pt-1 text-xs font-semibold text-gray-300">
                  <span className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 px-3 py-1.5">
                    <Phone className="h-4 w-4 text-[#e8a33d]" />
                    {currentBranch.contact_phone}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 px-3 py-1.5">
                    <Mail className="h-4 w-4 text-[#e8a33d]" />
                    {currentBranch.contact_email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED MESSAGE / VIDEO SECTION */}
        <section
          id="watch"
          className="py-16 px-5 md:px-8 max-w-[1536px] mx-auto"
        >
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3.5 py-1 text-xs font-bold text-[#e8a33d] mb-3">
              <span>Watch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Latest From {currentBranch.name}
            </h2>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl">
            <button
              type="button"
              onClick={() => setMediaModal({ type: "video" })}
              className="group relative block aspect-video w-full cursor-pointer text-left"
            >
              <BranchFallbackImage
                src={currentBranch.hero_image_url}
                seed={currentBranch.slug}
                alt={`Kharis ${city} worship`}
                className="h-full w-full object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#800654] text-white shadow-2xl transition-transform duration-300 group-hover:scale-110">
                  <Play className="ml-1 h-8 w-8 fill-current" />
                </span>
                <span className="text-sm font-extrabold uppercase tracking-wider text-white">
                  {currentBranch.videoId
                    ? "Watch Latest Message"
                    : "Watch on YouTube"}
                </span>
              </div>
            </button>
          </div>
        </section>

        {/* GALLERY */}
        <BranchGallery
          images={galleryImages}
          city={currentBranch.city}
          onImageClick={(src) => setMediaModal({ type: "image", src })}
        />

        {/* MONTHLY EVENTS CALENDAR */}
        <BranchMonthCalendar
          branch={currentBranch}
          onRsvp={(title) => {
            setSelectedEventRsvp(title);
            setIsPlanVisitOpen(true);
          }}
        />

        {/* CONTACT BRANCH */}
        <BranchContactForm branch={currentBranch} />

        {/* TRANSIT & PARKING INFO SECTION */}
        <section className="py-16 bg-[#15131f] border-t border-white/10">
          <div className="max-w-[1536px] mx-auto px-5 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/40 p-6 sm:p-8 rounded-3xl border border-white/10 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#e8a33d] flex items-center justify-center">
                  <Car className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white!">
                  Parking Information
                </h3>
                <p className="text-sm text-gray-300 font-medium leading-relaxed">
                  {currentBranch.parkingInfo}
                </p>
              </div>

              <div className="bg-black/40 p-6 sm:p-8 rounded-3xl border border-white/10 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#e8a33d] flex items-center justify-center">
                  <Train className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white!">Public Transit</h3>
                <p className="text-sm text-gray-300 font-medium leading-relaxed">
                  {currentBranch.transitInfo}
                </p>
              </div>
            </div>
          </div>
        </section>

        {extraSections}
      </main>

      <SiteFooter tone="onLight" />

      <PlanVisitModal
        isOpen={isPlanVisitOpen}
        onClose={() => setIsPlanVisitOpen(false)}
      />

      <GiveModal isOpen={isGiveOpen} onClose={() => setIsGiveOpen(false)} />

      <BranchMediaModal
        type={mediaModal?.type ?? null}
        imageSrc={mediaModal?.src}
        videoId={currentBranch.videoId}
        city={currentBranch.city}
        onClose={() => setMediaModal(null)}
      />
    </div>
  );
}

export default BranchTemplate;
