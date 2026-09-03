"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BRANCHES, distanceMiles, osmEmbedUrl, type Branch } from "@/lib/branches";



function BranchesPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string>(BRANCHES[0]!.slug);
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? BRANCHES.filter((b) =>
          [b.name, b.city, b.region, b.address, b.postcode, ...b.tags]
            .join(" ")
            .toLowerCase()
            .includes(q),
        )
      : [...BRANCHES];
    if (origin) {
      return list
        .map((b) => ({ branch: b, miles: distanceMiles(origin, b) }))
        .sort((a, b) => a.miles - b.miles);
    }
    return list.map((b) => ({ branch: b, miles: null as number | null }));
  }, [query, origin]);

  const active: Branch =
    results.find((r) => r.branch.slug === selected)?.branch ??
    results[0]?.branch ??
    BRANCHES[0]!;

  function useMyLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocError("Location isn't supported on this device.");
      return;
    }
    setLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocError("We couldn't get your location. Try searching by city instead.");
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }

  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden">
      <SiteHeader />

      <main className="pt-[74px]">
        {/* Hero */}
        <section className="border-b-4 border-on-background bg-on-background text-background relative overflow-hidden">
          <div className="halftone absolute inset-0 pointer-events-none opacity-15" />
          <div className="relative z-10 max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-20">
            <span className="inline-block bg-secondary-container text-on-secondary-container font-label-md px-4 py-1 border-heavy mb-6 uppercase tracking-widest">
              Locations
            </span>
            <h1 className="font-display-lg text-headline-lg md:text-display-lg uppercase leading-none mb-5">
              Find a branch near you
            </h1>
            <p className="font-body-lg text-body-lg max-w-2xl opacity-90 border-l-4 border-primary pl-6">
              Search by city, postcode or what you're looking for. Every Kharis
              Phase 2 branch is a doorway into the same family.
            </p>

            {/* Search bar */}
            <div className="mt-10 flex flex-col sm:flex-row gap-3 max-w-3xl">
              <div className="flex-1 flex items-center bg-surface-container-lowest text-on-surface brutalist-border brutalist-shadow">
                <span className="material-symbols-outlined px-4 text-on-surface-variant">
                  search
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try “London”, “EC2A” or “students”"
                  aria-label="Search branches"
                  className="w-full bg-transparent py-4 pr-4 font-body-md text-body-md outline-none placeholder:text-on-surface-variant"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="px-4 text-on-surface-variant hover:text-primary"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={useMyLocation}
                className="bg-primary text-on-primary font-body-md text-[13px] font-bold uppercase tracking-wide px-6 py-4 brutalist-border brutalist-shadow flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">
                  my_location
                </span>
                {locating ? "Locating…" : "Use my location"}
              </button>
            </div>
            {locError && (
              <p className="mt-3 font-label-md text-secondary-container">{locError}</p>
            )}
            {origin && !locError && (
              <p className="mt-3 font-label-md opacity-80">
                Sorted by distance from you.{" "}
                <button
                  className="underline hover:text-primary"
                  onClick={() => setOrigin(null)}
                >
                  Reset
                </button>
              </p>
            )}
          </div>
        </section>

        {/* Map + list */}
        <section className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_400px] gap-8 items-start">
            {/* Map */}
            <div className="brutalist-border brutalist-shadow bg-surface-container-lowest order-1">
              <div className="flex items-center justify-between gap-4 border-b-2 border-on-background px-5 py-3">
                <p className="font-body-md text-[13px] font-bold uppercase tracking-wide">
                  {active.city}
                </p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    `${active.address}, ${active.postcode}`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-body-md text-[12px] font-bold uppercase tracking-wide text-primary hover:underline flex items-center gap-1"
                >
                  Get directions
                  <span className="material-symbols-outlined text-[16px]">
                    open_in_new
                  </span>
                </a>
              </div>
              <iframe
                key={active.slug}
                title={`Map of ${active.name}`}
                src={osmEmbedUrl(active)}
                loading="lazy"
                className="w-full h-[340px] sm:h-[460px] lg:h-[560px] block"
              />
              <div className="border-t-2 border-on-background px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                <p className="font-body-md text-body-md">
                  {active.address}, {active.postcode}
                </p>
                <Link
                  href={`/branches/${active.slug}`}
                  className="bg-secondary text-on-secondary font-body-md text-[12px] font-bold uppercase tracking-wide px-5 py-3 brutalist-border brutalist-shadow"
                >
                  View branch
                </Link>
              </div>
            </div>

            {/* Results list */}
            <div className="order-2 space-y-4">
              <p className="font-body-md text-[12px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                {results.length} {results.length === 1 ? "branch" : "branches"} found
              </p>

              <div className="space-y-4 lg:max-h-[560px] lg:overflow-y-auto lg:pr-1">
                {results.map(({ branch, miles }) => {
                  const isActive = branch.slug === active.slug;
                  return (
                    <button
                      key={branch.slug}
                      type="button"
                      onClick={() => setSelected(branch.slug)}
                      className={`w-full text-left p-5 brutalist-border transition-colors duration-150 ${
                        isActive
                          ? "bg-primary text-on-primary brutalist-shadow"
                          : "bg-surface-container-lowest hover:bg-secondary-container hover:text-on-secondary-container"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-display-lg text-[22px] leading-tight uppercase">
                            {branch.city}
                          </p>
                          <p className="font-body-md text-[13px] opacity-80">
                            {branch.region}
                          </p>
                        </div>
                        {miles !== null && (
                          <span className="shrink-0 font-body-md text-[12px] font-bold uppercase border-2 border-current px-2 py-1">
                            {miles < 1 ? "<1" : Math.round(miles)} mi
                          </span>
                        )}
                      </div>
                      <p className="mt-3 font-body-md text-[13px]">
                        {branch.serviceTimes[0]!.day} · {branch.serviceTimes[0]!.time}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {branch.tags.map((t) => (
                          <span
                            key={t}
                            className="font-body-md text-[11px] font-bold uppercase tracking-wide border-2 border-current px-2 py-[2px]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}

                {results.length === 0 && (
                  <div className="p-6 brutalist-border bg-surface-container-lowest">
                    <p className="font-display-lg text-[20px] uppercase mb-2">
                      No branch matched
                    </p>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                      Try a nearby city, or join us on the digital campus.
                    </p>
                    <Link
                      href={`/branches/${"online"}`}
                      className="inline-block bg-primary text-on-primary font-body-md text-[12px] font-bold uppercase tracking-wide px-5 py-3 brutalist-border brutalist-shadow"
                    >
                      Join online
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t-4 border-on-background bg-secondary-container text-on-secondary-container">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="font-display-lg text-headline-lg uppercase leading-none mb-2">
                Can't find a branch nearby?
              </h2>
              <p className="font-body-md text-body-md max-w-xl">
                Tell us where you are — we're planting new campuses and we'd love to
                connect you with a fellowship in your area.
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-primary text-on-primary font-body-md text-[13px] font-bold uppercase tracking-wide px-8 py-4 brutalist-border brutalist-shadow shrink-0"
            >
              Get in touch
            </Link>
          </div>
        </section>

        <SiteFooter />
      </main>

      <ThemeToggle />
    </div>
  );
}

export default BranchesPage;
