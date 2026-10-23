/** Life page "Belong in the family": a pinned, scroll-scrubbed story through four ways to belong. */
"use client";

import {
  animate,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "@/components/SiteImage";
import { Icon } from "@/components/Icon";
import { setHeaderOverlay } from "@/lib/header-overlay";
import "./belong-story.css";

type StoryItem = {
  id: "baptism" | "departments" | "fasting" | "children";
  tag: string;
  title: string;
  description: string;
  href: string;
  image: string;
  /** object-position so the subject stays in view when the photo is cropped. */
  focus: string;
};

const ITEMS: StoryItem[] = [
  {
    id: "baptism",
    tag: "BELONG",
    title: "Baptism",
    description:
      "A public declaration that you identify with Jesus Christ's death, burial and resurrection, walking in newness of life.",
    href: "/life/baptism",
    image: "/images/become-a-believer.jpg",
    focus: "50% 35%",
  },
  {
    id: "departments",
    tag: "SERVE",
    title: "Departments",
    description:
      "Serving is part of our worship. From ushers to music to hospitality, every believer has a role in God's house.",
    href: "/life/departments",
    image: "/images/department-music.jpg",
    focus: "62% 30%",
  },
  {
    id: "fasting",
    tag: "FASTING",
    title: "Fasting",
    description:
      "We abstain from food to signal dependence on God, fasting joined with prayer, as a church family seeking His purpose.",
    href: "/life/fasting",
    image: "/images/life-fasting.jpg",
    focus: "38% 40%",
  },
  {
    id: "children",
    tag: "KIDS",
    title: "Children's department",
    description:
      "Fun, vibrant, and full of life. We partner with parents to help children discover who God is through Bible teaching, worship, and friendship.",
    href: "/life/children",
    image:
      "https://images.kharis.org/site-images/main/ca959585decb8ff4/hero/outreach-community.jpg",
    focus: "35% 60%",
  },
];

const COUNT = ITEMS.length;
/** Progress distance between two neighbouring frames. */
const STEP = 1 / (COUNT - 1);
const frameProgress = (index: number) => index * STEP;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Inertia on the scrubbed progress: a touch over-damped so content glides in and settles without bounce. */
const SCRUB_SPRING = { stiffness: 90, damping: 22, mass: 1 };
/** Eased glide for pill clicks and the scroll-end settle. */
const GLIDE_EASE = [0.65, 0, 0.35, 1] as const;
/** When scrolling stops between frames, glide to the nearest one after this pause. */
const SETTLE_DELAY_MS = 160;
/** Fixed site header height (h-[4.5rem]); the header stays clear until the section passes under it. */
const HEADER_HEIGHT_PX = 72;

function StoryImage({
  item,
  index,
  progress,
  reduce,
}: {
  item: StoryItem;
  index: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const centre = frameProgress(index);
  /* Later photos stack on top and fade in over the previous one; scrolling back fades them out. */
  const opacity = useTransform(
    progress,
    [centre - STEP * 0.7, centre - STEP * 0.3],
    index === 0 ? [1, 1] : [0, 1],
  );
  /* Slow push-in while a photo is on screen. */
  const scale = useTransform(progress, [centre - STEP, centre + STEP], reduce ? [1, 1] : [1.14, 1]);

  return (
    <motion.div className="belong-story__image" style={{ opacity, scale, zIndex: index + 1 }}>
      <Image
        src={item.image}
        alt=""
        fill
        priority={index === 0}
        loading="eager"
        quality={90}
        sizes="(max-width: 767px) 100vw, 66vw"
        className="object-cover"
        style={{ objectPosition: item.focus }}
      />
    </motion.div>
  );
}

function ActionLink({
  item,
  onLearnMore,
}: {
  item: StoryItem;
  onLearnMore: (id: "baptism" | "fasting") => void;
}) {
  const id = item.id;
  if (id === "baptism" || id === "fasting") {
    return (
      <button
        type="button"
        className="life-refresh__button belong-story__action"
        onClick={() => onLearnMore(id)}
      >
        LEARN MORE
        <Icon name="arrow" className="h-4 w-4" />
      </button>
    );
  }
  return (
    <Link href={item.href} className="life-refresh__button belong-story__action">
      LEARN MORE
      <Icon name="arrow" className="h-4 w-4" />
    </Link>
  );
}

function StoryText({
  item,
  index,
  progress,
  active,
  onLearnMore,
}: {
  item: StoryItem;
  index: number;
  progress: MotionValue<number>;
  active: boolean;
  onLearnMore: (id: "baptism" | "fasting") => void;
}) {
  const centre = frameProgress(index);
  const first = index === 0;
  const last = index === COUNT - 1;
  /* Fade/slide in just before its frame, out just after; a short gap keeps texts from overlapping. */
  const input = [
    centre - STEP * 0.55,
    centre - STEP * 0.25,
    centre + STEP * 0.25,
    centre + STEP * 0.55,
  ];
  const opacity = useTransform(progress, input, [first ? 1 : 0, 1, 1, last ? 1 : 0]);
  const y = useTransform(progress, input, [first ? 0 : 28, 0, 0, last ? 0 : -28]);

  return (
    <motion.article
      className="belong-story__item"
      style={{ opacity, y }}
      inert={!active}
      aria-hidden={!active}
    >
      <p className="belong-story__tag">{item.tag}</p>
      <h3>{item.title}</h3>
      <p className="belong-story__description">{item.description}</p>
      <ActionLink item={item} onLearnMore={onLearnMore} />
    </motion.article>
  );
}

export function BelongStory({ onLearnMore }: { onLearnMore: (id: "baptism" | "fasting") => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const glideRef = useRef<AnimationPlaybackControls | null>(null);
  const pillsRef = useRef<HTMLElement>(null);
  const reduce = Boolean(useReducedMotion());
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, SCRUB_SPRING);
  const progress = reduce ? scrollYProgress : smoothProgress;

  useMotionValueEvent(progress, "change", (value) => {
    const next = Math.round(clamp01(value) * (COUNT - 1));
    setActive((current) => (current === next ? current : next));
  });

  /* On phones the pill row swipes sideways; keep the active pill in view. */
  useEffect(() => {
    const row = pillsRef.current;
    const pill = row?.children[active] as HTMLElement | undefined;
    if (!row || !pill || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: pill.offsetLeft - 16, behavior: reduce ? "instant" : "smooth" });
  }, [active, reduce]);

  /** Page scroll position at which the timeline shows frame `index` exactly. */
  const frameScrollY = useCallback((index: number) => {
    const section = sectionRef.current;
    if (!section) return window.scrollY;
    const top = section.getBoundingClientRect().top + window.scrollY;
    return top + frameProgress(index) * (section.offsetHeight - window.innerHeight);
  }, []);

  const stopGlide = useCallback(() => {
    glideRef.current?.stop();
    glideRef.current = null;
  }, []);

  const glideTo = useCallback(
    (target: number, settle = false) => {
      stopGlide();
      const from = window.scrollY;
      const distance = Math.abs(target - from);
      if (distance < 2) return;
      if (reduce) {
        window.scrollTo({ top: target, behavior: "instant" });
        return;
      }
      const screens = distance / window.innerHeight;
      const duration = settle
        ? Math.min(0.9, 0.45 + screens * 0.6)
        : Math.min(1.6, 0.75 + screens * 0.3);
      /* Drive the page directly (html has scroll-behavior: smooth, so each step must be instant). */
      glideRef.current = animate(from, target, {
        duration,
        ease: GLIDE_EASE,
        onUpdate: (value) => window.scrollTo({ top: value, behavior: "instant" }),
        onComplete: () => {
          glideRef.current = null;
        },
      });
    },
    [reduce, stopGlide],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let settleTimer = 0;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      setHeaderOverlay(rect.top <= 0.5 && rect.bottom > HEADER_HEIGHT_PX);

      window.clearTimeout(settleTimer);
      if (reduce || glideRef.current) return;
      /* Scroll snap: once scrolling stops while pinned between frames, glide to the nearest frame. */
      settleTimer = window.setTimeout(() => {
        const r = section.getBoundingClientRect();
        const pinned = r.top <= 0.5 && r.bottom >= window.innerHeight - 0.5;
        if (glideRef.current || !pinned) return;
        const span = section.offsetHeight - window.innerHeight;
        const nearest = Math.round(clamp01(-r.top / span) * (COUNT - 1));
        glideTo(frameScrollY(nearest), true);
      }, SETTLE_DELAY_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    /* Any manual input takes over from a glide in progress. */
    window.addEventListener("wheel", stopGlide, { passive: true });
    window.addEventListener("touchstart", stopGlide, { passive: true });
    window.addEventListener("keydown", stopGlide);
    onScroll();
    return () => {
      window.clearTimeout(settleTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", stopGlide);
      window.removeEventListener("touchstart", stopGlide);
      window.removeEventListener("keydown", stopGlide);
      stopGlide();
      setHeaderOverlay(false);
    };
  }, [frameScrollY, glideTo, reduce, stopGlide]);

  return (
    <section
      ref={sectionRef}
      className="belong-story"
      aria-labelledby="belong-story-title"
      style={{ "--belong-steps": COUNT } as CSSProperties}
    >
      <div className="belong-story__pin">
        <div className="belong-story__media" aria-hidden>
          {ITEMS.map((item, index) => (
            <StoryImage
              key={item.id}
              item={item}
              index={index}
              progress={progress}
              reduce={reduce}
            />
          ))}
        </div>
        <div className="belong-story__shade" aria-hidden />

        <div className="belong-story__content">
          <header className="belong-story__intro">
            <p className="belong-story__eyebrow">A ONE-ANOTHER LIFE</p>
            <h2 id="belong-story-title">Belong in the family</h2>
            <p className="belong-story__lede">
              Kharis is a family where you can grow in your relationship with Jesus, fellowship with
              other Christ-like believers and discover your place in God&apos;s house.
            </p>
            <nav
              ref={pillsRef}
              className="belong-story__pills"
              aria-label="Ways to belong at Kharis"
            >
              {ITEMS.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className="belong-story__pill"
                  aria-current={active === index ? "step" : undefined}
                  onClick={() => glideTo(frameScrollY(index))}
                >
                  <span>{item.tag}</span>
                  {item.title}
                </button>
              ))}
            </nav>
          </header>

          <div className="belong-story__items">
            {ITEMS.map((item, index) => (
              <StoryText
                key={item.id}
                item={item}
                index={index}
                progress={progress}
                active={active === index}
                onLearnMore={onLearnMore}
              />
            ))}
          </div>

          <div className="belong-story__progress" aria-hidden>
            <span className="belong-story__count">
              {String(active + 1).padStart(2, "0")}
              <span> / {String(COUNT).padStart(2, "0")}</span>
            </span>
            <span className="belong-story__track">
              <motion.span className="belong-story__fill" style={{ scaleX: progress }} />
              {ITEMS.map((item, index) => (
                <i
                  key={item.id}
                  className={index <= active ? "is-reached" : undefined}
                  style={{ left: `${frameProgress(index) * 100}%` }}
                />
              ))}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
