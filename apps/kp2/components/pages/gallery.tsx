"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";

const PLACEHOLDERS = [
  {
    src: "/kp2/assets/worship.jpg",
    alt: "Worship at Kharis Phase 2",
    quote: "Preach Christ Crucified.",
    wide: true,
  },
  { src: "/kp2/assets/young-adults.jpg", alt: "Young adults together", quote: "Get busy serving!" },
  { src: "/kp2/assets/community.jpg", alt: "Community gathering", quote: null },
  { src: null, alt: "Photo coming soon", quote: "We are passionate about God and His word." },
  { src: "/kp2/assets/praise-night.jpg", alt: "Praise night", quote: null },
  {
    src: "/kp2/assets/bass-sunday.jpg",
    alt: "Bring a soul Sunday",
    quote: "Preach Christ Crucified.",
  },
  { src: "/kp2/assets/choir2.mp4", alt: "Choir in worship", quote: null, video: true },
  {
    src: null,
    alt: "Photo coming soon",
    quote: "Your hunger and zeal for God is your greatest advantage as a believer.",
  },
  { src: "/kp2/assets/sports-day.jpg", alt: "Sports day", quote: "Get busy serving!" },
  {
    src: "/kp2/assets/leadership-pastors-together.jpg",
    alt: "Pastors David and Awo Antwi",
    quote: null,
    wide: true,
  },
];

function GalleryPage() {
  return (
    <div className="bg-background text-on-background font-body-md overflow-x-hidden">
      <SiteHeader />
      <main className="pt-20">
        <header className="relative min-h-[420px] md:min-h-[520px] flex items-end bg-on-background text-white overflow-hidden border-b-4 border-primary">
          <img
            src="/kp2/assets/events-hero-worship.jpg"
            alt="Kharis Phase 2 congregation in worship"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="relative z-10 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full py-16">
            <span className="inline-block bg-secondary-container text-on-secondary-container font-label-md px-4 py-1 border-2 border-black uppercase tracking-widest mb-6">
              Preach Christ Crucified.
            </span>
            <h1 className="font-display-lg text-display-lg uppercase leading-none mb-4">Gallery</h1>
            <p className="font-body-lg text-body-lg text-white/85 max-w-2xl">
              Moments from the house. Worship, fellowship, and a people who get busy serving.
            </p>
          </div>
        </header>

        <section className="py-16 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
          <blockquote className="border-l-8 border-primary bg-surface-container-low p-6 md:p-10 mb-12 brutalist-border">
            <p className="font-headline-md text-2xl md:text-3xl uppercase leading-snug mb-4">
              What it takes to sustain the move of God is a text-driven, gospel-saturated,
              Christ-exalting message.
            </p>
            <p className="font-label-md uppercase tracking-widest text-primary">House word</p>
          </blockquote>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {PLACEHOLDERS.map((item, i) => (
              <figure
                key={`${item.alt}-${i}`}
                className={`relative overflow-hidden border-2 border-on-background brutalist-shadow bg-surface-container-highest min-h-[260px] ${
                  item.wide ? "lg:col-span-2" : ""
                }`}
              >
                {item.video && item.src ? (
                  <video
                    src={item.src}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : item.src ? (
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-container-low text-on-surface-variant px-6 text-center">
                    <span className="material-symbols-outlined text-5xl">image</span>
                    <p className="font-label-md uppercase tracking-widest">Photo coming soon</p>
                  </div>
                )}
                {item.quote ? (
                  <figcaption className="absolute bottom-0 left-0 right-0 bg-on-background/80 text-white p-4 font-label-md uppercase tracking-wide">
                    {item.quote}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
      <ThemeToggle />
    </div>
  );
}

export default GalleryPage;
