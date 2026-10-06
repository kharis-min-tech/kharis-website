"use client";

import type { BranchSlide } from "@/lib/branch-slides";
import { BranchCarousel } from "@/components/BranchCarousel";
import { Reveal } from "@/components/Reveal";

type Props = {
  slides?: BranchSlide[];
};

export function VisitSection({ slides = [] }: Props) {
  const list = Array.isArray(slides) ? slides : [];

  return (
    <section id="who-we-are" className="visit-band">
      {/* Soft diagonal seam from Latest Messages into this section */}
      <div className="visit-band__seam" aria-hidden />
      <div className="visit-band__seam visit-band__seam--soft" aria-hidden />

      <div className="relative z-10 mx-auto max-w-7xl px-5 pt-10 md:px-8 md:pt-12">
        <Reveal
          variant="blur"
          className="mx-auto mb-5 max-w-2xl text-center md:mb-6"
        >
          <p className="eyebrow">This is Kharis</p>
          <h2 className="section-title mt-2">
            How <span className="kharis-word">Kharis</span> Looks
          </h2>
          <p className="mt-4 text-lg text-muted">
            A joyful, Christ-centred family shaped by the Word and marked by
            love.
          </p>
        </Reveal>
      </div>

      <Reveal variant="up" distance={40} className="relative z-10 w-full">
        <BranchCarousel slides={list} />
      </Reveal>

      <div className="relative z-10 pb-8 md:pb-10" aria-hidden />
    </section>
  );
}
