"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { MapPin, Search, Clock, CalendarDays, ChevronRight, Compass } from "lucide-react";
import type { BranchItem } from "@/lib/branches";
import type { BranchData } from "@/data/branchesData";
import BranchMap from "@/components/branches/BranchMap";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

interface Props {
  items: BranchItem[];
  full: BranchData[];
}

export function LocationsClient({ items: branches, full }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string>("All");

  const regions = useMemo(
    () => ["All", ...Array.from(new Set(branches.map((b) => b.region)))],
    [branches],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return branches.filter((b) => {
      const matchesQuery =
        !q ||
        [b.name, b.city, b.postcode, b.address].some((v) => v?.toLowerCase().includes(q));
      return matchesQuery && (region === "All" || b.region === region);
    });
  }, [branches, query, region]);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--page-bg)] pt-[4.5rem] font-sans text-[var(--page-fg)]">
      <SiteHeader tone="light" />

      <section className="relative overflow-hidden px-5 pt-16 pb-14 md:px-8">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#800654]/20 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-[1536px] space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-1.5 text-xs font-bold text-[var(--purple)]">
            <Compass className="h-4 w-4 text-[#d4920a]" />
            <span>Live from the Kharis directory</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Find a{" "}
            <span className="bg-gradient-to-r from-[#e8a33d] via-[#d4920a] to-[var(--purple)] bg-clip-text text-transparent">
              Kharis Church
            </span>{" "}
            near you
          </h1>
          <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-[var(--muted)] sm:text-lg">
            {branches.length} branches across the UK and beyond, each with a family waiting to welcome you.
          </p>

          <div className="mx-auto max-w-2xl space-y-4 pt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by city, postcode or branch name..."
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] py-4 pl-12 pr-4 text-sm font-bold shadow-xl outline-none focus:ring-2 focus:ring-[var(--purple)]"
              />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {regions.map((r) => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    region === r
                      ? "bg-[var(--purple)] text-white shadow-md"
                      : "border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--page-fg)] hover:opacity-90"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <BranchMap
        branches={full}
        onSelectBranch={(id) => router.push(`/locations/${id}`)}
      />

      <section className="mx-auto w-full max-w-[1536px] px-5 pb-20 md:px-8">
        <h2 className="mb-8 border-b border-[var(--border)] pb-6 text-2xl font-extrabold">
          Our Branches ({filtered.length})
        </h2>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] p-12 text-center">
            <h3 className="text-xl font-bold">No branches matched your search</h3>
            <p className="mt-2 text-sm font-medium text-[var(--muted)]">
              Try another city or postcode, or select “All”.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((branch) => (
              <div
                key={branch.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] shadow-sm transition-all duration-300 hover:shadow-xl"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-black">
                    <img
                      src={branch.heroImage}
                      alt={branch.name}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full bg-[#800654] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                      {branch.region}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-2xl font-extrabold leading-snug text-white">{branch.name}</h3>
                      <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-white/90">
                        <MapPin className="h-3.5 w-3.5 text-[#d4920a]" />
                        {branch.address}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 p-6">
                    <p className="line-clamp-2 text-xs font-medium leading-relaxed text-[var(--muted)]">
                      {branch.description}
                    </p>
                    <div className="divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]">
                      <div className="flex items-center gap-2 px-3.5 py-3">
                        <Clock className="h-4 w-4 shrink-0 text-[var(--purple)]" />
                        <span className="text-xs font-bold">{branch.serviceSummary}</span>
                      </div>
                      {branch.midweekSummary && (
                        <div className="flex items-center gap-2 px-3.5 py-3">
                          <CalendarDays className="h-4 w-4 shrink-0 text-[#e8a33d]" />
                          <span className="text-xs font-bold">{branch.midweekSummary}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[var(--border)] p-6 pt-4">
                  <Link href={`/locations/${branch.id}`} className="btn-secondary w-full !text-xs">
                    <span>Explore {branch.city}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
