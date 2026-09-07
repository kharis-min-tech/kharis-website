"use client";

import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
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
        <section className="relative w-full h-[min(32rem,calc(100svh-5rem))] min-h-[20rem] bg-[#06070a] overflow-hidden">
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
          <div className="absolute inset-0 hero-gradient pointer-events-none" />
          <div className="absolute inset-0 vibe-mesh opacity-30 pointer-events-none" />
          <div className="relative z-10 h-full flex flex-col justify-end px-margin-mobile md:px-margin-desktop pb-8 md:pb-10 max-w-7xl mx-auto pointer-events-none">
            <div className="inline-block rounded-full bg-amber text-[#1a0b00] font-label-md px-4 py-1 mb-3 uppercase w-fit">
              Latest Message
            </div>
            <h1 className="font-display-lg text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] text-white leading-[0.95] uppercase mb-3 tracking-tighter">
              {featured ? displayMessageTitle(featured.title) : "Messages"}
            </h1>
            <p className="font-body-lg text-base md:text-body-lg text-white/80 max-w-2xl mb-5">
              {featured
                ? "The newest teaching from Pastor David Antwi. Watch here or on YouTube."
                : "Teachings from Pastor David Antwi will appear here as they go live."}
            </p>
            {featured ? (
              <div className="flex flex-wrap gap-4 pointer-events-auto">
                <a
                  href="#latest-message"
                  className="bg-primary text-white font-headline-md px-8 py-4 rounded-2xl border border-on-background/10 hard-shadow flex items-center gap-3 btn-press group"
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
                  className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md font-headline-md px-8 py-4 flex items-center gap-3"
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
              <div className="lg:col-span-8 bg-surface rounded-2xl border border-on-background/10 neo-shadow-lg overflow-hidden">
                <div className="aspect-video relative bg-black">
                  <YoutubeEmbed id={featured.id} title={featured.title} thumbnail={featured.thumbnail} />
                </div>
              </div>
              <div className="lg:col-span-4 bg-surface-container rounded-2xl border border-on-background/10 neo-shadow p-6 flex flex-col">
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
                  className="mt-auto w-full bg-primary text-on-primary font-label-md py-3 rounded-2xl border border-on-background/10 neo-shadow hover-press flex items-center justify-center gap-2"
                />
              </div>
            </div>
          </section>
        ) : null}

        <section className="bg-surface-container-high border-b border-on-background/10">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-4 flex flex-wrap items-center justify-between gap-gutter">
            <span className="font-label-md text-label-md uppercase flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">smart_display</span>
              From @davidantwi
            </span>
            <div className="relative w-full md:w-64">
              <input
                className="w-full bg-white rounded-2xl border border-on-background/10 font-label-sm px-4 py-2 focus:ring-2 focus:ring-secondary-container outline-none"
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
                  className="group rounded-2xl border border-on-background/10 bg-surface-container-lowest vibe-card hover:translate-y-[-4px] transition-all"
                >
                  <div className="relative aspect-video overflow-hidden">
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
                      <span className="bg-secondary-container text-on-secondary-container text-[10px] font-label-md px-2 py-0.5 rounded-full uppercase">
                        YouTube
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md leading-tight mb-2 uppercase group-hover:text-primary transition-colors">
                      {displayMessageTitle(msg.title)}
                    </h3>
                    <div className="flex items-center justify-between border-t border-on-background/10 pt-4">
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

        <section className="bg-surface-container border-y border-on-background/10">
          <div className="max-w-7xl mx-auto px-margin-desktop py-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="inline-block bg-secondary-container text-on-secondary-container rounded-2xl border border-on-background/10 font-label-sm uppercase px-3 py-1 hard-shadow-sm mb-4">
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
                  className="group bg-surface-container-high rounded-2xl border border-on-background/10 neo-shadow hover-press flex flex-col p-6"
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

        <section className="bg-[#06070a] text-white relative overflow-hidden">
          <div className="vibe-mesh absolute inset-0" />
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16 relative z-10 flex flex-col md:flex-row items-center justify-between gap-gutter">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="font-display-lg text-headline-lg leading-tight uppercase mb-4">Never Miss A Word</h2>
              <p className="font-body-lg text-body-lg text-white/75">
                Subscribe to get the latest messages, series notes, and study guides delivered straight to your inbox.
              </p>
            </div>
            <form className="flex w-full md:w-auto gap-3 mt-8 md:mt-0" onSubmit={(e) => e.preventDefault()}>
              <input
                className="flex-1 md:w-80 rounded-2xl border border-white/15 bg-white/10 text-white placeholder:text-white/50 font-label-sm px-6 py-4 outline-none"
                placeholder="YOUR EMAIL ADDRESS"
                type="email"
              />
              <button type="submit" className="rounded-2xl bg-amber text-[#1a0b00] font-headline-md text-base px-5 sm:px-8 py-4 vibe-glow uppercase">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export default MessagesPage;
