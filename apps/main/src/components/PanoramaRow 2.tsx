"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "./panorama.css";

/**
 * One curved, drifting row of photographs, on the vendored PanoramaCarousel.
 *
 * Client-only: it drives the row with the Web Animations API and measures
 * itself with ResizeObserver, so there is nothing useful to server-render.
 */
const PanoramaCarousel = dynamic(() => import("@/vendor/panorama-carousel/PanoramaCarousel.js"), {
  ssr: false,
  loading: () => <div className="panorama__placeholder" aria-hidden />,
});

export type PanoramaImage = {
  /** Shown as-is, or as the poster frame when `video` is set. */
  src: string;
  alt?: string;
  /** Optional clip. The tile plays it muted and on a loop. */
  video?: string;
};

type Props = {
  images: PanoramaImage[];
  /** Which way the row drifts. */
  direction?: "left" | "right";
  /** Seconds for the row to advance by one image. */
  speed?: number;
  /** How many tiles hold their colour at the centre of the arc. */
  focusCount?: number;
  /**
   * What the tiles outside that window fade to. Defaults to plain greyscale;
   * the hero also darkens so its headline stays readable over the top.
   */
  focusDim?: { grayscale?: number; brightness?: number; contrast?: number };
  /** Image height as a share of the row's height. */
  tileHeight?: number;
  aspectRatio?: number;
  /** How hard the ends bend away from the viewer, in degrees. */
  curve?: number;
  gap?: number;
  /** Where the arc sits vertically inside the row, as a percentage. */
  axis?: number;
  /** Masks the outer N% at each end to transparent. */
  fade?: number;
  /** Tile corner radius, as a CSS length. "0" squares them off. */
  radius?: string;
  className?: string;
};

export function PanoramaRow({
  images,
  direction = "left",
  speed = 6,
  focusCount = 3,
  focusDim,
  /* Full height, so the tiles fill their row and the two rows sit directly
     on each other. At 88 each row kept 6% of empty band top and bottom,
     which added up to a dark wedge running between the rows. */
  tileHeight = 100,
  /* Wide enough that about five tiles show at once. The rows hold five and
     six photographs, so more tiles than that and a row starts repeating a
     picture while the first copy is still on screen. */
  aspectRatio = 1.22,
  curve = 68,
  /* Tight enough to read as one continuous roll, but still a hairline short
     of touching — the panels sit beside each other, they do not overlap.
     Note the maths is `(aspectRatio + gap/100) * unit`, not a pixel gap: at
     0 the tiles still sat ~6% of a tile apart, at -7 they land 3-6px apart,
     and at -9 they start overlapping by 9-14px. Measured, not guessed. */
  gap = -7,
  axis = 50,
  fade = 0,
  /* Rounded, as the carousel's reference look has them, and the one place on
     the site that is not square-cornered. Pass "0" to square them off. */
  radius = "12px",
  className = "",
}: Props) {
  const items = useMemo(
    () =>
      (Array.isArray(images) ? images : [])
        .filter((image) => image?.src)
        .map((image) => ({
          // The component puts alt on the leading tile only, which is right:
          // the row repeats each photo, and several copies of the same alt
          // is noise to a screen reader.
          // `video` sits inside `image`, not beside it: the component keeps
          // only each item's `image` object, so anything on the item itself
          // is dropped before the tiles are rendered.
          image: {
            src: image.src,
            alt: image.alt ?? "",
            ...(image.video ? { video: image.video } : {}),
          },
        })),
    [images],
  );

  if (!items.length) return null;

  return (
    <div className={`panorama ${className}`.trim()}>
      <PanoramaCarousel
        items={items}
        autoplay
        speed={speed}
        direction={direction}
        pauseOnHover={false}
        draggable
        momentum={0.5}
        curve={curve}
        tileHeight={tileHeight}
        aspectRatio={aspectRatio}
        gap={gap}
        radius={radius}
        axis={axis}
        /* The fade masks the row to transparent over the outer N% at each
           end. It defaults to 0 because the full-bleed wall had nothing
           behind it but the shell's own background, so fading the ends drew
           a dark band down each side of an otherwise light page. A row set
           inside a panel wants the fade back on: there it reveals the
           panel. */
        fade={fade}
        focusCount={focusCount}
        focusDim={focusDim}
      />
    </div>
  );
}
