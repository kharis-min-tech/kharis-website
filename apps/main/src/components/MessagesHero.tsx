"use client";

import { useEffect, useRef, useState } from "react";
import { MousePointer2 } from "lucide-react";
import Image from "@/components/SiteImage";
import { ABOUT } from "@/lib/about-content";
import { youtubeWatchUrl } from "@/lib/life-videos";
import type { MessageVideo } from "@/lib/youtube";

const PREVIEW_MEDIA = "(min-width: 1280px) and (prefers-reduced-motion: no-preference)";
const PREVIEW_START = 10 * 60;

const HEADLINE_FIRST = "Teachings that";
const HEADLINE_SECOND_PREFIX = "feed your ";
const HEADLINE_LAST_WORD = "spirit.";
const HEADLINE_HOLD_AT = HEADLINE_FIRST.length + HEADLINE_SECOND_PREFIX.length;
const HEADLINE_LENGTH = HEADLINE_HOLD_AT + HEADLINE_LAST_WORD.length;
const HEADLINE_TYPE_MS = 45;

type Player = {
  destroy: () => void;
  getDuration: () => number;
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  seekTo: (seconds: number, seekAhead: boolean) => void;
};

type PlayerApi = {
  Player: new (
    mount: HTMLElement,
    options: {
      videoId: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady: (event: { target: Player }) => void;
        onStateChange: (event: { data: number }) => void;
        onError: () => void;
      };
    },
  ) => Player;
};

let playerApi: Promise<PlayerApi> | undefined;

function loadPlayerApi() {
  const host = window as Window & {
    YT?: PlayerApi;
    onYouTubeIframeAPIReady?: () => void;
  };
  if (host.YT?.Player) return Promise.resolve(host.YT);
  playerApi ??= new Promise((resolve, reject) => {
    const previous = host.onYouTubeIframeAPIReady;
    host.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (host.YT?.Player) resolve(host.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      script.remove();
      host.onYouTubeIframeAPIReady = previous;
      playerApi = undefined;
      reject(new Error("YouTube player could not load."));
    };
    document.head.append(script);
  });
  return playerApi;
}

/**
 * Who preached it, from the "Title | Speaker | Scripture" convention the
 * channel titles follow. Null when the second segment is plainly not a
 * person, so the cue never reads out a chapter of the Bible.
 */
function speakerFrom(title: string): string | null {
  const raw = title.split("|")[1]?.trim();
  if (!raw || /[0-9:]/.test(raw) || raw.split(/\s+/).length > 4) return null;
  const pastor = ABOUT.leadership.pastors.find(
    (p) => p.name.replace(/^pastor\s+/i, "").toLowerCase() === raw.toLowerCase(),
  );
  if (!pastor) return raw;
  return `Pastor ${pastor.name.replace(/^pastor\s+/i, "").split(/\s+/)[0]}`;
}

type Mode = "idle" | "preview" | "playing";

