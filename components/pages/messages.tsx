"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NewsletterSignup } from "@/components/NewsletterSignup";
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

  return (
    <div className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <SiteHeader />
      <main>
        <section className="relative box-border w-full h-svh max-h-svh overflow-hidden bg-on-background border-b-4 border-black">
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
          <div className="absolute inset-0 halftone-pattern text-white/5 pointer-events-none" />
          <div className="relative z-10 h-full flex flex-col justify-end px-margin-mobile md:px-margin-desktop pt-24 pb-8 md:pb-10 max-w-7xl mx-auto">
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

        <section className="max-w-7xl mx-auto px-margin-desktop py-16">
          {rest.length === 0 ? (
            <p className="font-body-lg text-on-surface-variant">More messages will appear here as they are published.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {rest.map((msg) => (
                <a
                  key={msg.id}
                  href={youtubeWatchUrl(msg.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="group border-2 border-black bg-white text-on-background hard-shadow hover:translate-y-[-4px] hover:bg-[#2a2a2a] hover:text-white transition-all"
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
                    <h3 className="font-headline-md text-headline-md leading-tight mb-2 uppercase">
                      {displayMessageTitle(msg.title)}
                    </h3>
                    <div className="flex items-center justify-between border-t-2 border-black/10 pt-4">
                      <span className="font-label-sm text-xs uppercase">Pastor David Antwi</span>
                      {msg.publishedAt ? (
                        <span className="font-label-sm text-[10px] text-outline uppercase group-hover:text-white/70">
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
                { label: "Kharis App", copy: "Messages, notes and giving in one place.", cta: "Get the App", href: "/#app-stores", icon: "smartphone" },
                { label: "Spotify", copy: "Stream the podcast and follow every series.", cta: "Listen on Spotify", href: "https://open.spotify.com/", icon: "podcasts" },
                { label: "SoundCloud", copy: "Audio archive of past teachings and sessions.", cta: "Play on SoundCloud", href: "https://soundcloud.com/", icon: "graphic_eq" },
                { label: "YouTube", copy: "Watch full services, clips and live streams.", cta: "Watch on YouTube", href: "https://youtube.com/@davidantwi", icon: "smart_display" },
              ].map(({ label, copy, cta, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                  className="group bg-primary text-on-primary border-2 border-black rounded-none neo-shadow hover-press flex flex-col p-6 no-accent-fill"
                >
                  <span className="material-symbols-outlined text-4xl mb-4 !text-primary-fixed">{icon}</span>
                  <h3 className="font-headline-md text-title-lg uppercase mb-2 text-on-primary">{label}</h3>
                  <p className="font-body-lg text-body-md !text-primary-fixed flex-1">{copy}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-label-sm uppercase text-on-primary">
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
