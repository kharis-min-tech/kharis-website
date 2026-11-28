"use client";

import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ComicGallery } from "@/components/ComicGallery";
import { EVENT_CHAPTERS, type EventChapter } from "./data";
import {
  SCRUB_SPRING,
  announceEventPage,
  cdn,
  cdnSet,
  glidePageTo,
  pinScrollY,
  useCompact,
  useSectionSnap,
  type JourneyGoto,
} from "./motion";

/* ------------------------------------------------------------------------------------------ */
/* Pages                                                                                       */
/* ------------------------------------------------------------------------------------------ */

type PageCtx = {
  live: boolean;
  near: boolean;
  openGallery: (id: string) => void;
  goToEvent: (i: number) => void;
};
type PageDef = { key: string; label: string | null; render: (ctx: PageCtx) => ReactNode };

function Picture({
  photo,
  width,
  near,
  className,
}: {
  photo: EventChapter["splash"];
  width: number;
  near: boolean;
  className?: string;
}) {
  if (!near) return <span className={`lb-ph ${className ?? ""}`} aria-hidden="true" />;
  return (
    <img
      className={className}
      src={cdn(photo.src, width)}
      srcSet={cdnSet(photo.src, [Math.round(width / 2), width, Math.round(width * 1.6)])}
      sizes={`${Math.round(width / 2)}px`}
      alt={photo.alt}
      decoding="async"
      style={photo.position ? { objectPosition: photo.position } : undefined}
    />
  );
}

/** Plays its clip only while its spread is open. */
function PageVideo({ event, live }: { event: EventChapter; live: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (live) video.play().catch(() => {});
    else video.pause();
  }, [live]);
  if (!event.video) return null;
  return (
    <video
      ref={ref}
      className="lb-splash__video"
      src={live ? event.video.src : undefined}
      poster={cdn(event.video.poster, 900)}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    />
  );
}

