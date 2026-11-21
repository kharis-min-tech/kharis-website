"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Playback for a single-screen clip player whose <video> is re-mounted (keyed) for each clip.
 * It plays only while the player is on screen and not paused, starts paused under reduced
 * motion, and writes the clip's progress (0–100%) to `fillRef` every frame while on screen.
 */
export function useClipPlayer(clipKey: string) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing && inView) video.play().catch(() => {});
    else video.pause();
  }, [clipKey, playing, inView]);

  useEffect(() => {
    if (fillRef.current) fillRef.current.style.width = "0%";
    if (!inView) return;
    let frame = 0;
    const tick = () => {
      const video = videoRef.current;
      const fill = fillRef.current;
      if (video && fill && video.duration) {
        fill.style.width = `${Math.min(100, (video.currentTime / video.duration) * 100)}%`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [clipKey, inView]);

  return { rootRef, videoRef, fillRef, inView, playing, setPlaying };
}
