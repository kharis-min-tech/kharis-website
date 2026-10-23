/** Life page closer: "DON'T DO LIFE ALONE" drifting sideways, pushed faster (and reversed) by page scroll. */
"use client";

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef } from "react";

/** Copies of the phrase in the track; the track loops after one copy (100 / COPIES percent). */
const COPIES = 4;
/** Resting drift, in percent of the track per second. */
const BASE_SPEED = 1.6;
/** Scroll velocity (px/s) that multiplies the drift by VELOCITY_BOOST. */
const VELOCITY_REF = 1000;
const VELOCITY_BOOST = 4;

const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

export function LifeCloserMarquee({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const direction = useRef(1);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, VELOCITY_REF], [0, VELOCITY_BOOST], {
    clamp: false,
  });
  const x = useTransform(baseX, (value) => `${wrap(-100 / COPIES, 0, value)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return;
    const factor = velocityFactor.get();
    /* Scrolling down drifts left, scrolling up drifts right; it keeps the last direction at rest. */
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    const step = -direction.current * BASE_SPEED * (delta / 1000);
    baseX.set(baseX.get() + step + step * Math.abs(factor));
  });

  return (
    <div ref={ref} className="life-alone__marquee" aria-hidden>
      <motion.div className="life-alone__track" style={{ x }}>
        {Array.from({ length: COPIES }, (_, index) => (
          <span key={index}>
            {text}
            <i>✦</i>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
