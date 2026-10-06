/** Homepage hero: self-hosted muted dual-clip crossfade loop (no YouTube UI). */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type HeroClip = {
  id: string;
  src: string;
};

const HERO_CLIPS: HeroClip[] = [
  {
    id: "servant",
    src: "/videos/hero-a.mp4?v=2",
  },
  {
    id: "preach",
    src: "/videos/hero-b.mp4?v=2",
  },
];

const HERO_POSTER = "/videos/hero-poster.jpg?v=2";
const FALLBACK_REVEAL_MS = 1500;
/** Snappy slideshow crossfade — matches CSS opacity transition. */
const CROSSFADE_MS = 300;
const READY_WAIT_MS = 700;
/** Prefer timed rotation (~10s) for a snappier feel; still fade near natural end. */
const ROTATE_MS = 10_000;
const NEAR_END_S = 0.65;

type Slot = 0 | 1;

function prepVideo(el: HTMLVideoElement) {
  el.muted = true;
  el.defaultMuted = true;
  el.setAttribute("muted", "");
  el.playsInline = true;
  el.setAttribute("playsinline", "");
  el.setAttribute("webkit-playsinline", "");
  el.volume = 0;
}

function clipMatches(el: HTMLVideoElement, url: string) {
  const attr = el.getAttribute("src") || "";
  const current = el.currentSrc || "";
  const path = url.split("?")[0];
  return (
    attr === url ||
    attr.endsWith(url) ||
    current.endsWith(url) ||
    attr.includes(path) ||
    current.includes(path)
  );
}

function assignClip(el: HTMLVideoElement, url: string) {
  if (clipMatches(el, url)) return;
  el.src = url;
  el.load();
}

