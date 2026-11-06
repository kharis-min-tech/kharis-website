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
      <div className="relative z-10 mx-auto max-w-7xl px-5 pt-10 md:px-8 md:pt-12">
        <Reveal variant="blur" className="mx-auto mb-5 max-w-2xl text-center md:mb-6">
          <h2 className="section-title">
            This is <span className="kharis-word">Kharis</span>
          </h2>
        </Reveal>
      </div>

      <Reveal variant="up" distance={40} className="relative z-10 w-full">
        <BranchCarousel slides={list} />
      </Reveal>

      <div className="relative z-10 pb-8 md:pb-10" aria-hidden />
    </section>
  );
}
