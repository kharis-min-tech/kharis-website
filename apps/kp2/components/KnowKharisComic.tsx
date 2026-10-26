"use client";

import { KP2_PHOTOS } from "@/lib/photography";

import Link from "next/link";
import { LocationsMapArt, type LocationPin } from "@/components/LocationsMapArt";
import { useRevealOnView } from "@/components/EventsTop";
import "./know-kharis.css";

type Panel = {
  href: string;
  title: string;
  blurb?: string;
  src?: string;
  map?: boolean;
  alt: string;
  position?: string;
};

const PANELS: Panel[] = [
  {
    href: "/mission",
    title: "About Us",
    blurb: "Our mandate is to bring Christ to people everywhere.",
    src: KP2_PHOTOS.baptismFamily.src,
    alt: KP2_PHOTOS.baptismFamily.alt,
    position: "50% 35%",
  },
  {
    href: "/branches",
    title: "Locations",
    map: true,
    alt: "Map of Kharis Phase 2 locations in the United Kingdom",
  },
  {
    href: "/life",
    title: "Life",
    src: KP2_PHOTOS.serviceTogether.src,
    alt: KP2_PHOTOS.serviceTogether.alt,
    position: "50% 25%",
  },
  {
    href: "/messages",
    title: "Become a Believer",
    src: KP2_PHOTOS.outreachConversation.src,
    alt: KP2_PHOTOS.outreachConversation.alt,
    position: "50% 30%",
  },
  {
    href: "/departments",
    title: "Get Involved",
    src: KP2_PHOTOS.serviceSaxophone.src,
    alt: KP2_PHOTOS.serviceSaxophone.alt,
    position: KP2_PHOTOS.serviceSaxophone.position,
  },
];

export function KnowKharisComic({ branchPins }: { branchPins: LocationPin[] }) {
  const [ref, phase] = useRevealOnView<HTMLDivElement>(0.2);

  return (
    <section className="kp-know" id="departments" aria-labelledby="kp-know-title">
      <div className="kp-know__intro">
        <div>
          <p className="kp-know__narration">Passionate for God and His Word…</p>
          <h2 id="kp-know-title" className="kp-know__title">
            Get to know <span>Kharis Phase 2</span>
          </h2>
        </div>
        <p className="kp-know__lede">Everything you need, one tap away.</p>
      </div>

      <div ref={ref} className={`kp-know__page is-${phase}`}>
        <ul className="kp-know__grid">
          {PANELS.map((panel, i) => (
            <li
              key={panel.href}
              className={`kp-know__cell kp-know__cell--${"abcde"[i]}`}
              style={{ ["--i" as string]: i }}
            >
              <Link href={panel.href} className="kp-know__panel">
                <span className="kp-know__media">
                  {panel.map ? (
                    <LocationsMapArt pins={branchPins} />
                  ) : (
                    <img
                      src={panel.src}
                      alt={panel.alt}
                      loading="lazy"
                      decoding="async"
                      style={{
                        objectPosition: panel.position,
                      }}
                    />
                  )}
                </span>
                <span className="kp-know__safe">
                  <span className="kp-know__copy">
                    <span className="kp-know__name">{panel.title}</span>
                    {panel.blurb ? <span className="kp-know__blurb">{panel.blurb}</span> : null}
                    <span className="kp-know__go">
                      Explore
                      <span className="material-symbols-outlined" aria-hidden="true">
                        north_east
                      </span>
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
