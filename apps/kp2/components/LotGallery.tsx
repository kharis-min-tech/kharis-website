"use client";

import { useEffect, useState } from "react";
import type { InstagramPost } from "@/lib/instagram";

export type LotClip = {
  kind: "image" | "video";
  src: string;
  alt: string;
  label: string;
  span?: "tall" | "wide";
};

export const LOT_CLIPS: LotClip[] = [
  { kind: "video", src: "/assets/dancing.mp4", alt: "KP2 dancing in worship", label: "The floor is shaking", span: "tall" },
  { kind: "image", src: "/assets/K-dancers-img.jpg", alt: "KP2 dancers", label: "K-Dancers" },
  { kind: "image", src: "/assets/praise-night.jpg", alt: "Praise night", label: "Praise night", span: "wide" },
  { kind: "video", src: "/assets/crowd.mp4", alt: "The room in full voice", label: "The room" },
  { kind: "image", src: "/assets/young-adults.jpg", alt: "Young adults together", label: "The lot" },
  { kind: "image", src: "/assets/sports-day.jpg", alt: "Sports day", label: "Sports day" },
  { kind: "video", src: "/assets/choir2.mp4", alt: "Choir in worship", label: "Choir" },
  { kind: "image", src: "/assets/Spoken-word.jpg", alt: "Spoken word", label: "Spoken word" },
  { kind: "image", src: "/assets/K-music-img.jpg", alt: "KP2 music", label: "K-Music" },
  { kind: "image", src: "/assets/community.jpg", alt: "Community gathering", label: "Family" },
  { kind: "video", src: "/assets/Choir-video.mp4", alt: "Worship set", label: "Worship", span: "wide" },
  { kind: "image", src: "/assets/bass-sunday.jpg", alt: "Bring a soul Sunday", label: "BASS" },
];

function spanClass(span?: LotClip["span"]) {
  if (span === "tall") return "md:row-span-2 min-h-[280px] md:min-h-[420px]";
  if (span === "wide") return "md:col-span-2 min-h-[220px]";
  return "min-h-[220px]";
}

export function LotGallery({
  instagram = [],
  heading = "The lot",
  kicker = "In the room",
}: {
  instagram?: InstagramPost[];
  heading?: string;
  kicker?: string;
}) {
  const [active, setActive] = useState<LotClip | InstagramPost | null>(null);

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const isClip = (item: LotClip | InstagramPost): item is LotClip => "kind" in item;

  return (
    <section id="the-lot" className="relative overflow-hidden bg-[#06070a] text-pearl py-16 md:py-24 scroll-mt-[88px]">
      <div className="vibe-mesh absolute inset-0 opacity-80" />
      <div className="relative z-10 mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop">
        <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/15 px-3 py-1 font-label-md text-[11px] uppercase tracking-[0.2em] text-amber mb-4">
              {kicker}
            </p>
            <h2 className="font-display-xl text-[40px] sm:text-5xl md:text-7xl uppercase leading-[0.9]">
              {heading}{" "}
              <span className="bg-gradient-to-r from-amber via-magenta to-[#d2bbff] bg-clip-text text-transparent">
                in motion
              </span>
            </h2>
            <p className="mt-4 max-w-xl font-body-lg text-[15px] sm:text-body-lg text-white/70">
              Dancing, choir, sports day, praise nights — this is what KP2 actually looks like.
            </p>
          </div>
          <a
            href="https://instagram.com/kharisphasetwo"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 font-label-md text-[12px] uppercase tracking-widest text-white backdrop-blur-md"
          >
            @kharisphasetwo
            <span className="material-symbols-outlined text-[16px]">north_east</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[minmax(180px,auto)] gap-3 md:gap-4">
          {LOT_CLIPS.map((clip, index) => (
            <button
              key={clip.src}
              type="button"
              data-ui="lot-open"
              data-lot-src={clip.src}
              data-lot-kind={clip.kind}
              data-lot-alt={clip.alt}
              onClick={() => setActive(clip)}
              className={`group relative vibe-card text-left ${spanClass(clip.span)} ${index === 0 ? "col-span-2 md:col-span-1" : ""}`}
            >
              {clip.kind === "video" ? (
                <video
                  src={clip.src}
                  muted
                  loop
                  playsInline
                  autoPlay
                  className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
              ) : (
                <img
                  src={clip.src}
                  alt={clip.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 font-label-md text-[10px] uppercase tracking-widest text-amber backdrop-blur-md">
                {clip.kind === "video" ? "Video" : "Photo"}
              </span>
              <span className="absolute bottom-3 left-3 right-3 font-display-lg text-[18px] sm:text-[22px] uppercase leading-tight text-white">
                {clip.label}
              </span>
            </button>
          ))}

          {instagram.slice(0, 4).map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noreferrer"
              className="group relative min-h-[220px] vibe-card"
            >
              <img
                src={post.image}
                alt={post.caption || "KP2 on Instagram"}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-magenta/80 px-2.5 py-1 font-label-md text-[10px] uppercase tracking-widest text-white">
                Instagram
              </span>
            </a>
          ))}
        </div>
      </div>

      {active ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/85"
            aria-label="Close gallery"
            onClick={() => setActive(null)}
          />
          <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-black">
            {isClip(active) && active.kind === "video" ? (
              <video src={active.src} controls autoPlay className="w-full max-h-[80vh] object-contain" />
            ) : (
              <img
                src={isClip(active) ? active.src : active.image}
                alt={isClip(active) ? active.alt : active.caption}
                className="w-full max-h-[80vh] object-contain"
              />
            )}
          </div>
        </div>
      ) : null}

      <dialog id="lot-lightbox" className="ui-dialog w-[min(56rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-white/10 bg-black p-0">
        <button
          type="button"
          data-ui="close-dialog"
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-amber text-[#1a0b00]"
          aria-label="Close gallery"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <div data-lot-stage className="bg-black" />
      </dialog>
    </section>
  );
}
