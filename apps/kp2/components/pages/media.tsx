"use client";

import { KP2_PHOTOS } from "@/lib/photography";

import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SocialStack, type SocialPlatform } from "@/components/SocialStack";

import { ThemeToggle } from "@/components/ThemeToggle";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { INSTAGRAM_PROFILE_URL } from "@/lib/instagram";
import { TikTokIcon } from "@/components/TikTokIcon";
import { TIKTOK_HANDLE, TIKTOK_URL } from "@/lib/social";
import { ParallaxHeroImage } from "@/components/ParallaxHeroImage";
import { TypedText } from "@/components/TypedText";

/* ---------------- brand icons ---------------- */

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.37 1.06.42 2.23.06 1.25.07 1.65.07 4.85s0 3.6-.07 4.85c-.05 1.17-.25 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.06.37-2.23.42-1.25.06-1.65.07-4.85.07s-3.6 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.42a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.17-.42-.37-1.06-.42-2.23C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.85c.05-1.17.25-1.8.42-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.06-.37 2.23-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.5.01-4.73.07-.94.04-1.4.2-1.72.32-.34.13-.58.29-.83.54-.25.25-.41.49-.54.83-.13.33-.28.78-.32 1.72C3.8 8.5 3.8 8.85 3.8 12s.01 3.5.07 4.73c.04.94.2 1.4.32 1.72.13.34.29.58.54.83.25.25.49.41.83.54.33.13.78.28 1.72.32 1.23.06 1.58.07 4.73.07s3.5-.01 4.73-.07c.94-.04 1.4-.2 1.72-.32.34-.13.58-.29.83-.54.25-.25.41-.49.54-.83.13-.33.28-.78.32-1.72.06-1.23.07-1.58.07-4.73s-.01-3.5-.07-4.73c-.04-.94-.2-1.4-.32-1.72a2.2 2.2 0 0 0-.54-.83 2.2 2.2 0 0 0-.83-.54c-.33-.13-.78-.28-1.72-.32C15.5 4.01 15.15 4 12 4Zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8Zm0 1.8a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Zm5.15-2.4a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z" />
    </svg>
  );
}

function YouTubeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.28 5 12 5 12 5s-6.28 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.77 2 12 2 12s0 3.23.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.72 19 12 19 12 19s6.28 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.23 22 12 22 12s0-3.23-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}

function SpotifyIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function SoundCloudIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M1.5 13.2c0-.9.3-1.7.85-2.35l.3 2.4-.3 2.25A3.5 3.5 0 0 1 1.5 13.2Zm2.2-3.6c.3 0 .58.06.83.16l.3 3.45-.3 2.9a2.1 2.1 0 0 1-.83.17H3.6l-.4-3.05.4-3.63h.1Zm2.2-1.1c.32 0 .62.07.9.2l.25 4.4-.25 3.05a2 2 0 0 1-.9.22l-.36-3.28.36-4.59Zm2.3-1.4c.33 0 .64.08.92.22l.22 5.78-.22 3.05a2 2 0 0 1-.92.22l-.3-3.28.3-5.99ZM11 5.4c.34 0 .66.08.95.23l.2 7.37-.2 3.05a2 2 0 0 1-.95.22l-.28-3.28L11 5.4Zm3.4 1.15c3.1 0 5.6 2.36 5.6 5.27 0 .5-.07.98-.2 1.43H14.4a.7.7 0 0 1-.7-.7V7.35c.22-.5.42-.8.7-.8Zm5.9 3.35c1.6 0 2.9 1.28 2.9 2.85s-1.3 2.85-2.9 2.85h-5.9a.7.7 0 0 1-.7-.7v-4.3c.72-.44 1.5-.7 2.3-.7h4.3Z" />
    </svg>
  );
}

function AppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17 1.01 7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99ZM17 19H7V5h10v14Z" />
    </svg>
  );
}

/* ---------------- data ---------------- */

