"use client";

import { useEffect, useRef, useState } from "react";

const OPENED_KEY = "kharis-chat-opened";
const COUNT_KEY = "kharis-chat-bounces";
const MAX_CUES = 3;
const COOLDOWN_MS = 45_000;
const SCROLL_SCREENS = 2.5;
const BROWSE_MS = 25_000;
const BROWSE_MIN_SCREENS = 0.75;
const BOUNCE_MS = 1500;
const BUBBLE_MS = 4500;

function readCount(): number {
  try {
    return Number(window.sessionStorage.getItem(COUNT_KEY)) || 0;
  } catch {
    return MAX_CUES;
  }
}

function chatOpenedThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(OPENED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markChatOpened() {
  try {
    window.sessionStorage.setItem(OPENED_KEY, "1");
  } catch {
    /* storage blocked: the cue simply stops for this page view */
  }
}

/**
 * Bounces the chat launcher (and shows a short "Need help?" bubble) when someone keeps scrolling
 * without reaching for it: ~2.5 screens of scrolling, or ~25s of on-and-off scrolling.
 * At most every 45s and 3 times per session; never again once the chat has been opened.
 */
export function useChatAttention(enabled: boolean) {
  const [bouncing, setBouncing] = useState(false);
  const [bubble, setBubble] = useState(false);
  const lastCueAt = useRef(0);

  useEffect(() => {
    if (!enabled || chatOpenedThisSession() || readCount() >= MAX_CUES) return;

    let travelled = 0;
    let lastY = window.scrollY;
    let browsingSince = 0;
    let frame = 0;
    const timers: number[] = [];

    const fire = () => {
      const count = readCount() + 1;
      try {
        window.sessionStorage.setItem(COUNT_KEY, String(count));
      } catch {
        /* ignore */
      }
      lastCueAt.current = Date.now();
      travelled = 0;
      browsingSince = 0;
      setBouncing(true);
      setBubble(true);
      timers.push(
        window.setTimeout(() => setBouncing(false), BOUNCE_MS),
        window.setTimeout(() => setBubble(false), BUBBLE_MS),
      );
      if (count >= MAX_CUES) window.removeEventListener("scroll", onScroll);
    };

    const check = () => {
      frame = 0;
      const y = window.scrollY;
      const screen = window.innerHeight || 800;
      const delta = Math.abs(y - lastY);
      lastY = y;
      // Big jumps are route changes or anchor jumps, not browsing.
      if (delta > screen * 1.5) return;
      travelled += delta;
      const now = Date.now();
      if (!browsingSince && delta > 0) browsingSince = now;
      if (document.hidden || chatOpenedThisSession()) return;
      if (now - lastCueAt.current < COOLDOWN_MS) return;
      const scrolledLots = travelled >= screen * SCROLL_SCREENS;
      const browsingLong =
        browsingSince > 0 &&
        now - browsingSince >= BROWSE_MS &&
        travelled >= screen * BROWSE_MIN_SCREENS;
      if (scrolledLots || browsingLong) fire();
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(check);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      timers.forEach((t) => window.clearTimeout(t));
      setBouncing(false);
      setBubble(false);
    };
  }, [enabled]);

  return { bouncing: enabled && bouncing, bubble: enabled && bubble };
}
