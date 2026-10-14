"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Clock, MapPin, Navigation, Pause, Play } from "lucide-react";
import { EVENT_CATEGORIES, type EventCategory, type EventSlide } from "@/data/event-categories";
import type { ServiceBranch } from "@/lib/service-branches";
import "./event-categories.css";

const SLIDE_MS = 5000;
const DEFAULT_BRANCH = "london";
const BRANCH_KEY = "kharis-service-branch";
const ease = [0.22, 1, 0.36, 1] as const;

const branchListeners = new Set<() => void>();

function subscribeBranch(listener: () => void) {
  branchListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    branchListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readBranch() {
  try {
    return localStorage.getItem(BRANCH_KEY);
  } catch {
    return null;
  }
}

function saveBranch(slug: string) {
  try {
    localStorage.setItem(BRANCH_KEY, slug);
  } catch {
    /* private mode: the choice just won't persist */
  }
  branchListeners.forEach((listener) => listener());
}

function CategoryRow({
  activeId,
  panelId,
  onSelect,
}: {
  activeId: string;
  panelId: string;
  onSelect: (id: string) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = EVENT_CATEGORIES.length;

  const select = (index: number, focus: boolean) => {
    const button = refs.current[index];
    if (focus) button?.focus();
    button?.scrollIntoView({ block: "nearest", inline: "nearest" });
    onSelect(EVENT_CATEGORIES[index]!.id);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next =
      e.key === "ArrowRight"
        ? (index + 1) % count
        : e.key === "ArrowLeft"
          ? (index - 1 + count) % count
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? count - 1
              : -1;
    if (next < 0) return;
    e.preventDefault();
    select(next, true);
  };

  return (
    <div className="events-cats__row" role="tablist" aria-label="Kharis events">
      {EVENT_CATEGORIES.map((cat, i) => {
        const Icon = cat.icon;
        const selected = cat.id === activeId;
        const groupStart = i > 0 && EVENT_CATEGORIES[i - 1]!.status !== cat.status;

        return (
          <Fragment key={cat.id}>
            {groupStart ? <span className="events-cats__divider" aria-hidden /> : null}
            <button
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`events-cat-${cat.id}`}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              className={`events-cat${selected ? " is-selected" : ""}`}
              onClick={() => select(i, false)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <span className="events-cat__circle">
                <Icon aria-hidden strokeWidth={1.25} className="events-cat__icon" />
              </span>
              <span className="events-cat__label">{cat.label}</span>
              <span className="events-cat__status">
                {cat.status === "upcoming" ? "Upcoming" : "Past event"}
              </span>
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}

function ServiceVisitPanel({
  category,
  branches,
}: {
  category: EventCategory;
  branches: ServiceBranch[];
}) {
  const stored = useSyncExternalStore(subscribeBranch, readBranch, () => null);
  const branch =
    branches.find((b) => b.slug === stored) ??
    branches.find((b) => b.slug === DEFAULT_BRANCH) ??
    branches[0];

  if (!branch) {
    return (
      <div className="events-visit">
        <Link href="/locations" className="events-visit__cta k-cta">
          Find your nearest service
          <ArrowUpRight aria-hidden className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const visit = category.service === "midweek" ? branch.midweek : branch.sunday;
  const kharis = branches.filter((b) => b.group === "kharis");
  const kp2 = branches.filter((b) => b.group === "kp2");

  return (
    <div className="events-visit">
      <label className="events-visit__branch">
        <span>Your branch</span>
        <select value={branch.slug} onChange={(e) => saveBranch(e.target.value)}>
          <optgroup label="Kharis Church">
            {kharis.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </optgroup>
          {kp2.length ? (
            <optgroup label="KP2">
              {kp2.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </optgroup>
          ) : null}
        </select>
      </label>

      {visit ? (
        <>
          <p className="events-visit__line">
            <Clock aria-hidden className="events-visit__ico" />
            <span>
              Every {visit.day} · {visit.times.join(" & ")}
            </span>
          </p>
          <p className="events-visit__line">
            <MapPin aria-hidden className="events-visit__ico" />
            <span>
              <strong>{visit.venue}</strong>
              {visit.address ? <span>{visit.address}</span> : null}
            </span>
          </p>
          <div className="events-visit__ctas">
            {visit.mapsUrl ? (
              <a
                href={visit.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="events-visit__cta k-cta"
              >
                <Navigation aria-hidden className="h-4 w-4" />
                Get directions
              </a>
            ) : null}
            <Link href={branch.href} className="events-visit__cta events-visit__cta--ghost k-cta">
              {branch.name} branch
              <ArrowUpRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
        </>
      ) : (
        <p className="events-visit__line">
          <span>
            {branch.name} doesn’t list a {category.service === "midweek" ? "midweek" : "Sunday"}{" "}
            service yet.
          </span>
        </p>
      )}

      <Link href="/locations" className="events-visit__more">
        Find your nearest service
        <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function Gallery({ slides, label }: { slides: EventSlide[]; label: string }) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const settling = useRef<number | null>(null);
  const drag = useRef<{ x: number; left: number; start: number } | null>(null);
  const [index, setIndex] = useState(0);
  const [userPlay, setUserPlay] = useState<boolean | null>(null);
  const [inView, setInView] = useState(false);
  const count = slides.length;

  const playing = userPlay ?? !reduce;
  const running = playing && inView && count > 1;

  const settle = useCallback(() => {
    if (settling.current) window.clearTimeout(settling.current);
    settling.current = null;
    trackRef.current?.classList.remove("is-dragging");
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const track = trackRef.current;
      const slide = track?.children[next] as HTMLElement | undefined;
      if (!track || !slide) return;
      setIndex(next);
      if (settling.current) window.clearTimeout(settling.current);
      settling.current = window.setTimeout(settle, 900);
      const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      track.scrollTo({ left: slide.offsetLeft - pad, behavior: reduce ? "auto" : "smooth" });
    },
    [reduce, settle],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      threshold: 0.35,
    });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onEnd = () => {
      if (settling.current) settle();
    };
    track.addEventListener("scrollend", onEnd);
    return () => {
      track.removeEventListener("scrollend", onEnd);
      if (settling.current) window.clearTimeout(settling.current);
    };
  }, [settle]);

  const onScroll = () => {
    const track = trackRef.current;
    if (!track || settling.current) return;
    const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    let best = 0;
    let bestDistance = Infinity;
    Array.from(track.children).forEach((el, i) => {
      const distance = Math.abs((el as HTMLElement).offsetLeft - pad - track.scrollLeft);
      if (distance < bestDistance) {
        best = i;
        bestDistance = distance;
      }
    });
    setIndex(best);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { x: e.clientX, left: track.scrollLeft, start: index };
    track.classList.add("is-dragging");
    track.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !drag.current) return;
    track.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const step = dx < -40 ? 1 : dx > 40 ? -1 : 0;
    const target = Math.min(count - 1, Math.max(0, drag.current.start + step));
    drag.current = null;
    goTo(target);
  };

  return (
    <div
      ref={rootRef}
      className="events-gallery"
      role="group"
      aria-roledescription="carousel"
      aria-label={`${label} photos`}
    >
      <div
        ref={trackRef}
        className="events-gallery__track"
        tabIndex={0}
        aria-label={`${label} photos, use arrow keys to scroll`}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {slides.map((slide, i) => (
          <figure
            key={slide.src}
            className={`events-gallery__slide${i === index ? " is-active" : ""}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              quality={95}
              draggable={false}
              sizes="(max-width: 768px) 90vw, 1100px"
              className="object-cover"
              style={slide.position ? { objectPosition: slide.position } : undefined}
            />
            <span className="events-gallery__scrim" aria-hidden />
            <figcaption className="events-gallery__headline">{slide.headline}</figcaption>
          </figure>
        ))}
      </div>

      {count > 1 ? (
        <div className="events-gallery__controls">
          <div className="events-gallery__dots" role="group" aria-label="Choose a photo">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                className={`events-gallery__dot${i === index ? " is-active" : ""}`}
                aria-label={`Show photo ${i + 1} of ${count}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => goTo(i)}
              >
                {i === index ? (
                  <span
                    key={`${index}-${reduce && !playing ? "still" : "run"}`}
                    className={`events-gallery__fill${reduce && !playing ? " is-still" : ""}`}
                    style={{
                      animationDuration: `${SLIDE_MS}ms`,
                      animationPlayState: running ? "running" : "paused",
                    }}
                    onAnimationEnd={() => goTo((index + 1) % count)}
                  />
                ) : null}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="events-gallery__toggle"
            aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            onClick={() => setUserPlay(!playing)}
          >
            {playing ? (
              <Pause aria-hidden className="h-4 w-4" fill="currentColor" strokeWidth={0} />
            ) : (
              <Play aria-hidden className="h-4 w-4" fill="currentColor" strokeWidth={0} />
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}

type Props = {
  branches: ServiceBranch[];
};

export function EventCategories({ branches }: Props) {
  const reduce = useReducedMotion();
  const panelId = useId();
  const [activeId, setActiveId] = useState(EVENT_CATEGORIES[0]!.id);
  const active = EVENT_CATEGORIES.find((c) => c.id === activeId) ?? EVENT_CATEGORIES[0]!;
  const upcoming = active.status === "upcoming";

  return (
    <section className="events-cats" aria-label="Browse Kharis events">
      <CategoryRow activeId={active.id} panelId={panelId} onSelect={setActiveId} />

      <div
        id={panelId}
        className="events-show"
        role="tabpanel"
        aria-labelledby={`events-cat-${active.id}`}
      >
        <motion.div
          key={active.id}
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          <div className={`events-show__head${upcoming ? " is-upcoming" : ""}`}>
            <div className="events-show__intro">
              <p className={`events-show__eyebrow events-show__eyebrow--${active.status}`}>
                {upcoming ? "Upcoming" : "Past event"}
              </p>
              <h2 className="events-show__title">{active.label}</h2>
              <p className="events-show__summary">{active.summary}</p>
              {upcoming ? null : (
                <p className="events-show__soon">
                  Coming back soon. No dates yet.{" "}
                  <button
                    type="button"
                    className="events-show__switch"
                    onClick={() => setActiveId(EVENT_CATEGORIES[0]!.id)}
                  >
                    Join us this Sunday
                  </button>
                </p>
              )}
            </div>
            {upcoming ? <ServiceVisitPanel category={active} branches={branches} /> : null}
          </div>

          <Gallery key={active.id} slides={active.slides} label={active.label} />
        </motion.div>
      </div>
    </section>
  );
}
