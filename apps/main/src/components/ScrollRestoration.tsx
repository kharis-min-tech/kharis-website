"use client";

import { useEffect } from "react";
import { getRestoredPosition, parseScrollSnapshot } from "@/lib/scroll-restoration";

const storageKey = () => `kharis-scroll:${location.pathname}${location.search}${location.hash}`;

/** Keep a reload at the same reading position, including content that settles after hydration. */
export function ScrollRestoration() {
  useEffect(() => {
    history.scrollRestoration = "auto";

    const save = () => {
      const y = window.scrollY;
      const anchors = document.querySelectorAll<HTMLElement>(
        'main section[id], main [role="tabpanel"][id], main [id^="faith-question-"]',
      );
      let anchor: HTMLElement | undefined;
      let anchorTop = -Infinity;
      for (const candidate of anchors) {
        const top = candidate.getBoundingClientRect().top + y;
        if (candidate.getClientRects().length > 0 && top <= y + 1 && top > anchorTop) {
          anchor = candidate;
          anchorTop = top;
        }
      }
      try {
        sessionStorage.setItem(
          storageKey(),
          JSON.stringify({
            x: window.scrollX,
            y,
            ...(anchor ? { anchorId: anchor.id, anchorOffset: y - anchorTop } : {}),
          }),
        );
      } catch {
        // Native browser restoration remains available when storage is blocked.
      }
    };
    window.addEventListener("pagehide", save);

    const [navigation] = performance.getEntriesByType(
      "navigation",
    ) as PerformanceNavigationTiming[];
    let saved = null;
    if (navigation?.type === "reload") {
      try {
        saved = parseScrollSnapshot(sessionStorage.getItem(storageKey()));
      } catch {
        // Use native restoration if browser storage cannot be read.
      }
    }

    if (navigation?.type === "navigate" && location.hash.length > 1) {
      try {
        saved = {
          x: 0,
          y: window.scrollY,
          anchorId: decodeURIComponent(location.hash.slice(1)),
          anchorOffset: 0,
        };
      } catch {
        // Leave malformed section links to the browser.
      }
    }

    let stopRestoring = () => {};
    if (saved) {
      const snapshot = saved;
      const originalUrl = location.href;
      const restore = () => {
        if (location.href !== originalUrl) {
          stopRestoring();
          return;
        }
        const anchor = snapshot.anchorId ? document.getElementById(snapshot.anchorId) : null;
        const anchorTop = anchor ? anchor.getBoundingClientRect().top + window.scrollY : undefined;
        window.scrollTo({ ...getRestoredPosition(snapshot, anchorTop), behavior: "instant" });
      };
      const observer = new ResizeObserver(restore);
      const timers = [0, 100, 350, 900, 1800, 2800].map((delay) =>
        window.setTimeout(restore, delay),
      );
      const stopTimer = window.setTimeout(() => stopRestoring(), 5000);
      const events = ["pointerdown", "wheel", "touchstart", "keydown"] as const;
      stopRestoring = () => {
        observer.disconnect();
        timers.forEach((timer) => window.clearTimeout(timer));
        window.clearTimeout(stopTimer);
        events.forEach((event) => window.removeEventListener(event, stopRestoring));
      };
      // The saved section can move while a chapter or streamed content becomes available.
      observer.observe(document.body);
      events.forEach((event) => window.addEventListener(event, stopRestoring, { passive: true }));
      restore();
    }

    return () => {
      stopRestoring();
      window.removeEventListener("pagehide", save);
    };
  }, []);

  return null;
}
