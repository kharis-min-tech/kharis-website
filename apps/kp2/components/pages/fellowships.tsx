"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const YOUNG_ADULTS = "/assets/young-adults.jpg";

function FellowshipsPage() {
  return (
    <div className="bg-background text-on-background font-body-md overflow-x-hidden">
      <SiteHeader />
      <main>
        <section className="relative bg-on-background text-background overflow-hidden min-h-[60vh] md:min-h-[80vh] flex items-center border-b-4 border-primary pt-28 md:pt-32 pb-stack-lg">
          <div className="halftone-bg absolute inset-0 pointer-events-none opacity-25"></div>
          <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-primary/25 to-transparent"></div>
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop relative z-10 grid md:grid-cols-2 gap-stack-lg items-center">
            <div className="space-y-stack-md">
              <div className="inline-block bg-secondary-container text-on-secondary-container px-4 py-1 border-heavy font-label-md uppercase tracking-widest animate-bounce motion-reduce:animate-none">
                Community First
              </div>
              <h1 className="font-display-lg text-display-lg text-primary-fixed-dim uppercase leading-none">
                FELLOWSHIPS
              </h1>
              <p className="font-body-lg text-body-lg max-w-md opacity-90 border-l-4 border-primary pl-6">
                Smaller circles, deeper connections. Find your people, grow your faith, and do
                life together in a space built for you.
              </p>
              <div className="pt-base flex flex-wrap gap-stack-sm">
                <Link
                  className="bg-primary text-on-primary font-headline-md text-headline-md px-8 py-4 border-heavy neo-shadow-lg hover-lift hover-press flex items-center gap-2"
                  href="/branches"
                >
                  FIND YOUR FELLOWSHIP
                  <span className="material-symbols-outlined">arrow_downward</span>
                </Link>
                <Link
                  className="keep-light px-8 py-4 font-headline-md text-headline-md border-2 border-black hover-press flex items-center gap-2"
                  href="/branches"
                >
                  SEE SERVICES
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="border-heavier p-2 bg-background transform rotate-2 neo-shadow-lg overflow-hidden">
                <img
                  alt="Young adults fellowship at Kharis"
                  className="w-full grayscale hover:grayscale-0 transition-all duration-500 object-cover aspect-square"
                  src={YOUNG_ADULTS}
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-secondary-container text-on-secondary-container p-4 border-heavy neo-shadow transform -rotate-3 font-label-md max-w-[200px]">
                JOIN THE MOVEMENT. WE&apos;RE BETTER TOGETHER.
              </div>
            </div>
          </div>
        </section>

        <section className="py-stack-lg bg-surface-container-low border-t-4 border-on-background relative overflow-hidden">
          <div className="halftone absolute inset-0 opacity-5"></div>
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop text-center">
            <div className="max-w-3xl mx-auto space-y-stack-md relative z-10">
              <h2 className="font-display-lg text-headline-lg-mobile md:text-display-lg uppercase leading-none">
                DON&apos;T DO LIFE ALONE
              </h2>
              <p className="font-body-lg text-on-surface-variant">
                Whether you&apos;re looking for a community to grow with or a place to belong,
                there&apos;s a space for you here. Start with your local branch.
              </p>
              <Link
                href="/branches"
                className="inline-flex items-center gap-2 bg-primary text-on-primary px-10 py-4 border-heavy neo-shadow-lg font-headline-md text-headline-md hover-lift hover-press uppercase tracking-wider"
              >
                Find a branch
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <ThemeToggle />
    </div>
  );
}

export default FellowshipsPage;
