"use client";

import Link from "next/link";
import { ArrowLeft, ChevronDown, ExternalLink, Volume2, VolumeX } from "lucide-react";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Icon } from "@/components/Icon";
import Image from "@/components/SiteImage";
import { type LifeCategory } from "@/lib/life-content";
import {
  lifeModalVideoId,
  lifeModalVideoKind,
  lifeModalVideoStart,
  lifeModalVideoTitle,
  type LifeModalSlug,
  youtubeBackgroundSrc,
  youtubePosterSrc,
  youtubeWatchUrl,
} from "@/lib/life-videos";

type Props = {
  category: LifeCategory | null;
  onClose: () => void;
};

function FastingBackgroundPreview() {
  return (
    <div className="life-reader__fasting-backdrop" aria-hidden="true">
      <div className="life-reader__fasting-image">
        <Image src="/images/life-fasting-detail-bw.png" alt="" fill sizes="100vw" quality={78} />
      </div>
      <div className="life-reader__fasting-scrim" aria-hidden="true" />
    </div>
  );
}

function postToPlayer(frame: HTMLIFrameElement | null, message: Record<string, unknown>) {
  frame?.contentWindow?.postMessage(JSON.stringify(message), "*");
}

function LifeSlideVideo({
  videoId,
  kind,
  title,
  startSeconds,
}: {
  videoId: string;
  kind: "youtube" | "file";
  title: string;
  startSeconds: number;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playingRevealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const isFile = kind === "file";
  const poster = isFile ? videoId.replace(/\.mp4$/, "-poster.jpg") : youtubePosterSrc(videoId);

  useEffect(() => {
    if (isFile) return;
    const onMessage = (e: MessageEvent) => {
      if (!e.origin.includes("youtube")) return;
      let data: { event?: string; info?: unknown } | null = null;
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      const info = data?.info as { playerState?: number } | number | undefined;
      const state = typeof info === "number" ? info : (info?.playerState ?? undefined);
      if (state !== 1) return;
      postToPlayer(frameRef.current, {
        event: "command",
        func: "unloadModule",
        args: ["captions"],
      });
      if (playingRevealTimer.current) clearTimeout(playingRevealTimer.current);
      // Keep the poster over YouTube's brief startup controls before showing the moving video.
      playingRevealTimer.current = setTimeout(() => setPlaying(true), 5000);
    };
    window.addEventListener("message", onMessage);
    return () => {
      if (playingRevealTimer.current) clearTimeout(playingRevealTimer.current);
      window.removeEventListener("message", onMessage);
    };
  }, [isFile]);

  const toggleSound = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (isFile) {
      const el = videoRef.current;
      if (el) {
        el.muted = nextMuted;
        void el.play().catch(() => undefined);
      }
      return;
    }
    postToPlayer(frameRef.current, {
      event: "command",
      func: nextMuted ? "mute" : "unMute",
      args: [],
    });
    if (!nextMuted) {
      postToPlayer(frameRef.current, {
        event: "command",
        func: "setVolume",
        args: [80],
      });
    }
  };

  return (
    <div className={`life-modal__clip${playing ? " is-playing" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="life-modal__poster" src={poster} alt="" aria-hidden />
      {isFile ? (
        <video
          ref={videoRef}
          className="life-modal__video"
          src={videoId}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          onPlaying={() => setPlaying(true)}
        />
      ) : (
        <iframe
          ref={frameRef}
          className="life-modal__video life-modal__video--yt"
          src={youtubeBackgroundSrc(videoId, window.location.origin, startSeconds)}
          title={`${title} | Kharis Life`}
          loading="lazy"
          allow="autoplay; encrypted-media; picture-in-picture"
          tabIndex={-1}
          onLoad={() =>
            postToPlayer(frameRef.current, {
              event: "listening",
              id: 1,
              channel: "widget",
            })
          }
        />
      )}
      <div className="life-modal__clip-bar">
        <button
          type="button"
          className="life-modal__clip-btn"
          aria-label={muted ? "Turn on video sound" : "Mute video"}
          onClick={toggleSound}
        >
          {muted ? (
            <VolumeX aria-hidden className="h-4 w-4" />
          ) : (
            <Volume2 aria-hidden className="h-4 w-4" />
          )}
          <span>{muted ? "Sound off" : "Sound on"}</span>
        </button>
        {!isFile ? (
          <a
            className="life-modal__clip-btn"
            href={youtubeWatchUrl(videoId, startSeconds)}
            target="_blank"
            rel="noreferrer"
          >
            Watch full message <ExternalLink aria-hidden className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </div>
  );
}

function LifeScrollJourney({
  category,
  titleId,
  reduce,
  readerScrollRef,
}: {
  category: LifeCategory;
  titleId: string;
  reduce: boolean;
  readerScrollRef: { current: HTMLDivElement | null };
}) {
  const [activeStage, setActiveStage] = useState(0);
  const journeyRef = useRef<HTMLElement>(null);
  const stages: { title: string; label: string; body: string; items?: readonly string[] }[] = [
    ...(category.intro
      ? [
          {
            title: category.title,
            label: "THE HEART OF IT",
            body:
              category.slug === "baptism"
                ? category.intro
                    .replace(
                      "Baptism is a public declaration a person makes to identify with ",
                      "A public declaration a person makes to identify with ",
                    )
                    .replace(
                      " While baptism doesn’t grant you salvation, that comes by faith alone.",
                      " It doesn’t grant salvation, which comes by faith alone.",
                    )
                    .replace(" Jesus commanded believers to get baptised.", "")
                : category.intro,
          },
        ]
      : []),
    ...(category.quote
      ? [{ title: "Scripture", label: category.quote.source, body: `“${category.quote.text}”` }]
      : []),
    ...category.sections.map((section) => ({
      title:
        category.slug === "baptism" && section.title.startsWith("Jesus commanded")
          ? "Jesus commanded"
          : section.title,
      label: category.badge,
      body: section.body,
      items: section.items,
    })),
  ];
  const { scrollYProgress } = useScroll({
    container: readerScrollRef,
    target: journeyRef,
    offset: ["start start", "end end"],
  });
  const lastStage = Math.max(0, stages.length - 1);
  const journeyPosition = useTransform(scrollYProgress, (progress) => progress * stages.length - 1);
  const stagePosition = useTransform(journeyPosition, (position) =>
    Math.max(0, Math.min(lastStage, position)),
  );
  const railY = useTransform(scrollYProgress, (progress) => {
    if (reduce) return `${-Math.round(progress * lastStage) * 70}vh`;
    return `${70 - progress * stages.length * 70}vh`;
  });
  const headingOpacity = useTransform(stagePosition, (position) => {
    const distanceToSwap = 0.5 - Math.abs(position - Math.round(position));
    return Math.max(0.38, Math.min(1, 0.38 + distanceToSwap * 1.24));
  });

  useMotionValueEvent(stagePosition, "change", (position) => {
    const next = Math.max(0, Math.min(lastStage, Math.round(position)));
    setActiveStage((current) => (current === next ? current : next));
  });

  if (!stages.length) return null;
  const current = stages[Math.min(activeStage, stages.length - 1)];
  return (
    <section
      ref={journeyRef}
      className={`life-reader__journey${category.slug === "fasting" ? " life-reader__journey--fasting-preview" : ""}`}
      aria-label={`${category.title} teaching`}
    >
      {category.slug === "fasting" ? (
        <div className="life-reader__fasting-backdrop-track" aria-hidden="false">
          <FastingBackgroundPreview />
        </div>
      ) : null}
      <div className="life-reader__journey-heading" aria-live="polite">
        <motion.div
          className="life-reader__journey-heading-stage"
          style={{ opacity: headingOpacity }}
        >
          <span>{String(activeStage + 1).padStart(2, "0")}</span>
          <p>{current.label}</p>
          <h3 id={titleId}>{current.title}.</h3>
          {activeStage === 0 ? (
            <button
              type="button"
              className="life-reader__scroll-cue"
              onClick={() =>
                readerScrollRef.current?.scrollBy({
                  top: Math.round(window.innerHeight * 0.68),
                  behavior: reduce ? "instant" : "smooth",
                })
              }
            >
              <span>SCROLL TO EXPLORE</span>
              <ChevronDown aria-hidden className="h-4 w-4" />
            </button>
          ) : null}
        </motion.div>
      </div>
      <div className="life-reader__journey-copy">
        <div className="life-reader__journey-current" aria-live="polite">
          <motion.div className="life-reader__journey-rail" style={{ y: railY }}>
            {stages.map((stage, index) => (
              <JourneyPassage
                key={`${stage.title}-${index}`}
                stage={stage}
                index={index}
                journeyPosition={journeyPosition}
                reduce={reduce}
              />
            ))}
          </motion.div>
        </div>
        <div className="life-reader__journey-markers" aria-hidden="true">
          {stages.map((stage, index) => (
            <div className="life-reader__journey-marker" key={`${stage.title}-${index}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function JourneyPassage({
  stage,
  index,
  journeyPosition,
  reduce,
}: {
  stage: { title: string; label: string; body: string; items?: readonly string[] };
  index: number;
  journeyPosition: MotionValue<number>;
  reduce: boolean;
}) {
  const opacity = useTransform(journeyPosition, (position) => {
    if (reduce) return Math.round(position) === index ? 1 : 0.18;
    const distance = Math.abs(position - index);
    return Math.max(0.2, 1 - distance * 1.6);
  });

  return (
    <motion.div className="life-reader__journey-passage" style={{ opacity }}>
      <p>{stage.body}</p>
      {stage.items?.length ? (
        <ul>
          {stage.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </motion.div>
  );
}

export function LifeDetailModal({ category, onClose }: Props) {
  const reduce = useReducedMotion();
  const readerScrollRef = useRef<HTMLDivElement>(null);
  const revealTransition = (duration: number, delay = 0) =>
    reduce ? { duration: 0 } : { duration, delay, ease: [0.22, 1, 0.36, 1] as const };
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [followupStep, setFollowupStep] = useState(0);
  const [emailAttempted, setEmailAttempted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [savedLocally, setSavedLocally] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!category) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [category, onClose]);

  useEffect(() => {
    readerScrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
    setSent(false);
    setSavedLocally(false);
    setError("");
    setName("");
    setEmail("");
    setFollowupStep(0);
    setEmailAttempted(false);
  }, [category?.slug]);

  const slug = category?.slug as LifeModalSlug | undefined;
  const videoId = slug ? lifeModalVideoId(slug) : "";
  const videoTitle = slug ? lifeModalVideoTitle(slug) : (category?.title ?? "Kharis Life");
  const videoKind = slug ? lifeModalVideoKind(slug) : "youtube";
  const videoStart = slug ? lifeModalVideoStart(slug) : 0;
  const isBaptism = category?.slug === "baptism";
  const isDepartments = category?.slug === "departments";

  if (!mounted) return null;

  const onFollowup = async (e: FormEvent) => {
    e.preventDefault();
    setEmailAttempted(true);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          topic: "Baptism",
          message:
            "I'd like to speak with someone about baptism. Please share the next steps and baptism class details at my local branch.",
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        storage?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error || "Please check your details and try again.");
        return;
      }
      setSavedLocally(data.storage === "local-development");
      setSent(true);
    } catch {
      setError("Something went wrong. You can also use the contact page.");
    } finally {
      setBusy(false);
    }
  };

  const onNameContinue = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name to continue.");
      return;
    }
    setError("");
    setFollowupStep(2);
  };

  const ctaHref = isDepartments ? "/life/departments" : (category?.cta.href ?? "/life");
  const ctaLabel = isDepartments ? "Join a department" : (category?.cta.label ?? "Learn more");

  return createPortal(
    <AnimatePresence>
      {category && slug ? (
        <motion.div
          className="life-modal life-modal--reader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.1 : 0.22, ease: [0.22, 0.72, 0.24, 1] }}
        >
          <button
            type="button"
            className="life-modal__scrim"
            aria-label="Close"
            onClick={onClose}
          />

          <motion.div
            className="life-reader"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: -8, scale: 0.998 }}
            transition={revealTransition(0.28)}
          >
            <header className="life-reader__toolbar">
              <p>
                {category.badge} <span>·</span> KHARIS LIFE
              </p>
              <button type="button" onClick={onClose} aria-label="Back to Life page" autoFocus>
                <ArrowLeft aria-hidden className="h-5 w-5" />
                <span>Back to Life</span>
              </button>
            </header>

            <div
              className="life-reader__scroller"
              ref={readerScrollRef}
              tabIndex={0}
              aria-label={`${category.title} teaching and background`}
            >
              <LifeScrollJourney
                category={category}
                titleId={titleId}
                reduce={reduce ?? false}
                readerScrollRef={readerScrollRef}
              />

              <section className="life-reader__video-chapter" aria-label="Teaching video">
                <motion.div
                  className="life-reader__video-heading"
                  initial={reduce ? false : { opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.35 }}
                  transition={revealTransition(0.9)}
                >
                  <p>PASTOR DAVID TEACHES</p>
                  <h3>{videoTitle}</h3>
                </motion.div>
                <div className="life-reader__video-frame">
                  <LifeSlideVideo
                    videoId={videoId}
                    kind={videoKind}
                    title={videoTitle}
                    startSeconds={videoStart}
                  />
                </div>
              </section>

              <section className="life-reader__end" aria-label="Continue your journey">
                {isBaptism ? (
                  <motion.div
                    className="life-reader__family"
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.35 }}
                    transition={revealTransition(0.85)}
                  >
                    <h3>Let&apos;s talk baptism.</h3>
                    <p className="life-reader__family-copy">
                      We&apos;ll help you connect with your local branch about baptism.
                    </p>
                    {sent ? (
                      <p className="life-reader__family-success" role="status">
                        {savedLocally
                          ? "Thanks for reaching out. Someone from your local Kharis branch will be in touch soon."
                          : "Thank you. A member of the team will follow up soon."}
                      </p>
                    ) : (
                      <AnimatePresence mode="wait" initial={false}>
                        {followupStep === 0 ? (
                          <motion.div
                            className="life-reader__family-step"
                            key="start"
                            initial={reduce ? false : { opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? undefined : { opacity: 0, y: -10 }}
                            transition={revealTransition(0.32)}
                          >
                            <button
                              type="button"
                              className="life-refresh__button"
                              onClick={() => setFollowupStep(1)}
                            >
                              CONNECT WITH US <Icon name="arrow" className="h-4 w-4" />
                            </button>
                          </motion.div>
                        ) : followupStep === 1 ? (
                          <motion.form
                            className="life-reader__family-step"
                            key="name"
                            onSubmit={onNameContinue}
                            noValidate
                            initial={reduce ? false : { opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? undefined : { opacity: 0, y: -10 }}
                            transition={revealTransition(0.32)}
                          >
                            <label htmlFor="baptism-followup-name">
                              First, what&apos;s your name?
                            </label>
                            <input
                              id="baptism-followup-name"
                              type="text"
                              autoComplete="name"
                              autoFocus
                              required
                              placeholder="Your name"
                              value={name}
                              aria-invalid={Boolean(error)}
                              aria-describedby={error ? "baptism-followup-error" : undefined}
                              onChange={(e) => setName(e.target.value)}
                            />
                            <button type="submit" className="life-refresh__button">
                              CONTINUE <Icon name="arrow" className="h-4 w-4" />
                            </button>
                          </motion.form>
                        ) : (
                          <motion.form
                            className="life-reader__family-step"
                            key="email"
                            onSubmit={onFollowup}
                            noValidate
                            initial={reduce ? false : { opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? undefined : { opacity: 0, y: -10 }}
                            transition={revealTransition(0.32)}
                          >
                            <label htmlFor="baptism-followup-email">
                              Nice to meet you, {name.trim().split(/\s+/)[0]}. Where can we reach
                              you?
                            </label>
                            <input
                              id="baptism-followup-email"
                              type="email"
                              autoComplete="email"
                              autoFocus
                              required
                              placeholder="Your email address"
                              value={email}
                              aria-invalid={
                                emailAttempted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
                              }
                              aria-describedby={error ? "baptism-followup-error" : undefined}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) setError("");
                              }}
                            />
                            <div className="life-reader__family-actions">
                              <button
                                type="button"
                                className="life-reader__family-back"
                                onClick={() => setFollowupStep(1)}
                              >
                                Back
                              </button>
                              <button
                                type="submit"
                                className="life-refresh__button"
                                disabled={busy}
                              >
                                {busy ? "SENDING…" : "SEND MY DETAILS"}
                                <Icon name="arrow" className="h-4 w-4" />
                              </button>
                            </div>
                          </motion.form>
                        )}
                      </AnimatePresence>
                    )}
                    {error ? (
                      <p
                        id="baptism-followup-error"
                        className="life-reader__family-error"
                        role="alert"
                      >
                        {error}
                      </p>
                    ) : null}
                  </motion.div>
                ) : (
                  <>
                    <motion.h3
                      initial={reduce ? false : { opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.4 }}
                      transition={revealTransition(0.9, 0.08)}
                    >
                      {isDepartments ? "Find your place to serve." : `${ctaLabel}.`}
                    </motion.h3>
                    <motion.div
                      initial={reduce ? false : { opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.4 }}
                      transition={revealTransition(0.85, 0.16)}
                    >
                      <Link href={ctaHref} className="life-refresh__button" onClick={onClose}>
                        {ctaLabel.toUpperCase()}
                        <Icon name="arrow" className="h-4 w-4" />
                      </Link>
                    </motion.div>
                  </>
                )}
              </section>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
