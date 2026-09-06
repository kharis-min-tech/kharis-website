"use client";

import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { YoutubeEmbed } from "@/components/YoutubeEmbed";
import { ShareVideoButton } from "@/components/ShareVideoButton";
import { MutedHeroVideo } from "@/components/MutedHeroVideo";
import {
  displayMessageTitle,
  formatMessageDate,
  youtubeWatchUrl,
  type MessageVideo,
} from "@/lib/youtube";

function MessagesPage({ messages }: { messages: MessageVideo[] }) {
  const featured = messages[0];
  const rest = messages.slice(1);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rest;
    return rest.filter((m) => m.title.toLowerCase().includes(q));
  }, [query, rest]);

  return (
    <div className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <SiteHeader />
      <main className="pt-20">
        <section className="relative w-full min-h-[520px] md:h-[819px] bg-on-background overflow-hidden border-b-4 border-black">
          {featured ? (
            <MutedHeroVideo
              id={featured.id}
              thumbnail={featured.thumbnail}
              title={featured.title}
            />
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{ backgroundImage: "url('/assets/pastor-stage.jpg')" }}
            />
          )}
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 halftone-pattern text-white/5 pointer-events-none" />
          <div className="relative z-10 h-full min-h-[520px] flex flex-col justify-end px-margin-desktop pb-16 max-w-7xl mx-auto">
            <div className="inline-block bg-secondary-container text-on-secondary-container font-label-md px-4 py-1 border-2 border-black mb-6 uppercase w-fit">
              Latest Message
            </div>
            <h1 className="font-display-lg text-display-lg text-white leading-none uppercase mb-4 tracking-tighter">
              {featured ? displayMessageTitle(featured.title) : "Messages"}
            </h1>
            <p className="font-body-lg text-body-lg text-white/80 max-w-2xl mb-8">
              {featured
                ? "The newest teaching from Pastor David Antwi. Watch here or on YouTube."
                : "Teachings from Pastor David Antwi will appear here as they go live."}
            </p>
            {featured ? (
              <div className="flex flex-wrap gap-4">
                <a
                  href="#latest-message"
                  className="bg-primary text-white font-headline-md px-8 py-4 border-2 border-black hard-shadow flex items-center gap-3 btn-press group"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    play_arrow
                  </span>
                  WATCH NOW
                </a>
                <a
                  href={youtubeWatchUrl(featured.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="keep-light font-headline-md px-8 py-4 border-2 border-black hard-shadow flex items-center gap-3 btn-press"
                >
                  <span className="material-symbols-outlined">smart_display</span>
                  YOUTUBE
                </a>
              </div>
            ) : null}
          </div>
        </section>

        {featured ? (
          <section id="latest-message" className="max-w-7xl mx-auto px-margin-desktop py-16 scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-4 h-8 bg-primary" />
              <h2 className="font-headline-md text-headline-md uppercase">Latest Message</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
              <div className="lg:col-span-8 bg-surface border-2 border-black neo-shadow-lg overflow-hidden">
                <div className="aspect-video relative bg-black">
                  <YoutubeEmbed id={featured.id} title={featured.title} thumbnail={featured.thumbnail} />
                </div>
              </div>
              <div className="lg:col-span-4 bg-surface-container border-2 border-black neo-shadow p-6 flex flex-col">
                <h4 className="font-label-md text-primary mb-2">NOW PLAYING</h4>
                <h3 className="font-headline-md text-3xl uppercase mb-4">
                  {displayMessageTitle(featured.title)}
                </h3>
                <p className="font-body-md text-on-surface-variant mb-6">{featured.title}</p>
                <div className="space-y-3 mb-6">
                  {featured.publishedAt ? (
                    <div className="flex items-center gap-3 font-label-sm text-on-surface">
                      <span className="material-symbols-outlined text-primary">calendar_today</span>
                      <span>{formatMessageDate(featured.publishedAt)}</span>
                    </div>
                  ) : null}
                  <div className="flex items-center gap-3 font-label-sm text-on-surface">
                    <span className="material-symbols-outlined text-primary">person</span>
                    <span>Pastor David Antwi</span>
                  </div>
                </div>
                <ShareVideoButton
                  id={featured.id}
                  title={featured.title}
                  className="mt-auto w-full bg-primary text-on-primary font-label-md py-3 border-2 border-black neo-shadow hover-press flex items-center justify-center gap-2"
                />
              </div>
            </div>
          </section>
        ) : null}

        <section className="bg-surface-container-high border-b-2 border-black sticky top-20 z-40">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-4 flex flex-wrap items-center justify-between gap-gutter">
            <span className="font-label-md text-label-md uppercase flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">smart_display</span>
              From @davidantwi
            </span>
            <div className="relative w-full md:w-64">
              <input
                className="w-full bg-white border-2 border-black font-label-sm px-4 py-2 focus:ring-2 focus:ring-secondary-container outline-none"
                placeholder="SEARCH MESSAGES..."
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary">
                search
              </span>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-margin-desktop py-16">
          {filtered.length === 0 ? (
            <p className="font-body-lg text-on-surface-variant">No messages match that search.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filtered.map((msg) => (
                <a
                  key={msg.id}
                  href={youtubeWatchUrl(msg.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="group border-2 border-black bg-white hard-shadow hover:translate-y-[-4px] transition-all"
                >
                  <div className="relative aspect-video border-b-2 border-black overflow-hidden">
                    <img
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={msg.thumbnail}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex gap-2 mb-3">
                      <span className="bg-secondary-container text-on-secondary-container text-[10px] font-label-md px-2 py-0.5 border border-black uppercase">
                        YouTube
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md leading-tight mb-2 uppercase group-hover:text-primary transition-colors">
                      {displayMessageTitle(msg.title)}
                    </h3>
                    <div className="flex items-center justify-between border-t-2 border-black/10 pt-4">
                      <span className="font-label-sm text-xs uppercase">Pastor David Antwi</span>
                      {msg.publishedAt ? (
                        <span className="font-label-sm text-[10px] text-outline uppercase">
                          {formatMessageDate(msg.publishedAt)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        <section className="bg-surface-container border-y-4 border-black">
          <div className="max-w-7xl mx-auto px-margin-desktop py-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="inline-block bg-secondary-container text-on-secondary-container border-2 border-black font-label-sm uppercase px-3 py-1 hard-shadow-sm mb-4">
                  Listen Anywhere
                </span>
                <h2 className="font-display-lg text-headline-lg leading-tight uppercase">Other Ways To Listen</h2>
              </div>
              <p className="font-body-lg text-body-md text-on-surface-variant max-w-md">
                Catch every message on your favourite platform — or take Kharis with you in the app.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {[
                { label: "Spotify", copy: "Stream the podcast and follow every series.", cta: "Listen on Spotify", href: "https://open.spotify.com/", icon: "podcasts" },
                { label: "SoundCloud", copy: "Audio archive of past teachings and sessions.", cta: "Play on SoundCloud", href: "https://soundcloud.com/", icon: "graphic_eq" },
                { label: "YouTube", copy: "Watch full services, clips and live streams.", cta: "Watch on YouTube", href: "https://youtube.com/@davidantwi", icon: "smart_display" },
                { label: "Kharis App", copy: "Messages, notes and giving in one place.", cta: "Get the App", href: "/#app-stores", icon: "smartphone" },
              ].map(({ label, copy, cta, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                  className="group bg-surface-container-high border-2 border-black neo-shadow hover-press flex flex-col p-6"
                >
                  <span className="material-symbols-outlined text-4xl mb-4">{icon}</span>
                  <h3 className="font-headline-md text-title-lg uppercase mb-2">{label}</h3>
                  <p className="font-body-lg text-body-md text-on-surface-variant flex-1">{copy}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-label-sm uppercase">
                    {cta}
                    <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary text-white border-y-4 border-black relative overflow-hidden">
          <div className="absolute inset-0 halftone-pattern opacity-10" />
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16 relative z-10 flex flex-col md:flex-row items-center justify-between gap-gutter">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="font-display-lg text-headline-lg leading-tight uppercase mb-4">Never Miss A Word</h2>
              <p className="font-body-lg text-body-lg text-primary-fixed">
                Subscribe to get the latest messages, series notes, and study guides delivered straight to your inbox.
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-0 mt-8 md:mt-0">
              <input
                className="flex-1 md:w-80 bg-white border-2 border-black text-black font-label-sm px-6 py-4 focus:ring-4 focus:ring-secondary-container outline-none"
                placeholder="YOUR EMAIL ADDRESS"
                type="email"
              />
              <button className="bg-on-background text-white font-headline-md text-base px-5 sm:px-8 py-4 border-2 border-l-0 shrink-0 border-black hard-shadow btn-press uppercase">
                Subscribe
              </button>
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
