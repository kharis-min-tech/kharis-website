"use client";

import Link from "next/link";
import { BRANCHES } from "@/lib/locations";
import type { BranchSlide } from "@/lib/branch-slides";
import { BranchCarousel } from "@/components/BranchCarousel";
import { Reveal } from "@/components/Reveal";

type Props = {
  slides?: BranchSlide[];
};

export function VisitSection({ slides = [] }: Props) {
  const list = Array.isArray(slides) ? slides : [];

  return (
    <section id="near-you" className="visit-band">
      {/* Soft diagonal seam from Latest Messages into this section */}
      <div className="visit-band__seam" aria-hidden />
      <div className="visit-band__seam visit-band__seam--soft" aria-hidden />

      <div className="relative z-10 mx-auto max-w-7xl px-5 pt-10 md:px-8 md:pt-12">
        <Reveal
          variant="blur"
          className="mx-auto mb-5 max-w-2xl text-center md:mb-6"
        >
          <p className="eyebrow">Visit us</p>
          <h2 className="section-title mt-2">
            <span className="kharis-word">Kharis</span> Near You
          </h2>
          <p className="mt-4 text-lg text-muted">
            There is a seat for you this Sunday. Find your local branch in one
            click.
          </p>
        </Reveal>
      </div>

      <Reveal variant="up" distance={40} className="relative z-10 w-full">
        <BranchCarousel slides={list} />
      </Reveal>

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-6 md:px-8 md:pb-8">
        <Reveal variant="fade" delay={0.15} className="mt-6 text-center">
          <details>
            <summary className="cursor-pointer text-sm font-semibold text-purple">
              View all {BRANCHES.length} branches
            </summary>
            <p className="mt-3">
              <Link href="/locations" className="text-sm font-semibold text-purple underline underline-offset-4">
                Open full locations directory
              </Link>
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {BRANCHES.map((branch) => (
                <a
                  key={branch.name}
                  href={branch.href}
                  className="max-w-xs rounded-2xl border border-line bg-white px-3.5 py-2.5 text-left text-sm font-medium text-fg-soft transition hover:border-purple hover:text-purple"
                >
                  <span className="block font-semibold">{branch.name}</span>
                  {branch.address ? (
                    <span className="mt-0.5 block text-[0.7rem] font-medium leading-snug text-muted">
                      {branch.address}
                    </span>
                  ) : null}
                </a>
              ))}
            </div>
          </details>
        </Reveal>
      </div>
    </section>
  );
}
