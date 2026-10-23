"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./comic-gallery.css";

export type GalleryPhoto = { src: string; alt: string; position?: string };

const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

/** Full-screen photo gallery. `onClose` should be stable (useCallback). */
export function ComicGallery({
  title,
  photos,
  onClose,
}: {
  title: string;
  photos: GalleryPhoto[];
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const count = photos.length;
  const photo = photos[index]!;
  const step = (delta: number) => setIndex((i) => (i + delta + count) % count);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel?.querySelector<HTMLElement>(".kp-gallery__close")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        setIndex((i) => (i + (e.key === "ArrowRight" ? 1 : -1) + count) % count);
      } else if (e.key === "Tab" && panel) {
        const list = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
        const first = list[0];
        const last = list[list.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [count, onClose]);

  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.children[index] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    strip.scrollTo({
      left: thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [index]);

  return createPortal(
    <div
      ref={panelRef}
      className="kp-gallery"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
    >
      <div className="kp-gallery__top">
        <div>
          <p className="kp-gallery__eyebrow">Gallery</p>
          <h2 className="kp-gallery__title">{title}</h2>
        </div>
        <p className="kp-gallery__count">
          <span aria-hidden="true">
            {index + 1} / {count}
          </span>
          <span className="sr-only" aria-live="polite">
            Photo {index + 1} of {count}: {photo.alt}
          </span>
        </p>
        <button
          type="button"
          className="kp-gallery__close"
          aria-label="Close gallery"
          onClick={onClose}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            close
          </span>
        </button>
      </div>

      <div
        className="kp-gallery__stage"
        onTouchStart={(e) => {
          touchX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touchX.current;
          const end = e.changedTouches[0]?.clientX;
          touchX.current = null;
          if (start == null || end == null || Math.abs(end - start) < 50) return;
          step(end < start ? 1 : -1);
        }}
      >
        <img key={photo.src} src={photo.src} alt={photo.alt} className="kp-gallery__img" />
        {count > 1 ? (
          <>
            <button
              type="button"
              className="kp-gallery__arrow kp-gallery__arrow--prev"
              aria-label="Previous photo"
              onClick={() => step(-1)}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                chevron_left
              </span>
            </button>
            <button
              type="button"
              className="kp-gallery__arrow kp-gallery__arrow--next"
              aria-label="Next photo"
              onClick={() => step(1)}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                chevron_right
              </span>
            </button>
          </>
        ) : null}
      </div>

      <div ref={stripRef} className="kp-gallery__strip" role="group" aria-label="All photos">
        {photos.map((p, i) => (
          <button
            key={`${p.src}-${i}`}
            type="button"
            className={`kp-gallery__thumb${i === index ? " is-active" : ""}`}
            aria-label={`Show photo ${i + 1} of ${count}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => setIndex(i)}
          >
            <img
              src={p.src}
              alt=""
              loading="lazy"
              style={p.position ? { objectPosition: p.position } : undefined}
            />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
}
