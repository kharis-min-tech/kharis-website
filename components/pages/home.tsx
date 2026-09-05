"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TestimonialCarousel, type Testimonial } from "@/components/TestimonialCarousel";
import { TestimonyFormModal } from "@/components/TestimonyFormModal";

function Index({ testimonials }: { testimonials: Testimonial[] }) {
  const [formOpen, setFormOpen] = useState(false);
  const openForm = useCallback(() => setFormOpen(true), []);
  const closeForm = useCallback(() => {
    setFormOpen(false);
    if (window.location.hash === "#share-testimony") {
      window.history.replaceState(
        {},
        "",
        window.location.pathname + window.location.search,
      );
    }
  }, []);

  useEffect(() => {
    const sync = () => {
      if (window.location.hash === "#share-testimony") setFormOpen(true);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <div className="bg-white text-gray-900 font-body-md overflow-x-hidden pt-[74px]">
      <SiteHeader />

      <header className="dark relative h-[calc(100svh-74px)] min-h-[540px] w-full flex flex-col overflow-hidden bg-[#151218]">
        <div className="absolute inset-0 grid grid-cols-2 md:flex md:flex-row w-full h-full z-0">
          <div className="relative col-span-2 md:flex-1 group overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-[#151218] halftone-bg text-[#d2bbff]/10">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-110 transition-transform duration-700"
              src="/assets/Choir-video.mp4"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151218] to-transparent opacity-80"></div>
          </div>

          <div className="relative md:flex-1 group overflow-hidden border-r-2 border-[#151218] halftone-bg text-[#deb7ff]/10">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-110 transition-transform duration-700"
              src="/assets/crowd.mp4"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151218] to-transparent opacity-80"></div>
          </div>

          <div className="relative md:flex-1 group overflow-hidden border-r-2 border-[#151218] halftone-bg text-[#f7be1d]/10">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-110 transition-transform duration-700"
              src="/assets/choir2.mp4"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151218] to-transparent opacity-80"></div>
          </div>

          <div className="relative hidden md:block md:flex-1 group overflow-hidden halftone-bg text-[#eaddff]/10">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-110 transition-transform duration-700"
              src="/assets/dancing.mp4"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151218] to-transparent opacity-80"></div>
          </div>
        </div>

        <div className="absolute inset-0 z-20 bg-[#151218]/55 md:bg-transparent"></div>

        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center pointer-events-none px-margin-mobile md:px-margin-desktop text-center mt-0 md:mt-[-10vh]">
          <div className="bg-[#f7be1d] px-4 sm:px-6 py-2 sm:py-3 mb-5 md:mb-8 pointer-events-auto shadow-[4px_4px_0px_0px_rgba(19,16,22,1)] border-2 border-[#151218] rotate-[-2deg] max-w-full">
            <span className="font-label-comic text-[11px] sm:text-label-comic text-[#3f2e00] uppercase tracking-widest">
              Your next chapter starts here.
            </span>
          </div>
          <h1 className="font-display-xl text-[44px] sm:text-[60px] md:text-display-xl text-[#e8e0e9] uppercase leading-none drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] z-30 mix-blend-exclusion">
            FAITH LOOKS <br /> DIFFERENT HERE.
          </h1>
          <p className="font-body-lg text-base sm:text-body-lg text-[#e8e0e9] mt-5 md:mt-6 max-w-2xl bg-[#151218]/40 backdrop-blur-md p-4 border border-[#958da1]/30 pointer-events-auto rounded">
            A spirit-filled, revival-seeking church. We are young people serving God with passion, gathering to
            encounter Jesus and live transformed lives.
          </p>
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 pointer-events-auto w-full sm:w-auto max-w-sm sm:max-w-none">
            <button className="bg-[#d2bbff] !text-black font-label-comic text-label-comic uppercase px-6 sm:px-8 py-4 brutalist-shadow border-2 border-[#151218] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
              FIND A BRANCH
            </button>
            <button className="bg-[#2c292f] text-[#e8e0e9] border-2 border-[#958da1] font-label-comic text-label-comic uppercase px-6 sm:px-8 py-4 hover:bg-[#37333a] transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">play_circle</span>
              WATCH THE EXPERIENCE
            </button>
          </div>
        </div>
      </header>
      <main className="relative z-20 overflow-hidden bg-white">
        <div className="halftone-bg absolute inset-0 pointer-events-none text-gray-200 opacity-50"></div>

        <section
          className="min-h-[100svh] md:h-[100svh] flex items-center px-margin-mobile md:px-margin-desktop relative z-10 overflow-hidden"
          style={{ paddingTop: "clamp(2rem, 5vh, 5rem)", paddingBottom: "clamp(2rem, 5vh, 5rem)" }}
        >
          <div
            className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-center"
            style={{ gap: "clamp(1.5rem, 4vw, 4rem)" }}
          >
            <div className="relative order-2 md:order-1">
              <div className="border-4 border-gray-900 brutalist-shadow overflow-hidden rotate-[-2deg] bg-gray-100">
                <img
                  alt="Worship moment at Kharis"
                  className="w-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
                  style={{ height: "clamp(180px, 46vh, 620px)" }}
                  src="/assets/pastor-stage.jpg"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div
                className="absolute -top-4 left-2 md:-top-6 md:-left-6 bg-[#f7be1d] border-2 border-gray-900 brutalist-shadow font-label-comic uppercase text-gray-900"
                style={{
                  padding: "clamp(0.5rem, 1.2vw, 1rem) clamp(0.9rem, 2vw, 1.5rem)",
                  fontSize: "clamp(0.7rem, 1.1vw, 1rem)",
                }}
              >
                Our DNA
              </div>
            </div>
            <div className="order-1 md:order-2 flex flex-col" style={{ gap: "clamp(0.9rem, 2.2vh, 2rem)" }}>
              <h2
                className="font-display-xl uppercase text-[#7c3aed] leading-[0.95]"
                style={{ fontSize: "clamp(2.25rem, 5.2vw, 5.5rem)" }}
              >
                WE ARE THE <br />
                PHASE 2 GENERATION
              </h2>
              <div
                className="bg-[#7c3aed]"
                style={{ width: "clamp(6rem, 12vw, 12rem)", height: "clamp(0.5rem, 0.9vw, 1rem)" }}
              ></div>
              <p
                className="font-body-lg text-gray-600 leading-relaxed max-w-2xl"
                style={{ fontSize: "clamp(1rem, 1.45vw, 1.6rem)" }}
              >
                At Kharis Phase 2 we desire to see young people throughout the UK living with a genuine passion for
                Jesus. Services are always dynamic, life-transforming and filled with the Word of God! We are a new
                breed of Christian who are excited about Jesus and not ashamed to show it.
              </p>
              <p
                className="font-body-lg text-gray-600 italic border-l-4 md:border-l-8 border-[#7c3aed] max-w-2xl"
                style={{ fontSize: "clamp(1rem, 1.45vw, 1.6rem)", paddingLeft: "clamp(1rem, 1.6vw, 1.75rem)" }}
              >
                "Transforming the culture by reflecting Christ"
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gray-50 relative overflow-hidden border-y-8 border-gray-900" id="departments">
          <div className="max-w-7xl mx-auto px-margin-desktop relative z-10">
            <p className="font-label-comic text-xs tracking-[0.2em] uppercase text-[#7c3aed] mb-3">Family</p>
            <h2 className="font-display-xl text-5xl md:text-7xl uppercase text-gray-900 leading-none">
              GET TO KNOW <span className="text-[#7c3aed]">KHARIS</span>
            </h2>
            <p className="font-body-lg text-body-lg text-gray-600 mt-4 mb-12">Everything you need, one tap away.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[220px]">
              <Link
                href="/mission"
                className="group relative min-h-[320px] md:min-h-0 md:row-span-2 overflow-hidden comic-border brutalist-shadow brutalist-shadow-hover transition-all bg-gray-900"
              >
                <img
                  alt="Our mandate: bringing Christ to people"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  src="/assets/mandate.png"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                  <p className="font-label-comic text-xs tracking-[0.2em] uppercase !text-white/80 mb-1">Who We Are</p>
                  <h3 className="font-headline-lg text-3xl md:text-4xl uppercase !text-white">About Us</h3>
                  <p className="font-body-md text-body-md !text-white/85 mt-2 max-w-sm">
                    Our mandate is to bring Christ to people everywhere.
                  </p>
                  <span className="inline-block mt-4 font-label-comic text-sm uppercase !text-[#f7be1d] group-hover:translate-x-2 transition-transform">
                    Explore →
                  </span>
                </div>
              </Link>

              <Link
                href="/life"
                className="group relative min-h-[220px] md:min-h-0 overflow-hidden comic-border brutalist-shadow brutalist-shadow-hover transition-all bg-gray-900"
              >
                <img
                  alt="Find a Kharis location"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  src="/assets/branch-slide-3.jpg"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="font-label-comic text-xs tracking-[0.2em] uppercase !text-white/80 mb-1">
                    Visit Sunday
                  </p>
                  <h3 className="font-headline-lg text-2xl md:text-3xl uppercase !text-white">Locations</h3>
                  <span className="inline-block mt-2 font-label-comic text-sm uppercase !text-[#f7be1d] group-hover:translate-x-2 transition-transform">
                    Explore →
                  </span>
                </div>
              </Link>

              <Link
                href="/fellowships"
                className="group relative min-h-[220px] md:min-h-0 overflow-hidden comic-border brutalist-shadow brutalist-shadow-hover transition-all bg-gray-900"
              >
                <img
                  alt="Young adults at Kharis"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  src="/assets/young-adults.jpg"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="font-label-comic text-xs tracking-[0.2em] uppercase !text-white/80 mb-1">KHARIS HOME</p>
                  <h3 className="font-headline-lg text-2xl md:text-3xl uppercase !text-white">Kharis Home</h3>
                  <span className="inline-block mt-2 font-label-comic text-sm uppercase !text-[#f7be1d] group-hover:translate-x-2 transition-transform">
                    Explore →
                  </span>
                </div>
              </Link>

              <Link
                href="/messages"
                className="group relative min-h-[220px] md:min-h-0 overflow-hidden comic-border brutalist-shadow brutalist-shadow-hover transition-all bg-gray-900"
              >
                <img
                  alt="Worship night"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  src="/assets/worship.jpg"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="font-label-comic text-xs tracking-[0.2em] uppercase !text-white/80 mb-1">Next Step</p>
                  <h3 className="font-headline-lg text-2xl md:text-3xl uppercase !text-white">Become a Believer</h3>
                  <span className="inline-block mt-2 font-label-comic text-sm uppercase !text-[#f7be1d] group-hover:translate-x-2 transition-transform">
                    Explore →
                  </span>
                </div>
              </Link>

              <Link
                href="/departments"
                className="group relative min-h-[220px] md:min-h-0 overflow-hidden comic-border brutalist-shadow brutalist-shadow-hover transition-all bg-gray-900"
              >
                <img
                  alt="Serve with us"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  src="/assets/serve-with-us.jpg"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="font-label-comic text-xs tracking-[0.2em] uppercase !text-white/80 mb-1">
                    Serve With Us
                  </p>
                  <h3 className="font-headline-lg text-2xl md:text-3xl uppercase !text-white">Get Involved</h3>
                  <span className="inline-block mt-2 font-label-comic text-sm uppercase !text-[#f7be1d] group-hover:translate-x-2 transition-transform">
                    Explore →
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section
          className="py-24 bg-[#7c3aed] dark:bg-[#151218] border-b-8 border-gray-900 relative overflow-hidden"
          id="pastor"
        >
          <div className="halftone-bg absolute inset-0 text-white opacity-20"></div>
          <div className="max-w-7xl mx-auto px-margin-desktop relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <span className="inline-block bg-[#f7be1d] text-gray-900 px-4 py-2 font-label-comic text-xs uppercase tracking-widest brutalist-shadow mb-6">
                  From the Pastor
                </span>
                <h2 className="font-display-xl text-5xl md:text-7xl text-white leading-none uppercase mb-6">
                  A WORD FROM <span className="text-[#f7be1d]">OUR HEAD PASTOR</span>
                </h2>
                <p className="font-body-lg text-body-lg text-gray-100 dark:text-[#ccc3d8] mb-8 max-w-lg">
                  "God is doing something new in this generation. Kharis Phase 2 is more than a church — it's a family
                  where young people encounter Jesus and discover their purpose."
                </p>
                <Link
                  href="/mission"
                  className="inline-flex items-center gap-2 bg-[#f7be1d] text-gray-900 px-10 py-4 font-label-comic text-lg border-4 border-gray-900 brutalist-shadow uppercase hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
                >
                  HEAR ABOUT US
                </Link>
              </div>
              <div className="order-1 md:order-2 relative">
                <div className="absolute -inset-4 bg-[#f7be1d] rounded-[2rem] rotate-3 opacity-30 blur-sm"></div>
                <img
                  alt="Pastor David Antwi, Head Pastor of Kharis Phase 2"
                  className="relative w-full aspect-[4/5] object-cover rounded-[2rem] shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500"
                  src="/assets/leadership-pastor-david.jpg"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="testimonies"
          className="py-16 sm:py-20 lg:py-24 bg-[#f0e6f8] dark:bg-[#151218] border-y-8 border-gray-900 relative overflow-hidden transition-colors duration-300"
        >
          <div className="halftone-bg text-[#7c3aed]/10 opacity-30 absolute inset-0 z-0"></div>
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
            <span className="font-label-comic text-xs tracking-[0.2em] text-[#7c3aed] dark:text-[#d2bbff] uppercase mb-3 block">
              FROM THE FAMILY
            </span>
            <h2 className="font-display-xl text-4xl sm:text-5xl lg:text-7xl uppercase text-gray-900 dark:text-[#e8e0e9] leading-none mb-10 sm:mb-12 lg:mb-16 transition-colors duration-300">
              REAL STORIES
            </h2>

            {testimonials.length > 0 ? (
              <TestimonialCarousel testimonials={testimonials} />
            ) : (
              <p className="font-body-lg text-gray-600 dark:text-[#ccc3d8] max-w-xl">
                Stories from the family will land here as people share what God is doing.
              </p>
            )}

            <div className="flex justify-center sm:justify-end mt-8">
              <button
                type="button"
                id="share-testimony"
                onClick={openForm}
                className="bg-[#7c3aed] !text-white font-label-comic text-label-comic uppercase px-8 py-4 brutalist-border brutalist-shadow"
              >
                Share Your Testimony
              </button>
            </div>

          </div>
        </section>

        <section
          className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#151218] border-y-8 border-gray-900 relative overflow-hidden transition-colors duration-300"
          id="media"
        >
          <div className="halftone-bg text-[#7c3aed]/10 opacity-30 absolute inset-0 z-0"></div>
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
            <span className="font-label-comic text-xs tracking-[0.2em] text-[#7c3aed] dark:text-[#d2bbff] uppercase mb-3 block">
              Teachings
            </span>
            <h2 className="font-display-xl text-4xl sm:text-5xl lg:text-7xl uppercase text-gray-900 dark:text-[#e8e0e9] leading-none mb-10 sm:mb-12 lg:mb-16 transition-colors duration-300">
              LATEST MESSAGES
            </h2>

            {/* Featured Latest Message — two-card layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter gap-6 lg:gap-8 mb-12 lg:mb-16">
              <div className="lg:col-span-8 bg-white dark:bg-[#1f1c24] comic-border brutalist-shadow overflow-hidden group transition-colors duration-300">
                <div className="aspect-video relative bg-black cursor-pointer">
                  <img
                    alt="Senior Pastor preaching the latest message"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    src="/assets/pastor-stage.jpg"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-[#f7be1d] p-6 rounded-full border-4 border-gray-900 brutalist-shadow group-hover:scale-110 transition-transform">
                      <span
                        className="material-symbols-outlined text-4xl leading-none text-gray-900"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        play_arrow
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <span className="bg-[#5c532b] text-white font-label-comic text-xs px-2 py-1 mb-2 inline-block border-2 border-gray-900">
                      NEWEST RELEASE
                    </span>
                    <h3 className="font-headline-lg text-white text-2xl uppercase">The Gravity of Grace</h3>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-[#f3f3fb] dark:bg-[#23202a] border-4 border-gray-900 brutalist-shadow p-6 sm:p-8 flex flex-col transition-colors duration-300">
                <h4 className="font-label-comic text-xs tracking-[0.2em] text-[#7c3aed] dark:text-[#d2bbff] mb-2 uppercase">
                  Now Playing
                </h4>
                <h3 className="font-headline-lg text-3xl uppercase text-gray-900 dark:text-[#e8e0e9] mb-4 transition-colors duration-300">
                  The Gravity of Grace
                </h3>
                <p className="font-body-md text-body-md text-gray-600 dark:text-[#ccc3d8] mb-6 transition-colors duration-300">
                  Dive deep into the transformative power of grace in our latest series. Understanding how grace anchors
                  us in turbulent times.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 font-label-comic text-xs uppercase tracking-wider text-gray-800 dark:text-[#ece6f0]">
                    <span className="material-symbols-outlined text-[#7c3aed] dark:text-[#d2bbff]">calendar_today</span>
                    <span>Sunday, Oct 27, 2024</span>
                  </div>
                  <div className="flex items-center gap-3 font-label-comic text-xs uppercase tracking-wider text-gray-800 dark:text-[#ece6f0]">
                    <span className="material-symbols-outlined text-[#7c3aed] dark:text-[#d2bbff]">person</span>
                    <span>Senior Pastor D. Antwi</span>
                  </div>
                </div>
                <div className="flex gap-4 mt-auto">
                  <button
                    type="button"
                    className="flex-1 bg-[#7c3aed] text-white font-label-comic text-sm uppercase px-4 py-3 border-4 border-gray-900 brutalist-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">share</span>
                    SHARE VIDEO
                  </button>
                </div>
              </div>
            </div>

            {/* Other messages — 2x2 grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
              <div className="bg-white dark:bg-[#1f1c24] comic-border brutalist-shadow hover:-translate-y-1 transition-transform overflow-hidden group cursor-pointer transition-colors duration-300">
                <div className="aspect-video relative overflow-hidden border-b-4 border-gray-900">
                  <img
                    alt="A Living Witness For Jesus"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    src="/assets/events-hero-worship.jpg"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gray-900/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined !text-white text-5xl">play_circle</span>
                  </div>
                </div>
                <p className="p-4 font-body-md text-sm text-gray-900 dark:text-[#e8e0e9] leading-snug transition-colors duration-300">
                  A Living Witness For Jesus | Acts 28:1-10
                </p>
              </div>

              <div className="bg-white dark:bg-[#1f1c24] comic-border brutalist-shadow hover:-translate-y-1 transition-transform overflow-hidden group cursor-pointer transition-colors duration-300">
                <div className="aspect-video relative overflow-hidden border-b-4 border-gray-900">
                  <img
                    alt="Riding On Divine Assignment"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    src="/assets/pastor-stage.jpg"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gray-900/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined !text-white text-5xl">play_circle</span>
                  </div>
                </div>
                <p className="p-4 font-body-md text-sm text-gray-900 dark:text-[#e8e0e9] leading-snug transition-colors duration-300">
                  He Is God Even In The Storm | Acts 27:13-25
                </p>
              </div>

              <div className="bg-white dark:bg-[#1f1c24] comic-border brutalist-shadow hover:-translate-y-1 transition-transform overflow-hidden group cursor-pointer transition-colors duration-300">
                <div className="aspect-video relative overflow-hidden border-b-4 border-gray-900">
                  <img
                    alt="The Light That Changes Everything"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    src="/assets/branch-slide-3.jpg"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gray-900/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined !text-white text-5xl">play_circle</span>
                  </div>
                </div>
                <p className="p-4 font-body-md text-sm text-gray-900 dark:text-[#e8e0e9] leading-snug transition-colors duration-300">
                  The LIGHT That Changes Everything | Acts 26
                </p>
              </div>

              <div className="bg-white dark:bg-[#1f1c24] comic-border brutalist-shadow hover:-translate-y-1 transition-transform overflow-hidden group cursor-pointer transition-colors duration-300">
                <div className="aspect-video relative overflow-hidden border-b-4 border-gray-900">
                  <img
                    alt="Inside The Church: Good Men and Actors"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    src="/assets/branch-slide-4.jpg"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gray-900/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined !text-white text-5xl">play_circle</span>
                  </div>
                </div>
                <p className="p-4 font-body-md text-sm text-gray-900 dark:text-[#e8e0e9] leading-snug transition-colors duration-300">
                  Inside The Church: Good Men &amp; Actors | Acts 4:34-5:11
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/media"
                className="bg-[#f7be1d] text-[#151218] px-6 sm:px-8 py-3 font-label-comic text-sm uppercase border-4 border-gray-900 brutalist-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
              >
                Watch More Messages
              </Link>
              <Link
                href="/messages"
                className="bg-[#1f1c24] text-[#e8e0e9] px-6 sm:px-8 py-3 font-label-comic text-sm uppercase border-4 border-gray-900 brutalist-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
              >
                Listen to Messages
              </Link>
            </div>
          </div>
        </section>

        <section
          className="py-16 sm:py-20 lg:py-24 bg-[#f0e6f8] dark:bg-[#1a1625] border-y-8 border-gray-900 relative overflow-hidden transition-colors duration-300"
          id="app"
        >
          <div className="halftone-bg text-[#7c3aed]/10 opacity-30 absolute inset-0 z-0"></div>
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <span className="font-label-comic text-xs tracking-[0.2em] text-[#7c3aed] dark:text-[#d2bbff] uppercase mb-3 block">
                Get The App
              </span>
              <h2 className="font-display-xl text-4xl sm:text-5xl lg:text-7xl uppercase text-gray-900 dark:text-[#e8e0e9] leading-none mb-6 transition-colors duration-300">
                Church in your pocket.
              </h2>
              <p className="font-body-lg text-body-lg text-gray-600 dark:text-[#ccc3d8] transition-colors duration-300">
                Download the Kharis app, then listen to any message in three simple steps — home, search, and play.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                <a
                  href="#app-stores"
                  className="bg-[#f7be1d] text-[#151218] px-6 sm:px-8 py-3 font-label-comic text-sm uppercase border-4 border-gray-900 brutalist-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all inline-flex items-center gap-2"
                >
                  Download the app
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </a>
                <Link
                  href="/messages"
                  className="bg-white dark:bg-[#2c2833] text-[#7c3aed] dark:text-[#d2bbff] px-6 sm:px-8 py-3 font-label-comic text-sm uppercase border-4 border-gray-900 brutalist-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
                >
                  Watch messages
                </Link>
              </div>
              <p className="font-body-md text-sm text-gray-500 dark:text-[#958da1] mt-4 transition-colors duration-300">
                Available on iPhone &amp; Android
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <div className="bg-white dark:bg-[#1f1c24] comic-border brutalist-shadow p-6 md:p-8 text-center transition-colors duration-300">
                <span className="font-label-comic text-xs tracking-[0.2em] text-[#7c3aed] dark:text-[#d2bbff] uppercase mb-3 block">
                  Step 1
                </span>
                <h3 className="font-headline-lg text-2xl md:text-3xl uppercase text-gray-900 dark:text-[#e8e0e9] mb-2 transition-colors duration-300">
                  Open the app home
                </h3>
                <p className="font-body-md text-gray-600 dark:text-[#ccc3d8] mb-6 transition-colors duration-300">
                  See latest audio, video and playlists.
                </p>
                <div className="relative mx-auto max-w-[260px]">
                  <img
                    alt="Kharis app home screen"
                    className="w-full h-auto rounded-2xl"
                    src="/assets/app-steps-step-1-messages.png"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-[#1f1c24] comic-border brutalist-shadow p-6 md:p-8 text-center transition-colors duration-300">
                <span className="font-label-comic text-xs tracking-[0.2em] text-[#7c3aed] dark:text-[#d2bbff] uppercase mb-3 block">
                  Step 2
                </span>
                <h3 className="font-headline-lg text-2xl md:text-3xl uppercase text-gray-900 dark:text-[#e8e0e9] mb-2 transition-colors duration-300">
                  Search any message
                </h3>
                <p className="font-body-md text-gray-600 dark:text-[#ccc3d8] mb-6 transition-colors duration-300">
                  Find the teaching you need in a tap.
                </p>
                <div className="relative mx-auto max-w-[260px]">
                  <img
                    alt="Kharis app search screen"
                    className="w-full h-auto rounded-2xl"
                    src="/assets/app-steps-step-2-browse.png"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-[#1f1c24] comic-border brutalist-shadow p-6 md:p-8 text-center transition-colors duration-300">
                <span className="font-label-comic text-xs tracking-[0.2em] text-[#7c3aed] dark:text-[#d2bbff] uppercase mb-3 block">
                  Step 3
                </span>
                <h3 className="font-headline-lg text-2xl md:text-3xl uppercase text-gray-900 dark:text-[#e8e0e9] mb-2 transition-colors duration-300">
                  Press play and go
                </h3>
                <p className="font-body-md text-gray-600 dark:text-[#ccc3d8] mb-6 transition-colors duration-300">
                  Listen anywhere you are.
                </p>
                <div className="relative mx-auto max-w-[260px]">
                  <img
                    alt="Kharis app player screen"
                    className="w-full h-auto rounded-2xl"
                    src="/assets/app-steps-step-3-player.png"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>

            <div id="app-stores" className="scroll-mt-28 flex flex-wrap items-center justify-center gap-4 mt-12 md:mt-16">
              <a
                href="https://apps.apple.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-white dark:bg-[#1f1c24] text-gray-900 dark:text-[#e8e0e9] px-5 py-3 comic-border brutalist-shadow hover:-translate-y-1 transition-transform"
              >
                <div className="w-10 h-10 bg-gray-900 dark:bg-[#e8e0e9] rounded-lg flex items-center justify-center text-white dark:text-gray-900">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.3 8.4c.5-.6 1-1.4 1-2.4 0-2.5-2-4.4-4.4-4.4-.6 0-1.2.1-1.7.4.2-.2.4-.5.4-.8 0-.5-.4-.9-.9-.9-.3 0-.5.1-.7.3C9.9.7 9 .6 8.2.6c-2.6 0-4.7 2-4.7 4.6 0 .4 0 .8.1 1.2C1.8 7.2 0 9.6 0 12.4c0 3.3 2.3 6 5.4 6.7-.3.5-.5 1-.5 1.6 0 1.3 1 2.3 2.3 2.3.6 0 1.1-.2 1.5-.6.4.4 1 .6 1.5.6 1.3 0 2.3-1 2.3-2.3 0-.3 0-.6-.1-.8 2.7-.7 4.7-3.1 4.7-6 0-2.6-1.6-4.8-3.9-5.8.5-.2 1-.3 1.6-.3.3 0 .5 0 .8-.1-.2.3-.3.6-.3 1 0 .5.2 1 .5 1.3zm-3.3-4.9c1.4 0 2.6 1.2 2.6 2.6 0 .4-.1.8-.3 1.1-1-.6-2.2-1-3.5-1.1-.3-1-.9-1.9-1.7-2.5.3-.1.6-.1 1-.1z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-body-md text-[10px] uppercase leading-none text-gray-500 dark:text-[#958da1]">
                    App Store
                  </p>
                  <p className="font-headline-lg text-base leading-tight">Download for iPhone</p>
                </div>
              </a>
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-white dark:bg-[#1f1c24] text-gray-900 dark:text-[#e8e0e9] px-5 py-3 comic-border brutalist-shadow hover:-translate-y-1 transition-transform"
              >
                <div className="w-10 h-10 bg-[#7c3aed] rounded-lg flex items-center justify-center text-white">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.4154.4154 0 00-.5676.1521l-2.0225 3.503C15.5902 8.4799 13.8533 8.135 12 8.135c-1.8536 0-3.5906.3449-5.1371.9575L4.8404 5.5893a.4154.4154 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589.3432 18.6627h23.3136c0-4.0038-2.3457-7.476-5.7746-9.3413" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-body-md text-[10px] uppercase leading-none text-gray-500 dark:text-[#958da1]">
                    Google Play
                  </p>
                  <p className="font-headline-lg text-base leading-tight">Download for Android</p>
                </div>
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="relative overflow-hidden rounded-none border-4 border-gray-900 brutalist-shadow bg-gradient-to-br from-[#7c3aed] via-[#9333ea] to-[#be185d] px-6 py-14 sm:px-12 sm:py-20 lg:px-20 lg:py-24 text-center">
              {/* Decorative circles */}
              <div className="absolute top-[-60px] left-[-40px] w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
              <div className="absolute bottom-[-80px] right-[-20px] w-56 h-56 rounded-full bg-[#f7be1d]/20 blur-3xl"></div>
              <div className="absolute top-1/2 left-[10%] w-4 h-4 rounded-full bg-white/60"></div>
              <div className="absolute bottom-[20%] right-[15%] w-3 h-3 rounded-full bg-[#f7be1d]"></div>
              <div className="absolute top-[20%] right-[20%] w-24 h-24 rounded-full border-2 border-white/20"></div>
              <div className="absolute bottom-[30%] left-[15%] w-20 h-20 rounded-full border-2 border-white/10"></div>

              <span className="relative z-10 font-label-comic text-xs tracking-[0.2em] text-white/80 uppercase mb-4 block">
                Still Deciding?
              </span>
              <h2 className="relative z-10 font-display-xl text-4xl sm:text-5xl lg:text-7xl text-white uppercase leading-none mb-6">
                Can't decide which
                <br className="hidden sm:block" /> branch to come to?
              </h2>
              <p className="relative z-10 font-body-lg text-body-lg text-white/90 max-w-2xl mx-auto mb-10">
                You don't have to figure it out alone. Reach out and we'll help you find a Kharis family near you, or
                guide you to your first Sunday.
              </p>
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-white text-[#7c3aed] px-8 py-4 rounded-none font-label-comic text-sm uppercase tracking-wide border-2 border-gray-900 brutalist-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all min-w-[180px]"
                >
                  Contact Us
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-transparent text-white px-8 py-4 rounded-none font-label-comic text-sm uppercase tracking-wide border-2 border-white hover:bg-white/10 transition-colors min-w-[180px]"
                >
                  Find a Branch
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      <TestimonyFormModal open={formOpen} onClose={closeForm} />
      <ThemeToggle />
    </div>
  );
}

export default Index;
