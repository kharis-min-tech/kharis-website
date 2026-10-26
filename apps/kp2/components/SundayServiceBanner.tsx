"use client";

import { KP2_PHOTOS } from "@/lib/photography";

import { useCallback, useState } from "react";
import { ComicGallery, type GalleryPhoto } from "@/components/ComicGallery";
import { useRevealOnView } from "@/components/EventsTop";
import "./sunday-service.css";

const POSTER: GalleryPhoto = {
  src: "https://images.kharis.org/site-images/main/e666a073b590b3ff/leadership/pastor-david-sunday.jpg",
  alt: "Pastor David Antwi teaching from the Bible during a Sunday service",
  position: "center 15%",
};

const GALLERY: GalleryPhoto[] = [
  KP2_PHOTOS.serviceChoir,
  KP2_PHOTOS.serviceWorship,
  KP2_PHOTOS.servicePrayer,
  POSTER,
  KP2_PHOTOS.serviceBible,
  KP2_PHOTOS.servicePraise,
  KP2_PHOTOS.serviceCongregation,
  KP2_PHOTOS.serviceSaxophone,
  KP2_PHOTOS.serviceNotes,
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
