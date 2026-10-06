"use client";

import { Reveal } from "@/components/Reveal";
import { Parallax } from "@/components/Parallax";

export function BuildHouseSection() {
  return (
    <section id="give" className="give-shell relative min-h-[58vh] overflow-hidden">
      <Parallax className="absolute inset-0" speed={60} scaleFrom={1.18} scaleTo={1.02}>
        <div
          className="absolute inset-0 h-[120%] w-full -translate-y-[8%] bg-cover bg-center"
          style={{
            backgroundImage: "url(/images/build-house.jpg)",
          }}
        />
      </Parallax>
      <div className="absolute inset-0 bg-[#1a0a30]/62" />

      <div className="relative z-10 mx-auto flex min-h-[58vh] max-w-7xl items-center justify-center px-5 py-10 text-center md:px-8 md:py-12">
        <Reveal
          variant="blur"
          duration={1.1}
          className="mx-auto w-full max-w-3xl md:max-w-4xl"
        >
          <p className="text-[0.8rem] font-extrabold uppercase tracking-[0.18em] text-orange md:text-[0.88rem]">
            Building fund
          </p>
          <h2 className="section-title mt-3 !text-[clamp(2.35rem,5.5vw,4rem)] !text-white">
            Build God A House
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/90 md:max-w-4xl md:text-xl md:leading-relaxed">
            We are working towards purchasing our own church building. Everyone
            can take part through financial generosity. Every gift helps raise
            a house of prayer for this generation and the ones to come.
          </p>
          <a
            href="/give#building"
            className="btn-give mt-10"
          >
            Donate Now
          </a>
        </Reveal>
      </div>
    </section>
  );
}
