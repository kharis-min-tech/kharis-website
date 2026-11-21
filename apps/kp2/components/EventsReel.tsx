"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { REEL_COVERS, SIGNATURE_EVENTS } from "@/lib/signature-events";
import { InViewVideo } from "@/components/InViewVideo";

const ADVANCE_MS = 6500;
const COUNT = SIGNATURE_EVENTS.length;

/** Where card `i` sits relative to the active one: -1 left, 0 centre, 1 right, 2 tucked behind. */
function offsetOf(i: number, active: number) {
  let o = (i - active + COUNT) % COUNT;
  if (o > COUNT / 2) o -= COUNT;
  return o;
}

function scrollToChapter(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "instant" : "smooth", block: "start" });
}

/**
 * The opening reel: the four events as tall cards on a slow carousel. The centre card plays its
 * clip and the stage behind it takes on that event's colour. It advances by itself
 * every few seconds (never under reduced motion, and never while someone is pointing at, focused
 * in or swiping the reel); arrows, the chapter list, swipes and arrow keys move it by hand.
 */
export function EventsReel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const inView = useRef(true);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback((next: number) => setActive(((next % COUNT) + COUNT) % COUNT), []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const on = () => setReduce(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting;
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || paused) return;
    const timer = window.setInterval(() => {
      if (inView.current && document.visibilityState === "visible")
        setActive((a) => (a + 1) % COUNT);
    }, ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [reduce, paused, active]);

  const current = SIGNATURE_EVENTS[active];

  return (
    <section
      ref={rootRef}
      className="kp-reel"
      aria-roledescription="carousel"
      aria-label="KP2 events"
      style={{ "--accent": current.accent, "--on-accent": current.onAccent } as React.CSSProperties}
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(active + 1);
        if (e.key === "ArrowLeft") go(active - 1);
      }}
    >
      {/* The stage glow: each event's cover, blurred, cross-fading slowly behind the cards. */}
      <div className="kp-reel__ambient" aria-hidden="true">
        {SIGNATURE_EVENTS.map((ev, i) => (
          <div
            key={ev.id}
            className={`kp-reel__ambient-layer${i === active ? " is-on" : ""}`}
            style={{ backgroundImage: `url("${REEL_COVERS[ev.id].still}")` }}
          />
        ))}
      </div>
      <div className="kp-reel__dots" aria-hidden="true" />

      <div className="kp-reel__intro">
        <p className="kp-reel__eyebrow">The KP2 year</p>
        <h1 className="kp-reel__title">Events</h1>
        <p className="kp-reel__lede">
          Four moments we never miss. Slow down, scroll through, and come to the next one.
        </p>
        <ol className="kp-reel__index">
          {SIGNATURE_EVENTS.map((ev, i) => (
            <li key={ev.id}>
              <button
                type="button"
                className={`kp-reel__index-item${i === active ? " is-active" : ""}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => go(i)}
              >
                <span className="kp-reel__index-num">{ev.number}</span>
                <span className="kp-reel__index-name">{ev.name}</span>
                {i === active && !reduce && !paused ? (
                  <span key={active} className="kp-reel__index-timer" aria-hidden="true" />
                ) : null}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div
        className="kp-reel__stage"
        onPointerDown={(e) => {
          swipe.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const start = swipe.current;
          swipe.current = null;
          if (!start) return;
          const dx = e.clientX - start.x;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - start.y))
            go(active + (dx < 0 ? 1 : -1));
        }}
        onPointerCancel={() => {
          swipe.current = null;
        }}
      >
        {SIGNATURE_EVENTS.map((ev, i) => {
          const o = offsetOf(i, active);
          const cover = REEL_COVERS[ev.id];
          const isActive = o === 0;
          return (
            <article
              key={ev.id}
              className={`kp-reel__card${isActive ? " is-active" : ""}`}
              style={
                {
                  "--o": o,
                  "--abs": Math.abs(o),
                  "--card-accent": ev.accent,
                  "--card-on-accent": ev.onAccent,
                } as React.CSSProperties
              }
              aria-roledescription="slide"
              aria-label={`${ev.number} of 0${COUNT}: ${ev.fullName ?? ev.name}`}
              aria-hidden={isActive ? undefined : true}
              onClick={() => (isActive ? scrollToChapter(ev.id) : go(i))}
            >
              <div className="kp-reel__media">
                {cover.clip ? (
                  <InViewVideo
                    src={cover.clip}
                    poster={cover.still}
                    active={isActive}
                    className="kp-reel__video"
                    label={cover.alt}
                  />
                ) : (
                  <img
                    className="kp-reel__img"
                    src={cover.still}
                    alt={cover.alt}
                    decoding="async"
                  />
                )}
              </div>
              <div className="kp-reel__card-copy">
                <span className="kp-reel__card-num">{ev.number}</span>
                <h2 className="kp-reel__card-title">{ev.name}</h2>
                {ev.fullName ? <p className="kp-reel__card-full">{ev.fullName}</p> : null}
                <p className="kp-reel__card-tag">{ev.tagline}</p>
                <button
                  type="button"
                  className="kp-reel__card-go"
                  tabIndex={isActive ? 0 : -1}
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToChapter(ev.id);
                  }}
                >
                  Step inside
                  <span className="material-symbols-outlined" aria-hidden="true">
                    south
                  </span>
                </button>
              </div>
            </article>
          );
        })}

        <div className="kp-reel__controls">
          <button
            type="button"
            className="kp-reel__arrow"
            onClick={() => go(active - 1)}
            aria-label="Previous event"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              west
            </span>
          </button>
          <span className="kp-reel__count" aria-live="polite">
            <b>{current.number}</b> / 0{COUNT}
          </span>
          <button
            type="button"
            className="kp-reel__arrow"
            onClick={() => go(active + 1)}
            aria-label="Next event"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              east
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
