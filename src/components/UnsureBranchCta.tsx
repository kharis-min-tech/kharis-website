"use client";

import { Reveal } from "@/components/Reveal";

export function UnsureBranchCta() {
  return (
    <section className="unsure-band px-5 py-10 md:px-8 md:py-12">
      <Reveal variant="up" distance={36} className="mx-auto max-w-7xl">
        <div className="unsure-panel">
          <div className="unsure-panel__shapes" aria-hidden>
            <span className="unsure-shape unsure-shape--orb-a" />
            <span className="unsure-shape unsure-shape--orb-b" />
            <span className="unsure-shape unsure-shape--orb-c" />
            <span className="unsure-shape unsure-shape--ring" />
            <span className="unsure-shape unsure-shape--blob" />
            <span className="unsure-shape unsure-shape--dot-a" />
            <span className="unsure-shape unsure-shape--dot-b" />
            <span className="unsure-shape unsure-shape--arc" />
          </div>

          <div className="unsure-panel__content">
            <p className="unsure-panel__eyebrow">Still deciding?</p>
            <h2 className="unsure-panel__title">
              Can&apos;t decide which branch to come to?
            </h2>
            <p className="unsure-panel__copy">
              You don&apos;t have to figure it out alone. Reach out and we&apos;ll
              help you find a Kharis family near you, or guide you to your first
              Sunday.
            </p>
            <div className="unsure-panel__actions">
              <a
                href="/contact"
                className="unsure-panel__btn unsure-panel__btn--solid"
              >
                Contact Us
              </a>
              <a
                href="#near-you"
                className="unsure-panel__btn unsure-panel__btn--ghost"
              >
                Find a Branch
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
