"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollReveal } from "@/components/ScrollReveal";

import { ThemeToggle } from "@/components/ThemeToggle";



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
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.45a.78.78 0 0 1-1.07.26c-2.93-1.79-6.6-2.2-10.94-1.21a.78.78 0 1 1-.35-1.52c4.72-1.08 8.79-.61 12.06 1.39.37.23.49.71.3 1.08Zm1.23-2.98a.97.97 0 0 1-1.34.32c-3.35-2.06-8.46-2.66-12.42-1.46a.97.97 0 1 1-.56-1.86c4.52-1.37 10.15-.7 14 1.66.46.28.6.88.32 1.34Zm.11-3.1c-4.02-2.39-10.65-2.61-14.49-1.44a1.17 1.17 0 1 1-.68-2.24C7.2 5.35 14.52 5.6 19.15 8.35a1.17 1.17 0 0 1-1.2 2.01Z" />
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

/* ---------------- data ---------------- */

const SOCIALS = [
  {
    label: "Instagram",
    handle: "@kharisphasetwo",
    copy: "Daily reels, service moments and behind-the-scenes.",
    href: "https://instagram.com/kharisphasetwo",
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
    band: "bg-error-container text-on-error-container",
  },
  {
    label: "Spotify",
    handle: "Davidantwi",
    copy: "Every sermon as a podcast — press play on your commute.",
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

const POSTS = [
  {
    img: "/assets/events-sunday-service.jpg",
    caption: "Sunday was a whole atmosphere. Swipe for the highlights.",
    platform: "Instagram",
    Icon: InstagramIcon,
  },
  {
    img: "/assets/worship.jpg",
    caption: "Wildfire Praise — live worship recorded in the room.",
    platform: "Instagram",
    Icon: InstagramIcon,
  },
  {
    img: "/assets/young-adults.jpg",
    caption: "Fellowship nights hit different. Find one near you.",
    platform: "Instagram",
    Icon: InstagramIcon,
  },
  {
    img: "/assets/community.jpg",
    caption: "Family photo dump from the community outreach.",
    platform: "Instagram",
    Icon: InstagramIcon,
  },
  {
    img: "/assets/branch-slide-1.jpg",
    caption: "New branch, same grace. Kharis is growing.",
    platform: "Instagram",
    Icon: InstagramIcon,
  },
  {
    img: "/assets/testimony-1.jpg",
    caption: "Testimony Tuesday — God is still doing it.",
    platform: "Instagram",
    Icon: InstagramIcon,
  },
];

const EPISODES = [
  {
    title: "The Gravity of Grace",
    meta: "Sunday Service · 48 min",
    copy: "Grace is not a licence, it's an anchor. A deep dive into unmerited favour.",
  },
  {
    title: "Built to Carry Weight",
    meta: "Midweek Teaching · 36 min",
    copy: "Why God grows your capacity before He grows your platform.",
  },
  {
    title: "Small Church, Big Family",
    meta: "Fellowship Series · 29 min",
    copy: "As the church gets bigger, it must get smaller. Here's how.",
  },
];

/* ---------------- page ---------------- */

function MediaPage() {
  return (
    <div className="bg-background text-on-background font-body-md selection:bg-secondary-container selection:text-on-secondary-container overflow-x-hidden">
      <ScrollReveal />
      <SiteHeader />

      <header className="relative min-h-[440px] md:min-h-[520px] flex flex-col justify-center items-center bg-on-background text-on-primary-fixed pt-28 md:pt-32 pb-stack-lg overflow-hidden border-b-4 border-primary">
        <img
          alt="Kharis worship gathering"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          src="/assets/worship.jpg"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 pointer-events-none"></div>
        <div className="absolute inset-0 halftone-bg pointer-events-none"></div>

        <div className="container mx-auto px-margin-mobile relative z-10 text-center">
          <span className="inline-block bg-secondary-container text-on-background font-label-sm px-3 py-1 border-2 border-black -rotate-2 mb-4">
            FOLLOW · WATCH · LISTEN
          </span>
          <h1 className="font-display-lg text-6xl md:text-[72px] text-primary-fixed uppercase tracking-tight mb-4">
            SOCIALS &amp; MEDIA
          </h1>
          <p className="font-body-lg text-primary-fixed-dim max-w-xl mx-auto mb-stack-md">
            Everywhere Kharis lives online. Follow the feeds, and tune into messages
            from our head pastor on YouTube, Spotify and SoundCloud.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#follow"
              className="bg-primary text-on-primary font-label-md px-8 py-4 border-2 border-black neo-shadow hover-press"
            >
              FOLLOW US
            </a>
            <a
              href="#listen"
              className="bg-surface text-on-surface font-label-md px-8 py-4 border-2 border-black neo-shadow hover-press"
            >
              LISTEN TO MESSAGES
            </a>
          </div>
        </div>
      </header>

      <main className="bg-surface relative">
        <div className="absolute inset-0 halftone-bg pointer-events-none"></div>

        {/* Follow us */}
        <section id="follow" className="container mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg relative z-10 scroll-mt-28">
          <div className="flex items-center gap-4 mb-stack-md">
            <div className="w-4 h-8 bg-primary"></div>
            <h2 className="font-headline-md text-headline-md uppercase">Follow the movement</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {SOCIALS.map(({ label, handle, copy, href, cta, Icon, band }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                className="group bg-surface-container border-2 border-black neo-shadow hover-press flex flex-col"
              >
                <div className={`${band} border-b-2 border-black p-6 flex items-center gap-4`}>
                  <Icon className="w-10 h-10 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  <div>
                    <h3 className="font-headline-md text-2xl uppercase leading-none">{label}</h3>
                    <p className="font-label-sm opacity-80">{handle}</p>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="font-body-md text-on-surface-variant mb-6">{copy}</p>
                  <span className="mt-auto font-label-md text-primary flex items-center gap-2">
                    {cta}
                    <span className="material-symbols-outlined transition-transform duration-200 group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </span>
                </div>
              </a>
            ))}

            <div className="bg-primary text-on-primary border-2 border-black neo-shadow p-6 flex flex-col justify-center">
              <h3 className="font-headline-md text-2xl uppercase mb-2">Tag us</h3>
              <p className="font-body-md text-primary-fixed mb-4">
                Use <strong>#KharisPhase2</strong> and we might reshare your moment.
              </p>
              <span className="material-symbols-outlined text-4xl">campaign</span>
            </div>
          </div>
        </section>

        {/* Social feed */}
        <section className="relative z-10 bg-surface-container-low border-y-4 border-on-background py-stack-lg">
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-gutter mb-stack-md">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-4 h-8 bg-secondary-container"></div>
                  <h2 className="font-headline-md text-headline-md uppercase">Latest posts</h2>
                </div>
                <p className="font-body-md text-on-surface-variant">
                  Straight from our Instagram page.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://instagram.com/kharisphasetwo"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="bg-secondary-container text-on-background font-label-sm px-4 py-2 border-2 border-black neo-shadow hover-press flex items-center gap-2"
                >
                  <InstagramIcon className="w-4 h-4" /> INSTAGRAM
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {POSTS.map((post) => (
                <article
                  key={post.caption}
                  className="bg-surface border-2 border-black neo-shadow overflow-hidden group flex flex-col"
                >
                  <div className="aspect-square overflow-hidden border-b-2 border-black relative">
                    <img
                      alt={post.caption}
                      src={post.img}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 right-3 bg-surface text-on-surface border-2 border-black p-2 flex items-center justify-center">
                      <post.Icon className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col gap-3">
                    <p className="font-body-md text-on-surface line-clamp-2">{post.caption}</p>
                    <span className="font-label-sm text-on-surface-variant mt-auto">
                      {post.platform}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Listen to the pastor */}
        <section id="listen" className="container mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg relative z-10 scroll-mt-28">
          <div className="flex items-center gap-4 mb-stack-md">
            <div className="w-4 h-8 bg-primary"></div>
            <h2 className="font-headline-md text-headline-md uppercase">Messages from our head pastor</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <div className="lg:col-span-7 bg-surface border-2 border-black neo-shadow-lg overflow-hidden group">
              <div className="aspect-video relative bg-black">
                <img
                  alt="Senior Pastor preaching"
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  src="/assets/pastor-stage.jpg"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-secondary-container p-6 rounded-full border-4 border-black neo-shadow group-hover:scale-110 transition-transform">
                    <span
                      className="material-symbols-outlined text-4xl leading-none text-on-background"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      play_arrow
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <span className="bg-secondary text-on-secondary font-label-sm px-2 py-1 mb-2 inline-block border border-black">
                    NEWEST RELEASE
                  </span>
                  <h3 className="font-headline-md text-white text-2xl uppercase">The Gravity of Grace</h3>
                </div>
              </div>
              <div className="p-6 border-t-2 border-black">
                <p className="font-body-md text-on-surface-variant mb-6">
                  Preached by Senior Pastor D. Antwi. Watch the full message on YouTube, or
                  take the audio with you on Spotify and SoundCloud.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://youtube.com/@davidantwi"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="bg-error-container text-on-error-container font-label-md px-6 py-3 border-2 border-black neo-shadow hover-press flex items-center gap-2"
                  >
                    <YouTubeIcon className="w-5 h-5" /> WATCH
                  </a>
                  <a
                    href="https://open.spotify.com/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="bg-tertiary-container text-on-tertiary-container font-label-md px-6 py-3 border-2 border-black neo-shadow hover-press flex items-center gap-2"
                  >
                    <SpotifyIcon className="w-5 h-5" /> SPOTIFY
                  </a>
                  <a
                    href="https://soundcloud.com/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="bg-surface-container-highest text-on-surface font-label-md px-6 py-3 border-2 border-black neo-shadow hover-press flex items-center gap-2"
                  >
                    <SoundCloudIcon className="w-5 h-5" /> SOUNDCLOUD
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-gutter">
              {EPISODES.map((ep) => (
                <article
                  key={ep.title}
                  className="bg-surface-container border-2 border-black neo-shadow hover-press p-6 flex-1"
                >
                  <h4 className="font-label-md text-primary mb-1">{ep.meta}</h4>
                  <h3 className="font-headline-md text-2xl uppercase mb-2">{ep.title}</h3>
                  <p className="font-body-md text-on-surface-variant mb-4">{ep.copy}</p>
                  <div className="flex gap-2">
                    <a
                      href="https://open.spotify.com/"
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`Listen to ${ep.title} on Spotify`}
                      className="w-11 h-11 bg-surface border-2 border-black flex items-center justify-center hover:bg-tertiary-container transition-colors"
                    >
                      <SpotifyIcon className="w-5 h-5" />
                    </a>
                    <a
                      href="https://soundcloud.com/"
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`Listen to ${ep.title} on SoundCloud`}
                      className="w-11 h-11 bg-surface border-2 border-black flex items-center justify-center hover:bg-secondary-container transition-colors"
                    >
                      <SoundCloudIcon className="w-5 h-5" />
                    </a>
                    <a
                      href="https://youtube.com/@davidantwi"
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`Watch ${ep.title} on YouTube`}
                      className="w-11 h-11 bg-surface border-2 border-black flex items-center justify-center hover:bg-error-container transition-colors"
                    >
                      <YouTubeIcon className="w-5 h-5" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="relative z-10 pb-stack-lg container mx-auto px-margin-mobile">
          <div className="bg-primary text-on-primary border-4 border-black p-stack-md flex flex-col md:flex-row items-center gap-gutter relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 halftone-bg opacity-10 -mr-32 -mt-32 rounded-full"></div>
            <div className="relative z-10 md:w-1/2">
              <h2 className="font-headline-md text-4xl uppercase mb-4">Never Miss a Word</h2>
              <p className="font-body-lg text-primary-fixed">
                Get an email when a new message drops on YouTube, Spotify or SoundCloud.
              </p>
            </div>
            <div className="relative z-10 md:w-1/2 w-full">
              <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  className="flex-1 bg-surface text-on-background border-2 border-black px-4 py-3 font-label-md focus:ring-0"
                  placeholder="Your email address"
                  type="email"
                  aria-label="Email address"
                />
                <button
                  className="bg-secondary-container text-on-background px-8 py-3 border-2 border-black font-headline-md uppercase neo-shadow hover-press"
                  type="submit"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <ThemeToggle />
    </div>
  );
}

export default MediaPage;