function TitlePage({ goToEvent }: PageCtx) {
  return (
    <div className="lb-titlepage">
      <p className="lb-kicker">Chapter 2</p>
      <h2 className="lb-titlepage__title">
        The <span>Events</span>
      </h2>
      <p className="lb-titlepage__lede">
        Choose your adventure, or turn the page and read them all.
      </p>
      <ol className="lb-titlepage__list">
        {EVENT_CHAPTERS.map((event, i) => (
          <li key={event.id}>
            <button type="button" onClick={() => goToEvent(i)} data-accent={event.accent}>
              <span className="lb-titlepage__num">{String(i + 1).padStart(2, "0")}</span>
              <span>{event.title}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="lb-titlepage__hint">
        <span className="material-symbols-outlined" aria-hidden="true">
          swipe_left
        </span>
        <span className="lb-only-compact">Swipe to turn the page</span>
        <span className="lb-only-wide">Scroll, click the corner or use ← → to turn</span>
      </p>
    </div>
  );
}

function SplashPage({
  event,
  index,
  live,
  near,
}: { event: EventChapter; index: number } & PageCtx) {
  return (
    <div className="lb-splash" data-accent={event.accent}>
      <div className="lb-splash__media">
        <Picture photo={event.splash} width={900} near={near} className="lb-splash__img" />
        {near ? <PageVideo event={event} live={live} /> : null}
        <span className="lb-splash__dots" aria-hidden="true" />
      </div>
      <p className="lb-caption lb-splash__chapter">Chapter {index + 1}</p>
      <span className="lb-sfx lb-splash__sfx" aria-hidden="true">
        {event.sfx}
      </span>
      <h3 className="lb-splash__title">{event.title}</h3>
      {event.placeholder ? (
        <span className="lb-splash__placeholder">Photos coming soon</span>
      ) : null}
    </div>
  );
}

function StoryPage({ event, near, openGallery }: { event: EventChapter } & PageCtx) {
  return (
    <div className="lb-story" data-accent={event.accent}>
      <p className="lb-story__tagline">{event.tagline}</p>
      <p className="lb-story__copy">{event.story}</p>
      <div className="lb-story__panels">
        {event.panels.map((photo, i) => (
          <div key={photo.src} className={`lb-story__panel lb-story__panel--${i}`}>
            <Picture photo={photo} width={520} near={near} />
          </div>
        ))}
        <p className="lb-bubble lb-story__bubble">{event.bubble}</p>
      </div>
      <dl className="lb-story__facts">
        {event.facts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
      <button
        type="button"
        className="lb-button lb-story__gallery"
        onClick={() => openGallery(event.id)}
      >
        See the photos
        <span className="sr-only"> from {event.title}</span>
        <span className="material-symbols-outlined" aria-hidden="true">
          photo_library
        </span>
      </button>
    </div>
  );
}

function EndPage() {
  return (
    <div className="lb-endpage">
      <span className="lb-sfx lb-endpage__sfx" aria-hidden="true">
        To be continued…
      </span>
      <p className="lb-endpage__copy">
        There’s more where that came from. Keep scrolling for more adventures.
      </p>
      <span className="material-symbols-outlined lb-endpage__arrow" aria-hidden="true">
        south
      </span>
    </div>
  );
}

function buildPages(): PageDef[] {
  const pages: PageDef[] = [
    { key: "title", label: "The Events", render: (ctx) => <TitlePage {...ctx} /> },
  ];
  EVENT_CHAPTERS.forEach((event, index) => {
    pages.push({
      key: `${event.id}-splash`,
      label: event.short,
      render: (ctx) => <SplashPage event={event} index={index} {...ctx} />,
    });
    pages.push({
      key: `${event.id}-story`,
      label: event.short,
      render: (ctx) => <StoryPage event={event} {...ctx} />,
    });
  });
  pages.push({ key: "end", label: "To be continued", render: () => <EndPage /> });
  return pages;
}

/* ------------------------------------------------------------------------------------------ */
/* Leaves                                                                                      */
/* ------------------------------------------------------------------------------------------ */

/**
 * One sheet of the book, hinged on its left edge. Flat leaves stack by z-index (the next unread
 * leaf on top of the right pile, the last read on top of the left pile); the leaf mid-turn always
 * rides above both. Each leaf carries its own perspective, so there is no shared 3D context to
 * depth-sort and nothing z-fights.
 */
function Leaf({
  index,
  count,
  turn,
  front,
  back,
  frontNo,
  backNo,
}: {
  index: number;
  count: number;
  turn: MotionValue<number>;
  front: ReactNode;
  back: ReactNode;
  frontNo?: number;
  backNo?: number;
}) {
  const t = useTransform(turn, (v) => Math.min(1, Math.max(0, v - index)));
  const rotateY = useTransform(t, [0, 1], [0, -180]);
  const zIndex = useTransform(t, (v) => (v > 0 && v < 1 ? 200 : v >= 1 ? 10 + index : 100 - index));
  // Light falls off the page as it lifts, and the curl throws a soft highlight across it.
  const frontShade = useTransform(t, [0, 0.5, 1], [0, 0.5, 0.5]);
  const backShade = useTransform(t, [0, 0.5, 1], [0.5, 0.5, 0]);
  const curl = useTransform(t, (v) => `${(1 - v) * 100}%`);
  const curlOpacity = useTransform(t, (v) => Math.sin(v * Math.PI) * 0.9);
  const hidden = useTransform(t, (v) => (v >= 1 ? "hidden" : "visible"));
  const backHidden = useTransform(t, (v) => (v <= 0 ? "hidden" : "visible"));

  return (
    <motion.div
      className="lb-leaf"
      style={{ transformPerspective: 2400, rotateY, zIndex }}
      data-leaf={index}
      data-count={count}
    >
      <motion.div className="lb-leaf__face lb-leaf__front lb-paper" style={{ visibility: hidden }}>
        {front}
        {frontNo !== undefined ? <span className="lb-folio lb-folio--right">{frontNo}</span> : null}
        <motion.span className="lb-leaf__shade" style={{ opacity: frontShade }} />
        <motion.span className="lb-leaf__curl" style={{ left: curl, opacity: curlOpacity }} />
      </motion.div>
      <motion.div
        className="lb-leaf__face lb-leaf__back lb-paper"
        style={{ visibility: backHidden }}
      >
        {back}
        {backNo !== undefined ? <span className="lb-folio lb-folio--left">{backNo}</span> : null}
        <motion.span
          className="lb-leaf__shade lb-leaf__shade--back"
          style={{ opacity: backShade }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* The book                                                                                    */
/* ------------------------------------------------------------------------------------------ */

/** Each page turn gets this much scroll on wide screens. */
const TURN_SCREENS = 0.75;

/**
 * The Events, as a book you read. Wide screens show a two-page spread pinned to the screen;
 * scrolling turns the pages (with a snap so a page never rests half turned), and the corners,
 * the chapter tabs and the arrow keys glide to a page. Phones read one portrait page at a time
 * and swipe to turn, like a lookbook. Reduced motion shows the same spreads without turning.
 */
export function EventBook() {
  const sectionRef = useRef<HTMLElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const compact = useCompact();
  const reduce = useReducedMotion() ?? false;
  const pages = useMemo(buildPages, []);

  // Wide: leaf j carries pages 2j (front, right-hand) and 2j+1 (back, left-hand).
  // Compact: every page is its own leaf with a plain paper back.
  const leaves = compact ? pages.length : Math.ceil(pages.length / 2);
  const states = compact ? pages.length - 1 : leaves; // number of turns available

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 74px", "end end"] });
  const smooth = useSpring(scrollYProgress, SCRUB_SPRING);
  const scrollTurn = useTransform(reduce ? scrollYProgress : smooth, (v) => v * states);
  const swipeTurn = useMotionValue(0);
  const turn = compact ? swipeTurn : scrollTurn;

  const [current, setCurrent] = useState(0);
  const [reach, setReach] = useState(2);
  useMotionValueEvent(turn, "change", (v) => {
    const s = Math.round(v);
    setCurrent(s);
    setReach((r) => Math.max(r, s + 2));
  });
  useEffect(() => {
    setCurrent(Math.round(turn.get()));
  }, [turn]);

  useSectionSnap(
    sectionRef,
    Array.from({ length: states + 1 }, (_, i) => i / states),
    !compact && !reduce,
  );

  // The pages visible at a resting state.
  const visible = (state: number) => (compact ? [state] : [state * 2 - 1, state * 2]);
  const liveSet = new Set(visible(current));
  const label =
    pages[Math.max(0, Math.max(...visible(current).filter((p) => p >= 0 && p < pages.length)))]
      ?.label ?? null;

  // Tell the page counter which chapter is open, while the book is on screen.
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(Boolean(entry?.isIntersecting)),
      { threshold: 0.4 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (onScreen) announceEventPage(label);
  }, [onScreen, label]);

  const goToState = useCallback(
    (state: number) => {
      const target = Math.max(0, Math.min(states, state));
      const section = sectionRef.current;
      if (!section) return;
      if (compact) {
        animate(swipeTurn, target, {
          type: "spring",
          stiffness: 70,
          damping: 16,
          restDelta: 0.001,
        });
        // Bring the book fully into view if it isn't.
        const rect = section.getBoundingClientRect();
        if (rect.top < 0 || rect.bottom > window.innerHeight)
          glidePageTo(rect.top + window.scrollY - 74);
      } else {
        glidePageTo(
          pinScrollY(section, target / states),
          640 + 120 * Math.min(4, Math.abs(target - turn.get())),
        );
      }
    },
    [compact, states, swipeTurn, turn],
  );
  const goToEvent = useCallback(
    // Event i's splash is page 2i+1: spread i+1 on wide screens, page 2i+1 on phones.
    (i: number) => goToState(compact ? 2 * i + 1 : i + 1),
    [compact, goToState],
  );

  // The contents and the page counter can send the reader straight to an event.
  useEffect(() => {
    const onGoto = (event: Event) => {
      const detail = (event as CustomEvent<JourneyGoto>).detail;
      if (detail.chapter !== "lb-events") return;
      const index = EVENT_CHAPTERS.findIndex((e) => e.id === detail.event);
      const section = sectionRef.current;
      if (!section) return;
      if (index < 0) {
        if (compact) swipeTurn.set(0);
        glidePageTo(pinScrollY(section, 0), 900);
        return;
      }
      if (compact) {
        glidePageTo(section.getBoundingClientRect().top + window.scrollY - 74, 900);
        animate(swipeTurn, 2 * index + 1, { type: "spring", stiffness: 70, damping: 16 });
      } else {
        glidePageTo(pinScrollY(section, (index + 1) / states), 1000);
      }
    };
    window.addEventListener("lifebook:goto", onGoto);
    return () => window.removeEventListener("lifebook:goto", onGoto);
  }, [compact, states, swipeTurn]);

  // Arrow keys turn the page while the book fills the screen.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [role=dialog]")) return;
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect || rect.top > window.innerHeight * 0.3 || rect.bottom < window.innerHeight * 0.7)
        return;
      event.preventDefault();
      goToState(Math.round(turn.get()) + (event.key === "ArrowRight" ? 1 : -1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToState, turn]);

  // Phones: drag the page like paper. Horizontal drags turn; vertical ones scroll the page.
  const drag = useRef<{
    x: number;
    y: number;
    from: number;
    t: number;
    axis: "x" | "y" | null;
    id: number;
  } | null>(null);
  const onPointerDown = (event: React.PointerEvent) => {
    if (!compact || reduce) return;
    if ((event.target as HTMLElement).closest("button, a, video")) return;
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      from: swipeTurn.get(),
      t: performance.now(),
      axis: null,
      id: event.pointerId,
    };
  };
  const onPointerMove = (event: React.PointerEvent) => {
    const d = drag.current;
    const book = bookRef.current;
    if (!d || !book || d.id !== event.pointerId) return;
    const dx = event.clientX - d.x;
    const dy = event.clientY - d.y;
    if (!d.axis && Math.hypot(dx, dy) > 8) {
      d.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (d.axis === "x") {
        try {
          (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
        } catch {
          /* the pointer is already gone; the drag still follows move events */
        }
      }
    }
    if (d.axis !== "x") return;
    const w = book.offsetWidth;
    const next = d.from - dx / (w * 0.9);
    // A little resistance past the first and last page.
    const max = states;
    const soft = next < 0 ? next * 0.25 : next > max ? max + (next - max) * 0.25 : next;
    swipeTurn.set(soft);
  };
  const onPointerUp = (event: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    const book = bookRef.current;
    if (!d || !book) return;
    if (d.axis !== "x") {
      // A tap: right side goes forward, left side goes back.
      if (d.axis === null) {
        const rect = book.getBoundingClientRect();
        const at = (event.clientX - rect.left) / rect.width;
        if (at > 0.72) goToState(Math.round(swipeTurn.get()) + 1);
        else if (at < 0.28) goToState(Math.round(swipeTurn.get()) - 1);
      }
      return;
    }
    const dt = Math.max(16, performance.now() - d.t);
    const velocity = -(event.clientX - d.x) / dt; // px per ms, positive = forward
    const now = swipeTurn.get();
    let target = Math.round(now);
    if (Math.abs(velocity) > 0.35) target = velocity > 0 ? Math.floor(now) + 1 : Math.ceil(now) - 1;
    else if (now - d.from > 0.2) target = Math.ceil(now);
    else if (d.from - now > 0.2) target = Math.floor(now);
    target = Math.max(0, Math.min(states, target));
    animate(swipeTurn, target, {
      type: "spring",
      stiffness: 70,
      damping: 16,
      velocity: velocity * 2,
      restDelta: 0.001,
    });
  };

  const [galleryId, setGalleryId] = useState<string | null>(null);
  const closeGallery = useCallback(() => setGalleryId(null), []);
  const galleryEvent = EVENT_CHAPTERS.find((e) => e.id === galleryId);

  const ctxFor = (pageIndex: number): PageCtx => ({
    live: liveSet.has(pageIndex),
    near: pageIndex <= (compact ? reach + 1 : reach * 2 + 2),
    openGallery: setGalleryId,
    goToEvent,
  });

  const renderPage = (pageIndex: number) => {
    const page = pages[pageIndex];
    if (!page) return <div className="lb-blank" />;
    return page.render(ctxFor(pageIndex));
  };

  const leafNodes = Array.from({ length: leaves }, (_, j) => {
    const frontIndex = compact ? j : j * 2;
    const backIndex = compact ? -1 : j * 2 + 1;
    return (
      <Leaf
        key={`${compact ? "c" : "w"}-${j}`}
        index={j}
        count={leaves}
        turn={turn}
        front={renderPage(frontIndex)}
        back={
          backIndex >= 0 && backIndex < pages.length ? (
            renderPage(backIndex)
          ) : (
            <div className="lb-blank lb-blank--endpaper" />
          )
        }
        frontNo={frontIndex + 4}
        backNo={backIndex >= 0 && backIndex < pages.length ? backIndex + 4 : undefined}
      />
    );
  });

  const atStart = current <= 0;
  const atEnd = current >= states;
  const shownPages = visible(current).filter((p) => p >= 0 && p < pages.length);

  return (
    <section
      data-reveal="self"
      ref={sectionRef}
      id="lb-events"
      className="lb-events"
      data-mode={reduce ? "still" : compact ? "swipe" : "scroll"}
      data-chapter="The Events"
      style={
        !compact && !reduce
          ? { height: `calc((100svh - 74px) + ${states} * ${TURN_SCREENS * 100}svh)` }
          : undefined
      }
      aria-labelledby="lb-events-title"
      aria-roledescription="book"
    >
      <h2 id="lb-events-title" className="sr-only">
        The Events
      </h2>

      {reduce ? (
        <div className="lb-events__still">
          {Array.from({ length: Math.ceil(pages.length / 2) + 1 }, (_, s) => {
            const pair = compact ? [s] : [s * 2 - 1, s * 2];
            return (
              <div key={s} className="lb-events__spread">
                {pair
                  .filter((p) => p >= 0 && p < pages.length)
                  .map((p) => (
                    <div key={p} className="lb-events__page lb-paper">
                      {pages[p]!.render({ ...ctxFor(p), near: true, live: false })}
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="lb-events__pin">
          <nav className="lb-tabs" aria-label="Event chapters">
            {EVENT_CHAPTERS.map((event, i) => {
              const active = compact
                ? current === 2 * i + 1 || current === 2 * i + 2
                : current === i + 1;
              return (
                <button
                  key={event.id}
                  type="button"
                  className="lb-tabs__tab"
                  data-accent={event.accent}
                  aria-current={active || undefined}
                  onClick={() => goToEvent(i)}
                >
                  {event.short}
                </button>
              );
            })}
          </nav>

          <div
            ref={bookRef}
            className="lb-book"
            data-at-start={atStart || undefined}
            data-at-end={atEnd || undefined}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (drag.current = null)}
          >
            <div className="lb-book__board lb-book__board--left" aria-hidden="true">
              <span className="lb-book__plate">
                <small>This book belongs to</small>
                <strong>You</strong>
                <small>KP2 Comics · Vol. 2</small>
              </span>
            </div>
            <div className="lb-book__board lb-book__board--right" aria-hidden="true">
              <span>KP2</span>
            </div>
            <div className="lb-book__leaves">{leafNodes}</div>
            <span className="lb-book__gutter" aria-hidden="true" />
            {!compact ? (
              <>
                <button
                  type="button"
                  className="lb-corner lb-corner--next"
                  onClick={() => goToState(current + 1)}
                  disabled={atEnd}
                  aria-label="Next page"
                />
                <button
                  type="button"
                  className="lb-corner lb-corner--prev"
                  onClick={() => goToState(current - 1)}
                  disabled={atStart}
                  aria-label="Previous page"
                />
              </>
            ) : null}
          </div>

          <div className="lb-book__controls">
            <button
              type="button"
              className="lb-button lb-button--square"
              onClick={() => goToState(current - 1)}
              disabled={atStart}
              aria-label="Previous page"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_back
              </span>
            </button>
            <p className="lb-book__counter" aria-live="polite">
              <span className="sr-only">Showing </span>
              {shownPages.length ? `Pg ${shownPages.map((p) => p + 4).join("–")}` : "Cover"}
              <span className="lb-book__counter-label"> · {label ?? "The Events"}</span>
            </p>
            <button
              type="button"
              className="lb-button lb-button--square"
              onClick={() => goToState(current + 1)}
              disabled={atEnd}
              aria-label="Next page"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      )}

      {galleryEvent ? (
        <ComicGallery
          title={galleryEvent.title}
          photos={galleryEvent.gallery}
          onClose={closeGallery}
        />
      ) : null}
    </section>
  );
}
