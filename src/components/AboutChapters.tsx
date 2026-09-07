"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { ContentIcon } from "@/components/ContentIcon";
import { ABOUT } from "@/lib/about-content";

export type AboutChapterId = "mission" | "vision" | "leadership";

const PICKERS: Array<{
  id: AboutChapterId;
  label: string;
  hint: string;
  icon: string;
}> = [
  {
    id: "mission",
    label: "Our Mission",
    hint: "Why we exist",
    icon: "heart",
  },
  {
    id: "vision",
    label: "Our Vision",
    hint: "Where we are going",
    icon: "sparkles",
  },
  {
    id: "leadership",
    label: "Our Leadership",
    hint: "Who leads us",
    icon: "users",
  },
];

export function isAboutChapterId(v: string | null): v is AboutChapterId {
  return v === "mission" || v === "vision" || v === "leadership";
}

const ease = [0.22, 1, 0.36, 1] as const;

function AboutSvgWallpaper({
  variant = "stage",
  tone = "mission",
}: {
  variant?: "stage" | "panel";
  tone?: "mission" | "vision" | "leadership";
}) {
  const id =
    variant === "stage"
      ? "aboutWallA"
      : tone === "vision"
        ? "aboutWallVision"
        : tone === "leadership"
          ? "aboutWallLead"
          : "aboutWallMission";

  if (variant === "stage") {
    return (
      <svg
        className="about-wall about-wall--stage"
        viewBox="0 0 1200 220"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c45a9a" />
            <stop offset="45%" stopColor="#a8327a" />
            <stop offset="100%" stopColor="#8e2068" />
          </linearGradient>
          <pattern
            id={`${id}-lines`}
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(28)"
          >
            <path
              d="M0 20 H40"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="1.2"
            />
          </pattern>
        </defs>
        <rect width="1200" height="220" fill={`url(#${id}-fade)`} />
        <rect width="1200" height="220" fill={`url(#${id}-lines)`} />
        <circle cx="90" cy="180" r="70" fill="rgba(255,255,255,0.12)" />
        <circle cx="1120" cy="30" r="95" fill="rgba(253,127,32,0.18)" />
        <path
          d="M420 0 L520 110 L420 220 L320 110 Z"
          fill="rgba(255,255,255,0.08)"
        />
        <path
          d="M780 0 L860 90 L780 180 L700 90 Z"
          fill="rgba(255,255,255,0.06)"
        />
      </svg>
    );
  }

  const fades =
    tone === "vision"
      ? (["#faf5f8", "#f0e2eb", "#e4c9da"] as const)
      : tone === "leadership"
        ? (["#e07a28", "#c45a12", "#8a3a0c"] as const)
        : (["#9a1870", "#800654", "#4a0a36"] as const);
  const glow =
    tone === "vision"
      ? "rgba(128, 6, 84, 0.08)"
      : tone === "leadership"
        ? "rgba(255,255,255,0.18)"
        : "rgba(253,127,32,0.16)";
  const dot =
    tone === "vision"
      ? "rgba(128, 6, 84, 0.12)"
      : "rgba(255,255,255,0.14)";
  const wash =
    tone === "vision"
      ? "rgba(255,255,255,0.55)"
      : "rgba(255,255,255,0.08)";

  return (
    <svg
      className={`about-wall about-wall--panel about-wall--${tone}`}
      viewBox="0 0 1200 280"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <pattern
          id={`${id}-dots`}
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="3" cy="3" r="1.4" fill={dot} />
        </pattern>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={fades[0]} />
          <stop offset="55%" stopColor={fades[1]} />
          <stop offset="100%" stopColor={fades[2]} />
        </linearGradient>
      </defs>
      <rect width="1200" height="280" fill={`url(#${id}-fade)`} />
      <rect width="1200" height="280" fill={`url(#${id}-dots)`} />
      <circle cx="160" cy="40" r="90" fill={glow} />
      <circle cx="1080" cy="220" r="120" fill={wash} />
      <path
        d="M0 210 C220 150 380 250 600 190 C820 130 980 230 1200 170 L1200 280 L0 280 Z"
        fill={
          tone === "vision" ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.06)"
        }
      />
      <path
        d="M740 30c40 0 70 28 70 68s-30 68-70 68c-18 0-34-6-47-16 22 8 48 4 64-14 16-18 14-46-4-62-12-10-28-14-44-12 8-20 28-32 51-32z"
        fill={
          tone === "vision" ? "rgba(128, 6, 84, 0.06)" : "rgba(255,255,255,0.07)"
        }
      />
    </svg>
  );
}

