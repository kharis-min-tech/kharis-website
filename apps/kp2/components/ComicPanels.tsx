"use client";

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
    poster: {
      src: `${IMG}/b8180db67daeb332/hero/preaching-open-bible.jpg`,
      alt: "Pastor preaching from an open Bible with scripture on the screen behind him",
    },
    gallery: [
      {
        src: `${IMG}/81043753566f149e/hero-b-poster.jpg`,
        alt: "Pastor preaching on stage in front of a blue screen",
      },
      {
        src: `${IMG}/16b531253b8a325e/grace-filled-prayer.jpg`,
        alt: "Church members praying together",
      },
      { src: `${IMG}/cc4f9c67e2c899e3/testimony-stage-1.jpg`, alt: "Members sharing on stage" },
      {
        src: `${IMG}/bb1a12396469052d/testimony-stage-2.jpg`,
        alt: "Pastor praying with members on stage",
      },
      { src: `${IMG}/79c0eac25d6bc370/testimony-sharing.jpg`, alt: "Member sharing a testimony" },
      {
        src: `${IMG}/aee6ab0aae266c72/hero/easter-pastor-david.jpg`,
        alt: "Pastor teaching from the stage",
      },
      {
        src: `${IMG}/3f1f49569aefd282/branch-slide-3.jpg`,
        alt: "Members taking notes during teaching",
      },
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
        alt: "Members in 316 jerseys racing across the court on Family Fun Day",
      },
      {
        src: `${IMG}/ca959585decb8ff4/hero/outreach-community.jpg`,
        alt: "Church members gathered outdoors in a park",
      },
      {
        src: `${IMG}/b722ebe4e6374dcd/about-hero-bench-3200.jpg`,
        alt: "Members on a bench outdoors",
      },
      {
        src: `${IMG}/4ac6c245a7e4d9c2/hero/impartation-celebration.jpg`,
        alt: "Pastor celebrating with members",
      },
      { src: `${IMG}/6cecd6b024bd301a/love-greeting.jpg`, alt: "Members greeting each other" },
      { src: `${IMG}/234c625e119f9e2a/young-adults.jpg`, alt: "Young adults together" },
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
      {
        src: `${IMG}/2fd55a6761cfb656/locations-worship-team.jpg`,
        alt: "Worship team singing on stage",
      },
      {
        src: `${IMG}/de005ef42ce5304e/get-involved-sax.jpg`,
        alt: "Saxophonist playing during worship",
        position: "50% 30%",
      },
      {
        src: `${IMG}/850b7f32a7f6712c/joyful-worship.jpg`,
        alt: "Congregation worshipping with joy",
      },
      {
        src: `${IMG}/e9df39abff1c7e6d/hero/sunday-service-stage.jpg`,
        alt: "Hands raised under stage lights",
      },
      { src: `${IMG}/9b547f88f3b4d297/worship.jpg`, alt: "Worshippers with hands raised" },
    ],
  },
  {
    id: "jesus-campaign",
    headline: "Jesus Campaign",
    subtext: "Taking the Glorious Gospel of Christ to the streets of our cities.",
    past: true,
    poster: {
      src: `${IMG}/d717c95a5811ee19/about-mission-outreach-3200.jpg`,
      alt: "Two members in yellow campaign T-shirts talking with a woman at Stratford station",
    },
    gallery: [
      {
        src: `${IMG}/5bbfb2fff5c0fc8c/hero/outreach-street.jpg`,
        alt: "Outreach team in yellow shirts on a city street",
      },
      {
        src: `${IMG}/c7e0b460a01f93eb/about-vision-team-2048.jpg`,
        alt: "Outreach team posing together in yellow shirts",
      },
      {
        src: `${IMG}/d717c95a5811ee19/about-mission-outreach-3200.jpg`,
        alt: "Talking with people on the street",
      },
      {
        src: `${IMG}/91479ba234a71277/vision-campaign.jpg`,
        alt: "Crowd in yellow campaign shirts",
      },
      {
        src: `${IMG}/ca959585decb8ff4/hero/outreach-community.jpg`,
        alt: "Team gathered in a park",
      },
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
