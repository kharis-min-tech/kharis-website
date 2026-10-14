"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import {
  BookOpen,
  Cross,
  Crown,
  Flame,
  Gift,
  Plus,
  ShieldCheck,
  Sunrise,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ABOUT } from "@/lib/about-content";
import "./about-faith.css";

/** Placeholder header photo — swap this path for the final image. */
const FAITH_PHOTO = "/images/biblical-open-bible.jpg";

const ICONS: Record<string, LucideIcon> = {
  "God the Father": Crown,
  "Jesus Christ": Cross,
  "The Holy Spirit": Flame,
  "The Bible": BookOpen,
  Humanity: Users,
  Salvation: Gift,
  "Eternal security": ShieldCheck,
  "Life after death": Sunrise,
};

/** Statement of Faith: compact title cards whose border grows to show the full statement. */
export function AboutFaith() {
  const [open, setOpen] = useState<number | null>(null);
  const [hinting, setHinting] = useState(false);
  const gridRef = useRef<HTMLUListElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || typeof IntersectionObserver === "undefined") return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        setHinting(true);
        timer = setTimeout(() => setHinting(false), 2200);
      },
      { threshold: 0.35 },
    );
    io.observe(grid);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    const onPointer = (e: PointerEvent) => {
      if (!gridRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <section id="faith" className="about-sof" aria-labelledby={`${uid}-title`}>
      <div className="about-sof__inner">
        <Reveal>
          <header className="about-sof__head">
            <Image src={FAITH_PHOTO} alt="" fill sizes="(max-width: 1279px) 100vw, 1216px" className="about-sof__head-img" />
            <div className="about-sof__head-copy">
              <p className="about-sof__eyebrow">Believe</p>
              <h2 id={`${uid}-title`} className="about-sof__title">
                Our Statement of Faith
              </h2>
              <p className="about-sof__lead">Hover or tap a card to read the full statement.</p>
            </div>
          </header>
        </Reveal>

        <ul ref={gridRef} className={`about-sof__grid${hinting ? " is-hinting" : ""}`}>
          {ABOUT.faith.map((item, i) => {
            const Icon = ICONS[item.title] ?? BookOpen;
            const isOpen = open === i;
            const bodyId = `${uid}-faith-${i}`;
            return (
              <li
                key={item.title}
                className={`about-sof__item${isOpen ? " is-open" : ""}`}
                style={{ "--i": i } as CSSProperties}
              >
                <button
                  type="button"
                  className="about-sof__toggle"
                  aria-expanded={isOpen}
                  aria-controls={bodyId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  onFocus={(e) => {
                    if (e.currentTarget.matches(":focus-visible")) setOpen(i);
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) {
                      setOpen((cur) => (cur === i ? null : cur));
                    }
                  }}
                >
                  <span className="about-sof__top">
                    <span className="about-sof__num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="about-sof__more" aria-hidden>
                      <Plus />
                    </span>
                  </span>
                  <span className="about-sof__heading">
                    <span className="about-sof__icon" aria-hidden>
                      <Icon strokeWidth={1.75} />
                    </span>
                    <span className="about-sof__name">{item.title}</span>
                  </span>
                  <span className="about-sof__cue" aria-hidden>
                    <span className="about-sof__cue-inner">
                      <span className="about-sof__cue-hover">Read statement</span>
                      <span className="about-sof__cue-touch">Tap to read</span>
                    </span>
                  </span>
                </button>
                <div id={bodyId} className="about-sof__body">
                  <div className="about-sof__body-inner">
                    <p className="about-sof__text">{item.body}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
