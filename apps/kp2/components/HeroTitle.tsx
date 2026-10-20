"use client";

import { useEffect, useState, type CSSProperties } from "react";
import "./hero-title.css";

const LINE = "THIS IS CHURCH";
const PHRASE = "FOR THIS GENERATION.";
const ENTRANCES = ["wipe", "fade-up", "tracking", "words", "blur-in"] as const;

const START_DELAY_MS = 500;
const TYPE_MS = 70;
const PHRASE_DELAY_MS = 420;
const PHRASE_HOLD_MS = 2400;
const OUT_MS = 550;

type Phase = "in" | "hold" | "out";

export function HeroTitle() {
  const [typed, setTyped] = useState(0);
  const [ready, setReady] = useState(false);
  const [entrance, setEntrance] = useState(0);
  const [phase, setPhase] = useState<Phase>("in");
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
      setPhase("hold");
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

  useEffect(() => {
    if (reduced || !ready) return;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    setPhase("in");
    at(PHRASE_DELAY_MS, () => setPhase("hold"));
    at(PHRASE_DELAY_MS + PHRASE_HOLD_MS, () => setPhase("out"));
    at(PHRASE_DELAY_MS + PHRASE_HOLD_MS + OUT_MS, () => {
      setPhase("in");
      setEntrance((current) => (current + 1) % ENTRANCES.length);
    });
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [ready, entrance, reduced]);

  const anim = ENTRANCES[entrance]!;
  const words = PHRASE.split(" ");
  const out = phase === "out" ? " is-out" : "";
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
          <span
            key={entrance}
            className={`kp-hero-phrase kp-hero-phrase--${anim}${out}`}
            style={delay}
          >
            {anim === "words"
              ? words.map((word, index) => (
                  <span
                    key={word}
                    className="kp-hero-phrase__word"
                    style={{ animationDelay: `${PHRASE_DELAY_MS + index * 180}ms` }}
                  >
                    {word}
                    {index < words.length - 1 ? "\u00a0" : null}
                  </span>
                ))
              : PHRASE}
          </span>
        ) : (
          <span className="kp-hero-phrase kp-hero-phrase--reserve">{PHRASE}</span>
        )}
      </span>
    </h1>
  );
}
