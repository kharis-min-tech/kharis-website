"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  poster?: string;
  /** Only plays while true (e.g. the active card of a carousel). Defaults to always. */
  active?: boolean;
  className?: string;
  label?: string;
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * A silent looping clip that only plays while it's on screen (and `active`), so a page full of
 * clips costs one or two decoders at a time. Under reduced motion it never plays: the poster
 * stands in for it.
 */
export function InViewVideo({ src, poster, active = true, className, label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || prefersReducedMotion()) return;

    const sync = () => {
      if (inView.current && active) {
        // Preload lazily: only fetch once the clip is first wanted.
        if (video.preload === "none") video.preload = "auto";
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        sync();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    sync();
    return () => observer.disconnect();
  }, [active]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    />
  );
}
