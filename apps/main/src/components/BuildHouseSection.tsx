"use client";

import { Reveal } from "@/components/Reveal";
import { Parallax } from "@/components/Parallax";
import { SPURGEONS_CENTRE } from "@/lib/spurgeons";

export function BuildHouseSection() {
  return (
    <section id="give" className="give-shell relative min-h-[58vh] overflow-hidden">
      <Parallax className="absolute inset-0" speed={60} scaleFrom={1.18} scaleTo={1.02}>
        <div
          className="absolute inset-0 h-[120%] w-full -translate-y-[8%] bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.kharis.org/site-images/main/8f521cd8c5d3a713/spurgeons-impression.jpg)",
          }}
        />
      </Parallax>
      <div className="absolute inset-0 bg-[#170733]/72" />

      <div className="relative z-10 mx-auto flex min-h-[58vh] max-w-7xl items-center justify-center px-5 py-10 text-center md:px-8 md:py-12">
        <Reveal variant="blur" duration={1.1} className="mx-auto w-full max-w-3xl md:max-w-4xl">
          <p className="give-eyebrow text-[0.8rem] font-extrabold uppercase tracking-[0.18em] md:text-[0.88rem]">
            Spurgeon&apos;s Centre
          </p>
          <h2 className="section-title mt-3 !text-[clamp(2rem,4.6vw,3.4rem)] !text-white">
            We&rsquo;ve purchased our new home
          </h2>
          <div className="mx-auto mt-6 max-w-3xl space-y-5 text-lg leading-relaxed text-white/90 md:text-xl md:leading-relaxed">
            <p>
              We are excited to announce that we have officially acquired our own facility that was
              formerly Spurgeon&rsquo;s College.
            </p>
            <p>
              Now begins the exciting work restoring and developing this facility into a home for
              advancing the gospel.
            </p>
            <p>
              If you would like to partner with us and give towards this project, you can do so
              using the link below.
            </p>
          </div>
          <div className="btn-pair mt-10">
            <a
              href={SPURGEONS_CENTRE.giveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-give"
            >
              Give now
            </a>
            <a
              href={SPURGEONS_CENTRE.pledgeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Make a pledge
            </a>
          </div>
          <p className="mt-6 text-sm font-semibold">
            <a
              href={SPURGEONS_CENTRE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="give-more"
            >
              See the project at spurgeonscentre.org
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
