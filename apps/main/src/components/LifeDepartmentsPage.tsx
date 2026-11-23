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
    title: "Serve like Jesus",
    body: "Jesus said He came not to be served but to serve, and to give His life for many. We serve because He served us first, and our love for others is our response to His love for us.",
    verse: "Matthew 20:28",
  },
  {
    number: "02",
    title: "Every part matters",
    body: "The church is one body with many parts, and no part can say it doesn’t need another. Whatever you’re gifted at, you’re needed here, and when one of us hurts or rejoices, we all do.",
    verse: "1 Corinthians 12:12-27",
  },
  {
    number: "03",
    title: "Serve as unto the Lord",
    body: "Whatever you do, do it wholeheartedly, as if working for the Lord and not for people. No act of service is small, because it is ultimately offered to Christ, who promises a reward that lasts.",
    verse: "Colossians 3:23-24",
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
          style={{
            backgroundImage:
              "url(https://images.kharis.org/site-images/main/c7e0b460a01f93eb/about-vision-team-2048.jpg)",
          }}
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
          <span>
            Serving is one of the ways we worship. Everything we do for others, we do for Him.
          </span>
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
            </div>
          </article>
        ))}
      </section>

      <section className="life-dept-branch-cta" aria-labelledby="life-dept-branch-cta-title">
        <div className="life-dept-branch-cta__intro">
          <div>
            <h3 id="life-dept-branch-cta-title">
              Still exploring your talents? It takes a minute to find your fit.
            </h3>
            <p>Take the quiz and find the team that fits you.</p>
          </div>
          <Link
            href={LIFE_DEPARTMENTS_URL}
            data-no-smooth-nav
            className="life-dept-branch-cta__link"
          >
            Take the quiz
            <Icon name="arrow" className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
