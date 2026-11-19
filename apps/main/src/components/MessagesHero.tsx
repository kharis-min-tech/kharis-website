"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Square } from "lucide-react";
import Image from "@/components/SiteImage";
import { youtubeWatchUrl } from "@/lib/life-videos";
import type { MessageVideo } from "@/lib/youtube";

const PREVIEW_MEDIA = "(min-width: 1280px) and (prefers-reduced-motion: no-preference)";
const PREVIEW_START = 10 * 60;

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

type Mode = "idle" | "preview" | "playing" | "paused";

export function MessagesHero({ message }: { message: MessageVideo }) {
  const hero = useRef<HTMLElement>(null);
  const playerMount = useRef<HTMLDivElement>(null);
  const action = useRef<HTMLButtonElement>(null);
  const [allowPreview, setAllowPreview] = useState(false);
  const [watching, setWatching] = useState(false);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [hasOpenedPlayer, setHasOpenedPlayer] = useState(false);
  const [sharpPoster, setSharpPoster] = useState(true);
  const currentMode = useRef<Mode | null>(null);
  const title = message.title.split("|")[0]?.trim() || message.title;
  const load = allowPreview || hasOpenedPlayer;
  const mode: Mode = watching ? (paused ? "paused" : "playing") : allowPreview ? "preview" : "idle";

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
      if (previous !== "paused") player.seekTo(0, true);
      player.playVideo();
    } else if (mode === "paused" || mode === "idle") {
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
    setPaused(false);
    setWatching(!watching);
  }

  return (
    <section
      ref={hero}
      className="msg-hub__hero msg-hub__hero--featured"
      data-preview={visible && mode !== "idle" && !failed ? true : undefined}
      data-playing={watching || undefined}
      aria-label={title}
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
        <h1 className={watching ? "sr-only" : "msg-hub__title"}>{title}</h1>
        {!watching && (
          <p className="msg-featured-description">Watch the latest teaching here or on YouTube.</p>
        )}
        {failed && (
          <p className="msg-featured-description" role="status">
            The video player is unavailable. You can still watch on YouTube.
          </p>
        )}
        <div className="msg-featured-actions">
          <button ref={action} type="button" className="msg-hero-action" onClick={togglePlayback}>
            {watching ? (
              <Square size={16} aria-hidden />
            ) : (
              <Play size={16} fill="currentColor" aria-hidden />
            )}
            {watching ? "Stop message" : "Play message"}
          </button>
          {watching && !failed && (
            <button
              type="button"
              className="msg-hero-action msg-hero-action--secondary"
              onClick={() => setPaused(!paused)}
            >
              {paused ? <Play size={16} aria-hidden /> : <Pause size={16} aria-hidden />}
              {paused ? "Resume message" : "Pause message"}
            </button>
          )}
          <a
            className="msg-hero-action msg-hero-action--secondary"
            href={youtubeWatchUrl(message.id)}
            target="_blank"
            rel="noreferrer"
          >
            YouTube
          </a>
        </div>
      </div>
    </section>
  );
}
