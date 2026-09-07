import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="bg-background text-on-background">
      <SiteHeader />
      <section className="relative isolate overflow-hidden bg-background pt-20">
        <div className="vibe-mesh pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />

        <div className="mx-auto flex min-h-[92vh] w-full max-w-5xl flex-col items-center justify-center px-6 py-24 text-center">
          <div className="relative">
            <span
              className="pointer-events-none absolute inset-0 select-none font-[var(--font-display-xl)] text-[clamp(7rem,26vw,17rem)] leading-none text-[var(--on-surface)] opacity-10"
              aria-hidden="true"
            >
              404
            </span>
            <span className="relative select-none bg-gradient-to-r from-amber via-magenta to-[#d2bbff] bg-clip-text font-[var(--font-display-xl)] text-[clamp(7rem,26vw,17rem)] leading-none text-transparent">
              404
            </span>
          </div>

          <div className="mt-2 rounded-full bg-amber px-5 py-2 font-[var(--font-body-md)] text-sm font-black uppercase tracking-widest text-[#1a0b00]">
            Faith looks different here — but this page is lost
          </div>

          <p className="mt-8 max-w-xl font-[var(--font-body-md)] text-lg leading-relaxed text-[var(--on-surface-variant)]">
            Looks like the link broke, the page moved, or God is telling you to
            head back to the altar. No worries — we&apos;ll get you right.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber px-8 py-4 font-[var(--font-body-md)] text-sm font-black uppercase tracking-widest text-[#1a0b00] vibe-glow"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">home</span>
              Take me home
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-2xl border border-on-background/15 bg-surface px-8 py-4 font-[var(--font-body-md)] text-sm font-black uppercase tracking-widest text-on-surface"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">event</span>
              See events
            </Link>
            <Link
              href="/branches"
              className="inline-flex items-center gap-2 rounded-2xl border border-on-background/15 bg-surface px-8 py-4 font-[var(--font-body-md)] text-sm font-black uppercase tracking-widest text-on-surface"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">pin_drop</span>
              Find a branch
            </Link>
          </div>

          <p className="mt-12 font-[Space_Mono,monospace] text-xs uppercase tracking-widest text-[var(--on-surface-variant)]">
            / error 404 · kharis &nbsp;/&nbsp; page not found
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
