/** Hero headline timeline: types "Welcome to Kharis", then "We are …" for each church value, then loops. */
"use client";

import { useEffect, useState, type CSSProperties } from "react";

const WELCOME = "Welcome to ";
const BRAND = "Kharis";
const FULL_LENGTH = WELCOME.length + BRAND.length;
const LEAD = "We are";

/** Each phrase gets its own entrance (styles live in hero-slider.css). */
const PHRASES = [
  { text: "Christ-Centric", anim: "fade-up" },
  { text: "Biblical", anim: "tracking" },
  { text: "Spirit Filled", anim: "words" },
  { text: "Revival Seeking", anim: "wipe" },
  { text: "The Saints", anim: "blur-in" },
  { text: "God\u2019s Elect", anim: "fade-up" },
  { text: "Disciples", anim: "tracking" },
  { text: "Hungry for God", anim: "words" },
  { text: "Jesus Believers", anim: "wipe" },
  { text: "Chosen by God", anim: "blur-in" },
  { text: "Jesus Lovers", anim: "words" },
] as const;

const START_DELAY_MS = 500;
const TYPE_MS = 80;
const WELCOME_HOLD_MS = 2600;
/** "We are" animates first; the phrase follows after this delay. */
const LEAD_MS = 450;
const PHRASE_MS = 2800;
const OUT_MS = 550;

type Phase = "in" | "hold" | "out";

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
  fontSize: "clamp(2rem, 8.2vw, 5.25rem)",
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
const BRAND_STYLE: CSSProperties = { color: "#650445", WebkitTextFillColor: "#650445" };

export function HeroHeadline() {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState(0);
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
      setStep(0);
      setTyped(FULL_LENGTH);
      setPhase("hold");
      return;
    }

    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const goTo = (next: number) => {
      setTyped(0);
      setPhase("in");
      setStep(next);
    };

    if (step === 0) {
      for (let i = 1; i <= FULL_LENGTH; i += 1) {
        at(START_DELAY_MS + i * TYPE_MS, () => setTyped(i));
      }
      const typedAt = START_DELAY_MS + FULL_LENGTH * TYPE_MS;
      at(typedAt, () => setPhase("hold"));
      at(typedAt + WELCOME_HOLD_MS, () => setPhase("out"));
      at(typedAt + WELCOME_HOLD_MS + OUT_MS, () => goTo(1));
    } else {
      at(LEAD_MS + PHRASE_MS, () => setPhase("out"));
      at(LEAD_MS + PHRASE_MS + OUT_MS, () => goTo((step + 1) % (PHRASES.length + 1)));
    }

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [step, reduced]);

  const out = phase === "out" ? " is-out" : "";

  if (step === 0) {
    const welcome = WELCOME.slice(0, Math.min(typed, WELCOME.length));
    const brand = BRAND.slice(0, Math.max(0, typed - WELCOME.length));
    const complete = typed >= FULL_LENGTH;
    return (
      <div aria-hidden>
        <span style={{ ...LEAD_STYLE, visibility: "hidden" }}>{LEAD}</span>
        <div className="hero-headline" style={HEADLINE_STYLE}>
          <span className={`hero-type${out}`} style={TYPE_BOX_STYLE}>
            <span className="hero-type__sizer" style={SIZER_STYLE}>
              {WELCOME}
              {BRAND}
            </span>
            <span className="hero-type__live" style={LIVE_STYLE}>
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

  const phrase = PHRASES[step - 1]!;
  const words = phrase.text.split(" ");
  return (
    <div aria-hidden>
      <span key={`lead-${step}`} className={`hero-lead${out}`} style={LEAD_STYLE}>
        {LEAD}
      </span>
      <div className="hero-headline" style={HEADLINE_STYLE}>
        <span
          key={step}
          className={`hero-phrase hero-phrase--${phrase.anim}${out}`}
          style={{ animationDelay: `${LEAD_MS}ms` }}
        >
          {phrase.anim === "words"
            ? words.map((word, i) => (
                <span
                  key={word}
                  className="hero-phrase__word"
                  style={{ animationDelay: `${LEAD_MS + i * 220}ms` }}
                >
                  {word}
                  {i < words.length - 1 ? "\u00a0" : null}
                </span>
              ))
            : phrase.text}
        </span>
      </div>
    </div>
  );
}
