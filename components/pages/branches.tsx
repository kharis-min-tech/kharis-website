"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  distanceMiles,
  hasCoords,
  midweekSummary,
  osmEmbedUrl,
  sundaySummary,
  type Branch,
} from "@/lib/branches";
import {
  mapsDirectionsUrl,
  weeklyServiceToCalendarItem,
} from "@/lib/calendar";
import { PlanVisitButton } from "@/components/PlanVisitButton";

function branchVisitItem(branch: Branch) {
  const service = branch.serviceTimes[0];
  if (!service) return null;
  const location = [branch.address, branch.postcode].filter(Boolean).join(", ");
  return {
    item: weeklyServiceToCalendarItem({
      uid: `branch-${branch.slug}-${service.day}`,
      title: `${service.label} · ${branch.name}`,
      description: `Join us at ${branch.name}. ${branch.blurb}`,
      location,
      day: service.day,
      time: service.time,
    }),
    directions:
      location && !location.toLowerCase().includes("coming soon")
        ? mapsDirectionsUrl(location)
        : undefined,
  };
}

function BranchesPage({
  branches,
  origin = null,
}: {
  branches: Branch[];
  origin?: { lat: number; lng: number } | null;
}) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [selected, setSelected] = useState<string>("");

  const regions = useMemo(
    () => ["All", ...Array.from(new Set(branches.map((b) => b.region).filter(Boolean)))],
    [branches],
  );

  useEffect(() => {
    if (region !== "All" && !regions.includes(region)) setRegion("All");
  }, [region, regions]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = branches.filter((b) => {
      const matchesQuery =
        !q ||
        [b.name, b.city, b.region, b.address, b.postcode, ...b.tags]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchesQuery && (region === "All" || b.region === region);
    });
    if (origin) {
      return list
        .map((b) => ({ branch: b, miles: distanceMiles(origin, b) }))
        .sort((a, b) => a.miles - b.miles);
    }
    return list.map((b) => ({ branch: b, miles: null as number | null }));
  }, [query, origin, region, branches]);

  const active: Branch | undefined =
    results.find((r) => r.branch.slug === selected)?.branch ??
    results[0]?.branch;
  const visit = active ? branchVisitItem(active) : null;

  return (
    <div className="bg-background text-on-surface font-body-md">
      <SiteHeader />

      <main className="pt-[74px]">
        <section className="relative overflow-hidden px-margin-mobile md:px-margin-desktop pt-16 pb-14">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative z-10 mx-auto max-w-[1536px] space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber text-[#1a0b00] px-4 py-1.5 font-body-md text-[12px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px]">explore</span>
              Locations
            </div>
            <h1 className="font-display-lg text-headline-lg md:text-display-lg uppercase leading-none">
              Find a{" "}
              <span className="text-primary">Kharis Phase 2</span>{" "}
              campus near you
            </h1>
            <p className="mx-auto max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
              {branches.length} {branches.length === 1 ? "campus" : "campuses"} across the UK,
              each with a family waiting to welcome you.
            </p>

            <div className="mx-auto max-w-2xl space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    search
                  </span>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by city, postcode or branch name..."
                    aria-label="Search branches"
                    className="w-full rounded-2xl vibe-glow bg-surface-container-lowest py-4 pl-12 pr-12 font-body-md text-body-md outline-none"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  ) : null}
                </div>
                <button
                  type="button"
                  data-ui="use-location"
                  className="bg-primary text-on-primary font-body-md text-[13px] font-bold uppercase tracking-wide px-6 py-4 rounded-2xl vibe-glow flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  <span className="material-symbols-outlined text-[20px]">my_location</span>
                  <span data-location-label>Use my location</span>
                </button>
              </div>

              <p id="location-error" hidden className="font-label-md text-primary"></p>
              {origin ? (
                <p className="font-label-md text-on-surface-variant">
                  Sorted by distance from you.{" "}
                  <a href="/branches" className="text-primary">
                    Reset
                  </a>
                </p>
              ) : null}

              <div className="flex flex-wrap items-center justify-center gap-2">
                {regions.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRegion(r)}
                    className={`px-4 py-2 font-body-md text-[12px] font-bold uppercase tracking-wide rounded-2xl border border-on-background/10 transition-colors ${
                      region === r
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-lowest hover:bg-secondary-container hover:text-on-secondary-container"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {active ? (
          <section className="mx-auto w-full max-w-[1536px] px-margin-mobile md:px-margin-desktop pb-12">
            <div className="rounded-2xl vibe-glow bg-surface-container-lowest overflow-hidden">
              <div className="flex items-center justify-between gap-4 border-b border-on-background/10 px-5 py-3">
                <p className="font-body-md text-[13px] font-bold uppercase tracking-wide">
                  {active.city}
                </p>
                {hasCoords(active) ? (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      `${active.address}, ${active.postcode}`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-body-md text-[12px] font-bold uppercase tracking-wide text-primary flex items-center gap-1"
                  >
                    Get directions
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </a>
                ) : null}
              </div>
              {hasCoords(active) ? (
                <iframe
                  key={active.slug}
                  title={`Map of ${active.name}`}
                  src={osmEmbedUrl(active)}
                  loading="lazy"
                  className="w-full h-[280px] sm:h-[380px] block"
                />
              ) : (
                <img
                  src={active.image}
                  alt={active.name}
                  className="w-full h-[280px] sm:h-[380px] object-cover"
                />
              )}
              <div className="border-t-2 border-on-background px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                <p className="font-body-md text-body-md">
                  {active.address}
                  {active.postcode ? `, ${active.postcode}` : ""}
                </p>
                <div className="flex flex-wrap gap-2">
                  {visit?.item ? (
                    <PlanVisitButton
                      item={visit.item}
                      directionsUrl={visit.directions}
                      className="bg-primary text-on-primary font-body-md text-[12px] font-bold uppercase tracking-wide px-5 py-3 rounded-2xl vibe-glow"
                    >
                      Plan visit
                    </PlanVisitButton>
                  ) : null}
                  <Link
                    href={`/branches/${active.slug}`}
                    className="bg-secondary text-on-secondary font-body-md text-[12px] font-bold uppercase tracking-wide px-5 py-3 rounded-2xl vibe-glow"
                  >
                    View branch
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="mx-auto w-full max-w-[1536px] px-margin-mobile md:px-margin-desktop pb-20">
          <h2 className="mb-8 border-b border-on-background/10 pb-6 font-display-lg text-[28px] uppercase">
            Our branches ({results.length})
          </h2>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-on-background/10 bg-surface-container-lowest p-12 text-center">
              <h3 className="font-display-lg text-[24px] uppercase mb-2">
                No branches matched your search
              </h3>
              <p className="font-body-md text-on-surface-variant mb-4">
                Try a nearby city, or get in touch and we will connect you.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-primary text-on-primary font-body-md text-[12px] font-bold uppercase tracking-wide px-5 py-3 rounded-2xl vibe-glow"
              >
                Get in touch
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {results.map(({ branch, miles }) => {
                const midweek = midweekSummary(branch);
                return (
                  <div
                    key={branch.slug}
                    className={`group flex flex-col justify-between overflow-hidden rounded-2xl vibe-glow bg-surface-container-lowest transition-colors ${
                      branch.slug === active?.slug ? "ring-4 ring-primary" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelected(branch.slug)}
                      className="text-left w-full"
                    >
                      <div className="relative h-52 overflow-hidden bg-on-background">
                        <img
                          src={branch.image}
                          alt={branch.name}
                          loading="lazy"
                          className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        <span className="absolute left-3 top-3 rounded-full bg-primary text-on-primary px-3 py-1 font-body-md text-[10px] font-bold uppercase tracking-wider">
                          {branch.region}
                        </span>
                        {miles !== null ? (
                          <span className="absolute right-3 top-3 rounded-full bg-secondary-container text-on-secondary-container px-3 py-1 font-body-md text-[10px] font-bold uppercase tracking-wider">
                            {miles < 1 ? "<1" : Math.round(miles)} mi
                          </span>
                        ) : null}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <h3 className="font-display-lg text-[24px] uppercase leading-snug">
                            {branch.name}
                          </h3>
                          <p className="mt-0.5 flex items-center gap-1 font-body-md text-[12px] text-white/90">
                            <span className="material-symbols-outlined text-[16px] text-secondary-container">
                              location_on
                            </span>
                            {branch.address}
                          </p>
                        </div>
                      </div>
                    </button>

                    <div className="space-y-4 p-6">
                      <p className="line-clamp-2 font-body-md text-[13px] leading-relaxed text-on-surface-variant">
                        {branch.blurb}
                      </p>
                      <div className="divide-y divide-on-background/10 overflow-hidden rounded-2xl border border-on-background/10 bg-background">
                        <div className="flex items-center gap-2 px-3.5 py-3">
                          <span className="material-symbols-outlined text-[18px] text-primary">
                            schedule
                          </span>
                          <span className="font-body-md text-[12px] font-bold">
                            {sundaySummary(branch)}
                          </span>
                        </div>
                        {midweek ? (
                          <div className="flex items-center gap-2 px-3.5 py-3">
                            <span className="material-symbols-outlined text-[18px] text-primary">
                              calendar_month
                            </span>
                            <span className="font-body-md text-[12px] font-bold">{midweek}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="border-t-2 border-on-background/15 p-6 pt-4">
                      <Link
                        href={`/branches/${branch.slug}`}
                        className="flex w-full items-center justify-center gap-2 bg-secondary text-on-secondary font-body-md text-[12px] font-bold uppercase tracking-wide px-5 py-3 rounded-2xl border border-on-background/10"
                      >
                        Explore {branch.city}
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="border-t border-on-background/10 bg-secondary-container text-on-secondary-container">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="font-display-lg text-headline-lg uppercase leading-none mb-2">
                Can&apos;t find a branch nearby?
              </h2>
              <p className="font-body-md text-body-md max-w-xl">
                Tell us where you are — we&apos;re planting new campuses and we&apos;d love to
                connect you with a fellowship in your area.
              </p>
            </div>
            <a
              href="/contact"
              className="cta-on-amber inline-flex items-center justify-center bg-primary text-on-primary font-body-md text-[13px] font-bold uppercase tracking-wide px-8 py-4 rounded-full vibe-glow shrink-0"
            >
              Get in touch
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default BranchesPage;
