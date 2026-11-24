"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { KP2_PHOTOS } from "@/lib/photography";
import "@/components/events-top.css";
import "@/components/life-stage.css";

/** The main site's Life page scrub spring, so scroll motion has the same weight on both sites. */
const SCRUB_SPRING = { stiffness: 90, damping: 22, mass: 1 };
/** Prints fade over this part of the hero scrolling away, so they clear as the comic page deals in. */
const DRIFT_FADE = [0.16, 0.5];
/** The Events comic panel poster. Same file, so the browser reuses the download. */
const PRAISE_NIGHT = {
  src: "https://images.kharis.org/site-images/main/c92b67201f985207/events/praise-night-stage.jpg",
  position: "30% 50%",
};

type Print = {
  id: "welcome" | "outreach" | "sax" | "baptism" | "praise";
  photo: { src: string; position: string };
  /** Drift once the hero has scrolled away: lift and slide (px), extra turn (deg). */
  drift: { y: number; x: number; turn: number };
};

/** Pop order, left to right. Placement, size and tilt per screen size live in life-stage.css. */
const PRINTS: Print[] = [
  { id: "welcome", photo: KP2_PHOTOS.welcomeSmile, drift: { y: -110, x: -16, turn: -3 } },
  { id: "outreach", photo: KP2_PHOTOS.outreachTeam, drift: { y: -210, x: 22, turn: 4 } },
  { id: "sax", photo: KP2_PHOTOS.serviceSaxophone, drift: { y: -150, x: -28, turn: -4 } },
  { id: "baptism", photo: KP2_PHOTOS.baptismJoy, drift: { y: -250, x: 18, turn: 3 } },
  { id: "praise", photo: PRAISE_NIGHT, drift: { y: -170, x: 34, turn: -2 } },
];

type Entrance = "intro" | "wait" | "go";

/** When the dove intro has fully cleared on a first load (refinements.css: 1.7s delay + 0.5s exit). */
const INTRO_CLEARS_MS = 2200;

/**
 * Times the hero entrance against whatever covers the page:
 * - "intro" (server default): on a first load the entrance is timed in CSS on the same clock as the
 *   dove intro, so it starts as the intro clears even when hydration is slow.
 * - "wait": held while a comic page turn covers the screen.
 * - "go": replayed from the start once the page turn clears, or straight away if the intro is skipped.
 */
function useEntrance(heroRef: RefObject<HTMLElement | null>): Entrance {
  const [entrance, setEntrance] = useState<Entrance>("intro");

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    let state: Entrance = "intro";
    let frame = 0;
    let settled = false;

    const set = (next: Entrance) => {
      state = next;
      setEntrance(next);
    };
    const settle = () => {
      settled = true;
      observer.disconnect();
      window.clearTimeout(fallback);
    };
    const turnCovers = () => root.dataset.kpTurn === "on" || root.dataset.kpTurn === "leave";
    const introCovers = () => {
      if (root.dataset.kpIntro === "seen") return false;
      // Server-rendered, so it covers the page before KpIntro hydrates.
      const intro = document.querySelector<HTMLElement>(".kp-intro");
      return Boolean(intro && getComputedStyle(intro).visibility !== "hidden");
    };
    // How long the hero's CSS entrance clock has been running.
    const clock = () => {
      const line = hero.querySelector<HTMLElement>(".kp-life-stage__line > span");
      if (!line) return 0;
      const rise = line
        .getAnimations()
        .find((a) => (a as CSSAnimation).animationName === "kp-life-line-rise");
      if (rise) return Number(rise.currentTime ?? 0);
      // Scheduled but no longer listed: it has already played (slow hydration).
      return getComputedStyle(line).animationName.includes("kp-life-line-rise") ? Infinity : 0;
    };

    const decide = () => {
      cancelAnimationFrame(frame);
      if (settled) return;
      if (turnCovers()) return set("wait");
      if (introCovers()) return; // CSS starts the entrance as the intro clears.
      // Within a beat of the intro clearing, CSS has it in hand.
      if (state === "intro" && clock() >= INTRO_CLEARS_MS - 150) return settle();
      // Intro skipped early, or a page turn has cleared: replay the entrance from the top.
      set("wait");
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          settle();
          set("go");
        });
      });
    };

    const observer = new MutationObserver(decide);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-kp-intro", "data-kp-turn"],
    });
    // PageTurn uncovers within 8s even if a page never reports ready; never leave the hero empty.
    const fallback = window.setTimeout(() => {
      if (state !== "wait") return;
      settle();
      set("go");
    }, 9000);
    // A frame later, once PageTurn and KpIntro have run their effects for this commit.
    frame = requestAnimationFrame(decide);

    return () => {
      settled = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(fallback);
    };
  }, [heroRef]);

  return entrance;
}

/**
 * Gives the prints the measured room above the copy (`--kp-free`) and hides any print that would
 * still land on the copy at this screen size. Prints stay hidden until this has run once.
 */
