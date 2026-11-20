"use client";

import { KP2_PHOTOS } from "@/lib/photography";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { ComicGallery, type GalleryPhoto } from "@/components/ComicGallery";
import "./comic-panels.css";

type Panel = {
  id: string;
  caption: string;
  headline: string;
  subtext: string;
  poster: GalleryPhoto;
  gallery: GalleryPhoto[];
};

const IMG = "https://images.kharis.org/site-images/main";

const PANELS: Panel[] = [
  {
    id: "events",
    caption: "Life together",
    headline: "Events",
    subtext: "Praise Night, Family Fun Day, Bring A Soul Sunday and many more moments together.",
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
        src: `${IMG}/3423ef762f6c2481/events/family-fun-day-race.jpg`,
        alt: "Members racing across the court on Family Fun Day",
      },
      { ...KP2_PHOTOS.midweekHall, alt: "The KP2 congregation in the service hall" },
      KP2_PHOTOS.midweekWorship,
      KP2_PHOTOS.midweekPrayer,
      KP2_PHOTOS.midweekJoy,
      KP2_PHOTOS.bassDance,
    ],
  },
  {
    id: "departments",
    caption: "Serve the Lord",
    headline: "Departments",
    subtext:
      "Serving is part of our worship. We serve through music, drama, spoken word, media, welcome and more.",
    poster: KP2_PHOTOS.serviceSaxophone,
    gallery: [
      KP2_PHOTOS.serviceSaxophone,
      KP2_PHOTOS.serviceChoir,
      KP2_PHOTOS.bassDrama,
      KP2_PHOTOS.bassSpokenWord,
      KP2_PHOTOS.serviceCamera,
      KP2_PHOTOS.serviceSound,
      KP2_PHOTOS.welcomeGroup,
    ],
  },
  {
    id: "baptism",
    caption: "New life in Christ",
    headline: "Baptism",
    subtext:
      "A public declaration of faith in Jesus, celebrating new life in Christ with the KP2 family.",
    poster: KP2_PHOTOS.baptismJoy,
    gallery: [
      KP2_PHOTOS.baptismJoy,
      KP2_PHOTOS.baptismCelebration,
      KP2_PHOTOS.baptismCeremony,
      KP2_PHOTOS.baptismTeam,
      { ...KP2_PHOTOS.baptismFamily, alt: "The KP2 family together outside after baptism" },
    ],
  },
  {
    id: "jesus-campaign",
    caption: "The Gospel in our cities",
    headline: "Outreach",
    subtext: "Taking the Glorious Gospel of Christ to the streets of our cities.",
    poster: KP2_PHOTOS.outreachConversation,
    gallery: [
      KP2_PHOTOS.outreachConversation,
      KP2_PHOTOS.outreachTeam,
      KP2_PHOTOS.outreachSharing,
      KP2_PHOTOS.outreachSpeaker,
      KP2_PHOTOS.outreachStreet,
      KP2_PHOTOS.outreachMessage,
    ],
  },
];

/**
 * Deals the narration and panels onto the comic page as they scroll in; each caption sticker
 * lands just after its panel. The wide page arrives in one go, so its panels stagger, while
 * stacked panels on phones deal one by one. Panels already in view (a restored scroll or a
 * link to the section) are left alone; ones just peeking in at the bottom still deal.
 */
function useDealIn(pageRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const page = pageRef.current;
    const section = page?.closest("section");
    if (!page || !section || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const notYetInView = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.8;
    const pieces = [
      ...section.querySelectorAll<HTMLElement>(".kp-panels__narration"),
      ...page.querySelectorAll<HTMLElement>(".kp-panels__cell"),
    ].filter(notYetInView);
    if (!pieces.length) return;

    const deal = (batch: HTMLElement[]) => {
      batch.forEach((el, order) => {
        observer.unobserve(el);
        el.style.setProperty("--deal-order", String(order));
        el.dataset.deal = "in";
      });
    };
    const observer = new IntersectionObserver(
      (entries) => {
        const arrived = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as HTMLElement)
          .sort((a, b) => pieces.indexOf(a) - pieces.indexOf(b));
        if (arrived.length) deal(arrived);
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.2 },
    );
    pieces.forEach((el) => {
      el.dataset.deal = "armed";
      observer.observe(el);
    });

    // Keyboard users tabbing ahead get every panel at once.
    const onFocus = () => deal(pieces.filter((el) => el.dataset.deal === "armed"));
    section.addEventListener("focusin", onFocus);

    return () => {
      observer.disconnect();
      section.removeEventListener("focusin", onFocus);
      pieces.forEach((el) => {
        delete el.dataset.deal;
        el.style.removeProperty("--deal-order");
      });
    };
  }, [pageRef]);
}

export function ComicPanels({ midweekWhen: _midweekWhen }: { midweekWhen?: string }) {
  const pageRef = useRef<HTMLDivElement>(null);
  useDealIn(pageRef);
  const [openId, setOpenId] = useState<string | null>(null);
  const close = useCallback(() => setOpenId(null), []);
  const open = PANELS.find((p) => p.id === openId);

  return (
    // Deals its own panels in, so the generic section reveal would only blur the pop.
    <section className="kp-panels" aria-label="Life at Kharis Phase 2" data-reveal="self">
      <p className="kp-panels__narration">Meanwhile, through the week &amp; the year…</p>
      <div ref={pageRef} className="kp-panels__page">
        <ul className="kp-panels__grid">
          {PANELS.map((panel, i) => (
            <li key={panel.id} className={`kp-panels__cell kp-panels__cell--${"abcd"[i]}`}>
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
                  <p className="kp-panels__caption">{panel.caption}</p>
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
