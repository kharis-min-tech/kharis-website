/**
 * Homepage hero, band variant: a panel on the page surface with a curved
 * band of photographs running through its middle, the headline above it and
 * the tagline and buttons below.
 *
 * The layout is taken from the TiltedGridHero Framer component. That file
 * turned out to be the SAME carousel engine we already run — identical
 * SLICES, CAMERA, arc() and measure() to the vendored PanoramaCarousel — in a
 * one-row shell with its own text layer. So the engine here is ours, which
 * keeps the three things that copy does not have: video tiles, the colour
 * focus window, and pausing when the row is off screen. Its numbers are the
 * ones carried over (see the geometry below).
 *
 * The point of the layout: the band only crosses the middle of the panel, so
 * the copy sits on the panel rather than on photographs. It can be the
 * page's own ink, in either theme, with no scrim and no shadow.
 *
 * Everything below is written for a list of bands, so trying two again is a
 * matter of adding a second axis and speed.
 */
"use client";

import Link from "next/link";
import { useEffect, useMemo, type CSSProperties } from "react";
import { HeroHeadline } from "./HeroHeadline";
import { PanoramaRow, type PanoramaImage } from "./PanoramaRow";
import { HERO_SLIDES, type HeroSlide } from "@/lib/hero-media";
import "./hero-band.css";

/**
 * TiltedGridHero's own numbers, which are what give the look: a shallow band
 * of wide tiles, bent hard at the ends, with both ends masked back into the
 * panel.
 *
 * `tileHeight` is the exception, and the one number worth knowing. It is a
 * share of the PANEL's height, not a pixel size, so the file's default of 26
 * does not mean here what it means on the reference's own card. Measured off
 * the published sample instead: its flat centre tiles are about 40% of its
 * panel's height and roughly three and a half fit across. 32 lands in the
 * same place on a panel this shape.
 *
 * Corners are square. The carousel's reference look rounds them; the sample
 * this layout comes from does not, and nor does anything else on the site.
 */
const BAND = {
  tileHeight: 34,
  aspectRatio: 1.77,
  curve: 80,
  /* The reference ships 6. `gap` is a share of the tile's HEIGHT, not its
     width, so at an aspect of 1.77 that is a wider space between panels than
     the number suggests, and wider than the sample actually shows. */
  gap: 1,
  fade: 12,
  radius: "0",
} as const;

/**
 * Where each band's centre line sits, as a share of the panel's height.
 *
 * The reference sets 56, which suits a card whose copy is pinned to its top
 * and bottom edges. Ours hangs off the band itself, so an off-centre band
 * leaves twice as much empty panel above the headline as below the buttons.
 * Dead centre is what balances it.
 */
const AXES = [50] as const;

/**
 * Seconds for one photograph to cross the centre, per band. Bands all travel
 * the same way; with more than one, the stagger comes from these being
 * slightly apart rather than from running them against each other, which
 * reads as separate mechanisms rather than one roll.
 */
const SPEEDS = [5.5] as const;

function toImage(slide: HeroSlide): PanoramaImage | null {
  if (slide.type === "video") {
    return slide.poster ? { src: slide.poster, alt: slide.alt ?? "", video: slide.src } : null;
  }
  return slide.src ? { src: slide.src, alt: slide.alt ?? "" } : null;
}

export function BandHero() {
  /* One band takes everything. With more than one, the photographs are dealt
   * round the bands so none is on two at once, and the clips all stay on the
   * first — the same split the photo wall uses. */
  const bands = useMemo(() => {
    const buckets: PanoramaImage[][] = AXES.map(() => []);
    let photoCount = 0;
    for (const slide of HERO_SLIDES) {
      const image = toImage(slide);
      if (!image) continue;
      const bucket = slide.type === "video" ? 0 : photoCount++ % buckets.length;
      buckets[bucket].push(image);
    }
    return buckets;
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("hero-ready");
    return () => {
      document.documentElement.classList.remove("hero-ready");
    };
  }, []);

  /* The copy is laid out around the band, so it needs the band's height and
   * its centre line. The height mirrors the component's own sizing —
   * `min(tileHeight in container height, 55% of container width over the
   * aspect ratio)` — from the same constants it is given, so the two cannot
   * drift apart. */
  const bandVars = {
    "--band-tile-h": `${BAND.tileHeight}cqh`,
    "--band-tile-w": `calc(55cqw / ${BAND.aspectRatio})`,
    "--band-axis-top": `${AXES[0]}%`,
    "--band-axis-bottom": `${AXES[AXES.length - 1]}%`,
  } as CSSProperties;

  return (
    <section id="top" className="band-hero">
      <div className="band-hero__panel" style={bandVars}>
        {/* The reel fills the panel; the band is a share of that height, set
            by tileHeight, and sits where its axis puts it. */}
        {bands.map((images, b) => (
          <div key={b} className="band-hero__reel">
            <PanoramaRow
              className="panorama--fill"
              images={images}
              direction="left"
              speed={SPEEDS[b] ?? 5.5}
              tileHeight={BAND.tileHeight}
              aspectRatio={BAND.aspectRatio}
              curve={BAND.curve}
              gap={BAND.gap}
              axis={AXES[b] ?? 50}
              fade={BAND.fade}
              radius={BAND.radius}
              /* Every tile in full colour. The wall had to grey out
                 everything off-centre so white copy survived on top of it;
                 nothing sits on these photographs, so nothing is dimmed. */
              focusCount={0}
            />
          </div>
        ))}

        <div className="band-hero__copy">
          <div className="band-hero__head">
            <h1 className="sr-only">Welcome to Kharis</h1>
            <HeroHeadline />
          </div>

          <div className="band-hero__foot">
            <p className="band-hero__tagline">Changing the world with a touch of His Grace.</p>
            <div className="band-hero__ctas">
              <Link href="/locations" className="btn-primary">
                Find a Branch
              </Link>
              <a href="#messages" className="btn-ghost">
                Watch Messages
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
