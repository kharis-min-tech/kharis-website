import outlines from "@/data/family-outlines.json";
import { useId } from "react";

export type LocationPin = { slug: string; name: string; lat: number; lng: number };

function project(lng: number, lat: number) {
  return { x: 430 + (lng + 3) * 24, y: 22 + (59.2 - lat) * 38 };
}

const LAND = outlines.uk
  .map(
    (ring) =>
      ring
        .map(([lng, lat], index) => {
          const { x, y } = project(lng, lat);
          return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ") + "Z",
  )
  .join(" ");

export function LocationsMapArt({ pins, wide = false }: { pins: LocationPin[]; wide?: boolean }) {
  const gridId = useId();
  const ukPins = pins.filter(
    ({ lat, lng }) => lat >= 49.7 && lat <= 59.2 && lng >= -8.5 && lng <= 2.5,
  );

  return (
    <svg
      viewBox={wide ? "0 0 1280 420" : "0 0 640 420"}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Map of Kharis Phase 2 locations in the United Kingdom"
      className="absolute inset-0 h-full w-full bg-[#341361]"
    >
      <defs>
        <pattern id={gridId} width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M36 0H0V36" fill="none" stroke="#e4d9fa" strokeOpacity="0.16" />
        </pattern>
      </defs>
      <rect width={wide ? 1280 : 640} height="420" fill="#341361" />
      <rect width={wide ? 1280 : 640} height="420" fill={`url(#${gridId})`} />
      <g transform={wide ? "translate(520 0)" : undefined}>
        <path d={LAND} fill="#f9f2df" stroke="#d3bded" strokeWidth="1.5" strokeLinejoin="round" />
        {ukPins.map(({ slug, name, lat, lng }) => {
          const { x, y } = project(lng, lat);
          return (
            <g key={slug}>
              <title>{name}</title>
              <circle cx={x} cy={y} r="7" fill="#f7be1d" stroke="#341361" strokeWidth="2.5" />
              <circle cx={x} cy={y} r="2" fill="#341361" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
