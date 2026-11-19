"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Petitpoint, type PetitpointLocation } from "@/components/Petitpoint";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { hasCoords, mapsQuery, splitServices, type Branch } from "@/lib/branches";
import { mapsDirectionsUrl } from "@/lib/calendar";
import "@/components/comic-map.css";
import "@/components/branch-cards.css";

const BRANCH_MARK = "https://images.kharis.org/site-images/main/113a6a24b1d3741b/kharis-logo.png";

function searchText(branch: Branch) {
  return [branch.name, branch.city, branch.region, branch.address, branch.postcode, ...branch.tags]
    .join(" ")
    .toLowerCase();
}

function establishedFor(branch: Branch) {
  const key = `${branch.slug} ${branch.city}`.toLowerCase();
  if (key.includes("london")) return "Est. 2019";
  if (key.includes("birmingham") || key.includes("romford")) return "Est. 2021";
  return "Est. 2026";
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
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = branches.filter((branch) => !q || searchText(branch).includes(q));
    if (!origin) return rows;
    return [...rows].sort((a, b) => {
      const aMiles = hasCoords(a) ? milesBetween(origin.lat, origin.lng, a.lat, a.lng) : Infinity;
      const bMiles = hasCoords(b) ? milesBetween(origin.lat, origin.lng, b.lat, b.lng) : Infinity;
      return aMiles - bMiles;
    });
  }, [branches, origin, query]);

  const mapLocations = useMemo<PetitpointLocation[]>(
    () =>
      visible.filter(hasCoords).map((branch) => {
        const { sunday } = splitServices(branch.services);
        const sun = sunday[0] ?? branch.serviceTimes[0];
        const address = [branch.address, branch.postcode].filter(Boolean).join(", ");
        const serviceText = sun ? `${sun.day} · ${sun.time}` : "Sunday Service";
        return {
          id: branch.slug,
          title: branch.name,
          category: establishedFor(branch),
          caption: address ? `${serviceText} — ${address}` : serviceText,
          latitude: branch.lat,
          longitude: branch.lng,
          imageURL: branch.image || undefined,
          link: `/branches/${branch.slug}`,
        };
      }),
    [visible],
  );

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

          <div className="kp-find__stage">
            <div className="kp-map-top">
              <form
                className="kp-find__bar"
                role="search"
                onSubmit={(event) => {
                  event.preventDefault();
                  document.getElementById("kp-branch-list")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="kp-find__search">
                  <span className="material-symbols-outlined kp-find__icon" aria-hidden="true">
                    search
                  </span>
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search..."
                    aria-label="Search KP2 branches"
                    autoComplete="off"
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
                  <span className="kp-find__badge">{mapLocations.length} Hubs</span>
                </div>
                <button
                  type="button"
                  className={`kp-find__near${origin ? " is-active" : ""}`}
                  onClick={locate}
                  disabled={locating}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                    near_me
                  </span>
                  <span>{locating ? "Finding you…" : origin ? "Nearest first" : "Near me"}</span>
                </button>
              </form>
            </div>

            <Petitpoint
              locations={mapLocations}
              view={{
                region: "england",
                detail: "fine",
                shape: "square",
                gap: 0.24,
                oceanGrid: true,
                animate: true,
              }}
              layers={{
                heatmap: true,
                markers: true,
                routes: true,
                closeLoop: false,
                routeSpeed: 10,
                daylight: false,
              }}
              heatmap={{
                palette: "kp2",
                spread: 0.85,
                strength: 1.1,
                breathe: true,
                seaGlow: true,
                legend: false,
              }}
              markers={{
                style: "square",
                size: 1,
                colorBy: "accent",
                pulse: true,
                labels: "always",
              }}
              card={{
                enabled: true,
                width: 276,
                showImage: true,
                showCoords: true,
                meter: false,
                linkText: "See Full Branch",
              }}
              tour={{ autoplay: false }}
              theme={{ preset: "kp2" }}
              controls
              userLocation={
                origin
                  ? {
                      latitude: origin.lat,
                      longitude: origin.lng,
                      label: "You are here",
                    }
                  : null
              }
              ui={{
                intro: "sweep",
                readout: true,
                countLabel: "HUBS",
                filters: false,
                ariaLabel: "Interactive England map of Kharis Phase 2 branches",
              }}
              onSelectLink={(location) => {
                if (location.link) router.push(location.link);
              }}
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
        </section>

        <section className="mx-auto w-full max-w-[1536px] px-margin-mobile md:px-margin-desktop pt-12 md:pt-16 pb-20">
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

          <div id="kp-branch-list" className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((branch) => {
              const { sunday, midweek } = splitServices(branch.services);
              const sun = sunday[0] ?? branch.serviceTimes[0];
              const mid = midweek[0];
              const miles =
                origin && hasCoords(branch)
                  ? milesBetween(origin.lat, origin.lng, branch.lat, branch.lng)
                  : null;
              const address = [branch.address, branch.postcode].filter(Boolean).join(", ");
              return (
                <article key={branch.slug} className="kp-branch-card">
                  <Link
                    href={`/branches/${branch.slug}`}
                    className="kp-branch-card__media"
                    tabIndex={-1}
                    aria-hidden
                  >
                    {branch.image ? (
                      <img src={branch.image} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <span className="kp-branch-card__fallback">
                        <img src={BRANCH_MARK} alt="" />
                        <span>{branch.city || branch.name}</span>
                      </span>
                    )}
                  </Link>
                  <div className="kp-branch-card__body">
                    <p className="kp-branch-card__label">
                      {[
                        "KP2",
                        miles != null
                          ? miles < 1
                            ? "<1 mi away"
                            : `${Math.round(miles)} mi away`
                          : "",
                        nearest?.slug === branch.slug ? "Closest" : "",
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <h3 className="kp-branch-card__name">
                      <Link href={`/branches/${branch.slug}`}>{branch.name}</Link>
                    </h3>
                    {address ? <p className="kp-branch-card__address">{address}</p> : null}
                    <p className="kp-branch-card__sunday">
                      <span>{sun?.day || "Sunday"}</span>
                      {sun?.time || "Times coming soon"}
                    </p>
                    {mid ? (
                      <p className="kp-branch-card__also">
                        {mid.day} {mid.time}
                        {mid.label ? ` · ${mid.label}` : " · Midweek service"}
                      </p>
                    ) : null}
                    <div className="kp-branch-card__actions">
                      <Link
                        href={`/branches/${branch.slug}`}
                        className="kp-branch-card__visit no-accent-fill"
                      >
                        Plan your visit
                      </Link>
                      <a
                        href={mapsDirectionsUrl(mapsQuery(branch))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="kp-branch-card__directions no-accent-fill"
                      >
                        Directions
                      </a>
                    </div>
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
