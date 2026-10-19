"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { Sparkles, Users, Heart, Play, X } from "lucide-react";
import { Icon } from "@/components/Icon";
import { LifeIcon } from "@/components/LifeIcon";
import { DEPARTMENT_VIDEOS } from "@/data/department-videos";
import { Reveal, RevealItem, RevealStagger } from "@/components/Reveal";
import {
  LIFE_CATEGORIES,
  LIFE_DEPARTMENTS,
  LIFE_DEPARTMENTS_URL,
  LIFE_VISIBLE_SLUGS,
  lifeBySlug,
  type LifeSlug,
} from "@/lib/life-content";

const KIDS_GROUPS = [
  {
    title: "Kinder",
    ages: "3–6 years",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=85",
    color: "#fff3d6",
  },
  {
    title: "Super",
    ages: "7–11 years",
    icon: Users,
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=85",
    color: "#f2eef7",
  },
  {
    title: "Transition",
    ages: "12–16 years",
    icon: Heart,
    image: "/images/young-adults.jpg",
    color: "#eef6ff",
  },
] as const;

const KIDS_VIDEO_ID = "iXo1fg_PRLM";

const DEPT_BANDS = [
  {
    title: "Evangelism",
    body: "Share the good news, welcome conversations, and help people discover a home in the church.",
    image: "/images/about-mission-outreach-3200.jpg",
  },
  {
    title: "Music",
    body: "Use your musical gifts to lead the church in worship and praise.",
    image: "/images/department-music.jpg",
  },
  {
    title: "EasyWorship",
    body: "Prepare lyrics and visuals that help everyone follow and engage in worship.",
    image: "/images/department-easyworship.jpg",
  },
  {
    title: "Sound Department",
    body: "Mix and manage live sound so every voice and instrument can be heard clearly.",
    image: "/images/department-sound.jpg",
  },
  {
    title: "Welcome Team",
    body: "Help people feel seen and at home from the moment they arrive.",
    image: "/images/love-greeting.jpg",
  },
] as const;

const DEPT_PREVIEW_SOURCES = {
  Evangelism: DEPARTMENT_VIDEOS.find((video) => video.title === "Evangelism")!.src,
  Music: DEPARTMENT_VIDEOS.find((video) => video.title === "Music")!.src,
  EasyWorship: DEPARTMENT_VIDEOS.find((video) => video.title === "Tech Team")!.src,
  "Sound Department": DEPARTMENT_VIDEOS.find((video) => video.title === "Sound")!.src,
  "Welcome Team": DEPARTMENT_VIDEOS.find((video) => video.title === "Hospitality")!.src,
} satisfies Record<(typeof DEPT_BANDS)[number]["title"], string>;

