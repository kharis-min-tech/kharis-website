"use client";

import Image from "@/components/SiteImage";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { EventCategories } from "@/components/EventCategories";
import { EventsUpcoming } from "@/components/EventsUpcoming";
import { EVENT_CATEGORIES, matchesEvent, type EventFilter } from "@/data/event-categories";
import type { ServiceBranch } from "@/lib/service-branches";

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
          <Link href="/locations" className="events-top__link k-cta">
            Find events near you
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
        branches={branches}
        categories={EVENT_CATEGORIES}
        visibleIds={visibleIds}
        onClear={clear}
      />
    </div>
  );
}
