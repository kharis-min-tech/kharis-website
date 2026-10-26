"use client";

import Link from "next/link";
import { useState } from "react";
import { ComicGallery } from "@/components/ComicGallery";
import { KP2_PHOTOS } from "@/lib/photography";

const PHOTOS = [
  KP2_PHOTOS.baptismJoy,
  KP2_PHOTOS.baptismCelebration,
  KP2_PHOTOS.baptismCeremony,
  KP2_PHOTOS.baptismTeam,
  KP2_PHOTOS.baptismFamily,
];

export function BaptismGallery() {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="baptism"
      aria-labelledby="baptism-title"
      className="scroll-mt-[88px] border-y-4 border-black bg-background px-margin-mobile py-stack-lg md:px-margin-desktop"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-2 md:gap-12">
        <figure className="aspect-[4/3] overflow-hidden border-4 border-black neo-shadow">
          <img
            src={PHOTOS[0].src}
            alt={PHOTOS[0].alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </figure>
        <div>
          <p className="mb-4 inline-block border-2 border-black bg-secondary-container px-3 py-1 font-label-md uppercase text-on-secondary-container">
            New life in Christ
          </p>
          <h2
            id="baptism-title"
            className="mb-6 font-display-lg text-headline-lg uppercase leading-none"
          >
            Baptism at KP2
          </h2>
          <p className="max-w-xl font-body-lg text-body-lg text-on-surface">
            Celebrating new life in Christ with the KP2 family. See moments from our baptism
            gathering, or get in touch to ask about baptism.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="kp-depth-button kp-button-purple border-4 border-black bg-primary px-6 py-4 font-headline-md uppercase text-white neo-shadow"
            >
              View baptism photos
            </button>
            <Link
              href="/contact#write"
              className="kp-depth-button kp-button-light keep-light border-4 border-black px-6 py-4 text-center font-headline-md uppercase neo-shadow"
            >
              Ask about baptism
            </Link>
          </div>
        </div>
      </div>
      {open ? (
        <ComicGallery title="Baptism at KP2" photos={PHOTOS} onClose={() => setOpen(false)} />
      ) : null}
    </section>
  );
}