export function Hero() {
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const activeSlot = useRef<Slot>(0);
  const clipIndex = useRef(0);
  const revealed = useRef(false);
  const transitioning = useRef(false);
  const fadeGen = useRef(0);
  const rotateTimer = useRef<number | null>(null);
  const fadeTimer = useRef<number | null>(null);
  const [active, setActive] = useState<Slot>(0);
  const [visible, setVisible] = useState(false);

  const refs = useCallback(() => [aRef.current, bRef.current] as const, []);

  const revealSite = useCallback(() => {
    if (revealed.current) return;
    revealed.current = true;
    document.documentElement.classList.add("hero-ready");
  }, []);

  const markVisible = useCallback(() => {
    setVisible(true);
    revealSite();
  }, [revealSite]);

  const clearRotate = useCallback(() => {
    if (rotateTimer.current != null) {
      window.clearTimeout(rotateTimer.current);
      rotateTimer.current = null;
    }
  }, []);

  const scheduleRotate = useCallback(
    (fn: () => void, ms: number) => {
      clearRotate();
      rotateTimer.current = window.setTimeout(fn, ms);
    },
    [clearRotate],
  );

  const tryPlay = useCallback(async (el: HTMLVideoElement) => {
    prepVideo(el);
    try {
      await el.play();
      return true;
    } catch {
      return el.readyState >= 2;
    }
  }, []);

  const crossfadeTo = useCallback(
    async (nextClip: number) => {
      const videos = refs();
      const from = activeSlot.current;
      const to: Slot = from === 0 ? 1 : 0;
      const outgoing = videos[from];
      const incoming = videos[to];
      if (!outgoing || !incoming) return;

      const gen = ++fadeGen.current;
      transitioning.current = true;
      clearRotate();
      if (fadeTimer.current != null) {
        window.clearTimeout(fadeTimer.current);
        fadeTimer.current = null;
      }

      const idx = ((nextClip % HERO_CLIPS.length) + HERO_CLIPS.length) % HERO_CLIPS.length;
      clipIndex.current = idx;

      const clip = HERO_CLIPS[idx]!;
      assignClip(incoming, clip.src);

      const waitReady = () =>
        new Promise<void>((resolve) => {
          // canplay (readyState >= 2) is enough to start a snappy fade
          if (incoming.readyState >= 2) {
            resolve();
            return;
          }
          const done = () => {
            incoming.removeEventListener("loadeddata", done);
            incoming.removeEventListener("canplay", done);
            incoming.removeEventListener("canplaythrough", done);
            resolve();
          };
          incoming.addEventListener("loadeddata", done);
          incoming.addEventListener("canplay", done);
          incoming.addEventListener("canplaythrough", done);
          window.setTimeout(done, READY_WAIT_MS);
        });

      await waitReady();
      if (gen !== fadeGen.current) return;

      try {
        incoming.currentTime = 0;
      } catch {
        /* ignore seek errors before ready */
      }
      prepVideo(incoming);
      // Must flip before play() so the incoming clip's "play" event arms the rotate timer.
      activeSlot.current = to;
      await tryPlay(incoming);
      if (gen !== fadeGen.current) return;

      setActive(to);
      markVisible();

      fadeTimer.current = window.setTimeout(() => {
        if (gen !== fadeGen.current) return;
        outgoing.pause();
        transitioning.current = false;
        // Keep the alternate clip warm in the hidden slot
        const other = HERO_CLIPS[(idx + 1) % HERO_CLIPS.length]!;
        assignClip(outgoing, other.src);
      }, CROSSFADE_MS);
    },
    [clearRotate, markVisible, refs, tryPlay],
  );

  const advance = useCallback(() => {
    void crossfadeTo(clipIndex.current + 1);
  }, [crossfadeTo]);

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;

    prepVideo(a);
    prepVideo(b);

    const onPlaying = () => markVisible();
    const onLoaded = () => {
      if (a.videoWidth > 0) setVisible(true);
      void tryPlay(a).then((ok) => {
        if (ok) markVisible();
        else if (a.readyState >= 2) markVisible();
        else revealSite();
      });
    };
    const onError = () => {
      console.error("[Hero] video failed to load", a.error);
      revealSite();
    };

    const armTimers = (el: HTMLVideoElement) => {
      const remainingMs = Math.max(
        0,
        (el.duration - el.currentTime - NEAR_END_S) * 1000,
      );
      const delay = Math.min(
        ROTATE_MS,
        Number.isFinite(remainingMs) ? remainingMs : ROTATE_MS,
      );
      scheduleRotate(advance, delay);
    };

    const onTimeUpdate = (e: Event) => {
      const el = e.target as HTMLVideoElement;
      if (el !== refs()[activeSlot.current]) return;
      if (transitioning.current) return;
      if (!Number.isFinite(el.duration) || el.duration <= 0) return;
      if (el.duration - el.currentTime <= NEAR_END_S) {
        advance();
      }
    };

    const onPlay = (e: Event) => {
      const el = e.target as HTMLVideoElement;
      if (el !== refs()[activeSlot.current]) return;
      armTimers(el);
    };

    const onEnded = (e: Event) => {
      const el = e.target as HTMLVideoElement;
      if (el !== refs()[activeSlot.current]) return;
      advance();
    };

    a.addEventListener("playing", onPlaying);
    a.addEventListener("canplay", onLoaded);
    a.addEventListener("canplaythrough", onLoaded);
    a.addEventListener("loadeddata", onLoaded);
    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("error", onError);

    for (const el of [a, b]) {
      el.addEventListener("timeupdate", onTimeUpdate);
      el.addEventListener("play", onPlay);
      el.addEventListener("ended", onEnded);
    }

    // Boot: slot A plays clip 0; slot B preloads clip 1
    clipIndex.current = 0;
    activeSlot.current = 0;
    a.src = HERO_CLIPS[0]!.src;
    a.preload = "auto";
    a.load();
    b.src = HERO_CLIPS[1]!.src;
    b.preload = "auto";
    b.load();
    void tryPlay(a);

    const fallback = window.setTimeout(() => revealSite(), FALLBACK_REVEAL_MS);

    return () => {
      a.removeEventListener("playing", onPlaying);
      a.removeEventListener("canplay", onLoaded);
      a.removeEventListener("canplaythrough", onLoaded);
      a.removeEventListener("loadeddata", onLoaded);
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("error", onError);
      for (const el of [a, b]) {
        el.removeEventListener("timeupdate", onTimeUpdate);
        el.removeEventListener("play", onPlay);
        el.removeEventListener("ended", onEnded);
      }
      clearRotate();
      if (fadeTimer.current != null) window.clearTimeout(fadeTimer.current);
      window.clearTimeout(fallback);
      document.documentElement.classList.remove("hero-ready");
    };
  }, [advance, clearRotate, markVisible, refs, revealSite, scheduleRotate, tryPlay]);

  const videoProps = {
    muted: true,
    playsInline: true,
    preload: "auto" as const,
    controls: false,
    controlsList: "nodownload nofullscreen noremoteplayback noplaybackrate",
    disablePictureInPicture: true,
    tabIndex: -1,
    "aria-hidden": true as const,
    // Inline cover sizing beats Tailwind `video { max-width:100%; height:auto }` even if CSS order races.
    style: {
      position: "absolute" as const,
      inset: 0,
      width: "100%",
      height: "100%",
      maxWidth: "none",
      maxHeight: "none",
      objectFit: "cover" as const,
      objectPosition: "center center",
    },
  };

  useEffect(() => {
    // Chromium rejects <link rel="preload" as="video">; clips warm via <video preload="auto">.
    if (document.querySelector(`link[rel="preload"][href="${HERO_POSTER}"]`)) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = HERO_POSTER;
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  return (
    <section id="top" className="hero-shell">
      <div className="hero-video-frame" aria-hidden>
        <video
          ref={aRef}
          className={`hero-local-video hero-local-video--a${visible && active === 0 ? " is-active" : ""}${visible ? " is-ready" : ""}`}
          poster={HERO_POSTER}
          autoPlay
          {...videoProps}
        />
        <video
          ref={bRef}
          className={`hero-local-video hero-local-video--b${visible && active === 1 ? " is-active" : ""}`}
          {...videoProps}
        />
      </div>

      <div className="hero-video-mask" aria-hidden />

      <div
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,4,18,0.18) 0%, rgba(8,4,18,0.02) 32%, rgba(8,4,18,0.06) 58%, rgba(8,4,18,0.38) 100%)",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 pb-8 pt-28 md:px-10 md:pb-12 md:pt-32">
        <div className="pointer-events-auto mx-auto max-w-7xl">
          <p className="mb-3 text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-white/80">
            Kharis Church
          </p>
          <h1 className="welcome-draw headline text-[clamp(2rem,7vw,4.2rem)] sm:whitespace-nowrap">
            <span className="welcome-draw__fill">
              Welcome to{" "}
              <span className="kharis-brand font-extrabold">Kharis</span>
            </span>
            <span
              className="welcome-draw__ghost headline text-[clamp(2rem,7vw,4.2rem)] sm:whitespace-nowrap"
              aria-hidden
            >
              Welcome to <span className="kharis-brand">Kharis</span>
            </span>
            <span
              className="welcome-draw__run headline text-[clamp(2rem,7vw,4.2rem)] sm:whitespace-nowrap"
              aria-hidden
            >
              Welcome to <span className="kharis-brand">Kharis</span>
            </span>
          </h1>
          <p className="mt-4 max-w-md text-base font-semibold text-white/90 md:text-lg">
            Changing the world with a touch of His grace.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="/locations" className="btn-primary">
              Find a Branch
            </a>
            <a href="#messages" className="btn-ghost">
              Watch Messages
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
