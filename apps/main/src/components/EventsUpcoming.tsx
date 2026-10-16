"use client";

import Image from "@/components/SiteImage";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, Calendar, MapPin, Search } from "lucide-react";
import { motion } from "framer-motion";
import { EVENT_FILTERS, type EventFilter } from "@/data/event-categories";
import { formatEventDateNum, formatEventMonthShort } from "@/lib/events-content";
import type { ServiceBranch, ServiceVisit } from "@/lib/service-branches";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { BranchSelect, useStoredBranch } from "./BranchSelect";
import "./events-next.css";

const ease = [0.22, 1, 0.36, 1] as const;
const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const noSubscribe = () => () => {};

/** Current London date and time as "YYYY-MM-DD HH:mm". */
function londonNow() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function minutesOf(time: string) {
  const m = time.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!m) return null;
  const h = Number(m[1]);
  const meridiem = m[3]?.toLowerCase();
  const hour = meridiem ? (h % 12) + (meridiem === "pm" ? 12 : 0) : h;
  return hour * 60 + Number(m[2] ?? 0);
}

/**
 * Date (YYYY-MM-DD) of the next service on `visit.day`, plus `weeks` extra weeks.
 * Today counts until two hours after the last start time.
 */
function nextDate(now: string, visit: ServiceVisit, weeks = 0) {
  const target = WEEKDAYS.indexOf(visit.day.trim().slice(0, 3).toLowerCase());
  if (target < 0) return null;
  const [today = "", clock = "00:00"] = now.split(" ");
  const d = new Date(`${today}T12:00:00Z`);
  let ahead = (target - d.getUTCDay() + 7) % 7;
  if (ahead === 0) {
    const starts = visit.times.map(minutesOf).filter((n): n is number => n !== null);
    const [h = 0, m = 0] = clock.split(":").map(Number);
    if (starts.length && h * 60 + m > Math.max(...starts) + 120) ahead = 7;
  }
  d.setUTCDate(d.getUTCDate() + ahead + weeks * 7);
  return d.toISOString().slice(0, 10);
}

