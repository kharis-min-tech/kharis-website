"use client";

import dynamic from "next/dynamic";
import { useMemo, useSyncExternalStore } from "react";
import type { GlobeBranch } from "@/lib/globe-branches";
import { globeCountryPhoto } from "@/lib/globe-imagery";
import { FOOTER_GLOBE_PALETTE } from "@/lib/globe-theme";
import { getSiteTheme, subscribeSiteTheme } from "@/lib/theme";
import "./globe.css";

/**
 * Branch globe built on the vendored AtomicGlobe (Framer) component.
 *
 * Loaded client-side only: it pulls in Three.js, which is far too large to
 * ship on every route, and it draws to a canvas so there is nothing useful to
 * server-render. `ssr: false` keeps both the module and Three out of the
 * server bundle and off every other page.
 */
const AtomicGlobe = dynamic(() => import("@/vendor/atomic-globe/AtomicGlobe.js"), {
  ssr: false,
  loading: () => <div className="atomic-globe__placeholder" aria-hidden />,
});

type Props = {
  branches: GlobeBranch[];
  /** Branch slug → href, so KP2 branches can point at the KP2 site. */
  hrefFor: (branch: GlobeBranch) => string;
  /** Country name, or "world" for the overview. */
  country?: string;
  /**
   * "country" puts one marker per country; "branch" puts one per branch.
   *
   * The component hides markers whose labels collide, so eighteen branches
   * inside the United Kingdom render as two labels and sixteen invisible ones.
   * It is built for a handful of widely-spaced places, which is what
   * "country" gives it.
   */
  group?: "country" | "branch";
};

export function AtomicGlobeBranches({
  branches,
  hrefFor,
  country = "world",
  group = "country",
}: Props) {
  /* The same theme-aware palette the footer globe uses, so the two globes on
   * the site are one object seen twice. Its backdrop is transparent, which
   * is what stops this being a dark square sitting inside a light band. */
  const theme = useSyncExternalStore(subscribeSiteTheme, getSiteTheme, () => "light" as const);
  const palette = theme === "dark" ? FOOTER_GLOBE_PALETTE.dark : FOOTER_GLOBE_PALETTE.light;

  const places = useMemo(() => {
    const inScope = branches.filter((branch) => country === "world" || branch.country === country);

    if (group === "branch") {
      return inScope.map((branch) => ({
        label: branch.name,
        lat: branch.lat,
        lng: branch.lng,
        body: [branch.city, branch.country].filter(Boolean).join(", "),
        image: branch.photo || undefined,
        ctaLabel: "Visit branch",
        ctaLink: hrefFor(branch),
      }));
    }

    const byCountry = new Map<string, GlobeBranch[]>();
    for (const branch of inScope) {
      const key = branch.country ?? "Elsewhere";
      byCountry.set(key, [...(byCountry.get(key) ?? []), branch]);
    }
    return [...byCountry.entries()].map(([name, group]) => ({
      label: name,
      lat: group.reduce((sum, b) => sum + b.lat, 0) / group.length,
      lng: group.reduce((sum, b) => sum + b.lng, 0) / group.length,
      body: `${group.length} ${group.length === 1 ? "branch" : "branches"}`,
      image: globeCountryPhoto(
        name,
        group.map((b) => b.photo),
      ),
      ctaLabel: "See branches",
      ctaLink: "#branches",
    }));
  }, [branches, country, group, hrefFor]);

  /**
   * The component has no fly-to: `tilt`, `startLng` and `zoom` are camera
   * settings it re-reads when they change. So aim it at the centroid of
   * whatever is currently filtered, and lean on its own tweening to get there.
   *
   * `zoom` stays below 1 so the sphere is never clipped by the viewport — the
   * marker labels sit outside the sphere and need the margin.
   */
  const motion = useMemo(() => {
    const centroid = places.length
      ? {
          lat: places.reduce((sum, p) => sum + p.lat, 0) / places.length,
          lng: places.reduce((sum, p) => sum + p.lng, 0) / places.length,
        }
      : { lat: 20, lng: -21 };
    return {
      // Turns on the overview, holds still once a country is chosen.
      //
      // This was 0 everywhere, on the reasoning that every branch sits in
      // the Europe/West-Africa hemisphere so half a rotation shows an empty
      // Pacific. But a globe that never moves reads as a picture of one.
      // It stays still while filtered because `startLng` below aims the
      // camera at the chosen country, and a spin would immediately carry it
      // back out of view — and because a drifting marker is hard to click.
      spin: country === "world" ? 0.03 : 0,
      // `tilt` is the camera latitude. Leaning the full way to the centroid
      // puts the camera over the pole for anywhere as far north as the UK, so
      // lean most of the way and cap it: the country still reads as the
      // subject without the view becoming an Arctic plan view.
      tilt: Math.max(-45, Math.min(45, country === "world" ? 16 : centroid.lat * 0.62)),
      startLng: -centroid.lng,
      // Both values keep the whole sphere inside the band. Above roughly 1.2
      // the poles start being sliced off by the viewport, which is the same
      // clipping the old globe suffered from.
      zoom: country === "world" ? 0.95 : 1.15,
      offsetX: 0,
      offsetY: 0,
      allowTiltDrag: true,
      tiltRange: 70,
    };
  }, [country, places]);

  return (
    <div className="atomic-globe">
      <AtomicGlobe
        style={{ width: "100%", height: "100%" }}
        theme="custom"
        palette={palette}
        places={places}
        placeStyle={{
          placeMarker: "beacon",
          pinShape: "needle",
          placeLift: 0.1,
          cardWidth: 232,
        }}
        sphere={{
          density: "dense",
          exactDots: 130000,
          dotSize: 4.4,
          sizeJitter: 0.6,
          coastLift: 0.35,
        }}
        cursor={{
          cursorMode: "sonar",
          reach: 0.5,
          glow: 1,
          swell: 1.2,
          crest: 0.035,
          waveLength: 0.22,
          waveSpeed: 0.55,
          cursorDelay: 0,
        }}
        motion={motion}
        entrance={{ formation: "sweep", entranceSeconds: 2, replayOnScroll: false }}
        // Routes draw travelling arcs between every place. With twenty UK
        // branches that is a cat's cradle, which is the same busyness the old
        // spotlight rays had. Off by default.
        routes={{ routesOn: false }}
        advanced={{ quality: "auto", editorPlayback: true, calmMotion: true }}
      />
    </div>
  );
}
