"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { KP2_PHOTOS } from "@/lib/photography";
import { SCRUB_SPRING, cdn, cdnSet } from "./motion";
import type { BookPhoto } from "./data";

type Panel = {
  id: string;
  word: string;
  title: string;
  copy: string;
  bubble: string;
  photo: BookPhoto;
  /** Parallax travel in px across the panel's time on screen. Different per column. */
  drift: number;
  tilt: number;
};

const PANELS: Panel[] = [
  {
    id: "grow",
    word: "Grow",
    title: "In the Word",
    copy: "Teaching, Bible study and prayer that changes how you live on a Monday, not just a Sunday.",
    bubble: "Turn with me to John 15…",
    photo: KP2_PHOTOS.serviceBible,
    drift: -60,
    tilt: -2,
  },
  {
    id: "serve",
    word: "Serve",
    title: "With your gifts",
    copy: "Music, media, drama, welcome and more. There's a place on the team with your name on it.",
    bubble: "Mic check… one, two!",
    photo: KP2_PHOTOS.serviceSaxophone,
    drift: 40,
    tilt: 1.5,
  },
  {
    id: "belong",
    word: "Belong",
    title: "As family",
    copy: "Meals, laughter, celebrations, and people who notice when you're missing.",
    bubble: "We saved you a seat!",
    photo: KP2_PHOTOS.welcomeSmile,
    drift: -30,
    tilt: -1,
  },
];

function OriginPanel({
  panel,
  index,
  progress,
  still,
}: {
  panel: Panel;
  index: number;
  progress: MotionValue<number>;
  still: boolean;
}) {
  // Perspective scroll: each panel lies back on the page and stands up as it reaches you.
  const start = 0.04 + index * 0.06;
  const rotateX = useTransform(progress, [start, start + 0.3], still ? [0, 0] : [38, 0]);
  const scale = useTransform(progress, [start, start + 0.3], still ? [1, 1] : [0.84, 1]);
  const opacity = useTransform(progress, [start, start + 0.16], still ? [1, 1] : [0, 1]);
  const y = useTransform(progress, [0, 1], still ? [0, 0] : [panel.drift, -panel.drift]);
  // The photo moves against its frame, so the panel reads as a window.
  const photoY = useTransform(progress, [0, 1], still ? ["0%", "0%"] : ["-9%", "9%"]);
  const bubbleScale = useTransform(progress, [start + 0.22, start + 0.3], still ? [1, 1] : [0, 1]);

  return (
    <motion.article
      className={`lb-origin__panel lb-origin__panel--${panel.id}`}
      style={{ rotateX, scale, opacity, y, rotate: panel.tilt }}
      aria-labelledby={`lb-origin-${panel.id}`}
    >
      <div className="lb-origin__photo">
        <motion.img
          src={cdn(panel.photo.src, 900)}
          srcSet={cdnSet(panel.photo.src, [480, 900, 1300])}
          sizes="(max-width: 899px) 92vw, 30vw"
          alt={panel.photo.alt}
          loading="lazy"
          decoding="async"
          style={{ y: photoY, objectPosition: panel.photo.position }}
        />
      </div>
      <p className="lb-caption lb-origin__word">{panel.word}</p>
      <motion.p className="lb-bubble lb-origin__bubble" style={{ scale: bubbleScale }}>
        {panel.bubble}
      </motion.p>
      <div className="lb-origin__copy">
        <h3 id={`lb-origin-${panel.id}`}>{panel.title}</h3>
        <p>{panel.copy}</p>
      </div>
    </motion.article>
  );
}

/**
 * "What is Kharis Life really about?" The page right after the cover: a splash headline whose
 * words punch in, then three panels that tilt up off the page at different parallax speeds.
 */
export function OriginPages() {
  const ref = useRef<HTMLElement>(null);
  const still = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, SCRUB_SPRING);
  const progress = still ? scrollYProgress : smooth;

  const burstRotate = useTransform(progress, [0, 1], still ? [0, 0] : [-30, 80]);
  const burstScale = useTransform(progress, [0.05, 0.3], still ? [1, 1] : [0.4, 1]);
  const lineX = useTransform(progress, [0, 1], still ? ["0%", "0%"] : ["8%", "-22%"]);

  const words = ["What's", "Kharis", "Life", "really", "about?"];

  return (
    <section
      ref={ref}
      data-reveal="self"
      id="lb-origin"
      className="lb-origin lb-paper"
      data-chapter="The origin story"
      aria-labelledby="lb-origin-title"
    >
      <p className="lb-caption lb-origin__narration">
        Every hero has an origin story. Ours starts with a family…
      </p>

      <h2 id="lb-origin-title" className="lb-origin__title">
        {words.map((word, i) => (
          <OriginWord key={word} word={word} index={i} progress={progress} still={still} />
        ))}
      </h2>

      <motion.span
        className="lb-burst lb-origin__burst"
        style={{ rotate: burstRotate, scale: burstScale }}
        aria-hidden="true"
      >
        <span>Pow!</span>
      </motion.span>

      <div className="lb-origin__tier">
        {PANELS.map((panel, i) => (
          <OriginPanel key={panel.id} panel={panel} index={i} progress={progress} still={still} />
        ))}
      </div>

      <div className="lb-speedline" aria-hidden="true">
        <motion.span style={{ x: lineX }}>
          Meanwhile… meanwhile… meanwhile… meanwhile… meanwhile…
        </motion.span>
      </div>
    </section>
  );
}

function OriginWord({
  word,
  index,
  progress,
  still,
}: {
  word: string;
  index: number;
  progress: MotionValue<number>;
  still: boolean;
}) {
  const at = 0.03 + index * 0.025;
  const scale = useTransform(progress, [at, at + 0.06], still ? [1, 1] : [2.4, 1]);
  const opacity = useTransform(progress, [at, at + 0.03], still ? [1, 1] : [0, 1]);
  const rotate = useTransform(
    progress,
    [at, at + 0.06],
    still ? [0, 0] : [index % 2 ? 8 : -8, index % 2 ? 2 : -2],
  );
  return (
    <motion.span className={`lb-origin__word-${index}`} style={{ scale, opacity, rotate }}>
      {word}
    </motion.span>
  );
}