function usePrintRoom(
  heroRef: RefObject<HTMLElement | null>,
  copyRef: RefObject<HTMLDivElement | null>,
  printsRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const hero = heroRef.current;
    const copy = copyRef.current;
    const layer = printsRef.current;
    if (!hero || !copy || !layer) return;
    const prints = Array.from(layer.children) as HTMLElement[];
    // Leaves room for each print's tilt and hard shadow.
    const GAP = 14;

    const fit = () => {
      hero.style.setProperty("--kp-free", `${copy.offsetTop}px`);
      const left = copy.offsetLeft - GAP;
      const top = copy.offsetTop - GAP;
      const right = copy.offsetLeft + copy.offsetWidth + GAP;
      const bottom = copy.offsetTop + copy.offsetHeight + GAP;
      for (const print of prints) {
        const clash =
          print.offsetWidth > 0 &&
          print.offsetLeft < right &&
          print.offsetLeft + print.offsetWidth > left &&
          print.offsetTop < bottom &&
          print.offsetTop + print.offsetHeight > top;
        print.toggleAttribute("data-clash", clash);
      }
      layer.dataset.measured = "";
    };

    const observer = new ResizeObserver(fit);
    observer.observe(hero);
    observer.observe(copy);
    return () => observer.disconnect();
  }, [heroRef, copyRef, printsRef]);
}

function DriftingPrint({
  print,
  order,
  progress,
  still,
}: {
  print: Print;
  order: number;
  progress: MotionValue<number>;
  still: boolean;
}) {
  const { y: lift, x: slide, turn } = print.drift;
  const y = useTransform(progress, [0, 1], [0, still ? 0 : lift]);
  const x = useTransform(progress, [0, 1], [0, still ? 0 : slide]);
  const rotate = useTransform(progress, [0, 1], [0, still ? 0 : turn]);
  const opacity = useTransform(progress, DRIFT_FADE, [1, still ? 1 : 0]);

  // A print only shows once its photo has decoded, so it never pops in as an empty frame.
  // If the photo misses the print's slot in the entrance, it pops in on its own when ready;
  // if it fails, the print is dropped.
  const imgRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [photo, setPhoto] = useState<"loading" | "ready" | "late" | "broken">("loading");
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    let live = true;
    const show = () => {
      const card = cardRef.current;
      if (!live || !card) return;
      // Its pop is scheduled but no longer waiting or running: the slot has passed.
      const scheduled = getComputedStyle(card).animationName.includes("kp-life-print-pop");
      const pending = card
        .getAnimations()
        .some((a) => (a as CSSAnimation).animationName === "kp-life-print-pop");
      setPhoto(scheduled && !pending ? "late" : "ready");
    };
    const decode = () => img.decode().then(show, show);
    // A load or error before hydration fires no React event, so check once on mount.
    if (img.complete) {
      if (img.naturalWidth) decode();
      else if (img.currentSrc) setPhoto("broken");
    } else {
      img.addEventListener("load", decode, { once: true });
    }
    return () => {
      live = false;
      img.removeEventListener("load", decode);
    };
  }, []);

  return (
    <motion.div
      className={`kp-life-stage__print kp-life-stage__print--${print.id}`}
      data-photo={photo}
      style={{ x, y, rotate, opacity }}
    >
      <div
        ref={cardRef}
        className="kp-life-stage__card"
        style={{ "--order": order } as CSSProperties}
      >
        <div className="kp-life-stage__photo">
          <img
            ref={imgRef}
            src={print.photo.src}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setPhoto("broken")}
            style={{ objectPosition: print.photo.position }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Life at KP2 hero. Once the intro or page turn clears, the headline rises line by line, the
 * sticker slaps on and photo prints pop out around the copy. Scrolling drifts the prints away.
 */
export function LifeHero({ printPhotos = [] }: { printPhotos?: string[] }) {
  const heroRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const printsRef = useRef<HTMLDivElement>(null);
  const entrance = useEntrance(heroRef);
  usePrintRoom(heroRef, copyRef, printsRef);

  // Under reduced motion the prints stay put; everything else is handled in CSS.
  const still = useReducedMotion() ?? false;
  // 0 at the top of the page, 1 once the hero has slid under the 74px header.
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start 74px", "end 74px"] });
  const smooth = useSpring(scrollYProgress, SCRUB_SPRING);
  const progress = still ? scrollYProgress : smooth;

  return (
    <header ref={heroRef} className="kp-ev-hero kp-life-stage" data-entrance={entrance}>
      <img
        src={KP2_PHOTOS.serviceChoir.src}
        alt={KP2_PHOTOS.serviceChoir.alt}
        className="kp-ev-hero__img"
        loading="eager"
        decoding="async"
      />
      <div className="kp-ev-hero__veil" aria-hidden="true" />
      <div className="kp-ev-hero__dots" aria-hidden="true" />
      <div ref={printsRef} className="kp-life-stage__prints" aria-hidden="true">
        {PRINTS.map((print, order) => (
          <DriftingPrint
            key={print.id}
            print={
              printPhotos[order]
                ? { ...print, photo: { ...print.photo, src: printPhotos[order] } }
                : print
            }
            order={order}
            progress={progress}
            still={still}
          />
        ))}
      </div>
      <div ref={copyRef} className="kp-ev-hero__copy">
        <p className="kp-ev-hero__eyebrow">Grow · Serve · Belong</p>
        <h1 className="kp-ev-hero__heading">
          <span className="kp-life-stage__line">
            <span>Life at</span>
          </span>{" "}
          <span className="kp-life-stage__line kp-life-stage__line--accent">
            <span>Kharis Phase 2</span>
          </span>
        </h1>
        <p className="kp-ev-hero__tag" style={{ maxWidth: "42rem" }}>
          Beyond Sundays, we grow, serve, and build relationships in Christ together as a family.
        </p>
      </div>
    </header>
  );
}
