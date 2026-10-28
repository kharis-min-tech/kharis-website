"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { EventCategories } from "@/components/EventCategories";
import { EventsUpcoming } from "@/components/EventsUpcoming";
import { EVENT_CATEGORIES, matchesEvent, type EventFilter } from "@/data/event-categories";
import type { ServiceBranch } from "@/lib/service-branches";

const eventStatusOrder = { upcoming: 0, spotlight: 1, past: 2 } as const;

const orderedEventCategories = [...EVENT_CATEGORIES].sort((a, b) => {
  if (a.status !== b.status) return eventStatusOrder[a.status] - eventStatusOrder[b.status];
  if (a.id === "praise-night") return -1;
  if (b.id === "praise-night") return 1;
  return 0;
});

type Props = {
  branches: ServiceBranch[];
};

export function EventsExperience({ branches }: Props) {
  const [filter, setFilter] = useState<EventFilter>("all");
  const [query, setQuery] = useState("");
  const visibleIds = useMemo(
    () => new Set(EVENT_CATEGORIES.filter((c) => matchesEvent(c, filter, query)).map((c) => c.id)),
    [filter, query],
  );
  const clear = () => {
    setFilter("all");
    setQuery("");
  };

  return (
    <div className="events-page">
      <header className="events-top">
        <div className="events-top__media">
          <Image
            src="https://images.kharis.org/site-images/main/4ad6b94f8e2d8cf0/events-hero-banquet.jpg"
            alt="Banquet table set with red roses and candles beneath chandeliers"
            fill
            priority
            quality={95}
            className="events-top__img"
            sizes="100vw"
          />
          <div className="events-top__veil" aria-hidden />
        </div>
        <div className="events-top__copy">
          <p className="events-top__eyebrow">Kharis Events</p>
          <h1 className="events-top__heading">
            Gather with <span>Kharis</span>
          </h1>
          <p className="events-top__tag">Come encounter God with us.</p>
          <Link
            href="#events-branch-filter"
            className="events-top__link k-cta"
            onClick={(event) => {
              const picker = document.getElementById("events-branch-filter");
              if (!picker) return;
              event.preventDefault();
              window.history.replaceState(null, "", "#events-branch-filter");
              picker.focus({ preventScroll: true });
              picker.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "instant"
                  : "smooth",
                block: "center",
              });
            }}
          >
            Choose your branch
            <ArrowUpRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <EventsUpcoming
        branches={branches}
        filter={filter}
        query={query}
        resultCount={visibleIds.size}
        onFilter={setFilter}
        onQuery={setQuery}
      />

      <EventCategories
        categories={orderedEventCategories}
        visibleIds={visibleIds}
        filter={filter}
        query={query}
        onClear={clear}
      />
    </div>
  );
}
