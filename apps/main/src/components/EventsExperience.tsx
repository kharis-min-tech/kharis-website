"use client";

import Image from "next/image";
import Link from "next/link";
import { EventCategories } from "@/components/EventCategories";
import { EventsUpcoming } from "@/components/EventsUpcoming";
import type { ServiceBranch } from "@/lib/service-branches";

type Props = {
  branches: ServiceBranch[];
};

export function EventsExperience({ branches }: Props) {
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

      <EventsUpcoming branches={branches} />
    </div>
  );
}
