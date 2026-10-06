"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  FormEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { LifeIcon } from "@/components/LifeIcon";
import { type LifeCategory } from "@/lib/life-content";
import {
  lifeModalBlurb,
  lifeModalVideoId,
  lifeModalVideoKind,
  type LifeModalSlug,
  youtubeEmbedSrc,
} from "@/lib/life-videos";

type Slide =
  | { kind: "video"; title: string; blurb: string }
  | { kind: "text"; title: string; body: string; items?: readonly string[] };

type Props = {
  category: LifeCategory | null;
  baptismVideoId?: string;
  showFollowup?: boolean;
  onClose: () => void;
};

const SLIDE_MS = 5200;
const VIDEO_SLIDE_MS = 9000;

function buildSlides(category: LifeCategory, blurb: string): Slide[] {
  const slides: Slide[] = [
    { kind: "video", title: category.title, blurb },
  ];

  if (category.intro) {
    slides.push({
      kind: "text",
      title: category.title,
      body: category.intro,
    });
  }

  if (category.quote) {
    slides.push({
      kind: "text",
      title: category.quote.source,
      body: category.quote.text,
    });
  }

  for (const section of category.sections) {
    slides.push({
      kind: "text",
      title: section.title,
      body: section.body,
      items: section.items,
    });
  }

  return slides;
}

