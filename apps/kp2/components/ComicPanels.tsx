"use client";

import { KP2_PHOTOS } from "@/lib/photography";

import { useCallback, useState } from "react";
import { ComicGallery, type GalleryPhoto } from "@/components/ComicGallery";
import { useRevealOnView } from "@/components/EventsTop";
import "./comic-panels.css";

type Panel = {
  id: string;
  headline: string;
  subtext: string;
  past: boolean;
  poster: GalleryPhoto;
  gallery: GalleryPhoto[];
};

const IMG = "https://images.kharis.org/site-images/main";

const PANELS: Panel[] = [
  {
    id: "midweek",
    headline: "Midweek Service",
    subtext: "The Word and prayer, right in the middle of your week.",
    past: false,
    poster: KP2_PHOTOS.midweekHall,
    gallery: [
      KP2_PHOTOS.midweekPrayer,
      KP2_PHOTOS.midweekWorship,
      KP2_PHOTOS.midweekKeys,
      KP2_PHOTOS.midweekJoy,
      KP2_PHOTOS.midweekGreeting,
      KP2_PHOTOS.midweekSharing,
    ],
  },
  {
    id: "family-fun-day",
    headline: "Family Fun Day",
    subtext: "A time of joyful fellowship for the entire Kharis family.",
    past: true,
    poster: {
      src: `${IMG}/3423ef762f6c2481/events/family-fun-day-race.jpg`,
      alt: "Church members, some in black and gold 316 jerseys, racing across an outdoor court as families watch",
      position: "48% 50%",
    },
    gallery: [
      {
        src: `${IMG}/3423ef762f6c2481/events/family-fun-day-race.jpg`,
        alt: "Members racing across the court on Family Fun Day",
      },
    ],
  },
  {
    id: "praise-night",
    headline: "Praise Night",
    subtext: "A whole night set apart for praise and worship.",
    past: true,
    poster: {
      src: `${IMG}/c92b67201f985207/events/praise-night-stage.jpg`,
      alt: "Singers leading praise on stage beside a large screen, with a packed hall of worshippers in front of them",
      position: "30% 50%",
    },
    gallery: [
      {
        src: `${IMG}/c92b67201f985207/events/praise-night-stage.jpg`,
        alt: "Singers on stage leading a packed hall in praise",
      },
    ],
  },
  {
    id: "jesus-campaign",
    headline: "Jesus Campaign",
    subtext: "Taking the Glorious Gospel of Christ to the streets of our cities.",
    past: true,
    poster: KP2_PHOTOS.outreachConversation,
    gallery: [
      KP2_PHOTOS.outreachTeam,
      KP2_PHOTOS.outreachSharing,
      KP2_PHOTOS.outreachSpeaker,
      KP2_PHOTOS.outreachStreet,
      KP2_PHOTOS.outreachMessage,
    ],
  },
];

export function ComicPanels({ midweekWhen }: { midweekWhen: string }) {
  const [ref, phase] = useRevealOnView<HTMLDivElement>(0.2);
  const [openId, setOpenId] = useState<string | null>(null);
  const close = useCallback(() => setOpenId(null), []);
  const open = PANELS.find((p) => p.id === openId);

  return (
    <section className="kp-panels" aria-label="More KP2 gatherings">
      <p className="kp-panels__narration">Meanwhile, through the week &amp; the year…</p>
      <div ref={ref} className={`kp-panels__page is-${phase}`}>
        <ul className="kp-panels__grid">
          {PANELS.map((panel, i) => (
            <li
              key={panel.id}
              className={`kp-panels__cell kp-panels__cell--${"abcd"[i]}`}
              style={{ ["--i" as string]: i }}
            >
              <article className="kp-panels__panel" aria-labelledby={`kp-panel-${panel.id}`}>
                <div className="kp-panels__media">
                  <img
                    src={panel.poster.src}
                    alt={panel.poster.alt}
                    loading="lazy"
                    decoding="async"
                    style={
                      panel.poster.position ? { objectPosition: panel.poster.position } : undefined
                    }
                  />
                </div>
                <div className="kp-panels__safe">
                  <p className="kp-panels__caption">
                    {panel.past ? "Past event · Coming back soon" : midweekWhen}
                  </p>
                  <div className="kp-panels__copy">
                    <h3 id={`kp-panel-${panel.id}`} className="kp-panels__title">
                      {panel.headline}
                    </h3>
                    <p className="kp-panels__sub">{panel.subtext}</p>
                    <button
                      type="button"
                      className="kp-panels__explore"
                      onClick={() => setOpenId(panel.id)}
                    >
                      Explore
                      <span className="sr-only"> photos from {panel.headline}</span>
                      <span className="material-symbols-outlined" aria-hidden="true">
                        north_east
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
      {open ? <ComicGallery title={open.headline} photos={open.gallery} onClose={close} /> : null}
    </section>
  );
}
