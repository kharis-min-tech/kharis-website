"use client";
/* eslint-disable @next/next/no-img-element -- branch photos are shown as uploaded; the image optimizer softened them */

import React, { useState } from "react";
import Link from "next/link";
import SiteImage from "@/components/SiteImage";
import "./branch-page.css";
import {
  Clock,
  Navigation,
  ChevronRight,
  Plus,
  Minus,
  ArrowRight,
  Car,
  Train,
  Play,
} from "lucide-react";
import type { BranchData } from "@/lib/branches";
import { presentBranch } from "@/lib/branch-display";
import PlanVisitModal from "@/components/PlanVisitModal";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import BranchGallery from "@/components/branches/BranchGallery";
import BranchMonthCalendar from "@/components/branches/BranchMonthCalendar";
import BranchContactForm from "@/components/branches/BranchContactForm";
import BranchMediaModal from "@/components/branches/BranchMediaModal";

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

export function BranchTemplate({ branchData, extraSections }: BranchTemplateProps) {
  const currentBranch = branchData;
  const view = presentBranch(currentBranch);

  const sundayServices = (currentBranch.services ?? [])
    .filter((service) => service.is_active && service.type?.toLowerCase() === "sunday")
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const midweekServices = (currentBranch.services ?? [])
    .filter((service) => service.is_active && service.type?.toLowerCase() === "midweek")
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const galleryImages = view.gallery;

  const [zoomLevel, setZoomLevel] = useState(15);

  const lat = view.lat;
  const lng = view.lng;
  const span = (360 / Math.pow(2, zoomLevel)) * 4;
  const latSpan = span * 0.6;
  const mapEmbedSrc =
    lat != null && lng != null
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${(lng - span).toFixed(5)}%2C${(lat - latSpan).toFixed(5)}%2C${(lng + span).toFixed(5)}%2C${(lat + latSpan).toFixed(5)}&layer=mapnik&marker=${lat}%2C${lng}`
      : "";

  const [isPlanVisitOpen, setIsPlanVisitOpen] = useState(false);
  const [selectedEventRsvp, setSelectedEventRsvp] = useState<string | null>(null);
  const [mediaModal, setMediaModal] = useState<{
    type: "image" | "video";
    src?: string;
  } | null>(null);

  return (
    <div className="branch-page min-h-screen font-sans overflow-x-hidden flex flex-col text-white">
      <SiteHeader />

      {/* Main Content Area */}
      <main className="w-full">
        <section className="branch-intro" aria-labelledby="branch-title">
          <nav className="branch-intro__breadcrumb" aria-label="Breadcrumb">
            <Link href="/locations">All locations</Link>
            <span aria-hidden="true">/</span>
            <span>{view.city}</span>
          </nav>
          <div className="branch-intro__grid">
            <div className="branch-intro__copy">
              <p className="branch-intro__eyebrow">One family. Right here in {view.city}.</p>
              <h1 id="branch-title">
                <span>Welcome to</span>
                {currentBranch.name}
              </h1>
              <p className="branch-intro__description">{view.description}</p>
              <div className="branch-intro__actions">
                <button
                  type="button"
                  className="branch-action branch-action--primary k-cta"
                  onClick={() => setIsPlanVisitOpen(true)}
                >
                  Plan your visit <ArrowRight size={18} aria-hidden="true" />
                </button>
                <a href="#services" className="branch-action k-cta">
                  Times & directions <ArrowRight size={18} aria-hidden="true" />
                </a>
              </div>
              <p className="branch-intro__note">Come as you are. There’s a place for you here.</p>
            </div>
            <div className="branch-intro__visual">
              {view.hero ? (
                <SiteImage
                  src={view.hero}
                  alt={`Church family at ${currentBranch.name}`}
                  fill
                  priority
                  sizes="(max-width: 800px) 100vw, 52vw"
                  className="branch-intro__photo"
                />
              ) : (
                <div className="branch-intro__placeholder">
                  Many branches.
                  <br />
                  One family.
                </div>
              )}
              <div className="branch-intro__caption">
                <span>Kharis Church</span>
                <strong>{view.city}</strong>
              </div>
            </div>
          </div>
          <nav className="branch-section-nav" aria-label="Explore this branch">
            <a href="#services">Your Sunday</a>
            <a href="#pastor">Meet the pastor</a>
            <a href="#events">What’s on</a>
            <a href="#contact">Say hello</a>
          </nav>
        </section>

        {/* SERVICE TIMES & LOCATION BENTO GRID SECTION */}
        <section
          id="services"
          className="branch-services py-16 px-5 md:px-8 max-w-[1536px] mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Join Us This Sunday
            </h2>
            <p className="text-base font-medium text-gray-400 max-w-2xl mx-auto">
              We can&apos;t wait to host you. Choose a service time that works best for you and your
              family.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="branch-service-card bg-[#15131f] p-6 sm:p-8 border border-white/10 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                    <div className="w-12 h-12 bg-white/5 flex items-center justify-center text-[#e8a33d]">
                      <Clock className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white!">Service Times</h3>
                      <p className="text-xs font-semibold text-gray-400">
                        Sunday & Midweek Gathering
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {sundayServices.length === 0 ? (
                      <div className="flex items-start gap-4 p-4 bg-black/30 border border-white/10">
                        <div className="flex-shrink-0 w-20 text-center">
                          <span className="block text-2xl font-extrabold text-[#e8a33d] mb-0.5">
                            TBC
                          </span>
                        </div>
                        <div className="flex-grow pt-0.5">
                          <h4 className="text-sm font-bold text-white! mb-1">Sunday gathering</h4>
                          <p className="text-xs font-medium text-gray-300 leading-relaxed">
                            Service time will be confirmed soon.
                          </p>
                        </div>
                      </div>
                    ) : null}
                    {sundayServices.map((service, index) => (
                      <div
                        key={index}
                        onClick={() => setIsPlanVisitOpen(true)}
                        className="flex items-start gap-4 p-4 hover:bg-white/5 transition-colors group cursor-pointer border relative overflow-hidden bg-black/30 border-white/10"
                      >
                        <div className="flex-shrink-0 w-20 text-center">
                          <span className="block text-2xl font-extrabold text-[#e8a33d] mb-0.5">
                            {formatServiceTime(service.start_time)}
                          </span>
                          <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-wider bg-white/10 px-2 py-0.5"></span>
                        </div>

                        <div className="flex-grow pt-0.5">
                          <h4 className="text-sm font-bold text-white! mb-1 group-hover:text-[#e8a33d] transition-colors">
                            {service.name}
                          </h4>
                          <p className="text-xs font-medium text-gray-300 leading-relaxed">
                            {service.description || "Details will be added soon."}
                          </p>
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors pt-1" />
                      </div>
                    ))}

                    {midweekServices.length === 0 ? (
                      <div className="flex items-start gap-4 p-4 bg-black/30 border border-[#e8a33d]/30">
                        <div className="flex-shrink-0 w-20 text-center">
                          <span className="block text-2xl font-extrabold text-[#e8a33d] mb-0.5">
                            TBC
                          </span>
                        </div>
                        <div className="flex-grow pt-0.5">
                          <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#e8a33d] mb-1">
                            Midweek
                          </span>
                          <h4 className="text-sm font-bold text-white mb-1">Midweek gathering</h4>
                          <p className="text-xs font-medium text-gray-300 leading-relaxed">
                            Midweek details will be added soon.
                          </p>
                        </div>
                      </div>
                    ) : (
                      midweekServices.map((service) => (
                        <div
                          key={service.id}
                          onClick={() => setIsPlanVisitOpen(true)}
                          className="flex items-start gap-4 p-4 bg-black/30 border border-[#e8a33d]/30 hover:bg-white/5 transition-colors group cursor-pointer relative overflow-hidden"
                        >
                          <div className="flex-shrink-0 w-20 text-center">
                            <span className="block text-2xl font-extrabold text-[#e8a33d] mb-0.5">
                              {formatServiceTime(service.start_time) || "TBC"}
                            </span>
                          </div>
                          <div className="flex-grow pt-0.5">
                            <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#e8a33d] mb-1">
                              {service.day || "Midweek"} · Midweek
                            </span>
                            <h4 className="text-sm font-bold text-white mb-1 group-hover:text-[#e8a33d] transition-colors">
                              {service.name || "Midweek gathering"}
                            </h4>
                            <p className="text-xs font-medium text-gray-300 leading-relaxed">
                              {service.description || "Details will be added soon."}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors pt-1" />
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center bg-black/40 p-4">
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
                    Plan your visit
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="branch-map-card bg-[#15131f] p-3 border border-white/10 shadow-sm h-[500px] relative overflow-hidden group">
                <div className="absolute inset-3 overflow-hidden">
                  {mapEmbedSrc ? (
                    <iframe
                      title={`Map of ${currentBranch.name}`}
                      src={mapEmbedSrc}
                      className="h-full w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : view.hero ? (
                    <img
                      src={view.hero}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="h-full w-full bg-black" />
                  )}
                </div>

                <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
                  <div className="bg-[#15131f]/95 backdrop-blur-md p-4 max-w-xs pointer-events-auto shadow-lg border border-white/10 text-white">
                    <h4 className="font-bold text-sm text-white! mb-1">{currentBranch.name}</h4>
                    <p className="font-medium text-xs text-gray-300 mb-3 leading-snug">
                      {view.address}
                    </p>
                    {view.hasAddress ? (
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(view.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[#e8a33d] text-xs font-bold hover:underline"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Get Directions</span>
                      </a>
                    ) : null}
                  </div>

                  {mapEmbedSrc ? (
                    <div className="flex flex-col gap-2 pointer-events-auto">
                      <button
                        onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
                        className="w-10 h-10 bg-[#15131f]/90 backdrop-blur-md flex items-center justify-center text-white hover:text-[#e8a33d] transition-colors shadow-md border border-white/10 cursor-pointer"
                        aria-label="Zoom In"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setZoomLevel((z) => Math.max(z - 1, 10))}
                        className="w-10 h-10 bg-[#15131f]/90 backdrop-blur-md flex items-center justify-center text-white hover:text-[#e8a33d] transition-colors shadow-md border border-white/10 cursor-pointer"
                        aria-label="Zoom Out"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WELCOME / LEAD PASTOR SECTION */}
        <section id="pastor" className="branch-pastor py-16 bg-[#15131f] border-y border-white/10">
          <div className="max-w-[1536px] mx-auto px-5 md:px-8">
            <div
              className={`grid grid-cols-1 gap-10 lg:gap-14 items-center ${view.portrait ? "md:grid-cols-12" : ""}`}
            >
              {view.portrait ? (
                <div className="md:col-span-5 relative">
                  <div className="relative aspect-4/5 overflow-hidden border border-white/10 bg-black shadow-2xl">
                    <img
                      src={view.portrait}
                      alt={view.pastorKnown ? view.pastorName : "Branch pastor"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 border border-white/10 bg-[#0d0710] px-5 py-3 shadow-xl">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#e8a33d]">
                      {view.pastorRole}
                    </p>
                    <p className="text-sm font-bold text-white">{view.pastorName}</p>
                  </div>
                </div>
              ) : null}

              <div className={`${view.portrait ? "md:col-span-7" : ""} space-y-5`}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white!">
                  Welcome to <span className="branch-pastor__name">{currentBranch.name}</span>
                </h2>

                <p className="text-sm font-bold uppercase tracking-wider text-[#e8a33d]">
                  {view.pastorRole} {view.pastorKnown ? `· ${view.pastorName}` : ""}
                </p>

                <div className="space-y-4">
                  {view.welcome.map((para, i) => (
                    <p key={i} className="text-base font-medium leading-relaxed text-gray-300">
                      {para}
                    </p>
                  ))}
                </div>

                <blockquote className="my-2 border-l-4 border-[#d4920a] pl-4 text-base font-medium italic leading-relaxed text-white">
                  &ldquo;{view.quote}&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED MESSAGE / VIDEO SECTION */}
        <section id="watch" className="branch-watch py-16 px-5 md:px-8 max-w-[1536px] mx-auto">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-1.5 border border-white/10 bg-white/10 px-3.5 py-1 text-xs font-bold text-[#e8a33d] mb-3">
              <span>Watch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              This is {currentBranch.name}
            </h2>
          </div>

          <div className="relative overflow-hidden border border-white/10 bg-black shadow-2xl">
            <button
              type="button"
              onClick={() => setMediaModal({ type: "video" })}
              className="group relative block aspect-video w-full cursor-pointer text-left"
            >
              {view.hero ? (
                <img
                  src={view.hero}
                  alt={`Kharis ${view.city} worship`}
                  className="absolute inset-0 h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#630ed4] text-white shadow-2xl transition-transform duration-300 group-hover:scale-110">
                  <Play className="ml-1 h-8 w-8 fill-current" />
                </span>
                <span className="text-sm font-extrabold uppercase tracking-wider text-white">
                  Watch on YouTube
                </span>
              </div>
            </button>
          </div>
        </section>

        {/* GALLERY */}
        <BranchGallery
          images={galleryImages}
          city={view.city}
          onImageClick={(src) => setMediaModal({ type: "image", src })}
        />

        {/* MONTHLY EVENTS CALENDAR */}
        <BranchMonthCalendar
          branch={currentBranch}
          city={view.city}
          address={view.address}
          onRsvp={(title) => {
            setSelectedEventRsvp(title);
            setIsPlanVisitOpen(true);
          }}
        />

        {/* CONTACT BRANCH */}
        <BranchContactForm
          branch={{ name: currentBranch.name, city: view.city, fullAddress: view.address }}
        />

        {/* TRANSIT & PARKING INFO SECTION */}
        <section className="branch-travel py-16 bg-[#15131f] border-t border-white/10">
          <div className="max-w-[1536px] mx-auto px-5 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/40 p-6 sm:p-8 border border-white/10 shadow-sm space-y-3">
                <div className="w-12 h-12 bg-white/5 text-[#e8a33d] flex items-center justify-center">
                  <Car className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white!">Parking Information</h3>
                <p className="text-sm text-gray-300 font-medium leading-relaxed">{view.parking}</p>
              </div>

              <div className="bg-black/40 p-6 sm:p-8 border border-white/10 shadow-sm space-y-3">
                <div className="w-12 h-12 bg-white/5 text-[#e8a33d] flex items-center justify-center">
                  <Train className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white!">Public Transit</h3>
                <p className="text-sm text-gray-300 font-medium leading-relaxed">{view.transit}</p>
              </div>
            </div>
          </div>
        </section>

        {extraSections}
      </main>

      <SiteFooter tone="onLight" />

      <PlanVisitModal
        isOpen={isPlanVisitOpen}
        onClose={() => {
          setIsPlanVisitOpen(false);
          setSelectedEventRsvp(null);
        }}
        branchName={currentBranch.name}
        branchCity={view.city}
        eventLabel={selectedEventRsvp}
      />

      <BranchMediaModal
        type={mediaModal?.type ?? null}
        imageSrc={mediaModal?.src}
        city={view.city}
        onClose={() => setMediaModal(null)}
      />
    </div>
  );
}

export default BranchTemplate;
