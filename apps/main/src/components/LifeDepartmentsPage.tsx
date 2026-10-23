"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { LifeIcon } from "@/components/LifeIcon";
import { Reveal } from "@/components/Reveal";
import { LIFE_DEPARTMENTS_URL, lifeBySlug } from "@/lib/life-content";
import { DEPARTMENT_PAGES } from "@/data/department-pages";

const DEPT_BANDS = DEPARTMENT_PAGES;

const WHY_WE_SERVE = [
  {
    number: "01",
    title: "Get busy serving",
    body: "Jesus came to serve. We serve because we have been served. Get busy serving.",
    verse: "Matthew 20:28",
  },
  {
    number: "02",
    title: "Find your place",
    body: "Every gift belongs in the body. Take your place and become family.",
    verse: "1 Corinthians 12:12–27",
  },
  {
    number: "03",
    title: "Work as unto the Lord",
    body: "Work with all your heart, as working for the Lord. We are passionate about God and His word.",
    verse: "Colossians 3:23–24",
  },
] as const;

export function LifeDepartmentsPage() {
  const page = lifeBySlug("departments");
  if (!page) return null;

  return (
    <div className="life-page life-page--detail life-page--depts">
      <header className="life-dept-hero">
        <div
          className="life-dept-hero__media"
          style={{ backgroundImage: "url(/images/about-vision-team-2048.jpg)" }}
          aria-hidden
        />
        <div className="life-dept-hero__veil" aria-hidden />
        <Reveal variant="blur" className="life-dept-hero__copy">
          <Link href="/life" className="life-crumb">
            Kharis Life
          </Link>
          <p className="life-hero__eyebrow">{page.badge}</p>
          <h1>
            <LifeIcon name={page.icon} className="life-detail-hero__ico" />
            {page.title}
          </h1>
          <p>{page.intro}</p>
        </Reveal>
      </header>

      <section className="life-dept-why" aria-labelledby="life-dept-why-title">
        <header className="life-dept-why__header">
          <p>THE HEART BEHIND IT</p>
          <h2 id="life-dept-why-title">Why we serve</h2>
          <span>Serving is worship. Respond to grace. Take your place.</span>
        </header>
        <div className="life-dept-why__grid">
          {WHY_WE_SERVE.map((item, i) => (
            <article
              className={`life-dept-why__card${i === 1 ? " life-dept-why__card--purple" : ""}`}
              key={item.number}
            >
              <span className="life-dept-why__number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <span className="life-dept-why__verse">{item.verse}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="life-dept-bands" aria-label="Ways to serve">
        {DEPT_BANDS.map((band, index) => (
          <article className="life-dept-band" key={band.title} style={{ zIndex: index + 1 }}>
            <div className="life-dept-band__media" aria-hidden="true">
              <Image
                className="life-dept-band__poster"
                src={band.image}
                alt=""
                fill
                priority
                sizes="100vw"
              />
            </div>
            <div className="life-dept-band__copy">
              <h2>{band.title}</h2>
              <p>{band.body}</p>
              <Link
                href={`/departments/${band.slug}`}
                aria-label={`Join ${band.title}`}
                className="life-dept-band__cta"
              >
                Join {band.title}
                <Icon name="arrow" className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="life-dept-branch-cta" aria-labelledby="life-dept-branch-cta-title">
        <div className="life-dept-branch-cta__intro">
          <div>
            <h3 id="life-dept-branch-cta-title">Still not sure where you fit?</h3>
            <p>Take the quiz and find the team that fits you at your local branch.</p>
          </div>
          <Link href={LIFE_DEPARTMENTS_URL} className="life-dept-branch-cta__link">
            Take the quiz
            <Icon name="arrow" className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
