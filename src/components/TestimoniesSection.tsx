"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Reveal, RevealItem, RevealStagger } from "@/components/Reveal";
import { TestimonyFormModal } from "@/components/TestimonyFormModal";

/** Landscape stage shots are cropped into portrait cards; `position` keeps the person testifying in frame. */
const photos = [
  {
    src: "/images/testimony-1.jpg",
    alt: "Sunday service testimony moment",
    position: "object-top",
  },
  {
    src: "/images/testimony-stage-1.jpg",
    alt: "A sister sharing her testimony on stage",
    position: "object-[12%_top]",
  },
  {
    src: "/images/testimony-stage-2.jpg",
    alt: "Giving glory to God in testimony",
    position: "object-[86%_top]",
  },
];

export function TestimoniesSection() {
  const [formOpen, setFormOpen] = useState(false);

  const openForm = useCallback(() => setFormOpen(true), []);
  const closeForm = useCallback(() => {
    setFormOpen(false);
    if (window.location.hash === "#share-testimony") {
      window.history.replaceState(
        {},
        "",
        window.location.pathname + window.location.search,
      );
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

  return (
    <section
      id="testimonies"
      className="testimony-band px-5 py-8 md:px-8 md:py-10"
    >
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
                  className={`object-cover ${photo.position} transition duration-700 group-hover:scale-[1.03]`}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              </figure>
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal variant="up" delay={0.08} className="mt-8 md:mt-10">
          <div className="flex flex-col items-center gap-5">
            <button type="button" className="btn-testimony" onClick={openForm}>
              Share Your Testimony
            </button>
          </div>

          <p className="mt-4 max-w-xl text-center text-sm font-medium text-muted mx-auto">
            Has Jesus done something in your life? Share it and give Him glory.
          </p>
        </Reveal>
      </div>

      <TestimonyFormModal open={formOpen} onClose={closeForm} />
    </section>
  );
}
