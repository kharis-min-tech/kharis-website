"use client";
import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BranchData } from '@/lib/branches';
import { getBranchCity, getBranchFullAddress } from '@/lib/branches';

interface BranchMonthCalendarProps {
  branch: BranchData;
  onRsvp: (title: string) => void;
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

const WEEKDAY_LABEL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function serviceWeekday(name: string): number {
  const lower = name.toLowerCase();
  if (lower.includes('thursday') || lower.includes('midweek') || lower.includes('bible')) return 4;
  if (lower.includes('friday') || lower.includes('prayer')) return 5;
  if (lower.includes('saturday') || lower.includes('youth')) return 6;
  return 0;
}

function formatServiceTime(time?: string | null) {
  if (!time) return "";

  const [hourString, minute] = time.split(":");
  const hour = Number(hourString);

  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute} ${ampm}`;
}

export function BranchMonthCalendar({ branch, onRsvp }: BranchMonthCalendarProps) {
  const [offset, setOffset] = useState(0);

  const viewDate = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + offset, 1);
  }, [offset]);

  const monthLabel = viewDate
    .toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    .toUpperCase()
    .replace(' ', ', ');

  const entries = useMemo<Entry[]>(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const list: Entry[] = [];

    (branch.services ?? []).forEach((service, si) => {
      const target = serviceWeekday(`${service.day} ${service.name} ${service.type}`);
      for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(year, month, day);
        if (date.getDay() !== target) continue;
        list.push({
          key: `svc-${si}-${day}`,
          day,
          weekday: WEEKDAY_LABEL[target]!,
          title: service.name,
          time: `${formatServiceTime(service.start_time)}`,
          description: service.description ?? '',
          location: getBranchFullAddress(branch) || getBranchCity(branch),
          category: 'Gathering',
        });
      }
    });

    return list.sort((a, b) => a.day - b.day);
  }, [branch, viewDate]);

  return (
    <section id="events" className="py-16 px-5 md:px-8 max-w-[1536px] mx-auto">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-[#e8a33d] text-xs font-bold mb-3 border border-white/10">
          <span>What&apos;s Happening</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          What&apos;s Happening In {getBranchCity(branch)}
        </h2>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-[#15131f] p-5 sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white! tracking-tight">
            {monthLabel}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOffset((o) => o - 1)}
              aria-label="Previous month"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white! transition-colors hover:border-[#e8a33d] hover:text-[#e8a33d] cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setOffset((o) => o + 1)}
              aria-label="Next month"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white! transition-colors hover:border-[#e8a33d] hover:text-[#e8a33d] cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <motion.div
          key={offset}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-3"
        >
          {entries.length === 0 && (
            <p className="rounded-2xl border border-white/10 bg-black/30 p-6 text-sm font-medium text-gray-400">
              Nothing scheduled this month yet — check back soon.
            </p>
          )}

          {entries.map((entry) => (
            <div
              key={entry.key}
              className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 transition-colors hover:border-[#e8a33d]/40 hover:bg-black/50 sm:flex-row sm:items-center"
            >
              <div className="flex w-full items-center gap-4 sm:w-40">
                <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-2xl bg-[#800654] text-white!">
                  <span className="text-xl font-extrabold leading-none">{entry.day}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                    {viewDate.toLocaleDateString('en-GB', { month: 'short' })}
                  </span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {entry.weekday}
                </span>
              </div>

              <div className="flex-grow">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h4 className="text-base font-bold text-white! transition-colors group-hover:text-[#e8a33d]">
                    {entry.title}
                  </h4>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#e8a33d]">
                    {entry.category}
                  </span>
                </div>
                <p className="text-xs font-medium leading-relaxed text-gray-300">
                  {entry.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-4 text-[11px] font-semibold text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#d4920a]" />
                    {entry.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#d4920a]" />
                    {entry.location}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onRsvp(entry.title)}
                className="flex-shrink-0 rounded-xl bg-white/10 px-5 py-2.5 text-xs font-bold text-white! transition-colors hover:bg-[#d4920a] cursor-pointer"
              >
                I&apos;m Coming
              </button>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default BranchMonthCalendar;
