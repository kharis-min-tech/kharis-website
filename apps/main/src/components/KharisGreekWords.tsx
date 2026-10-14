"use client";

import { useInView } from "framer-motion";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { ABOUT } from "@/lib/about-content";
import "./kharis-greek.css";

type GreekCard = { label: string; word: string; meaning: string };

const CARDS: GreekCard[] = [
  { label: ABOUT.brandWord, word: ABOUT.greek.word, meaning: ABOUT.greek.meaning },
  { label: ABOUT.ministriesWord, word: ABOUT.ministriesGreek.word, meaning: ABOUT.ministriesGreek.meaning },
];

/** Seconds between the start of each card's painting sequence. */
const CARD_STAGGER = 0.55;
/** Length of one card's sequence (s); must outlast the CSS timeline in kharis-greek.css. */
const SEQUENCE = 3;

type Metrics = {
  width: number;
  height: number;
  baseline: number;
  textWidth: number;
  fontSize: number;
};

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** Hydration-safe: false on the server and during hydration, then the real preference. */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

/** The two "what Kharis means" cards, with the Greek words painted in on first view. */
export function KharisGreekWords() {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, amount: 0.45 });
  const reduced = usePrefersReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView || reduced) return;
    const t = window.setTimeout(() => setDone(true), (SEQUENCE + (CARDS.length - 1) * CARD_STAGGER) * 1000);
    return () => window.clearTimeout(t);
  }, [inView, reduced]);

  const state = reduced ? "is-static" : done ? "is-done" : inView ? "is-painting" : "is-waiting";

  return (
    <div ref={gridRef} className={`about-ety__grid kgw ${state}`}>
      {CARDS.map((card, i) => (
        <PaintedCard key={card.word} card={card} delay={i * CARD_STAGGER} animate={!reduced && !done} />
      ))}
    </div>
  );
}

function PaintedCard({ card, delay, animate }: { card: GreekCard; delay: number; animate: boolean }) {
  const greekRef = useRef<HTMLParagraphElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const baseRef = useRef<HTMLSpanElement>(null);
  const [m, setM] = useState<Metrics | null>(null);
  const [wrapped, setWrapped] = useState(false);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const measure = useCallback(() => {
    const p = greekRef.current;
    const text = textRef.current;
    const base = baseRef.current;
    if (!p || !text || !base) return;
    const pr = p.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(text);
    const lines = range.getClientRects();
    const tr = range.getBoundingClientRect();
    const fontSize = parseFloat(getComputedStyle(p).fontSize) || 24;
    setWrapped(lines.length > 1);
    setM({
      width: pr.width,
      height: pr.height,
      baseline: base.getBoundingClientRect().top - pr.top,
      textWidth: tr.width,
      fontSize,
    });
  }, []);

  useIsoLayoutEffect(() => {
    measure();
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });
    const ro = new ResizeObserver(() => measure());
    if (greekRef.current) ro.observe(greekRef.current);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [measure]);

  const svgPaint = animate && m && !wrapped;
  const style = { "--kgw-d": `${delay}s` } as CSSProperties;

  return (
    <div className={`about-ety__card kgw-card${svgPaint ? " kgw-card--svg" : ""}`} style={style}>
      <p className="about-ety__label kgw-label">
        <span className="kgw-sr">{card.label}</span>
        <span aria-hidden className="kgw-split">
          {Array.from(card.label).map((ch, i) => (
            <span key={i} className="kgw-letter" style={{ "--i": i } as CSSProperties}>
              {ch}
            </span>
          ))}
        </span>
      </p>

      <p ref={greekRef} className="about-ety__greek kgw-greek" lang="el">
        {m && <Swash id={uid} m={m} />}
        <span ref={textRef} className="kgw-greek__text">
          {card.word}
        </span>
        <span ref={baseRef} className="kgw-greek__base" aria-hidden />
        {svgPaint && m && <PaintLayer id={uid} m={m} word={card.word} />}
      </p>

      <p className="about-ety__meaning kgw-meaning">
        <span className="kgw-sr">{card.meaning}</span>
        <span aria-hidden className="kgw-split">
          {card.meaning.split(" ").map((w, i, arr) => (
            <span key={i}>
              <span className="kgw-word" style={{ "--i": i } as CSSProperties}>
                {w}
              </span>
              {i < arr.length - 1 ? " " : null}
            </span>
          ))}
        </span>
      </p>
    </div>
  );
}

