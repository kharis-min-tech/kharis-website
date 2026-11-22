"use client";
/* eslint-disable @next/next/no-img-element -- the rail swaps and duplicates its own sources, so it draws them itself */
import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cdnImage, cdnSrcSet } from "@/lib/image-cdn";

interface BranchGalleryProps {
  images: string[];
  city: string;
  onImageClick?: (src: string) => void;
  /** Whether a film already leads this section. */
  hasFilm?: boolean;
}

/** Pixels per millisecond the rail drifts. */
const DRIFT = 0.03;
/** How long a tap on an arrow holds the drift, in ms. */
const MANUAL_HOLD = 2600;

export function BranchGallery({ images, city, onImageClick, hasFilm }: BranchGalleryProps) {
  const rail = useRef<HTMLDivElement>(null);
  const interacting = useRef(false);
  const manualUntil = useRef(0);
  const drag = useRef({ active: false, moved: false, startX: 0, startScroll: 0, pointerId: -1 });

  const canScroll = images.length > 1;

  /* The rail drifts rather than stepping.
   *
   * This is the same loop the testimonies rail runs: the strip holds a second
   * copy of every photo, and the scroll position wraps modulo the distance
   * between the first original and its copy, so the seam never arrives. The
   * earlier version advanced a whole card on a timer, which read as a
   * slideshow rather than as the continuous rolls used elsewhere on the site.
   *
   * It yields to the reader throughout: held while a pointer is down, while
   * focus is inside the strip, while the tab is hidden, for a beat after an
   * arrow is used, and entirely under prefers-reduced-motion. The
   * IntersectionObserver keeps it from running at all until the strip is on
   * screen, which on a branch page is a long way down.
   */
  useEffect(() => {
    const el = rail.current;
    if (!el || !canScroll) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous = 0;
    let visible = false;
    let position = el.scrollLeft;

    const animate = (time: number) => {
      /* Capped so a backgrounded tab does not return and jump the rail by
       * however many seconds it was away. */
      const elapsed = previous ? Math.min(time - previous, 64) : 0;
      previous = time;
      if (
        visible &&
        !document.hidden &&
        !motion.matches &&
        !interacting.current &&
        !drag.current.active &&
        time >= manualUntil.current
      ) {
        const first = el.querySelector<HTMLElement>(".branch-gallery__tile");
        const copy = el.querySelector<HTMLElement>('[data-loop-copy="true"]');
        const cycle = first && copy ? copy.offsetLeft - first.offsetLeft : 0;
        /* Someone scrolled or dragged the rail themselves: take their
         * position as the new truth rather than snapping back to ours. */
        if (Math.abs(el.scrollLeft - position) > 2) position = el.scrollLeft;
        if (cycle > 0) {
          position = (position + elapsed * DRIFT) % cycle;
          el.scrollTo({ left: position, behavior: "instant" });
        }
      } else {
        position = el.scrollLeft;
      }
      if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(animate);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      start();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", start);
    motion.addEventListener("change", start);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", start);
      motion.removeEventListener("change", start);
    };
  }, [canScroll, images.length]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") {
      interacting.current = true;
      return;
    }
    if (e.button !== 0) return;
    const el = rail.current;
    if (!el) return;
    drag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      pointerId: e.pointerId,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    const el = rail.current;
    if (!state.active || !el) return;
    const dx = e.clientX - state.startX;
    /* Six pixels of travel is a drag; anything less is a click on a photo. */
    if (!state.moved && Math.abs(dx) > 6) {
      state.moved = true;
      el.setPointerCapture?.(e.pointerId);
      el.style.scrollBehavior = "auto";
    }
    if (state.moved) el.scrollLeft = state.startScroll - dx;
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") {
      interacting.current = false;
      return;
    }
    const state = drag.current;
    const el = rail.current;
    if (!state.active) return;
    state.active = false;
    if (el && state.moved) {
      if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId);
      el.style.scrollBehavior = "";
      /* Cleared a tick later so the click this pointer-up produces still sees
       * `moved` and does not open the photo the drag finished on. */
      window.setTimeout(() => {
        drag.current.moved = false;
      }, 60);
    }
  };

  function nudge(direction: 1 | -1) {
    const el = rail.current;
    const card = el?.querySelector<HTMLElement>(".branch-gallery__tile");
    if (!el || !card) return;
    manualUntil.current = performance.now() + MANUAL_HOLD;
    el.scrollBy({ left: direction * (card.clientWidth + 16), behavior: "smooth" });
  }

  function open(src: string) {
    if (drag.current.moved) return;
    onImageClick?.(src);
  }

  /* Two passes of the strip, or four when there are so few photos that two
   * would not fill the rail and a copy would sit visibly beside its
   * original. */
  const reel = canScroll
    ? Array.from({ length: images.length < 4 ? 4 : 2 }, () => images).flat()
    : images;

  /* The rail only. The section, its heading and the film that may lead it
   * belong to BranchTemplate, which shows the two together under one
   * heading: they answer the same question about a branch, and a heading
   * each made them read as two goes at the same thing. */
  /* The placeholder stands in for photographs when a branch has none. With
   * a film above it there is already something to look at, so standing in
   * would just add an empty panel under it. */
  if (images.length === 0 && hasFilm) return null;

  return (
    <>
      {images.length === 0 ? (
        <div>
          <div className="branch-gallery-empty">
            <div className="branch-card__fallback">
              <img
                src="https://images.kharis.org/site-images/main/113a6a24b1d3741b/kharis-logo.png"
                alt=""
              />
              <span>Kharis {city}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div
            ref={rail}
            className="branch-gallery__rail"
            role="region"
            aria-roledescription="carousel"
            aria-label={`Photos from ${city}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onFocusCapture={() => {
              interacting.current = true;
            }}
            onBlurCapture={(event) => {
              interacting.current = !!rail.current?.contains(event.relatedTarget);
            }}
          >
            {reel.map((src, index) => {
              const copy = index >= images.length;
              return (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  /* The copies are the same photographs over again. They are
                     here only to carry the loop, so they stay out of the tab
                     order and out of the accessibility tree. */
                  tabIndex={copy ? -1 : undefined}
                  aria-hidden={copy || undefined}
                  data-loop-copy={copy || undefined}
                  onClick={() => open(src)}
                  className="branch-gallery__tile group relative aspect-[4/5] shrink-0 overflow-hidden border border-[var(--branch-line)] bg-black text-left"
                >
                  {/* These were served as uploaded, because the optimizer was
                      softening them. The soft look came from quality, not
                      from resizing: asking Cloudflare for the size the tile
                      actually draws at, at 90, is if anything sharper than
                      handing the browser a 2000px photograph to shrink
                      itself - and the rail holds every image twice over to
                      carry its loop, so the full-resolution version of that
                      was a lot of memory for a 4:5 thumbnail. */}
                  <img
                    src={cdnImage(src, { width: 800, quality: 90 })}
                    srcSet={cdnSrcSet(src, [400, 800, 1200], { quality: 90 })}
                    sizes="(max-width: 640px) 60vw, 320px"
                    alt={copy ? "" : `Kharis ${city} gathering`}
                    loading={index < 4 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/20 group-hover:opacity-100">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white">
                      <ZoomIn className="h-5 w-5" />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          {canScroll ? (
            <>
              <button
                type="button"
                aria-label="Previous photos"
                onClick={() => nudge(-1)}
                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center border border-[var(--branch-edge)] bg-[var(--branch-card)] text-[var(--branch-ink)] transition-colors hover:text-[var(--branch-accent)]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next photos"
                onClick={() => nudge(1)}
                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center border border-[var(--branch-edge)] bg-[var(--branch-card)] text-[var(--branch-ink)] transition-colors hover:text-[var(--branch-accent)]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}
        </div>
      )}
    </>
  );
}

export default BranchGallery;
