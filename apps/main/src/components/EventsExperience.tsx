"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { EventCategories } from "@/components/EventCategories";
import { EventDetailModal } from "@/components/EventDetailModal";
import {
  formatEventCardDate,
  formatEventCardTime,
  formatEventDateNum,
  formatEventMonthShort,
  type ChurchEvent,
} from "@/lib/events-content";
import type { ServiceBranch } from "@/lib/service-branches";
import "./events-next.css";

const ease = [0.22, 1, 0.36, 1] as const;
const PAGE_SIZE = 4;

function happeningEvents(events: ChurchEvent[], from = new Date()) {
  const stamp = from.toISOString().slice(0, 10);
  return events.filter((e) => e.date >= stamp).sort((a, b) => a.date.localeCompare(b.date));
}

function EventTile({
  event,
  reduce,
  delay = 0,
  onOpen,
}: {
  event: ChurchEvent;
  reduce: boolean | null;
  delay?: number;
  onOpen: (event: ChurchEvent) => void;
}) {
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease }}
    >
      <button type="button" className="events-next__tile" onClick={() => onOpen(event)}>
        <Image
          src={event.image}
          alt=""
          fill
          quality={95}
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
            {formatEventCardDate(event.date)} · {formatEventCardTime(event.time)}
          </span>
          {event.location ? (
            <span className="events-next__meta">
              <MapPin aria-hidden className="events-next__ico" />
              {event.location}
            </span>
          ) : null}
        </span>
      </button>
    </motion.li>
  );
}

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
              <span key={i} style={{ transitionDelay: `${index++ * 40}ms` }}>
                {ch}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </h2>
  );
}

type Props = {
  events: ChurchEvent[];
  branches: ServiceBranch[];
};

export function EventsExperience({ events, branches }: Props) {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<ChurchEvent | null>(null);

  const [visible, setVisible] = useState(PAGE_SIZE);

  const upcoming = useMemo(() => happeningEvents(events), [events]);
  const shown = upcoming.slice(0, visible);

  return (
    <div className="events-page">
      <section className="events-feature" aria-label="Kharis Events">
        <div className="events-feature__wrap">
          <h1 className="events-feature__heading">Gather with Kharis</h1>

          <div className="events-feature__banner">
            <Image
              src="/images/events-hero-banquet.jpg"
              alt="Banquet table set with red roses and candles beneath chandeliers"
              fill
              priority
              quality={95}
              className="events-feature__photo object-cover"
              sizes="100vw"
            />
            <span className="events-feature__veil" aria-hidden />

            <div className="events-feature__brand">
              <Image
                src="/images/kharis-logo.png"
                alt=""
                width={72}
                height={72}
                className="events-feature__logo"
              />
              <div>
                <p className="events-feature__name">Kharis</p>
                <p className="events-feature__word">Events</p>
              </div>
            </div>

            <div className="events-feature__bar">
              <div>
                <p className="events-feature__bar-title">Kharis Church</p>
                <p className="events-feature__bar-copy">Come encounter God with us.</p>
              </div>
              <div className="events-feature__actions">
                <Link href="/locations" className="events-feature__btn events-feature__btn--ghost">
                  Find events near you
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EventCategories branches={branches} />

      <section className="events-next" aria-labelledby="events-next-title">
        <div className="events-next__wrap">
          <p className="events-next__eyebrow">Happening at our church</p>
          <TypedHeading id="events-next-title" text="Don’t miss the next one" />

          {upcoming.length === 0 ? (
            <p className="events-next__empty">No gatherings listed right now. Check back soon.</p>
          ) : (
            <>
              <ul className="events-next__grid">
                {shown.map((event, i) => (
                  <EventTile
                    key={`${event.id}-${event.date}`}
                    event={event}
                    reduce={reduce}
                    delay={Math.min((i % PAGE_SIZE) * 0.06, 0.24)}
                    onOpen={setSelected}
                  />
                ))}
              </ul>
              {visible < upcoming.length ? (
                <button
                  type="button"
                  className="events-next__more k-cta"
                  onClick={() => setVisible((n) => n + PAGE_SIZE)}
                >
                  Show more dates
                </button>
              ) : null}
            </>
          )}
        </div>
      </section>

      <EventDetailModal event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
