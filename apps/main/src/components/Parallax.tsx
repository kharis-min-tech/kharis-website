"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Vertical parallax travel in px (positive = moves slower / up as you scroll). */
  speed?: number;
  scaleFrom?: number;
  scaleTo?: number;
};

/** Scroll-scrubbed parallax wrapper for backgrounds / large media. */
export function Parallax({
  children,
  className = "",
  speed = 80,
  scaleFrom = 1.12,
  scaleTo = 1,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);
  const scale = useTransform(scrollYProgress, [0, 1], [scaleFrom, scaleTo]);

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y, scale }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