export function LifeDetailModal({
  category,
  baptismVideoId,
  showFollowup = false,
  onClose,
}: Props) {
  const reduce = useReducedMotion();
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!category) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
            const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setSlide((s) => s - 1);
      if (e.key === "ArrowRight") setSlide((s) => s + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [category, onClose]);

  useEffect(() => {
    setSent(false);
    setError("");
    setSlide(0);
    setPaused(false);
  }, [category?.slug]);

  const slug = category?.slug as LifeModalSlug | undefined;
  const videoId = slug ? lifeModalVideoId(slug, baptismVideoId) : "";
  const videoKind = slug ? lifeModalVideoKind(slug) : "youtube";
  const blurb = slug ? lifeModalBlurb(slug) : "";
  const isBaptism = category?.slug === "baptism";
  const isDepartments = category?.slug === "departments";

  const slides = useMemo(
    () => (category ? buildSlides(category, blurb) : []),
    [category, blurb],
  );
  const total = slides.length;
  const activeSlide = total ? ((slide % total) + total) % total : 0;
  const current = slides[activeSlide];

  const go = useCallback(
    (next: number) => {
      if (!total) return;
      setPaused(true);
      setSlide(((next % total) + total) % total);
    },
    [total],
  );

  useEffect(() => {
    if (!category || !total || reduce || paused || showFollowup) return;
    const delay =
      current?.kind === "video" ? VIDEO_SLIDE_MS : SLIDE_MS;
    const id = window.setTimeout(() => {
      setSlide((s) => (s + 1) % total);
    }, delay);
    return () => window.clearTimeout(id);
  }, [category, current?.kind, paused, reduce, showFollowup, slide, total]);

  useEffect(() => {
    if (!paused || reduce) return;
    const id = window.setTimeout(() => setPaused(false), 12000);
    return () => window.clearTimeout(id);
  }, [paused, slide, reduce]);

  if (!mounted) return null;

  const onFollowup = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const parts = name.trim().split(/\s+/);
    const first = parts[0] || "Friend";
    const last = parts.slice(1).join(" ") || "Baptism";
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first,
          last,
          email,
          topic: "Baptism",
          message:
            "I want to join the family through baptism. Please follow up with next steps and baptism class details at my local branch.",
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Please check your details and try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Something went wrong. You can also use the contact page.");
    } finally {
      setBusy(false);
    }
  };

  const ctaHref = isBaptism
    ? "/life?open=baptism&followup=1"
    : isDepartments
      ? "/locations"
      : category?.cta.href ?? "/life";
  const ctaLabel = isBaptism
    ? "Join the family"
    : isDepartments
      ? "Find a branch"
      : category?.cta.label ?? "Learn more";

  return createPortal(
    <AnimatePresence>
      {category && slug && current ? (
        <motion.div
          className="life-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <button
            type="button"
            className="life-modal__scrim"
            aria-label="Close"
            onClick={onClose}
          />

          <motion.div
            className="life-modal__panel life-modal__panel--slides"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduce ? false : { opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="life-modal__toolbar">
              <p className="life-modal__toolbar-label">{category.badge}</p>
              <button
                type="button"
                className="life-modal__close"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={2.25} />
              </button>
            </div>

            <div className="life-modal__stage">
              <button
                type="button"
                className="life-modal__nav life-modal__nav--prev"
                onClick={() => go(activeSlide - 1)}
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${slug}-${activeSlide}`}
                  className={`life-modal__slide life-modal__slide--${current.kind}`}
                  initial={reduce ? false : { opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? undefined : { opacity: 0, x: -24 }}
                  transition={{ duration: 0.35 }}
                >
                  {current.kind === "video" ? (
                    <>
                      <div className="life-modal__clip">
                        {videoKind === "file" ? (
                          <video
                            className="life-modal__video"
                            src={videoId}
                            autoPlay
                            muted
                            loop
                            playsInline
                            poster="/videos/hero-a-poster.jpg"
                          />
                        ) : (
                          <iframe
                            src={youtubeEmbedSrc(videoId, { autoplay: true })}
                            title={`${category.title} | Kharis Life`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="life-modal__video"
                          />
                        )}
                      </div>
                      <div className="life-modal__slide-copy">
                        <h2 id={titleId} className="life-modal__title">
                          <LifeIcon
                            name={category.icon}
                            className="life-modal__ico"
                          />
                          {current.title}
                        </h2>
                        <p className="life-modal__intro life-modal__intro--short">
                          {current.blurb}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="life-modal__text-panel">
                      <h2 id={titleId} className="life-modal__title">
                        <LifeIcon
                          name={category.icon}
                          className="life-modal__ico"
                        />
                        {current.title}
                      </h2>
                      <p className="life-modal__intro">{current.body}</p>
                      {current.items?.length ? (
                        <ul className="life-modal__bullets">
                          {current.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <button
                type="button"
                className="life-modal__nav life-modal__nav--next"
                onClick={() => go(activeSlide + 1)}
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="life-modal__dots" aria-hidden>
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={i === activeSlide ? "is-on" : undefined}
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <div className="life-modal__body life-modal__body--slides">
              {isBaptism && showFollowup ? (
                <div className="life-modal__followup">
                  <p className="life-modal__followup-title">Join the family</p>
                  <p className="life-modal__followup-copy">
                    Leave your details and we will help you take the next step
                    toward baptism at your local branch.
                  </p>
                  {sent ? (
                    <p className="life-modal__followup-thanks">
                      Thank you. A member of the team will follow up soon.
                    </p>
                  ) : (
                    <form
                      className="life-modal__followup-form"
                      onSubmit={onFollowup}
                    >
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        aria-label="Your name"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-label="Email address"
                      />
                      <button type="submit" className="life-cta" disabled={busy}>
                        {busy ? "Sending…" : "Request follow-up"}
                      </button>
                      {error ? (
                        <p className="life-modal__followup-err">{error}</p>
                      ) : null}
                    </form>
                  )}
                </div>
              ) : (
                <div className="life-modal__actions">
                  <Link
                    href={ctaHref}
                    className="life-cta"
                    onClick={(e) => {
                      if (isBaptism) {
                        e.preventDefault();
                        onClose();
                        window.setTimeout(() => {
                          window.location.href =
                            "/life?open=baptism&followup=1";
                        }, 80);
                      } else {
                        onClose();
                      }
                    }}
                  >
                    {ctaLabel}
                    <Icon name="arrow" className="h-3.5 w-3.5" />
                  </Link>
                  {isDepartments ? (
                    <Link
                      href="/life/departments"
                      className="life-cta life-cta--quiet"
                      onClick={onClose}
                    >
                      See all departments
                    </Link>
                  ) : null}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
