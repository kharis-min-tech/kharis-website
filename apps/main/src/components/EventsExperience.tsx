"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { EventCategories } from "@/components/EventCategories";
import { EventDetailModal } from "@/components/EventDetailModal";
import {
  formatEventCardDate,
  formatEventCardTime,
  formatEventDateNum,
  formatEventMonthShort,
  groupEventsByMonth,
  type ChurchEvent,
} from "@/lib/events-content";
import type { ServiceBranch } from "@/lib/service-branches";

const ease = [0.22, 1, 0.36, 1] as const;

function happeningEvents(events: ChurchEvent[], from = new Date()) {
  const stamp = from.toISOString().slice(0, 10);
  return events.filter((e) => e.date >= stamp).sort((a, b) => a.date.localeCompare(b.date));
}

function EventCard({
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
    <motion.button
      type="button"
      className="events-happen__card"
      onClick={() => onOpen(event)}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease }}
    >
      <div className="events-happen__media">
        <Image
          src={event.image}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 900px) 100vw, 33vw"
        />
        <div className="events-happen__date-badge" aria-hidden>
          <span className="events-happen__date-month">{formatEventMonthShort(event.date)}</span>
          <span className="events-happen__date-day">{formatEventDateNum(event.date)}</span>
        </div>
      </div>
      <div className="events-happen__copy">
        <h3>{event.title}</h3>
        <p className="events-happen__city">{event.city}</p>
        <p className="events-happen__when">
          <Calendar aria-hidden className="events-happen__ico" />
          <span>{formatEventCardDate(event.date)}</span>
        </p>
        <p>
          <Clock aria-hidden className="events-happen__ico" />
          {formatEventCardTime(event.time, event.timezone)}
        </p>
        <p>
          <MapPin aria-hidden className="events-happen__ico" />
          {event.location}
        </p>
      </div>
    </motion.button>
  );
}

function EventMonthSection({
  label,
  events,
  reduce,
  onOpen,
}: {
  label: string;
  events: ChurchEvent[];
  reduce: boolean | null;
  onOpen: (event: ChurchEvent) => void;
}) {
  return (
    <section className="events-happen__month" aria-label={label}>
      <h3 className="events-happen__month-title">{label}</h3>
      <div className="events-happen__grid">
        {events.map((event, i) => (
          <EventCard
            key={`${event.id}-${event.date}`}
            event={event}
            reduce={reduce}
            delay={Math.min(i * 0.06, 0.24)}
            onOpen={onOpen}
          />
        ))}
      </div>
    </section>
  );
}

type Props = {
  events: ChurchEvent[];
  branches: ServiceBranch[];
};

export function EventsExperience({ events, branches }: Props) {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<ChurchEvent | null>(null);

  const byMonth = useMemo(() => groupEventsByMonth(happeningEvents(events)), [events]);

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

      <section className="events-happen" aria-label="Happening at our church">
        <div className="events-happen__wrap">
          <h2 className="events-happen__title">Happening at our church</h2>

          {byMonth.length === 0 ? (
            <p className="events-happen__empty">
              No gatherings listed right now. Check back soon.
            </p>
          ) : (
            <div className="events-happen__months">
              {byMonth.map((group) => (
                <EventMonthSection
                  key={group.key}
                  label={group.label}
                  events={group.events}
                  reduce={reduce}
                  onOpen={setSelected}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <EventDetailModal event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
