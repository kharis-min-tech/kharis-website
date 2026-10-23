"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { Play, X } from "lucide-react";
import type { MessageVideo } from "@/lib/youtube";

/** Pastor David on camera, mid-sermon, in a message that is also on the poster wall. */
const PREVIEW = {
  id: "KBFfpU0mX2U",
  start: 1260,
  title: "A Living Witness For Jesus",
};

/** Keep YouTube's transient start controls covered until playback is stable. */
const PLAY_SETTLE_MS = 4200;
/** Matches the crossfade in messages-hub.css; pause only once the video is invisible. */
const FADE_MS = 320;
/** Autoplay is sometimes ignored (notably on phones), so keep asking while it should run. */
const PLAY_RETRY_MS = 2500;
const MIN_VISIBLE_RATIO = 0.35;
const HEADLINE_FIRST = "Teachings that";
const HEADLINE_SECOND_PREFIX = "feed your ";
const HEADLINE_LAST_WORD = "spirit.";
const HEADLINE_HOLD_AT = HEADLINE_FIRST.length + HEADLINE_SECOND_PREFIX.length;
const HEADLINE_LENGTH = HEADLINE_HOLD_AT + HEADLINE_LAST_WORD.length;
const HEADLINE_TYPE_MS = 100;

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

type Props = {
  messages: MessageVideo[];
};

