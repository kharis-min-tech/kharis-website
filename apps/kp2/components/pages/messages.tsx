"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { MessageBrowser } from "@/components/MessageBrowser";
import "@/components/listen-row.css";
import { MutedHeroVideo } from "@/components/MutedHeroVideo";
import { displayMessageTitle, youtubeWatchUrl, type MessageVideo } from "@/lib/youtube";

function MessagesPage({ messages }: { messages: MessageVideo[] }) {
  const featured = messages[0];
  const listenRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = listenRef.current;
    if (!section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (reduce.matches) {
        section.style.setProperty("--listen", "1");
        return;
      }
      const top = section.getBoundingClientRect().top;
      const start = window.innerHeight * 0.96;
      const end = window.innerHeight * 0.22;
      const progress = Math.min(1, Math.max(0, (start - top) / (start - end)));
      section.style.setProperty("--listen", progress.toFixed(3));
    };
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduce.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduce.removeEventListener("change", onScroll);
    };
  }, []);

  return (
    <div className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <SiteHeader />
      <main>
        <section className="kp-messages-hero relative box-border w-full h-svh max-h-svh overflow-hidden bg-on-background border-b-4 border-black">
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
                  "url('https://images.kharis.org/site-images/kp2/ffbe5aca25d25b8c/pastor-stage.jpg')",
              }}
            />
          )}
          <div className="absolute inset-0 hero-gradient pointer-events-none" />
          <div className="absolute inset-0 halftone-pattern text-white/5 pointer-events-none" />
          <div className="relative z-10 h-full flex flex-col justify-end px-margin-mobile md:px-margin-desktop pt-24 pb-8 md:pb-10 max-w-7xl mx-auto">
            <div className="inline-block bg-secondary-container text-on-secondary-container font-label-md px-4 py-1 border-2 border-black mb-6 uppercase w-fit">
              Hunger &amp; Zeal for God
            </div>
            <h1 className="font-display-lg text-display-lg text-white leading-none uppercase mb-4 tracking-tighter">
              {featured ? displayMessageTitle(featured.title) : "Messages"}
            </h1>
            <p className="font-body-lg text-body-lg text-white/80 max-w-2xl mb-8">
              {featured
                ? "Your hunger and zeal for God is your greatest advantage as a believer. Watch the newest teaching from Pastor David Antwi here or on YouTube."
                : "Your hunger and zeal for God is your greatest advantage as a believer. Teachings from Pastor David Antwi will appear here as they go live."}
            </p>
            {featured ? (
              <div className="flex flex-wrap gap-4">
                <a
                  href="#latest-messages"
                  className="kp-depth-button kp-button-purple bg-primary text-white font-headline-md px-8 py-4 border-2 border-black hard-shadow flex items-center gap-3 btn-press group"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    play_arrow
                  </span>
                  WATCH NOW
                </a>
                <a
                  href={youtubeWatchUrl(featured.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="kp-depth-button kp-button-light keep-light font-headline-md px-8 py-4 border-2 border-black hard-shadow flex items-center gap-3 btn-press"
                >
                  <span className="material-symbols-outlined">smart_display</span>
                  YOUTUBE
                </a>
              </div>
            ) : null}
          </div>
        </section>

        <MessageBrowser messages={messages} />

        <section
          ref={listenRef}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
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
