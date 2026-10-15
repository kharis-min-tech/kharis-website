"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { Play, X } from "lucide-react";
import type { MessageVideo } from "@/lib/youtube";

/** Pastor David on camera, mid-sermon, in a message that is also on the poster wall. */
const PREVIEW = {
  id: "KBFfpU0mX2U",
  start: 1260,
  title: "A Living Witness For Jesus",
};

const IN_VIEW_DELAY_MS = 3500;
const HOVER_DELAY_MS = 2000;
/** Lets the hidden player start buffering before it is due on screen. */
const PRELOAD_DELAY_MS = 300;
/**
 * Even with controls=0, YouTube flashes its centre previous / pause / next overlay for about
 * 3s whenever playback starts or resumes. Stay on the poster until it has fully faded.
 */
const PLAY_SETTLE_MS = 4500;
/** Matches the crossfade in messages-hub.css; we only pause once the preview is invisible. */
const FADE_MS = 600;
const MIN_VISIBLE_RATIO = 0.35;

const YT_ORIGIN = "https://www.youtube-nocookie.com";

function previewSrc() {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    modestbranding: "1",
    rel: "0",
    playsinline: "1",
    iv_load_policy: "3",
    cc_load_policy: "0",
    disablekb: "1",
    fs: "0",
    loop: "1",
    playlist: PREVIEW.id,
    start: String(PREVIEW.start),
    enablejsapi: "1",
    origin: window.location.origin,
  });
  return `${YT_ORIGIN}/embed/${PREVIEW.id}?${params}`;
}

function watchSrc(start: number) {
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    start: String(start),
  });
  return `${YT_ORIGIN}/embed/${PREVIEW.id}?${params}`;
}

/** Reduced motion and data saver keep the poster; the Watch button still works. */
function previewAllowed() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conn = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  if (conn?.saveData) return false;
  return !/(^|-)2g$/.test(conn?.effectiveType ?? "");
}

type Props = {
  wall: MessageVideo[];
  messages: MessageVideo[];
};

