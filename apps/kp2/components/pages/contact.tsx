"use client";

import { PurposeHeroArt } from "@/components/PurposeHeroArt";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TikTokIcon } from "@/components/TikTokIcon";
import { ContactLetter } from "@/components/ContactLetter";
import { TypedText } from "@/components/TypedText";
import { TIKTOK_URL } from "@/lib/social";
import { type Branch } from "@/lib/branches";

function ContactPage({ mainCampus, branches }: { mainCampus: Branch | null; branches: Branch[] }) {
  return (
    <div className="bg-background text-on-background font-body-md selection:bg-secondary-container">
      <SiteHeader />
      <header className="kp-media-hero relative box-border flex w-full items-end overflow-hidden border-b-4 border-primary bg-on-background text-background">
        <PurposeHeroArt />
        <div className="absolute inset-0 bg-gradient-to-t from-[#151218]/80 via-[#151218]/45 to-[#151218]/25 pointer-events-none"></div>
        <div className="relative z-20 w-full px-margin-mobile md:px-margin-desktop text-left">
          <p className="font-label-md uppercase tracking-[0.28em] text-white/80 mb-4">
            Ask · Pray · Say hi
          </p>
          <h1 className="font-display-lg uppercase leading-none text-white mb-4">
            <TypedText text="Contact Us" />
          </h1>
          <p className="font-body-lg text-body-lg text-white max-w-md">
            We are here for you. Whether you have a question, a prayer request, or just want to say
            hi.
          </p>
          <a
            href="#write"
            className="kp-depth-button kp-button-gold mt-8 inline-flex items-center gap-2 bg-[#f7be1d] text-[#151218] font-label-comic text-sm uppercase px-7 py-4 border-4 border-[#151218] brutalist-shadow"
          >
            Send us a message
            <span className="material-symbols-outlined text-lg" aria-hidden="true">
              arrow_downward
            </span>
          </a>
        </div>
      </header>

      <main>
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
