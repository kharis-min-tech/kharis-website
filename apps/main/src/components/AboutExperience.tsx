"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { KharisGreekWords } from "@/components/KharisGreekWords";
import { FaithSvgBackdrop } from "@/components/FaithSvgBackdrop";
import { isAboutChapterId, type AboutChapterId } from "@/components/AboutChapters";
import { AboutStoryCards } from "@/components/AboutStoryCards";
import { ABOUT } from "@/lib/about-content";

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
            src="/images/about-hero-bench-3200.jpg"
            alt=""
            fill
            priority
            quality={95}
            className="about-hero__img"
            sizes="(max-width: 759px) 108vh, 100vw"
          />
          <div className="about-hero__veil" />
        </div>
        <div className="about-hero__copy">
          <p className="about-hero__eyebrow">Kharis Ministries</p>
          <h1 className="about-hero__brand">kharis</h1>
          <p className="about-hero__tag">{ABOUT.tagline}</p>
        </div>
      </header>

      <section className="about-ety" aria-label="What Kharis means">
        <KharisGreekWords />
        <Reveal delay={0.15}>
          <p className="about-ety__blurb">{ABOUT.aboutBlurb}</p>
        </Reveal>
      </section>

      <AboutStoryCards initialId={chapterId} />

      <section id="faith" className="about-faith-band">
        <FaithSvgBackdrop />
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
                    onClick={() => setOpenFaith(open ? null : i)}
                  >
                    <span className="about-faith__num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="about-faith__title">{item.title}</span>
                    <span className="about-faith__icon" aria-hidden>
                      {open ? "−" : "+"}
                    </span>
                  </button>
                  {open && <p className="about-faith__a">{item.body}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