function PanelHero({
  eyebrow,
  title,
  reduce,
  tone,
}: {
  eyebrow: string;
  title: string;
  reduce: boolean;
  tone: "mission" | "vision" | "leadership";
}) {
  return (
    <div className={`about-panel__hero about-panel__hero--wall about-panel__hero--${tone}`}>
      <motion.div
        className="about-panel__hero-media"
        aria-hidden
        initial={reduce ? false : { opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <AboutSvgWallpaper variant="panel" tone={tone} />
      </motion.div>
      <div className="about-panel__hero-copy">
        <p className="about-panel__eyebrow">{eyebrow}</p>
        <h3>{title}</h3>
      </div>
    </div>
  );
}

/**
 * Interactive About stage: one chapter in focus, full content via progressive UI.
 */
export function AboutChapters({
  initialId,
}: {
  initialId?: AboutChapterId | null;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<AboutChapterId>(initialId ?? "mission");

  const select = useCallback((id: AboutChapterId) => {
    setActive(id);
    window.history.replaceState({}, "", `/about#${id}`);
  }, []);

  useEffect(() => {
    if (initialId) setActive(initialId);
  }, [initialId]);

  useEffect(() => {
    const sync = () => {
      const h = window.location.hash.replace("#", "");
      if (isAboutChapterId(h)) setActive(h);
    };
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <section className="about-stage" aria-label="Mission, vision and leadership">
      <span id="mission" className="about-stage__hash" />
      <span id="vision" className="about-stage__hash" />
      <span id="leadership" className="about-stage__hash" />

      <header className="about-stage__banner">
        <AboutSvgWallpaper variant="stage" />
        <div className="about-stage__banner-inner">
          <h2 className="about-stage__title">Who we are becoming</h2>
        </div>
      </header>

      <div className="about-jump about-jump--stage" aria-label="Explore About">
        <div className="about-jump__row" role="tablist" aria-label="Chapters">
          {PICKERS.map((p) => {
            const on = p.id === active;
            return (
              <motion.button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`about-panel-${p.id}`}
                id={`about-tab-${p.id}`}
                className={`about-jump__link${on ? " is-active" : ""}`}
                onClick={() => select(p.id)}
                whileHover={reduce ? undefined : { y: -3 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
              >
                <span className="about-jump__icon">
                  <ContentIcon name={p.icon} className="h-6 w-6" />
                </span>
                <span className="about-jump__label">{p.label}</span>
                <span className="about-jump__hint">{p.hint}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="about-stage__canvas">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            id={`about-panel-${active}`}
            role="tabpanel"
            aria-labelledby={`about-tab-${active}`}
            className="about-stage__panel"
            initial={reduce ? false : { opacity: 0, y: 28, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? undefined : { opacity: 0, y: -18, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease }}
          >
            {active === "mission" ? <MissionPanel reduce={!!reduce} /> : null}
            {active === "vision" ? <VisionPanel reduce={!!reduce} /> : null}
            {active === "leadership" ? (
              <LeadershipPanel reduce={!!reduce} />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function MissionPanel({ reduce }: { reduce: boolean }) {
  const { mission } = ABOUT;
  const [pillar, setPillar] = useState(0);
  const [deep, setDeep] = useState(false);
  const active = mission.how[pillar]!;

  return (
    <div className="about-panel about-panel--mission">
      <PanelHero
        reduce={!!reduce}
        tone="mission"
        eyebrow="Our Mission"
        title="Influence society with the reality of God’s love"
      />

      <div className="about-panel__body">
        <p className="about-panel__lead">{mission.lead}</p>
        <button
          type="button"
          className="about-panel__more"
          aria-expanded={deep}
          onClick={() => setDeep((v) => !v)}
        >
          {deep ? "Show less" : "Continue reading"}
        </button>
        <AnimatePresence initial={false}>
          {deep ? (
            <motion.p
              className="about-panel__deep"
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={reduce ? undefined : { opacity: 0, height: 0 }}
            >
              {mission.deepen}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <div className="about-panel__split">
          <div className="about-panel__pillars" role="list">
            {mission.how.map((item, i) => (
              <motion.button
                key={item.title}
                type="button"
                role="listitem"
                className={`about-panel__pillar${i === pillar ? " is-active" : ""}`}
                onClick={() => setPillar(i)}
                onMouseEnter={() => setPillar(i)}
                whileHover={reduce ? undefined : { x: 4 }}
              >
                <span className="about-panel__pillar-icon">
                  <ContentIcon name={item.icon} className="h-6 w-6" />
                </span>
                <span>
                  <span className="about-panel__pillar-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="about-panel__pillar-title">{item.title}</span>
                </span>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              key={active.title}
              className="about-panel__focus"
              initial={reduce ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: -16 }}
              transition={{ duration: 0.32, ease }}
            >
              <p className="about-panel__focus-kicker">How we fulfil it</p>
              <h4>{active.title}</h4>
              <p>{active.body}</p>
              <p className="about-panel__verse">{active.verse}</p>
              <blockquote>{active.quote}</blockquote>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const VISION_THEMES = [
  { bg: "#800654", num: "#fd7f20" },
  { bg: "#5c0440", num: "#ffc4a0" },
  { bg: "#3d0a2e", num: "#f0a060" },
  { bg: "#9a1870", num: "#ffe0c2" },
  { bg: "#650445", num: "#fd9a4a" },
  { bg: "#4a0a36", num: "#ffd0a8" },
  { bg: "#2a051c", num: "#fd7f20" },
  { bg: "#7a1054", num: "#ffb87a" },
] as const;

function VisionPanel({ reduce }: { reduce: boolean }) {
  const { vision } = ABOUT;
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [fading, setFading] = useState(false);
  const point = vision.points[index]!;
  const theme = VISION_THEMES[index % VISION_THEMES.length]!;

  useEffect(() => {
    setTyped("");
    setFading(false);
    if (reduce) {
      setTyped(point);
      const wait = window.setTimeout(() => {
        setFading(true);
        window.setTimeout(() => {
          setIndex((i) => (i + 1) % vision.points.length);
        }, 480);
      }, 3200);
      return () => window.clearTimeout(wait);
    }

    let i = 0;
    let advanceTimer: number | undefined;
    const speed = Math.max(14, Math.min(28, 2200 / point.length));
    const typeTimer = window.setInterval(() => {
      i += 1;
      setTyped(point.slice(0, i));
      if (i >= point.length) {
        window.clearInterval(typeTimer);
        advanceTimer = window.setTimeout(() => {
          setFading(true);
          window.setTimeout(() => {
            setIndex((n) => (n + 1) % vision.points.length);
          }, 520);
        }, 1400);
      }
    }, speed);

    return () => {
      window.clearInterval(typeTimer);
      if (advanceTimer) window.clearTimeout(advanceTimer);
    };
  }, [index, point, reduce, vision.points.length]);

  return (
    <div className="about-panel about-panel--vision">
      <PanelHero
        reduce={!!reduce}
        tone="vision"
        eyebrow="Our Vision"
        title={vision.lead}
      />

      <div className="about-panel__body">
        <p className="about-panel__kicker">{vision.intro}</p>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="about-panel__vision-stage"
            style={
              {
                ["--vision-bg" as string]: theme.bg,
                ["--vision-num" as string]: theme.num,
              } as CSSProperties
            }
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: fading ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <p className="about-panel__vision-num">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="about-panel__vision-text" aria-live="polite">
              {typed}
              {!reduce && typed.length < point.length ? (
                <span className="about-panel__vision-caret" aria-hidden>
                  |
                </span>
              ) : null}
            </p>
            <p className="about-panel__vision-count" aria-hidden>
              {index + 1} / {vision.points.length}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function LeadershipPanel({ reduce }: { reduce: boolean }) {
  const { leadership } = ABOUT;

  return (
    <div className="about-panel about-panel--lead">
      <PanelHero
        reduce={!!reduce}
        tone="leadership"
        eyebrow="Our Leadership"
        title={leadership.title}
      />

      <div className="about-panel__body about-lead__body">
        <div className="about-lead__profiles">
          {leadership.pastors.map((pastor, i) => (
            <motion.article
              key={pastor.id}
              className="about-lead__profile"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.1, duration: 0.45, ease }}
            >
              <div className="about-lead__profile-photo">
                <Image
                  src={pastor.image}
                  alt={pastor.name}
                  fill
                  className={`object-cover ${
                    pastor.id === "david"
                      ? "object-[center_12%]"
                      : "object-[center_18%]"
                  }`}
                  sizes="(max-width: 860px) 100vw, 40vw"
                />
              </div>
              <div className="about-lead__profile-copy">
                <p className="about-lead__profile-role">{pastor.role}</p>
                <h4>{pastor.name}</h4>
                <p className="about-lead__profile-focus">{pastor.focus}</p>
                <p className="about-lead__profile-blurb">{pastor.blurb}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <motion.div
        className="about-lead__story"
        initial={reduce ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.55, ease }}
      >
        <motion.span
          className="about-lead__story-glow"
          aria-hidden
          animate={
            reduce
              ? undefined
              : { opacity: [0.45, 0.8, 0.45], scale: [1, 1.08, 1] }
          }
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.p
          className="about-lead__story-kicker"
          initial={reduce ? false : { opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.4 }}
        >
          Their story
        </motion.p>
        <motion.p
          className="about-lead__story-body"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16, duration: 0.45 }}
        >
          {leadership.body}
        </motion.p>
        <motion.div
          className="about-lead__story-action"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.24, duration: 0.4 }}
        >
          <p className="about-lead__story-invite">
            Do you need a spiritual parent in Christ? Then join us.
          </p>
          <Link href="/#near-you" className="about-lead__story-cta">
            Join us this Sunday
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
