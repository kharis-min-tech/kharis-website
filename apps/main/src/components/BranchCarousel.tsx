"use client";

import Image from "@/components/SiteImage";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { BranchSlide } from "@/lib/branch-slides";

const INTERVAL_MS = 4200;

type Props = {
  slides?: BranchSlide[];
};

export function BranchCarousel({ slides }: Props) {
  const list = useMemo(() => (Array.isArray(slides) ? slides : []), [slides]);
  const n = list.length;

  // Triple the reel so the loop never “ends”
  const reel = useMemo(() => {
    if (!n) return [] as BranchSlide[];
    return [...list, ...list, ...list];
  }, [list, n]);

  // Start in the middle copy
  const [index, setIndex] = useState(n);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);

  // Keep middle-band index if slides length changes
  useEffect(() => {
    if (!n) return;
    setIndex(n);
  }, [n]);

  const realIndex = n ? ((index % n) + n) % n : 0;

  const go = useCallback(
    (next: number) => {
      if (!n) return;
      setAnimate(true);
      setIndex(next);
    },
    [n],
  );

  // Seamless wrap: when we leave the middle band, jump without animation
  useEffect(() => {
    if (!n) return;
    if (index >= n * 2) {
      const t = window.setTimeout(() => {
        setAnimate(false);
        setIndex(index - n);
      }, 760);
      return () => window.clearTimeout(t);
    }
    if (index < n) {
      const t = window.setTimeout(() => {
        setAnimate(false);
        setIndex(index + n);
      }, 760);
      return () => window.clearTimeout(t);
    }
  }, [index, n]);

  useEffect(() => {
    if (!animate) {
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }
  }, [animate]);

  // Reduced motion: start paused.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);

  useEffect(() => {
    if (n < 2 || paused || hovering) return;
    const id = window.setInterval(() => go(index + 1), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [n, index, go, paused, hovering]);

  if (!n) return null;

  return (
    <div
      className="apple-carousel"
      id="who-we-are-carousel"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      <div className="apple-carousel__viewport">
        <div
          className="apple-carousel__track"
          style={{
            transform: `translateX(calc(50% - ${index} * (var(--slide-w) + var(--slide-gap)) - var(--slide-w) / 2))`,
            transition: animate ? "transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
          }}
        >
          {reel.map((slide, i) => {
            const active = i === index;
            return (
              <article
                key={`${slide.name}-${i}`}
                className={`apple-slide${active ? " apple-slide--active" : ""}`}
                onClick={() => go(i)}
                role="group"
                aria-roledescription="slide"
                // Only the middle copy of the reel is read out.
                aria-hidden={i < n || i >= n * 2 || undefined}
                aria-label={`${slide.title}: ${slide.subtitle}`}
              >
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  unoptimized={slide.image.startsWith("/images/")}
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 86vw, 1000px"
                  quality={95}
                  priority={i === n}
                />
                <div className="apple-slide__scrim" />

                <div className="apple-slide__brand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.kharis.org/site-images/main/113a6a24b1d3741b/kharis-logo.png"
                    alt=""
                    className="h-7 w-7 object-contain drop-shadow md:h-8 md:w-8"
                  />
                  <span className="font-[family-name:var(--font-display)] text-sm font-extrabold tracking-tight text-white drop-shadow md:text-base">
                    Kharis
                  </span>
                </div>

                <div className="apple-slide__copy">
                  <h3 className="apple-slide__title" style={{ color: slide.accent }}>
                    {slide.title}
                  </h3>
                  <p className="apple-slide__meta">{slide.subtitle}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="apple-carousel__controls">
        <button
          type="button"
          className="apple-carousel__pause"
          aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          aria-pressed={paused}
          onClick={() => setPaused((v) => !v)}
        >
          {paused ? (
            <svg viewBox="0 0 12 12" aria-hidden className="h-3 w-3">
              <path d="M2.5 1.2v9.6L10.5 6z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 12 12" aria-hidden className="h-3 w-3">
              <path d="M2 1.5h3v9H2zM7 1.5h3v9H7z" fill="currentColor" />
            </svg>
          )}
        </button>
        <div className="apple-carousel__dots" role="tablist" aria-label="Who we are">
          {list.map((slide, i) => (
            <button
              key={slide.name}
              type="button"
              role="tab"
              aria-selected={i === realIndex}
              aria-label={slide.title}
              className={`apple-dot${i === realIndex ? " apple-dot--active" : ""}`}
              onClick={() => go(n + i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
