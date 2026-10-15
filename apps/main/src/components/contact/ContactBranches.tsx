"use client";

import Link from "next/link";
import { KP2_URL } from "@/lib/kp2";
import { ArrowUpRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  branchDisplayName,
  branchSchedule,
  directionsUrl,
  isKp2Branch,
  isUkBranch,
  mapEmbedUrl,
  primaryVenue,
  publicPhone,
  telHref,
  venueAddress,
  venueAddressParts,
  type ContactLocation,
} from "@/lib/contact-branches";

type Region = "all" | "uk" | "abroad" | "kp2";

type Props = {
  branches: ContactLocation[];
  activeId: string | null;
  onSelect: (branch: ContactLocation) => void;
  onWrite: (branch: ContactLocation) => void;
};

function abroadLabel(branches: ContactLocation[]) {
  const countries = [
    ...new Set(
      branches
        .filter((b) => !isUkBranch(b))
        .map((b) => primaryVenue(b)?.country)
        .filter(Boolean),
    ),
  ] as string[];
  return countries.length === 1 ? countries[0]! : "Outside the UK";
}

/** "KP2 Manchester" → "Manchester": the town part of a branch name. */
function townName(branch: ContactLocation) {
  const name = branchDisplayName(branch.name);
  return isKp2Branch(branch) ? name.replace(/^KP2\s+/i, "") : name;
}

/** A branch name with the KP2 prefix set apart, e.g. [KP2] Manchester. */
function BranchName({ branch }: { branch: ContactLocation }) {
  return isKp2Branch(branch) ? (
    <>
      <span className="hello-kp2">KP2</span> {townName(branch)}
    </>
  ) : (
    <>{townName(branch)}</>
  );
}

/** The line under a town name: the venue, plus the town or country when the name doesn't say it. */
function rowPlace(branch: ContactLocation) {
  const venue = primaryVenue(branch);
  const name = townName(branch).toLowerCase();
  const [place] = venueAddressParts(venue);
  const city = venue?.city && venue.city.toLowerCase() !== name ? venue.city : null;
  const country = isUkBranch(branch) ? null : venue?.country;
  return [place && place !== venue?.city ? place : null, city, country].filter(Boolean).join(", ");
}

