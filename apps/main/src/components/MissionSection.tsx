"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Fragment, useRef, useSyncExternalStore } from "react";
import { Reveal } from "@/components/Reveal";
import { getSiteTheme, subscribeSiteTheme } from "@/lib/theme";

const WORDS = ["Establishing", "believers", "and", "strengthening", "churches."];

export function MissionSection() {
  const ref = useRef<HTMLElement>(null);
  const theme = useSyncExternalStore(subscribeSiteTheme, getSiteTheme, () => "light" as const);
  const isDark = theme === "dark";
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
          <p className="eyebrow">Our Mission</p>
        </Reveal>

        <h2
          aria-label={WORDS.join(" ")}
          className="section-title mission-section-title mx-auto max-w-none text-center text-[clamp(1.15rem,3.2vw,2.85rem)]"
        >
          {WORDS.map((word, i) => (
            <Fragment key={`${word}-${i}`}>
              <MissionWord
                word={word}
                index={i}
                total={WORDS.length}
                progress={scrollYProgress}
                isDark={isDark}
                quoteBefore={i === 0 ? "\u201C" : undefined}
                quoteAfter={i === WORDS.length - 1 ? "\u201D" : undefined}
              />
              {i < WORDS.length - 1 ? " " : null}
            </Fragment>
          ))}
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
  isDark,
  quoteBefore,
  quoteAfter,
}: {
  word: string;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  isDark: boolean;
  quoteBefore?: string;
  quoteAfter?: string;
}) {
  const start = index / total;
  const end = Math.min((index + 0.85) / total, 1);
  const color = useTransform(
    progress,
    [start, end],
    isDark ? ["#6e5a78", "#f1eef5"] : ["#e4e0ea", "#1c1c1f"],
  );
  const y = useTransform(progress, [start, end], [18, 0]);
  const opacity = useTransform(progress, [start, end], [0.45, 1]);

  return (
    <motion.span
      aria-hidden
      style={{ color, y, opacity }}
      className="inline-block whitespace-nowrap"
    >
      {quoteBefore ? <span aria-hidden>{quoteBefore}</span> : null}
      {word}
      {quoteAfter ? <span aria-hidden>{quoteAfter}</span> : null}
    </motion.span>
  );
}
