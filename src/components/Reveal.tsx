"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export type RevealVariant =
  | "up"
  | "down"
  | "left"
  | "right"
  | "scale"
  | "blur"
  | "fade";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
  /** How far the element travels (px). Default varies by variant. */
  distance?: number;
  duration?: number;
  once?: boolean;
  amount?: number | "some" | "all";
  as?: "div" | "section" | "article" | "header" | "footer";
};

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

function makeVariants(
  variant: RevealVariant,
  distance: number,
): Variants {
  const hiddenBase = { opacity: 0, filter: "blur(0px)" };
  const shown = {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
  };

  switch (variant) {
    case "left":
      return {
        hidden: { ...hiddenBase, x: -distance, filter: "blur(8px)" },
        shown,
      };
    case "right":
      return {
        hidden: { ...hiddenBase, x: distance, filter: "blur(8px)" },
        shown,
      };
    case "down":
      return {
        hidden: { ...hiddenBase, y: -distance, filter: "blur(6px)" },
        shown,
      };
    case "scale":
      return {
        hidden: {
          ...hiddenBase,
          scale: 0.92,
          y: distance * 0.35,
          filter: "blur(10px)",
        },
        shown,
      };
    case "blur":
      return {
        hidden: { opacity: 0, y: distance * 0.4, filter: "blur(14px)" },
        shown,
      };
    case "fade":
      return {
        hidden: { opacity: 0 },
        shown: { opacity: 1 },
      };
    case "up":
    default:
      return {
        hidden: { ...hiddenBase, y: distance, filter: "blur(8px)" },
        shown,
      };
  }
}

/** Scroll-triggered cinematic reveal (Lando Norris style fade/slide). */
export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "up",
  distance,
  duration = 0.95,
  once = true,
  amount = 0.2,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const dist =
    distance ??
    (variant === "left" || variant === "right" ? 56 : variant === "scale" ? 40 : 64);
  const variants = makeVariants(variant, dist);
  const MotionTag = as === "section" ? motion.section : motion.div;

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once, amount, margin: "0px 0px -8% 0px" }}
      transition={{ duration, delay, ease }}
    >
      {children}
    </MotionTag>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: number;
};

const staggerContainer: Variants = {
  hidden: {},
  shown: {},
};

/** Parent for staggered child Reveals / motion items. */
export function RevealStagger({
  children,
  className = "",
  stagger = 0.1,
  delayChildren = 0.05,
  once = true,
  amount = 0.15,
}: StaggerProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="shown"
      viewport={{ once, amount, margin: "0px 0px -6% 0px" }}
      transition={{
        staggerChildren: stagger,
        delayChildren,
      }}
    >
      {children}
    </motion.div>
  );
}

/** Child item used inside RevealStagger */
export function RevealItem({
  children,
  className = "",
  variant = "up",
  distance = 48,
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  distance?: number;
}) {
  const reduce = useReducedMotion();
  const variants = makeVariants(variant, distance);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={variants}
      transition={{ duration: 0.9, ease }}
    >
      {children}
    </motion.div>
  );
}