function BranchDetail({
  branch,
  onWrite,
  showMap,
}: {
  branch: ContactLocation;
  onWrite: (branch: ContactLocation) => void;
  showMap: boolean;
}) {
  const venue = primaryVenue(branch);
  const { sunday, midweek } = branchSchedule(branch);
  const phone = publicPhone(branch.contact_phone);
  const map = mapEmbedUrl(venue);
  const directions = directionsUrl(venue);
  const name = branchDisplayName(branch.name);

  return (
    <div className="hello-detail">
      {showMap && map ? (
        <div className="hello-detail__map">
          <iframe
            key={map}
            title={`Map of ${isKp2Branch(branch) ? name : `Kharis ${name}`}`}
            src={map}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : null}
      <div className="hello-detail__body">
        <h3 className="hello-detail__name">
          {isKp2Branch(branch) ? <span className="hello-kp2">KP2</span> : "Kharis"}{" "}
          <span>{townName(branch)}</span>
        </h3>
        {venue ? (
          <address className="hello-detail__address">
            {venueAddressParts(venue).map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
        ) : null}
        <dl className="hello-detail__facts">
          <div>
            <dt>Sundays</dt>
            <dd>{sunday || "Ask us for times"}</dd>
          </div>
          {midweek.map((m) => (
            <div key={`${m.day}-${m.time}`}>
              <dt>{m.day}s</dt>
              <dd>{m.time}</dd>
            </div>
          ))}
          {phone ? (
            <div>
              <dt>Call</dt>
              <dd>
                <a href={telHref(phone)}>{phone}</a>
              </dd>
            </div>
          ) : null}
          {branch.contact_email ? (
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${branch.contact_email}`}>{branch.contact_email}</a>
              </dd>
            </div>
          ) : null}
        </dl>
        {isKp2Branch(branch) ? (
          <p className="hello-detail__kp2">
            KP2 has its own home online.{" "}
            <a href={KP2_URL} target="_blank" rel="noreferrer">
              Visit the KP2 site
            </a>
          </p>
        ) : null}
        <div className="hello-detail__actions btn-pair">
          <button type="button" className="btn-primary" onClick={() => onWrite(branch)}>
            Write to {name}
          </button>
          {directions ? (
            <a href={directions} target="_blank" rel="noreferrer" className="btn-secondary">
              Get directions
              <ArrowUpRight className="h-4 w-4" aria-hidden />
              <span className="sr-only">(opens Google Maps)</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ContactBranches({ branches, activeId, onSelect, onWrite }: Props) {
  const [region, setRegion] = useState<Region>("all");
  const [query, setQuery] = useState("");

  const ukCount = branches.filter(isUkBranch).length;
  const abroad = abroadLabel(branches);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return branches.filter((b) => {
      if (region === "uk" && !isUkBranch(b)) return false;
      if (region === "abroad" && isUkBranch(b)) return false;
      if (region === "kp2" && !isKp2Branch(b)) return false;
      if (!q) return true;
      const venue = primaryVenue(b);
      return [branchDisplayName(b.name), venueAddress(venue), venue?.country ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [branches, query, region]);

  // When a search or region hides the chosen branch, show the first one still listed.
  const active = filtered.find((b) => b.id === activeId) ?? filtered[0] ?? null;

  if (branches.length === 0) {
    return (
      <section id="branches" className="hello-branches" aria-labelledby="hello-branches-title">
        <div className="hello-branches__inner">
          <p className="hello-eyebrow">Branches</p>
          <h2 id="hello-branches-title" className="hello-h2">
            Find your <em>Kharis.</em>
          </h2>
          <p className="hello-branches__sub">
            Branch details aren&apos;t loading right now. You can still{" "}
            <Link href="/locations">see every branch on the Locations page</Link>, or write to us
            above and we&apos;ll point you to the nearest one.
          </p>
        </div>
      </section>
    );
  }

  const allRegions: { id: Region; label: string; count: number }[] = [
    { id: "all", label: "All", count: branches.length },
    { id: "uk", label: "UK", count: ukCount },
    { id: "abroad", label: abroad, count: branches.length - ukCount },
    { id: "kp2", label: "KP2", count: branches.filter(isKp2Branch).length },
  ];
  const regions = allRegions.filter((r) => r.count > 0 || r.id === "all");

  return (
    <section id="branches" className="hello-branches" aria-labelledby="hello-branches-title">
      <div className="hello-branches__inner">
        <header className="hello-branches__head">
          <div>
            <p className="hello-eyebrow">Branches</p>
            <h2 id="hello-branches-title" className="hello-h2">
              Find your branch. <em>One family.</em>
            </h2>
            <p className="hello-branches__sub">
              Every Kharis branch keeps the same welcome. Pick yours for service times, directions
              and a map.
            </p>
          </div>
          <div className="hello-branches__tools">
            <label className="hello-search">
              <Search className="h-4 w-4" aria-hidden />
              <span className="sr-only">Search branches</span>
              <input
                type="search"
                placeholder="Search a town or street"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <div className="hello-regions" role="group" aria-label="Show branches in">
              {regions.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  aria-pressed={region === r.id}
                  onClick={() => setRegion(r.id)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="hello-branches__grid">
          <ul className="hello-index" aria-label="Kharis branches">
            {filtered.map((b) => {
              const { sunday } = branchSchedule(b);
              const on = b.id === active?.id;
              return (
                <li key={b.id} className={on ? "is-on" : undefined}>
                  <button
                    type="button"
                    className="hello-index__row"
                    aria-pressed={on}
                    onClick={() => onSelect(b)}
                  >
                    <span className="hello-index__city">
                      <BranchName branch={b} />
                    </span>
                    <span className="hello-index__where">{rowPlace(b)}</span>
                    <span className="hello-index__time">
                      {sunday ? (
                        <>
                          <abbr title="Sunday">Sun</abbr> {sunday}
                        </>
                      ) : null}
                    </span>
                  </button>
                  {on ? (
                    <div className="hello-index__detail">
                      <BranchDetail branch={b} onWrite={onWrite} showMap={false} />
                    </div>
                  ) : null}
                </li>
              );
            })}
            {filtered.length === 0 ? (
              <li className="hello-index__empty">
                No branch matches &ldquo;{query}&rdquo;. Try a nearby town, or{" "}
                <a href="#write">write to us</a> and we&apos;ll help you find one.
              </li>
            ) : null}
          </ul>

          <div className="hello-branches__panel">
            {active ? (
              <BranchDetail branch={active} onWrite={onWrite} showMap />
            ) : (
              <p className="hello-branches__pick">Choose a branch to see its times and map.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
