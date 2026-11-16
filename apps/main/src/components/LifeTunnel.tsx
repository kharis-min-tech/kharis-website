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
import { activeLifeActivities, type LifeActivity } from "@/lib/life-activities";
import { glidePageTo } from "@/lib/page-snap";
import { getSiteTheme, subscribeSiteTheme } from "@/lib/theme";
import "./life-tunnel.css";

/**
 * Client-only: it measures itself, drives a requestAnimationFrame loop and
 * draws with CSS 3D, so there is nothing useful to server-render. The
 * activities list below it is server-rendered and is what a crawler sees.
 */
const ImageTunnel = dynamic(() => import("@/vendor/image-tunnel/InfiniteImageTunnel.js"), {
  ssr: false,
  loading: () => <div className="life-tunnel__placeholder" aria-hidden />,
});

/** Matches the media query the vendored component honours internally. */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function ActivityPanel({ activity, onClose }: { activity: LifeActivity; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="life-panel" role="dialog" aria-modal="true" aria-labelledby="life-panel-title">
      <button
        type="button"
        className="life-panel__scrim"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
      />
      <div className="life-panel__sheet">
        <button ref={closeRef} type="button" className="life-panel__close" onClick={onClose}>
          Close
        </button>

        <figure className="life-panel__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={activity.image} alt={activity.alt} />
        </figure>

        <div className="life-panel__body">
          <h3 id="life-panel-title" className="life-panel__title">
            {activity.title}
          </h3>
          <p className="life-panel__blurb">{activity.blurb}</p>

          <p className="life-panel__copy">{activity.body}</p>

          {activity.gallery?.length ? (
            <div className="life-panel__gallery">
              {activity.gallery.map((shot) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={shot.src} src={shot.src} alt={shot.alt} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function LifeTunnel() {
  const activities = activeLifeActivities();
  const theme = useSyncExternalStore(subscribeSiteTheme, getSiteTheme, () => "light" as const);
  const reduced = usePrefersReducedMotion();
  const shellRef = useRef<HTMLElement>(null);
  const [backdrop, setBackdrop] = useState<string | undefined>();
  const [open, setOpen] = useState<LifeActivity | null>(null);
  const [started, setStarted] = useState(false);
  const [hovered, setHovered] = useState<LifeActivity | null>(null);
  const [nearest, setNearest] = useState<LifeActivity | null>(null);

  /* The tunnel needs a real colour, not a custom property, so the page's own
   * surface token is read back off the section after the theme has applied.
   * That keeps the colour in the stylesheet with the rest of the theme. */
  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    const value = getComputedStyle(el).getPropertyValue("--life-tunnel-paper").trim();
    setBackdrop(value || undefined);
  }, [theme]);

  const items = activities.map((a) => ({
    id: a.slug,
    title: a.title,
    src: a.image,
    alt: a.alt,
    video: a.video,
    activity: a,
  }));

  const onSelectItem = useCallback((item: { activity?: LifeActivity }) => {
    if (item?.activity) setOpen(item.activity);
  }, []);

  /* Names whatever the pointer is over, in one fixed legible place. The
   * captions on the walls tell you what is coming; this tells you exactly
   * what you are about to open. */
  const onHoverItem = useCallback((item: { activity?: LifeActivity } | null) => {
    setHovered(item?.activity ?? null);
  }, []);

  /* Whatever is closest to the camera right now. The tunnel narrates itself
   * as you travel, which is what makes it a guided journey rather than a
   * browse, and it is the only part of this that works on touch. */
  const onNearestItem = useCallback((item: { activity?: LifeActivity } | null) => {
    setNearest(item?.activity ?? null);
  }, []);

  /* The page should not scroll underneath an open activity. */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  /* Hovering is a deliberate question about one wall, so it wins. With no
   * pointer on anything, the tunnel names whatever it is carrying you past. */
  const showing = hovered ?? nearest;

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
            onNearestItem={onNearestItem}
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
          <div className="life-tunnel__copy" aria-hidden={started}>
            <h2 id="life-tunnel-title" className="life-tunnel__title">
              Step into <span>life at Kharis</span>
            </h2>
            <p className="life-tunnel__lede">The Kharis we see day to day.</p>
            <button type="button" className="life-tunnel__start" onClick={() => setStarted(true)}>
              Step inside
            </button>
          </div>

          <button
            type="button"
            className={`life-tunnel__scroll${started ? " is-on" : ""}`}
            onClick={() => {
              const list = document.getElementById("life-everything");
              if (list) glidePageTo(list.getBoundingClientRect().top + window.scrollY);
            }}
          >
            Scroll for the full picture
          </button>

          <p className={`life-tunnel__hint${started ? " is-on" : ""}`} aria-hidden>
            {showing ? (
              <>
                <strong>{showing.title}</strong>
                <span>{showing.blurb}</span>
              </>
            ) : (
              <span>Hold to speed up · Click any wall to stop on it</span>
            )}
          </p>
        </div>
      ) : null}

      {/* The same activities, as plain content. Always present: this is what
          a keyboard, a screen reader and a crawler use, and it is all there
          is when someone has asked for reduced motion. */}
      <div className="life-tunnel__list" id="life-everything" data-snap="start">
        <h2 className="life-tunnel__list-title">Everything we do</h2>
        <p className="life-tunnel__list-lede">
          The seminars and the sports day sit alongside baptism, fasting and serving, because it is
          one life rather than two.
        </p>
        <ul>
          {activities.map((a) => (
            <li key={a.slug}>
              <button type="button" onClick={() => setOpen(a)}>
                <span className="life-tunnel__list-name">{a.title}</span>
                <span className="life-tunnel__list-blurb">{a.blurb}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {open ? <ActivityPanel activity={open} onClose={() => setOpen(null)} /> : null}
    </section>
  );
}
