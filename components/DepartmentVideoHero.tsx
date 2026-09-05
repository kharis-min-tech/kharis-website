"use client";

import { useEffect, useRef, useState } from "react";
import { DEPARTMENTS } from "@/data/departments";

// Add a department video by adding one line here.
const DEPARTMENT_VIDEOS: Record<string, string> = {
  CHOIR: "/assets/Choir-video.mp4",
};

export function DepartmentVideoHero() {
  const [activeName, setActiveName] = useState(DEPARTMENTS[0]?.name ?? "");
  const [visibleName, setVisibleName] = useState(activeName);
  const [faded, setFaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const dept =
    DEPARTMENTS.find((d) => d.name === visibleName) ?? DEPARTMENTS[0]!;
  const src = DEPARTMENT_VIDEOS[dept.name];

  function select(name: string) {
    if (name === activeName) return;
    setActiveName(name);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
    setPlaying(false);
    btnRefs.current[name]?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
    if (reduced) {
      setVisibleName(name);
      return;
    }
    setFaded(true);
    window.setTimeout(() => {
      setVisibleName(name);
      setFaded(false);
    }, 320);
  }

  useEffect(() => {
    setPlaying(false);
  }, [visibleName]);

  return (
    <section className="relative overflow-hidden border-b-4 border-primary bg-on-background text-background px-margin-mobile py-16 md:px-margin-desktop md:py-24">
      <div className="halftone-bg absolute inset-0 pointer-events-none opacity-25" />
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-primary/25 to-transparent" />
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left column */}
        <div className="min-w-0">
          <span className="inline-block bg-secondary-container text-on-secondary-container font-label-md px-4 py-1 border-heavy mb-6 uppercase tracking-widest animate-bounce motion-reduce:animate-none">
            Get Busy Serving God
          </span>
          <h1

            className="font-display-lg mb-4 leading-none text-primary-fixed-dim"
            style={{ fontSize: "clamp(2.5rem, 1.4rem + 5vw, 4rem)" }}
          >
            DEPARTMENTS
          </h1>
          <p
            className="font-headline-md max-w-2xl text-surface-container-low"
            style={{ fontSize: "clamp(1rem, 0.9rem + 0.8vw, 1.5rem)" }}
          >
            Find where your gift meets our mission.
          </p>
          <div className="mt-8 flex gap-4">
            <div className="h-2 w-12 bg-secondary-container" />
            <div className="h-2 w-12 bg-primary" />
            <div className="h-2 w-12 bg-surface" />
          </div>

          {/* Selector strip */}
          <div className="relative mt-8 -mr-margin-mobile md:mr-0">
            <div
              ref={stripRef}
              className="no-scrollbar flex flex-nowrap gap-3 overflow-x-auto pb-2 pr-10"
              role="group"
              aria-label="Choose a department video"
            >
              {DEPARTMENTS.map((d) => {
                const isActive = d.name === activeName;
                const hasVideo = Boolean(DEPARTMENT_VIDEOS[d.name]);
                return (
                  <button
                    key={d.name}
                    ref={(el) => {
                      btnRefs.current[d.name] = el;
                    }}
                    type="button"
                    aria-pressed={isActive}
                    aria-label={`Show ${d.name} video`}
                    onClick={() => select(d.name)}
                    className={`shrink-0 inline-flex items-center gap-2 border-2 border-black font-black uppercase tracking-wider transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      isActive
                        ? "bg-primary text-on-primary shadow-[4px_4px_0_0_#000]"
                        : "bg-transparent text-surface hover:bg-primary hover:text-on-primary"
                    }`}
                    style={{
                      fontSize: "clamp(0.7rem, 0.62rem + 0.4vw, 1rem)",
                      padding: "clamp(0.5rem, 0.42rem + 0.35vw, 0.8rem) clamp(0.8rem, 0.65rem + 0.5vw, 1.2rem)",
                    }}
                  >
                    {hasVideo && (
                      <span
                        className="h-2 w-2 shrink-0 rounded-full bg-primary-fixed-dim"
                        aria-hidden="true"
                      />
                    )}
                    {d.name}
                  </button>
                );
              })}
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-on-background to-transparent"
            />
          </div>
        </div>

        {/* Video frame */}
        <div className="w-full max-w-[min(100%,22rem)] mx-auto lg:max-w-[26rem]">
          <div
            className="group relative w-full max-h-[70svh] overflow-hidden border-4 border-primary bg-on-background shadow-[10px_10px_0_0_var(--primary)] transition-shadow duration-300 hover:shadow-[10px_10px_30px_0_var(--primary)]"
            style={{ aspectRatio: "9 / 16" }}
          >
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                faded ? "opacity-0" : "opacity-100"
              }`}
            >
              {src ? (
                <>
                  <video
                    key={dept.name}
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    src={src}
                    poster={dept.image}
                    controls
                    playsInline
                    preload="metadata"
                    title={`${dept.name} department video`}
                    aria-label={`${dept.name} department video`}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onEnded={() => setPlaying(false)}
                  />
                  <button
                    type="button"
                    aria-label={`Play ${dept.name} video`}
                    onClick={() => videoRef.current?.play()}
                    tabIndex={playing ? -1 : 0}
                    className={`absolute inset-x-0 top-0 bottom-16 grid place-items-center bg-on-background/45 transition-opacity duration-300 ${
                      playing
                        ? "pointer-events-none opacity-0"
                        : "opacity-100"
                    }`}
                  >
                    <span className="grid h-20 w-20 place-items-center rounded-full border-4 border-black bg-primary text-on-primary shadow-[4px_4px_0_0_#000] transition-transform duration-200 group-hover:scale-110">
                      <span className="material-symbols-outlined text-4xl" aria-hidden="true">
                        play_arrow
                      </span>
                    </span>
                  </button>
                </>
              ) : (
                <div className="relative h-full w-full">
                  <img
                    src={dept.image}
                    alt={`${dept.name} department`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-on-background/50 to-primary/30" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
                    <span className="grid h-20 w-20 place-items-center rounded-full border-4 border-surface/40 text-surface/50">
                      <span className="material-symbols-outlined text-4xl" aria-hidden="true">
                        play_arrow
                      </span>
                    </span>
                    <h2 className="font-headline-md text-headline-md leading-none text-surface">
                      {dept.name}
                    </h2>
                    <span className="border-2 border-surface/50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-surface/80">
                      Video coming soon
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
