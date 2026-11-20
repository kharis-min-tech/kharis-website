"use client";
/* eslint-disable @next/next/no-img-element -- branch photos are shown as uploaded; the image optimizer softened them */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BranchItem } from "@/lib/branches";
import { AtomicGlobeBranches } from "@/components/branches/AtomicGlobeBranches";
import type { GlobeBranch } from "@/lib/globe-branches";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { kp2BranchUrl } from "@/lib/kp2";

interface Props {
  items: BranchItem[];
  full: GlobeBranch[];
}

type Origin = { lat: number; lng: number };
type SearchOrigin = Origin & { label: string; query: string };

const normalizeText = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

function matchesBranchText(branch: BranchItem, normalizedQuery: string): boolean {
  if (!normalizedQuery) return true;
  const compactQuery = normalizedQuery.replace(/\s+/g, "");
  const fields = [
    branch.name,
    branch.place,
    branch.city,
    branch.region,
    branch.country,
    branch.address,
    branch.postcode,
  ]
    .filter(Boolean)
    .map((v) => normalizeText(v!));

  if (fields.some((value) => value.includes(normalizedQuery))) return true;
  if (branch.postcode && branch.postcode.toLowerCase().replace(/\s+/g, "").includes(compactQuery)) {
    return true;
  }

  const combined = fields.join(" ");
  const tokens = normalizedQuery.split(" ").filter(Boolean);
  return tokens.length > 1 && tokens.every((token) => combined.includes(token));
}

const KP2 = "KP2";

/**
 * The ordinary churches. Any other family is a KIND of branch within a
 * country, not a place of its own, so it is listed under that country as a
 * labelled subsection rather than beside it.
 *
 * KP2 used to be a filter sitting in the row next to United Kingdom, Ghana
 * and Sierra Leone, which asked people to choose between a country and an
 * age group. Nothing below names KP2: families are read off the data and
 * anything new appears on its own, under its country, with no code to
 * change.
 */
const PRIMARY_FAMILY = "Kharis";

/** How a family is introduced. A family with no entry here uses its own name. */
const FAMILY_LABELS: Record<string, string> = {
  [KP2]: "Kharis Phase 2",
};

/** KP2 branches have their own pages on the KP2 site. */
const branchHref = (branch: BranchItem) =>
  branch.family === KP2 ? kp2BranchUrl(branch.id) : `/locations/${branch.id}`;

function milesBetween(a: Origin, b: Origin) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(h));
}

