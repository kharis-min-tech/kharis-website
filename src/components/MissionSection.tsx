"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/Reveal";

const WORDS = [
  "Establishing",
  "believers",
  "and",
  "strengthening",
  "churches.",
];

export function MissionSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "center 0.35"],
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-bg px-5 pb-10 pt-7 md:px-8 md:pb-12 md:pt-9"
    >
      <div className="mx-auto max-w-7xl text-center">
        <Reveal variant="up" distance={28} duration={0.8} className="mb-4">
          <div className="inline-flex items-center justify-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-purple" />
            <p className="eyebrow !text-fg">Our Mission</p>
          </div>
        </Reveal>

        <h2 className="section-title mx-auto inline-flex max-w-none flex-nowrap items-baseline justify-center gap-x-[0.28em] whitespace-nowrap text-[clamp(1.15rem,3.2vw,2.85rem)]">
          <span className="text-fg" aria-hidden>
            “
          </span>
          {WORDS.map((word, i) => (
            <MissionWord
              key={`${word}-${i}`}
              word={word}
              index={i}
              total={WORDS.length}
              progress={scrollYProgress}
            />
          ))}
          <span className="text-fg" aria-hidden>
            ”
          </span>
        </h2>
      </div>
    </section>
  );
}

function MissionWord({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const start = index / total;
  const end = Math.min((index + 0.85) / total, 1);
  const color = useTransform(
    progress,
    [start, end],
    ["#e4e0ea", "#1c1c1f"],
  );
  const y = useTransform(progress, [start, end], [18, 0]);
  const opacity = useTransform(progress, [start, end], [0.45, 1]);

  return (
    <motion.span
      style={{ color, y, opacity }}
      className="inline-block shrink-0 whitespace-nowrap"
    >
      {word}
    </motion.span>
  );
}
