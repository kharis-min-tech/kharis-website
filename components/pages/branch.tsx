"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { hasCoords, osmEmbedUrl, type Branch } from "@/lib/branches";
import { PlanVisitButton } from "@/components/PlanVisitButton";
import {
  mapsDirectionsUrl,
  weeklyServiceToCalendarItem,
} from "@/lib/calendar";



function BranchNotFound() {
  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <SiteHeader />
      <main className="pt-[74px] max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-24">
        <h1 className="font-display-lg text-headline-lg uppercase mb-4">
          We couldn't find that branch
        </h1>
        <Link
          href="/branches"
          className="inline-block bg-primary text-on-primary font-body-md text-[13px] font-bold uppercase tracking-wide px-6 py-4 brutalist-border brutalist-shadow"
        >
          Back to all branches
        </Link>
      </main>
      <ThemeToggle />
    </div>
  );
}

function visitDirections(branch: Branch) {
  const dest = [branch.address, branch.postcode].filter(Boolean).join(", ");
  if (!dest || dest.toLowerCase().includes("coming soon")) return undefined;
  return mapsDirectionsUrl(dest);
}

function visitItem(branch: Branch, service = branch.serviceTimes[0]) {
  if (!service) return null;
  const location = [branch.address, branch.postcode].filter(Boolean).join(", ");
  return weeklyServiceToCalendarItem({
    uid: `branch-${branch.slug}-${service.day}-${service.time}`,
    title: `${service.label} · ${branch.name}`,
    description: `Join us at ${branch.name}. ${branch.blurb}`,
    location,
    day: service.day,
    time: service.time,
  });
}

