/** Life page "Community First": pinned split-door reveal into the Kharis family photo. */
"use client";

import {
  cubicBezier,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Image from "@/components/SiteImage";
import { Icon } from "@/components/Icon";
import { setHeaderOverlay } from "@/lib/header-overlay";
import "./community-doors.css";

/** Same weighty glide as the Belong section, so the two pinned sections feel like one system. */
const SCRUB_SPRING = { stiffness: 90, damping: 22, mass: 1 };
/** Doors start slow, travel, then ease to rest at the edges. */
const DOOR_EASE = cubicBezier(0.65, 0, 0.35, 1);
/** Timeline, as fractions of the pinned scroll. */
const DOORS_OPEN = [0.06, 0.6] as const;
const COPY_IN = [0.56, 0.8] as const;
/** The header turns clear once the doors are mostly open and the photo owns the screen. */
const HEADER_CLEAR_AT = 0.5;
/** Fixed site header height (h-[4.5rem]). */
const HEADER_HEIGHT_PX = 72;

export function CommunityDoors() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = Boolean(useReducedMotion());

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, SCRUB_SPRING);
  const progress = reduce ? scrollYProgress : smoothProgress;

  const leftDoorX = useTransform(progress, [...DOORS_OPEN], ["0%", "-101%"], { ease: DOOR_EASE });
  const rightDoorX = useTransform(progress, [...DOORS_OPEN], ["0%", "101%"], { ease: DOOR_EASE });
  /* Zooms in as you scroll down, back out as you scroll up. */
  const photoScale = useTransform(progress, [0, 1], reduce ? [1, 1] : [1.02, 1.24]);
  const seamOpacity = useTransform(progress, [0, 0.04, 0.14], [0.55, 1, 0]);
  /* Top shade arrives with the open doors so the clear header stays legible over bright photos. */
  const topShadeOpacity = useTransform(progress, [0.3, 0.5], [0, 1]);
  const shadeOpacity = useTransform(progress, [...COPY_IN], [0, 1]);
  const copyOpacity = useTransform(progress, [...COPY_IN], [0, 1]);
  const copyY = useTransform(progress, [...COPY_IN], [44, 0]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    /* Scroll events cover leaving the section; progress changes cover moving within it. */
    const updateHeader = () => {
      const rect = section.getBoundingClientRect();
      const pinned = rect.top <= 0.5 && rect.bottom >= window.innerHeight - 0.5;
      const underHeader = rect.top <= 0.5 && rect.bottom > HEADER_HEIGHT_PX;
      /* Clear once the doors are mostly open; dark glass while the photo scrolls away beneath. */
      const mode = pinned
        ? scrollYProgress.get() >= HEADER_CLEAR_AT
          ? "clear"
          : null
        : underHeader
          ? "dark"
          : null;
      setHeaderOverlay("community-doors", mode);
    };
    const unsubscribe = scrollYProgress.on("change", updateHeader);
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
    return () => {
      unsubscribe();
      window.removeEventListener("scroll", updateHeader);
      setHeaderOverlay("community-doors", null);
    };
  }, [scrollYProgress]);

  return (
    <section
      ref={sectionRef}
      className="life-doors"
      aria-labelledby="life-refresh-title"
      data-snap="start end"
    >
      <div className="life-doors__pin">
        <motion.div className="life-doors__photo" style={{ scale: photoScale }} aria-hidden>
          <Image
            src="/images/join-family-community.jpg"
            alt=""
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-[center_58%]"
          />
        </motion.div>
        <motion.div
          className="life-doors__top-shade"
          style={{ opacity: topShadeOpacity }}
          aria-hidden
        />
        <motion.div className="life-doors__shade" style={{ opacity: shadeOpacity }} aria-hidden />

        <motion.div className="life-doors__copy" style={{ opacity: copyOpacity, y: copyY }}>
          <p className="life-doors__eyebrow">COMMUNITY FIRST</p>
          <h1 id="life-refresh-title">KHARIS LIFE</h1>
          <p className="life-doors__body">
            The Christian life is a one-another life. Believe, become, and belong. Grow in the Word,
            find your people, and live out your faith in the Kharis family.
          </p>
          <Link href="/locations" className="life-refresh__button">
            PLAN A VISIT <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* The doors carry the title; the real heading above is revealed once they part. */}
        <motion.div
          className="life-doors__door life-doors__door--left"
          style={{ x: leftDoorX }}
          aria-hidden
        >
          <div className="life-doors__words">
            <span className="life-doors__eyebrow">COMMUNITY</span>
            <span className="life-doors__title">KHARIS</span>
          </div>
          <span className="life-doors__quote">A ONE-ANOTHER LIFE.</span>
          <motion.i className="life-doors__seam" style={{ opacity: seamOpacity }} />
        </motion.div>
        <motion.div
          className="life-doors__door life-doors__door--right"
          style={{ x: rightDoorX }}
          aria-hidden
        >
          <div className="life-doors__words">
            <span className="life-doors__eyebrow">FIRST</span>
            <span className="life-doors__title">LIFE</span>
          </div>
          <span className="life-doors__quote">BELONG HERE.</span>
          <motion.i className="life-doors__seam" style={{ opacity: seamOpacity }} />
        </motion.div>
      </div>
    </section>
  );
}
