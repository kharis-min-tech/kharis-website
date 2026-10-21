"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Users, Heart } from "lucide-react";
import { Icon } from "@/components/Icon";
import { LifeDeptList } from "@/components/LifeDeptGrid";
import { LifeIcon } from "@/components/LifeIcon";
import { Reveal, RevealItem, RevealStagger } from "@/components/Reveal";
import { LIFE_CATEGORIES, LIFE_VISIBLE_SLUGS, lifeBySlug, type LifeSlug } from "@/lib/life-content";

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
    image: "https://images.kharis.org/site-images/main/234c625e119f9e2a/young-adults.jpg",
    color: "#eef6ff",
  },
] as const;

const KIDS_VIDEO_ID = "iXo1fg_PRLM";

const DEPT_BANDS = [
  {
    title: "Worship & Music",
    body: "Instrumentalists, singers and sound teams who lead the house in praise as an act of service to God.",
    image: "https://images.kharis.org/site-images/main/9b547f88f3b4d297/worship.jpg",
  },
  {
    title: "Welcome & Care",
    body: "Ushers, host team, hospitality and welfare: the Kharis welcome from the door to the seat, and care for those in need.",
    image: "https://images.kharis.org/site-images/main/ca1bcf57dbf80629/community.jpg",
  },
  {
    title: "Kids & Youth",
    body: "Teaching ages 3–16 with creativity and joy, and walking with young people as they grow in Christ.",
    image: "https://images.kharis.org/site-images/main/234c625e119f9e2a/young-adults.jpg",
  },
  {
    title: "Media & Production",
    body: "Camera, graphics, social and stage production that carry the Word beyond the room.",
    image: "https://images.kharis.org/site-images/main/ffbe5aca25d25b8c/pastor-stage.jpg",
  },
  {
    title: "Prayer & Evangelism",
    body: "Intercession, follow-up and outreach, preaching Christ and establishing new people in the family.",
    image: "https://images.kharis.org/site-images/main/8440a4a63e4ae020/serve-with-us.jpg",
  },
] as const;

export function LifeDetail({ slug }: { slug: LifeSlug }) {
  const [activeDeptSlide, setActiveDeptSlide] = useState(0);
  const depts = slug === "departments";

  useEffect(() => {
    if (!depts || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveDeptSlide((prev) => (prev + 1) % DEPT_BANDS.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [depts]);

  const page = lifeBySlug(slug);
  if (!page) return null;

  const next = page.next ? lifeBySlug(page.next) : undefined;
  const kids = slug === "children";
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
            style={{ backgroundImage: `url(${page.image})` }}
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

        <section className="life-dept-bands" aria-label="Ways to serve">
          {DEPT_BANDS.map((band, i) => (
            <Reveal
              key={band.title}
              variant="up"
              className={`life-dept-band${i % 2 === 1 ? " life-dept-band--flip" : ""}`}
            >
              <div
                className="life-dept-band__media"
                style={{ backgroundImage: `url(${band.image})` }}
                role="img"
                aria-label={band.title}
              />
              <div className="life-dept-band__copy">
                <h2>{band.title}</h2>
                <p>{band.body}</p>
              </div>
            </Reveal>
          ))}
        </section>

        <div className="life-wrap">
          <Reveal variant="up" className="life-detail-depts life-detail-depts--wide">
            <h2 className="life-dept-list__title">Teams you can join</h2>
            <LifeDeptList />
          </Reveal>

          <Reveal
            variant="up"
            className="life-dept-discover relative overflow-hidden rounded-3xl border border-purple-500/25 p-8 sm:p-12 text-center text-white shadow-[0_24px_60px_rgba(40,20,80,0.22)]"
          >
            {/* Cross-fading department photos */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              {DEPT_BANDS.map((band, idx) => (
                <div
                  key={band.image}
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                    idx === activeDeptSlide ? "opacity-35 scale-105" : "opacity-0 scale-100"
                  }`}
                  style={{
                    backgroundImage: `url(${band.image})`,
                    transitionProperty: "opacity, transform",
                  }}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1d0b3b]/90 via-[#120826]/85 to-[#2b0f54]/90" />
            </div>

            <div className="relative z-10 mx-auto max-w-xl flex flex-col items-center">
              <p className="life-hero__eyebrow !text-[#ffaa55] mb-2">Department Discovery</p>
              <h2 className="!text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
                Not sure where your gifts fit best?
              </h2>
              <p className="!text-white/80 mt-3 mb-7 text-sm sm:text-base leading-relaxed">
                Take our 2-minute interactive Department Discovery Quiz to match your passions and
                strengths with the right Kharis ministry team.
              </p>
              <Link
                href="/quiz"
                className="life-cta !bg-[#fd7f20] hover:!bg-[#ff933f] !text-white !border-0 shadow-[0_12px_32px_rgba(253,127,32,0.38)]"
              >
                Start Department Quiz
                <Icon name="arrow" className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>

          <Reveal className="life-detail-end">
            <Link href="/locations" className="life-cta">
              Find a branch to serve
              <Icon name="arrow" className="h-3.5 w-3.5" />
            </Link>
            <Link href="/life" className="life-cta life-cta--quiet">
              Back to Kharis Life
            </Link>
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
