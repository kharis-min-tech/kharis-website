"use client";

import { AppListenSteps } from "@/components/AppListenSteps";
import { KHARIS_APP } from "@/lib/kharis-app";
import { AmbientVideo } from "@/components/AmbientVideo";
import { HeroTitle } from "@/components/HeroTitle";
import { KnowKharisComic } from "@/components/KnowKharisComic";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { type Testimonial } from "@/components/TestimonialCarousel";
import { TestimoniesBand } from "@/components/TestimoniesBand";
import { TestimonyFormModal } from "@/components/TestimonyFormModal";
import { LatestMessages } from "@/components/LatestMessages";
import { VisitInstead } from "@/components/VisitInstead";
import { type MessageVideo } from "@/lib/youtube";

function Index({
  testimonials,
  messages,
}: {
  testimonials: Testimonial[];
  messages: MessageVideo[];
}) {
  const [formOpen, setFormOpen] = useState(false);
  const introRef = useRef<HTMLElement>(null);
  const [introMotion, setIntroMotion] = useState<"rest" | "ready" | "in">("rest");
  const closeForm = useCallback(() => {
    setFormOpen(false);
    if (window.location.hash === "#share-testimony") {
      window.history.replaceState({}, "", window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {
    let scrollFrame = 0;
    const sync = () => {
      if (window.location.hash === "#share-testimony") setFormOpen(true);
      if (window.location.hash === "#app-stores") {
        // Client navigation can resolve the hash before this page's target mounts.
        scrollFrame = requestAnimationFrame(() => {
          document.getElementById("app-stores")?.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
            block: "start",
          });
        });
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => {
      cancelAnimationFrame(scrollFrame);
      window.removeEventListener("hashchange", sync);
    };
  }, []);

  useEffect(() => {
    const section = introRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setIntroMotion("ready");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIntroMotion("in");
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white text-gray-900 font-body-md overflow-x-hidden pt-[74px]">
      <SiteHeader />

      <header className="kp-home-hero kp-on-dark relative h-[calc(100svh-74px)] min-h-[540px] w-full flex flex-col overflow-hidden bg-[#151218]">
        <div className="absolute inset-0 grid grid-cols-2 lg:flex lg:flex-row w-full h-full z-0">
          <div className="relative col-span-2 lg:flex-1 group overflow-hidden border-b-2 lg:border-b-0 lg:border-r-2 border-[#151218] halftone-bg text-[#d2bbff]/10">
            <AmbientVideo
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 motion-safe:group-hover:scale-[1.03] transition-transform duration-700"
              src="/kp2/assets/Choir-video.mp4"
              poster="/kp2/assets/choir-video-poster.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151218] to-transparent opacity-80"></div>
          </div>

          <div className="relative lg:flex-1 group overflow-hidden border-r-2 border-[#151218] halftone-bg text-[#deb7ff]/10">
            <AmbientVideo
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 motion-safe:group-hover:scale-[1.03] transition-transform duration-700"
              src="/kp2/assets/crowd.mp4"
              poster="/kp2/assets/crowd-poster.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151218] to-transparent opacity-80"></div>
          </div>

          <div className="relative lg:flex-1 group overflow-hidden border-r-2 border-[#151218] halftone-bg text-[#f7be1d]/10">
            <AmbientVideo
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 motion-safe:group-hover:scale-[1.03] transition-transform duration-700"
              src="/kp2/assets/choir2.mp4"
              poster="/kp2/assets/choir2-poster.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151218] to-transparent opacity-80"></div>
          </div>

          <div className="relative hidden lg:block lg:flex-1 group overflow-hidden halftone-bg text-[#eaddff]/10">
            <AmbientVideo
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 motion-safe:group-hover:scale-[1.03] transition-transform duration-700"
              src="/kp2/assets/dancing.mp4"
              poster="/kp2/assets/dancing-poster.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151218] to-transparent opacity-80"></div>
          </div>
        </div>

        <div className="absolute inset-0 z-20 bg-[#151218]/55 md:bg-transparent"></div>

        <div className="kp-home-hero-copy absolute inset-0 z-20 flex flex-col justify-center items-center pointer-events-none px-margin-mobile md:px-margin-desktop text-center mt-0 md:mt-[-10vh]">
          <div className="bg-[#f7be1d] px-4 sm:px-6 py-2 sm:py-3 mb-5 md:mb-8 pointer-events-auto shadow-[4px_4px_0px_0px_rgba(19,16,22,1)] border-2 border-[#151218] rotate-[-2deg] max-w-full">
            <span className="font-label-comic text-[11px] sm:text-label-comic text-[#3f2e00] uppercase tracking-widest">
              Preach Christ Crucified.
            </span>
          </div>
          <HeroTitle />
          <p className="font-body-lg text-base sm:text-body-lg text-[#e8e0e9] mt-5 md:mt-6 max-w-2xl bg-[#151218]/40 backdrop-blur-md p-4 border border-[#958da1]/30 pointer-events-auto rounded">
            A spirit-filled, revival-seeking church. We are young people serving God with passion,
            gathering to encounter Jesus and live transformed lives.
          </p>
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 pointer-events-auto w-full sm:w-auto max-w-sm sm:max-w-none">
            <Link
              href="/branches"
              className="kp-depth-button kp-button-light bg-[#d2bbff] !text-black font-label-comic text-label-comic uppercase px-6 sm:px-8 py-4 brutalist-shadow border-2 border-[#151218] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
            >
              FIND A BRANCH
            </Link>
            <Link
              href="/mission"
              className="kp-depth-button kp-button-purple bg-[#2c292f] text-[#e8e0e9] border-2 border-[#958da1] font-label-comic text-label-comic uppercase px-6 sm:px-8 py-4 hover:bg-[#37333a] transition-colors flex items-center justify-center"
            >
              LEARN MORE
            </Link>
          </div>
        </div>
      </header>
      <main className="relative z-20 overflow-hidden bg-white">
        <div className="halftone-bg absolute inset-0 pointer-events-none text-gray-200 opacity-50"></div>

        <section
          ref={introRef}
          data-reveal="self"
          className={`kp-home-intro relative z-10 flex items-center px-margin-mobile md:px-margin-desktop${introMotion === "ready" ? " is-armed" : ""}${introMotion === "in" ? " is-revealed" : ""}`}
        >
          <div
            className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-center"
            style={{ gap: "clamp(1.5rem, 4vw, 4rem)" }}
          >
            <div className="kp-intro-visual relative order-2 md:order-1">
              <div className="border-4 border-gray-900 brutalist-shadow overflow-hidden rotate-[-2deg] bg-gray-100">
                <img
                  alt="A full hall at a Kharis Phase 2 Sunday service"
                  className="kp-intro-photo w-full object-cover"
                  style={{ height: "clamp(240px, 28vw, 420px)" }}
                  src="/kp2/assets/sunday-service-full-hall.jpg"
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
                Passionate for God and His Word
              </div>
            </div>
            <div
              className="kp-intro-copy order-1 md:order-2 flex flex-col"
              style={{ gap: "clamp(0.9rem, 2.2vh, 2rem)" }}
            >
              <h2
                className="font-display-xl uppercase text-[#630ed4] leading-[0.95]"
                style={{ fontSize: "clamp(2.25rem, 5.2vw, 5.5rem)" }}
              >
                WE ARE <br />
                KHARIS PHASE 2
              </h2>
              <div
                className="bg-[#630ed4]"
                style={{ width: "clamp(6rem, 12vw, 12rem)", height: "clamp(4px, 0.5vw, 8px)" }}
              ></div>
              <p
                className="font-body-lg text-gray-600 leading-relaxed max-w-2xl"
                style={{ fontSize: "clamp(1rem, 1.45vw, 1.6rem)" }}
              >
                We are a new breed of Christian who are passionate about Jesus and not afraid to
                show it. We believe in the sound teaching of Christ, the bible is our final
                authority, and Christ is the centre of our lives.
              </p>
              <p
                className="font-body-lg text-gray-600 max-w-2xl"
                style={{
                  fontSize: "clamp(1rem, 1.45vw, 1.6rem)",
                }}
              >
                &quot;Transforming the culture by reflecting Christ&quot;
              </p>
            </div>
          </div>
        </section>

        <KnowKharisComic />

        <section
          className="py-24 bg-[#630ed4] dark:bg-[#151218] border-b-4 border-gray-900 relative overflow-hidden"
          id="pastor"
        >
          <div className="halftone-bg absolute inset-0 text-white opacity-20"></div>
          <div className="max-w-7xl mx-auto px-margin-desktop relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <span className="inline-block bg-[#f7be1d] text-gray-900 px-4 py-2 font-label-comic text-xs uppercase tracking-widest brutalist-shadow mb-6">
                  From the Pastor
                </span>
                <h2 className="font-display-xl text-5xl lg:text-7xl text-white leading-none uppercase mb-6">
                  A WORD FROM <span className="text-[#f7be1d]">OUR HEAD PASTOR</span>
                </h2>
                <p className="font-body-lg text-body-lg text-gray-100 dark:text-[#ccc3d8] mb-4 max-w-lg">
                  Give yourself to the word of God. Are you struggling with sin? Are you addicted?
                  Try the Bible and see if it won’t change your life.
                </p>
                <p className="font-body-lg text-body-lg text-gray-100 dark:text-[#ccc3d8] mb-8 max-w-xl">
                  &ldquo;For the word of God is quick, and powerful, and sharper than any twoedged
                  sword...&rdquo; Hebrews 4:12
                </p>
                <Link
                  href="/mission"
                  className="kp-depth-button kp-button-gold inline-flex items-center gap-2 bg-[#f7be1d] text-gray-900 px-10 py-4 font-label-comic text-lg border-4 border-gray-900 brutalist-shadow uppercase hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
                >
                  HEAR ABOUT US
                </Link>
              </div>
              <div className="order-1 md:order-2 relative">
                <div className="absolute -inset-4 bg-[#f7be1d] rounded-[2rem] rotate-3 opacity-30 blur-sm"></div>
                <img
                  alt="Pastor David Antwi, Head Pastor of Kharis Phase 2"
                  className="relative w-full aspect-[4/5] object-cover rounded-[2rem] shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500"
                  src="/kp2/assets/pastor-david-smiling.jpg"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        <TestimoniesBand
          id="testimonies"
          className="border-b-4 border-gray-900"
          eyebrow="Salvation · Healing · Miracles"
          title="Testimonies"
          intro="Salvation and life transformation, healing, and miracles — what God is doing in this house."
          items={testimonials.map((t) => ({
            quote: t.quote,
            title: t.title,
            name: t.name,
            meta: t.location,
          }))}
        />

        <section
          className="relative z-10 bg-white dark:bg-[#151218] border-b-4 border-gray-900"
          id="media"
        >
          <LatestMessages messages={messages} />

          {messages.length === 0 ? (
            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pb-16 relative z-10">
              <VisitInstead
                title="No teachings just yet"
                action={
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link
                      href="/events#kp-sun-title"
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
                Sunday service is where the Word is preached. Find a branch and come this week.
              </VisitInstead>
            </div>
          ) : null}
        </section>

        <section
          className="py-16 sm:py-20 lg:py-24 bg-[#f2eef7] dark:bg-[#1a1625] border-b-4 border-gray-900 relative overflow-hidden transition-colors duration-300"
          id="app"
        >
          <div className="halftone-bg text-[#630ed4]/10 opacity-30 absolute inset-0 z-0"></div>
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <span className="font-label-comic text-xs tracking-[0.2em] text-[#630ed4] dark:text-[#d2bbff] uppercase mb-3 block">
                Get The App
              </span>
              <h2 className="font-display-xl text-4xl sm:text-5xl lg:text-7xl uppercase text-gray-900 dark:text-[#e8e0e9] leading-none mb-6 transition-colors duration-300">
                Church in your pocket.
              </h2>
              <p className="font-body-lg text-body-lg text-gray-600 dark:text-[#ccc3d8] transition-colors duration-300">
                Download the Kharis app, then listen to any message in three simple steps: home,
                search, and play.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                <a
                  href="#app-stores"
                  className="kp-depth-button kp-button-gold bg-[#f7be1d] text-[#151218] px-6 sm:px-8 py-3 font-label-comic text-sm uppercase border-4 border-gray-900 brutalist-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all inline-flex items-center gap-2"
                >
                  Download the app
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </a>
                <Link
                  href="/messages"
                  className="kp-depth-button kp-button-light bg-white dark:bg-[#2c2833] text-[#630ed4] dark:text-[#d2bbff] px-6 sm:px-8 py-3 font-label-comic text-sm uppercase border-4 border-gray-900 brutalist-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
                >
                  Watch messages
                </Link>
              </div>
              <p className="font-body-md text-sm text-gray-500 dark:text-[#958da1] mt-4 transition-colors duration-300">
                Available on iPhone &amp; Android
              </p>
            </div>

            <AppListenSteps />

            <div
              id="app-stores"
              className="kp-app-stores scroll-mt-28 flex flex-wrap items-center justify-center gap-4 mt-8 md:mt-10"
            >
              <a
                href={KHARIS_APP.iosUrl}
                target="_blank"
                rel="noreferrer"
                className="kp-depth-button inline-flex items-center gap-3 bg-white dark:bg-[#1f1c24] text-gray-900 dark:text-[#e8e0e9] px-5 py-3 comic-border brutalist-shadow hover:-translate-y-1 transition-transform"
              >
                <div className="w-10 h-10 bg-gray-900 dark:bg-[#e8e0e9] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 fill-white dark:fill-[#1a1b21]"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
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
                href={KHARIS_APP.androidUrl}
                target="_blank"
                rel="noreferrer"
                className="kp-depth-button inline-flex items-center gap-3 bg-white dark:bg-[#1f1c24] text-gray-900 dark:text-[#e8e0e9] px-5 py-3 comic-border brutalist-shadow hover:-translate-y-1 transition-transform"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#3ddc84]">
                  <svg className="w-7 h-7" viewBox="2 5 20 12.5" aria-hidden="true">
                    <path
                      fill="#073042"
                      d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.43 11.43 0 0 0-8.94 0L5.65 5.67c-.19-.29-.54-.37-.83-.22-.3.16-.42.54-.26.85l1.84 3.18C4.16 11.03 2.5 13.58 2.5 16.5h19c0-2.92-1.66-5.47-3.9-7.02z"
                    />
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

        <section className="py-12 md:py-16 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="kp-branch-panel kp-brand-panel relative overflow-hidden text-center">
              <div className="kp-branch-dove" aria-hidden="true" />
              <p className="kp-branch-eyebrow">Still deciding?</p>
              <h2 className="kp-branch-title font-display-xl">
                Can&apos;t decide which
                <span>branch to come to?</span>
              </h2>
              <p className="kp-branch-copy font-body-lg">
                You don&apos;t have to figure it out alone. Reach out and we&apos;ll help you find a
                Kharis family near you, or guide you to your first Sunday.
              </p>
              <div className="kp-branch-actions relative z-10 flex flex-col sm:flex-row items-stretch justify-center gap-5">
                <Link
                  href="/contact"
                  className="kp-depth-button kp-button-light inline-flex items-center justify-center bg-white text-[#630ed4] px-8 py-4 rounded-none font-label-comic text-sm uppercase tracking-wide border-2 border-gray-900 brutalist-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all min-w-[180px]"
                >
                  Contact Us
                </Link>
                <Link
                  href="/branches"
                  className="kp-depth-button kp-button-gold gap-2 px-8 py-4 font-label-comic text-sm uppercase tracking-wide min-w-[180px]"
                >
                  Find a Branch
                  <span className="material-symbols-outlined text-lg" aria-hidden="true">
                    arrow_forward
                  </span>
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
