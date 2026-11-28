"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import type { ChurchEvent } from "@/lib/events";
import { SCRUB_SPRING } from "./motion";

/**
 * The last page, which belongs to the reader: a fabric banner, an empty panel saved for them,
 * the next dates in the diary and the ways in. Then the back cover closes.
 */
export function YourChapter({ events }: { events: ChurchEvent[] }) {
  const ref = useRef<HTMLElement>(null);
  const still = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const smooth = useSpring(scrollYProgress, SCRUB_SPRING);
  const panelRotate = useTransform(smooth, [0.1, 0.55], still ? [0, 0] : [-10, -1.5]);
  const panelScale = useTransform(smooth, [0.1, 0.55], still ? [1, 1] : [0.82, 1]);
  const backCover = useTransform(smooth, [0.82, 1], still ? [0, 0] : [-100, 0]);
  const upcoming = events.slice(0, 3);

  return (
    <section
      ref={ref}
      data-reveal="self"
      id="lb-you"
      className="lb-you lb-paper"
      data-chapter="Your chapter"
      aria-labelledby="lb-you-title"
    >
      <div className="lb-you__banner">
        <h2 id="lb-you-title" className="lb-you__title">
          Your chapter starts here
        </h2>
      </div>

      <div className="lb-you__grid">
        <motion.div className="lb-you__panel" style={{ rotate: panelRotate, scale: panelScale }}>
          <p className="lb-caption">The next page</p>
          <div className="lb-you__empty" aria-hidden="true">
            <span className="material-symbols-outlined">person_add</span>
            <span>This panel is saved for you</span>
          </div>
        </motion.div>

        <div className="lb-you__ways">
          <p className="lb-you__lede">
            Every story here started with someone walking through the door for the first time. Yours
            can start this Sunday.
          </p>
          <div className="lb-you__actions">
            <Link href="/branches" className="lb-button lb-button--gold">
              Find a branch
              <span className="material-symbols-outlined" aria-hidden="true">
                location_on
              </span>
            </Link>
            <Link href="/contact" className="lb-button">
              Plan a visit
              <span className="material-symbols-outlined" aria-hidden="true">
                waving_hand
              </span>
            </Link>
            <Link href="/quiz" className="lb-button">
              Find where you’ll serve
              <span className="material-symbols-outlined" aria-hidden="true">
                quiz
              </span>
            </Link>
          </div>

          {upcoming.length ? (
            <div className="lb-you__next">
              <p className="lb-kicker">Out next</p>
              <ul>
                {upcoming.map((event) => (
                  <li key={`${event.slug}-${event.starts}`}>
                    <span className="lb-you__date">
                      {event.dayLabel}
                      <small>{event.timeLabel}</small>
                    </span>
                    <span className="lb-you__event">
                      <strong>{event.title}</strong>
                      <small>{event.location}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <div className="lb-you__back" aria-hidden="true">
        <motion.span className="lb-you__back-board" style={{ x: backCover }} />
        <span className="lb-you__end">The End… for now</span>
      </div>
    </section>
  );
}
