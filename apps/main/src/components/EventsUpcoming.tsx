"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { Calendar, CalendarDays, MapPin, Search } from "lucide-react";
import { EVENT_FILTERS, type EventFilter } from "@/data/event-categories";
import { formatEventDateNum, formatEventMonthShort } from "@/lib/events-content";
import type { BranchEvent } from "@/data/branchesData";
import type { ServiceBranch } from "@/lib/service-branches";
import { BranchSelect, useStoredBranch } from "./BranchSelect";
import "./events-next.css";

function TypedHeading({ id, text }: { id: string; text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [phase, setPhase] = useState<"idle" | "armed" | "typed">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPhase("armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setPhase("typed");
        io.disconnect();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let index = 0;
  return (
    <h2 ref={ref} id={id} className={`events-next__title is-${phase}`} aria-label={text}>
      {text.split(" ").map((word, w) => (
        <Fragment key={w}>
          {w > 0 ? " " : null}
          <span className="events-next__word" aria-hidden>
            {Array.from(word).map((ch, i) => (
              <span key={i} style={{ transitionDelay: `${index++ * 35}ms` }}>
                {ch}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </h2>
  );
}

function BranchEventTile({ event }: { event: BranchEvent }) {
  return (
    <article className="events-next__tile">
      <Image
        src={event.image}
        alt=""
        fill
        quality={90}
        className="object-cover"
        sizes="(max-width: 559px) 100vw, (max-width: 1023px) 50vw, 25vw"
      />
      <span className="events-next__veil" aria-hidden />
      <span className="events-next__date" aria-hidden>
        <span className="events-next__date-month">{formatEventMonthShort(event.date)}</span>
        <span className="events-next__date-day">{formatEventDateNum(event.date)}</span>
      </span>
      <span className="events-next__copy">
        <span className="events-next__name">{event.title}</span>
        <span className="events-next__meta">
          <Calendar aria-hidden className="events-next__ico" />
          {event.date} · {event.time}
        </span>
        <span className="events-next__meta">
          <MapPin aria-hidden className="events-next__ico" />
          {event.location}
        </span>
        <span className="events-next__meta">{event.description}</span>
      </span>
    </article>
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

type Props = FilterProps & {
  branches: ServiceBranch[];
};

export function EventsUpcoming({ branches, ...filters }: Props) {
  const branch = useStoredBranch(branches);
  const upcomingEvents = branch?.upcomingEvents ?? [];

  return (
    <section className="events-next" aria-labelledby="events-next-title">
      <div className="events-next__wrap">
        <div className="events-next__head">
          <div>
            <p className="events-next__eyebrow">Special events</p>
            <TypedHeading id="events-next-title" text="Events at your branch" />
          </div>
          {branch ? (
            <BranchSelect
              label="Showing events for"
              branch={branch}
              branches={branches}
              className="events-next__pick"
            />
          ) : null}
        </div>

        {upcomingEvents.length ? (
          <ul className="events-next__grid">
            {upcomingEvents.map((event) => (
              <li key={event.id}>
                <BranchEventTile event={event} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="events-next__empty" role="status">
            <span className="events-next__empty-mark" aria-hidden>
              <CalendarDays />
            </span>
            <div className="events-next__empty-copy">
              <p className="events-next__empty-kicker">
                {branch ? `No upcoming events for ${branch.name}` : "No upcoming events just yet"}
              </p>
              <p className="events-next__empty-note">
                When a new date is confirmed, the event and all its details will appear here.
              </p>
            </div>
            <span className="events-next__empty-check">Check back soon</span>
          </div>
        )}

        <EventFilters {...filters} />
      </div>
    </section>
  );
}
