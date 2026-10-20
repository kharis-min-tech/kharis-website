"use client";

import { type CSSProperties, useRef } from "react";
import { useRevealOnView } from "@/components/EventsTop";
import "./testimonies-band.css";

export type TestimonyItem = { quote: string; name: string; meta: string };

const PHOTOS = [
  {
    src: "https://images.kharis.org/site-images/main/79c0eac25d6bc370/testimony-sharing.jpg",
    alt: "Sharing a testimony on stage",
    position: "center",
  },
  {
    src: "https://images.kharis.org/site-images/main/cc4f9c67e2c899e3/testimony-stage-1.jpg",
    alt: "A sister sharing her testimony on stage",
    position: "12% top",
  },
  {
    src: "https://images.kharis.org/site-images/main/bb1a12396469052d/testimony-stage-2.jpg",
    alt: "Giving glory to God in testimony",
    position: "86% top",
  },
];

function excerpt(text: string) {
  const clean = text
    .trim()
    .replace(/^["“]+|["”]+$/g, "")
    .trim();
  return clean.length > 280 ? `${clean.slice(0, 277).trimEnd()}…` : clean;
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

  const scrollByCard = (dir: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>(".kp-tst__card");
    const step = (card?.offsetWidth ?? 300) + 20;
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const next = rail.scrollLeft + dir * step;
    if (dir === 1 && next >= maxScroll - 8) {
      rail.scrollTo({ left: 0, behavior: "smooth" });
    } else if (dir === -1 && next <= 8) {
      rail.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      rail.scrollBy({ left: dir * step, behavior: "smooth" });
    }
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
              <div ref={railRef} className="kp-tst__rail">
                {items.map((item, i) => (
                  <article
                    key={`${item.name}-${i}`}
                    className={`kp-tst__card kp-tst__card--${(i % 5) + 1}`}
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
                    <p className="kp-tst__quote">{excerpt(item.quote)}</p>
                    <div className="kp-tst__meta">
                      <strong>{item.name}</strong>
                      <span>{item.meta}</span>
                    </div>
                  </article>
                ))}
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
    </section>
  );
}
