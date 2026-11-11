/** Hero headline: types "Welcome to Kharis" once, then hands over to the rotator. */
"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { HeroPhrases } from "./HeroPhrases";
import "./hero-headline.css";

const WELCOME = "Welcome to ";
const BRAND = "Kharis";
const FULL_LENGTH = WELCOME.length + BRAND.length;
const LEAD = "We are";

const START_DELAY_MS = 500;
const TYPE_MS = 80;
const WELCOME_HOLD_MS = 2600;

/** Layout is inline so the headline stays centred even if the stylesheet is stale. */
const LEAD_STYLE: CSSProperties = {
  display: "block",
  height: "1.3em",
  fontSize: "clamp(1.1rem, 2.6vw, 1.75rem)",
  fontWeight: 700,
  lineHeight: 1.3,
  color: "#fff",
  whiteSpace: "nowrap",
};
const HEADLINE_STYLE: CSSProperties = {
  display: "grid",
  placeItems: "center",
  width: "100%",
  height: "1.25em",
  fontSize: "clamp(2rem, 8.2vw, 5.75rem)",
  fontWeight: 800,
  letterSpacing: "-0.025em",
  lineHeight: 1.1,
  color: "#fff",
  whiteSpace: "nowrap",
};
const TYPE_BOX_STYLE: CSSProperties = {
  position: "relative",
  display: "inline-block",
  width: "max-content",
};
const SIZER_STYLE: CSSProperties = { visibility: "hidden" };
const LIVE_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 1,
  textAlign: "left",
};
/** Campaign yellow: "Kharis" in the welcome line. */
const ACCENT = "#ffde59";
const BRAND_STYLE: CSSProperties = { color: ACCENT, WebkitTextFillColor: ACCENT };

export function HeroHeadline() {
  const [typed, setTyped] = useState(0);
  const [introDone, setIntroDone] = useState(false);
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
      setTyped(FULL_LENGTH);
      setIntroDone(true);
      return;
    }
    const timers: number[] = [];
    for (let i = 1; i <= FULL_LENGTH; i += 1) {
      timers.push(window.setTimeout(() => setTyped(i), START_DELAY_MS + i * TYPE_MS));
    }
    const typedAt = START_DELAY_MS + FULL_LENGTH * TYPE_MS;
    timers.push(window.setTimeout(() => setIntroDone(true), typedAt + WELCOME_HOLD_MS));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [reduced]);

  if (!introDone) {
    const welcome = WELCOME.slice(0, Math.min(typed, WELCOME.length));
    const brand = BRAND.slice(0, Math.max(0, typed - WELCOME.length));
    const complete = typed >= FULL_LENGTH;
    return (
      <div aria-hidden>
        <span style={{ ...LEAD_STYLE, visibility: "hidden" }}>{LEAD}</span>
        <div className="hero-headline" style={HEADLINE_STYLE}>
          <span className="hero-type" style={TYPE_BOX_STYLE}>
            <span className="hero-type__sizer" style={SIZER_STYLE}>
              {WELCOME}
              {BRAND}
            </span>
            <span className="hero-type__live hero-depth" style={LIVE_STYLE}>
              {welcome}
              <span className="kharis-brand" style={BRAND_STYLE}>
                {brand}
              </span>
              {!complete ? <span className="hero-type__caret" /> : null}
            </span>
          </span>
        </div>
      </div>
    );
  }

  /* The rotator owns its own loop from here, so there are no per-letter
   * timers and no step state to keep in sync with it. */
  return (
    <div>
      <span className="hero-lead" style={LEAD_STYLE} aria-hidden>
        {LEAD}
      </span>
      <div className="hero-headline" style={HEADLINE_STYLE}>
        <HeroPhrases />
      </div>
    </div>
  );
}
