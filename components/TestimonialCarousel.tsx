"use client";

import { TestimonyQuote } from "@/components/TestimonyQuote";

export type Testimonial = {
  quote: string;
  name: string;
  location: string;
  color: string;
};

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div data-stories>
      <div
        data-stories-viewport
        className="no-scrollbar flex snap-x snap-mandatory gap-0 overflow-x-auto scroll-smooth pb-2 pt-2"
        role="region"
        aria-roledescription="carousel"
        aria-label="Testimonials"
      >
        {testimonials.map((t, i) => (
          <div
            key={`${t.name}-${i}`}
            data-stories-card
            className="min-w-0 shrink-0 grow-0 basis-full snap-start px-2 md:basis-1/2 md:px-3 lg:basis-1/3"
          >
            <div className="relative flex h-full min-h-[22rem] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-5 sm:p-7 md:p-9">
              <div
                className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full opacity-50 blur-3xl"
                style={{ backgroundColor: t.color }}
              />
              <div className="relative z-10 flex flex-1 flex-col">
                <span
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${t.color}22`, color: t.color }}
                >
                  <span className="material-symbols-outlined text-3xl" data-weight="fill">
                    format_quote
                  </span>
                </span>
                <div className="flex-1" style={{ fontSize: "clamp(1rem, 3.4vw, 1.25rem)" }}>
                  <TestimonyQuote
                    quote={t.quote}
                    name={t.name}
                    meta={t.location}
                    className="font-body-md leading-relaxed text-white/85"
                    moreClassName="mt-4 font-label-md uppercase tracking-widest text-amber hover:underline"
                  />
                </div>
                <div className="mt-6 border-t border-white/10 pt-4 sm:mt-8 sm:pt-5">
                  <p
                    className="font-display-xl uppercase text-white"
                    style={{ fontSize: "clamp(1rem, 3vw, 1.25rem)" }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="mt-1 font-label-comic uppercase tracking-[0.15em]"
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

      <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row sm:justify-start">
        <div className="flex items-center gap-4">
          <button
            type="button"
            data-ui="stories-prev"
            className="flex h-14 w-14 min-h-11 min-w-11 items-center justify-center rounded-full bg-amber text-[#1a0b00] vibe-glow"
            aria-label="Previous testimonial"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button
            type="button"
            data-ui="stories-next"
            className="flex h-14 w-14 min-h-11 min-w-11 items-center justify-center rounded-full bg-amber text-[#1a0b00] vibe-glow"
            aria-label="Next testimonial"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