export function MessagesHero({ message }: { message: MessageVideo }) {
  const hero = useRef<HTMLElement>(null);
  const playerMount = useRef<HTMLDivElement>(null);
  const action = useRef<HTMLButtonElement>(null);
  const [allowPreview, setAllowPreview] = useState(false);
  const [watching, setWatching] = useState(false);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [hasOpenedPlayer, setHasOpenedPlayer] = useState(false);
  const [sharpPoster, setSharpPoster] = useState(true);
  const [typed, setTyped] = useState(0);
  const [typingStarted, setTypingStarted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  /** Nobody taps a mouse and nobody clicks a phone, so the cue says which. */
  const [coarsePointer, setCoarsePointer] = useState(false);
  const currentMode = useRef<Mode | null>(null);
  const title = message.title.split("|")[0]?.trim() || message.title;
  const speaker = speakerFrom(message.title);
  const cue = `${coarsePointer ? "Tap" : "Click"} to ${speaker ? `listen to ${speaker}` : "dive in"}`;
  const load = allowPreview || hasOpenedPlayer;
  const mode: Mode = watching ? "playing" : allowPreview ? "preview" : "idle";

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(motionQuery.matches);
    syncMotion();
    motionQuery.addEventListener("change", syncMotion);
    const pointerQuery = window.matchMedia("(pointer: coarse)");
    const syncPointer = () => setCoarsePointer(pointerQuery.matches);
    syncPointer();
    pointerQuery.addEventListener("change", syncPointer);
    const startTimer = window.setTimeout(() => setTypingStarted(true), 100);
    return () => {
      motionQuery.removeEventListener("change", syncMotion);
      pointerQuery.removeEventListener("change", syncPointer);
      window.clearTimeout(startTimer);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setTyped(HEADLINE_LENGTH);
      return;
    }
    if (!typingStarted || typed >= HEADLINE_LENGTH) return;
    const timer = window.setTimeout(
      () => setTyped((current) => Math.min(HEADLINE_LENGTH, current + 1)),
      HEADLINE_TYPE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [reducedMotion, typed, typingStarted]);

  const firstLine = HEADLINE_FIRST.slice(0, Math.min(typed, HEADLINE_FIRST.length));
  const secondTyped = Math.max(0, typed - HEADLINE_FIRST.length);
  const secondLine = `${HEADLINE_SECOND_PREFIX}${HEADLINE_LAST_WORD}`.slice(0, secondTyped);
  const typingFirstLine = !reducedMotion && typed < HEADLINE_FIRST.length;
  const typingSecondLine = !reducedMotion && typed >= HEADLINE_FIRST.length && typed < HEADLINE_LENGTH;

  useEffect(() => {
    const element = hero.current;
    if (!element) return;
    const media = window.matchMedia(PREVIEW_MEDIA);
    let inView = false;
    const sync = () => setAllowPreview(media.matches && inView);
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.intersectionRatio >= 0.35;
        sync();
      },
      { threshold: 0.35 },
    );
    observer.observe(element);
    media.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const container = playerMount.current;
    if (!load || !container) return;
    let disposed = false;
    let instance: Player | undefined;
    const mount = document.createElement("div");
    container.append(mount);
    loadPlayerApi()
      .then(({ Player }) => {
        if (disposed) return;
        instance = new Player(mount, {
          videoId: message.id,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: ({ target }) => {
              if (!disposed) setPlayer(target);
            },
            onStateChange: ({ data }) => {
              if (disposed) return;
              if (data === 1) setVisible(true);
              if (data === 0) setVisible(false);
            },
            onError: () => {
              if (!disposed) setFailed(true);
            },
          },
        });
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });

    return () => {
      disposed = true;
      instance?.destroy();
      mount.remove();
      currentMode.current = null;
      setPlayer(null);
      setVisible(false);
    };
  }, [load, message.id]);

  useEffect(() => {
    if (!player || failed) return;
    const previous = currentMode.current;
    currentMode.current = mode;
    if (mode === "playing") {
      player.unMute();
      player.seekTo(0, true);
      player.playVideo();
    } else if (mode === "idle") {
      player.pauseVideo();
    } else {
      player.mute();
      if (previous !== "preview") {
        const duration = player.getDuration();
        player.seekTo(duration >= PREVIEW_START + 120 ? PREVIEW_START : 0, true);
      }
      player.playVideo();
    }
  }, [failed, mode, player]);

  function togglePlayback() {
    if (!watching) setHasOpenedPlayer(true);
    setWatching(!watching);
  }

  return (
    <section
      ref={hero}
      className="msg-hub__hero msg-hub__hero--featured"
      data-preview={visible && mode !== "idle" && !failed ? true : undefined}
      data-playing={watching || undefined}
      aria-label={`Watch the latest Kharis message: ${title}`}
      onKeyDown={(event) => {
        if (watching && event.key === "Escape") {
          togglePlayback();
          action.current?.focus({ preventScroll: true });
        }
      }}
    >
      <div className="msg-hero-media">
        <Image
          src={
            sharpPoster
              ? `https://i.ytimg.com/vi/${encodeURIComponent(message.id)}/maxresdefault.jpg`
              : message.thumbnail
          }
          alt=""
          fill
          preload
          sizes="100vw"
          className="msg-hero-poster"
          onError={() => setSharpPoster(false)}
        />
        <div className="msg-hero-preview" aria-hidden inert>
          <div className="msg-hero-preview__frame" ref={playerMount} />
        </div>
        <div className="msg-hub__veil" aria-hidden />
      </div>

      <div className="msg-featured-content">
        {watching ? (
          <h1 className="sr-only">{title}</h1>
        ) : (
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
        )}

        {failed && (
          <>
            <p className="msg-featured-description" role="status">
              The video player is unavailable. You can still watch on YouTube.
            </p>
            <div className="msg-featured-actions">
              <a
                className="msg-hero-action msg-hero-action--secondary"
                href={youtubeWatchUrl(message.id)}
                target="_blank"
                rel="noreferrer"
              >
                YouTube
              </a>
            </div>
          </>
        )}

        {!watching && !failed && (
          <div className="msg-featured-actions">
            <button
              ref={action}
              type="button"
              className="msg-hero-cue"
              onClick={togglePlayback}
              aria-label={`Watch message: ${title}`}
            >
              <span className="msg-hero-cue__pointer" aria-hidden="true">
                <MousePointer2 className="msg-hero-cue__arrow" strokeWidth={1.75} />
              </span>
              <span className="msg-hero-cue__text">{cue}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