function shortDate(date: string) {
  const d = new Date(`${date}T12:00:00`);
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

function countryList(branches: ServiceBranch[]) {
  const names = new Set<string>();
  for (const b of branches) {
    const c = b.country?.trim();
    if (!c) continue;
    names.add(/^(uk|united kingdom|england|great britain|gb)$/i.test(c) ? "the UK" : c);
  }
  const list = [...names].sort((a, b) =>
    a === "the UK" ? -1 : b === "the UK" ? 1 : a.localeCompare(b),
  );
  if (list.length < 2) return list[0] ?? "";
  return `${list.slice(0, -1).join(", ")} & ${list.at(-1)}`;
}

function RevealHeading({ id, text }: { id: string; text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [phase, setPhase] = useState<"idle" | "armed" | "revealed">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPhase("armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setPhase("revealed");
        io.disconnect();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <h2 ref={ref} id={id} className={`events-next__title is-${phase}`} aria-label={text}>
      {text.split(" ").map((word, w) => (
        <Fragment key={w}>
          {w > 0 ? " " : null}
          <span className="events-next__word" aria-hidden>
            <span style={{ transitionDelay: `${w * 65}ms` }}>{word}</span>
          </span>
        </Fragment>
      ))}
    </h2>
  );
}

type ServiceTileProps = {
  name: string;
  photo: string;
  position?: string;
  date: string | null;
  visit: ServiceVisit | null;
  branch: ServiceBranch;
  missing: string;
};

function ServiceTile({ name, photo, position, date, visit, branch, missing }: ServiceTileProps) {
  const body = (
    <>
      <Image
        src={photo}
        alt=""
        fill
        quality={95}
        className="object-cover"
        style={position ? { objectPosition: position } : undefined}
        sizes="(max-width: 559px) 100vw, (max-width: 1023px) 50vw, 25vw"
      />
      <span className="events-next__veil" aria-hidden />
      {date ? (
        <span className="events-next__date" aria-hidden>
          <span className="events-next__date-month">{formatEventMonthShort(date)}</span>
          <span className="events-next__date-day">{formatEventDateNum(date)}</span>
        </span>
      ) : null}
      <span className="events-next__copy">
        <span className="events-next__name">{name}</span>
        {visit ? (
          <>
            <span className="events-next__meta">
              <Calendar aria-hidden className="events-next__ico" />
              {date ? shortDate(date) : `Every ${visit.day}`} · {visit.times.join(" & ")}
            </span>
            <span className="events-next__meta">
              <MapPin aria-hidden className="events-next__ico" />
              <span className="events-next__venue">{visit.venue || branch.name}</span>
            </span>
            {visit.mapsUrl ? (
              <span className="events-next__go">
                Get directions
                <ArrowUpRight aria-hidden className="events-next__ico" />
              </span>
            ) : null}
          </>
        ) : (
          <span className="events-next__meta">{missing}</span>
        )}
      </span>
    </>
  );

  if (visit?.mapsUrl) {
    return (
      <a
        className="events-next__tile"
        href={visit.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {body}
        <span className="sr-only"> (opens Google Maps in a new tab)</span>
      </a>
    );
  }
  return (
    <Link className="events-next__tile" href={branch.href}>
      {body}
    </Link>
  );
}

type FilterProps = {
  filter: EventFilter;
  query: string;
  resultCount: number;
  onFilter: (filter: EventFilter) => void;
  onQuery: (query: string) => void;
};

function EventFilters({ filter, query, resultCount, onFilter, onQuery }: FilterProps) {
  return (
    <div className="events-filter">
      <div className="events-filter__chips" role="group" aria-label="Show events">
        {EVENT_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`events-filter__chip${f.id === filter ? " is-active" : ""}`}
            aria-pressed={f.id === filter}
            onClick={() => onFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <label className="events-filter__search">
        <Search aria-hidden className="events-filter__search-ico" />
        <span className="sr-only">Search events</span>
        <input
          type="search"
          value={query}
          placeholder="Search events"
          autoComplete="off"
          onChange={(e) => onQuery(e.target.value)}
        />
      </label>
      <p className="sr-only" aria-live="polite">
        {resultCount === 1 ? "1 event shown" : `${resultCount} events shown`}
      </p>
    </div>
  );
}

/** Upcoming squares that don't belong to the chosen service fade back. */
const DIMMED: Partial<Record<EventFilter, string[]>> = {
  sunday: ["midweek"],
  midweek: ["this-sunday", "next-sunday"],
};

type Props = FilterProps & {
  branches: ServiceBranch[];
};

export function EventsUpcoming({ branches, ...filters }: Props) {
  const reduce = usePrefersReducedMotion();
  const branch = useStoredBranch(branches);
  const now = useSyncExternalStore(noSubscribe, londonNow, () => null);

  const sunday = branch?.sunday ?? null;
  const midweek = branch?.midweek ?? null;
  const dateOn = (visit: ServiceVisit, weeks = 0) => (now ? nextDate(now, visit, weeks) : null);
  const countries = countryList(branches);

  const tiles = branch
    ? [
        <ServiceTile
          key="this-sunday"
          name="This Sunday"
          photo="https://images.kharis.org/site-images/main/850b7f32a7f6712c/joyful-worship.jpg"
          position="55% 35%"
          date={sunday ? dateOn(sunday) : null}
          visit={sunday}
          branch={branch}
          missing={`${branch.name} doesn’t list a Sunday service yet.`}
        />,
        <ServiceTile
          key="midweek"
          name={midweek ? `Midweek · ${midweek.day}` : "Midweek"}
          photo="https://images.kharis.org/site-images/main/1cd1968f552f6970/hero/worship-altar.jpg"
          position="62% 50%"
          date={midweek ? dateOn(midweek) : null}
          visit={midweek}
          branch={branch}
          missing={`${branch.name} doesn’t list a midweek service yet.`}
        />,
        <ServiceTile
          key="next-sunday"
          name="Next Sunday"
          photo="https://images.kharis.org/site-images/main/00a8e9b517ac4517/hero/easter-bibles-raised.jpg"
          position="45% 40%"
          date={sunday ? dateOn(sunday, 1) : null}
          visit={sunday}
          branch={branch}
          missing={`${branch.name} doesn’t list a Sunday service yet.`}
        />,
      ]
    : [];

  tiles.push(
    <Link key="find" href="/locations" className="events-next__tile events-next__tile--find">
      <Image
        src="https://images.kharis.org/site-images/main/074fce9dca42072a/branch-slide-4.jpg"
        alt=""
        fill
        quality={95}
        className="object-cover"
        style={{ objectPosition: "40% 50%" }}
        sizes="(max-width: 559px) 100vw, (max-width: 1023px) 50vw, 25vw"
      />
      <span className="events-next__find-veil" aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG */}
      <img
        src="https://images.kharis.org/site-images/main/5c32b446a93fde12/kharis-globe.svg"
        alt=""
        aria-hidden
        className="events-next__find-globe"
      />
      <MapPin aria-hidden className="events-next__find-pin" strokeWidth={1.5} />
      <span className="events-next__copy">
        <span className="events-next__name">Find your church</span>
        <span className="events-next__find-copy">
          Find a Kharis near you
          {countries ? ` across ${countries}` : ""}.
        </span>
        <span className="events-next__go">
          See all locations
          <ArrowUpRight aria-hidden className="events-next__ico" />
        </span>
      </span>
    </Link>,
  );

  return (
    <section className="events-next" aria-labelledby="events-next-title">
      <div className="events-next__wrap">
        <div className="events-next__head">
          <div>
            <p className="events-next__eyebrow">Coming up</p>
            <RevealHeading id="events-next-title" text="Stay connected to what God is doing in His house." />
          </div>
          {branch ? (
            <BranchSelect
              label="Showing services for"
              branch={branch}
              branches={branches}
              className="events-next__pick"
            />
          ) : null}
        </div>

        <ul className="events-next__grid">
          {tiles.map((tile, i) => (
            <motion.li
              key={tile.key}
              className={DIMMED[filters.filter]?.includes(String(tile.key)) ? "is-dim" : undefined}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={reduce ? { duration: 0 } : { delay: i * 0.06, duration: 0.4, ease }}
            >
              {tile}
            </motion.li>
          ))}
        </ul>

        <EventFilters {...filters} />
      </div>
    </section>
  );
}
