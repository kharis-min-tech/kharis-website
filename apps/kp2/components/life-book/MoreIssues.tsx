"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useState, useRef, type CSSProperties } from "react";
import { ComicGallery } from "@/components/ComicGallery";
import { EXTRA_ISSUES } from "./data";
import { SCRUB_SPRING, cdn, useCompact } from "./motion";

/**
 * More adventures: the rest of the year's stories as a ring of comic covers that turns as you
 * scroll (scroll rotation), tipping towards you on the way in. Each cover opens its photos.
 * Reduced motion lays the covers out as a rack instead.
 */
export function MoreIssues() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const compact = useCompact();
  const count = EXTRA_ISSUES.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 74px", "end end"] });
  const smooth = useSpring(scrollYProgress, SCRUB_SPRING);

  // One full turn, plus a little, across the pin.
  const spin = useTransform(smooth, [0, 1], [18, -360 - 18 + 360 / count]);
  const tilt = useTransform(smooth, [0, 0.25, 1], [-24, -8, -6]);
  const lift = useTransform(smooth, [0, 0.25], [120, 0]);
  const titleScale = useTransform(smooth, [0, 0.2], [0.7, 1]);
  const [front, setFront] = useState(0);
  useMotionValueEvent(spin, "change", (deg) => {
    const step = 360 / count;
    setFront(((Math.round(-deg / step) % count) + count) % count);
  });

  const [openId, setOpenId] = useState<string | null>(null);
  const close = useCallback(() => setOpenId(null), []);
  const open = EXTRA_ISSUES.find((issue) => issue.id === openId);

  const cardW = compact ? 150 : 220;
  const radius = Math.round((cardW / 2 / Math.tan(Math.PI / count)) * 1.18);

  return (
    <section
      data-reveal="self"
      ref={ref}
      id="lb-more"
      className="lb-more"
      data-still={reduce || undefined}
      data-chapter="More adventures"
      aria-labelledby="lb-more-title"
      style={{ "--card-w": `${cardW}px` } as CSSProperties}
    >
      <div className="lb-more__pin">
        <span className="lb-more__rays" aria-hidden="true" />
        <motion.div className="lb-more__head" style={reduce ? undefined : { scale: titleScale }}>
          <p className="lb-caption">Chapter 3</p>
          <h2 id="lb-more-title" className="lb-more__title">
            More <span>adventures</span>
          </h2>
          <p className="lb-more__lede">One book can’t hold it all. Pick an issue.</p>
        </motion.div>

        {reduce ? (
          <ul className="lb-more__rack">
            {EXTRA_ISSUES.map((issue, i) => (
              <li key={issue.id}>
                <IssueCard issue={issue} number={i + 1} onOpen={setOpenId} />
              </li>
            ))}
          </ul>
        ) : (
          <motion.div className="lb-more__stage" style={{ y: lift }}>
            <motion.ul className="lb-more__ring" style={{ rotateX: tilt, rotateY: spin }}>
              {EXTRA_ISSUES.map((issue, i) => (
                <li
                  key={issue.id}
                  className="lb-more__slot"
                  data-front={i === front || undefined}
                  style={{ transform: `rotateY(${(360 / count) * i}deg) translateZ(${radius}px)` }}
                >
                  <IssueCard issue={issue} number={i + 1} onOpen={setOpenId} />
                </li>
              ))}
            </motion.ul>
            <span className="lb-more__floor" aria-hidden="true" />
          </motion.div>
        )}
      </div>
      {open ? <ComicGallery title={open.title} photos={open.gallery} onClose={close} /> : null}
    </section>
  );
}

function IssueCard({
  issue,
  number,
  onOpen,
}: {
  issue: (typeof EXTRA_ISSUES)[number];
  number: number;
  onOpen: (id: string) => void;
}) {
  return (
    <button type="button" className="lb-issue" onClick={() => onOpen(issue.id)}>
      <span className="lb-issue__mast">
        <span>KP2 Comics</span>
        <span>#{String(number).padStart(2, "0")}</span>
      </span>
      <span className="lb-issue__art">
        <img
          src={cdn(issue.cover.src, 440)}
          alt=""
          loading="lazy"
          decoding="async"
          style={issue.cover.position ? { objectPosition: issue.cover.position } : undefined}
        />
      </span>
      <span className="lb-issue__title">{issue.title}</span>
      <span className="lb-issue__line">{issue.line}</span>
      <span className="sr-only">. Open photos.</span>
    </button>
  );
}
