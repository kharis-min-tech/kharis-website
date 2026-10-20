"use client";
import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { calendarServices, WEEKDAYS as WEEKDAY_LABEL } from "@/lib/branch-calendar";
import type { BranchData } from "@/lib/branches";

interface BranchMonthCalendarProps {
  branch: BranchData;
  onRsvp: (title: string) => void;
  city?: string;
  address?: string;
}

interface Entry {
  key: string;
  day: number;
  weekday: string;
  title: string;
  time: string;
  description: string;
  location: string;
  category: string;
}

function formatServiceTime(time?: string | null) {
  if (!time) return "";

  const [hourString, minute] = time.split(":");
  const hour = Number(hourString);

  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute} ${ampm}`;
}

export function BranchMonthCalendar({ branch, onRsvp, city, address }: BranchMonthCalendarProps) {
  const placeName = city || branch.name;
  const placeAddress = address || "Contact the branch for venue details.";
  const [offset, setOffset] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const viewDate = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + offset, 1);
  }, [offset]);

  const monthLabel = viewDate
    .toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    .toUpperCase()
    .replace(" ", ", ");

  const entries = useMemo<Entry[]>(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const list: Entry[] = [];

    calendarServices(branch.services ?? []).forEach(({ service, weekday: target }, si) => {
      for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(year, month, day);
        if (date.getDay() !== target) continue;
        list.push({
          key: `svc-${si}-${day}`,
          day,
          weekday: WEEKDAY_LABEL[target]!,
          title: service.name,
          time: `${formatServiceTime(service.start_time)}`,
          description: service.description ?? "",
          location: placeAddress,
          category: "Gathering",
        });
      }
    });

    return list.sort((a, b) => a.day - b.day);
  }, [branch, viewDate, placeAddress]);

  const upcoming = entries.filter((entry) => offset !== 0 || entry.day >= new Date().getDate());
  const preview = new Set(
    (upcoming.length ? upcoming.slice(0, 3) : entries.slice(-3)).map((entry) => entry.key),
  );

  return (
    <section id="events" className="py-16 px-5 md:px-8 max-w-[1536px] mx-auto">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[var(--branch-inset)] text-[var(--branch-accent)] text-xs font-bold mb-3 border border-[var(--branch-line)]">
          <span>What&apos;s Happening</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--branch-ink)]">
          What&apos;s Happening In {placeName}
        </h2>
      </div>

      <div className="border border-[var(--branch-line)] bg-[var(--branch-card)] p-5 sm:p-8">
        <div className="branch-events__heading mb-6 flex items-center justify-between gap-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--branch-ink)]! tracking-tight">
            {monthLabel}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setOffset((o) => o - 1);
                setShowAll(false);
              }}
              aria-label="Previous month"
              className="flex h-9 w-9 items-center justify-center border border-white/15 text-[var(--branch-ink)]! transition-colors hover:border-[#e8a33d] hover:text-[var(--branch-accent)] cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setOffset((o) => o + 1);
                setShowAll(false);
              }}
              aria-label="Next month"
              className="flex h-9 w-9 items-center justify-center border border-white/15 text-[var(--branch-ink)]! transition-colors hover:border-[#e8a33d] hover:text-[var(--branch-accent)] cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="branch-events__venue">
          <MapPin size={16} aria-hidden="true" />
          {placeAddress}
        </p>
        <motion.div
          id="branch-month-events"
          key={offset}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={`branch-events__list space-y-3${showAll ? " branch-events__list--expanded" : ""}`}
        >
          {entries.length === 0 && (
            <p className="border border-[var(--branch-line)] bg-[var(--branch-inset)] p-6 text-sm font-medium text-[var(--branch-muted)]">
              Nothing scheduled this month yet. Check back soon.
            </p>
          )}

          {entries.map((entry) => (
            <div
              key={entry.key}
              className={`branch-event${preview.has(entry.key) ? " branch-event--preview" : ""} group flex flex-col gap-4 border border-[var(--branch-line)] bg-[var(--branch-inset)] p-4 transition-colors hover:border-[#e8a33d]/40 hover:bg-[var(--branch-card)] sm:flex-row sm:items-center`}
            >
              <div className="branch-event__date flex w-full items-center gap-4 sm:w-40">
                <div className="branch-event__day flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center bg-[#630ed4] text-white!">
                  <span className="text-xl font-extrabold leading-none">{entry.day}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                    {viewDate.toLocaleDateString("en-GB", { month: "short" })}
                  </span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--branch-muted)]">
                  {entry.weekday}
                </span>
              </div>

              <div className="flex-grow">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h4 className="text-base font-bold text-[var(--branch-ink)]! transition-colors group-hover:text-[var(--branch-accent)]">
                    {entry.title}
                  </h4>
                  <span className="bg-[var(--branch-inset)] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[var(--branch-accent)]">
                    {entry.category}
                  </span>
                </div>
                <p className="text-xs font-medium leading-relaxed text-[var(--branch-soft)]">
                  {entry.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-4 text-[11px] font-semibold text-[var(--branch-muted)]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[var(--branch-accent)]" />
                    {entry.time}
                  </span>
                  <span className="branch-event__location flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[var(--branch-accent)]" />
                    {entry.location}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onRsvp(entry.title)}
                className="branch-event__rsvp k-cta flex-shrink-0 bg-[var(--branch-inset)] px-5 py-2.5 text-xs font-bold text-[var(--branch-ink)]! transition-colors hover:bg-[#d4920a] cursor-pointer"
              >
                I&apos;m Coming
              </button>
            </div>
          ))}
        </motion.div>
        {entries.length > 3 ? (
          <button
            type="button"
            className="branch-mobile-disclosure"
            aria-expanded={showAll}
            aria-controls="branch-month-events"
            onClick={() => setShowAll((expanded) => !expanded)}
          >
            {showAll ? "Show fewer gatherings" : `Show all ${entries.length} gatherings`}
          </button>
        ) : null}
      </div>
    </section>
  );
}

export default BranchMonthCalendar;
