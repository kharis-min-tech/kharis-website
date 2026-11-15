"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  FOOTER_GLOBE_PALETTE,
  GLOBE_CITIES,
  GLOBE_VISION_CITIES,
  VISION_YEAR,
} from "@/lib/globe-theme";
import "./footer-world.css";

/**
 * The turning world that closes every page.
 *
 * The same AtomicGlobe the Locations page uses, cropped to its upper half so
 * it reads as a horizon rather than a floating ball. Each city is a patch of
 * lit dots on the land rather than a marker above it — see the KHARIS PATCH
 * note in AtomicGlobe.js. The strapline runs beneath it as a marquee and is
 * what actually names the vision.
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
  /** Optional explicit override; otherwise tracks the `.dark` class on `<html>`. */
  dark?: boolean;
};

export function FooterWorld({ dark }: Props) {
  const holderRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isDarkClass, setIsDarkClass] = useState(false);

  useEffect(() => {
    if (typeof dark === "boolean") return;
    const root = document.documentElement;
    const sync = () => setIsDarkClass(root.classList.contains("dark"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [dark]);

  const effectiveDark = typeof dark === "boolean" ? dark : isDarkClass;
  const palette = effectiveDark ? FOOTER_GLOBE_PALETTE.dark : FOOTER_GLOBE_PALETTE.light;

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
                exactDots: 80000,
                dotSize: 4.2,
                sizeJitter: 0.6,
                coastLift: 0.35,
                spotRadius: 0.05,
              }}
              cursor={{ cursorMode: "halo", reach: 0.4, glow: 0.8 }}
              motion={{
                spin: SPIN,
                tilt: 20,
                startLng: 4,
                zoom: 1.1,
                offsetX: 0,
                offsetY: 0,
                allowTiltDrag: false,
                tiltRange: 20,
              }}
              entrance={{ formation: "sweep", entranceSeconds: 2.4, replayOnScroll: false }}
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
