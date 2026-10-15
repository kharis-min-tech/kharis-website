"use client";
/* eslint-disable @next/next/no-img-element -- branch photos are shown as uploaded; the image optimizer softened them */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface BranchGalleryProps {
  images: string[];
  city: string;
  onImageClick?: (src: string) => void;
}

export function BranchGallery({ images, city, onImageClick }: BranchGalleryProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(images.length > 1);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setCanScroll(el.scrollWidth > el.clientWidth + 4);
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [images.length, updateEdges]);

  function scrollByCard(direction: 1 | -1) {
    const el = scroller.current;
    const card = el?.querySelector("button");
    if (!el || !card) return;
    el.scrollBy({ left: direction * (card.clientWidth + 16), behavior: "smooth" });
  }

  return (
    <section className="mx-auto max-w-[1536px] px-5 py-16 md:px-8">
      <div className="mb-10 text-center">
        <div className="mb-3 inline-flex items-center gap-1.5 border border-white/10 bg-white/10 px-3.5 py-1 text-xs font-bold text-[#e8a33d]">
          <span>Life at Kharis {city}</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Moments From Our Family</h2>
      </div>

      {images.length === 0 ? (
        <p className="text-center text-sm font-medium text-gray-400">
          Photos for this branch will show here after they are added in Content Studio.
        </p>
      ) : (
        <div className="relative">
          <div
            ref={scroller}
            onScroll={updateEdges}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="region"
            aria-roledescription="carousel"
            aria-label={`Photos from ${city}`}
          >
            {images.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => onImageClick?.(src)}
                className="group relative aspect-[4/5] w-[78%] shrink-0 snap-start overflow-hidden border border-white/10 bg-black text-left sm:w-[calc(50%-8px)] md:w-[calc(25%-12px)]"
              >
                {/* Original file, same as KP2. The image optimizer was softening these photos. */}
                <img
                  src={src}
                  alt={`Kharis ${city} gathering`}
                  loading={index < 4 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/20 group-hover:opacity-100">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white">
                    <ZoomIn className="h-5 w-5" />
                  </span>
                </span>
              </button>
            ))}
          </div>
          {canScroll ? (
            <>
              <button
                type="button"
                aria-label="Previous photos"
                disabled={atStart}
                onClick={() => scrollByCard(-1)}
                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center border border-white/15 bg-[#15131f]/90 text-white backdrop-blur-md transition-colors hover:text-[#e8a33d] disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next photos"
                disabled={atEnd}
                onClick={() => scrollByCard(1)}
                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center border border-white/15 bg-[#15131f]/90 text-white backdrop-blur-md transition-colors hover:text-[#e8a33d] disabled:opacity-40"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}
        </div>
      )}
    </section>
  );
}

export default BranchGallery;
