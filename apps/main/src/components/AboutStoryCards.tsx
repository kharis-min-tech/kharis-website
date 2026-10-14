"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  BookOpen,
  Cross,
  Flame,
  Gift,
  Globe,
  HeartHandshake,
  House,
  Plane,
  Radio,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import type { AboutChapterId } from "@/components/AboutChapters";
import { ABOUT } from "@/lib/about-content";
import "./about-cards.css";

/** Placeholder photos — swap these paths to change the card backgrounds. */
const MISSION_PHOTO = "/images/about-mission-outreach.jpg";
const VISION_PHOTO = "/images/about-vision-team.jpg";
/** Leadership photos used here only; other pages keep the shared ABOUT.leadership images. */
const LEADER_PHOTOS: Record<string, string> = {
  david: "/images/about-leadership-david.jpg",
};

const MISSION = {
  eyebrow: "Our Mission",
  title: "Influence society with the reality of God’s love.",
  body: "We are a friendly, caring and exciting family church, showing the reliability of His principles by ministering to the spiritual, physical, social and emotional needs of people who want to experience God in a living way.",
};

const PILLARS = {
  eyebrow: "How we do it",
  title: "Four ways we fulfil our mission.",
  items: [
    {
      title: "Discipleship",
      body: "Making disciples is the heart of Christianity.",
      verse: "Matthew 28:19",
      icon: BookOpen,
    },
    {
      title: "Care",
      body: "Everyone deserves to be loved, cared for and supported.",
      verse: "Romans 12:9",
      icon: HeartHandshake,
    },
    {
      title: "Outreach",
      body: "Reaching others with the love Jesus showed us.",
      verse: "Mark 16:15",
      icon: Globe,
    },
    {
      title: "Leadership Development",
      body: "Raising Godly leaders to influence society for the Kingdom.",
      verse: "Proverbs 29:2",
      icon: Users,
    },
  ] satisfies Array<{ title: string; body: string; verse: string; icon: LucideIcon }>,
};

const VISION = {
  eyebrow: "Our Vision",
  title: `${ABOUT.vision.lead}.`,
  intro: "The Kharis we see:",
  points: [
    { text: "Christ-centred and disciple-making", icon: Cross },
    { text: "Full of life — large and spiritually deep", icon: Sparkles },
    { text: "Naturally supernatural, full of integrity", icon: Flame },
    { text: "Worship broadcast to the nations", icon: Radio },
    { text: "Ordinary people, extraordinary lives", icon: Gift },
    { text: "A family where the broken belong", icon: House },
    { text: "Strong, effective small groups", icon: Users },
    { text: "Missionaries sent around the world", icon: Plane },
  ] satisfies Array<{ text: string; icon: LucideIcon }>,
};

/**
 * Mouse drag + arrow keys for the card row, each settling on a card.
 * Touch and trackpads scroll natively.
 */
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let startX = 0;
    let startLeft = 0;
    let pressed = false;
    let moved = false;

    const stops = () => {
      const cards = [...el.children] as HTMLElement[];
      const first = cards[0]?.offsetLeft ?? 0;
      const max = el.scrollWidth - el.clientWidth;
      return cards.map((c) => Math.min(c.offsetLeft - first, max));
    };
    const settle = (dir: -1 | 0 | 1) => {
      const points = stops();
      const x = el.scrollLeft;
      let target = points.reduce((a, b) => (Math.abs(b - x) < Math.abs(a - x) ? b : a), 0);
      if (dir === 1) target = points.find((p) => p > x + 2) ?? points[points.length - 1]!;
      if (dir === -1) target = [...points].reverse().find((p) => p < x - 2) ?? 0;
      el.scrollTo({ left: target, behavior: "smooth" });
    };
    const key = (e: KeyboardEvent) => {
      if (e.target !== el || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
      e.preventDefault();
      settle(e.key === "ArrowRight" ? 1 : -1);
    };

    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      pressed = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const move = (e: PointerEvent) => {
      if (!pressed) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        el.classList.add("is-dragging");
        el.setPointerCapture(e.pointerId);
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const up = (e: PointerEvent) => {
      if (!pressed) return;
      pressed = false;
      if (moved) {
        el.classList.remove("is-dragging");
        if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
        const dx = e.clientX - startX;
        settle(Math.abs(dx) > 60 ? (dx < 0 ? 1 : -1) : 0);
      }
    };
    const click = (e: MouseEvent) => {
      if (!moved) return;
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("click", click, true);
    el.addEventListener("keydown", key);
    return () => {
      el.removeEventListener("keydown", key);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("click", click, true);
    };
  }, []);

  return ref;
}

