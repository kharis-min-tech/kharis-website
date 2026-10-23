/**
 * Page-level scroll snapping for long scroll-driven pages (the Life page).
 *
 * Sections declare snap points with a `data-snap` attribute:
 *   "start"     the section's top
 *   "end"       where a pinned (taller than the screen) section finishes
 *   "frames:N"  N evenly spaced points across a pinned section, first to last
 * The page top is always a snap point. When scrolling stops between two points, the page glides
 * on to the next point in the direction of travel, or back if the move was tiny. Past the last
 * declared point (e.g. the closing band and footer) the page scrolls freely.
 */
"use client";

import { animate, type AnimationPlaybackControls } from "framer-motion";
import { useEffect } from "react";

const GLIDE_EASE = [0.65, 0, 0.35, 1] as const;
/** Pause after the last scroll event before snapping (lets trackpad momentum finish). */
const SETTLE_DELAY_MS = 150;
/** Moves smaller than this share of the screen glide back instead of on. */
const MIN_TRAVEL = 0.06;

let activeGlide: AnimationPlaybackControls | null = null;

export function stopPageGlide() {
  activeGlide?.stop();
  activeGlide = null;
}

export function isPageGliding() {
  return activeGlide !== null;
}

/** Eased scroll to `target`, driving the window directly (html sets scroll-behavior: smooth). */
export function glidePageTo(target: number) {
  stopPageGlide();
  const from = window.scrollY;
  const distance = Math.abs(target - from);
  if (distance < 2) return;
  const screens = distance / window.innerHeight;
  activeGlide = animate(from, target, {
    duration: Math.min(1.5, 0.6 + screens * 0.35),
    ease: GLIDE_EASE,
    onUpdate: (value) => window.scrollTo({ top: value, behavior: "instant" }),
    onComplete: () => {
      activeGlide = null;
    },
  });
}

function collectSnapPoints() {
  const vh = window.innerHeight;
  const max = Math.max(0, document.documentElement.scrollHeight - vh);
  const points = new Set<number>([0]);
  document.querySelectorAll<HTMLElement>("[data-snap]").forEach((element) => {
    const top = element.getBoundingClientRect().top + window.scrollY;
    const span = Math.max(0, element.offsetHeight - vh);
    for (const token of (element.dataset.snap ?? "").split(/\s+/)) {
      if (token === "start") points.add(Math.round(top));
      else if (token === "end") points.add(Math.round(top + span));
      const frames = /^frames:(\d+)$/.exec(token);
      if (frames) {
        const count = Number(frames[1]);
        for (let index = 0; index < count; index++) {
          points.add(Math.round(top + (span * index) / Math.max(1, count - 1)));
        }
      }
    }
  });
  return [...points].filter((point) => point >= 0 && point <= max).sort((a, b) => a - b);
}

export function usePageSnap(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let lastY = window.scrollY;
    let direction = 0;
    let touching = false;
    let timer = 0;

    const settle = () => {
      if (touching || isPageGliding()) return;
      const y = window.scrollY;
      const points = collectSnapPoints();
      if (points.some((point) => Math.abs(point - y) <= 2)) return;
      const before = points.filter((point) => point < y).at(-1);
      const after = points.find((point) => point > y);
      if (before === undefined || after === undefined) return;
      const minTravel = window.innerHeight * MIN_TRAVEL;
      let target: number;
      if (direction > 0) target = y - before > minTravel ? after : before;
      else if (direction < 0) target = after - y > minTravel ? before : after;
      else target = y - before < after - y ? before : after;
      glidePageTo(target);
    };

    const schedule = () => {
      window.clearTimeout(timer);
      if (!isPageGliding()) timer = window.setTimeout(settle, SETTLE_DELAY_MS);
    };
    const onScroll = () => {
      const y = window.scrollY;
      if (y !== lastY) direction = Math.sign(y - lastY);
      lastY = y;
      schedule();
    };
    /* Any manual input takes over from a glide in progress. */
    const onInput = () => stopPageGlide();
    const onTouchStart = () => {
      touching = true;
      stopPageGlide();
    };
    const onTouchEnd = () => {
      touching = false;
      schedule();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onInput, { passive: true });
    window.addEventListener("keydown", onInput);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onInput);
      window.removeEventListener("keydown", onInput);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      stopPageGlide();
    };
  }, [enabled]);
}
