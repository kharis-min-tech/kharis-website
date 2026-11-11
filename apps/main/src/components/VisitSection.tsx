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
    <section id="who-we-are" className="visit-band band band--1">
      {/* The carousel is full-bleed, so the band's own padding stops above it
          and the lower half is spaced by the section's bottom pad instead. */}
      <div className="section section--flush-bottom relative z-10">
        <div className="section__inner">
          <Reveal variant="blur" className="mx-auto max-w-2xl text-center">
            <h2 className="section-title">
              This is <span className="kharis-word">Kharis</span>
            </h2>
          </Reveal>
        </div>
      </div>

      <Reveal variant="up" distance={40} className="relative z-10 mt-6 w-full md:mt-8">
        <BranchCarousel slides={list} />
      </Reveal>

      <div className="section section--flush-top" aria-hidden />
    </section>
  );
}
