"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Reveal, RevealItem, RevealStagger } from "@/components/Reveal";
import { TestimonyFormModal } from "@/components/TestimonyFormModal";

const photos = [
  {
    src: "/images/testimony-sharing.jpg",
    alt: "Sharing a testimony on stage",
    position: "object-center",
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

        <Reveal
          variant="up"
          delay={0.08}
          className="mt-8 flex flex-col items-center gap-4 text-center md:mt-10"
        >
          <button type="button" className="btn-testimony" onClick={openForm}>
            Share Your Testimony
          </button>
          <p className="max-w-xl text-sm font-medium text-muted/80">
            Has Jesus done something in your life? Share it and give Him glory.
          </p>
        </Reveal>
      </div>

      <TestimonyFormModal open={formOpen} onClose={closeForm} />
    </section>
  );
}