const SOCIALS: SocialPlatform[] = [
  {
    label: "Kharis App",
    handle: "iOS & Android",
    copy: "Messages, notes and giving in one place.",
    href: "/#app-stores",
    cta: "GET THE APP",
    Icon: AppIcon,
    band: "bg-primary text-on-primary",
    external: false,
  },
  {
    label: "Instagram",
    handle: "@kharisphasetwo",
    copy: "Daily reels, service moments and behind-the-scenes.",
    href: INSTAGRAM_PROFILE_URL,
    cta: "FOLLOW",
    Icon: InstagramIcon,
    band: "bg-secondary-container text-on-background",
  },
  {
    label: "YouTube",
    handle: "@davidantwi",
    copy: "Full messages, worship sets and conference replays.",
    href: "https://youtube.com/@davidantwi",
    cta: "SUBSCRIBE",
    Icon: YouTubeIcon,
    band: "bg-primary-fixed text-on-primary-fixed",
  },
  {
    label: "TikTok",
    handle: TIKTOK_HANDLE,
    copy: "Short clips, house moments and word in motion.",
    href: TIKTOK_URL,
    cta: "FOLLOW",
    Icon: TikTokIcon,
    band: "bg-on-background text-surface",
  },
  {
    label: "Spotify",
    handle: "Davidantwi",
    copy: "Every sermon as a podcast. Press play on your commute.",
    href: "https://open.spotify.com/",
    cta: "LISTEN",
    Icon: SpotifyIcon,
    band: "bg-tertiary-container text-on-tertiary-container",
  },
  {
    label: "SoundCloud",
    handle: "Kharis Church",
    copy: "Audio archive, shorter clips and worship recordings.",
    href: "https://soundcloud.com/",
    cta: "STREAM",
    Icon: SoundCloudIcon,
    band: "bg-surface-container-highest text-on-surface",
  },
];

/* ---------------- page ---------------- */

function MediaPage() {
  return (
    <div className="bg-background text-on-background font-body-md selection:bg-secondary-container selection:text-on-secondary-container overflow-x-clip">
      <SiteHeader />

      <header className="kp-media-hero relative box-border flex w-full items-end overflow-hidden border-b-4 border-primary bg-on-background text-background">
        <ParallaxHeroImage src={KP2_PHOTOS.serviceCamera.src} alt="" className="object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#151218]/80 via-[#151218]/45 to-[#151218]/25 pointer-events-none"></div>
        <div className="relative z-20 w-full px-margin-mobile md:px-margin-desktop text-left">
          <p className="font-label-md uppercase tracking-[0.28em] text-white/80 mb-4">
            Follow · Watch · Listen
          </p>
          <h1 className="font-display-lg uppercase leading-none text-white mb-4">
            <TypedText text="Social Media" />
          </h1>
          <p className="font-body-lg text-body-lg text-white max-w-md">
            Everywhere Kharis lives online.
          </p>
          <Link
            href="/messages"
            className="kp-depth-button kp-button-gold mt-8 inline-flex items-center gap-2 bg-[#f7be1d] text-[#151218] font-label-comic text-sm uppercase px-7 py-4 border-4 border-[#151218] brutalist-shadow"
          >
            Watch messages
            <span className="material-symbols-outlined text-lg" aria-hidden="true">
              arrow_forward
            </span>
          </Link>
        </div>
      </header>

      <main className="bg-surface relative">
        <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none"></div>

        <SocialStack platforms={SOCIALS} />

        <NewsletterSignup
          title="Stay in the loop"
          copy="Get updates from Kharis Phase 2 in your inbox."
          placeholder="Your email address"
          className="bg-primary text-on-primary"
          copyClassName="text-primary-fixed"
          buttonClassName="bg-secondary-container text-on-background"
        />
      </main>

      <SiteFooter />
      <ThemeToggle />
    </div>
  );
}

export default MediaPage;
