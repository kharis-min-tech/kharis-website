"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GivingMethods, type GivingLocation } from "@/components/GivingMethods";
import { SPURGEONS_CENTRE } from "@/lib/spurgeons";
import "@/components/giving-experience.css";

type HeroPhoto = { src: string; alt: string; position: string };

function GivingPage({
  branches,
  heroStack,
}: {
  branches: GivingLocation[];
  heroStack: HeroPhoto[];
}) {
  return (
    <div className="bg-background text-on-background font-body-md selection:bg-secondary-container selection:text-on-secondary-container">
      <SiteHeader />
      <main className="pt-[74px]">
        <section className="kp-giving-hero">
          <div className="kp-giving-hero__copy">
            <p className="kp-giving-kicker">Giving at Kharis</p>
            <h1 className="font-display-lg uppercase">
              Sow <span>bountifully.</span>
            </h1>
            <blockquote>
              &ldquo;He who sows bountifully will also reap bountifully.&rdquo;
              <cite>2 Corinthians 9:6</cite>
            </blockquote>
            <p className="kp-giving-hero__lede">
              Tithes and offerings are part of our worship. Give online through your branch, by bank
              transfer or by text, wherever you are.
            </p>
            <div className="kp-giving-actions">
              <a href="#ways" className="kp-giving-button">
                Give to your branch
              </a>
              <a href="#building" className="kp-giving-button kp-giving-button--light">
                Building Fund
              </a>
            </div>
          </div>
          <div className="kp-giving-photos" aria-label="Worship at KP2">
            {heroStack.map((photo, index) => (
              <figure
                key={index}
                className={`kp-giving-photos__item kp-giving-photos__item--${index}`}
              >
                <img src={photo.src} alt={photo.alt} style={{ objectPosition: photo.position }} />
              </figure>
            ))}
          </div>
        </section>
        <GivingMethods branches={branches} />

        <section
          id="building"
          className="kp-build bg-[#151218] text-white border-y-4 border-black px-margin-mobile md:px-margin-desktop py-stack-lg"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <figure className="relative">
              <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[#f7be1d] border-4 border-black" />
              <img
                src={SPURGEONS_CENTRE.image}
                alt="An artist's impression of the renovated Spurgeon's Centre in South London"
                loading="lazy"
                decoding="async"
                className="relative block w-full aspect-[4/3] object-cover border-4 border-black"
              />
              <span className="absolute -top-4 left-4 bg-primary text-white border-2 border-black font-label-sm uppercase px-3 py-1 -rotate-2">
                Spurgeon&apos;s Centre
              </span>
            </figure>
            <div>
              <h2 className="font-display-lg text-headline-lg-mobile md:text-display-lg uppercase leading-none tracking-tight mb-6">
                We&rsquo;ve purchased <span className="text-[#f7be1d]">our new home</span>
              </h2>
              <div className="font-body-lg text-body-lg text-white/85 max-w-xl mb-8 space-y-4">
                <p>
                  We are excited to announce that we have officially acquired our own facility that
                  was formerly Spurgeon&rsquo;s College.
                </p>
                <p>
                  Now begins the exciting work restoring and developing this facility into a home
                  for advancing the gospel.
                </p>
                <p>
                  If you would like to partner with us and give towards this project, you can do so
                  using the link below.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <a
                  href={SPURGEONS_CENTRE.giveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kp-depth-button kp-button-gold inline-flex items-center justify-center bg-[#f7be1d] text-[#151218] px-8 py-4 font-label-comic text-base uppercase border-4 border-black brutalist-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
                >
                  Build with us
                </a>
                <a
                  href={SPURGEONS_CENTRE.pledgeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kp-depth-button kp-button-light keep-light inline-flex items-center justify-center bg-white text-[#4c08a8] px-8 py-4 font-label-comic text-base uppercase border-4 border-black brutalist-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
                >
                  Make a pledge
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <ThemeToggle />
    </div>
  );
}

export default GivingPage;