/** Brush underline painted behind the Greek word; it stays as part of the resting state. */
function Swash({ id, m }: { id: string; m: Metrics }) {
  const w = m.textWidth;
  const fs = m.fontSize;
  const y = m.baseline + fs * 0.14;
  const d = `M ${-fs * 0.1} ${y + fs * 0.06} C ${w * 0.28} ${y - fs * 0.07}, ${w * 0.62} ${y + fs * 0.1}, ${w + fs * 0.12} ${y - fs * 0.05}`;
  return (
    <svg className="kgw-swash" width={m.width} height={m.height} aria-hidden focusable="false">
      <defs>
        <filter id={`kgw-dry-${id}`} x="-10%" y="-80%" width="120%" height="260%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.55" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={fs * 0.22} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.2 0 0 0 -0.9" result="streaks" />
          <feComposite in="d" in2="streaks" operator="in" />
        </filter>
      </defs>
      <path
        className="kgw-swash__stroke"
        d={d}
        pathLength={1}
        strokeWidth={fs * 0.26}
        filter={`url(#kgw-dry-${id})`}
      />
    </svg>
  );
}

/**
 * Geometry for a left → right mask wipe with a soft leading edge of `soft` px.
 * Starts fully left of the text and travels until the whole word is uncovered.
 */
function brushWipe(textWidth: number, fs: number, soft: number) {
  const lead = -fs * 0.8;
  const travel = textWidth + soft + fs * 1.6;
  const width = travel + soft + fs * 3;
  return {
    lead,
    soft,
    x: lead - width,
    width,
    style: { "--kgw-travel": `${travel}px` } as CSSProperties,
  };
}

/** Decorative SVG duplicate of the Greek word: outline traced, then ink brushed in. */
function PaintLayer({ id, m, word }: { id: string; m: Metrics; word: string }) {
  const fs = m.fontSize;
  const pad = fs * 1.2;
  const top = -pad;
  const h = m.height + pad * 2;
  const pen = brushWipe(m.textWidth, fs, fs * 1.8);
  const ink = brushWipe(m.textWidth, fs, fs * 0.8);
  const region = { x: -m.textWidth * 3 - fs * 10, width: m.textWidth * 6 + fs * 20 };

  return (
    <svg className="kgw-paint" width={m.width} height={m.height} aria-hidden focusable="false">
      <defs>
        <filter id={`kgw-ink-${id}`} x="-5%" y="-20%" width="110%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={fs * 0.05} xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id={`kgw-bristle-${id}`} x="-5%" y="-10%" width="110%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.32" numOctaves="2" seed="11" result="n" />
          <feColorMatrix in="n" type="matrix" values="1 0 0 0 0  0 0 0 0 0.5  0 0 0 0 0  0 0 0 0 1" result="nx" />
          <feDisplacementMap in="SourceGraphic" in2="nx" scale={fs * 1.3} xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {[
          { key: "pen", w: pen },
          { key: "ink", w: ink },
        ].map(({ key, w }) => (
          <linearGradient
            key={key}
            id={`kgw-grad-${key}-${id}`}
            gradientUnits="userSpaceOnUse"
            x1={w.lead - w.soft}
            x2={w.lead}
            y1={0}
            y2={0}
          >
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
        ))}

        <mask id={`kgw-mask-pen-${id}`} maskUnits="userSpaceOnUse" x={region.x} y={top} width={region.width} height={h}>
          <g className="kgw-wipe kgw-wipe--pen" style={pen.style}>
            <rect x={pen.x} y={top} width={pen.width} height={h} fill={`url(#kgw-grad-pen-${id})`} />
          </g>
        </mask>

        <mask id={`kgw-mask-ink-${id}`} maskUnits="userSpaceOnUse" x={region.x} y={top} width={region.width} height={h}>
          <g className="kgw-wipe kgw-wipe--ink" style={ink.style}>
            <rect
              x={ink.x}
              y={top}
              width={ink.width}
              height={h}
              fill={`url(#kgw-grad-ink-${id})`}
              filter={`url(#kgw-bristle-${id})`}
            />
          </g>
        </mask>
      </defs>

      <g mask={`url(#kgw-mask-ink-${id})`}>
        <text className="kgw-paint__fill" x={0} y={m.baseline}>
          {word}
        </text>
      </g>

      <g mask={`url(#kgw-mask-pen-${id})`} filter={`url(#kgw-ink-${id})`}>
        <text className="kgw-paint__outline" x={0} y={m.baseline}>
          {word}
        </text>
      </g>
    </svg>
  );
}
