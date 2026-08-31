/** Homepage hero: lavender Kharis word, orange Find a Branch, muted YouTube loop. */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Just Men (HD) — start mid conversation, never from intro lower-thirds */
const HERO_VIDEO_ID = "qFvmiRYWWh4";
const HERO_START = 320;
const REVEAL_AFTER_MS = 700;

function buildHeroSrc() {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    rel: "0",
    playsinline: "1",
    loop: "1",
    playlist: HERO_VIDEO_ID,
    modestbranding: "1",
    showinfo: "0",
    iv_load_policy: "3",
    disablekb: "1",
    fs: "0",
    cc_load_policy: "0",
    enablejsapi: "1",
    origin: typeof window !== "undefined" ? window.location.origin : "",
    start: String(HERO_START),
    autohide: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${HERO_VIDEO_ID}?${params.toString()}`;
}

function parseYtPayload(data: unknown): {
  event?: string;
  info?: number | { playerState?: number };
} | null {
  try {
    if (typeof data === "string") {
      return JSON.parse(data) as {
        event?: string;
        info?: number | { playerState?: number };
      };
    }
    if (data && typeof data === "object") {
      return data as {
        event?: string;
        info?: number | { playerState?: number };
      };
    }
  } catch {
    return null;
  }
  return null;
}

export function Hero() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const revealTimer = useRef<number | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const send = useCallback((func: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*",
    );
  }, []);

  const keepMutedPlaying = useCallback(() => {
    send("mute");
    send("setVolume", [0]);
    send("unloadModule", ["captions"]);
    send("unloadModule", ["cc"]);
  }, [send]);

  const armReveal = useCallback(() => {
    if (revealTimer.current != null) return;
    revealTimer.current = window.setTimeout(() => {
      setRevealed(true);
    }, REVEAL_AFTER_MS);
  }, []);

  useEffect(() => {
    let raf1 = 0;
    let raf2 = 0;
    let delay = 0;
    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        delay = window.setTimeout(() => setSrc(buildHeroSrc()), 50);
      });
    });
    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      window.clearTimeout(delay);
    };
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = parseYtPayload(event.data);
      if (!data) return;

      if (data.event === "onReady") {
        keepMutedPlaying();
        send("playVideo");
      }

      const state =
        typeof data.info === "number"
          ? data.info
          : data.info && typeof data.info === "object"
            ? data.info.playerState
            : undefined;

      if (state === 1) {
        keepMutedPlaying();
        armReveal();
      }
      if (state === 2 || state === 0 || state === 5) {
        keepMutedPlaying();
        send("playVideo");
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [keepMutedPlaying, armReveal, send]);

  useEffect(() => {
    if (!src) return;

    const boot = () => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "listening", id: 1 }),
        "*",
      );
      keepMutedPlaying();
      send("playVideo");
    };

    const once = window.setTimeout(boot, 80);
    const again = window.setTimeout(boot, 400);
    const third = window.setTimeout(boot, 1200);
    const id = window.setInterval(() => {
      keepMutedPlaying();
    }, 2000);

    return () => {
      window.clearTimeout(once);
      window.clearTimeout(again);
      window.clearTimeout(third);
      window.clearInterval(id);
    };
  }, [src, keepMutedPlaying, send]);

  useEffect(() => {
    return () => {
      if (revealTimer.current) window.clearTimeout(revealTimer.current);
    };
  }, []);

  return (
    <section id="top" className="hero-shell">
      <div className="hero-video-frame" aria-hidden>
        {src ? (
          <div
            className={`hero-video-scale is-live${revealed ? " is-ready" : ""}`}
          >
            <iframe
              ref={iframeRef}
              src={src}
              title="Just Men"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen={false}
              tabIndex={-1}
              onLoad={() => {
                iframeRef.current?.contentWindow?.postMessage(
                  JSON.stringify({ event: "listening", id: 1 }),
                  "*",
                );
                keepMutedPlaying();
                send("playVideo");
              }}
            />
          </div>
        ) : null}
      </div>

      {/* Video cover only — copy stays visible. Quiet wait, no logo. */}
      <div
        className={`hero-video-boot${revealed ? " is-gone" : ""}`}
        aria-hidden
      >
        <svg className="hero-boot-spin" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="18"
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1.5"
          />
          <circle
            className="hero-boot-spin__arc"
            cx="24"
            cy="24"
            r="18"
            fill="none"
            stroke="rgba(196,181,253,0.95)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="22 92"
          />
        </svg>
      </div>
      <div className="hero-video-mask" aria-hidden />
      <div className="hero-chrome-top" aria-hidden />
      <div className="hero-caption-cover" aria-hidden />

      <div
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,4,18,0.35) 0%, rgba(8,4,18,0.08) 28%, rgba(8,4,18,0.12) 55%, rgba(8,4,18,0.5) 100%)",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 pb-14 pt-32 md:px-10 md:pb-20">
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
            <a href="#near-you" className="btn-primary">
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
