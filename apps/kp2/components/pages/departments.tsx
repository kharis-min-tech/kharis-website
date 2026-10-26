"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

import { KP2_PHOTOS } from "@/lib/photography";

const WHY_SERVE = [
  {
    icon: "favorite",
    title: "Get busy serving",
    text: "Jesus came to serve. We serve because we have been served. Get busy serving.",
    ref: "Matthew 20:28",
  },
  {
    icon: "diversity_3",
    title: "Find your place",
    text: "Every gift belongs in the body. Take your place and become family.",
    ref: "1 Corinthians 12:12-27",
  },
  {
    icon: "volunteer_activism",
    title: "Work as unto the Lord",
    text: "Work with all your heart, as working for the Lord. We are passionate about God and His word.",
    ref: "Colossians 3:23-24",
  },
];

function DepartmentsPage() {
  return (
    <div className="font-body-md text-body-md overflow-x-hidden">
      <SiteHeader />
      <main className="pt-[74px]">
        <section className="relative flex min-h-[min(42rem,85svh)] items-end overflow-hidden border-b-4 border-primary bg-[#151218] text-white">
          <img
            src={KP2_PHOTOS.serviceSaxophone.src}
            alt={KP2_PHOTOS.serviceSaxophone.alt}
            style={{ objectPosition: KP2_PHOTOS.serviceSaxophone.position }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151218] via-[#151218]/50 to-[#151218]/10" />
          <div className="relative mx-auto w-full max-w-7xl px-margin-mobile py-12 md:px-margin-desktop md:py-16">
            <p className="mb-5 font-label-md uppercase tracking-widest text-white">
              Get involved at KP2
            </p>
            <h1 className="max-w-3xl font-display-lg text-headline-lg-mobile uppercase leading-none md:text-display-lg">
              Find your place.
              <br />
              Get busy serving.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white">
              Find where your gift meets the mission. Take the quiz and discover where you could
              serve in your local branch.
            </p>
            <Link
              href="/quiz"
              className="kp-button-gold mt-8 inline-flex min-h-12 items-center gap-3 border-4 border-[#151218] bg-[#f7be1d] px-7 py-4 font-label-comic font-bold uppercase text-[#151218] brutalist-shadow"
            >
              Take the department quiz <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        {/* Why serve God */}
        <section className="relative overflow-hidden border-t-4 border-black bg-gradient-to-b from-[#3a2158] via-[#221532] to-[#141018] px-margin-mobile py-stack-lg text-white md:px-margin-desktop">
          <div className="relative z-10 mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-none border border-on-background/10 bg-secondary-container px-3 py-1 text-xs font-black uppercase tracking-widest text-[#151218]">
                The heart behind it
              </span>
              <h2 className="font-display-lg text-headline-lg leading-none uppercase text-primary-fixed-dim">
                Why We Serve
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-white/80">
                Serving is worship. Respond to grace. Take your place. Get busy serving.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {WHY_SERVE.map((w, i) => (
                <div
                  key={w.title}
                  className={`relative flex flex-col rounded-none border border-on-background/10 p-6 shadow-[6px_6px_0_0_#000] ${
                    i % 2 === 0
                      ? "bg-secondary-container text-on-secondary-container"
                      : "bg-primary text-on-primary"
                  }`}
                >
                  <span className="absolute right-4 top-3 font-display-lg text-6xl leading-none opacity-20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-none border border-on-background/10 ${
                      i % 2 === 0 ? "bg-on-background text-surface" : "bg-surface text-on-surface"
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl" aria-hidden="true">
                      {w.icon}
                    </span>
                  </span>
                  <h3 className="font-headline-md mb-2 text-headline-md leading-tight">
                    {w.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm leading-relaxed">{w.text}</p>
                  <p className="font-[Space_Mono,monospace] text-xs uppercase tracking-widest opacity-80">
                    {w.ref}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center gap-4 rounded-none border border-on-background/10 bg-surface p-8 text-center shadow-[6px_6px_0_0_#000] sm:flex-row sm:justify-between sm:text-left">
              <div>
                <h3 className="font-headline-md mb-1 text-headline-md text-on-surface">
                  Still not sure where you fit?
                </h3>
                <p className="text-sm text-on-surface">
                  Take the quiz and we&apos;ll help you find where you fit in the local branch.
                </p>
              </div>
              <Link
                href="/quiz"
                className="shrink-0 rounded-none border border-on-background/10 bg-primary px-8 py-3 text-sm font-black uppercase tracking-wider text-on-primary text-center transition-all hover:brightness-110 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                To the Quiz
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

export default DepartmentsPage;
