"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

/** The main site's scrub spring, so every pinned section on the page has the same weight. */
export const SCRUB_SPRING = { stiffness: 90, damping: 22, mass: 1 };

/** The fixed site header (72px bar + 2px border). Pins sit just under it. */
export const HEADER_PX = 74;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const TRANSFORM_HOST = "https://images.kharis.org/";

/** Ask Cloudflare for the size actually drawn. Anything not on images.kharis.org passes through. */
export function cdn(src: string, width: number, quality = 78): string {
  if (!src.startsWith(TRANSFORM_HOST) || src.includes("/cdn-cgi/image/")) return src;
  const path = src.slice(TRANSFORM_HOST.length);
  return `${TRANSFORM_HOST}cdn-cgi/image/width=${Math.round(width)},quality=${quality},fit=scale-down,format=auto/${path}`;
}

export function cdnSet(src: string, widths: number[]): string | undefined {
  if (!src.startsWith(TRANSFORM_HOST)) return undefined;
  return widths.map((w) => `${cdn(src, w)} ${w}w`).join(", ");
}

/** Phones and narrow tablets read the book one portrait page at a time. */
const COMPACT = "(max-width: 899px)";

export function useMedia(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (notify) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", notify);
      return () => list.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const useCompact = () => useMedia(COMPACT);

/**
 * True once nothing covers the page: the dove intro on a first visit (KpIntro) and the comic
 * page turn between routes (PageTurn) have both cleared. Entrances wait for this so they play
 * where people can see them.
 */
export function useStageReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const covered = () => {
      if (root.dataset.kpTurn === "on" || root.dataset.kpTurn === "leave") return true;
      if (root.dataset.kpIntro === "seen") return false;
      const intro = document.querySelector<HTMLElement>(".kp-intro");
      return Boolean(intro && getComputedStyle(intro).visibility !== "hidden");
    };
    const check = () => {
      if (!covered()) {
        setReady(true);
        observer.disconnect();
        window.clearTimeout(fallback);
      }
    };
    const observer = new MutationObserver(check);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-kp-intro", "data-kp-turn"],
    });
    // Never leave the stage empty if a cover forgets to report.
    const fallback = window.setTimeout(() => setReady(true), 4000);
    const frame = requestAnimationFrame(check);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
      cancelAnimationFrame(frame);
    };
  }, []);
  return ready;
}

/* ------------------------------------------------------------------------------------------ */
/* Glide: one shared smooth scroll that clicks and snaps both use.                             */
/* ------------------------------------------------------------------------------------------ */

let glide: { frame: number; dir: number; cancel: () => void } | null = null;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function isGliding() {
  return glide !== null;
}

/**
 * Scrolls the page to `target` over `ms`. Per-frame scrolls use `behavior: "instant"` because the
 * site sets smooth scrolling globally, which would otherwise start a new smooth scroll every frame.
 * Wheel input in the same direction is swallowed so steady notches don't stutter the glide;
 * reversing, touching or pressing a key hands control straight back.
 */
export function glidePageTo(target: number, ms = 760) {
  glide?.cancel();
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const to = Math.max(0, Math.min(max, Math.round(target)));
  const from = window.scrollY;
  if (Math.abs(to - from) < 2) return;
  if (reducedMotion()) {
    window.scrollTo({ top: to, behavior: "instant" });
    return;
  }
  const dir = Math.sign(to - from);
  const start = performance.now();
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const onWheel = (event: WheelEvent) => {
    if (Math.sign(event.deltaY) === dir) event.preventDefault();
    else stop();
  };
  const stop = () => {
    if (!glide) return;
    cancelAnimationFrame(glide.frame);
    glide = null;
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", stop);
  };
  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("keydown", stop);

  let placed = from;
  const step = (now: number) => {
    // Something else moved the page (a scrollbar drag, a link, another script): let it win.
    if (Math.abs(window.scrollY - placed) > 4) return stop();
    const t = Math.min(1, (now - start) / ms);
    placed = from + (to - from) * ease(t);
    window.scrollTo({ top: placed, behavior: "instant" });
    placed = window.scrollY;
    if (t < 1 && glide) glide.frame = requestAnimationFrame(step);
    else stop();
  };
  glide = { frame: requestAnimationFrame(step), dir, cancel: stop };
}

/** Scroll position for fraction `f` (0-1) of a pinned section's travel. */
export function pinScrollY(section: HTMLElement, f: number) {
  const top = section.getBoundingClientRect().top + window.scrollY - HEADER_PX;
  const travel = section.offsetHeight - (window.innerHeight - HEADER_PX);
  return top + clamp01(f) * travel;
}

/**
 * Snaps a pinned section to its resting points once scrolling stops inside it, so a page never
 * sits half turned. `points` are fractions of the section's travel. A move of more than a small
 * nudge goes on in the direction of travel; a nudge glides back.
 */
export function useSectionSnap(
  ref: RefObject<HTMLElement | null>,
  points: number[],
  enabled: boolean,
) {
  const key = points.join(",");
  useEffect(() => {
    const section = ref.current;
    if (!section || !enabled || reducedMotion()) return;
    const stops = key.split(",").map(Number);
    let timer = 0;
    let lastY = window.scrollY;
    let dir = 0;
    let pointerDown = false;

    const settle = () => {
      if (pointerDown || isGliding()) return;
      const travel = section.offsetHeight - (window.innerHeight - HEADER_PX);
      const top = section.getBoundingClientRect().top + window.scrollY - HEADER_PX;
      const f = (window.scrollY - top) / travel;
      if (f <= 0.001 || f >= 0.999) return;
      let below = stops[0]!;
      let above = stops[stops.length - 1]!;
      for (const s of stops) {
        if (s <= f) below = s;
        if (s >= f) {
          above = s;
          break;
        }
      }
      if (above === below) return;
      const span = above - below;
      const into = (f - below) / span;
      const NUDGE = 0.12;
      let target: number;
      if (dir > 0) target = into > NUDGE ? above : below;
      else if (dir < 0) target = into < 1 - NUDGE ? below : above;
      else target = into > 0.5 ? above : below;
      glidePageTo(top + target * travel, 520 + (260 * Math.abs(target - f)) / span);
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (y !== lastY) dir = Math.sign(y - lastY);
      lastY = y;
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 150);
    };
    const down = () => (pointerDown = true);
    const up = () => {
      pointerDown = false;
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [ref, key, enabled]);
}

/* ------------------------------------------------------------------------------------------ */
/* Journey events: sections tell the page counter where the reader is.                         */
/* ------------------------------------------------------------------------------------------ */

export type JourneyGoto = { chapter: string; event?: string };

export function gotoChapter(detail: JourneyGoto) {
  window.dispatchEvent(new CustomEvent<JourneyGoto>("lifebook:goto", { detail }));
}

export function announceEventPage(label: string | null) {
  window.dispatchEvent(new CustomEvent<string | null>("lifebook:event", { detail: label }));
}
