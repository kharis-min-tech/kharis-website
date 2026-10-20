"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ComicMap, type MapPlace } from "@/components/ComicMap";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { hasCoords, midweekSummary, sundaySummary, type Branch } from "@/lib/branches";
import "@/components/comic-map.css";

function searchText(branch: Branch) {
  return [branch.name, branch.city, branch.region, branch.address, branch.postcode, ...branch.tags]
    .join(" ")
    .toLowerCase();
}

const PLACES: { id: MapPlace; label: string }[] = [
  { id: "world", label: "Whole world" },
  { id: "uk", label: "United Kingdom" },
  { id: "ghana", label: "Ghana" },
  { id: "sierra-leone", label: "Sierra Leone" },
];

function inPlace(region: string, place: MapPlace) {
  if (place === "world") return true;
  const value = region.toLowerCase();
  if (place === "uk") return /united kingdom|\buk\b|england|scotland|wales/.test(value);
  if (place === "ghana") return value.includes("ghana");
  return value.includes("sierra");
}

function milesBetween(aLat: number, aLng: number, bLat: number, bLng: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earth = 3958.8;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * earth * Math.asin(Math.sqrt(h));
}

function BranchesPage({ branches }: { branches: Branch[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [place, setPlace] = useState<MapPlace>("world");
  const [openRegions, setOpenRegions] = useState(false);
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const placeLabel = PLACES.find((item) => item.id === place)?.label ?? "Whole world";

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = branches.filter((branch) => {
      const hay = searchText(branch);
      const matchesQuery = !q || hay.includes(q);
      return matchesQuery && inPlace(branch.region, place);
    });
    if (!origin) return rows;
    return [...rows].sort((a, b) => {
      const aMiles = hasCoords(a) ? milesBetween(origin.lat, origin.lng, a.lat, a.lng) : Infinity;
      const bMiles = hasCoords(b) ? milesBetween(origin.lat, origin.lng, b.lat, b.lng) : Infinity;
      return aMiles - bMiles;
    });
  }, [branches, origin, place, query]);

  const nearest = origin ? visible.find((branch) => hasCoords(branch)) : null;
  const nearestMiles =
    origin && nearest && hasCoords(nearest)
      ? milesBetween(origin.lat, origin.lng, nearest.lat, nearest.lng)
      : null;

  const locate = () => {
    setError("");
    if (!window.isSecureContext || !navigator.geolocation) {
      setError("Location isn't available here. Search by city or postcode instead.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocating(false);
        setError("We couldn't get your location. Search by city or postcode instead.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  };

  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden">
      <SiteHeader />

      <main className="pt-[74px]">
        <section className="kp-find" aria-label="Map of Kharis Phase 2 branches">
          <h1 className="sr-only">Find a Kharis Phase 2 branch near you</h1>
          <form
            className="kp-find__bar"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              document.getElementById("kp-branch-list")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <div className="kp-find__search">
              <span className="material-symbols-outlined kp-find__icon">search</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Town, postcode or branch name"
                aria-label="Search branches by town, postcode or name"
                autoComplete="postal-code"
              />
              {query ? (
                <button
                  type="button"
                  className="kp-find__clear"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              ) : null}
            </div>
            <button type="button" className="kp-find__near" onClick={locate} disabled={locating}>
              {locating ? "Finding you…" : origin ? "Nearest first" : "Near me"}
            </button>
          </form>

          <div className="relative">
            <details
              className="kp-find__picker"
              open={openRegions}
              onToggle={(event) => setOpenRegions(event.currentTarget.open)}
            >
              <summary>
                <span>
                  <span>Explore our family</span>
                  <strong>{placeLabel}</strong>
                </span>
                <span className="material-symbols-outlined" aria-hidden="true">
                  expand_more
                </span>
              </summary>
              <div className="kp-find__menu" role="menu">
                {PLACES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={place === item.id}
                    onClick={() => {
                      setPlace(item.id);
                      setOpenRegions(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </details>
            <ComicMap
              place={place}
              pins={visible.filter(hasCoords).map((branch) => ({
                slug: branch.slug,
                name: branch.name,
                lat: branch.lat,
                lng: branch.lng,
              }))}
              onSelect={(slug) => router.push(`/branches/${slug}`)}
            />
          </div>

          {error ? (
            <p className="kp-find__note" role="status">
              {error}
            </p>
          ) : nearest && nearestMiles != null ? (
            <p className="kp-find__note" role="status">
              Closest: {nearest.name} ({nearestMiles < 1 ? "<1" : Math.round(nearestMiles)} mi).{" "}
              <button type="button" className="underline" onClick={() => setOrigin(null)}>
                Reset
              </button>
            </p>
          ) : null}

          <div className="kp-find__tags" aria-label="Explore a branch">
            {visible.map((branch) => (
              <Link key={branch.slug} href={`/branches/${branch.slug}`}>
                {branch.name} <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1536px] px-margin-mobile md:px-margin-desktop pb-20">
          <h2 className="mb-8 border-b-4 border-on-background pb-6 font-display-lg text-[28px] uppercase">
            Our branches
          </h2>

          {visible.length === 0 ? (
            <div className="brutalist-border bg-surface-container-lowest p-12 text-center">
              <h3 className="font-display-lg text-[24px] uppercase mb-2">
                No branches matched your search
              </h3>
              <p className="font-body-md text-on-surface-variant mb-4">
                Try a nearby city, or get in touch and we will connect you.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-primary text-on-primary font-body-md text-[12px] font-bold uppercase tracking-wide px-5 py-3 brutalist-border brutalist-shadow"
              >
                Get in touch
              </Link>
            </div>
          ) : null}

          <div id="kp-branch-list" className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((branch) => {
              const midweek = midweekSummary(branch);
              const miles =
                origin && hasCoords(branch)
                  ? milesBetween(origin.lat, origin.lng, branch.lat, branch.lng)
                  : null;
              return (
                <article
                  key={branch.slug}
                  className="group flex flex-col justify-between overflow-hidden brutalist-border brutalist-shadow bg-surface-container-lowest transition-colors"
                >
                  <Link href={`/branches/${branch.slug}`} className="text-left w-full">
                    <div className="relative h-52 overflow-hidden bg-on-background">
                      {branch.image ? (
                        <img
                          src={branch.image}
                          alt={branch.name}
                          loading="lazy"
                          className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <span className="absolute left-3 top-3 bg-primary text-on-primary px-3 py-1 font-body-md text-[10px] font-bold uppercase tracking-wider">
                        {branch.region}
                      </span>
                      {miles != null ? (
                        <span className="absolute right-3 top-3 bg-secondary-container text-on-secondary-container px-3 py-1 font-body-md text-[10px] font-bold uppercase tracking-wider">
                          {miles < 1 ? "<1 mi" : `${Math.round(miles)} mi`}
                        </span>
                      ) : null}
                      {nearest?.slug === branch.slug ? (
                        <span className="absolute right-3 bottom-16 bg-primary text-on-primary px-3 py-1 font-body-md text-[10px] font-bold uppercase tracking-wider">
                          Closest to you
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
                  </Link>

                  <div className="space-y-4 p-6">
                    <p className="line-clamp-2 font-body-md text-[13px] leading-relaxed text-on-surface-variant">
                      {branch.blurb}
                    </p>
                    <div className="divide-y-2 divide-on-background/10 overflow-hidden border-2 border-on-background/15 bg-background">
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
                          <span className="material-symbols-outlined shrink-0 text-[18px] text-primary">
                            event
                          </span>
                          <span className="min-w-0 font-body-md text-[12px] font-bold">
                            {midweek}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="border-t-2 border-on-background/15 p-6 pt-4">
                    <Link
                      href={`/branches/${branch.slug}`}
                      className="flex w-full items-center justify-center gap-2 border-2 border-on-background bg-primary px-5 py-3.5 font-body-md text-[13px] font-bold uppercase tracking-wide text-on-primary"
                    >
                      Explore {branch.city}
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-t-4 border-on-background bg-secondary-container text-on-secondary-container">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="font-display-lg text-headline-lg uppercase leading-none mb-2">
                Can&apos;t find a branch nearby?
              </h2>
              <p className="font-body-md text-body-md max-w-xl">
                Tell us where you are. We&apos;re planting new branches and we&apos;d love to
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
      </main>

      <SiteFooter />
      <ThemeToggle />
    </div>
  );
}

export default BranchesPage;
