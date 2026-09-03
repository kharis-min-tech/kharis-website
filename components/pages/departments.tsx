"use client";

import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";



import { DEPARTMENTS, type Department } from "@/data/departments";
import { DepartmentVideoHero } from "@/components/DepartmentVideoHero";


const FEATURED = DEPARTMENTS.filter((d) => d.featured);
const OTHERS = DEPARTMENTS.filter((d) => !d.featured);

const WHY_SERVE = [
  {
    icon: "favorite",
    title: "We serve because we've been served",
    text: "Jesus didn't come to be served, but to serve. Our worship is simply a response to the grace we've already received.",
    ref: "Matthew 20:28",
  },
  {
    icon: "diversity_3",
    title: "We belong to something bigger",
    text: "Every gift is a piece of the body working together. When you serve, you find where you fit and become family.",
    ref: "1 Corinthians 12:12-27",
  },
  {
    icon: "emoji_events",
    title: "There's reward in faithfulness",
    text: "Serving isn't just duty — it's how you grow, get noticed and walk into the calling God has placed on your life.",
    ref: "Colossians 3:23-24",
  },
];

function DepartmentCard({ dept }: { dept: Department }) {
  return (
    <div className="group flex flex-col overflow-hidden border-2 border-black bg-surface-container-lowest neo-brutal-shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000]">
      <div className="relative h-44 overflow-hidden border-b-2 border-black">
        <img
          alt={dept.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={dept.image}
          loading="lazy"
          decoding="async"
        />
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 px-2 py-1 text-xs font-black uppercase tracking-wider text-on-background ${dept.accent} border-2 border-black`}
        >
          <span className="material-symbols-outlined text-sm" aria-hidden="true">{dept.icon}</span>
          {dept.name}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-headline-md mb-1 text-headline-md leading-none">{dept.tagline}</h3>
        <p className="mb-4 text-sm text-on-surface-variant">{dept.description}</p>
        <div className="mb-5 flex flex-wrap gap-1.5">
          {dept.roles.map((r) => (
            <span key={r} className="bg-surface-variant border border-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">
              {r}
            </span>
          ))}
        </div>
        <button className="mt-auto w-full border-2 border-black bg-on-background py-2.5 text-xs font-black uppercase tracking-wider text-surface transition-all hover:bg-primary active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#000] active:shadow-none">
          Join the Team
        </button>
      </div>
    </div>
  );
}

function DepartmentsPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return OTHERS.filter((d) => {
      const haystack = `${d.name} ${d.tagline} ${d.roles.join(" ")}`.toLowerCase();
      const matchQ = !q || haystack.includes(q);
      const matchA = active === "ALL" || d.name === active;
      return matchQ && matchA;
    });
  }, [query, active]);

  return (
    <div className="font-body-md text-body-md overflow-x-hidden">
      <SiteHeader />
      <main className="pt-20">
        {/* Hero */}
        <DepartmentVideoHero />


        {/* Featured top 3 */}
        <section className="relative z-10 bg-surface px-margin-mobile py-stack-lg md:px-margin-desktop">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="mb-3 inline-block border-2 border-black bg-secondary-container px-3 py-1 text-xs font-black uppercase tracking-widest">
                Start here
              </span>
              <h2 className="font-display-lg text-headline-lg leading-none uppercase">
                Our Vibrant Departments
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {FEATURED.map((dept, i) => (
              <div
                key={dept.name}
                className="group flex flex-col overflow-hidden border-2 border-black bg-surface-container-lowest neo-brutal-shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000]"
              >
                <div className="relative h-52 overflow-hidden border-b-2 border-black">
                  <img
                    alt={dept.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={dept.image}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute left-3 top-3 border-2 border-black bg-surface px-2 py-1 text-[11px] font-black uppercase tracking-wider text-on-surface">
                    #{i + 1} · {dept.name}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className={`mb-3 inline-flex w-fit items-center gap-1.5 px-2 py-1 text-xs font-black uppercase tracking-wider ${dept.accent} border-2 border-black`}>
                    <span className="material-symbols-outlined text-sm" aria-hidden="true">{dept.icon}</span>
                    {dept.tagline}
                  </span>
                  <h3 className="font-display-lg mb-2 text-headline-lg leading-none uppercase">{dept.name}</h3>
                  <p className="mb-5 flex-1 text-sm text-on-surface-variant">{dept.description}</p>
                  <div className="mb-5 flex flex-wrap gap-1.5">
                    {dept.roles.map((r) => (
                      <span key={r} className="bg-surface-variant border border-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">
                        {r}
                      </span>
                    ))}
                  </div>
                  <button className="w-full border-2 border-black bg-primary py-3 text-xs font-black uppercase tracking-wider text-on-primary transition-all hover:brightness-110 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#000] active:shadow-none">
                    Join the Team
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All departments - searchable grid */}
        <section className="relative border-t-4 border-black bg-surface-container px-margin-mobile py-stack-lg md:px-margin-desktop">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <span className="mb-3 inline-block border-2 border-black bg-primary px-3 py-1 text-xs font-black uppercase tracking-widest text-on-primary">
                The rest of the body
              </span>
              <h2 className="font-display-lg text-headline-lg leading-none uppercase">Explore Every Department</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-on-surface-variant">
                Search or browse the full list. Pick whatever stirs you — there's a place for your gift.
              </p>
            </div>

            {/* Search + filters */}
            <div className="mb-8 flex flex-col gap-4">
              <label className="relative block">
                <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" aria-hidden="true">search</span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name or role — try 'prayer', 'sound' or 'kids'..."
                  className="input-focus w-full border-2 border-black bg-surface-container-lowest px-11 py-3.5 text-sm font-medium text-on-surface placeholder:text-on-surface-variant"
                />
              </label>
<div className="flex flex-wrap gap-2">
                {["ALL", ...OTHERS.map((d) => d.name)].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActive(f)}
                    className={`border-2 px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all active:translate-x-0.5 active:translate-y-0.5 ${
                      active === f
                        ? "border-black bg-on-background text-surface shadow-[3px_3px_0_0_#000]"
                        : "border-black bg-surface text-on-surface hover:bg-surface-variant"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((dept) => (
                  <DepartmentCard key={dept.name} dept={dept} />
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-black bg-surface py-16 text-center">
                <span className="material-symbols-outlined mb-3 text-4xl text-on-surface-variant" aria-hidden="true">search_off</span>
                <p className="font-headline-md text-headline-md mb-2">No teams found</p>
                <p className="text-sm text-on-surface-variant">
                  Try a different search, or chat to a pastor — we'll find your fit.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Why serve God */}
        <section className="relative overflow-hidden border-t-4 border-black bg-on-background text-background px-margin-mobile py-stack-lg md:px-margin-desktop">
          <div className="halftone-bg absolute inset-0 pointer-events-none opacity-25" />
          <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-primary/25 to-transparent" />
          <div className="relative z-10 mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block border-2 border-black bg-secondary-container px-3 py-1 text-xs font-black uppercase tracking-widest">
                The heart behind it
              </span>
              <h2 className="font-display-lg text-headline-lg leading-none uppercase text-primary-fixed-dim">
                Why We Serve
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-surface-container-low">
                Serving isn't about filling a rota — it's about responding to grace, finding your family and growing into who God made you to be.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {WHY_SERVE.map((w, i) => (
                <div
                  key={w.title}
                  className={`relative flex flex-col border-2 border-black p-6 shadow-[6px_6px_0_0_#000] ${
                    i % 2 === 0 ? "bg-secondary-container text-on-secondary-container" : "bg-primary text-on-primary"
                  }`}
                >
                  <span className="absolute right-4 top-3 font-display-lg text-6xl leading-none opacity-20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center border-2 border-black ${
                      i % 2 === 0 ? "bg-on-background text-surface" : "bg-surface text-on-surface"
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl" aria-hidden="true">{w.icon}</span>
                  </span>
                  <h3 className="font-headline-md mb-2 text-headline-md leading-tight">{w.title}</h3>
                  <p className="mb-4 flex-1 text-sm leading-relaxed">{w.text}</p>
                  <p className="font-[Space_Mono,monospace] text-xs uppercase tracking-widest opacity-80">{w.ref}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center gap-4 border-2 border-black bg-surface p-8 text-center shadow-[6px_6px_0_0_#000] sm:flex-row sm:justify-between sm:text-left">
              <div>
                <h3 className="font-headline-md mb-1 text-headline-md text-on-surface">Still not sure where you fit?</h3>
                <p className="text-sm text-on-surface">
                  Fill out our gift assessment and we'll help you find your perfect team.
                </p>
              </div>
              <button className="shrink-0 border-2 border-black bg-primary px-8 py-3 text-sm font-black uppercase tracking-wider text-on-primary transition-all hover:brightness-110 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
                Take the Assessment
              </button>
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
