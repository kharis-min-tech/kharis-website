"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  createRef,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
  type CSSProperties,
} from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import "./faith-stack.css";

type Statement = { title: string; body: string };
const STACK_TOP = 104;
const STACK_STEP = 8;

function FaithCard({
  statement,
  index,
  itemRef,
  nextRef,
  animate,
}: {
  statement: Statement;
  index: number;
  itemRef: RefObject<HTMLLIElement | null>;
  nextRef?: RefObject<HTMLLIElement | null>;
  animate: boolean;
}) {
  const { scrollYProgress } = useScroll({
    target: nextRef ?? itemRef,
    offset: ["start 90%", "start 25%"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const shade = useTransform(scrollYProgress, [0, 1], [0, 0.2]);
  const recede = animate && Boolean(nextRef);

  return (
    <li
      ref={itemRef}
      className="faith-stack__slot"
      style={{ "--faith-card-top": `${STACK_TOP + index * STACK_STEP}px` } as CSSProperties}
    >
      <motion.article
        className="faith-stack__card"
        aria-labelledby={`faith-title-${index}`}
        style={{ scale: recede ? scale : 1 }}
      >
        <p className="faith-stack__number" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 id={`faith-title-${index}`}>{statement.title}</h3>
        <p className="faith-stack__body">{statement.body}</p>
        <motion.div
          className="faith-stack__shade"
          style={{ opacity: recede ? shade : 0 }}
          aria-hidden="true"
        />
      </motion.article>
    </li>
  );
}

export function FaithStack({ statements }: { statements: readonly Statement[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const refs = useMemo(() => statements.map(() => createRef<HTMLLIElement>()), [statements]);
  const [fitsViewport, setFitsViewport] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const animate = fitsViewport && !reduceMotion;

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const cards = [...list.querySelectorAll<HTMLElement>(".faith-stack__card")];
    const measure = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const minimum = Math.min(25 * rem, Math.max(17 * rem, innerHeight * 0.36));
      setFitsViewport(
        cards.every(
          (card, index) =>
            Math.max(card.offsetHeight, minimum) + STACK_TOP + index * STACK_STEP + 24 <=
            innerHeight,
        ),
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    cards.forEach((card) => observer.observe(card));
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [statements]);

  return (
    <section
      id="faith"
      className="about-faith-band faith-stack"
      aria-labelledby="faith-title"
      data-stack={animate ? "on" : "off"}
    >
      <div className="faith-stack__inner">
        <header className="faith-stack__intro">
          <p className="eyebrow">Believe</p>
          <h2 id="faith-title" className="about-section__title">
            Our Statement of Faith
          </h2>
        </header>
        <ol ref={listRef} className="faith-stack__cards" role="list">
          {statements.map((statement, index) => (
            <FaithCard
              key={statement.title}
              statement={statement}
              index={index}
              itemRef={refs[index]!}
              nextRef={refs[index + 1]}
              animate={animate}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
