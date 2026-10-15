"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Reveal, RevealItem, RevealStagger } from "@/components/Reveal";
import { AboutChapters, isAboutChapterId, type AboutChapterId } from "@/components/AboutChapters";
import { ABOUT } from "@/lib/about-content";
import "./about.css";

/** About hub: Mission, Vision, and Leadership on one page. */
export function AboutExperience() {
  const search = useSearchParams();
  const [openFaith, setOpenFaith] = useState<number | null>(0);
  const [chapterId, setChapterId] = useState<AboutChapterId | null>(null);

  useEffect(() => {
    const q = search.get("story") || search.get("chapter");
    const hash = typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";
    const id = isAboutChapterId(q) ? q : isAboutChapterId(hash) ? hash : null;
    if (id) setChapterId(id);
  }, [search]);

  return (
    <div className="about-page">
      <header className="about-hero">
        <div className="about-hero__media" aria-hidden>
          <Image
            src="https://images.kharis.org/site-images/main/e01fad6602636193/about-outreach-hero.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="about-hero__veil" />
        </div>
        <div className="about-hero__copy">
          <p className="about-hero__eyebrow">Kharis Ministries</p>
          <h1 className="about-hero__brand">Kharis</h1>
          <p className="about-hero__tag">Changing the world with a touch of His grace.</p>
        </div>
      </header>

      <section className="about-ety" aria-label="What Kharis means">
        <RevealStagger className="about-ety__grid" stagger={0.16} once={true} amount={0.25}>
          <RevealItem className="about-ety__card" distance={36}>
            <p className="about-ety__label">{ABOUT.brandWord}</p>
            <p className="about-ety__greek">{ABOUT.greek.word}</p>
            <p className="about-ety__meaning">{ABOUT.greek.meaning}</p>
          </RevealItem>
          <RevealItem className="about-ety__card" distance={36}>
            <p className="about-ety__label">{ABOUT.ministriesWord}</p>
            <p className="about-ety__greek">{ABOUT.ministriesGreek.word}</p>
            <p className="about-ety__meaning">{ABOUT.ministriesGreek.meaning}</p>
          </RevealItem>
        </RevealStagger>
        <Reveal className="about-ety__blurb-wrap" delay={0.15} once={true} distance={28}>
          <p className="about-ety__blurb">{ABOUT.aboutBlurb}</p>
        </Reveal>
      </section>

      <AboutChapters initialId={chapterId} />

      <section id="faith" className="about-faith-band">
        <div className="about-faith-band__inner">
          <Reveal>
            <p className="eyebrow">Believe</p>
            <h2 className="about-section__title">Our Statement of Faith</h2>
          </Reveal>
          <div className="about-faith">
            {ABOUT.faith.map((item, i) => {
              const open = openFaith === i;
              return (
                <div key={item.title} className={`about-faith__item${open ? " is-open" : ""}`}>
                  <button
                    type="button"
                    className="about-faith__q"
                    aria-expanded={open}
                    id={`faith-question-${i}`}
                    aria-controls={`faith-answer-${i}`}
                    onClick={() => setOpenFaith(open ? null : i)}
                  >
                    <span className="about-faith__num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="about-faith__title">{item.title}</span>
                    <span className="about-faith__icon" aria-hidden>
                      <span />
                    </span>
                  </button>
                  <div className="about-faith__answer-wrap" aria-hidden={!open} inert={!open}>
                    <div className="about-faith__answer-inner">
                      <p
                        className="about-faith__a"
                        id={`faith-answer-${i}`}
                        role="region"
                        aria-labelledby={`faith-question-${i}`}
                      >
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
