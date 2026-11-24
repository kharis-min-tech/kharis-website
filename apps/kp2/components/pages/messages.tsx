"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MessagesAppStrip } from "@/components/MessagesAppStrip";
import { MessageBrowser } from "@/components/MessageBrowser";
import "@/components/listen-row.css";
import { MutedHeroVideo } from "@/components/MutedHeroVideo";
import { youtubeWatchUrl, type MessageVideo } from "@/lib/youtube";
import { useEffect, useRef, useState } from "react";

function MessagesPage({
  latest,
  messages,
  heroBackground,
}: {
  latest: MessageVideo[];
  messages: MessageVideo[];
  heroBackground: string;
}) {
  const featured = latest[0] ?? messages[0];
  const heroRef = useRef<HTMLElement>(null);
  const [heroActive, setHeroActive] = useState(true);
  const [fullPlayback, setFullPlayback] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const active = entry.isIntersecting && entry.intersectionRatio >= 0.2;
        setHeroActive(active);
        if (!active) {
          setFullPlayback(false);
          setPaused(false);
        }
      },
      { threshold: [0, 0.2] },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const togglePlayback = () => {
    if (!fullPlayback) {
      setFullPlayback(true);
      setPaused(false);
      return;
    }
    setPaused((value) => !value);
  };

  return (
    <div className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <SiteHeader />
      <main>
        <section
          ref={heroRef}
          onClick={(event) => {
            if (event.target instanceof Element && event.target.closest("a")) return;
            togglePlayback();
          }}
          className="kp-messages-hero relative box-border mt-[74px] flex w-full cursor-pointer flex-col overflow-hidden border-b-4 border-black bg-on-background xl:mt-0 xl:block xl:h-svh xl:max-h-svh"
        >
          {featured ? (
            <MutedHeroVideo
              id={featured.id}
              thumbnail={featured.thumbnail}
              title={featured.title}
              fullPlayback={fullPlayback}
              paused={paused}
              active={heroActive}
              onTogglePlayback={togglePlayback}
            />
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{ backgroundImage: `url('${heroBackground}')` }}
            />
          )}
          {!fullPlayback ? (
            <>
              <div className="pointer-events-none absolute inset-0 hero-gradient max-xl:hidden" />
              <div className="pointer-events-none absolute inset-0 halftone-pattern text-white/5 max-xl:hidden" />
            </>
          ) : null}
          <div className="relative z-10 mx-auto flex h-auto w-full min-w-0 max-w-7xl flex-col justify-end px-margin-mobile pb-8 pt-6 xl:h-full xl:px-margin-desktop xl:pb-10 xl:pt-24">
            {!fullPlayback ? (
              <>
                <h1 className="mb-4 max-w-full break-words font-display-lg text-[1.75rem] uppercase leading-[0.95] tracking-tight text-white md:text-display-lg md:leading-none md:tracking-tighter">
                  Messages
                </h1>
              </>
            ) : null}
            {featured ? (
              <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
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

        <MessageBrowser latest={latest} messages={messages} />
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
              <blockquote className="relative max-w-md border-2 border-black bg-surface-container-low px-6 py-5 text-on-surface-variant shadow-[4px_4px_0_#151218] dark:border-white/50">
                <p className="font-body-lg text-body-md leading-relaxed">
                  “What sustains the move of God is text-driven, gospel-saturated, Christ-exalting
                  teaching.”
                </p>
                <cite className="mt-3 block font-label-sm not-italic uppercase tracking-wider text-on-surface">
                  By Pastor David Antwi
                </cite>
              </blockquote>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-gutter">
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
                {
                  label: "Amazon Music",
                  copy: "Listen to Christian teaching on Amazon Music.",
                  cta: "Listen on Amazon Music",
                  href: "https://music.amazon.com/podcasts/60953161-8353-4278-a33c-592454d9157d/messages-by-david-antwi",
                  icon: "music_note",
                  card: "bg-[#232f3e] text-white",
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
      </main>
      <SiteFooter />
      <ThemeToggle />
    </div>
  );
}

export default MessagesPage;
