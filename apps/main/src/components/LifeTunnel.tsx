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
import { activeLifeActivities, type LifeActivity } from "@/lib/life-activities";
import { getSiteTheme, subscribeSiteTheme } from "@/lib/theme";
import { useDialog } from "@/lib/use-dialog";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import "./life-tunnel.css";

const programme = [
  {
    title: CHURCH_VALUES.christCentered,
    preview: "Taking the next step in following Christ",
    activities: ["baptism"],
  },
  {
    title: CHURCH_VALUES.bibleBelieving,
    preview: "Learning and sharing the Word",
    activities: ["let-the-bible-speak-conference", "k-group"],
  },
  {
    title: CHURCH_VALUES.revivalSeeking,
    preview: "Seeking God together and sharing the gospel",
    activities: ["fasting", "jesus-campaign"],
  },
  {
    title: CHURCH_VALUES.purposeDriven,
    preview: "Putting faith to work through service and innovation",
    activities: ["marriage", "innovation-project"],
  },
  {
    title: CHURCH_VALUES.peopleDeveloping,
    preview: "Careers, money, technology and wellbeing",
    activities: ["careers-fair", "finance-seminar", "ai-in-the-workplace", "health-seminar"],
  },
  {
    title: CHURCH_VALUES.discipleMaking,
    preview: "Growing together through relationships, fellowship and sport",
    activities: [
      "departments",
      "singles-seminar",
      "cook-along",
      "christmas-jumper",
      "sports-day",
      "football-tournament",
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
  const listTitle = useRef<HTMLHeadingElement>(null);
  const runningBrowse = useRef<HTMLButtonElement>(null);
  const [backdrop, setBackdrop] = useState<string | undefined>();
  const [open, setOpen] = useState<LifeActivity | null>(null);
  const [started, setStarted] = useState(false);
  const [hovered, setHovered] = useState<LifeActivity | null>(null);
  const [nearest, setNearest] = useState<LifeActivity | null>(null);
  /** Once someone has actually pointed at or opened a wall, the centre cue has done its job. */
  const [engaged, setEngaged] = useState(false);
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

  const items = activities.map((a) => ({
    id: a.slug,
    title: a.title,
    src: a.image,
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

  /* Names whatever the pointer is over, in one fixed legible place. The
   * captions on the walls tell you what is coming; this tells you exactly
   * what you are about to open. */
  const onHoverItem = useCallback((item: { activity?: LifeActivity } | null) => {
    setHovered(item?.activity ?? null);
    if (item?.activity && Date.now() - startedAt.current > 500) setEngaged(true);
  }, []);

  /* Whatever is closest to the camera right now. The tunnel narrates itself
   * as you travel, which is what makes it a guided journey rather than a
   * browse, and it is the only part of this that works on touch. */
  const onNearestItem = useCallback((item: { activity?: LifeActivity } | null) => {
    setNearest(item?.activity ?? null);
  }, []);

  /* Hovering is a deliberate question about one wall, so it wins. With no
   * pointer on anything, the tunnel names whatever it is carrying you past. */
  const showing = hovered ?? nearest;
  const programmeActivities = activities.filter((activity) => activity.slug !== "children");
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
          <div className="life-tunnel__copy" inert={started}>
            <h2 id="life-tunnel-title" className="life-tunnel__title">
              Step into <span>life at Kharis</span>
            </h2>
            <p className="life-tunnel__lede">The Kharis we see day to day.</p>
            <button type="button" className="life-tunnel__start" onClick={() => setStarted(true)}>
              Step inside
            </button>
            <button type="button" className="life-tunnel__browse" onClick={browseActivities}>
              Browse activities
            </button>
          </div>

          {/* The first thing you'd otherwise have to guess: once you're
              moving, dead centre, exactly where the title just was. Clears
              out the moment you actually point at or open a wall, handing
              off to the readout below. */}
          <p className={`life-tunnel__cue${started && !engaged ? " is-on" : ""}`} aria-hidden>
            <span>Click a picture to find out more</span>
          </p>

          <button
            type="button"
            ref={runningBrowse}
            className={`life-tunnel__scroll${started ? " is-on" : ""}`}
            onClick={browseActivities}
            tabIndex={started ? undefined : -1}
          >
            Browse activities
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
