"use client";

import Image from "next/image";
import { useId } from "react";
import { Reveal } from "@/components/Reveal";
import { ABOUT } from "@/lib/about-content";
import "./about-faith.css";

/** Placeholder photos — swap these paths for the final images. */
const FAITH_PHOTO = "/images/biblical-open-bible.jpg";
const BELIEFS_PHOTO = "/images/about-faith-prayer-2048.jpg";

/** Statement of Faith: header band, then a full-bleed split of photo and every belief in full. */
export function AboutFaith() {
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
            </div>
          </header>
        </Reveal>
      </div>

      <div className="about-sof__split">
        <div className="about-sof__photo">
          <Image
            src={BELIEFS_PHOTO}
            alt="Kharis church family praying together at the front of a service"
            fill
            quality={95}
            sizes="(max-width: 899px) 100vw, 42vw"
            className="about-sof__photo-img"
          />
        </div>

        <ol className="about-sof__list" role="list">
          {ABOUT.faith.map((item, i) => (
            <li key={item.title} className="about-sof__belief">
              <span className="about-sof__num" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="about-sof__name">{item.title}</h3>
              <p className="about-sof__text">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
