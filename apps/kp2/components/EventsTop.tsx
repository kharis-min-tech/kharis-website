"use client";

import { KP2_PHOTOS } from "@/lib/photography";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import type { ChurchEvent } from "@/lib/events";
import { eventToCalendarItem, mapsSearchUrl } from "@/lib/calendar";
import { PlanVisitButton } from "@/components/PlanVisitButton";
import "./events-top.css";

type Phase = "idle" | "armed" | "revealed";

/** Starts hidden only once JS has run, then reveals the first time the element is in view. */
export function useRevealOnView<T extends HTMLElement>(threshold: number) {
  const ref = useRef<T>(null);
  const [phase, setPhase] = useState<Phase>("idle");

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
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, phase] as const;
}

export function EventsHero({ image }: { image: string }) {
  return (
    <header className="kp-ev-hero">
      <img
        src={image}
        alt="The KP2 choir leading worship"
        className="kp-ev-hero__img"
        loading="eager"
        decoding="async"
      />
      <div className="kp-ev-hero__veil" aria-hidden="true" />
      <div className="kp-ev-hero__dots" aria-hidden="true" />
      <div className="kp-ev-hero__copy">
        <p className="kp-ev-hero__eyebrow">KP2 Events</p>
        <h1 className="kp-ev-hero__heading">
          Gather with <span>KP2</span>
        </h1>
        <p className="kp-ev-hero__tag">Come encounter God with us.</p>
        <div className="kp-ev-hero__actions">
          <Link href="/branches" className="kp-ev-hero__cta">
            Find events near you
            <span className="material-symbols-outlined" aria-hidden="true">
              north_east
            </span>
          </Link>
          <a href="#whats-on" className="kp-ev-hero__cta kp-ev-hero__cta--ghost">
            See the calendar
          </a>
        </div>
      </div>
    </header>
  );
}

const TITLE = "Stay connected to what God is doing in His house.";

function RevealHeading() {
  const [ref, phase] = useRevealOnView<HTMLHeadingElement>(0.6);
  const words = TITLE.split(" ");

  return (
    <h2
      ref={ref}
      id="kp-ev-next-title"
      className={`kp-ev-next__title is-${phase}`}
      aria-label={TITLE}
    >
      {words.map((word, w) => (
        <Fragment key={w}>
          {w > 0 ? " " : null}
          <span
            className={`kp-ev-next__word${w >= words.length - 2 ? " is-accent" : ""}`}
            aria-hidden="true"
          >
            <span style={{ transitionDelay: `${w * 65}ms` }}>{word}</span>
          </span>
        </Fragment>
      ))}
    </h2>
  );
}

function dateParts(iso: string) {
  const d = new Date(iso);
  const zone = { timeZone: "Europe/London" } as const;
  return {
    month: d.toLocaleDateString("en-GB", { ...zone, month: "short" }),
    day: d.toLocaleDateString("en-GB", { ...zone, day: "numeric" }),
    short: d.toLocaleDateString("en-GB", {
      ...zone,
      weekday: "short",
      day: "numeric",
      month: "short",
    }),
  };
}

const EVENT_PHOTOS: Record<ChurchEvent["category"], string> = {
  Weekly: KP2_PHOTOS.serviceTeaching.src,
  Conference: KP2_PHOTOS.serviceHall.src,
  Worship: KP2_PHOTOS.servicePraise.src,
  Fellowship: KP2_PHOTOS.serviceTogether.src,
  Outreach: KP2_PHOTOS.outreachConversation.src,
  Social: KP2_PHOTOS.serviceTogether.src,
};

export function EventsComingUp({ events }: { events: ChurchEvent[] }) {
  const [gridRef, phase] = useRevealOnView<HTMLUListElement>(0.15);

  return (
    <section className="kp-ev-next" aria-labelledby="kp-ev-next-title">
      <div className="kp-ev-next__wrap">
        <p className="kp-ev-next__eyebrow">Coming up</p>
        <RevealHeading />

        <ul ref={gridRef} className={`kp-ev-next__grid is-${phase}`}>
          {events.map((event, i) => {
            const { month, day, short } = dateParts(event.starts);
            const fallback = EVENT_PHOTOS[event.category];
            return (
              <li key={`${event.slug}-${event.starts}`} style={{ ["--i" as string]: i }}>
                <PlanVisitButton
                  item={eventToCalendarItem(event)}
                  directionsUrl={mapsSearchUrl(event.location)}
                  className="kp-ev-next__tile"
                  aria-label={`${event.title}, ${short} ${event.timeLabel}. Add to calendar`}
                >
                  <img
                    src={event.image || fallback}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="kp-ev-next__img"
                  />
                  <span className="kp-ev-next__veil" aria-hidden="true" />
                  <span className="kp-ev-next__date" aria-hidden="true">
                    <span className="kp-ev-next__month">{month}</span>
                    <span className="kp-ev-next__day">{day}</span>
                  </span>
                  <span className="kp-ev-next__copy">
                    <span className="kp-ev-next__name">{event.title}</span>
                    <span className="kp-ev-next__meta">
                      <span className="material-symbols-outlined" aria-hidden="true">
                        schedule
                      </span>
                      {short} · {event.timeLabel}
                    </span>
                    <span className="kp-ev-next__meta">
                      <span className="material-symbols-outlined" aria-hidden="true">
                        place
                      </span>
                      <span className="kp-ev-next__venue">{event.location}</span>
                    </span>
                    <span className="kp-ev-next__go">
                      Add to calendar
                      <span className="material-symbols-outlined" aria-hidden="true">
                        north_east
                      </span>
                    </span>
                  </span>
                </PlanVisitButton>
              </li>
            );
          })}

          <li style={{ ["--i" as string]: events.length }}>
            <Link href="/branches" className="kp-ev-next__tile kp-ev-next__tile--find">
              <img
                src={KP2_PHOTOS.serviceHall.src}
                alt=""
                loading="lazy"
                decoding="async"
                className="kp-ev-next__img"
              />
              <span className="kp-ev-next__veil" aria-hidden="true" />
              <span className="kp-ev-next__pin material-symbols-outlined" aria-hidden="true">
                location_on
              </span>
              <span className="kp-ev-next__copy">
                <span className="kp-ev-next__name">Find your branch</span>
                <span className="kp-ev-next__find-copy">
                  Find a KP2 near you and see what&apos;s on this week.
                </span>
                <span className="kp-ev-next__go">
                  See all branches
                  <span className="material-symbols-outlined" aria-hidden="true">
                    north_east
                  </span>
                </span>
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
