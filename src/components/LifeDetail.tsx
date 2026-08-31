import Image from "next/image";
import Link from "next/link";
import { Sparkles, Users, Heart } from "lucide-react";
import { Icon } from "@/components/Icon";
import { LifeDeptList } from "@/components/LifeDeptGrid";
import { LifeIcon } from "@/components/LifeIcon";
import { Reveal, RevealItem, RevealStagger } from "@/components/Reveal";
import {
  LIFE_CATEGORIES,
  lifeBySlug,
  type LifeSlug,
} from "@/lib/life-content";

const KIDS_GROUPS = [
  {
    title: "Kinder",
    ages: "3–6 years",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80",
    color: "#fff3d6",
  },
  {
    title: "Super",
    ages: "7–11 years",
    icon: Users,
    image: "https://images.unsplash.com/photo-1587654780291-39fd940911f8?auto=format&fit=crop&w=900&q=80",
    color: "#f7eef4",
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

export function LifeDetail({ slug }: { slug: LifeSlug }) {
  const page = lifeBySlug(slug);
  if (!page) return null;

  const next = page.next ? lifeBySlug(page.next) : undefined;
  const kids = slug === "children";
  const depts = slug === "departments";

  if (kids) {
    return (
      <div className="life-page life-page--detail life-page--kids">
        <div className="life-wrap">
          <header className="life-kids-hero">
            <div className="life-kids-hero__gallery" aria-hidden>
              <span
                className="life-kids-hero__shot life-kids-hero__shot--a"
                style={{ backgroundImage: "url(/images/young-adults.jpg)" }}
              />
              <span
                className="life-kids-hero__shot life-kids-hero__shot--b"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80)",
                }}
              />
              <span
                className="life-kids-hero__shot life-kids-hero__shot--c"
                style={{ backgroundImage: "url(/images/branch-slide-1.jpg)" }}
              />
            </div>
            <div className="life-kids-hero__veil" />
            <Reveal variant="blur" className="life-kids-hero__copy">
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

          <section className="life-kids-groups" aria-label="Age groups">
            <Reveal variant="up" className="life-kids-groups__intro">
              <h2>Three groups, one big family</h2>
              <p>
                Fun, vibrant, and full of life — each age group meets children
                where they are with worship, teaching, and friendship.
              </p>
            </Reveal>

            <RevealStagger className="life-kids-groups__grid" stagger={0.08}>
              {page.sections.map((section, i) => {
                const meta = KIDS_GROUPS[i];
                const IconComp = meta?.icon ?? Sparkles;
                return (
                  <RevealItem key={section.title} variant="up" className="life-kids-group">
                    <div className="life-kids-group__media">
                      {meta ? (
                        <Image
                          src={meta.image}
                          alt=""
                          fill
                          unoptimized={meta.image.startsWith("/images/")}
                          sizes="(max-width: 700px) 100vw, 33vw"
                          className="object-cover"
                        />
                      ) : null}
                      <span className="life-kids-group__ages">{meta?.ages}</span>
                    </div>
                    <div
                      className="life-kids-group__body"
                      style={{ background: meta?.color }}
                    >
                      <IconComp className="life-kids-group__ico" aria-hidden />
                      <h3>{section.title}</h3>
                      <p>{section.body}</p>
                    </div>
                  </RevealItem>
                );
              })}
            </RevealStagger>
          </section>

          <section className="life-kids-video" aria-label="Watch with us">
            <Reveal variant="up" className="life-kids-video__inner">
              <div className="life-kids-video__copy">
                <p className="life-hero__eyebrow">See the vibe</p>
                <h2>Worship that&apos;s alive</h2>
                <p>
                  Our children learn the Word with energy and joy — the same
                  fire you feel in the main hall, made for young hearts.
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
              <RevealItem
                key={section.title}
                variant="up"
                className="life-detail-block"
              >
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

          {depts ? (
            <Reveal variant="up" className="life-detail-depts">
              <h2 className="life-dept-list__title">Teams you can join</h2>
              <LifeDeptList />
            </Reveal>
          ) : null}

          {page.contact ? (
            <p className="life-detail-contact">
              Contact{" "}
              <a href={`mailto:${page.contact}`}>{page.contact}</a>
            </p>
          ) : null}

          <Reveal className="life-detail-end">
            <Link href={page.cta.href} className="life-cta">
              {page.cta.label}
              <Icon name="arrow" className="h-3.5 w-3.5" />
            </Link>
            {next ? (
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
            {LIFE_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.slug === "children" ? cat.href : `/life?open=${cat.slug}`}
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