function DepartmentPreviewButton({ title, src }: { title: string; src: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleId = `department-preview-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  const openPreview = () => {
    dialogRef.current?.showModal();
    void videoRef.current?.play().catch(() => {});
  };

  const closePreview = () => dialogRef.current?.close();

  const resetPreview = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

  return (
    <>
      <button className="life-dept-band__preview" type="button" onClick={openPreview}>
        <Play aria-hidden="true" fill="currentColor" />
        Watch a preview
      </button>
      <dialog
        className="life-dept-preview"
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={resetPreview}
        onClick={(event) => {
          if (event.target === event.currentTarget) closePreview();
        }}
      >
        <div className="life-dept-preview__panel">
          <button
            className="life-dept-preview__close"
            type="button"
            aria-label="Close preview"
            onClick={closePreview}
          >
            <X aria-hidden="true" />
          </button>
          <h2 id={titleId}>{title} preview</h2>
          <video ref={videoRef} controls autoPlay playsInline preload="none">
            <source src={src} type="video/mp4" />
          </video>
        </div>
      </dialog>
    </>
  );
}

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

export function LifeDetail({ slug }: { slug: LifeSlug }) {
  const page = lifeBySlug(slug);
  if (!page) return null;

  const next = page.next ? lifeBySlug(page.next) : undefined;
  const kids = slug === "children";
  const depts = slug === "departments";
  const navCats = LIFE_CATEGORIES.filter((c) => LIFE_VISIBLE_SLUGS.has(c.slug));

  if (kids) {
    return (
      <div className="life-page life-page--detail life-page--kids">
        <div className="life-wrap life-wrap--kids">
          <header className="life-kids-hero life-kids-hero--v2">
            <div className="life-kids-hero__blend" aria-hidden>
              {KIDS_GROUPS.map((group, i) => (
                <span
                  key={group.title}
                  className={`life-kids-hero__bleed life-kids-hero__bleed--${String.fromCharCode(97 + i)}`}
                  style={{ backgroundImage: `url(${group.image})` }}
                />
              ))}
            </div>
            <div className="life-kids-hero__veil" />
            <Reveal variant="blur" className="life-kids-hero__copy life-kids-hero__copy--v2">
              <Link href="/life" className="life-crumb">
                Kharis Life
              </Link>
              <p className="life-hero__eyebrow">{page.badge}</p>
              <h1>
                <LifeIcon name={page.icon} className="life-detail-hero__ico" />
                {page.title}
              </h1>
              <p className="life-kids-hero__lead">{page.intro}</p>
            </Reveal>
          </header>

          <section className="life-kids-showcase" aria-label="Age groups">
            <Reveal variant="up" className="life-kids-showcase__intro">
              <h2>Three groups, one big family</h2>
              <p>
                Fun, vibrant, and full of life. Each age group meets children where they are with
                worship, teaching, and friendship.
              </p>
            </Reveal>

            <div className="life-kids-showcase__list">
              {page.sections.map((section, i) => {
                const meta = KIDS_GROUPS[i];
                const IconComp = meta?.icon ?? Sparkles;
                const flip = i % 2 === 1;
                return (
                  <Reveal
                    key={section.title}
                    variant="up"
                    className={`life-kids-row${flip ? " life-kids-row--flip" : ""}`}
                  >
                    <div className="life-kids-row__visual">
                      {meta ? (
                        <div
                          className="life-kids-row__bleed"
                          style={{ backgroundImage: `url(${meta.image})` }}
                          role="img"
                          aria-label={section.title}
                        />
                      ) : null}
                      <span className="life-kids-row__ages">{meta?.ages}</span>
                    </div>
                    <div className="life-kids-row__copy">
                      <IconComp className="life-kids-row__ico" aria-hidden />
                      <h3>{section.title}</h3>
                      <p>{section.body}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>

          <section className="life-kids-video life-kids-video--v2" aria-label="Watch with us">
            <Reveal variant="up" className="life-kids-video__card">
              <div className="life-kids-video__copy">
                <p className="life-hero__eyebrow">Watch with us</p>
                <h2>Worship that&apos;s alive</h2>
                <p>
                  Our children learn the Word with energy and joy. The same fire you feel in the
                  main hall, made for young hearts.
                </p>
              </div>
              <div className="life-kids-video__frame">
                <iframe
                  src={`https://www.youtube.com/embed/${KIDS_VIDEO_ID}?rel=0`}
                  title="Kharis Church message"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Reveal>
          </section>

          <Reveal className="life-detail-end life-detail-end--kids">
            <Link href={page.cta.href} className="life-cta">
              {page.cta.label}
              <Icon name="arrow" className="h-3.5 w-3.5" />
            </Link>
            <Link href="/life" className="life-cta life-cta--quiet">
              Back to Kharis Life
            </Link>
          </Reveal>
        </div>
      </div>
    );
  }

  if (depts) {
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
            <article
              className="life-dept-band"
              key={band.title}
              style={{ zIndex: index + 1 }}
            >
              <div className="life-dept-band__media" aria-hidden="true">
                <Image
                  className="life-dept-band__poster"
                  src={band.image}
                  alt=""
                  fill
                  sizes="100vw"
                />
              </div>
              <div className="life-dept-band__copy">
                <h2>{band.title}</h2>
                <p>{band.body}</p>
                <div className="life-dept-band__actions">
                  <DepartmentPreviewButton
                    title={band.title}
                    src={DEPT_PREVIEW_SOURCES[band.title]}
                  />
                  <Link href="/locations" className="life-dept-band__cta">
                    Join {band.title}
                    <Icon name="arrow" className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="life-dept-directory" aria-labelledby="life-dept-directory-title">
          <div className="life-dept-directory__intro">
            <p>More ways to serve</p>
            <h2 id="life-dept-directory-title">More teams to explore</h2>
            <span>There’s a place for every gift and every willing heart.</span>
          </div>
          <ul className="life-dept-directory__list">
            {LIFE_DEPARTMENTS.map((department) => (
              <li key={department}>{department}</li>
            ))}
          </ul>
          <Link
            className="life-dept-directory__link"
            href={LIFE_DEPARTMENTS_URL}
            target="_blank"
            rel="noreferrer"
          >
            Explore all departments
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </section>

        <div className="life-dept-branch-cta">
          <div>
            <h3>Still not sure where you fit?</h3>
            <p>Take the quiz and find the team that fits you at your local branch.</p>
          </div>
          <a href="https://discover.khar.is/" className="life-dept-branch-cta__link">
            Take the quiz
            <Icon name="arrow" className="h-3.5 w-3.5" />
          </a>
        </div>

      </div>
    );
  }

  return (
    <div className="life-page life-page--detail">
      <div className="life-wrap">
        <header className="life-detail-hero">
          <div
            className="life-detail-hero__media"
            style={{ backgroundImage: `url(${page.image})` }}
          />
          <div className="life-detail-hero__veil" />
          <Reveal variant="blur" className="life-detail-hero__copy">
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

        <div className="life-detail-body">
          {page.quote ? (
            <Reveal variant="up" className="life-quote">
              <blockquote>
                <p>{page.quote.text}</p>
                <cite>{page.quote.source}</cite>
              </blockquote>
            </Reveal>
          ) : null}

          <RevealStagger className="life-detail-sections" stagger={0.07}>
            {page.sections.map((section) => (
              <RevealItem key={section.title} variant="up" className="life-detail-block">
                <h2>{section.title}</h2>
                <p>{section.body}</p>
                {section.items ? (
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </RevealItem>
            ))}
          </RevealStagger>

          {page.contact ? (
            <p className="life-detail-contact">
              Contact <a href={`mailto:${page.contact}`}>{page.contact}</a>
            </p>
          ) : null}

          <Reveal className="life-detail-end">
            <a href={page.cta.href} className="life-cta">
              {page.cta.label}
              <Icon name="arrow" className="h-3.5 w-3.5" />
            </a>
            {next && LIFE_VISIBLE_SLUGS.has(next.slug) ? (
              <Link href={next.href} className="life-cta life-cta--quiet">
                Next: {next.shortTitle}
              </Link>
            ) : (
              <Link href="/life" className="life-cta life-cta--quiet">
                Back to Kharis Life
              </Link>
            )}
          </Reveal>

          <nav className="life-detail-nav" aria-label="Kharis Life">
            {navCats.map((cat) => (
              <Link
                key={cat.slug}
                href={
                  cat.slug === "children" || cat.slug === "departments"
                    ? cat.slug === "departments"
                      ? "/life/departments"
                      : cat.href
                    : `/life?open=${cat.slug}`
                }
                className={cat.slug === slug ? "is-on" : undefined}
              >
                {cat.shortTitle}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