export function MessagesHero({ messages }: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const watchBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const settleTimer = useRef<number | null>(null);
  const pauseTimer = useRef<number | null>(null);
  const playingRef = useRef(false);
  const wantPlay = useRef(false);
  const currentTime = useRef(PREVIEW.start);
  const soundOnRef = useRef(false);

  const [allowed, setAllowed] = useState(false);
  const [inView, setInView] = useState(true);
  const [typed, setTyped] = useState(0);
  const [typingStarted, setTypingStarted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  /** Keep the preview hidden until YouTube's transient controls clear. */
  const [warming, setWarming] = useState(false);
  const [settled, setSettled] = useState(false);
  /** The player stopped on its own: hide at once so YouTube's overlay never fades through. */
  const [cut, setCut] = useState(false);
  const [watchStart, setWatchStart] = useState<number | null>(null);

  const watching = watchStart !== null;
  const showPreview = allowed && warming && settled && inView && !watching;
  const title =
    messages
      .find((m) => m.id === PREVIEW.id)
      ?.title.split("|")[0]
      ?.trim() || PREVIEW.title;

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(motionQuery.matches);
    syncMotion();
    motionQuery.addEventListener("change", syncMotion);
    const startTimer = window.setTimeout(() => setTypingStarted(true), 500);
    return () => {
      motionQuery.removeEventListener("change", syncMotion);
      window.clearTimeout(startTimer);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setTyped(HEADLINE_LENGTH);
      return;
    }
    const typeLimit = settled ? HEADLINE_LENGTH : HEADLINE_HOLD_AT;
    if (!typingStarted || typed >= typeLimit) return;
    const timer = window.setTimeout(
      () => setTyped((current) => Math.min(typeLimit, current + 1)),
      HEADLINE_TYPE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [reducedMotion, settled, typed, typingStarted]);

  const firstLine = HEADLINE_FIRST.slice(0, Math.min(typed, HEADLINE_FIRST.length));
  const secondTyped = Math.max(0, typed - HEADLINE_FIRST.length);
  const secondLine = `${HEADLINE_SECOND_PREFIX}${HEADLINE_LAST_WORD}`.slice(0, secondTyped);
  const typingFirstLine = !reducedMotion && typed < HEADLINE_FIRST.length;
  const typingSecondLine = !reducedMotion && typed >= HEADLINE_FIRST.length && typed < HEADLINE_LENGTH;

  const command = useCallback((func: string, args: unknown[] = []) => {
    const frame = frameRef.current;
    // Skip until the iframe has actually navigated to YouTube (avoids origin mismatch noise).
    if (!frame?.contentWindow) return;
    try {
      if (new URL(frame.src).origin !== YT_ORIGIN) return;
      frame.contentWindow.postMessage(JSON.stringify({ event: "command", func, args }), YT_ORIGIN);
    } catch {
      /* iframe not ready */
    }
  }, []);

  const resume = useCallback(() => {
    if (pauseTimer.current) window.clearTimeout(pauseTimer.current);
    if (soundOnRef.current) {
      command("unMute");
      command("setVolume", [80]);
    }
    command("playVideo");
  }, [command]);

  const toggleSound = useCallback(() => {
    const next = !soundOnRef.current;
    soundOnRef.current = next;
    if (next) {
      resume();
    } else {
      command("mute");
    }
  }, [command, resume]);

  const onHeroClick = (event: ReactMouseEvent<HTMLElement>) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest("[role='dialog']")) return;
    toggleSound();
  };

  const onHeroKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " "))
      return;
    event.preventDefault();
    toggleSound();
  };

  /** Pausing makes YouTube show its play overlay, so only pause once the video is already hidden. */
  const pauseLater = useCallback(
    (ms: number) => {
      if (pauseTimer.current) window.clearTimeout(pauseTimer.current);
      pauseTimer.current = window.setTimeout(() => command("pauseVideo"), ms);
    },
    [command],
  );

  const scheduleSettle = useCallback((ms: number) => {
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      setSettled(true);
      setCut(false);
    }, ms);
  }, []);

  useEffect(() => {
    // The preview is muted, allowing browsers to autoplay it without a sound gesture.
    setAllowed(true);
    return () => {
      if (pauseTimer.current) window.clearTimeout(pauseTimer.current);
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
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

  useEffect(() => {
    if (!inView) setWatchStart(null);
  }, [inView]);

  // Keep the muted video playing while visible; the preview stays hidden until startup chrome clears.
  useEffect(() => {
    if (!allowed) return;
    if (!inView || watching) {
      wantPlay.current = false;
      setWarming(false);
      setSettled(false);
      pauseLater(FADE_MS + 50);
      return;
    }
    wantPlay.current = true;
    setWarming(true);
    setSettled(false);
    setCut(false);
    resume();
  }, [inView, allowed, watching, resume, pauseLater]);

  useEffect(() => {
    if (!allowed) return;
    const id = window.setInterval(() => {
      if (wantPlay.current && !playingRef.current) command("playVideo");
    }, PLAY_RETRY_MS);
    return () => window.clearInterval(id);
  }, [allowed, command]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== YT_ORIGIN || e.source !== frameRef.current?.contentWindow) return;
      let data: { event?: string; info?: unknown };
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (data.event === "onReady" && wantPlay.current) resume();
      let state: number | undefined;
      if (data.event === "onStateChange" && typeof data.info === "number") state = data.info;
      if (data.event === "infoDelivery" && data.info && typeof data.info === "object") {
        const info = data.info as { playerState?: number; currentTime?: number };
        state = info.playerState;
        if (typeof info.currentTime === "number") currentTime.current = info.currentTime;
      }
      if (state === undefined) return;
      // YouTube reports buffering while it is already playing. Keep the settled
      // frame visible through that brief stall so the hero never flashes black.
      if (state === 3 && settled) {
        playingRef.current = false;
        return;
      }
      const isPlaying = state === 1;
      if (isPlaying === playingRef.current) return;
      playingRef.current = isPlaying;
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
      if (!isPlaying) {
        setSettled(false);
        setCut(true);
        return;
      }
      command("unloadModule", ["captions"]);
      scheduleSettle(PLAY_SETTLE_MS);
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
    };
  }, [command, resume, scheduleSettle, settled]);

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

  const openPlayer = () => setWatchStart(showPreview ? Math.floor(currentTime.current) : 0);

  const closePlayer = useCallback(() => setWatchStart(null), []);

  const wasWatching = useRef(false);
  useEffect(() => {
    if (!watching) {
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
      tabIndex={0}
      data-preview={showPreview || undefined}
      data-preview-cut={cut || undefined}
      data-watching={watching || undefined}
      onClick={onHeroClick}
      onKeyDown={onHeroKeyDown}
    >
      <div className="msg-hero-preview" aria-hidden inert>
        {allowed && (
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
        <h1 className="msg-hub__title" aria-label="Teachings that feed your spirit.">
          <span className="msg-hub__title-line" aria-hidden="true">
            {firstLine}
            {typingFirstLine && <span className="msg-hub__typing-caret" />}
          </span>
          <span className="msg-hub__title-line" aria-hidden="true">
            {secondLine}
            {typingSecondLine && <span className="msg-hub__typing-caret" />}
          </span>
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
