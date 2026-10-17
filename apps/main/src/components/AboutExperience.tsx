"use client";

import Image from "@/components/SiteImage";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaithStack } from "@/components/FaithStack";
import { Reveal, RevealItem, RevealStagger } from "@/components/Reveal";
import { AboutChapters, isAboutChapterId, type AboutChapterId } from "@/components/AboutChapters";
import { ABOUT } from "@/lib/about-content";
import "./about.css";

/** About hub: Mission, Vision, and Leadership on one page. */
export function AboutExperience() {
  const search = useSearchParams();
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

      <FaithStack statements={ABOUT.faith} />
    </div>
  );
}
