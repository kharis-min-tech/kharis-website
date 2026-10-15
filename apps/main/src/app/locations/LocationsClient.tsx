"use client";
/* eslint-disable @next/next/no-img-element -- branch photos are shown as uploaded; the image optimizer softened them */

import Link from "next/link";
import { useSmoothRouter } from "@/lib/use-smooth-router";
import { useMemo, useState } from "react";
import type { BranchItem } from "@/lib/branches";
import BranchMap, { type GlobeBranch } from "@/components/branches/BranchMap";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { UnsureBranchCta } from "@/components/UnsureBranchCta";
import { kp2BranchUrl } from "@/lib/kp2";

interface Props {
  items: BranchItem[];
  full: GlobeBranch[];
}

type Origin = { lat: number; lng: number };

const KP2 = "KP2";

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

/** "the United Kingdom, Ghana and Sierra Leone" */
function listCountries(countries: string[]) {
  const names = countries.map((c) => (c === "United Kingdom" ? "the United Kingdom" : c));
  return names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0];
}

export function LocationsClient({ items, full }: Props) {
  const router = useSmoothRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [locating, setLocating] = useState(false);
  const [geoNote, setGeoNote] = useState("");

  const countries = useMemo(() => {
    const seen = items.filter((b) => b.family !== KP2).map((b) => b.country);
    return [...new Set(seen)].sort((a, b) =>
      a === "United Kingdom" ? -1 : b === "United Kingdom" ? 1 : a.localeCompare(b),
    );
  }, [items]);

  const filters = useMemo(
    () =>
      [
        { id: "all", label: "All", count: items.length },
        ...countries.map((c) => ({
          id: c,
          label: c,
          count: items.filter((b) => b.family !== KP2 && b.country === c).length,
        })),
        { id: KP2, label: "KP2 young adults", count: items.filter((b) => b.family === KP2).length },
      ].filter((f) => f.count > 0),
    [items, countries],
  );

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((b) =>
        filter === "all"
          ? true
          : filter === KP2
            ? b.family === KP2
            : b.family !== KP2 && b.country === filter,
      )
      .filter(
        (b) =>
          !q ||
          [b.name, b.place, b.city, b.postcode, b.address].some((v) =>
            v?.toLowerCase().includes(q),
          ),
      )
      .map((b) => ({
        branch: b,
        miles:
          origin && b.latitude != null && b.longitude != null
            ? milesBetween(origin, { lat: b.latitude, lng: b.longitude })
            : null,
      }));
  }, [items, filter, query, origin]);

  // Nearest first once we know where the visitor is; otherwise grouped by country, KP2 last.
  const groups = useMemo(() => {
    if (origin) {
      const sorted = [...shown].sort((a, b) => (a.miles ?? Infinity) - (b.miles ?? Infinity));
      return sorted.length ? [{ title: "Nearest to you", rows: sorted }] : [];
    }
    return [...countries, KP2]
      .map((title) => ({
        title: title === KP2 ? "KP2 · young adults" : title,
        rows: shown.filter(({ branch }) =>
          title === KP2 ? branch.family === KP2 : branch.family !== KP2 && branch.country === title,
        ),
      }))
      .filter((g) => g.rows.length);
  }, [shown, origin, countries]);

  const locate = () => {
    if (!navigator.geolocation) {
      setGeoNote("Your browser can't share your location. Search by town or postcode instead.");
      return;
    }
    setLocating(true);
    setGeoNote("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setFilter("all");
        setLocating(false);
        document.getElementById("branches")?.scrollIntoView({ behavior: "smooth" });
      },
      () => {
        setGeoNote("We couldn't get your location. Search by town or postcode instead.");
        setLocating(false);
      },
      { timeout: 10000 },
    );
  };

  return (
    <div className="locations-page">
      <SiteHeader />

      <section className="locations-hero">
        <div className="locations-hero__intro">
          <p className="locations-hero__eyebrow">Locations</p>
          <h1 className="locations-hero__title">Many branches. One family.</h1>
          <p className="locations-hero__lead">
            {items.length ? (
              <>
                Find your Kharis family across {listCountries(countries)}. Every branch meets this
                Sunday.
              </>
            ) : (
              "Our branch directory is temporarily unavailable. You can still explore the globe or contact us to find your Kharis family."
            )}
          </p>

          <form
            role="search"
            className="locations-search"
            onSubmit={(e) => {
              e.preventDefault();
              document.getElementById("branches")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <label htmlFor="branch-search" className="sr-only">
              Search branches by town, postcode or name
            </label>
            <input
              id="branch-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Town, postcode or branch name"
              autoComplete="postal-code"
              className="locations-search__input"
            />
            <button type="button" className="btn-give" onClick={locate} disabled={locating}>
              {locating ? "Finding you…" : origin ? "Nearest first" : "Near me"}
            </button>
          </form>
          {geoNote ? (
            <p className="locations-hero__note" role="status">
              {geoNote}
            </p>
          ) : null}
        </div>

        <BranchMap
          bare
          country={filter === "all" || filter === KP2 ? "world" : filter}
          onCountryChange={(country) => setFilter(country === "world" ? "all" : country)}
          origin={origin}
          branches={full}
          onSelectBranch={(id) => {
            const branch = items.find((b) => b.id === id);
            if (branch?.family === KP2) window.location.assign(kp2BranchUrl(id));
            else router.push(`/locations/${id}`);
          }}
        />
      </section>

      <figure className="locations-sunday">
        <div className="locations-sunday__photos">
          <img
            src="https://images.kharis.org/site-images/main/8687dacfd8faa5e2/locations/london-sunday-laughter.jpg"
            alt="Three women in the congregation laughing together during the service"
            loading="lazy"
            decoding="async"
          />
          <img
            src="https://images.kharis.org/site-images/main/894014bef2ca905c/locations/london-sunday-prayer.jpg"
            alt="A row of people standing side by side in prayer, hands open"
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption>Sunday at Kharis London</figcaption>
      </figure>

      <section id="branches" className="locations-list" aria-labelledby="branches-title">
        <div className="locations-list__head">
          <p className="eyebrow">Every branch</p>
          <h2 id="branches-title" className="section-title mt-2">
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
              <ul className="locations-grid">
                {group.rows.map(({ branch, miles }) => (
                  <BranchCard
                    key={branch.id}
                    branch={branch}
                    miles={miles}
                    showCountry={Boolean(origin)}
                  />
                ))}
              </ul>
            </div>
          ))
        )}
      </section>

      <UnsureBranchCta showFindBranch={false} />
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
