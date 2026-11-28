"use client";

import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ComicGallery } from "@/components/ComicGallery";
import { COVER_ART, EVENT_CHAPTERS, type EventChapter } from "./data";
import {
  announceEventPage,
  cdn,
  cdnSet,
  glidePageTo,
  useCompact,
  useStageReady,
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
  openBook: () => void;
  ready: boolean;
};
type PageDef = { key: string; label: string | null; render: (ctx: PageCtx) => ReactNode };

function goToSection(id: string) {
  const section = document.getElementById(id);
  if (section) glidePageTo(section.getBoundingClientRect().top + window.scrollY - 74, 650);
}

function CoverPage({ openBook, ready }: PageCtx) {
  return (
    <div className="lb-cover__front lb-unified-cover">
      <div className="lb-cover__art">
        <img src={cdn(COVER_ART.src, 900)} alt="" style={{ objectPosition: COVER_ART.position }} />
      </div>
      <div className="lb-cover__masthead">
        <span className="lb-cover__issue">KP2 Comic</span>
      </div>
      <div className="lb-cloth lb-cover__cloth lb-cover__title" role="img" aria-label="Kharis Life">
        <span className="lb-cloth__rod" aria-hidden="true" />
        <div className="lb-cloth__flat" aria-hidden="true">
          <span>Kharis</span>
          <span>Life</span>
        </div>
      </div>
      <span className="lb-burst lb-cover__burst" aria-hidden="true">
        <span>Beyond Sundays!</span>
      </span>
      <p className="lb-cover__strap">Grow · Serve · Belong</p>
      <button
        type="button"
        className="lb-cover__open"
        onClick={openBook}
        disabled={!ready}
        aria-label="Open Kharis Life comic"
      />
    </div>
  );
}

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
      <p className="lb-kicker">Inside the book</p>
      <h2 className="lb-titlepage__title">Contents</h2>
      <p className="lb-titlepage__lede">
        Choose your adventure, or turn the page and read them all.
      </p>
      <ol className="lb-titlepage__list">
        {EVENT_CHAPTERS.map((chapter, i) => (
          <li key={chapter.id}>
            <button type="button" onClick={() => goToEvent(i)}>
              <span className="lb-titlepage__num">{String(i + 1).padStart(2, "0")}</span>
              <span>{chapter.title}</span>
            </button>
          </li>
        ))}
        {[
          { id: "lb-more", title: "More adventures" },
          { id: "lb-you", title: "Your chapter" },
        ].map((chapter, i) => (
          <li key={chapter.id}>
            <button type="button" onClick={() => goToSection(chapter.id)}>
              <span className="lb-titlepage__num">
                {String(EVENT_CHAPTERS.length + i + 1).padStart(2, "0")}
              </span>
              <span>{chapter.title}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="lb-titlepage__hint">
        <span className="material-symbols-outlined" aria-hidden="true">
          swipe_left
        </span>
        <span className="lb-only-compact">Tap a page or use the arrows to turn</span>
        <span className="lb-only-wide">Click a page or use the arrows to turn</span>
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
    { key: "cover", label: "Cover", render: (ctx) => <CoverPage {...ctx} /> },
    { key: "title", label: "Contents", render: (ctx) => <TitlePage {...ctx} /> },
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

/**
 * The Events, as a book you read. Page clicks, buttons and arrow keys turn the pages.
 * Reduced motion shows the same spreads without turning.
 */
export function EventBook() {
  const sectionRef = useRef<HTMLElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const compact = useCompact();
  const reduce = useReducedMotion() ?? false;
  const ready = useStageReady();
  const pages = useMemo(buildPages, []);

  // Wide: leaf j carries pages 2j (front, right-hand) and 2j+1 (back, left-hand).
  // Compact: every page is its own leaf with a plain paper back.
  const leaves = compact ? pages.length : Math.ceil(pages.length / 2);
  const states = compact ? pages.length - 1 : leaves; // number of turns available

  const turn = useMotionValue(0);

  const [current, setCurrent] = useState(0);
  useMotionValueEvent(turn, "change", (v) => {
    const s = Math.round(v);
    setCurrent(s);
  });
  useEffect(() => {
    setCurrent(Math.round(turn.get()));
  }, [turn]);

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
      if (reduce) {
        const page = section.querySelector<HTMLElement>(
          `[data-page-index="${compact ? target : target * 2 - 1}"]`,
        );
        page?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      animate(turn, target, { type: "spring", stiffness: 140, damping: 20, restDelta: 0.001 });
      const rect = bookRef.current?.getBoundingClientRect();
      if (rect && (rect.bottom < 74 || rect.top > window.innerHeight))
        glidePageTo(rect.top + window.scrollY - 74);
    },
    [compact, reduce, states, turn],
  );
  const goToEvent = useCallback(
    (i: number) => {
      if (reduce) {
        sectionRef.current
          ?.querySelector<HTMLElement>(`[data-page-index="${2 * i + 2}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      goToState(compact ? 2 * i + 2 : i + 1);
    },
    [compact, goToState, reduce],
  );

  // The contents and the page counter can send the reader straight to an event.
  useEffect(() => {
    const onGoto = (event: Event) => {
      const detail = (event as CustomEvent<JourneyGoto>).detail;
      if (detail.chapter !== "lb-events") return;
      const index = EVENT_CHAPTERS.findIndex((e) => e.id === detail.event);
      if (index < 0) goToState(1);
      else goToEvent(index);
    };
    window.addEventListener("lifebook:goto", onGoto);
    return () => window.removeEventListener("lifebook:goto", onGoto);
  }, [goToEvent, goToState]);

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

  const [galleryId, setGalleryId] = useState<string | null>(null);
  const closeGallery = useCallback(() => setGalleryId(null), []);
  const galleryEvent = EVENT_CHAPTERS.find((e) => e.id === galleryId);

  const ctxFor = (pageIndex: number): PageCtx => ({
    live: liveSet.has(pageIndex),
    near: Math.abs(pageIndex - (compact ? current : current * 2)) <= 3,
    openGallery: setGalleryId,
    goToEvent,
    openBook: () => goToState(1),
    ready,
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
        frontNo={frontIndex > 0 ? frontIndex : undefined}
        backNo={backIndex > 0 && backIndex < pages.length ? backIndex : undefined}
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
      aria-labelledby="lb-events-title"
      aria-roledescription="book"
    >
      <h2 id="lb-events-title" className="sr-only">
        The Events
      </h2>

      {reduce ? (
        <div className="lb-events__still">
          <button
            type="button"
            className="lb-button lb-events__skip"
            onClick={() => goToSection("lb-more")}
          >
            Go to More Adventures ↓
          </button>
          {Array.from(
            { length: compact ? pages.length : Math.ceil(pages.length / 2) + 1 },
            (_, s) => {
              const pair = compact ? [s] : [s * 2 - 1, s * 2];
              return (
                <div key={s} className="lb-events__spread">
                  {pair
                    .filter((p) => p >= 0 && p < pages.length)
                    .map((p) => (
                      <div key={p} className="lb-events__page lb-paper" data-page-index={p}>
                        {pages[p]!.render({ ...ctxFor(p), near: true, live: false })}
                      </div>
                    ))}
                </div>
              );
            },
          )}
        </div>
      ) : (
        <div className="lb-events__pin">
          <nav className="lb-tabs" aria-label="Event chapters">
            <button
              type="button"
              className="lb-tabs__tab lb-tabs__skip"
              onClick={() => goToSection("lb-more")}
            >
              More Adventures ↓
            </button>
            {EVENT_CHAPTERS.map((chapter, i) => {
              const eventIndex = compact ? Math.floor((current - 2) / 2) : current - 1;
              const active = eventIndex === i;
              return (
                <button
                  key={chapter.id}
                  type="button"
                  className="lb-tabs__tab"
                  aria-current={active || undefined}
                  onClick={() => goToEvent(i)}
                >
                  {String(i + 1).padStart(2, "0")} · {chapter.title}
                </button>
              );
            })}
          </nav>

          <div
            ref={bookRef}
            className="lb-book"
            data-at-start={atStart || undefined}
            data-at-end={atEnd || undefined}
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("button, a, video")) return;
              if (window.getSelection()?.toString()) return;
              const rect = event.currentTarget.getBoundingClientRect();
              const forward = event.clientX >= rect.left + rect.width * (compact ? 0.35 : 0.5);
              goToState(current + (forward ? 1 : -1));
            }}
          >
            <div className="lb-book__board lb-book__board--left" aria-hidden="true">
              <span className="lb-book__plate">
                <small>This book belongs to</small>
                <strong>You</strong>
                <small>KP2 Comic</small>
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
              {shownPages[0] === 0 ? "Cover" : `Pg ${shownPages.join("–")}`}
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
