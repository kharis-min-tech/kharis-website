"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TikTokIcon } from "@/components/TikTokIcon";
import { ContactLetter } from "@/components/ContactLetter";
import { TIKTOK_URL } from "@/lib/social";
import { type Branch } from "@/lib/branches";

function ContactPage({ mainCampus, branches }: { mainCampus: Branch | null; branches: Branch[] }) {
  return (
    <div className="bg-background text-on-background font-body-md selection:bg-secondary-container">
      <SiteHeader />
      <main className="pt-[74px]">
        <section className="relative box-border flex min-h-[calc(100svh-74px)] h-auto lg:h-[calc(100dvh-74px)] lg:max-h-[calc(100dvh-74px)] items-center overflow-hidden border-b-4 border-primary bg-on-background px-margin-mobile py-8 text-background md:px-margin-desktop md:py-10">
          <div className="halftone-bg pointer-events-none absolute inset-0 opacity-25"></div>
          <div className="absolute top-0 right-0 h-full w-2/3 bg-gradient-to-l from-primary/25 to-transparent"></div>
          <div className="relative z-10 grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-gutter">
            <div className="lg:col-span-7">
              <span className="mb-6 inline-block animate-bounce border-heavy bg-secondary-container px-4 py-1 font-label-md uppercase tracking-widest text-on-secondary-container motion-reduce:animate-none">
                Feel Free To Reach Out
              </span>
              <h1 className="mb-4 font-display-lg text-[48px] uppercase leading-none text-primary-fixed-dim sm:text-[64px] md:text-display-lg">
                CONTACT US
              </h1>
              <p className="mb-8 max-w-xl font-headline-md text-headline-md text-surface-container-low">
                We are here for you. Whether you have a question, a prayer request, or just want to
                say hi.
              </p>
              <div className="flex gap-4">
                <div className="h-2 w-12 bg-secondary-container"></div>
                <div className="h-2 w-12 bg-primary"></div>
                <div className="h-2 w-12 bg-on-background"></div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="flex w-full flex-row gap-3 sm:gap-4 lg:ml-auto lg:w-[min(100%,calc((100dvh-10rem)/2))] lg:flex-col">
                <div className="relative aspect-square flex-1 overflow-hidden rounded-none border-2 border-black brutalist-shadow">
                  <img
                    alt="Worship on stage at Kharis"
                    className="absolute inset-x-0 top-0 h-[200%] w-full max-w-none object-cover object-top"
                    src="https://images.kharis.org/site-images/kp2/9b547f88f3b4d297/worship.jpg"
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <div className="relative aspect-square flex-1 overflow-hidden rounded-none border-2 border-black brutalist-shadow">
                  <img
                    alt="Congregation gathered in the auditorium"
                    className="absolute inset-x-0 bottom-0 h-[200%] w-full max-w-none object-cover object-bottom"
                    src="https://images.kharis.org/site-images/kp2/9b547f88f3b4d297/worship.jpg"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <ContactLetter
          branches={branches.map(({ slug, name }) => ({ slug, name }))}
          fallbackEmail={mainCampus?.email || undefined}
        />

        <section className="relative z-10 bg-secondary-container border-y-4 border-on-background py-16 px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row items-center justify-between gap-gutter">
            <h2 className="font-display-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-secondary-container">
              Follow the Movement
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                className="p-4 bg-white text-on-background rounded-none brutalist-border brutalist-shadow btn-hover transition-all flex items-center gap-2 shrink-0"
                href="/#app-stores"
              >
                <span className="material-symbols-outlined">smartphone</span>
                <span className="font-label-md">KHARIS APP</span>
              </Link>
              <a
                className="p-4 bg-white text-on-background rounded-none brutalist-border brutalist-shadow btn-hover transition-all flex items-center gap-2 shrink-0"
                href="https://instagram.com/kharisphasetwo"
                target="_blank"
                rel="noreferrer"
              >
                <span className="material-symbols-outlined">public</span>
                <span className="font-label-md">INSTAGRAM</span>
              </a>
              <a
                className="p-4 bg-white text-on-background rounded-none brutalist-border brutalist-shadow btn-hover transition-all flex items-center gap-2 shrink-0"
                href="https://youtube.com/@davidantwi"
                target="_blank"
                rel="noreferrer"
              >
                <span className="material-symbols-outlined">video_library</span>
                <span className="font-label-md">YOUTUBE</span>
              </a>
              <a
                className="p-4 bg-white text-on-background rounded-none brutalist-border brutalist-shadow btn-hover transition-all flex items-center gap-2 shrink-0"
                href={TIKTOK_URL}
                target="_blank"
                rel="noreferrer"
              >
                <TikTokIcon className="w-5 h-5" />
                <span className="font-label-md">TIKTOK</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      <ThemeToggle />
    </div>
  );
}

export default ContactPage;
