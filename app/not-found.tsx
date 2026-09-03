import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* Halftone texture backdrop */}
      <div className="halftone-overlay pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
      {/* Decorative accent shapes */}
      <div
        className="pointer-events-none absolute -left-16 top-16 -z-10 h-56 w-56 rounded-full bg-[var(--secondary-container)] opacity-30 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-10 -z-10 h-72 w-72 rounded-full bg-[var(--primary-container)] opacity-30 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto flex min-h-[92vh] w-full max-w-5xl flex-col items-center justify-center px-6 py-24 text-center">
        {/* Big comic "404" */}
        <div className="relative">
          <span
            className="pointer-events-none absolute inset-0 select-none font-[var(--font-display-xl)] text-[clamp(7rem,26vw,17rem)] leading-none text-[var(--on-surface)] opacity-10"
            aria-hidden="true"
          >
            404
          </span>
          <span className="relative select-none font-[var(--font-display-xl)] text-[clamp(7rem,26vw,17rem)] leading-none text-[var(--primary)]">
            404
          </span>
        </div>

        {/* Sticker-style tag */}
        <div className="mt-2 -rotate-2 border-4 border-[var(--on-surface)] bg-[var(--secondary-container)] px-5 py-2 font-[var(--font-body-md)] text-sm font-black uppercase tracking-widest text-[var(--on-secondary-container)] shadow-[4px_4px_0_0_var(--on-surface)]">
          Faith looks different here — but this page is lost
        </div>

        <p className="mt-8 max-w-xl font-[var(--font-body-md)] text-lg leading-relaxed text-[var(--on-surface-variant)]">
          Looks like the link broke, the page moved, or God is telling you to
          head back to the altar. No worries — we&apos;ll get you right.
        </p>

        {/* Action buttons with brutalist 3D press */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          <Link
            href="/"
            className="btn-neo inline-flex items-center gap-2 border-4 border-[var(--on-surface)] bg-[var(--primary)] px-8 py-4 font-[var(--font-body-md)] text-sm font-black uppercase tracking-widest text-[var(--on-primary)] shadow-[6px_6px_0_0_var(--on-surface)]"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">home</span>
            Take me home
          </Link>
          <Link
            href="/events"
            className="btn-neo inline-flex items-center gap-2 border-4 border-[var(--on-surface)] bg-[var(--surface)] px-8 py-4 font-[var(--font-body-md)] text-sm font-black uppercase tracking-widest text-[var(--on-surface)] shadow-[6px_6px_0_0_var(--on-surface)]"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">event</span>
            See events
          </Link>
          <Link
            href="/branches"
            className="btn-neo inline-flex items-center gap-2 border-4 border-[var(--on-surface)] bg-[var(--secondary-container)] px-8 py-4 font-[var(--font-body-md)] text-sm font-black uppercase tracking-widest text-[var(--on-secondary-container)] shadow-[6px_6px_0_0_var(--on-surface)]"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">pin_drop</span>
            Find a branch
          </Link>
        </div>

        {/* Monospace hint */}
<p className="mt-12 font-[Space_Mono,monospace] text-xs uppercase tracking-widest text-[var(--on-surface-variant)]">
          / error 404 · kharis &nbsp;/&nbsp; page not found
        </p>
      </div>
    </section>
  );
}
