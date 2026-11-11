"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  FOOTER_GLOBE_PALETTE,
  GLOBE_CITIES,
  GLOBE_VISION_CITIES,
  VISION_YEAR,
} from "@/lib/globe-theme";

/**
 * The turning world that closes every page.
 *
 * The same AtomicGlobe the Locations page uses, cropped to its upper half so
 * it reads as a horizon rather than a floating ball. Each city is a patch of
 * lit dots on the land rather than a marker above it — see the KHARIS PATCH
 * note in AtomicGlobe.js. The strapline runs beneath it as a marquee and is
 * what actually names the vision.
 *
 * The "Kharis" wordmark that used to sit here is gone: two focal points
 * competed, and the globe says the same thing with more warmth.
 *
 * Because this footer is on EVERY page, the globe is mounted only once the
 * footer is close to the viewport. Three.js is far too large to put on the
 * critical path of every route for an ornament at the bottom of the page.
 */
const AtomicGlobe = dynamic(() => import("@/vendor/atomic-globe/AtomicGlobe.js"), {
  ssr: false,
  loading: () => null,
});

/** One slow turn. A patch needs time to arrive before it leaves again. */
const SPIN = 0.018;

/**
 * Cities we are in, then cities we are going to.
 *
 * These drive the lit patches on the globe, not markers: the marker layer is
 * hidden in CSS and the component's `spotRadius` warms the dot field around
 * each of these instead. Capped at 32 by the shader's uniform array; this
 * list is 28.
 *
 * The labels are never drawn, but they are kept correct anyway. If the CSS
 * that hides the marker layer ever fails to load, a bare "Lagos" sitting
 * beside a bare "Accra" would tell a visitor there is a church in Lagos
 * today, so the year stays on the planned ones.
 */
const PLACES = [
  ...GLOBE_CITIES.map((city) => ({ label: city.label, lat: city.lat, lng: city.lng })),
  ...GLOBE_VISION_CITIES.map((city) => ({
    label: `${city.label} · ${VISION_YEAR}`,
    lat: city.lat,
    lng: city.lng,
  })),
];

type Props = {
  /** Which way the footer is themed. Decides the globe's palette. */
  dark?: boolean;
};

export function FooterWorld({ dark = false }: Props) {
  const holderRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const palette = dark ? FOOTER_GLOBE_PALETTE.dark : FOOTER_GLOBE_PALETTE.light;

  useEffect(() => {
    const node = holderRef.current;
    if (!node || mounted) return;
    // A generous margin so it has finished loading by the time it is seen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setMounted(true);
      },
      { rootMargin: "600px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [mounted]);

  return (
    <div className="footer-world-block">
      {/* The crop shows the upper portion: the inner box is half again as
          tall as the window onto it. Measured, not chosen — at twice the
          height the West African cities fell below the crop entirely. */}
      <div className="footer-world" ref={holderRef} aria-hidden>
        <div className="footer-world__inner">
          {mounted ? (
            <AtomicGlobe
              style={{ width: "100%", height: "100%" }}
              theme="custom"
              palette={palette}
              places={PLACES}
              placeStyle={{
                placeMarker: "pin",
                pinShape: "teardrop",
                placeLift: 0,
                cardWidth: 200,
              }}
              sphere={{
                density: "dense",
                /* Fewer dots than the Locations globe. This one is a third of
                   the size, and every dot now runs the patch loop. */
                exactDots: 80000,
                dotSize: 4.2,
                sizeJitter: 0.6,
                coastLift: 0.35,
                /* The patches, in place of markers. A chord length between
                   unit vectors, not degrees: chord = 2*sin(angle/2), so 0.05
                   is a cap of about 3 degrees. Measured the hard way — 0.17
                   looked right on paper and rendered as continents, with
                   neighbouring cities merging into one mass. */
                spotRadius: 0.05,
              }}
              cursor={{ cursorMode: "halo", reach: 0.4, glow: 0.8 }}
              motion={{
                spin: SPIN,
                /* Camera latitude. Looking from well north keeps the UK
                   cluster inside the dome and drops the African cities onto
                   the horizon line rather than below it. */
                tilt: 20,
                startLng: 4,
                /* Measured, not guessed: at 1.54 the sphere rendered
                   ~1010px across in a 720px frame, which pushed the northern
                   pins clean above the crop. This fits the dome. */
                zoom: 1.1,
                offsetX: 0,
                offsetY: 0,
                allowTiltDrag: false,
                tiltRange: 20,
              }}
              entrance={{ formation: "sweep", entranceSeconds: 2.4, replayOnScroll: false }}
              /* Beams between the places. "hub" fans every arc out of the
                 first entry in PLACES, which is London, so the picture is
                 the home church reaching outwards rather than an arbitrary
                 web. "beads" draws each arc as travelling dots instead of a
                 solid stroke, which sits better on a field of dots. The arc
                 is kept low because the footer crops the globe at its
                 equator and a tall arc would sail out of the top. */
              routes={{
                routesOn: true,
                routeMode: "hub",
                routeStyle: "beads",
                routeAltitude: 0.22,
                routeDots: 40,
                routeSize: 3.4,
                routeSpeed: 0.16,
                routeTrail: 0.34,
                routeRest: 0.18,
              }}
              advanced={{ quality: "auto", editorPlayback: true, calmMotion: true }}
            />
          ) : null}
        </div>
      </div>

      {/* The vision is stated in words as well as pinned on the globe: the
          globe is aria-hidden, so without this line the goal reaches nobody
          using a screen reader. The two phrases alternate, and the pair is
          repeated so the loop never seams. */}
      <div
        className="footer-strap"
        aria-label="Changing the world with a touch of His Grace. One hundred churches worldwide by 2030."
      >
        <div className="footer-strap__track" aria-hidden>
          {[0, 1].map((copy) => (
            <span className="footer-strap__pair" key={copy}>
              <span className="footer-strap__line">
                Changing the world with a touch of His&nbsp;Grace.
                <span className="footer-strap__dot">&bull;</span>
              </span>
              <span className="footer-strap__line footer-strap__line--vision">
                100 churches worldwide by&nbsp;2030.
                <span className="footer-strap__dot">&bull;</span>
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
