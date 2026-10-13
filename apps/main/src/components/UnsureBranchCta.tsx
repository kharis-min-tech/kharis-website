"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export function UnsureBranchCta() {
  return (
    <section className="unsure-band px-5 py-10 md:px-8 md:py-12">
      <Reveal variant="up" distance={36} className="mx-auto max-w-7xl">
        <div className="unsure-panel">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/kharis-logo.png" alt="" aria-hidden className="unsure-panel__dove" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/kharis-globe.svg" alt="" aria-hidden className="unsure-panel__map" />

          <div className="unsure-panel__content">
            <p className="unsure-panel__eyebrow">Still deciding?</p>
            <h2 className="unsure-panel__title">Can&apos;t decide which branch to come to?</h2>
            <p className="unsure-panel__copy">
              You don&apos;t have to figure it out alone. Reach out and we&apos;ll help you find a
              Kharis family near you, or guide you to your first Sunday.
            </p>
            <div className="unsure-panel__actions btn-pair">
              <Link href="/contact" className="unsure-panel__btn unsure-panel__btn--solid">
                Contact Us
              </Link>
              <Link href="/locations" className="unsure-panel__btn unsure-panel__btn--ghost">
                Find a Branch
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
