"use client";

import Image from "@/components/SiteImage";
import { useRef } from "react";
import { Icon } from "@/components/Icon";
import { Reveal, RevealItem, RevealStagger } from "@/components/Reveal";
import type { Testimony } from "@/lib/testimonies";

interface TestimoniesSectionProps {
  testimonies: Testimony[];
}
const photos = [
  {
    src: "https://images.kharis.org/site-images/main/79c0eac25d6bc370/testimony-sharing.jpg",
    alt: "Sharing a testimony on stage",
    position: "object-center",
  },
  {
    src: "https://images.kharis.org/site-images/main/cc4f9c67e2c899e3/testimony-stage-1.jpg",
    alt: "A sister sharing her testimony on stage",
    position: "object-[12%_top]",
  },
  {
    src: "https://images.kharis.org/site-images/main/bb1a12396469052d/testimony-stage-2.jpg",
    alt: "Giving glory to God in testimony",
    position: "object-[86%_top]",
  },
];

export function TestimoniesSection({ testimonies }: TestimoniesSectionProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const scrollByCard = (dir: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>(".testimony-card");
    const step = (card?.offsetWidth ?? 300) + 16;
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const next = rail.scrollLeft + dir * step;
    const edge = 8;

    if (dir === 1 && next >= maxScroll - edge) {
      rail.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    if (dir === -1 && next <= edge) {
      rail.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }

    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="testimonies" className="testimony-band px-5 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <Reveal variant="blur" className="mx-auto mb-5 max-w-2xl text-center md:mb-6">
          <p className="eyebrow">Stories</p>
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
              <div className="mb-5 text-center">
                <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-purple">
                  From the family
                </p>
                <p className="mt-1 text-base font-semibold text-muted">
                  Real stories of what Jesus is doing.
                </p>
              </div>

              <div className="testimony-viewport">
                <div ref={railRef} className="testimony-rail">
                  {testimonies.map((item, i) => (
                    <article
                      key={`${item.name}-${i}`}
                      className={`testimony-card testimony-card--${(i % 5) + 1}`}
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
                      <p className="testimony-card__quote">
                        {item.short_description?.trim() ||
                          (item.description.length > 280
                            ? `${item.description.slice(0, 277).trimEnd()}…`
                            : item.description)}
                      </p>
                      <div className="testimony-card__meta">
                        <strong>{item.name}</strong>
                        <span>{item.branch_name}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          <div className="mt-6 flex flex-col items-center gap-5">
            {testimonies.length > 1 ? (
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  aria-label="Previous testimonies"
                  onClick={() => scrollByCard(-1)}
                  className="testimony-arrow"
                >
                  <Icon name="arrow" className="h-5 w-5 rotate-180" />
                </button>
                <button
                  type="button"
                  aria-label="Next testimonies"
                  onClick={() => scrollByCard(1)}
                  className="testimony-arrow"
                >
                  <Icon name="arrow" className="h-5 w-5" />
                </button>
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
