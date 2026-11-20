"use client";

import Image from "@/components/SiteImage";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MessageVideo } from "@/lib/youtube";

function cleanEmbedSrc(id: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    modestbranding: "1",
    rel: "0",
    playsinline: "1",
    iv_load_policy: "3",
    fs: "0",
    disablekb: "1",
    enablejsapi: "1",
  });
  if (typeof window !== "undefined") {
    params.set("origin", window.location.origin);
  }
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

function shortTitle(title: string) {
  const main = (title.split("|")[0]?.trim() || title)
    .replace(/[\u2013\u2014]/g, " ")
    .replace(/\s*-\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return main.length > 52 ? `${main.slice(0, 50)}…` : main;
}

type Props = {
  message: MessageVideo;
  className?: string;
  /** Big Netflix-style rank on poster — Latest messages only */
  rank?: number;
  tall?: boolean;
  showMeta?: boolean;
  playOnHover?: boolean;
};

export function MessageHoverTile({
  message,
  className = "",
  rank,
  tall = false,
  showMeta = true,
  playOnHover = true,
}: Props) {
  const [hovering, setHovering] = useState(false);
  const [ready, setReady] = useState(false);
  const timer = useRef<number | null>(null);
  const tileRef = useRef<HTMLAnchorElement>(null);
  /**
   * With dozens of messages on the page, mounting every thumbnail's <Image>
   * at once makes a fast scroll trigger a burst of simultaneous fetches —
   * that's the lag before posters pop in. Gating the mount behind a generous
   * IntersectionObserver margin spreads those fetches out instead, without
   * shifting layout: the tile's box is already sized by CSS (`fill` needs
   * that anyway), so swapping the placeholder for the image changes nothing
   * about where the row sits. Once true it stays true — scrolling back up
   * shouldn't re-hide a poster that already loaded.
   */
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const el = tileRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNearViewport(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const src = useMemo(() => (ready ? cleanEmbedSrc(message.id) : ""), [ready, message.id]);

  const onEnter = useCallback(() => {
    if (!playOnHover) return;
    setHovering(true);
    timer.current = window.setTimeout(() => setReady(true), 220);
  }, [playOnHover]);

  const onLeave = useCallback(() => {
    setHovering(false);
    setReady(false);
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const year = message.publishedAt ? new Date(message.publishedAt).getFullYear() : null;

  return (
    <a
      ref={tileRef}
      href={`https://www.youtube.com/watch?v=${message.id}`}
      target="_blank"
      rel="noreferrer"
      className={`msg-tile ${tall ? "msg-tile--tall" : ""} ${className}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      <span className="msg-tile__media">
        {typeof rank === "number" && (
          <span className="msg-tile__badge" aria-hidden>
            {String(rank).padStart(2, "0")}
          </span>
        )}
        {nearViewport && (
          <Image
            src={message.thumbnail}
            alt=""
            fill
            className={`msg-tile__poster ${hovering && ready ? "is-dim" : ""}`}
            sizes="(max-width: 899px) 48vw, 24vw"
          />
        )}
        {ready && playOnHover && (
          <iframe
            src={src}
            title={message.title}
            className="msg-tile__iframe"
            allow="autoplay; encrypted-media"
            tabIndex={-1}
          />
        )}
        <span className="msg-tile__shade" aria-hidden />
      </span>
      {showMeta && (
        <span className="msg-tile__meta">
          <span className="msg-tile__title">{shortTitle(message.title)}</span>
          {year ? <span className="msg-tile__sub">{year}</span> : null}
          <span className="msg-tile__cta">
            Watch <span aria-hidden>→</span>
          </span>
        </span>
      )}
    </a>
  );
}
