"use client";

import { KP2_PHOTOS } from "@/lib/photography";

import Link from "next/link";
import { useRevealOnView } from "@/components/EventsTop";
import "./know-kharis.css";

type Panel = {
  href: string;
  title: string;
  blurb?: string;
  src: string;
  alt: string;
  position?: string;
};

const PANELS: Panel[] = [
  {
    href: "/mission",
    title: "About Us",
    blurb: "Our mandate is to bring Christ to people everywhere.",
    src: KP2_PHOTOS.welcomeGroup.src,
    alt: KP2_PHOTOS.welcomeGroup.alt,
    position: "50% 35%",
  },
  {
    href: "/branches",
    title: "Locations",
    src: KP2_PHOTOS.serviceHall.src,
    alt: KP2_PHOTOS.serviceHall.alt,
    position: "50% 20%",
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
    src: KP2_PHOTOS.serviceChoir.src,
    alt: "The KP2 choir ministering on stage",
  },
];

export function KnowKharisComic() {
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
                  <img
                    src={panel.src}
                    alt={panel.alt}
                    loading="lazy"
                    decoding="async"
                    style={panel.position ? { objectPosition: panel.position } : undefined}
                  />
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
