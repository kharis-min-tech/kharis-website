"use client";

import Image from "next/image";
import { useId, useState } from "react";
import {
  BookOpen,
  Cross,
  Crown,
  Flame,
  Gift,
  Minus,
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

/** Suggested references for each statement; confirm with the pastoral team before launch. */
const EXTRAS: Record<string, { icon: LucideIcon; verse: string }> = {
  "God the Father": { icon: Crown, verse: "Genesis 1:1 · Psalm 90:2" },
  "Jesus Christ": { icon: Cross, verse: "John 1:14 · 1 Corinthians 15:3–4" },
  "The Holy Spirit": { icon: Flame, verse: "John 16:8 · Acts 1:8" },
  "The Bible": { icon: BookOpen, verse: "2 Timothy 3:16" },
  Humanity: { icon: Users, verse: "Genesis 1:27 · Romans 3:23" },
  Salvation: { icon: Gift, verse: "Ephesians 2:8–9 · John 1:12" },
  "Eternal security": { icon: ShieldCheck, verse: "John 10:28–29" },
  "Life after death": { icon: Sunrise, verse: "John 5:28–29 · Hebrews 9:27" },
};

/** Statement of Faith: bordered cards that reveal each statement on hover, focus or tap. */
export function AboutFaith() {
  const [open, setOpen] = useState<number | null>(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

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

        <ul className="about-sof__grid">
          {ABOUT.faith.map((item, i) => {
            const extra = EXTRAS[item.title];
            const Icon = extra?.icon ?? BookOpen;
            const isOpen = open === i;
            const bodyId = `${uid}-faith-${i}`;
            const num = String(i + 1).padStart(2, "0");
            return (
              <li key={item.title} className={`about-sof__item${isOpen ? " is-open" : ""}`}>
                <button
                  type="button"
                  className="about-sof__toggle"
                  aria-expanded={isOpen}
                  aria-controls={bodyId}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="about-sof__top">
                    <span className="about-sof__num">{num}</span>
                    <span className="about-sof__more" aria-hidden>
                      {isOpen ? <Minus /> : <Plus />}
                    </span>
                  </span>
                  <span className="about-sof__icon" aria-hidden>
                    <Icon strokeWidth={1.75} />
                  </span>
                  <span className="about-sof__name">{item.title}</span>
                  <span className="about-sof__preview" aria-hidden>
                    {item.body}
                  </span>
                </button>
                <div id={bodyId} className="about-sof__body">
                  <div className="about-sof__body-inner">
                    <p className="about-sof__body-head" aria-hidden>
                      <span className="about-sof__num">{num}</span>
                      <span className="about-sof__name">{item.title}</span>
                    </p>
                    <p className="about-sof__text">{item.body}</p>
                    {extra ? <p className="about-sof__verse">{extra.verse}</p> : null}
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
