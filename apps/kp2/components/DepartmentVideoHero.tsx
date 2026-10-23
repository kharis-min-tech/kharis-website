"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TypedText } from "@/components/TypedText";
import { DEPARTMENTS } from "@/data/departments";

// Add a department video by adding one line here.
const DEPARTMENT_VIDEOS: Record<string, string> = {
  CHOIR: "/kp2/assets/Choir-video.mp4",
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

  const dept = DEPARTMENTS.find((d) => d.name === visibleName) ?? DEPARTMENTS[0]!;
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

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
    } else {
      v.pause();
    }
  }

  return (
    <section className="kp-dept-hero relative overflow-hidden border-b-4 border-primary bg-[#151218] text-white">
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${faded ? "opacity-0" : "opacity-100"}`}
      >
        <img
          src={dept.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: dept.imagePosition ?? "center" }}
        />
        {src ? (
          <div className="kp-dept-hero__stage">
            <video
              key={dept.name}
              ref={videoRef}
              className={playing ? "is-playing" : undefined}
              src={src}
              poster={dept.image}
              playsInline
              preload="metadata"
              title={`${dept.name} department video`}
              aria-label={`${dept.name} department video`}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
            />
          </div>
        ) : null}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#151218]/88 via-[#151218]/45 to-[#151218]/25" />

      {src ? (
        <div className="kp-dept-hero__play-slot">
          <button
            type="button"
            aria-label={playing ? `Pause ${dept.name} video` : `Play ${dept.name} video`}
            onClick={togglePlay}
            className="kp-dept-hero__play"
          >
            <span className="material-symbols-outlined text-4xl" aria-hidden="true">
              {playing ? "pause" : "play_arrow"}
            </span>
          </button>
        </div>
      ) : null}

      <div className="relative z-10 mx-auto mt-auto flex w-full max-w-7xl flex-col px-margin-mobile pointer-events-none md:px-margin-desktop">
        <Link
          href="/quiz"
          className="pointer-events-auto mb-6 inline-flex w-fit items-center gap-2 border-2 border-black bg-[#f7be1d] px-4 py-1.5 font-label-md uppercase tracking-widest text-[#151218]"
        >
          <span className="material-symbols-outlined text-base" aria-hidden="true">
            psychology_alt
          </span>
          Department Discovery Quiz
        </Link>
        <h1 className="font-display-lg uppercase">
          <TypedText text="Find Your Kharis Department" />
        </h1>
        <p className="mt-5 max-w-xl font-body-lg text-base text-white md:text-lg">
          Find where your gift meets the mission. Get busy serving.
        </p>

        <div className="relative mt-8 pointer-events-auto">
          <div
            ref={stripRef}
            className="no-scrollbar flex flex-nowrap gap-3 overflow-x-auto pb-1 pr-20"
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
                  className={`kp-dept-chip inline-flex shrink-0 items-center gap-2 font-black uppercase tracking-wider transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7be1d] ${
                    isActive ? "is-active shadow-[4px_4px_0_0_#000]" : ""
                  }`}
                  style={{
                    fontSize: "clamp(0.7rem, 0.62rem + 0.4vw, 0.95rem)",
                    padding:
                      "clamp(0.45rem, 0.4rem + 0.2vw, 0.65rem) clamp(0.75rem, 0.6rem + 0.4vw, 1.05rem)",
                  }}
                >
                  {hasVideo ? (
                    <span
                      className="h-2 w-2 shrink-0 rounded-full bg-[#630ed4]"
                      aria-hidden="true"
                    />
                  ) : null}
                  {d.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
