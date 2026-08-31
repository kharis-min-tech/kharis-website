"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { Reveal, RevealItem, RevealStagger } from "@/components/Reveal";
import { TestimonyFormModal } from "@/components/TestimonyFormModal";

const photos = [
  {
    src: "/images/testimony-1.jpg",
    alt: "Sunday service testimony moment",
  },
  {
    src: "/images/testimony-2.jpg",
    alt: "Joy in the house of the Lord",
  },
  {
    src: "/images/testimony-3.jpg",
    alt: "Kharis family worshipping together",
  },
];

const TESTIMONIES = [
  {
    quote:
      "Christ found me when I had nothing left. Through Kharis I learned to trust Jesus again, and my home has peace.",
    name: "Amaka O.",
    place: "London",
  },
  {
    quote:
      "I came broken, and God met me in the Word. Jesus healed what counselling alone could not. Glory to God.",
    name: "James T.",
    place: "Birmingham",
  },
  {
    quote:
      "Sunday after Sunday, Christ has been strengthening my faith. I am not the same person who first walked through those doors.",
    name: "Grace A.",
    place: "Brighton",
  },
  {
    quote:
      "The gospel was preached clearly, and I gave my life to Jesus. His grace carried me through the darkest season of my life.",
    name: "Daniel K.",
    place: "Accra",
  },
  {
    quote:
      "Prayer, the Word, and the love of the brethren pointed me to Christ. He restored my marriage and my hope.",
    name: "Sarah M.",
    place: "Croydon",
  },
  {
    quote:
      "I used to live for myself. Now I live for Jesus. Kharis helped me see that Christ alone is enough.",
    name: "Michael B.",
    place: "Luton",
  },
  {
    quote:
      "In worship I met Jesus afresh. He lifted my anxiety and filled me with His peace and joy.",
    name: "Ruth N.",
    place: "Nottingham",
  },
  {
    quote:
      "The teaching pointed me to Christ crucified. I was baptised and now serve gladly in my local branch.",
    name: "Peter O.",
    place: "Coventry",
  },
];

export function TestimoniesSection() {
  const railRef = useRef<HTMLDivElement>(null);
  const [formOpen, setFormOpen] = useState(false);

  const openForm = useCallback(() => setFormOpen(true), []);
  const closeForm = useCallback(() => {
    setFormOpen(false);
    if (window.location.hash === "#share-testimony") {
      window.history.replaceState({}, "", window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {
    const sync = () => {
      if (window.location.hash === "#share-testimony") setFormOpen(true);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

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
        <Reveal variant="blur" className="mb-5 max-w-2xl md:mb-6">
          <p className="eyebrow">Stories</p>
          <h2 className="section-title mt-2">Testimonies</h2>
          <p className="mt-4 text-lg font-semibold text-muted md:text-xl">
            This is an opportunity for you to give glory to God.
          </p>
        </Reveal>

        <RevealStagger
          className="grid gap-4 md:grid-cols-3 md:gap-5"
          stagger={0.12}
        >
          {photos.map((photo) => (
            <RevealItem key={photo.src} variant="scale" distance={40}>
              <figure className="group relative aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-bg-purple shadow-[var(--shadow-lift)]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover object-top transition duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              </figure>
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal variant="up" delay={0.08} className="mt-8 md:mt-10">
          <div className="mb-5">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-purple">
              From the family
            </p>
            <p className="mt-1 text-base font-semibold text-muted">
              Real stories of what Jesus is doing.
            </p>
          </div>

          <div className="testimony-viewport">
            <div ref={railRef} className="testimony-rail">
              {TESTIMONIES.map((item, i) => (
                <article
                  key={item.name}
                  className={`testimony-card testimony-card--${(i % 5) + 1}`}
                >
                  <span className="testimony-card__wall" aria-hidden />
                  <div className="testimony-card__ornament" aria-hidden>
                    <svg
                      className="testimony-card__marks"
                      viewBox="0 0 72 48"
                      fill="none"
                    >
                      <path
                        d="M28.2 44.5C18.4 44.5 11 37.6 11 27.2 11 16.2 18.8 6.8 31.6 3.4c1.2-.3 2.4.6 2.4 1.9v2.1c0 1.1-.8 2-1.9 2.3-7.2 1.9-12.2 7.1-12.6 13.6 1.6-1.2 3.6-1.9 5.9-1.9 6.4 0 11 4.5 11 11.1 0 6.9-5 12-8.2 12Zm32.6 0C51 44.5 43.6 37.6 43.6 27.2c0-11 7.8-20.4 20.6-23.8 1.2-.3 2.4.6 2.4 1.9v2.1c0 1.1-.8 2-1.9 2.3-7.2 1.9-12.2 7.1-12.6 13.6 1.6-1.2 3.6-1.9 5.9-1.9 6.4 0 11 4.5 11 11.1 0 6.9-5 12-8.2 12Z"
                        fill="currentColor"
                      />
                    </svg>
                    <svg
                      className="testimony-card__star testimony-card__star--a"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 1.4 13.8 9.2 21.6 11 13.8 12.8 12 20.6 10.2 12.8 2.4 11 10.2 9.2 12 1.4Z"
                        fill="currentColor"
                      />
                    </svg>
                    <svg
                      className="testimony-card__star testimony-card__star--b"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 3.2 13.1 9.1 19 10.2 13.1 11.3 12 17.2 10.9 11.3 5 10.2 10.9 9.1 12 3.2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <p className="testimony-card__quote">{item.quote}</p>
                  <div className="testimony-card__meta">
                    <strong>{item.name}</strong>
                    <span>{item.place}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-5">
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

            <button type="button" className="btn-testimony" onClick={openForm}>
              Share Your Testimony
            </button>
          </div>

          <p className="mt-4 max-w-xl text-center text-sm font-medium text-muted/80 mx-auto">
            Has Jesus done something in your life? Share it and give Him glory.
          </p>
        </Reveal>
      </div>

      <TestimonyFormModal open={formOpen} onClose={closeForm} />
    </section>
  );
}
