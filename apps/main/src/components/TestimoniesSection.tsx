"use client";

import Image from "@/components/SiteImage";
import { type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { Reveal, RevealItem, RevealStagger } from "@/components/Reveal";
import siteImageUrls from "@/lib/site-image-urls.json";
import type { Testimony } from "@/lib/testimonies";

interface TestimoniesSectionProps {
  testimonies: Testimony[];
}

const photos = [
  {
    src: siteImageUrls["/images/testimony-sharing.jpg"],
    alt: "A brother sharing his testimony on stage",
    position: "object-center",
  },
  {
    src: "https://images.kharis.org/site-images/main/cc4f9c67e2c899e3/testimony-stage-1.jpg",
    alt: "A sister sharing her testimony on stage",
    position: "object-[12%_top]",
  },
  {
    src: siteImageUrls["/images/testimony-stage-2.jpg"],
    alt: "Celebrating together after a testimony is shared on stage",
    position: "object-[86%_top]",
  },
];

function excerpt(text: string, limit = 240) {
  const clean = text
    .trim()
    .replace(/^["“]+|["”]+$/g, "")
    .trim();
  return clean.length > limit ? `${clean.slice(0, limit - 3).trimEnd()}…` : clean;
}

export function TestimoniesSection({ testimonies }: TestimoniesSectionProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const interacting = useRef(false);
  const manualUntil = useRef(0);
  const [selected, setSelected] = useState<{ item: Testimony; accentIndex: number } | null>(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startScroll: 0,
    pointerId: -1,
  });

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || selected || testimonies.length < 2) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous = 0;
    let visible = false;
    let position = rail.scrollLeft;
    const animate = (time: number) => {
      const elapsed = previous ? Math.min(time - previous, 64) : 0;
      previous = time;
      if (
        visible &&
        !document.hidden &&
        !motion.matches &&
        !interacting.current &&
        !dragRef.current.active &&
        time >= manualUntil.current
      ) {
        const first = rail.querySelector<HTMLElement>(".testimony-card");
        const copy = rail.querySelector<HTMLElement>('[data-loop-copy="true"]');
        const cycle = first && copy ? copy.offsetLeft - first.offsetLeft : 0;
        if (Math.abs(rail.scrollLeft - position) > 2) position = rail.scrollLeft;
        if (cycle > 0) {
          position = (position + elapsed * 0.008) % cycle;
          rail.scrollTo({ left: position, behavior: "instant" });
        }
      } else {
        position = rail.scrollLeft;
      }
      if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(animate);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(animate);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    observer.observe(rail);
    document.addEventListener("visibilitychange", start);
    motion.addEventListener("change", start);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", start);
      motion.removeEventListener("change", start);
    };
  }, [selected, testimonies.length]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") {
      interacting.current = true;
      return;
    }
    if (e.button !== 0) return;
    const rail = railRef.current;
    if (!rail) return;
    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startScroll: rail.scrollLeft,
      pointerId: e.pointerId,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragRef.current;
    const rail = railRef.current;
    if (!state.active || !rail) return;
    const dx = e.clientX - state.startX;
    if (!state.moved && Math.abs(dx) > 6) {
      state.moved = true;
      rail.setPointerCapture?.(e.pointerId);
      rail.style.scrollSnapType = "none";
      rail.style.scrollBehavior = "auto";
    }
    if (state.moved) {
      rail.scrollLeft = state.startScroll - dx;
    }
  };

  const endPointerDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") {
      interacting.current = !!e.currentTarget.closest("section")?.contains(document.activeElement);
      return;
    }
    const state = dragRef.current;
    const rail = railRef.current;
    if (!state.active) return;
    state.active = false;
    if (rail && state.moved) {
      if (rail.hasPointerCapture?.(e.pointerId)) {
        rail.releasePointerCapture(e.pointerId);
      }
      rail.style.scrollSnapType = "";
      rail.style.scrollBehavior = "";
      window.setTimeout(() => {
        dragRef.current.moved = false;
      }, 60);
    }
  };

  const openCard = (item: Testimony, accentIndex: number) => {
    if (dragRef.current.moved) return;
    setSelected({ item, accentIndex });
  };

  return (
    <section
      id="testimonies"
      className="testimony-band section band band--0"
      onFocusCapture={(event) => {
        interacting.current = !!railRef.current?.contains(event.target);
      }}
      onBlurCapture={(event) => {
        interacting.current = !!railRef.current?.contains(event.relatedTarget);
      }}
    >
      <div className="section__inner">
        <Reveal variant="blur" className="mx-auto mb-5 max-w-2xl text-center md:mb-6">
          <p className="eyebrow">Changed Lives</p>
          <h2 className="section-title mt-2">Testimonies</h2>
        </Reveal>

        <RevealStagger className="grid gap-4 md:grid-cols-3 md:gap-5" stagger={0.12}>
          {photos.map((photo) => (
            <RevealItem key={photo.src} variant="scale" distance={40}>
              <figure className="group relative aspect-[3/4] overflow-hidden bg-bg-purple shadow-[var(--shadow-lift)]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className={`object-cover ${photo.position} transition duration-700 group-hover:scale-[1.03]`}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </figure>
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal variant="up" delay={0.08} className="mt-8 md:mt-10">
          {testimonies.length > 0 ? (
            <>
              <div className="testimony-viewport">
                <div
                  ref={railRef}
                  className="testimony-rail"
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={endPointerDrag}
                  onPointerCancel={endPointerDrag}
                >
                  {Array.from({ length: testimonies.length < 4 ? 4 : 2 }, () => testimonies)
                    .flat()
                    .map((item, i) => {
                      const accentIndex = ((i % testimonies.length) % 5) + 1;
                      const copy = i >= testimonies.length;
                      const shortText = item.short_description?.trim() || "";
                      const fullText = (item.description || "").trim();
                      const hasDistinctBody =
                        Boolean(shortText && fullText) &&
                        shortText.toLowerCase() !== fullText.toLowerCase();
                      const previewQuote = hasDistinctBody
                        ? excerpt(fullText, 210)
                        : excerpt(fullText || shortText, 260);

                      return (
                        <article
                          key={`${item.name}-${i}`}
                          role="button"
                          tabIndex={copy ? undefined : 0}
                          aria-hidden={copy || undefined}
                          data-loop-copy={copy || undefined}
                          aria-label={`Read full testimony from ${item.name}`}
                          onClick={() => openCard(item, accentIndex)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              openCard(item, accentIndex);
                            }
                          }}
                          className={`testimony-card testimony-card--clickable testimony-card--${accentIndex}`}
                        >
                          <span className="testimony-card__wall" aria-hidden />
                          <div className="testimony-card__ornament" aria-hidden>
                            <svg className="testimony-card__marks" viewBox="0 0 72 48" fill="none">
                              <path
                                d="M28.2 44.5C18.4 44.5 11 37.6 11 27.2 11 16.2 18.8 6.8 31.6 3.4c1.2-.3 2.4.6 2.4 1.9v2.1c0 1.1-.8 2-1.9 2.3-7.2 1.9-12.2 7.1-12.6 13.6 1.6-1.2 3.6-1.9 5.9-1.9 6.4 0 11 4.5 11 11.1 0 6.9-5 12-8.2 12Zm32.6 0C51 44.5 43.6 37.6 43.6 27.2c0-11 7.8-20.4 20.6-23.8 1.2-.3 2.4.6 2.4 1.9v2.1c0 1.1-.8 2-1.9 2.3-7.2 1.9-12.2 7.1-12.6 13.6 1.6-1.2 3.6-1.9 5.9-1.9 6.4 0 11 4.5 11 11.1 0 6.9-5 12-8.2 12Z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                          {hasDistinctBody ? (
                            <h3 className="testimony-card__title">{shortText}</h3>
                          ) : null}
                          <p className="testimony-card__quote">{previewQuote}</p>
                          <div className="testimony-card__footer">
                            <div className="testimony-card__meta">
                              <strong>{item.name}</strong>
                              <span>{item.branch_name}</span>
                            </div>
                            <span className="testimony-card__read">
                              Read full story <Icon name="arrow" className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </article>
                      );
                    })}
                </div>
              </div>
            </>
          ) : null}
        </Reveal>
      </div>

      {selected ? (
        <div
          className="testimony-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="testimony-modal-title"
          onClick={() => setSelected(null)}
        >
          <div
            className={`testimony-modal testimony-card--${selected.accentIndex}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="testimony-modal__close"
              aria-label="Close testimony"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <div className="testimony-card__ornament" aria-hidden>
              <svg className="testimony-card__marks" viewBox="0 0 72 48" fill="none">
                <path
                  d="M28.2 44.5C18.4 44.5 11 37.6 11 27.2 11 16.2 18.8 6.8 31.6 3.4c1.2-.3 2.4.6 2.4 1.9v2.1c0 1.1-.8 2-1.9 2.3-7.2 1.9-12.2 7.1-12.6 13.6 1.6-1.2 3.6-1.9 5.9-1.9 6.4 0 11 4.5 11 11.1 0 6.9-5 12-8.2 12Zm32.6 0C51 44.5 43.6 37.6 43.6 27.2c0-11 7.8-20.4 20.6-23.8 1.2-.3 2.4.6 2.4 1.9v2.1c0 1.1-.8 2-1.9 2.3-7.2 1.9-12.2 7.1-12.6 13.6 1.6-1.2 3.6-1.9 5.9-1.9 6.4 0 11 4.5 11 11.1 0 6.9-5 12-8.2 12Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            {selected.item.short_description?.trim() ? (
              <h3 id="testimony-modal-title" className="testimony-modal__title">
                {selected.item.short_description.trim()}
              </h3>
            ) : (
              <h3 id="testimony-modal-title" className="sr-only">
                Testimony from {selected.item.name}
              </h3>
            )}
            <div className="testimony-modal__body">
              {(selected.item.description?.trim() || selected.item.short_description?.trim() || "")
                .split(/\n{2,}|\r\n\r\n/)
                .filter(Boolean)
                .map((para, idx) => (
                  <p key={idx}>{para.trim()}</p>
                ))}
            </div>
            <div className="testimony-modal__meta">
              <strong>{selected.item.name}</strong>
              {selected.item.branch_name ? <span>{selected.item.branch_name}</span> : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
