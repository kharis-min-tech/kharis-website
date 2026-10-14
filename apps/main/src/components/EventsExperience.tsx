"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EventCategories } from "@/components/EventCategories";
import { EventsUpcoming } from "@/components/EventsUpcoming";
import type { ServiceBranch } from "@/lib/service-branches";

type Props = {
  branches: ServiceBranch[];
};

export function EventsExperience({ branches }: Props) {
  return (
    <div className="events-page">
      <header className="events-top">
        <div className="events-top__media">
          <Image
            src="/images/events-hero-banquet.jpg"
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

      <EventCategories branches={branches} />

      <EventsUpcoming branches={branches} />
    </div>
  );
}
