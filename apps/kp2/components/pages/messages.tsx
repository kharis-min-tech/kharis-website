"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { MessagesAppStrip } from "@/components/MessagesAppStrip";
import { MessageBrowser } from "@/components/MessageBrowser";
import "@/components/listen-row.css";
import { MutedHeroVideo } from "@/components/MutedHeroVideo";
import { displayMessageTitle, youtubeWatchUrl, type MessageVideo } from "@/lib/youtube";

function MessagesPage({ messages }: { messages: MessageVideo[] }) {
  const featured = messages[0];

  return (
    <div className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <SiteHeader />
      <main>
        <section className="kp-messages-hero relative box-border mt-[74px] flex w-full flex-col overflow-hidden border-b-4 border-black bg-on-background xl:mt-0 xl:block xl:h-svh xl:max-h-svh">
          {featured ? (
            <MutedHeroVideo
              id={featured.id}
              thumbnail={featured.thumbnail}
              title={featured.title}
            />
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{
                backgroundImage:
                  "url('https://images.kharis.org/site-images/kp2/a991d1457f200aa6/pastor-david-at-pulpit.jpg')",
              }}
            />
          )}
          <div className="pointer-events-none absolute inset-0 hero-gradient max-xl:hidden" />
          <div className="pointer-events-none absolute inset-0 halftone-pattern text-white/5 max-xl:hidden" />
          <div className="relative z-10 mx-auto flex h-auto w-full min-w-0 max-w-7xl flex-col justify-end px-margin-mobile pb-8 pt-6 xl:h-full xl:px-margin-desktop xl:pb-10 xl:pt-24">
            <div className="mb-5 inline-block w-fit max-w-full border-2 border-black bg-secondary-container px-4 py-1 font-label-md uppercase text-on-secondary-container md:mb-6">
              Hunger &amp; Zeal for God
            </div>
            <h1 className="mb-4 max-w-full break-words font-display-lg text-[1.75rem] uppercase leading-[0.95] tracking-tight text-white md:text-display-lg md:leading-none md:tracking-tighter">
              {featured ? displayMessageTitle(featured.title) : "Messages"}
            </h1>
            <p className="mb-6 max-w-2xl font-body-lg text-base leading-relaxed text-white/80 md:mb-8 md:text-body-lg">
              {featured
                ? "Your hunger and zeal for God is your greatest advantage as a believer. Watch the newest teaching from Pastor David Antwi here or on YouTube."
                : "Your hunger and zeal for God is your greatest advantage as a believer. Teachings from Pastor David Antwi will appear here as they go live."}
            </p>
            {featured ? (
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
                <a
                  href="#latest-messages"
                  className="kp-depth-button kp-button-purple group flex w-full items-center justify-center gap-3 border-2 border-black bg-primary px-8 py-4 font-headline-md text-white hard-shadow btn-press sm:w-auto"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    volume_up
                  </span>
                  WATCH NOW
                </a>
                <a
                  href={youtubeWatchUrl(featured.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="kp-depth-button kp-button-light keep-light flex w-full items-center justify-center gap-3 border-2 border-black px-8 py-4 font-headline-md hard-shadow btn-press sm:w-auto"
                >
                  <span className="material-symbols-outlined">smart_display</span>
                  YOUTUBE
                </a>
              </div>
            ) : null}
          </div>
        </section>

        <MessageBrowser messages={messages} />
        <MessagesAppStrip />

        <section
          className="kp-listen bg-surface-container border-y-4 border-black"
          data-reveal="self"
        >
          <div className="max-w-7xl mx-auto px-margin-desktop py-16">
            <div className="kp-listen__intro flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="inline-block bg-secondary-container text-on-secondary-container border-2 border-black font-label-sm uppercase px-3 py-1 hard-shadow-sm mb-4">
                  Listen Anywhere
                </span>
                <h2 className="font-display-lg text-headline-lg leading-tight uppercase">
                  Other Ways To Listen
                </h2>
              </div>
              <p className="font-body-lg text-body-md text-on-surface-variant max-w-md">
                What it takes to sustain the move of God is a text-driven, gospel-saturated,
                Christ-exalting message. Catch every message on your favourite platform, or in the
                Kharis app.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-gutter">
              {[
                {
                  label: "Kharis App",
                  copy: "Messages, notes and giving in one place.",
                  cta: "Get the App",
                  href: "/#app-stores",
                  icon: "smartphone",
                  card: "bg-primary text-on-primary",
                  muted: "!text-primary-fixed",
                },
                {
                  label: "Spotify",
                  copy: "Stream the podcast and follow every series.",
                  cta: "Listen on Spotify",
                  href: "https://open.spotify.com/",
                  icon: "podcasts",
                  card: "bg-[#1DB954] text-white",
                  muted: "text-white/90",
                },
                {
                  label: "SoundCloud",
                  copy: "Audio archive of past teachings and sessions.",
                  cta: "Play on SoundCloud",
                  href: "https://soundcloud.com/",
                  icon: "graphic_eq",
                  card: "bg-[#FF5500] text-white",
                  muted: "text-white/90",
                },
                {
                  label: "YouTube",
                  copy: "Watch full services, clips and live streams.",
                  cta: "Watch on YouTube",
                  href: "https://youtube.com/@davidantwi",
                  icon: "smart_display",
                  card: "bg-[#FF0000] text-white",
                  muted: "text-white/90",
                },
              ].map(({ label, copy, cta, href, icon, card, muted }) => (
                <div key={label} className="kp-listen__slot">
                  <Link
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                    className={`kp-platform-card group ${card} border-2 border-black rounded-none neo-shadow flex flex-col p-6 no-accent-fill`}
                  >
                    <span className={`material-symbols-outlined text-4xl mb-4 ${muted}`}>
                      {icon}
                    </span>
                    <h3 className="font-headline-md text-title-lg uppercase mb-2">{label}</h3>
                    <p className={`font-body-lg text-body-md flex-1 ${muted}`}>{copy}</p>
                    <span className="mt-6 inline-flex items-center gap-2 font-label-sm uppercase">
                      {cta}
                      <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <NewsletterSignup
          title="Never Miss A Word"
          copy="Subscribe to get the latest messages, series notes, and study guides delivered straight to your inbox."
          className="bg-primary text-on-primary"
          copyClassName="text-primary-fixed"
        />
      </main>
      <SiteFooter />
      <ThemeToggle />
    </div>
  );
}

export default MessagesPage;