function BranchPage({ branch, others }: { branch: Branch; others: Branch[] }) {
  const nextVisit = visitItem(branch);
  const directions = visitDirections(branch);

  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden">
      <SiteHeader />

      <main className="pt-[74px]">
        {/* Hero */}
        <section className="relative border-b-4 border-on-background bg-on-background text-background overflow-hidden">
          <img
            src={branch.image}
            alt={`Worship at the Kharis Phase 2 ${branch.city} branch`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="halftone absolute inset-0 pointer-events-none opacity-15" />
          <div className="relative z-10 max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">
            <Link
              href="/branches"
              className="inline-flex items-center gap-1 font-body-md text-[12px] font-bold uppercase tracking-wide hover:text-primary mb-6"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>
              All branches
            </Link>
            <span className="inline-block bg-secondary-container text-on-secondary-container font-label-md px-4 py-1 border-heavy mb-6 uppercase tracking-widest">
              {branch.region}
            </span>
            <h1 className="font-display-lg text-headline-lg md:text-display-lg uppercase leading-none mb-5">
              {branch.city}
            </h1>
            <p className="font-body-lg text-body-lg max-w-2xl border-l-4 border-primary pl-6">
              {branch.blurb}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              {nextVisit ? (
                <PlanVisitButton
                  item={nextVisit}
                  directionsUrl={directions}
                  className="bg-primary text-on-primary font-body-md text-[13px] font-bold uppercase tracking-wide px-7 py-4 brutalist-border brutalist-shadow"
                >
                  Plan your visit
                </PlanVisitButton>
              ) : directions ? (
                <a
                  href={directions}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-primary text-on-primary font-body-md text-[13px] font-bold uppercase tracking-wide px-7 py-4 brutalist-border brutalist-shadow"
                >
                  Plan your visit
                </a>
              ) : null}
              {branch.email ? (
              <a
                href={`mailto:${branch.email}`}
                className="bg-secondary text-on-secondary font-body-md text-[13px] font-bold uppercase tracking-wide px-7 py-4 brutalist-border brutalist-shadow"
              >
                Contact the team
              </a>
              ) : (
              <Link
                href="/contact"
                className="bg-secondary text-on-secondary font-body-md text-[13px] font-bold uppercase tracking-wide px-7 py-4 brutalist-border brutalist-shadow"
              >
                Contact the team
              </Link>
              )}
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-14 md:py-20 grid lg:grid-cols-3 gap-8 items-start">
          <div className="p-6 brutalist-border brutalist-shadow bg-surface-container-lowest">
            <span className="material-symbols-outlined text-[32px] text-primary">
              schedule
            </span>
            <h2 className="font-display-lg text-[24px] uppercase mt-3 mb-4">
              Service times
            </h2>
            <ul className="space-y-3">
              {branch.serviceTimes.map((s) => {
                const item = visitItem(branch, s);
                return (
                <li
                  key={`${s.day}-${s.time}-${s.label}`}
                  className="border-b-2 border-on-background/15 pb-3 last:border-0 flex items-start justify-between gap-3"
                >
                  <div>
                    <p className="font-body-md text-[13px] font-bold uppercase tracking-wide">
                      {s.day} · {s.time}
                    </p>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {s.label}
                    </p>
                  </div>
                  {item ? (
                    <PlanVisitButton
                      item={item}
                      directionsUrl={directions}
                      className="shrink-0 inline-flex items-center text-primary"
                      aria-label={`Add ${s.label} to your calendar`}
                    >
                      <span className="material-symbols-outlined">calendar_add_on</span>
                    </PlanVisitButton>
                  ) : null}
                </li>
                );
              })}
            </ul>
          </div>

          <div className="p-6 brutalist-border brutalist-shadow bg-surface-container-lowest">
            <span className="material-symbols-outlined text-[32px] text-primary">
              place
            </span>
            <h2 className="font-display-lg text-[24px] uppercase mt-3 mb-4">
              Where we meet
            </h2>
            <p className="font-body-md text-body-md mb-2">{branch.address}</p>
            <p className="font-body-md text-body-md mb-4">{branch.postcode}</p>
            <div className="flex flex-wrap gap-2">
              {branch.tags.map((t) => (
                <span
                  key={t}
                  className="font-body-md text-[11px] font-bold uppercase tracking-wide border-2 border-on-background px-2 py-[2px]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 brutalist-border brutalist-shadow bg-surface-container-lowest">
            <span className="material-symbols-outlined text-[32px] text-primary">
              person
            </span>
            <h2 className="font-display-lg text-[24px] uppercase mt-3 mb-4">
              Your team
            </h2>
            <p className="font-body-md text-[13px] font-bold uppercase tracking-wide">
              {branch.pastor}
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              {branch.pastorRole}
            </p>
            <ul className="space-y-2 font-body-md text-body-md">
              {branch.phone ? (
              <li>
                <a href={`tel:${branch.phone.replace(/\s/g, "")}`} className="hover:text-primary">
                  {branch.phone}
                </a>
              </li>
              ) : null}
              {branch.email ? (
              <li>
                <a href={`mailto:${branch.email}`} className="hover:text-primary break-all">
                  {branch.email}
                </a>
              </li>
              ) : null}
              {branch.instagram ? (
              <li className="text-on-surface-variant">{branch.instagram}</li>
              ) : null}
            </ul>
          </div>
        </section>

        {/* Map */}
        {hasCoords(branch) ? (
        <section className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pb-16">
          <div className="brutalist-border brutalist-shadow bg-surface-container-lowest">
            <div className="border-b-2 border-on-background px-5 py-3">
              <p className="font-body-md text-[13px] font-bold uppercase tracking-wide">
                Find us on the map
              </p>
            </div>
            <iframe
              title={`Map of ${branch.name}`}
              src={osmEmbedUrl(branch)}
              loading="lazy"
              className="w-full h-[360px] md:h-[480px] block"
            />
          </div>
        </section>
        ) : null}

        {/* What to expect */}
        <section className="border-y-4 border-on-background bg-secondary-container text-on-secondary-container">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-14 md:py-20">
            <h2 className="font-display-lg text-headline-lg uppercase leading-none mb-8">
              What to expect
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: "waving_hand",
                  title: "A warm welcome",
                  copy: "Look for the welcome team at the door — they'll help you find a seat and answer anything.",
                },
                {
                  icon: "music_note",
                  title: "Loud worship",
                  copy: "Expect around 90 minutes of worship, teaching and prayer. Come as you are.",
                },
                {
                  icon: "child_care",
                  title: "Space for kids",
                  copy: "Kids ministry runs alongside the main gathering with trained, DBS-checked volunteers.",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="p-6 brutalist-border bg-surface-container-lowest text-on-surface"
                >
                  <span className="material-symbols-outlined text-[32px] text-primary">
                    {c.icon}
                  </span>
                  <h3 className="font-display-lg text-[22px] uppercase mt-3 mb-2">
                    {c.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {c.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other branches */}
        <section className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-14 md:py-20">
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 className="font-display-lg text-headline-lg uppercase leading-none">
              Other branches
            </h2>
            <Link
              href="/branches"
              className="font-body-md text-[12px] font-bold uppercase tracking-wide text-primary hover:underline shrink-0"
            >
              See all
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {others.map((b) => (
              <Link
                key={b.slug}
                href={`/branches/${b.slug}`}
                className="p-6 brutalist-border brutalist-shadow bg-surface-container-lowest block transition-colors duration-150 hover:bg-primary hover:text-on-primary"
              >
                <p className="font-display-lg text-[24px] uppercase leading-tight">
                  {b.city}
                </p>
                <p className="font-body-md text-[13px] opacity-80 mb-3">{b.region}</p>
                <p className="font-body-md text-[13px] font-bold uppercase tracking-wide">
                  {b.serviceTimes[0]!.day} · {b.serviceTimes[0]!.time}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <SiteFooter />
      </main>

      <ThemeToggle />
    </div>
  );
}

export default BranchPage;
export { BranchNotFound };
