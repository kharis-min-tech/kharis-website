"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { TestimonialCarousel, type Testimonial } from "@/components/TestimonialCarousel";
import { TestimonyFormModal } from "@/components/TestimonyFormModal";
import { YoutubeEmbed } from "@/components/YoutubeEmbed";
import { ShareVideoButton } from "@/components/ShareVideoButton";
import { LotGallery } from "@/components/LotGallery";
import type { InstagramPost } from "@/lib/instagram";
import {
  displayMessageTitle,
  formatMessageDate,
  youtubeWatchUrl,
  type MessageVideo,
} from "@/lib/youtube";

function Index({
  testimonials,
  messages,
  instagram,
}: {
  testimonials: Testimonial[];
  messages: MessageVideo[];
  instagram: InstagramPost[];
}) {
  const featured = messages[0];
  const others = messages.slice(1, 5);
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
    <div className="bg-background text-on-surface font-body-md pt-[74px]">
      <SiteHeader />

      <header className="relative min-h-[calc(100svh-74px)] w-full overflow-hidden bg-[#06070a] text-white">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-55"
          src="/assets/dancing.mp4"
        />
        <div className="vibe-mesh absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-[#06070a]/55 to-[#06070a]/25" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-74px)] max-w-7xl flex-col justify-end px-margin-mobile pb-10 pt-10 md:justify-center md:px-margin-desktop md:pb-16">
          <div className="max-w-3xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber/50 bg-amber/15 px-4 py-1.5 font-label-md text-[11px] uppercase tracking-[0.22em] text-amber">
              Your next chapter starts here
            </span>
            <h1 className="font-display-xl text-[42px] leading-[0.9] uppercase sm:text-[60px] md:text-display-xl">
              Faith looks{" "}
              <span className="bg-gradient-to-r from-amber via-magenta to-[#d2bbff] bg-clip-text text-transparent">
                different here.
              </span>
            </h1>
            <p className="mt-5 max-w-xl font-body-lg text-[15px] leading-relaxed text-white/80 sm:text-body-lg md:mt-6">
              A spirit-filled, revival-seeking church. Young people serving God with passion —
              loud worship, real community, lives changed.
            </p>
            <div className="mt-7 flex w-full max-w-md flex-col gap-3 sm:mt-8 sm:max-w-none sm:flex-row">
              <Link
                href="/branches"
                className="rounded-2xl bg-amber px-6 py-4 text-center font-label-comic text-[13px] uppercase tracking-wide text-[#1a0b00] vibe-glow sm:px-8"
              >
                Find a branch
              </Link>
              <a
                href="#the-lot"
                className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-center font-label-comic text-[13px] uppercase tracking-wide text-white backdrop-blur-md sm:px-8"
              >
                See the lot
              </a>
            </div>
            <div className="mt-8 flex items-center">
              {["/assets/K-dancers-img.jpg", "/assets/young-adults.jpg", "/assets/praise-night.jpg", "/assets/community.jpg"].map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="h-12 w-12 rounded-full border-2 border-[#06070a] object-cover grayscale sm:h-14 sm:w-14"
                  style={{ marginLeft: i === 0 ? 0 : -12 }}
                />
              ))}
              <span className="ml-3 font-label-md text-[11px] uppercase tracking-widest text-white/70">
                The lot. Live.
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="relative z-20 bg-background">

        <section
          className="flex min-h-[100svh] items-center px-margin-mobile md:px-margin-desktop relative z-10 pt-28 md:pt-24"
          style={{ paddingBottom: "clamp(2rem, 5vh, 5rem)" }}
        >
          <div
            className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-center"
            style={{ gap: "clamp(1.5rem, 4vw, 4rem)" }}
          >
            <div className="relative order-2 md:order-1">
              <div className="vibe-card overflow-hidden rotate-[-1deg]">
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
                className="absolute -top-4 left-2 md:-top-6 md:-left-6 bg-amber text-[#1a0b00] rounded-full font-label-comic uppercase"
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
                className="font-display-xl uppercase text-primary leading-[0.95]"
                style={{ fontSize: "clamp(2.25rem, 5.2vw, 5.5rem)" }}
              >
                WE ARE THE <br />
                PHASE 2 GENERATION
              </h2>
              <div
                className="rounded-full bg-amber"
                style={{ width: "clamp(6rem, 12vw, 12rem)", height: "clamp(0.5rem, 0.9vw, 1rem)" }}
              ></div>
              <p
                className="font-body-lg text-on-surface-variant leading-relaxed max-w-2xl"
                style={{ fontSize: "clamp(1rem, 1.45vw, 1.6rem)" }}
              >
                At Kharis Phase 2 we desire to see young people throughout the UK living with a genuine passion for
                Jesus. Services are always dynamic, life-transforming and filled with the Word of God! We are a new
                breed of Christian who are excited about Jesus and not ashamed to show it.
              </p>
              <p
                className="font-body-lg text-on-surface-variant italic border-l-4 border-amber max-w-2xl"
                style={{ fontSize: "clamp(1rem, 1.45vw, 1.6rem)", paddingLeft: "clamp(1rem, 1.6vw, 1.75rem)" }}
              >
                "Transforming the culture by reflecting Christ"
              </p>
            </div>
          </div>
        </section>

        <LotGallery instagram={instagram} />

        <section className="py-24 bg-surface-container relative overflow-hidden" id="departments">
          <div className="max-w-7xl mx-auto px-margin-desktop relative z-10">
            <p className="font-label-comic text-xs tracking-[0.2em] uppercase text-primary mb-3">Family</p>
            <h2 className="font-display-xl text-5xl md:text-7xl uppercase text-on-surface leading-none">
              GET TO KNOW <span className="text-primary">KHARIS</span>
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 mb-12">Everything you need, one tap away.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[220px]">
              <Link
                href="/mission"
                className="group relative min-h-[320px] md:min-h-0 md:row-span-2 overflow-hidden vibe-card bg-surface-container-lowest"
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
                  <span className="inline-block mt-4 font-label-comic text-sm uppercase !text-amber group-hover:translate-x-2 transition-transform">
                    Explore →
                  </span>
                </div>
              </Link>

              <Link
                href="/life"
                className="group relative min-h-[220px] md:min-h-0 overflow-hidden vibe-card bg-surface-container-lowest"
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
                  <span className="inline-block mt-2 font-label-comic text-sm uppercase !text-amber group-hover:translate-x-2 transition-transform">
                    Explore →
                  </span>
                </div>
              </Link>

              <Link
                href="/fellowships"
                className="group relative min-h-[220px] md:min-h-0 overflow-hidden vibe-card bg-surface-container-lowest"
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
                  <span className="inline-block mt-2 font-label-comic text-sm uppercase !text-amber group-hover:translate-x-2 transition-transform">
                    Explore →
                  </span>
                </div>
              </Link>

              <Link
                href="/messages"
                className="group relative min-h-[220px] md:min-h-0 overflow-hidden vibe-card bg-surface-container-lowest"
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
                  <span className="inline-block mt-2 font-label-comic text-sm uppercase !text-amber group-hover:translate-x-2 transition-transform">
                    Explore →
                  </span>
                </div>
              </Link>

              <Link
                href="/departments"
                className="group relative min-h-[220px] md:min-h-0 overflow-hidden vibe-card bg-surface-container-lowest"
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
                  <span className="inline-block mt-2 font-label-comic text-sm uppercase !text-amber group-hover:translate-x-2 transition-transform">
                    Explore →
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section
          className="py-24 bg-[#06070a] text-white relative overflow-hidden"
          id="pastor"
        >
          <div className="vibe-mesh absolute inset-0"></div>
          <div className="max-w-7xl mx-auto px-margin-desktop relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <span className="inline-block rounded-full bg-amber text-[#1a0b00] px-4 py-2 font-label-comic text-xs uppercase tracking-widest mb-6">
                  From the Pastor
                </span>
                <h2 className="font-display-xl text-5xl md:text-7xl text-white leading-none uppercase mb-6">
                  A WORD FROM <span className="text-amber">OUR HEAD PASTOR</span>
                </h2>
                <p className="font-body-lg text-body-lg text-white/80 mb-8 max-w-lg">
                  "God is doing something new in this generation. Kharis Phase 2 is more than a church — it's a family
                  where young people encounter Jesus and discover their purpose."
                </p>
                <Link
                  href="/mission"
                  className="inline-flex items-center gap-2 rounded-2xl bg-amber text-[#1a0b00] px-10 py-4 font-label-comic text-lg uppercase vibe-glow"
                >
                  HEAR ABOUT US
                </Link>
              </div>
              <div className="order-1 md:order-2 relative">
                <div className="absolute -inset-4 bg-amber rounded-[2rem] opacity-30 blur-sm"></div>
                <img
                  alt="Pastor David Antwi, Head Pastor of Kharis Phase 2"
                  className="relative w-full aspect-[4/5] object-cover rounded-[2rem] vibe-card"
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
          className="relative overflow-hidden bg-[#06070a] py-16 text-white sm:py-20 lg:py-24"
        >
          <div className="vibe-mesh pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-magenta/25 blur-3xl" />
            <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-cobalt/25 blur-3xl" />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop">
            <span className="mb-6 inline-block rounded-full bg-amber px-4 py-1 font-label-comic text-xs uppercase tracking-[0.2em] text-[#1a0b00]">
              From the family
            </span>
            <h2 className="mb-10 font-display-xl text-4xl uppercase leading-none text-white sm:mb-12 sm:text-5xl lg:mb-16 lg:text-7xl">
              Real stories
            </h2>

            {testimonials.length > 0 ? (
              <TestimonialCarousel testimonials={testimonials} />
            ) : (
              <p className="max-w-xl font-body-lg text-white/70">
                Stories from the family will land here as people share what God is doing.
              </p>
            )}

            <div className="mt-8 flex justify-center sm:justify-end">
              <button
                type="button"
                id="share-testimony"
                data-ui="open-dialog"
                data-dialog="testimony-form-dialog"
                onClick={openForm}
                className="rounded-2xl bg-amber px-8 py-4 font-label-comic text-label-comic uppercase text-[#1a0b00] vibe-glow"
              >
                Share Your Testimony
              </button>
            </div>
          </div>
        </section>

        <section
          className="py-16 sm:py-20 lg:py-24 bg-background relative overflow-hidden"
          id="media"
        >
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
            <span className="font-label-comic text-xs tracking-[0.2em] text-primary uppercase mb-3 block">
              Teachings
            </span>
            <h2 className="font-display-xl text-4xl sm:text-5xl lg:text-7xl uppercase text-on-surface leading-none mb-10 sm:mb-12 lg:mb-16">
              LATEST MESSAGES
            </h2>

            {featured ? (
              <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter gap-6 lg:gap-8 mb-12 lg:mb-16">
              <div className="lg:col-span-8 bg-surface-container-lowest vibe-card overflow-hidden group">
                <div className="aspect-video relative bg-black">
                  <YoutubeEmbed id={featured.id} title={featured.title} thumbnail={featured.thumbnail} />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pointer-events-none">
                    <span className="rounded-full bg-amber text-[#1a0b00] font-label-comic text-xs px-3 py-1 mb-2 inline-block">
                      NEWEST RELEASE
                    </span>
                    <h3 className="font-headline-lg text-white text-2xl uppercase">
                      {displayMessageTitle(featured.title)}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 rounded-3xl bg-surface-container vibe-card p-6 sm:p-8 flex flex-col">
                <h4 className="font-label-comic text-xs tracking-[0.2em] text-primary mb-2 uppercase">
                  Now Playing
                </h4>
                <h3 className="font-headline-lg text-3xl uppercase text-on-surface mb-4">
                  {displayMessageTitle(featured.title)}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  The latest teaching from Pastor David Antwi on YouTube.
                </p>
                <div className="space-y-3 mb-6">
                  {featured.publishedAt ? (
                    <div className="flex items-center gap-3 font-label-comic text-xs uppercase tracking-wider text-on-surface">
                      <span className="material-symbols-outlined text-amber">calendar_today</span>
                      <span>{formatMessageDate(featured.publishedAt)}</span>
                    </div>
                  ) : null}
                  <div className="flex items-center gap-3 font-label-comic text-xs uppercase tracking-wider text-on-surface">
                    <span className="material-symbols-outlined text-amber">person</span>
                    <span>Pastor David Antwi</span>
                  </div>
                </div>
                <div className="flex gap-4 mt-auto">
                  <ShareVideoButton
                    id={featured.id}
                    title={featured.title}
                    className="flex-1 rounded-2xl bg-primary text-on-primary font-label-comic text-sm uppercase px-4 py-3 vibe-glow flex items-center justify-center gap-2"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
              {others.map((msg) => (
                <a
                  key={msg.id}
                  href={youtubeWatchUrl(msg.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-surface-container-lowest vibe-card hover:-translate-y-1 transition-transform overflow-hidden group"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      src={msg.thumbnail}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gray-900/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined !text-white text-5xl">play_circle</span>
                    </div>
                  </div>
                  <p className="p-4 font-body-md text-sm text-on-surface leading-snug">
                    {displayMessageTitle(msg.title)}
                  </p>
                </a>
              ))}
            </div>
              </>
            ) : (
              <p className="font-body-lg text-on-surface-variant max-w-xl mb-10">
                New teachings will land here as they go live on YouTube.
              </p>
            )}

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/messages"
                className="rounded-2xl bg-amber text-[#1a0b00] px-6 sm:px-8 py-3 font-label-comic text-sm uppercase vibe-glow"
              >
                Watch More Messages
              </Link>
              <a
                href="https://youtube.com/@davidantwi"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-on-background/15 bg-surface-container-highest text-on-surface px-6 sm:px-8 py-3 font-label-comic text-sm uppercase"
              >
                Watch on YouTube
              </a>
            </div>
          </div>
        </section>

        <section
          className="py-16 sm:py-20 lg:py-24 bg-surface-container relative overflow-hidden"
          id="app"
        >
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <span className="font-label-comic text-xs tracking-[0.2em] text-primary uppercase mb-3 block">
                Get The App
              </span>
              <h2 className="font-display-xl text-4xl sm:text-5xl lg:text-7xl uppercase text-on-surface leading-none mb-6">
                Church in your pocket.
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Download the Kharis app, then listen to any message in three simple steps — home, search, and play.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                <a
                  href="#app-stores"
                  className="rounded-2xl bg-amber text-[#1a0b00] px-6 sm:px-8 py-3 font-label-comic text-sm uppercase vibe-glow inline-flex items-center gap-2"
                >
                  Download the app
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </a>
                <Link
                  href="/messages"
                  className="rounded-2xl border border-on-background/15 bg-surface-container-lowest text-primary px-6 sm:px-8 py-3 font-label-comic text-sm uppercase"
                >
                  Watch messages
                </Link>
              </div>
              <p className="font-body-md text-sm text-on-surface-variant mt-4">
                Available on iPhone &amp; Android
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <div className="bg-surface-container-lowest vibe-card p-6 md:p-8 text-center">
                <span className="font-label-comic text-xs tracking-[0.2em] text-primary uppercase mb-3 block">
                  Step 1
                </span>
                <h3 className="font-headline-lg text-2xl md:text-3xl uppercase text-on-surface mb-2">
                  Open the app home
                </h3>
                <p className="font-body-md text-on-surface-variant mb-6">
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

              <div className="bg-surface-container-lowest vibe-card p-6 md:p-8 text-center">
                <span className="font-label-comic text-xs tracking-[0.2em] text-primary uppercase mb-3 block">
                  Step 2
                </span>
                <h3 className="font-headline-lg text-2xl md:text-3xl uppercase text-on-surface mb-2">
                  Search any message
                </h3>
                <p className="font-body-md text-on-surface-variant mb-6">
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

              <div className="bg-surface-container-lowest vibe-card p-6 md:p-8 text-center">
                <span className="font-label-comic text-xs tracking-[0.2em] text-primary uppercase mb-3 block">
                  Step 3
                </span>
                <h3 className="font-headline-lg text-2xl md:text-3xl uppercase text-on-surface mb-2">
                  Press play and go
                </h3>
                <p className="font-body-md text-on-surface-variant mb-6">
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
                className="inline-flex items-center gap-3 rounded-2xl bg-surface-container-lowest text-on-surface px-5 py-3 vibe-card hover:-translate-y-1 transition-transform"
              >
                <div className="w-10 h-10 bg-on-surface rounded-lg flex items-center justify-center text-background">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-body-md text-[10px] uppercase leading-none text-on-surface-variant">
                    App Store
                  </p>
                  <p className="font-headline-lg text-base leading-tight">Download for iPhone</p>
                </div>
              </a>
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-2xl bg-surface-container-lowest text-on-surface px-5 py-3 vibe-card hover:-translate-y-1 transition-transform"
              >
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-on-primary">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.4154.4154 0 00-.5676.1521l-2.0225 3.503C15.5902 8.4799 13.8533 8.135 12 8.135c-1.8536 0-3.5906.3449-5.1371.9575L4.8404 5.5893a.4154.4154 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589.3432 18.6627h23.3136c0-4.0038-2.3457-7.476-5.7746-9.3413" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-body-md text-[10px] uppercase leading-none text-on-surface-variant">
                    Google Play
                  </p>
                  <p className="font-headline-lg text-base leading-tight">Download for Android</p>
                </div>
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24 bg-background relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#06070a] px-6 py-14 sm:px-12 sm:py-20 lg:px-20 lg:py-24 text-center">
              <div className="vibe-mesh absolute inset-0"></div>
              <div className="absolute top-[-60px] left-[-40px] w-40 h-40 rounded-full bg-magenta/20 blur-2xl"></div>
              <div className="absolute bottom-[-80px] right-[-20px] w-56 h-56 rounded-full bg-amber/20 blur-3xl"></div>

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
                  className="inline-flex items-center justify-center rounded-2xl bg-amber text-[#1a0b00] px-8 py-4 font-label-comic text-sm uppercase tracking-wide vibe-glow min-w-[180px]"
                >
                  Contact Us
                </Link>
                <Link
                  href="/branches"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white px-8 py-4 font-label-comic text-sm uppercase tracking-wide backdrop-blur-md min-w-[180px]"
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
    </div>
  );
}

export default Index;

