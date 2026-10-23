"use client";

import { useCallback, useState } from "react";
import { ComicGallery, type GalleryPhoto } from "@/components/ComicGallery";
import { useRevealOnView } from "@/components/EventsTop";
import "./sunday-service.css";

const POSTER: GalleryPhoto = {
  src: "https://images.kharis.org/site-images/main/72df91d4341c5b55/events/sunday-pastor-open-bible.jpg",
  alt: "Pastor David holding an open Bible during a Sunday service",
  position: "50% 28%",
};

const GALLERY: GalleryPhoto[] = [
  {
    src: "https://images.kharis.org/site-images/kp2/2bf8a23f06e5bb67/events-hero-worship.jpg",
    alt: "KP2 congregation worshipping with hands raised",
  },
  {
    src: "https://images.kharis.org/site-images/main/fd4b6a19fbb8f4d3/events/sunday-worship-hands.jpg",
    alt: "Woman worshipping with both hands raised during a Sunday service",
    position: "82% center",
  },
  {
    src: "https://images.kharis.org/site-images/kp2/9b547f88f3b4d297/worship.jpg",
    alt: "Worship on a Sunday at KP2",
  },
  POSTER,
  {
    src: "https://images.kharis.org/site-images/main/0698b74918b21fe0/hero/sunday-bible-raised.jpg",
    alt: "Church member smiling and holding up her Bible during the service",
  },
  {
    src: "https://images.kharis.org/site-images/kp2/f565b4d37758eee2/bass-sunday.jpg",
    alt: "Bring A Soul Sunday at KP2",
  },
  {
    src: "https://images.kharis.org/site-images/main/ecbd1d3145041d85/events/sunday-pastor-bible-raised.jpg",
    alt: "Pastor David lifting a red Bible during the service",
  },
  {
    src: "/kp2/assets/young-men-smiling.jpg",
    alt: "Young men smiling together in the congregation during a Sunday service",
  },
  {
    src: "/kp2/assets/choir-and-congregation-worship.jpg",
    alt: "The choir leading the congregation in worship",
  },
];

export function SundayServiceBanner({ when }: { when: string }) {
  const [ref, phase] = useRevealOnView<HTMLDivElement>(0.35);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <section className="kp-sun" aria-labelledby="kp-sun-title">
      <div ref={ref} className={`kp-sun__frame is-${phase}`}>
        <img
          src={POSTER.src}
          alt={POSTER.alt}
          loading="lazy"
          decoding="async"
          className="kp-sun__img"
          style={{ objectPosition: POSTER.position }}
        />
        <div className="kp-sun__veil" aria-hidden="true" />
        <div className="kp-sun__copy">
          <p className="kp-sun__eyebrow">{when}</p>
          <h2 id="kp-sun-title" className="kp-sun__title">
            Sunday Service
          </h2>
          <p className="kp-sun__sub">Worship, the Word and a church family to belong to.</p>
          <button type="button" className="kp-sun__explore" onClick={() => setOpen(true)}>
            Explore
            <span className="sr-only"> photos from Sunday Service</span>
            <span className="material-symbols-outlined" aria-hidden="true">
              north_east
            </span>
          </button>
        </div>
      </div>
      {open ? <ComicGallery title="Sunday Service" photos={GALLERY} onClose={close} /> : null}
    </section>
  );
}
