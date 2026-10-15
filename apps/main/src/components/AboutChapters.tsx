"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
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
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const headlineY = useTransform(scrollYProgress, [0, 1], [16, -16]);
  const words = title.split(" ");
  const phrases = Array.from({ length: Math.ceil(words.length / 3) }, (_, i) =>
    words.slice(i * 3, i * 3 + 3).join(" "),
  );
  return (
    <div
      ref={heroRef}
      className={`about-panel__hero about-panel__hero--wall about-panel__hero--${tone}`}
    >
      <motion.div
        className="about-panel__hero-media"
        style={reduce || tone === "leadership" ? undefined : { y: photoY }}
        aria-hidden
        initial={reduce ? false : { opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      ></motion.div>
      <motion.div
        className="about-panel__hero-copy"
        style={reduce || tone === "leadership" ? undefined : { y: headlineY }}
      >
        <p className="about-panel__eyebrow">{eyebrow}</p>
        <motion.h3
          aria-label={title}
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
        >
          {phrases.map((phrase, i) => (
            <span className="about-headline-window" key={`${phrase}-${i}`} aria-hidden="true">
              <motion.span
                className="about-headline-phrase"
                variants={{ hidden: { y: "105%", opacity: 0 }, visible: { y: "0%", opacity: 1 } }}
                transition={{ duration: 0.65, ease }}
              >
                {phrase}
                {i < phrases.length - 1 ? " " : ""}
              </motion.span>
            </span>
          ))}
        </motion.h3>
      </motion.div>
    </div>
  );
}

/**
 * Interactive About stage: one chapter in focus, full content via progressive UI.
 */
export function AboutChapters({ initialId }: { initialId?: AboutChapterId | null }) {
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
        <div className="about-stage__banner-inner">
          <motion.h2
            className="about-stage__title"
            initial={false}
            whileInView={reduce ? undefined : { x: [28, 0], opacity: [0.4, 1] }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
          >
            Who we are<span aria-hidden="true">.</span>
          </motion.h2>
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
                tabIndex={on ? 0 : -1}
                onKeyDown={(event) => {
                  const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
                  if (!keys.includes(event.key)) return;
                  event.preventDefault();
                  const current = PICKERS.findIndex((item) => item.id === active);
                  const next =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? PICKERS.length - 1
                        : (current + (event.key === "ArrowRight" ? 1 : -1) + PICKERS.length) %
                          PICKERS.length;
                  const id = PICKERS[next].id;
                  select(id);
                  document.getElementById(`about-tab-${id}`)?.focus();
                }}
                aria-controls={`about-panel-${p.id}`}
                id={`about-tab-${p.id}`}
                className={`about-jump__link${on ? " is-active" : ""}`}
                onClick={() => select(p.id)}
                whileHover={reduce ? undefined : { y: -3 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
              >
                <span className="about-jump__chapter-number" aria-hidden="true">
                  {String(PICKERS.indexOf(p) + 1).padStart(2, "0")}
                </span>
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
            initial={reduce ? false : { opacity: 0, y: 28, filter: "blur(0px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? undefined : { opacity: 0, y: -18, filter: "blur(0px)" }}
            transition={{ duration: 0.45, ease }}
          >
            {active === "mission" ? <MissionPanel reduce={!!reduce} /> : null}
            {active === "vision" ? <VisionPanel reduce={!!reduce} /> : null}
            {active === "leadership" ? <LeadershipPanel reduce={!!reduce} /> : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function MissionPanel({ reduce }: { reduce: boolean }) {
  const { mission } = ABOUT;
  const [pillar, setPillar] = useState(0);
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
        <div className="about-panel__split">
          <div className="about-panel__pillars" role="group" aria-label="How we fulfil our mission">
            {mission.how.map((item, i) => (
              <motion.button
                key={item.title}
                type="button"
                className={`about-panel__pillar${i === pillar ? " is-active" : ""}`}
                aria-pressed={i === pillar}
                onClick={() => setPillar(i)}
                whileHover={reduce ? undefined : { x: 4 }}
              >
                <span className="about-panel__pillar-icon">
                  <ContentIcon name={item.icon} className="h-6 w-6" />
                </span>
                <span>
                  <span className="about-panel__pillar-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="about-panel__pillar-title">{item.title}</span>
                </span>
              </motion.button>
            ))}
          </div>

          <motion.article
            key={active.title}
            className="about-panel__focus"
            initial={reduce ? false : { opacity: 0.65 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18, ease }}
          >
            <p className="about-panel__focus-kicker">How we fulfil it</p>
            <h4>{active.title}</h4>
            <p>{active.body}</p>
            <p className="about-panel__verse">{active.verse}</p>
            <blockquote>{active.quote}</blockquote>
          </motion.article>
        </div>
      </div>
    </div>
  );
}

function VisionPanel({ reduce }: { reduce: boolean }) {
  const { vision } = ABOUT;
  const themes = [
    { icon: "cross", text: "Christ-centred, purpose-driven and disciple-making" },
    { icon: "sparkles", text: "Full of life, large and spiritually deep" },
    { icon: "flame", text: "Naturally supernatural, glorifying God" },
    { icon: "radio", text: "Proclamation and worship to the nations" },
    { icon: "gift", text: "Ordinary people, extraordinary lives" },
    { icon: "house", text: "A caring family, refuge and belonging" },
    { icon: "users", text: "Strong, effective small groups" },
    { icon: "plane", text: "Missionaries sent, every member equipped" },
  ];
  return (
    <div className="about-panel about-panel--vision about-vision-themes">
      <PanelHero reduce={reduce} tone="vision" eyebrow="Our Vision" title={vision.lead} />
      <div className="about-panel__body about-vision-themes__content">
        <p className="about-vision-themes__intro">{vision.intro}</p>
        <div className="about-vision-themes__grid">
          {themes.map((theme, index) => (
            <motion.details
              key={theme.text}
              className="about-vision-theme"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: (index % 4) * 0.07, ease }}
            >
              <summary>
                <ContentIcon name={theme.icon} className="h-9 w-9" />
                <span>{theme.text}</span>
                <span className="about-vision-theme__toggle" aria-hidden="true">
                  +
                </span>
              </summary>
              <p>{vision.points[index]}</p>
            </motion.details>
          ))}
        </div>
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
              initial={reduce ? false : { opacity: 0, y: 40, clipPath: "inset(12% 0 0 0)" }}
              whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={reduce ? undefined : { y: -5 }}
              transition={{ delay: 0.08 + i * 0.1, duration: 0.45, ease }}
            >
              <div className="about-lead__profile-photo">
                <Image
                  src={pastor.image}
                  alt={pastor.name}
                  fill
                  className="object-cover object-[center_40%]"
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
        <motion.p
          className="about-lead__story-kicker"
          initial={reduce ? false : { opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.4 }}
        >
          Their story
        </motion.p>
        <div className="about-lead__story-body">
          {(() => {
            const sentences = leadership.body.split(/(?<=[.!?])\s+(?=[A-Z])/);
            return [sentences.slice(0, 3), sentences.slice(3, 5), sentences.slice(5)]
              .filter((group) => group.length > 0)
              .map((group, index) => (
                <motion.div
                  key={index}
                  className="about-lead__story-beat"
                  initial={reduce ? false : { y: 18, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease }}
                  whileHover={reduce ? undefined : { y: -4 }}
                >
                  <h4>{["Founded in 2003", "The Word at the centre", "A life together"][index]}</h4>
                  <p>{group.join(" ")}</p>
                </motion.div>
              ));
          })()}
        </div>
        <motion.div
          className="about-lead__story-action"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.24, duration: 0.4 }}
        >
          <Link href="/life" className="about-lead__story-cta">
            Explore Kharis Life
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
