"use client";

import { useEffect, useState, type CSSProperties } from "react";
import "./hero-title.css";

const LINE = "A GENERATION";
const PHRASE = "ON FIRE FOR JESUS.";

const START_DELAY_MS = 500;
const TYPE_MS = 70;
const PHRASE_DELAY_MS = 420;

export function HeroTitle() {
  const [typed, setTyped] = useState(0);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduced) {
      setTyped(LINE.length);
      setReady(true);
      return;
    }

    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    for (let i = 1; i <= LINE.length; i += 1) {
      at(START_DELAY_MS + i * TYPE_MS, () => setTyped(i));
    }
    at(START_DELAY_MS + LINE.length * TYPE_MS, () => setReady(true));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [reduced]);

  const delay = { animationDelay: `${PHRASE_DELAY_MS}ms` } as CSSProperties;

  return (
    <h1 className="kp-hero-title font-display-xl text-[44px] sm:text-[60px] md:text-display-xl uppercase leading-none z-30">
      <span className="sr-only">
        {LINE} {PHRASE}
      </span>
      <span className="kp-hero-title__line" aria-hidden="true">
        <span className="kp-hero-type">
          <span className="kp-hero-type__sizer">
            {LINE}
            {"\u00a0"}
          </span>
          <span className="kp-hero-type__live">
            {LINE.slice(0, typed)}
            {typed < LINE.length ? <span className="kp-hero-type__caret" /> : null}
          </span>
        </span>
      </span>
      <span className="kp-hero-title__phrase" aria-hidden="true">
        {ready ? (
          <span className="kp-hero-phrase kp-hero-phrase--fade-up" style={delay}>
            {PHRASE}
          </span>
        ) : (
          <span className="kp-hero-phrase kp-hero-phrase--reserve">{PHRASE}</span>
        )}
      </span>
    </h1>
  );
}
