/**
 * "Step into life at Kharis" - the opening act of /life.
 *
 * You fly down a tunnel whose walls are the things this church actually
 * does. Hold anywhere to speed up, let go to drift, click a wall to stop on
 * one and read about it.
 *
 * The tunnel is one way in, not the only way. Everything in it is also a
 * real, focusable button in the list underneath, so the page works on a
 * keyboard, works with a screen reader, and works for someone who has asked
 * their system for less motion - who gets the list and no tunnel at all.
 * None of that is a fallback bolted on afterwards: the list is the content,
 * and the tunnel is a way of showing it.
 */
"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CHURCH_VALUES } from "@/lib/church-values";
import { cdnImage, cdnSrcSet } from "@/lib/image-cdn";
import { activeLifeActivities, type LifeActivity } from "@/lib/life-activities";
import { getSiteTheme, subscribeSiteTheme } from "@/lib/theme";
import { useDialog } from "@/lib/use-dialog";
import { useMediaQuery } from "@/lib/use-media-query";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import "./life-tunnel.css";

/**
 * Widths offered for the focused picture in an activity sheet. It occupies
 * roughly 45vw of the sheet beside the write-up, full width once the sheet
 * stacks, so these cover a phone through to a large desktop at 2x.
 */
const SHOT_WIDTHS = [640, 960, 1400, 1920] as const;

/**
 * The widest a tunnel wall is ever drawn. Tiles sit a long way down a
 * perspective tunnel and are a few hundred pixels at most, so this is
 * generous; the point is only that eighteen of them stop being
 * full-resolution decodes. At 2000x1333 each one was 10.2MB of bitmap.
 */
const WALL_WIDTH = 900;

const programme = [
  {
    title: CHURCH_VALUES.christCentered,
    preview:
      "We follow Christ through the scriptures. We read it through, we live it out, and we pass it on",
    activities: ["let-the-bible-speak-conference", "baptism", "k-group"],
  },
  {
    title: CHURCH_VALUES.revivalSeeking,
    preview:
      "Seeking the face of God and the power of the Holy Spirit to transform this generation",
    activities: ["fasting", "jesus-campaign"],
  },
  {
    title: CHURCH_VALUES.peopleDeveloping,
    preview: "Developing and equipping people to serve in the church and lead in the world",
    activities: [
      "careers-fair",
      "ai-in-the-workplace",
      "departments",
      "seminars",
      "innovation-project",
    ],
  },
  {
    title: CHURCH_VALUES.purposeDriven,
    preview:
      "Enabling people to live holistically purposeful lives whilst having fun along the way",
    activities: [
      "cook-along",
      "christmas-jumper",
      "sports-day",
      "football-tournament",
      "family-fun-day",
      "singles-seminar",
    ],
  },
] satisfies {
  title: string;
  preview: string;
  activities: LifeActivity["slug"][];
}[];

const programmeSlugs = new Set<LifeActivity["slug"]>(
  programme.flatMap((chapter) => chapter.activities),
);

/**
 * Client-only: it measures itself, drives a requestAnimationFrame loop and
 * draws with CSS 3D, so there is nothing useful to server-render. The
 * activities list below it is server-rendered and is what a crawler sees.
 */
const ImageTunnel = dynamic(() => import("@/vendor/image-tunnel/InfiniteImageTunnel.js"), {
  ssr: false,
  loading: () => <div className="life-tunnel__placeholder" aria-hidden />,
});

/**
 * The activity's pictures, as one carousel rather than a poster plus a
 * separate static grid. Whatever is focused plays large up top; clicking any
 * thumbnail below brings it to focus, and the focused picture itself can be
 * swiped - or stepped with the arrow buttons or the keyboard - left and
 * right. The main image is just slide zero, not a different kind of thing.
 */
