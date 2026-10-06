"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TestimonyQuote } from "@/components/TestimonyQuote";

export type Testimonial = {
  quote: string;
  name: string;
  location: string;
  color: string;
  pattern: string;
  patternSize: string;
};

const AUTOPLAY_MS = 5000;

function usePerView() {
  const [perView, setPerView] = useState(1);
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setPerView(w >= 1024 ? 3 : w >= 768 ? 2 : 1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return perView;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const perView = usePerView();
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reading, setReading] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const maxIndex = Math.max(0, testimonials.length - perView);
  const slideCount = maxIndex + 1;

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % slideCount) + slideCount) % slideCount);
    },
    [slideCount],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || reading || reducedMotion || slideCount <= 1) return;
    const id = window.setTimeout(() => {
      setIndex((i) => (i + 1) % slideCount);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
    // `index` in deps resets the timer on manual navigation
  }, [index, paused, reading, reducedMotion, slideCount]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  const dots = useMemo(() => Array.from({ length: slideCount }, (_, i) => i), [slideCount]);

  return (
    <div>
      <div
        className="relative overflow-hidden pb-2 pt-2"
        role="region"
        aria-roledescription="carousel"
        aria-label="Testimonials"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onTouchStart={(e) => {
          setPaused(true);
          touchStartX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current;
          const end = e.changedTouches[0]?.clientX ?? null;
          if (start !== null && end !== null) {
            const delta = end - start;
            if (Math.abs(delta) > 40) (delta < 0 ? next : prev)();
          }
          touchStartX.current = null;
          setPaused(false);
        }}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(-${index * (100 / perView)}%)`,
            transition: reducedMotion ? "none" : "transform 550ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="shrink-0 px-2 md:px-3"
              style={{ width: `${100 / perView}%` }}
              aria-hidden={i < index || i >= index + perView}
            >
              <div className="h-full bg-white dark:bg-[#1f1c24] brutalist-border brutalist-shadow p-5 sm:p-7 md:p-9 relative overflow-hidden flex flex-col transition-colors duration-300">
                <div
                  className="absolute inset-0 opacity-40 dark:opacity-20"
                  style={{ backgroundImage: t.pattern, backgroundSize: t.patternSize }}
                />
                <div className="absolute top-0 left-0 h-3 w-full" style={{ backgroundColor: t.color }} />
                <div className="relative z-10 flex flex-col flex-1 pt-4">
                  <span
                    className="font-display-xl leading-none testimonial-accent"
                    style={{ color: t.color, fontSize: "clamp(2.75rem, 8vw, 4.5rem)" }}
                  >
                    &ldquo;
                  </span>
                  <div
                    className="flex-1 -mt-2"
                    style={{ fontSize: "clamp(1rem, 3.4vw, 1.25rem)" }}
                  >
                    <TestimonyQuote
                      quote={t.quote}
                      name={t.name}
                      meta={t.location}
                      className="font-body-md text-gray-800 dark:text-[#ece6f0] leading-relaxed transition-colors duration-300"
                      onOpenChange={setReading}
                    />
                  </div>
                  <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t-4 border-gray-900 dark:border-[#e8e0e9]">
                    <p
                      className="font-display-xl uppercase text-gray-900 dark:text-[#e8e0e9] transition-colors duration-300"
                      style={{ fontSize: "clamp(1rem, 3vw, 1.25rem)" }}
                    >
                      {t.name}
                    </p>
                    <p
                      className="font-label-comic uppercase tracking-[0.15em] testimonial-accent"
                      style={{ color: t.color, fontSize: "clamp(0.65rem, 2.2vw, 0.75rem)" }}
                    >
                      {t.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:justify-start gap-5 mt-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={prev}
            className="w-14 h-14 min-w-11 min-h-11 bg-[#ffd400] text-gray-900 brutalist-border brutalist-shadow flex items-center justify-center"
            aria-label="Previous testimonial"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button
            type="button"
            onClick={next}
            className="w-14 h-14 min-w-11 min-h-11 bg-[#ffd400] text-gray-900 brutalist-border brutalist-shadow flex items-center justify-center"
            aria-label="Next testimonial"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {dots.map((i) => {
            const active = i === index;
            return (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={active ? "true" : undefined}
                className="h-11 min-w-11 flex items-center justify-center px-1"
              >
                <span
                  className="block h-3 border-2 border-gray-900 dark:border-[#e8e0e9] transition-all duration-300"
                  style={{
                    width: active ? "2.25rem" : "0.75rem",
                    backgroundColor: active ? testimonials[i]!.color : "transparent",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
