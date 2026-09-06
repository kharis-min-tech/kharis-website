"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { BranchFallbackImage } from '@/components/branches/BranchFallbackImage';

interface BranchGalleryProps {
  images: string[];
  city: string;
  onImageClick?: (src: string) => void;
}


export function BranchGallery({ images, city, onImageClick }: BranchGalleryProps) {
  const slides = useMemo(() => {
    const chunks: string[][] = [];
    const perSlide = 4;
    for (let i = 0; i < images.length; i += perSlide) {
      chunks.push(images.slice(i, i + perSlide));
    }
    return chunks.length ? chunks : [images];
  }, [images]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [slides.length]);


  const go = (dir: number) =>
    setIndex((i) => (i + dir + slides.length) % slides.length);

  return (
    <section className="py-16 px-5 md:px-8 max-w-[1536px] mx-auto">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-[#e8a33d] text-xs font-bold mb-3 border border-white/10">
          <span>Life at Kharis {city}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Moments From Our Family
        </h2>
      </div>

      <div className="relative">
        <div className="overflow-hidden rounded-3xl">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {slides[index]!.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => onImageClick?.(src)}
                className="group relative aspect-4/5 overflow-hidden rounded-[2rem] border border-white/10 bg-black text-left cursor-pointer"
              >
                <BranchFallbackImage
                  src={src}
                  seed={`${city}-${i}`}
                  alt={`Kharis ${city} gathering`}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-85 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md">
                    <ZoomIn className="h-5 w-5" />
                  </div>
                </div>
              </button>
            ))}

          </motion.div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous photos"
              className="absolute -left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#15131f]/90 text-white backdrop-blur-md transition-colors hover:text-[#e8a33d] cursor-pointer md:-left-5"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next photos"
              className="absolute -right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#15131f]/90 text-white backdrop-blur-md transition-colors hover:text-[#e8a33d] cursor-pointer md:-right-5"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to photo group ${i + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                i === index ? 'w-8 bg-[#e8a33d]' : 'w-2 bg-white/25 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default BranchGallery;