/** About: original banner, a swipeable row of Apple-style cards, Vision, then leadership. */
export function AboutStoryCards({ initialId }: { initialId?: AboutChapterId | null }) {
  const trackRef = useDragScroll();

  useEffect(() => {
    if (!initialId) return;
    const el = document.getElementById(initialId);
    if (!el) return;
    window.requestAnimationFrame(() => {
      el.scrollIntoView({ block: "start" });
      const track = trackRef.current;
      if (track && track.contains(el)) {
        track.scrollTo({ left: el.offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft) });
      }
    });
  }, [initialId, trackRef]);

  return (
    <section className="about-cards" aria-label="Mission, vision and leadership">
      <header className="about-stage__banner">
        <div className="about-stage__banner-inner">
          <h2 className="about-stage__title">Who we are becoming</h2>
        </div>
      </header>

      <div className="about-cards__inner">
        <Reveal>
          <h3 className="about-cards__heading">
            Why we exist. <span>The mission and vision God has given Kharis.</span>
          </h3>
        </Reveal>
      </div>

      <Reveal>
        <div
          ref={trackRef}
          className="about-cards__track"
          tabIndex={0}
          role="region"
          aria-label="Our mission and how we fulfil it"
        >
          <article id="mission" className="about-card about-card--photo about-card--mission">
            <span className="about-card__media" aria-hidden>
              <Image
                src={MISSION_PHOTO}
                alt=""
                fill
                quality={95}
                draggable={false}
                className="about-card__img about-card__img--mission"
                sizes="(max-width: 899px) 86vw, 600px"
              />
            </span>
            <span className="about-card__veil about-card__veil--mission" aria-hidden />
            <p className="about-card__eyebrow">{MISSION.eyebrow}</p>
            <h4 className="about-card__title">{MISSION.title}</h4>
            <p className="about-card__body">{MISSION.body}</p>
          </article>

          <article className="about-card about-card--plain">
            <p className="about-card__eyebrow">{PILLARS.eyebrow}</p>
            <h4 className="about-card__title">{PILLARS.title}</h4>
            <ul className="about-card__pillars">
              {PILLARS.items.map(({ title, body, verse, icon: Icon }) => (
                <li key={title} className="about-card__pillar">
                  <span className="about-card__pillar-icon">
                    <Icon strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="about-card__pillar-text">
                    <strong>{title}</strong>
                    <span>{body}</span>
                    <em>{verse}</em>
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </Reveal>

      <div className="about-cards__wide">
        <Reveal>
          <article id="vision" className="about-card about-card--photo about-card--vision">
            <div className="about-card__vision-copy">
              <p className="about-card__eyebrow">{VISION.eyebrow}</p>
              <h4 className="about-card__title about-card__title--wide">{VISION.title}</h4>
              <p className="about-card__intro">{VISION.intro}</p>
              <ul className="about-card__points">
                {VISION.points.map(({ text, icon: Icon }) => (
                  <li key={text}>
                    <Icon className="about-card__point-icon" strokeWidth={1.9} aria-hidden />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="about-card__vision-photo">
              <Image
                src={VISION_PHOTO}
                alt="Kharis church family in yellow Saved by Grace t-shirts celebrating outside the church"
                fill
                quality={95}
                className="about-card__img about-card__img--vision"
                sizes="(max-width: 1279px) 100vw, 1216px"
              />
            </div>
          </article>
        </Reveal>
      </div>

      <AboutLeadership />
    </section>
  );
}

/** Leadership: the two founding pastors side by side, then their shared story. */
function AboutLeadership() {
  const { leadership } = ABOUT;

  return (
    <div id="leadership" className="about-lead2">
      <div className="about-lead2__inner">
        <Reveal>
          <p className="about-lead2__eyebrow">Our Leadership</p>
          <h3 className="about-cards__heading about-lead2__title">{leadership.title}</h3>
        </Reveal>

        <div className="about-lead2__grid">
          {leadership.pastors.map((pastor, i) => (
            <Reveal key={pastor.id} delay={i * 0.08}>
              <article className="about-lead2__card">
                <div className="about-lead2__photo">
                  <Image
                    src={LEADER_PHOTOS[pastor.id] ?? pastor.image}
                    alt={pastor.name}
                    fill
                    quality={95}
                    className={`about-lead2__img about-lead2__img--${pastor.id}`}
                    sizes="(max-width: 699px) 140vw, (max-width: 1099px) 70vw, 640px"
                  />
                </div>
                <div className="about-lead2__copy">
                  <p className="about-lead2__role">{pastor.role}</p>
                  <h4 className="about-lead2__name">{pastor.name}</h4>
                  <p className="about-lead2__focus">{pastor.focus}</p>
                  <p className="about-lead2__blurb">{pastor.blurb}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="about-lead2__story">
            <p className="about-lead2__kicker">Their story</p>
            <p className="about-lead2__story-body">{leadership.body}</p>
            <Link href="/life" className="btn-secondary about-lead2__cta">
              Explore Kharis Life
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