export function LocationsClient({ items, full }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [searchOrigin, setSearchOrigin] = useState<SearchOrigin | null>(null);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [locating, setLocating] = useState(false);
  const [geoNote, setGeoNote] = useState("");
  const geocodeAbortRef = useRef<AbortController | null>(null);

  const normalizedQuery = normalizeText(query);
  const activeSearchOrigin =
    searchOrigin && searchOrigin.query === normalizedQuery ? searchOrigin : null;
  const activeOrigin: Origin | null = activeSearchOrigin ?? origin;

  /* Every country we meet in, including one that so far has only a KP2
   * branch: a country is a country whoever is gathering there. */
  const countries = useMemo(() => {
    const seen = items.map((b) => b.country);
    return [...new Set(seen)].sort((a, b) =>
      a === "United Kingdom" ? -1 : b === "United Kingdom" ? 1 : a.localeCompare(b),
    );
  }, [items]);

  /** Read off the data, ordinary churches first, so a new kind needs no code. */
  const families = useMemo(() => {
    const seen = [...new Set(items.map((b) => b.family))];
    return seen.sort((a, b) =>
      a === PRIMARY_FAMILY ? -1 : b === PRIMARY_FAMILY ? 1 : a.localeCompare(b),
    );
  }, [items]);

  const filters = useMemo(
    () =>
      [
        { id: "all", label: "All", count: items.length },
        ...countries.map((c) => ({
          id: c,
          label: c,
          count: items.filter((b) => b.country === c).length,
        })),
      ].filter((f) => f.count > 0),
    [items, countries],
  );

  const directMatches = useMemo(() => {
    if (!normalizedQuery) return items;
    return items.filter((b) => matchesBranchText(b, normalizedQuery));
  }, [items, normalizedQuery]);

  const geocodeAddress = useCallback(async (rawQuery: string): Promise<SearchOrigin | null> => {
    const trimmed = rawQuery.trim();
    const norm = normalizeText(trimmed);
    if (norm.length < 2) return null;

    geocodeAbortRef.current?.abort();
    const controller = new AbortController();
    geocodeAbortRef.current = controller;
    setSearchingAddress(true);

    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(trimmed)}`, {
        signal: controller.signal,
      });
      if (!res.ok) return null;
      const data = (await res.json()) as {
        result?: { lat: number; lng: number; label: string } | null;
      };
      if (!data.result) return null;
      const found: SearchOrigin = {
        lat: data.result.lat,
        lng: data.result.lng,
        label: data.result.label,
        query: norm,
      };
      setSearchOrigin(found);
      setFilter("all");
      return found;
    } catch {
      return null;
    } finally {
      if (geocodeAbortRef.current === controller) {
        setSearchingAddress(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!normalizedQuery || normalizedQuery.length < 2 || directMatches.length > 0) {
      geocodeAbortRef.current?.abort();
      setSearchingAddress(false);
      return;
    }
    if (activeSearchOrigin) return;

    const timer = window.setTimeout(() => {
      void geocodeAddress(query);
    }, 450);
    return () => window.clearTimeout(timer);
  }, [normalizedQuery, query, directMatches.length, activeSearchOrigin, geocodeAddress]);

  const shown = useMemo(() => {
    const base = activeSearchOrigin ? items : directMatches;
    return base
      .filter((b) => filter === "all" || b.country === filter)
      .map((b) => ({
        branch: b,
        miles:
          activeOrigin && b.latitude != null && b.longitude != null
            ? milesBetween(activeOrigin, { lat: b.latitude, lng: b.longitude })
            : null,
      }));
  }, [items, directMatches, filter, activeSearchOrigin, activeOrigin]);

  /*
   * Nearest first once we know where the visitor is; otherwise by country,
   * and inside each country by family: the ordinary churches first and
   * unlabelled, because they are what "a Kharis church in Ghana" means, then
   * a labelled section for every other kind.
   */
  const groups = useMemo(() => {
    if (activeOrigin) {
      const sorted = [...shown].sort((a, b) => (a.miles ?? Infinity) - (b.miles ?? Infinity));
      return sorted.length
        ? [
            {
              title: activeSearchOrigin
                ? `Nearest to ${activeSearchOrigin.label}`
                : "Nearest to you",
              sections: [{ key: "near", label: null, rows: sorted }],
            },
          ]
        : [];
    }
    return countries
      .map((country) => ({
        title: country,
        sections: families
          .map((family) => ({
            key: family,
            label: family === PRIMARY_FAMILY ? null : (FAMILY_LABELS[family] ?? family),
            rows: shown.filter(
              ({ branch }) => branch.country === country && branch.family === family,
            ),
          }))
          .filter((section) => section.rows.length),
      }))
      .filter((group) => group.sections.length);
  }, [shown, activeOrigin, activeSearchOrigin, countries, families]);

  /*
   * The globe's country cards link to "#branches:<country>", and this is the
   * half that gives that suffix meaning: select the country, then scroll.
   *
   * They used to link to a bare "#branches", which jumped to a list still
   * showing every branch in the world, so choosing Ghana on the globe and
   * then choosing Ghana again in the filter row was two steps for one
   * intention. Setting `filter` also aims the globe, which is the same thing
   * the filter row does, so the two stay in step.
   *
   * The hash is put back to plain "#branches" afterwards: hashchange only
   * fires when the hash actually changes, and without this, clicking the
   * same country twice would be silent the second time.
   */
  useEffect(() => {
    const apply = () => {
      const match = /^#branches:(.+)$/.exec(window.location.hash);
      if (!match) return;
      const country = decodeURIComponent(match[1]!);
      if (items.some((b) => b.country === country)) setFilter(country);
      window.history.replaceState(null, "", "#branches");
      document.getElementById("branches")?.scrollIntoView({ behavior: "smooth" });
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [items]);

  const locate = () => {
    if (!navigator.geolocation) {
      setGeoNote("Your browser can't share your location. Search by address or postcode instead.");
      return;
    }
    setLocating(true);
    setGeoNote("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSearchOrigin(null);
        setQuery("");
        setFilter("all");
        setLocating(false);
        document.getElementById("branches")?.scrollIntoView({ behavior: "smooth" });
      },
      () => {
        setGeoNote("We couldn't get your location. Search by address or postcode instead.");
        setLocating(false);
      },
      { timeout: 10000 },
    );
  };

  const scrollToBranches = () => {
    document.getElementById("branches-title")?.focus({ preventScroll: true });
    document.getElementById("branches")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <div className="locations-page">
      {/* The hero is a page surface now, not a dark slab, so the header
          follows the theme with it. */}
      <SiteHeader tone="light" />

      <section className="locations-hero">
        <div className="locations-hero__intro">
          <p className="locations-hero__eyebrow">Locations</p>
          <h1 className="locations-hero__title">
            Don&apos;t just believe. <span>Belong.</span>
          </h1>
          <p className="locations-hero__lead">The Christian life is a one another life.</p>

          <form
            role="search"
            className="locations-search"
            onSubmit={async (e) => {
              e.preventDefault();
              if (normalizedQuery && directMatches.length === 0 && !activeSearchOrigin) {
                await geocodeAddress(query);
              }
              scrollToBranches();
            }}
          >
            <label htmlFor="branch-search" className="sr-only">
              Search branches by address, town, postcode or name
            </label>
            <input
              id="branch-search"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!e.target.value.trim()) setSearchOrigin(null);
              }}
              placeholder="Address, town, postcode or branch name"
              autoComplete="postal-code"
              className="locations-search__input"
            />
            <button type="submit" className="btn-give" disabled={searchingAddress}>
              {searchingAddress ? "Searching…" : "Search"}
            </button>
            <button type="button" className="btn-secondary" onClick={locate} disabled={locating}>
              {locating
                ? "Finding you…"
                : origin && !activeSearchOrigin
                  ? "Nearest first"
                  : "Near me"}
            </button>
          </form>
          {query.trim() ? (
            <p className="locations-hero__note" role="status">
              {searchingAddress
                ? "Finding nearest branches…"
                : activeSearchOrigin
                  ? `Showing nearest branches to ${activeSearchOrigin.label}`
                  : shown.length === 1
                    ? "1 branch found"
                    : `${shown.length} branches found`}
            </p>
          ) : null}
          {geoNote ? (
            <p className="locations-hero__note" role="status">
              {geoNote}
            </p>
          ) : null}
        </div>

        {/* One marker per country rather than per branch: the globe states the
            reach, and the filtered list below is where you actually choose a
            branch. Picking every branch out of a cluster was never something
            the globe did well. */}
        <div className="locations-hero__globe">
          <AtomicGlobeBranches
            branches={full}
            country={filter === "all" ? "world" : filter}
            hrefFor={(branch) =>
              items.find((item) => item.id === branch.slug)?.family === KP2
                ? kp2BranchUrl(branch.slug)
                : `/locations/${branch.slug}`
            }
          />
        </div>
      </section>

      <section id="branches" className="locations-list" aria-labelledby="branches-title">
        <div className="locations-list__head">
          <p className="eyebrow">Every branch</p>
          <h2 id="branches-title" tabIndex={-1} className="section-title mt-2">
            Where we meet on Sunday
          </h2>
        </div>

        <div className="locations-filters" role="group" aria-label="Show branches in">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              className="locations-filter"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {groups.length === 0 ? (
          <div className="locations-empty">
            <h3>
              {items.length
                ? `No branch matches “${query.trim()}”`
                : "We couldn't load the branch directory"}
            </h3>
            <p>
              {items.length
                ? "Try a nearby town or the first half of your postcode, or "
                : "Please try again shortly, or "}
              <Link href="/contact">message us</Link> and we&apos;ll point you to the closest one.
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.title} className="locations-group">
              <h3 className="locations-group__title">{group.title}</h3>
              {group.sections.map((section) => (
                <div key={section.key} className="locations-subgroup">
                  {section.label ? (
                    <h4 className="locations-subgroup__title">{section.label}</h4>
                  ) : null}
                  <ul className="locations-grid">
                    {section.rows.map(({ branch, miles }) => (
                      <BranchCard
                        key={branch.id}
                        branch={branch}
                        miles={miles}
                        showCountry={Boolean(activeOrigin)}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))
        )}
      </section>

      <SiteFooter />
    </div>
  );
}

function BranchCard({
  branch,
  miles,
  showCountry,
}: {
  branch: BranchItem;
  miles: number | null;
  /** The country heading is gone when the list is sorted by distance. */
  showCountry: boolean;
}) {
  const href = branchHref(branch);
  const distance =
    miles == null
      ? ""
      : miles < 10
        ? `${miles.toFixed(1)} mi away`
        : `${Math.round(miles).toLocaleString("en-GB")} mi away`;

  return (
    <li className="branch-card">
      <Link href={href} className="branch-card__media" tabIndex={-1} aria-hidden>
        {branch.photo ? (
          <img src={branch.photo} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="branch-card__fallback">
            <img
              src="https://images.kharis.org/site-images/main/113a6a24b1d3741b/kharis-logo.png"
              alt=""
            />
            <span>{branch.place}</span>
          </span>
        )}
      </Link>

      <div className="branch-card__body">
        <p className="branch-card__label">
          {[branch.family === KP2 ? "KP2" : "Kharis", showCountry && branch.country, distance]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <h4 className="branch-card__name">
          <Link href={href}>{branch.place}</Link>
        </h4>
        {branch.address ? (
          <p className="branch-card__address">
            {branch.address}
            {branch.postcode ? `, ${branch.postcode}` : ""}
          </p>
        ) : null}

        <p className="branch-card__sunday">
          <span>Sunday</span>
          {branch.sundayTimes.length ? branch.sundayTimes.join(" & ") : "Times coming soon"}
        </p>
        {branch.gatherings.length ? (
          <ul className="branch-card__also">
            {branch.gatherings.map((g) => (
              <li key={`${g.day}-${g.time}`}>
                {g.day} {g.time} · {g.label}
                {g.place ? (/zoom/i.test(g.place) ? " on Zoom" : ` at ${g.place}`) : ""}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="branch-card__actions btn-pair">
          <Link href={href} className="btn-primary">
            Plan your visit
          </Link>
          {branch.directions ? (
            <a
              href={branch.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Directions
            </a>
          ) : null}
        </div>
      </div>
    </li>
  );
}
