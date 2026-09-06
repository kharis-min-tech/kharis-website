"use client";

import { useEffect, useRef, useState } from "react";
import { ambientStartSeconds } from "@/lib/youtube";

type YTPlayer = {
  mute: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getDuration: () => number;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      width?: string | number;
      height?: string | number;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (event: { target: YTPlayer }) => void;
        onStateChange?: (event: { data: number; target: YTPlayer }) => void;
      };
    },
  ) => YTPlayer;
};

const YT_ENDED = 0;
const YT_PLAYING = 1;

function youtubeApi(): Promise<YTNamespace> {
  const w = window as Window & {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  };
  if (w.YT?.Player) return Promise.resolve(w.YT);

  return new Promise((resolve) => {
    const previous = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (w.YT) resolve(w.YT);
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }
  });
}

function waitForDuration(player: YTPlayer, tries = 24): Promise<number> {
  return new Promise((resolve) => {
    const tick = (left: number) => {
      const duration = player.getDuration?.() ?? 0;
      if (duration > 0 || left <= 0) {
        resolve(duration);
        return;
      }
      window.setTimeout(() => tick(left - 1), 120);
    };
    tick(tries);
  });
}

export function MutedHeroVideo({
  id,
  thumbnail,
  title,
}: {
  id: string;
  thumbnail: string;
  title: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const wrap = wrapRef.current;
    if (!wrap) return;

    let cancelled = false;
    const mount = document.createElement("div");
    mount.className = "h-full w-full";
    mount.setAttribute("title", title);
    wrap.appendChild(mount);

    youtubeApi().then(async (YT) => {
      if (cancelled || !mount.isConnected) return;

      const player = new YT.Player(mount, {
        videoId: id,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          cc_load_policy: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: async (event) => {
            if (cancelled) return;
            event.target.mute();
            const duration = await waitForDuration(event.target);
            if (cancelled) return;
            const start = ambientStartSeconds(duration);
            if (start > 0) event.target.seekTo(start, true);
            event.target.playVideo();
          },
          onStateChange: (event) => {
            if (cancelled) return;
            if (event.data === YT_PLAYING) setLive(true);
            if (event.data === YT_ENDED) {
              const start = ambientStartSeconds(event.target.getDuration());
              event.target.seekTo(start, true);
              event.target.playVideo();
            }
          },
        },
      });
      playerRef.current = player;
    });

    return () => {
      cancelled = true;
      setLive(false);
      try {
        playerRef.current?.destroy();
      } catch {
        // player may already be gone
      }
      playerRef.current = null;
      mount.remove();
    };
  }, [id, title]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-on-background">
      <img
        src={thumbnail}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          live ? "opacity-0" : "opacity-100"
        }`}
      />
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          live ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={!live}
      >
        <div className="absolute left-1/2 top-1/2 aspect-video h-[56.25vw] w-[177.78%] min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 [&>iframe]:h-full [&>iframe]:w-full">
          <div ref={wrapRef} className="h-full w-full [&>iframe]:h-full [&>iframe]:w-full" />
        </div>
      </div>
    </div>
  );
}
