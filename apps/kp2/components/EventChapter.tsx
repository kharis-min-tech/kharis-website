"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { EventMoment, SignatureEvent } from "@/lib/signature-events";
import { InViewVideo } from "@/components/InViewVideo";
import { EventLineup } from "@/components/EventLineup";
import { EventStory } from "@/components/EventStory";
import { EventTeams } from "@/components/EventTeams";
import { EventBouts } from "@/components/EventBouts";

const GLIDE_MS = 950;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Adds `data-in` once the element is a little way into the viewport, for the slow entrances. */
function useArrive(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion() || !("IntersectionObserver" in window)) {
      el.dataset.in = "";
      return;
    }
    el.dataset.arrive = "";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.in = "";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

/**
 * A horizontal strip of photos and clips. The frame nearest the middle is "on": it straightens,
 * sharpens and (for a clip) plays, while its neighbours sit tilted and dimmed.
 * The arrows and a mouse drag glide slowly to the next frame; touch and trackpads scroll natively
 * and snap.
 */
function MomentsCarousel({ ev }: { ev: SignatureEvent }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const glide = useRef<number | null>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const count = ev.moments.length;

  const nearest = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestD = Infinity;
    [...track.children].forEach((child, i) => {
      const el = child as HTMLElement;
      const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return best;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(nearest()));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [nearest]);

  const glideTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const i = Math.max(0, Math.min(count - 1, index));
      const el = track.children[i] as HTMLElement;
      const target = Math.max(
        0,
        Math.min(
          track.scrollWidth - track.clientWidth,
          el.offsetLeft + el.offsetWidth / 2 - track.clientWidth / 2,
        ),
      );
      if (glide.current) cancelAnimationFrame(glide.current);
      if (reducedMotion()) {
        track.scrollLeft = target;
        return;
      }
      const from = track.scrollLeft;
      const startT = performance.now();
      track.style.scrollSnapType = "none";
      const step = (now: number) => {
        const t = Math.min(1, (now - startT) / GLIDE_MS);
        track.scrollLeft = from + (target - from) * easeInOut(t);
        if (t < 1) glide.current = requestAnimationFrame(step);
        else {
          glide.current = null;
          track.style.scrollSnapType = "";
        }
      };
      glide.current = requestAnimationFrame(step);
    },
    [count],
  );

  return (
    <div
      className="kp-moments"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${ev.name} moments`}
    >
      <div className="kp-moments__bar">
        <p className="kp-moments__label">Moments</p>
        <div className="kp-moments__progress" aria-hidden="true">
          <span style={{ width: `${((active + 1) / count) * 100}%` }} />
        </div>
        <p className="kp-moments__count" aria-live="polite">
          <b>{String(active + 1).padStart(2, "0")}</b> / {String(count).padStart(2, "0")}
        </p>
        <div className="kp-moments__arrows">
          <button
            type="button"
            className="kp-moments__arrow"
            onClick={() => glideTo(active - 1)}
            disabled={active === 0}
            aria-label={`Previous ${ev.name} moment`}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              west
            </span>
          </button>
          <button
            type="button"
            className="kp-moments__arrow"
            onClick={() => glideTo(active + 1)}
            disabled={active === count - 1}
            aria-label={`Next ${ev.name} moment`}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              east
            </span>
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        className="kp-moments__track"
        tabIndex={0}
        aria-label={`${ev.name} photos and clips. Use the arrow keys to move.`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            glideTo(active + 1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            glideTo(active - 1);
          }
        }}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || e.button !== 0) return;
          const track = trackRef.current;
          if (!track) return;
          if (glide.current) cancelAnimationFrame(glide.current);
          drag.current = { x: e.clientX, left: track.scrollLeft, moved: false };
          track.style.scrollSnapType = "none";
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          const track = trackRef.current;
          if (!d || !track) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 4 && !d.moved) {
            d.moved = true;
            track.setPointerCapture(e.pointerId);
            track.dataset.dragging = "";
          }
          if (d.moved) track.scrollLeft = d.left - dx;
        }}
        onPointerUp={(e) => {
          const d = drag.current;
          const track = trackRef.current;
          drag.current = null;
          if (!d || !track) return;
          delete track.dataset.dragging;
          if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
          if (d.moved) {
            // A flick moves at least one frame in its direction; otherwise settle on the nearest.
            const dx = e.clientX - d.x;
            const here = nearest();
            glideTo(Math.abs(dx) > 60 && here === active ? active + (dx < 0 ? 1 : -1) : here);
          } else {
            track.style.scrollSnapType = "";
          }
        }}
      >
        {ev.moments.map((m, i) => (
          <MomentCard
            key={m.src}
            moment={m}
            index={i}
            active={i === active}
            onPick={() => glideTo(i)}
          />
        ))}
      </ul>
    </div>
  );
}

function MomentCard({
  moment,
  index,
  active,
  onPick,
}: {
  moment: EventMoment;
  index: number;
  active: boolean;
  onPick: () => void;
}) {
  return (
    <li
      className={`kp-moment${moment.tall ? " kp-moment--tall" : ""}${active ? " is-active" : ""}`}
      style={{ "--tilt": index % 2 ? "1.6deg" : "-1.4deg" } as React.CSSProperties}
      onClick={active ? undefined : onPick}
    >
      <figure className="kp-moment__frame">
        {moment.kind === "clip" ? (
          <InViewVideo
            src={moment.src}
            poster={moment.poster}
            active={active}
            className="kp-moment__media"
            label={moment.alt}
          />
        ) : (
          <img
            className="kp-moment__media"
            src={moment.src}
            alt={moment.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            style={moment.position ? { objectPosition: moment.position } : undefined}
          />
        )}
        <figcaption className="kp-moment__caption">{moment.caption}</figcaption>
      </figure>
    </li>
  );
}

function ChapterTitle({ text }: { text: string }) {
  return (
    <span className="kp-chap__title-letters" aria-hidden="true">
      {[...text].map((ch, i) => (
        <span key={i} style={{ "--i": i } as React.CSSProperties}>
          {ch === " " ? "\u00a0" : ch}
        </span>
      ))}
    </span>
  );
}

export function EventChapter({ ev }: { ev: SignatureEvent }) {
  const ref = useRef<HTMLElement>(null);
  useArrive(ref);
  const tall = ev.feature.tall;

  return (
    <section
      ref={ref}
      id={ev.id}
      className={`kp-chap kp-chap--${ev.id}`}
      data-reveal="self"
      aria-labelledby={`${ev.id}-title`}
      style={{ "--accent": ev.accent, "--on-accent": ev.onAccent } as React.CSSProperties}
    >
      <header className="kp-chap__head">
        <p className="kp-chap__label">
          Chapter <b>{ev.number}</b>
        </p>
        <h2
          id={`${ev.id}-title`}
          className="kp-chap__title"
          aria-label={ev.fullName ? `${ev.name}: ${ev.fullName}` : ev.name}
        >
          <ChapterTitle text={ev.name} />
        </h2>
        {ev.fullName ? <p className="kp-chap__full">{ev.fullName}</p> : null}
      </header>

      <div className={`kp-chap__feature${tall ? " kp-chap__feature--tall" : ""}`}>
        <figure className="kp-chap__frame">
          {ev.feature.kind === "clip" ? (
            <InViewVideo
              src={ev.feature.src}
              poster={ev.feature.poster}
              className="kp-chap__media"
              label={ev.feature.alt}
            />
          ) : (
            <img
              className="kp-chap__media kp-chap__media--drift"
              src={ev.feature.src}
              alt={ev.feature.alt}
              loading="lazy"
              decoding="async"
            />
          )}
          <span className="kp-chap__sweep" aria-hidden="true" />
        </figure>

        <div className="kp-chap__story">
          <p className="kp-chap__tagline">{ev.tagline}</p>
          <p className="kp-chap__intro">{ev.intro}</p>
          <ul className="kp-chap__facts">
            {ev.facts.map((fact, i) => (
              <li key={fact} style={{ "--i": i } as React.CSSProperties}>
                {fact}
              </li>
            ))}
          </ul>
          {ev.quote ? (
            <blockquote className="kp-chap__quote">
              <p>{ev.quote}</p>
            </blockquote>
          ) : null}
        </div>
      </div>

      {ev.lineup ? <EventLineup lineup={ev.lineup} /> : null}
      {ev.story ? <EventStory story={ev.story} /> : null}
      {ev.teams ? <EventTeams teams={ev.teams} /> : null}
      {ev.bouts ? <EventBouts bouts={ev.bouts} /> : null}

      <MomentsCarousel ev={ev} />
    </section>
  );
}

/**
 * Camp: a whole day in the Word. A switcher shows one camp at a time and recolours the chapter
 * in that camp's colour: a photo mosaic beside the pastor's word for that camp, the camp's summary
 * and its themes. The moments carousel runs underneath.
 */
export function CampChapter({ ev }: { ev: SignatureEvent }) {
  const ref = useRef<HTMLElement>(null);
  useArrive(ref);
  const camps = ev.camps ?? [];
  const [active, setActive] = useState(0);
  const camp = camps[active];

  // Fetch every camp's photos once the chapter is on its way into view, so switching camps
  // never shows empty frames while the other mosaic loads.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        (ev.camps ?? []).forEach((c) =>
          c.photos.forEach((photo) => {
            const img = new Image();
            img.src = photo.src;
          }),
        );
      },
      { rootMargin: "0px 0px 50% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ev.camps]);

  if (!camp) return null;

  const pick = (i: number) => {
    const next = (i + camps.length) % camps.length;
    setActive(next);
    document.getElementById(`camp-tab-${camps[next].id}`)?.focus();
  };

  return (
    <section
      ref={ref}
      id={ev.id}
      className="kp-chap kp-chap--camp"
      data-reveal="self"
      aria-labelledby={`${ev.id}-title`}
      style={{ "--accent": camp.colour, "--on-accent": camp.onColour } as React.CSSProperties}
    >
      <header className="kp-chap__head">
        <p className="kp-chap__label">
          Chapter <b>{ev.number}</b>
        </p>
        <h2 id={`${ev.id}-title`} className="kp-chap__title" aria-label={ev.name}>
          <ChapterTitle text={ev.name} />
        </h2>
        <p className="kp-chap__full">Morning to evening in the Word</p>
      </header>

      <div className="kp-camp__intro">
        <p className="kp-chap__tagline">{ev.tagline}</p>
        <p className="kp-chap__intro">{ev.intro}</p>
        <ul className="kp-chap__facts">
          {ev.facts.map((fact, i) => (
            <li key={fact} style={{ "--i": i } as React.CSSProperties}>
              {fact}
            </li>
          ))}
        </ul>
        {ev.scriptures?.length ? (
          <ul className="kp-camp__verses">
            {ev.scriptures.map((verse) => (
              <li key={verse.ref}>
                <blockquote className="kp-camp__verse">
                  <p>{verse.text}</p>
                  <cite className="kp-camp__verse-ref">{verse.ref}</cite>
                </blockquote>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="kp-camp__switch" role="tablist" aria-label="Camps">
        {camps.map((c, i) => (
          <button
            key={c.id}
            id={`camp-tab-${c.id}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`camp-panel-${c.id}`}
            tabIndex={i === active ? 0 : -1}
            className={`kp-camp__tab${i === active ? " is-active" : ""}`}
            style={{ "--tab": c.colour, "--on-tab": c.onColour } as React.CSSProperties}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") pick(i + 1);
              if (e.key === "ArrowLeft") pick(i - 1);
            }}
          >
            <span className="kp-camp__tab-name">{c.name}</span>
            {c.scripture ? <span className="kp-camp__tab-ref">{c.scripture}</span> : null}
          </button>
        ))}
      </div>

      <div
        key={camp.id}
        id={`camp-panel-${camp.id}`}
        role="tabpanel"
        aria-labelledby={`camp-tab-${camp.id}`}
        className="kp-camp__panel"
      >
        <div className="kp-camp__mosaic">
          {camp.photos.map((photo, i) => (
            <figure key={photo.src} className={`kp-camp__photo kp-camp__photo--${i}`}>
              <img
                src={photo.src}
                alt={photo.alt}
                loading="eager"
                decoding="async"
                style={photo.position ? { objectPosition: photo.position } : undefined}
              />
            </figure>
          ))}
        </div>

        <div className="kp-camp__word">
          <blockquote className="kp-camp__quote">
            <p>{camp.quote}</p>
            <footer>Pastor David Antwi</footer>
          </blockquote>
          {camp.scripture && camp.scriptureText ? (
            <blockquote className="kp-camp__verse kp-camp__verse--key">
              <p>{camp.scriptureText}</p>
              <cite className="kp-camp__verse-ref">{camp.scripture} · Key scripture</cite>
            </blockquote>
          ) : null}
          <p className="kp-camp__summary">{camp.summary}</p>
          <dl className="kp-camp__themes">
            {camp.themes.map((theme) => (
              <div key={theme.title} className="kp-camp__theme">
                <dt>{theme.title}</dt>
                <dd>{theme.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <MomentsCarousel ev={ev} />
    </section>
  );
}
