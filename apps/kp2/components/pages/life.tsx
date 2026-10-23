"use client";

import { KP2_PHOTOS } from "@/lib/photography";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { ChurchEvent } from "@/lib/events";
import { eventToCalendarItem } from "@/lib/calendar";
import { PlanVisitButton } from "@/components/PlanVisitButton";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { TikTokIcon } from "@/components/TikTokIcon";
import { TIKTOK_HANDLE, TIKTOK_URL } from "@/lib/social";
import { ParallaxHeroImage } from "@/components/ParallaxHeroImage";
import { TypedText } from "@/components/TypedText";
import { ScrollDrift } from "@/components/ScrollDrift";
import { DEPARTMENTS } from "@/data/departments";

const TOP_DEPARTMENTS = DEPARTMENTS.filter((department) => department.featured).slice(0, 3);

function socialDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    timeZone: "Europe/London",
  });
}

function socialBlurb(text: string) {
  const clean = text.trim();
  if (clean.length <= 90) return clean;
  return `${clean
    .slice(0, 90)
    .replace(/\s+\S*$/, "")
    .trim()}…`;
}

function LifePage({ upcoming }: { upcoming: ChurchEvent[] }) {
  return (
    <div className="bg-background text-on-background font-body-md selection:bg-secondary-container selection:text-on-secondary-container overflow-x-clip">
      <SiteHeader />

      <header className="kp-life-hero relative box-border flex h-svh max-h-svh w-full items-center overflow-hidden bg-black pt-24 pb-8 text-white">
        <ParallaxHeroImage
          src={KP2_PHOTOS.serviceTogether.src}
          alt={KP2_PHOTOS.serviceTogether.alt}
          className="object-[center_30%] opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

        <div className="absolute inset-0 halftone-pattern text-primary opacity-20 pointer-events-none"></div>
        <div className="relative z-10 px-margin-desktop w-full max-w-7xl mx-auto flex flex-col items-start gap-6">
          <div className="bg-secondary-container text-on-secondary-container px-4 py-1 border-2 border-black inline-block font-label-md text-label-md uppercase -rotate-2">
            Christ Exalting
          </div>
          <h1 className="font-display-lg text-display-lg max-w-4xl leading-[1] tracking-tighter uppercase mb-4">
            <TypedText text="A family church." />
            <br />
            <TypedText
              text="Faith lived together."
              delay={1200}
              className="kp-life-headline text-white bg-primary px-4 py-2 inline-block"
            />
          </h1>
          <p className="font-body-lg text-body-lg max-w-2xl text-surface-variant font-medium">
            We are passionate about God and His word. Experience a spirit-filled, faith lifting and
            powerpacked culture. Get busy serving, and leave every service ready to impact your
            generation with Christ.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-2">
            <Link
              href="/branches"
              className="kp-depth-button kp-button-purple bg-primary text-white px-8 py-4 border-4 border-black neo-shadow-lg font-headline-md text-headline-md uppercase hover-press transition-all skew-hover inline-block"
            >
              Find Your Branch
            </Link>
            <Link
              href="/messages"
              className="kp-depth-button kp-button-light keep-light px-8 py-4 border-4 border-black neo-shadow-lg font-headline-md text-headline-md uppercase hover-press transition-all skew-hover inline-block"
            >
              Watch a Message
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-20">
        {/* Fellowship section removed */}

        <section className="border-b-4 border-black bg-background px-margin-desktop py-stack-lg">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="mb-4 inline-block bg-primary-container px-3 py-1 font-label-md text-label-md uppercase text-on-primary-container">
                  The diary
                </div>
                <h2 className="font-display-lg text-headline-lg uppercase leading-[0.9]">
                  Upcoming events
                </h2>
              </div>
              {upcoming.length > 0 ? (
                <Link
                  href="/events"
                  className="kp-depth-button kp-button-gold border-4 border-black bg-[#f7be1d] px-6 py-3 font-headline-md uppercase text-[#151218]"
                >
                  See more
                </Link>
              ) : null}
            </div>
            {upcoming.length === 0 ? (
              <div className="flex flex-col gap-6 border-4 border-black bg-white p-6 neo-shadow md:flex-row md:items-center md:justify-between md:p-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-black bg-primary">
                    <span
                      className="material-symbols-outlined text-3xl text-white"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                      aria-hidden="true"
                    >
                      event
                    </span>
                  </div>
                  <p className="font-body-lg text-body-lg text-on-surface">
                    Nothing is dated just yet. Come this Sunday.
                  </p>
                </div>
                <Link
                  href="/branches"
                  className="kp-depth-button kp-button-gold shrink-0 border-4 border-black bg-[#f7be1d] px-7 py-4 text-center font-headline-md uppercase text-[#151218]"
                >
                  Find a branch
                </Link>
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((event) => (
                  <li
                    key={event.slug}
                    className="flex flex-col border-4 border-black bg-white p-5 neo-shadow"
                  >
                    <p className="font-label-md text-label-md uppercase text-primary">
                      {socialDate(event.starts)}
                    </p>
                    <h3 className="mt-2 font-headline-md text-headline-md uppercase leading-none">
                      <Link href="/events">{event.title}</Link>
                    </h3>
                    <p className="mt-3 font-body-md text-on-surface-variant">
                      {socialBlurb(event.blurb)}
                    </p>
                    <PlanVisitButton
                      item={eventToCalendarItem(event)}
                      className="mt-auto inline-flex items-center gap-1 pt-4 font-label-md text-[11px] uppercase tracking-widest text-primary"
                    >
                      <span className="material-symbols-outlined text-base">calendar_add_on</span>
                      Remind me
                    </PlanVisitButton>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="border-b-4 border-black bg-[#151218] px-margin-desktop py-stack-lg text-white">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-3 font-display-lg text-headline-lg uppercase leading-[0.9]">
              Stay connected
            </h2>
            <p className="mb-8 max-w-2xl font-body-lg text-body-lg text-white/80">
              Daily inspiration, community highlights, and event updates. The family keeps going
              when Sunday ends.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <a
                className="kp-life-social flex flex-col gap-4 border-4 border-[#151218] bg-[#fffdf5] p-5 shadow-[6px_6px_0_#f7be1d] transition-colors hover:bg-[#f7be1d]"
                href="https://instagram.com/kharisphasetwo"
                target="_blank"
                rel="noreferrer"
              >
                <span className="flex h-14 w-14 items-center justify-center border-2 border-black bg-primary text-white">
                  <span className="material-symbols-outlined text-3xl" aria-hidden="true">
                    photo_camera
                  </span>
                </span>
                <span>
                  <span className="block font-headline-md text-headline-md uppercase leading-none">
                    Instagram
                  </span>
                  <span className="mt-2 block font-label-sm text-label-sm">@kharisphasetwo</span>
                </span>
              </a>
              <a
                className="kp-life-social flex flex-col gap-4 border-4 border-[#151218] bg-[#fffdf5] p-5 shadow-[6px_6px_0_#f7be1d] transition-colors hover:bg-[#f7be1d]"
                href="https://youtube.com/@davidantwi"
                target="_blank"
                rel="noreferrer"
              >
                <span className="flex h-14 w-14 items-center justify-center border-2 border-black bg-primary text-white">
                  <span className="material-symbols-outlined text-3xl" aria-hidden="true">
                    video_library
                  </span>
                </span>
                <span>
                  <span className="block font-headline-md text-headline-md uppercase leading-none">
                    YouTube
                  </span>
                  <span className="mt-2 block font-label-sm text-label-sm">@davidantwi</span>
                </span>
              </a>
              <a
                className="kp-life-social flex flex-col gap-4 border-4 border-[#151218] bg-[#fffdf5] p-5 shadow-[6px_6px_0_#f7be1d] transition-colors hover:bg-[#f7be1d]"
                href={TIKTOK_URL}
                target="_blank"
                rel="noreferrer"
              >
                <span className="flex h-14 w-14 items-center justify-center border-2 border-[#151218] bg-[#fffdf5]">
                  <TikTokIcon className="h-8 w-8" />
                </span>
                <span>
                  <span className="block font-headline-md text-headline-md uppercase leading-none">
                    TikTok
                  </span>
                  <span className="mt-2 block font-label-sm text-label-sm">{TIKTOK_HANDLE}</span>
                </span>
              </a>
            </div>
          </div>
        </section>

        <section className="kp-life-serve bg-background px-margin-desktop py-stack-lg">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-gutter md:grid-cols-12">
            <div className="order-2 md:order-2 md:col-span-5">
              <div className="relative z-10">
                <ScrollDrift
                  className="pointer-events-none absolute -left-3 -top-6 -z-10 md:-left-8 md:-top-16"
                  travel={170}
                >
                  <div className="h-48 w-48 rounded-full border-4 border-black bg-[#f7be1d] halftone-pattern text-[#151218]" />
                </ScrollDrift>
                <ScrollDrift
                  className="pointer-events-none absolute -bottom-8 -right-4 -z-10"
                  travel={-110}
                >
                  <div className="h-20 w-20 rounded-full border-4 border-black bg-primary" />
                </ScrollDrift>
                <div className="relative z-10 border-4 border-black bg-white p-8 neo-shadow md:rotate-[-1.5deg]">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center border-2 border-black bg-primary">
                      <span className="material-symbols-outlined text-white" aria-hidden="true">
                        groups
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md uppercase">Departments</h3>
                  </div>
                  <p className="font-body-md text-on-surface-variant">
                    {DEPARTMENTS.length} teams, one family. Music, drama, words, welcome, prayer and
                    more. Find the room where you serve.
                  </p>
                  <Link
                    href="/departments"
                    className="kp-depth-button kp-button-purple mt-10 block w-full border-4 border-black bg-primary px-7 py-5 text-center font-headline-md text-headline-md uppercase leading-none text-white neo-shadow hover-press"
                  >
                    See departments
                  </Link>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-1 md:col-span-7">
              <div className="p-2 md:p-8">
                <div className="mb-6 inline-block bg-primary-container px-3 py-1 font-label-md text-label-md uppercase text-on-primary-container">
                  Get busy serving
                </div>
                <h2 className="mb-8 font-display-lg text-headline-lg uppercase leading-[0.9]">
                  Find your place <br />
                  <span className="text-primary">in the family</span>
                </h2>
                <p className="mb-8 font-body-lg text-body-lg text-on-surface">
                  Sunday gathers us. The departments are where the family gets to work — singing,
                  acting, and speaking the Word. These three lead the way. Your branch will show you
                  where to start.
                </p>
                <div className="grid grid-cols-1 gap-4">
                  {TOP_DEPARTMENTS.map((department, index) => (
                    <Link
                      key={department.name}
                      href="/departments"
                      className="group flex items-center gap-4 border-4 border-black bg-white p-3 neo-shadow transition-colors hover:bg-secondary-container"
                    >
                      <img
                        src={department.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        style={{ objectPosition: department.imagePosition }}
                        className="h-16 w-24 shrink-0 border-2 border-black object-cover"
                      />
                      <div className="min-w-0">
                        <p className="font-label-md text-label-md text-primary">0{index + 1}</p>
                        <p className="font-headline-md text-headline-md uppercase leading-none">
                          {department.name}
                        </p>
                        <p className="mt-1 font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-secondary-container">
                          {department.tagline}
                        </p>
                      </div>
                      <span
                        className="material-symbols-outlined ml-auto shrink-0 text-3xl"
                        aria-hidden="true"
                      >
                        {department.icon}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <NewsletterSignup
          title="Don't Miss a beat."
          copy="Sign up for our weekly 'Life Update' and never miss out on a social or small group gathering."
          cta="Subscribe Now"
          className="bg-primary text-on-primary"
          copyClassName="text-primary-fixed"
          buttonClassName="bg-black text-white"
        />
      </main>

      <SiteFooter />
      <ThemeToggle />
    </div>
  );
}

export default LifePage;
