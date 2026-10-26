"use client";

import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRevealOnView } from "@/components/EventsTop";
import "./testimonies-band.css";

export type TestimonyItem = { quote: string; title?: string; name: string; meta: string };

const PHOTOS = [
  {
    src: "https://images.kharis.org/site-images/kp2/fb9675c9cc674137/testimony-1.jpg",
    alt: "Sharing a testimony at Kharis Phase 2",
    position: "center top",
  },
  {
    src: "https://images.kharis.org/site-images/kp2/2c9fe8d53a5b1d11/testimony-3.jpg",
    alt: "Giving glory to God in testimony at Kharis Phase 2",
    position: "center 20%",
  },
  {
    src: "https://images.kharis.org/site-images/kp2/f1508812f09a9ccd/testimony-2.jpg",
    alt: "Praising God and giving thanks at Kharis Phase 2",
    position: "center 25%",
  },
];

function cleanQuote(text: string) {
  return text
    .trim()
    .replace(/^["“]+|["”]+$/g, "")
    .trim();
}

function excerpt(text: string, limit = 240) {
  const clean = cleanQuote(text);
  return clean.length > limit ? `${clean.slice(0, limit - 3).trimEnd()}…` : clean;
}

export function TestimoniesBand({
  id,
  eyebrow,
  title,
  intro,
  items,
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  items: TestimonyItem[];
  className?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [revealRef, phase] = useRevealOnView<HTMLDivElement>(0.12);
  const [selected, setSelected] = useState<{ item: TestimonyItem; accentIndex: number } | null>(
    null,
  );
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

  const scrollByCard = (dir: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>(".kp-tst__card");
    const gap =
      parseFloat(getComputedStyle(rail).columnGap || getComputedStyle(rail).gap || "20") || 20;
    const step = (card?.offsetWidth ?? 300) + gap;
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    if (maxScroll <= 2) return;
    const edge = 8;

    if (dir === 1) {
      if (rail.scrollLeft >= maxScroll - edge) {
        rail.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        rail.scrollTo({ left: Math.min(maxScroll, rail.scrollLeft + step), behavior: "smooth" });
      }
      return;
    }

    if (rail.scrollLeft <= edge) {
      rail.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      rail.scrollTo({ left: Math.max(0, rail.scrollLeft - step), behavior: "smooth" });
    }
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch" || e.button !== 0) return;
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

  const openCard = (item: TestimonyItem, accentIndex: number) => {
    if (dragRef.current.moved) return;
    setSelected({ item, accentIndex });
  };

  return (
    <section
      id={id}
      className={className ? `kp-tst ${className}` : "kp-tst"}
      aria-labelledby={`${id}-title`}
    >
      <div ref={revealRef} className={`kp-tst__inner is-${phase}`}>
        <header className="kp-tst__head">
          <p className="kp-tst__eyebrow">{eyebrow}</p>
          <h2 id={`${id}-title`} className="kp-tst__title">
            {title}
          </h2>
          {intro ? <p className="kp-tst__intro">{intro}</p> : null}
        </header>

        <div className="kp-tst__photos">
          {PHOTOS.map((photo, i) => (
            <figure key={photo.src} className="kp-tst__photo" style={{ "--i": i } as CSSProperties}>
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: photo.position }}
              />
            </figure>
          ))}
        </div>

        {items.length > 0 ? (
          <>
            <div className="kp-tst__family">
              <p className="kp-tst__family-kicker">From the family</p>
              <p className="kp-tst__family-sub">Real stories of what Jesus is doing.</p>
            </div>

            <div className="kp-tst__viewport">
              <div
                ref={railRef}
                className="kp-tst__rail"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endPointerDrag}
                onPointerCancel={endPointerDrag}
              >
                {items.map((item, i) => {
                  const accentIndex = (i % 5) + 1;
                  return (
                    <article
                      key={`${item.name}-${i}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`Read full testimony from ${item.name}`}
                      onClick={() => openCard(item, accentIndex)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openCard(item, accentIndex);
                        }
                      }}
                      className={`kp-tst__card kp-tst__card--clickable kp-tst__card--${accentIndex}`}
                    >
                      <svg
                        className="kp-tst__marks"
                        viewBox="0 0 72 48"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M28.2 44.5C18.4 44.5 11 37.6 11 27.2 11 16.2 18.8 6.8 31.6 3.4c1.2-.3 2.4.6 2.4 1.9v2.1c0 1.1-.8 2-1.9 2.3-7.2 1.9-12.2 7.1-12.6 13.6 1.6-1.2 3.6-1.9 5.9-1.9 6.4 0 11 4.5 11 11.1 0 6.9-5 12-8.2 12Zm32.6 0C51 44.5 43.6 37.6 43.6 27.2c0-11 7.8-20.4 20.6-23.8 1.2-.3 2.4.6 2.4 1.9v2.1c0 1.1-.8 2-1.9 2.3-7.2 1.9-12.2 7.1-12.6 13.6 1.6-1.2 3.6-1.9 5.9-1.9 6.4 0 11 4.5 11 11.1 0 6.9-5 12-8.2 12Z"
                          fill="currentColor"
                        />
                      </svg>
                      {item.title ? <h3 className="kp-tst__card-title">{item.title}</h3> : null}
                      <p className="kp-tst__quote">{excerpt(item.quote)}</p>
                      <div className="kp-tst__footer">
                        <div className="kp-tst__meta">
                          <strong>{item.name}</strong>
                          <span>{item.meta}</span>
                        </div>
                        <span className="kp-tst__read">Read full story →</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {items.length > 1 ? (
              <div className="kp-tst__arrows">
                <button
                  type="button"
                  className="kp-tst__arrow"
                  aria-label="Previous testimonies"
                  onClick={() => scrollByCard(-1)}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    arrow_back
                  </span>
                </button>
                <button
                  type="button"
                  className="kp-tst__arrow"
                  aria-label="Next testimonies"
                  onClick={() => scrollByCard(1)}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    arrow_forward
                  </span>
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <p className="kp-tst__empty">
            Stories from the family will land here as people share what God is doing.
          </p>
        )}
      </div>

      {selected ? (
        <div
          className="kp-tst__modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-modal-title`}
          onClick={() => setSelected(null)}
        >
          <div
            className={`kp-tst__modal kp-tst__card--${selected.accentIndex}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="kp-tst__modal-close"
              aria-label="Close testimony"
              onClick={() => setSelected(null)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5 5l14 14M19 5 5 19" />
              </svg>
            </button>
            <svg className="kp-tst__marks" viewBox="0 0 72 48" fill="none" aria-hidden="true">
              <path
                d="M28.2 44.5C18.4 44.5 11 37.6 11 27.2 11 16.2 18.8 6.8 31.6 3.4c1.2-.3 2.4.6 2.4 1.9v2.1c0 1.1-.8 2-1.9 2.3-7.2 1.9-12.2 7.1-12.6 13.6 1.6-1.2 3.6-1.9 5.9-1.9 6.4 0 11 4.5 11 11.1 0 6.9-5 12-8.2 12Zm32.6 0C51 44.5 43.6 37.6 43.6 27.2c0-11 7.8-20.4 20.6-23.8 1.2-.3 2.4.6 2.4 1.9v2.1c0 1.1-.8 2-1.9 2.3-7.2 1.9-12.2 7.1-12.6 13.6 1.6-1.2 3.6-1.9 5.9-1.9 6.4 0 11 4.5 11 11.1 0 6.9-5 12-8.2 12Z"
                fill="currentColor"
              />
            </svg>
            {selected.item.title ? (
              <h3 id={`${id}-modal-title`} className="kp-tst__modal-title">
                {selected.item.title}
              </h3>
            ) : (
              <h3 id={`${id}-modal-title`} className="sr-only">
                Testimony from {selected.item.name}
              </h3>
            )}
            <div className="kp-tst__modal-body">
              {cleanQuote(selected.item.quote)
                .split(/\n{2,}|\r\n\r\n/)
                .filter(Boolean)
                .map((para, idx) => (
                  <p key={idx}>{para.trim()}</p>
                ))}
            </div>
            <div className="kp-tst__modal-meta">
              <strong>{selected.item.name}</strong>
              <span>{selected.item.meta}</span>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