export function MessagesHero({ wall, messages }: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const watchBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<number | null>(null);
  const settleTimer = useRef<number | null>(null);
  const pauseTimer = useRef<number | null>(null);
  const playingRef = useRef(false);
  const currentTime = useRef(PREVIEW.start);

  const [allowed, setAllowed] = useState(false);
  const [inView, setInView] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [want, setWant] = useState(false);
  const [settled, setSettled] = useState(false);
  /** The player stopped on its own (pause, buffering, end): drop the preview with no fade. */
  const [cut, setCut] = useState(false);
  const [watchStart, setWatchStart] = useState<number | null>(null);

  const watching = watchStart !== null;
  const showPreview = want && settled && inView && !watching;
  const title =
    messages
      .find((m) => m.id === PREVIEW.id)
      ?.title.split("|")[0]
      ?.trim() || PREVIEW.title;

  const command = useCallback((func: string, args: unknown[] = []) => {
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      YT_ORIGIN,
    );
  }, []);

  const resume = useCallback(() => {
    if (pauseTimer.current) window.clearTimeout(pauseTimer.current);
    command("playVideo");
  }, [command]);

  /** Pausing makes YouTube show its play overlay, so wait until the crossfade has hidden the preview. */
  const pauseWhenHidden = useCallback(() => {
    if (pauseTimer.current) window.clearTimeout(pauseTimer.current);
    pauseTimer.current = window.setTimeout(() => command("pauseVideo"), FADE_MS + 50);
  }, [command]);

  useEffect(() => {
    setAllowed(previewAllowed());
    return () => {
      if (pauseTimer.current) window.clearTimeout(pauseTimer.current);
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(!!entry && entry.intersectionRatio >= MIN_VISIBLE_RATIO),
      { threshold: [0, MIN_VISIBLE_RATIO, 0.6, 1] },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // In view: preload quietly, then swap in after the delay. Out of view: pause, back to the poster.
  useEffect(() => {
    if (!inView) {
      setWant(false);
      setWatchStart(null);
      pauseWhenHidden();
      return;
    }
    if (!allowed || watching) return;
    resume();
    const preload = window.setTimeout(() => setMounted(true), PRELOAD_DELAY_MS);
    const reveal = window.setTimeout(() => setWant(true), IN_VIEW_DELAY_MS);
    return () => {
      window.clearTimeout(preload);
      window.clearTimeout(reveal);
    };
  }, [inView, allowed, watching, resume, pauseWhenHidden]);

  // Follow the hidden player's state through the YouTube iframe API messages.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== YT_ORIGIN || e.source !== frameRef.current?.contentWindow) return;
      let data: { event?: string; info?: unknown };
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      let state: number | undefined;
      if (data.event === "onStateChange" && typeof data.info === "number") state = data.info;
      if (data.event === "infoDelivery" && data.info && typeof data.info === "object") {
        const info = data.info as { playerState?: number; currentTime?: number };
        state = info.playerState;
        if (typeof info.currentTime === "number") currentTime.current = info.currentTime;
      }
      if (state === undefined) return;
      const playing = state === 1;
      if (playing === playingRef.current) return;
      playingRef.current = playing;
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
      if (!playing) {
        setSettled(false);
        setCut(true);
        return;
      }
      // Some uploads switch captions on by default; cc_load_policy alone doesn't stop that.
      command("unloadModule", ["captions"]);
      settleTimer.current = window.setTimeout(() => {
        setSettled(true);
        setCut(false);
      }, PLAY_SETTLE_MS);
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
    };
  }, [command]);

  useEffect(() => {
    return () => {
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    };
  }, []);

  const onFrameLoad = () => {
    const win = frameRef.current?.contentWindow;
    if (!win) return;
    win.postMessage(
      JSON.stringify({ event: "listening", id: "msg-hero", channel: "widget" }),
      YT_ORIGIN,
    );
    win.postMessage(
      JSON.stringify({ event: "command", func: "addEventListener", args: ["onStateChange"] }),
      YT_ORIGIN,
    );
  };

  const onPointerEnter = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !allowed || watching) return;
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      setMounted(true);
      setWant(true);
      resume();
    }, HOVER_DELAY_MS);
  };

  const onPointerLeave = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
  };

  const openPlayer = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    setWatchStart(showPreview ? Math.floor(currentTime.current) : 0);
    setWant(false);
    pauseWhenHidden();
  };

  const closePlayer = useCallback(() => setWatchStart(null), []);

  const wasWatching = useRef(false);
  useEffect(() => {
    if (!watching) {
      // The close button unmounts with the player, so hand focus back to the Watch button.
      const lost = !document.activeElement || document.activeElement === document.body;
      if (wasWatching.current && lost) watchBtnRef.current?.focus({ preventScroll: true });
      wasWatching.current = false;
      return;
    }
    wasWatching.current = true;
    closeBtnRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePlayer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [watching, closePlayer]);

  return (
    <section
      ref={heroRef}
      className="msg-hub__hero"
      aria-label="Kharis messages"
      data-preview={showPreview || undefined}
      data-preview-cut={cut || undefined}
      data-watching={watching || undefined}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <div className="msg-hub__wall" aria-hidden>
        {wall.map((msg, i) => (
          <div key={`${msg.id}-${i}`} className="msg-hub__wall-cell">
            <div className="msg-wall-poster">
              <Image
                src={msg.thumbnail}
                alt=""
                fill
                className="msg-wall-poster__img"
                sizes="20vw"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="msg-hero-preview" aria-hidden inert>
        {mounted && (
          <iframe
            ref={frameRef}
            src={previewSrc()}
            title="Message preview"
            className="msg-hero-preview__frame"
            allow="autoplay; encrypted-media"
            tabIndex={-1}
            onLoad={onFrameLoad}
          />
        )}
      </div>

      <div className="msg-hub__veil" aria-hidden />

      <div className="msg-hub__hero-copy">
        <p className="msg-hub__eyebrow">Kharis Messages</p>
        <h1 className="msg-hub__title">
          Teachings that
          <br />
          <span>feed your faith.</span>
        </h1>
        <div className="msg-hero-watch-wrap">
          <button
            ref={watchBtnRef}
            type="button"
            className="msg-hero-watch k-cta"
            onClick={openPlayer}
            aria-label={`Watch message: ${title}`}
          >
            <Play className="msg-hero-watch__icon" strokeWidth={2.2} aria-hidden />
            Watch message
          </button>
        </div>
      </div>

      {watchStart !== null && (
        <div className="msg-hero-player" role="dialog" aria-label={`Watch ${title}`}>
          <div className="msg-hero-player__box">
            <div className="msg-hero-player__bar">
              <p className="msg-hero-player__title">{title}</p>
              <button
                ref={closeBtnRef}
                type="button"
                className="msg-hero-player__close k-cta"
                onClick={closePlayer}
                aria-label="Close message"
              >
                <X strokeWidth={2.2} aria-hidden />
              </button>
            </div>
            <div className="msg-hero-player__frame">
              <iframe
                src={watchSrc(watchStart)}
                title={title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