function ActivityCarousel({ activity }: { activity: LifeActivity }) {
  const slides = [{ src: activity.image, alt: activity.alt }, ...(activity.gallery ?? [])];
  const [index, setIndex] = useState(0);
  const dragStart = useRef<number | null>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (slides.length < 2) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, slides.length]);

  /* The rail scrolls one card at a time regardless of gallery size, so
     whichever thumbnail is now focused has to bring itself into view - it
     will usually be off to the side, not visible by default. */
  useEffect(() => {
    const thumb = railRef.current?.children[index];
    thumb?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  const current = slides[index];

  return (
    <div className="life-panel__visual">
      <figure
        className="life-panel__media"
        onPointerDown={(event) => {
          dragStart.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (dragStart.current === null) return;
          const dx = event.clientX - dragStart.current;
          dragStart.current = null;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
      >
        {/* These galleries mix portrait and landscape in one rail, so filling
            a fixed landscape frame meant cropping - and on a portrait shot
            what a centred crop takes is the heads. The picture is shown
            whole instead, over a blurred copy of itself that fills whatever
            the picture leaves, so the frame stays the same size either way. */}
        {/* The wash is blurred past recognition and scaled up, so it has no use
            for detail: 48px of picture is indistinguishable from 2000px once
            `filter: blur(1.75rem)` has had it, and costs about 1KB. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="life-panel__wash"
          src={cdnImage(current.src, { width: 48, quality: 60 })}
          alt=""
          aria-hidden
          draggable={false}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="life-panel__shot"
          src={cdnImage(current.src, { width: 1400 })}
          srcSet={cdnSrcSet(current.src, SHOT_WIDTHS)}
          sizes="(max-width: 860px) 100vw, 45vw"
          alt={current.alt}
          draggable={false}
        />
        {slides.length > 1 ? (
          <>
            <button
              type="button"
              className="life-panel__nav life-panel__nav--prev"
              aria-label="Previous picture"
              onClick={() => go(-1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="life-panel__nav life-panel__nav--next"
              aria-label="Next picture"
              onClick={() => go(1)}
            >
              ›
            </button>
            <span className="life-panel__count" aria-hidden>
              {index + 1} / {slides.length}
            </span>
          </>
        ) : null}
      </figure>

      {slides.length > 1 ? (
        <div className="life-panel__gallery-viewport">
          <div className="life-panel__gallery" role="list" ref={railRef}>
            {slides.map((shot, i) => (
              <button
                key={shot.src}
                type="button"
                role="listitem"
                className={`life-panel__thumb${i === index ? " is-active" : ""}`}
                aria-current={i === index}
                aria-label={`Show picture ${i + 1} of ${slides.length}: ${shot.alt}`}
                onClick={() => setIndex(i)}
              >
                {/* A 76px square, so 160px covers a 2x screen. This was the
                    single worst thing on the page: seventeen full-resolution
                    uploads, decoded in full, to fill seventeen thumbnails.
                    `lazy` keeps the ones off the end of the rail from being
                    fetched until the rail is scrolled to them. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cdnImage(shot.src, { width: 160, height: 160, fit: "cover" })}
                  alt=""
                  width={76}
                  height={76}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ActivityPanel({ activity, onClose }: { activity: LifeActivity; onClose: () => void }) {
  const panelRef = useDialog(true, onClose);

  return (
    <div className="life-panel" role="dialog" aria-modal="true" aria-labelledby="life-panel-title">
      <button
        type="button"
        className="life-panel__scrim"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
      />
      <div ref={panelRef} className="life-panel__sheet" tabIndex={-1}>
        <button type="button" className="life-panel__close" onClick={onClose}>
          Close
        </button>

        <ActivityCarousel activity={activity} />

        <div className="life-panel__body">
          <h3 id="life-panel-title" className="life-panel__title">
            {activity.title}
          </h3>
          <p className="life-panel__blurb">{activity.blurb}</p>

          <p className="life-panel__copy">{activity.body}</p>
        </div>
      </div>
    </div>
  );
}

export function LifeTunnel() {
  const activities = activeLifeActivities();
  const theme = useSyncExternalStore(subscribeSiteTheme, getSiteTheme, () => "light" as const);
  const reduced = usePrefersReducedMotion();
  /* Not a width: the question is whether there is a pointer that can hover,
   * because that is what aiming at a wall depends on. A mouse gets the
   * outline under it and the precision to use it; a finger gets neither, and
   * is what the readout is for. Every desktop therefore behaves exactly as it
   * did before this existed. */
  const touch = useMediaQuery("(hover: none)");
  const shellRef = useRef<HTMLElement>(null);
  const listTitle = useRef<HTMLHeadingElement>(null);
  const runningBrowse = useRef<HTMLButtonElement>(null);
  const [backdrop, setBackdrop] = useState<string | undefined>();
  const [open, setOpen] = useState<LifeActivity | null>(null);
  const [started, setStarted] = useState(false);
  /** Once someone has actually pointed at or opened a wall, the centre cue has done its job. */
  const [engaged, setEngaged] = useState(false);
  /** The wall the camera is about to pass, named for the touch readout. */
  const [passing, setPassing] = useState<LifeActivity | null>(null);
  /* The pointer is very often already resting over a wall the instant "Step
     inside" is clicked (the button sits where the tunnel is about to be), so
     the tunnel's own hover callback can fire immediately and dismiss the cue
     before it has even faded in. A genuine click still counts straight away;
     a bare hover only counts once it has had a moment to be a real, moved-to
     hover rather than a leftover one from the click itself. */
  const startedAt = useRef(0);

  useEffect(() => {
    if (started) {
      startedAt.current = Date.now();
      runningBrowse.current?.focus({ preventScroll: true });
    }
  }, [started]);

  /* The tunnel needs a real colour, not a custom property, so the page's own
   * surface token is read back off the section after the theme has applied.
   * That keeps the colour in the stylesheet with the rest of the theme. */
  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    const value = getComputedStyle(el).getPropertyValue("--life-tunnel-paper").trim();
    setBackdrop(value || undefined);
  }, [theme]);

  /* `src` is capped rather than passed straight through. The tunnel holds
     every wall in the DOM at once, and the uploads behind them run to
     2000x1333 - around 10MB of decoded bitmap each, which on a phone added up
     to more memory than the tab was allowed. `activity` still carries the
     untouched URLs, so the sheet that opens from a wall asks for its own
     sizes rather than inheriting this one. */
  const items = activities.map((a) => ({
    id: a.slug,
    title: a.title,
    src: cdnImage(a.image, { width: WALL_WIDTH }),
    alt: a.alt,
    video: a.video,
    activity: a,
  }));

  const onSelectItem = useCallback((item: { activity?: LifeActivity }) => {
    if (item?.activity) {
      setOpen(item.activity);
      setEngaged(true);
    }
  }, []);

  /* A hover is what retires the centre cue once someone has actually pointed
   * at a wall, rather than just arrived. */
  const onHoverItem = useCallback((item: { activity?: LifeActivity } | null) => {
    if (item?.activity && Date.now() - startedAt.current > 500) setEngaged(true);
  }, []);

  /* The tunnel names the wall nearest the camera whenever it changes - about
     once a second at cruising speed, so this is a render per wall rather than
     a render per frame. Wired up for touch only: on a mouse it would be state
     nobody reads. */
  const onNearestItem = useCallback((item: { activity?: LifeActivity } | null) => {
    setPassing(item?.activity ?? null);
  }, []);

  const programmeActivities = activities;
  const activitiesBySlug = new Map(
    programmeActivities.map((activity) => [activity.slug, activity]),
  );
  const ungroupedSlugs = programmeActivities
    .filter((activity) => !programmeSlugs.has(activity.slug))
    .map((activity) => activity.slug);

  const openActivity = (button: HTMLButtonElement, activity: LifeActivity) => {
    button.focus({ preventScroll: true });
    setOpen(activity);
  };

  const browseActivities = () => {
    const heading = listTitle.current;
    if (!heading) return;
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ block: "start" });
  };

  return (
    /* Labelled directly rather than by id: the heading lives inside the
       stage, and the stage is not rendered at all under reduced motion. */
    <section ref={shellRef} className="life-tunnel" aria-label="Life at Kharis">
      {!reduced ? (
        <div className={`life-tunnel__stage${started ? " is-running" : ""}`}>
          <ImageTunnel
            items={items}
            onSelectItem={onSelectItem}
            onHoverItem={onHoverItem}
            onNearestItem={touch ? onNearestItem : undefined}
            /* Nothing should be moving behind an open activity. */
            frozen={Boolean(open)}
            /* The start control is ours, in the middle of the tunnel with the
               title, rather than the component's own floating button. */
            startSignal={started}
            showStartButton={false}
            autoStart={false}
            animationSpeed={1}
            clickToToggle
            mouseParallax
            reducedMotion={false}
            perspective={1800}
            tunnelDepth={5000}
            backgroundColor={backdrop ?? "#0c0814"}
            showGrid
            gridColor={theme === "dark" ? "#8a5ac8" : "#630ed4"}
            gridOpacity={theme === "dark" ? 0.3 : 0.2}
            gridThickness={1}
            tileGap={12}
            imageTileScale={1}
          />

          {/* The invitation, dead centre, inside the tunnel. It pulls back to
              a single line once you are moving so the tunnel has the screen,
              which is the whole point of it being here rather than above. */}
          <div className="life-tunnel__copy" inert={started}>
            <h2 id="life-tunnel-title" className="life-tunnel__title">
              Step into <span>life at Kharis</span>
            </h2>
            <p className="life-tunnel__lede">The Kharis we see day to day.</p>
            <button type="button" className="life-tunnel__start" onClick={() => setStarted(true)}>
              Step inside
            </button>
            <button type="button" className="life-tunnel__browse" onClick={browseActivities}>
              Scroll down for the full picture
            </button>
          </div>

          {/* The first thing you'd otherwise have to guess: once you're
              moving, dead centre, exactly where the title just was. Clears
              out the moment you actually point at or open a wall - handing
              off to the outline under the pointer, or, on a touch screen, to
              the readout below. */}
          <p className={`life-tunnel__cue${started && !engaged ? " is-on" : ""}`} aria-hidden>
            <span>
              {touch
                ? "Tap to pause · Tap a picture, or the bar below"
                : "Click anywhere to pause · Click a picture to find out more"}
            </span>
          </p>

          <button
            type="button"
            ref={runningBrowse}
            className={`life-tunnel__scroll${started ? " is-on" : ""}`}
            onClick={browseActivities}
            tabIndex={started ? undefined : -1}
          >
            Scroll down for the full picture
          </button>

          {/* The readout, for fingers.
              A wall's hit box is the sliver its own projection leaves, so on a
              phone the thing you are looking straight at can be a few pixels
              wide. The tunnel's touch slop gives each of those a 48px target;
              this gives the one you are passing a named, full-width one, so
              there is always something unmissable to press. */}
          {touch && started && passing ? (
            <button
              type="button"
              className="life-tunnel__passing"
              aria-haspopup="dialog"
              onClick={() => {
                setOpen(passing);
                setEngaged(true);
              }}
            >
              <span className="life-tunnel__passing-text">
                <span className="life-tunnel__passing-label">Now passing</span>
                <strong>{passing.title}</strong>
              </span>
              <span className="life-tunnel__passing-arrow" aria-hidden>
                ↗
              </span>
            </button>
          ) : null}
        </div>
      ) : null}

      {/* The same activities, as plain content. Always present: this is what
          a keyboard, a screen reader and a crawler use, and it is all there
          is when someone has asked for reduced motion. */}
      <div className="life-tunnel__list" id="life-everything">
        <h2 ref={listTitle} tabIndex={-1} className="life-tunnel__list-title">
          Life at Kharis
        </h2>
        <div className="life-tunnel__programme">
          {programme.map(({ title, preview, activities: slugs }, index) => (
            <details key={title} className="life-tunnel__chapter" open={index === 0}>
              <summary>
                <span className="life-tunnel__chapter-title">{title}</span>
                <span className="life-tunnel__chapter-preview">{preview}</span>
                <span className="life-tunnel__chapter-toggle" aria-hidden />
              </summary>
              <ul className="life-tunnel__directory">
                {(index === programme.length - 1 ? [...slugs, ...ungroupedSlugs] : slugs).map(
                  (slug) => {
                    const activity = activitiesBySlug.get(slug);
                    if (!activity) return null;
                    return (
                      <li key={slug}>
                        <button
                          type="button"
                          aria-haspopup="dialog"
                          onClick={(event) => openActivity(event.currentTarget, activity)}
                        >
                          <span>
                            <strong>{activity.title}</strong>
                            <span className="life-tunnel__activity-description">
                              {activity.blurb}
                            </span>
                          </span>
                          <span className="life-tunnel__row-arrow" aria-hidden>
                            ↗
                          </span>
                        </button>
                      </li>
                    );
                  },
                )}
              </ul>
            </details>
          ))}
        </div>
      </div>

      {open ? <ActivityPanel activity={open} onClose={() => setOpen(null)} /> : null}
    </section>
  );
}
