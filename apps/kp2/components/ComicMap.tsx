"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type PointerEvent } from "react";
import outlines from "@/data/family-outlines.json";
import "./comic-map.css";

type Ring = number[][];

export type MapPin = {
  slug: string;
  name: string;
  city?: string;
  region?: string;
  address?: string;
  postcode?: string;
  pastor?: string;
  blurb?: string;
  serviceSummary?: string;
  established?: string;
  miles?: number | null;
  lat: number;
  lng: number;
};

// —— Web Mercator Projection framed around England ————————————————
const VB_W = 1200;
const VB_H = 650;

function mercatorX(lng: number) {
  return (lng + 180) / 360;
}

function mercatorY(lat: number) {
  const clamped = Math.max(-85, Math.min(85, lat));
  const rad = (clamped * Math.PI) / 180;
  return (1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2;
}

const ENG_MIN_LNG = -6.0;
const ENG_MAX_LNG = 2.5;
const ENG_MIN_LAT = 49.7;
const ENG_MAX_LAT = 55.5;

const WX0 = mercatorX(ENG_MIN_LNG);
const WX1 = mercatorX(ENG_MAX_LNG);
const WY0 = mercatorY(ENG_MAX_LAT);
const WY1 = mercatorY(ENG_MIN_LAT);

const WORLD_SCALE = Math.min((VB_W - 140) / (WX1 - WX0), (VB_H - 120) / (WY1 - WY0));
const ORIGIN_X = (VB_W - (WX1 - WX0) * WORLD_SCALE) / 2;
const ORIGIN_Y = (VB_H - (WY1 - WY0) * WORLD_SCALE) / 2 + 16;

function project(lng: number, lat: number) {
  return {
    x: ORIGIN_X + (mercatorX(lng) - WX0) * WORLD_SCALE,
    y: ORIGIN_Y + (mercatorY(lat) - WY0) * WORLD_SCALE,
  };
}

const UK_RINGS = (outlines as { uk: Ring[] }).uk;

const UK_OUTLINE_PATH = UK_RINGS.map(
  (ring) =>
    ring
      .map(([lng, lat], index) => {
        const pt = project(lng, lat);
        return `${index === 0 ? "M" : "L"}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
      })
      .join(" ") + "Z",
).join(" ");

const ENGLAND_MOTORWAYS: [number, number][][] = [
  [
    [-0.13, 51.51],
    [-0.24, 52.57],
    [-1.15, 52.95],
    [-1.47, 53.38],
    [-1.55, 53.8],
    [-1.61, 54.97],
  ],
  [
    [-0.13, 51.51],
    [-1.26, 51.75],
    [-1.89, 52.49],
    [-2.24, 53.48],
    [-2.7, 53.76],
    [-2.93, 54.89],
  ],
  [
    [-0.13, 51.51],
    [-0.75, 51.26],
    [-1.4, 50.91],
  ],
  [
    [-0.13, 51.51],
    [-0.97, 51.45],
    [-2.59, 51.45],
  ],
  [
    [-1.89, 52.49],
    [-2.22, 52.19],
    [-2.59, 51.45],
    [-3.53, 50.72],
  ],
  [
    [-0.13, 51.51],
    [0.08, 51.54],
    [0.18, 51.58],
    [0.47, 51.74],
  ],
];

const MOTORWAY_PATH = ENGLAND_MOTORWAYS.map((road) =>
  road
    .map(([lng, lat], idx) => {
      const pt = project(lng, lat);
      return `${idx === 0 ? "M" : "L"}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    })
    .join(" "),
).join(" ");

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 8;

function establishedTextFor(pin: { slug: string; city?: string; established?: string }) {
  if (pin.established) return pin.established;
  const key = `${pin.slug} ${pin.city ?? ""}`.toLowerCase();
  if (key.includes("london")) return "Est. 2019";
  if (key.includes("birmingham") || key.includes("romford")) return "Est. 2021";
  return "Est. 2026";
}

function overlaps(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function ComicMap({
  pins,
  query,
  onQueryChange,
  onSelect,
  onLocate,
  locating = false,
  hasOrigin = false,
  originCoords = null,
}: {
  pins: MapPin[];
  query: string;
  onQueryChange: (next: string) => void;
  onSelect: (slug: string) => void;
  onLocate: () => void;
  locating?: boolean;
  hasOrigin?: boolean;
  originCoords?: { lat: number; lng: number } | null;
}) {
  const uid = useId().replace(/:/g, "");
  const goldGradId = `${uid}-gold`;
  const purpleGradId = `${uid}-purple`;
  const shadowFilterId = `${uid}-shadow`;
  const gridId = `${uid}-grid`;

  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const gestureRef = useRef<
    | {
        kind: "drag";
        id: number;
        startX: number;
        startY: number;
        panX: number;
        panY: number;
        moved: boolean;
      }
    | {
        kind: "pinch";
        dist: number;
        midX: number;
        midY: number;
        moved: boolean;
      }
    | null
  >(null);
  const suppressClick = useRef(false);
  const hideTimerRef = useRef<number | null>(null);
  const hintTimerRef = useRef<number | null>(null);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [grabbing, setGrabbing] = useState(false);
  const [mapInteractive, setMapInteractive] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const clampPan = useCallback((nextZoom: number, nextX: number, nextY: number) => {
    const viewW = VB_W / nextZoom;
    const viewH = VB_H / nextZoom;
    const maxOffsetX = Math.max(180, Math.abs(VB_W - viewW) * 0.75);
    const maxOffsetY = Math.max(140, Math.abs(VB_H - viewH) * 0.75);
    return {
      x: Math.max(-maxOffsetX, Math.min(maxOffsetX, nextX)),
      y: Math.max(-maxOffsetY, Math.min(maxOffsetY, nextY)),
    };
  }, []);

  const applyZoom = useCallback(
    (factor: number) => {
      setZoom((prev) => {
        const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(prev * factor * 100) / 100));
        setPan((cur) =>
          Math.abs(next - 1) < 0.05 ? { x: 0, y: 0 } : clampPan(next, cur.x, cur.y),
        );
        return next;
      });
    },
    [clampPan],
  );

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setActiveSlug(null);
  };

  // Native non-passive wheel listener: lets normal page scrolling pass through
  // unless Ctrl/Cmd is held (which also covers trackpad pinch-to-zoom) or the
  // user has explicitly clicked to focus/activate the map.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handleWheel = (event: globalThis.WheelEvent) => {
      const isModifierZoom = event.ctrlKey || event.metaKey;
      if (!isModifierZoom && !mapInteractive) {
        if (Math.abs(event.deltaY) >= 8) {
          setShowScrollHint(true);
          if (hintTimerRef.current) window.clearTimeout(hintTimerRef.current);
          hintTimerRef.current = window.setTimeout(() => setShowScrollHint(false), 1400);
        }
        return;
      }
      event.preventDefault();
      setShowScrollHint(false);
      const step = isModifierZoom ? 1.12 : 1.16;
      const factor = event.deltaY < 0 ? step : 1 / step;
      applyZoom(factor);
    };
    svg.addEventListener("wheel", handleWheel, { passive: false });
    return () => svg.removeEventListener("wheel", handleWheel);
  }, [applyZoom, mapInteractive]);

  const invZoom = 1 / Math.pow(zoom, 0.65);

  const projectedPins = useMemo(() => {
    const englandPins = pins.filter(
      (pin) => pin.lat >= 49.5 && pin.lat <= 56.2 && pin.lng >= -6.5 && pin.lng <= 2.5,
    );
    const raw = englandPins.map((pin) => {
      const pt = project(pin.lng, pin.lat);
      const cleanName = pin.name
        .replace(/^KP2\s+/i, "")
        .replace(/^Kharis Phase 2\s*[—–-]?\s*/i, "");
      return {
        ...pin,
        cleanName,
        rawX: pt.x,
        rawY: pt.y,
        x: pt.x,
        y: pt.y,
        estText: establishedTextFor(pin),
        serviceText: pin.serviceSummary || "Sunday 1:30 PM",
        venueText:
          [pin.city, pin.postcode].filter(Boolean).join(" · ") || pin.address || "England Hub",
      };
    });

    // Separate closely-clustered pins (London, Barking, Romford) at overview zoom
    const minSep = Math.max(8, (30 * invZoom) / Math.max(1, zoom * 0.55));
    for (let iter = 0; iter < 12; iter++) {
      for (let i = 0; i < raw.length; i++) {
        for (let j = i + 1; j < raw.length; j++) {
          const a = raw[i];
          const b = raw[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          if (dist < minSep) {
            const angle = dist > 0.01 ? Math.atan2(dy, dx) : (j - i) * 1.1;
            const push = (minSep - dist) * 0.52;
            const px = Math.cos(angle) * push;
            const py = Math.sin(angle) * push;
            a.x -= px;
            a.y -= py;
            b.x += px;
            b.y += py;
          }
        }
      }
    }

    return raw;
  }, [invZoom, pins, zoom]);

  const labeledPins = useMemo(() => {
    const placed: { x: number; y: number; w: number; h: number }[] = [];
    const sorted = [...projectedPins].sort((a, b) => a.y - b.y || a.x - b.x);
    return sorted.map((pin) => {
      const labelW = Math.max(54, pin.cleanName.length * 7 + 16) * invZoom;
      const labelH = 20 * invZoom;
      const offset = 14 * invZoom;
      const flipLeft = pin.x + offset + labelW > VB_W - 30;
      const lx = flipLeft ? pin.x - offset - labelW : pin.x + offset;
      let ly = pin.y - labelH / 2;
      let box = { x: lx, y: ly, w: labelW, h: labelH };
      for (
        let attempt = 0;
        attempt < 6 && placed.some((other) => overlaps(box, other));
        attempt++
      ) {
        ly += labelH + 3.5 * invZoom;
        box = { x: lx, y: ly, w: labelW, h: labelH };
      }
      placed.push(box);
      return { ...pin, lx, ly, labelW, labelH };
    });
  }, [invZoom, projectedPins]);

  const viewW = VB_W / zoom;
  const viewH = VB_H / zoom;
  const viewX = (VB_W - viewW) / 2 + pan.x;
  const viewY = (VB_H - viewH) / 2 + pan.y;

  const visibleTiles = useMemo(() => {
    const tileZ = Math.min(11, Math.max(5, Math.round(6 + Math.log2(zoom))));
    const n = 2 ** tileZ;
    const minWx = Math.max(0, WX0 + (viewX - ORIGIN_X) / WORLD_SCALE);
    const maxWx = Math.min(1, WX0 + (viewX + viewW - ORIGIN_X) / WORLD_SCALE);
    const minWy = Math.max(0, WY0 + (viewY - ORIGIN_Y) / WORLD_SCALE);
    const maxWy = Math.min(1, WY0 + (viewY + viewH - ORIGIN_Y) / WORLD_SCALE);

    const tx0 = Math.max(0, Math.floor(minWx * n));
    const tx1 = Math.min(n - 1, Math.floor(maxWx * n));
    const ty0 = Math.max(0, Math.floor(minWy * n));
    const ty1 = Math.min(n - 1, Math.floor(maxWy * n));

    const tileSvgSize = WORLD_SCALE / n;
    const tiles: { key: string; url: string; x: number; y: number; size: number }[] = [];
    for (let tx = tx0; tx <= tx1; tx++) {
      for (let ty = ty0; ty <= ty1; ty++) {
        const x = ORIGIN_X + (tx / n - WX0) * WORLD_SCALE;
        const y = ORIGIN_Y + (ty / n - WY0) * WORLD_SCALE;
        tiles.push({
          key: `${tileZ}-${tx}-${ty}`,
          url: `https://tile.openstreetmap.org/${tileZ}/${tx}/${ty}.png`,
          x,
          y,
          size: tileSvgSize + 0.5,
        });
      }
    }
    return tiles;
  }, [viewH, viewW, viewX, viewY, zoom]);

  const activePin = useMemo(() => {
    if (!activeSlug) return null;
    return labeledPins.find((p) => p.slug === activeSlug) ?? null;
  }, [activeSlug, labeledPins]);

  const popoverPosition = useMemo(() => {
    if (!activePin || !stageRef.current) return null;
    const rect = stageRef.current.getBoundingClientRect();
    const w = rect.width || 1100;
    const h = rect.height || 640;
    const scale = Math.min(w / viewW, h / viewH);
    const offsetX = (w - viewW * scale) / 2;
    const offsetY = (h - viewH * scale) / 2;
    const sx = offsetX + (activePin.x - viewX) * scale;
    const sy = offsetY + (activePin.y - viewY) * scale;
    const cardW = 292;
    const cardH = 195;
    const left = Math.max(16, Math.min(w - cardW - 16, sx - cardW / 2));
    const top = sy - cardH - 22 > 76 ? sy - cardH - 22 : Math.min(h - cardH - 16, sy + 24);
    return { left, top };
  }, [activePin, viewH, viewW, viewX, viewY]);

  const openPin = (slug: string) => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setActiveSlug(slug);
  };

  const scheduleClosePin = () => {
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => {
      setActiveSlug(null);
    }, 180);
  };

  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if ((event.target as Element).closest(".kp-uk-pin")) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    // Two-finger pinch-to-zoom on touch screens
    if (pointersRef.current.size >= 2) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Ignore if pointer capture is unavailable.
      }
      const [a, b] = [...pointersRef.current.values()];
      gestureRef.current = {
        kind: "pinch",
        dist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        midX: (a.x + b.x) / 2,
        midY: (a.y + b.y) / 2,
        moved: false,
      };
      setGrabbing(true);
      return;
    }

    // On touch devices at default zoom, let 1-finger vertical swipes scroll the page
    if (event.pointerType === "touch" && zoom <= 1.05 && !mapInteractive) {
      return;
    }

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Ignore if pointer capture is unavailable.
    }
    gestureRef.current = {
      kind: "drag",
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      panX: pan.x,
      panY: pan.y,
      moved: false,
    };
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (pointersRef.current.has(event.pointerId)) {
      pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    }
    const active = gestureRef.current;
    if (!active) return;

    if (active.kind === "pinch" && pointersRef.current.size >= 2) {
      const [a, b] = [...pointersRef.current.values()];
      const nextDist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const nextMidX = (a.x + b.x) / 2;
      const nextMidY = (a.y + b.y) / 2;
      const rect = event.currentTarget.getBoundingClientRect();
      const scale = Math.min(rect.width / viewW, rect.height / viewH) || 1;
      const ratio = nextDist / active.dist;
      if (Math.abs(ratio - 1) > 0.015) {
        applyZoom(ratio);
        active.dist = nextDist;
      }
      const dx = nextMidX - active.midX;
      const dy = nextMidY - active.midY;
      setPan((cur) => clampPan(zoom, cur.x - dx / scale, cur.y - dy / scale));
      active.midX = nextMidX;
      active.midY = nextMidY;
      active.moved = true;
      suppressClick.current = true;
      return;
    }

    if (active.kind === "drag" && active.id === event.pointerId) {
      const dx = event.clientX - active.startX;
      const dy = event.clientY - active.startY;
      if (!active.moved && Math.hypot(dx, dy) < 4) return;
      active.moved = true;
      suppressClick.current = true;
      setGrabbing(true);
      const rect = event.currentTarget.getBoundingClientRect();
      const scale = Math.min(rect.width / viewW, rect.height / viewH) || 1;
      setPan(clampPan(zoom, active.panX - dx / scale, active.panY - dy / scale));
    }
  };

  const onPointerUp = (event: PointerEvent<SVGSVGElement>) => {
    pointersRef.current.delete(event.pointerId);
    if (pointersRef.current.size < 2 && gestureRef.current?.kind === "pinch") {
      gestureRef.current = null;
      setGrabbing(false);
      return;
    }
    if (gestureRef.current?.kind === "drag" && gestureRef.current.id === event.pointerId) {
      gestureRef.current = null;
      setGrabbing(false);
    }
  };

  const originPoint = originCoords ? project(originCoords.lng, originCoords.lat) : null;

  return (
    <div
      ref={stageRef}
      className="kp-find__stage"
      onMouseLeave={() => {
        setMapInteractive(false);
        setShowScrollHint(false);
      }}
    >
      {/* —— Scroll-Zoom Hint Badge ——————————————————————————————— */}
      <div
        className={`kp-map-scroll-hint${showScrollHint ? " is-visible" : ""}`}
        aria-hidden="true"
      >
        Hold ⌘ / Ctrl + scroll to zoom · or click map
      </div>
      {/* —— Top Floating KP2 Search Bar + Near Me Button ———————— */}
      <div className="kp-map-top">
        <form
          className="kp-find__bar"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            document.getElementById("kp-branch-list")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <div className="kp-find__search">
            <span className="material-symbols-outlined kp-find__icon" aria-hidden="true">
              search
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search..."
              aria-label="Search KP2 branches"
              autoComplete="off"
            />
            {query ? (
              <button
                type="button"
                className="kp-find__clear"
                aria-label="Clear search"
                onClick={() => onQueryChange("")}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            ) : null}
            <span className="kp-find__badge">{projectedPins.length} Hubs</span>
          </div>
          <button
            type="button"
            className={`kp-find__near${hasOrigin ? " is-active" : ""}`}
            onClick={onLocate}
            disabled={locating}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              near_me
            </span>
            <span>{locating ? "Finding you…" : hasOrigin ? "Nearest first" : "Near me"}</span>
          </button>
        </form>
      </div>

      {/* —— Bottom-Right KP2 Zoom Controls ——————————————————————— */}
      <div className="kp-map-zoom-pill">
        <button
          type="button"
          aria-label="Zoom in"
          className="kp-find__zoom"
          disabled={zoom >= MAX_ZOOM}
          onClick={() => applyZoom(1.35)}
        >
          +
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          className="kp-find__zoom"
          disabled={zoom <= MIN_ZOOM}
          onClick={() => applyZoom(1 / 1.35)}
        >
          −
        </button>
        <button
          type="button"
          aria-label="Reset map view"
          className="kp-find__zoom"
          disabled={Math.abs(zoom - 1) < 0.02 && pan.x === 0 && pan.y === 0}
          onClick={resetView}
        >
          ↺
        </button>
      </div>

      {/* —— Full-Width Dark KP2 Interactive Map Surface —————————— */}
      <svg
        ref={svgRef}
        viewBox={`${viewX} ${viewY} ${viewW} ${viewH}`}
        preserveAspectRatio="xMidYMid meet"
        className={`kp-find__svg${grabbing ? " is-grabbing" : ""}${mapInteractive || zoom > 1.05 ? " is-interactive" : ""}`}
        role="img"
        aria-label="Interactive England map of Kharis Phase 2 branches"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={() => {
          setMapInteractive(true);
          applyZoom(1.45);
        }}
        onClick={() => {
          if (suppressClick.current) {
            suppressClick.current = false;
            return;
          }
          setMapInteractive(true);
          setShowScrollHint(false);
          setActiveSlug(null);
        }}
      >
        <defs>
          <pattern id={gridId} width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M36 0H0V36" fill="none" stroke="rgba(210, 187, 255, 0.08)" strokeWidth="0.7" />
          </pattern>

          {/* KP2 Campaign Gold Triangle Gradient */}
          <linearGradient id={goldGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff38a" />
            <stop offset="50%" stopColor="#ffde59" />
            <stop offset="100%" stopColor="#f7be1d" />
          </linearGradient>

          {/* KP2 Electric Purple Triangle Gradient (Active/Hovered) */}
          <linearGradient id={purpleGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d2bbff" />
            <stop offset="45%" stopColor="#8b46ff" />
            <stop offset="100%" stopColor="#630ed4" />
          </linearGradient>

          <filter id={shadowFilterId} x="-35%" y="-35%" width="170%" height="170%">
            <feDropShadow dx="2" dy="3" stdDeviation="1" floodColor="#151218" floodOpacity="0.95" />
          </filter>
        </defs>

        <rect
          x={viewX - viewW}
          y={viewY - viewH}
          width={viewW * 3}
          height={viewH * 3}
          fill={`url(#${gridId})`}
        />

        {/* Fallback KP2 dark midnight-purple landmass & motorway corridors */}
        <path
          d={UK_OUTLINE_PATH}
          fill="#1e1136"
          stroke="#4c2882"
          strokeWidth={1.4 * invZoom}
          strokeLinejoin="round"
        />
        <path
          d={MOTORWAY_PATH}
          fill="none"
          stroke="#3b1d68"
          strokeWidth={1.5 * invZoom}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />

        {/* OpenStreetMap street/road tiles tinted into KP2 midnight-purple & slate */}
        <g className="kp-map-tiles">
          {visibleTiles.map((tile) => (
            <image
              key={tile.key}
              href={tile.url}
              x={tile.x}
              y={tile.y}
              width={tile.size}
              height={tile.size}
              preserveAspectRatio="none"
            />
          ))}
        </g>

        {/* Subtle KP2 Gold Coastline Rim */}
        <path
          d={UK_OUTLINE_PATH}
          fill="none"
          stroke="rgba(247, 190, 29, 0.32)"
          strokeWidth={1.15 * invZoom}
          strokeLinejoin="round"
          pointerEvents="none"
        />

        {/* User GPS Origin Beacon */}
        {originPoint ? (
          <g pointerEvents="none">
            <circle
              cx={originPoint.x}
              cy={originPoint.y}
              r={12 * invZoom}
              fill="rgba(255, 222, 89, 0.24)"
              stroke="#ffde59"
              strokeWidth={1.6 * invZoom}
            />
            <circle
              cx={originPoint.x}
              cy={originPoint.y}
              r={4.5 * invZoom}
              fill="#ffde59"
              stroke="#151218"
              strokeWidth={2 * invZoom}
            />
          </g>
        ) : null}

        {/* KP2 Triangular Branch Markers */}
        {labeledPins.map((pin) => {
          const isHot = activeSlug === pin.slug;
          const isDisplaced = Math.hypot(pin.x - pin.rawX, pin.y - pin.rawY) > 2;
          return (
            <g
              key={pin.slug}
              className={`kp-uk-pin${isHot ? " is-hot" : ""}`}
              role="button"
              tabIndex={0}
              aria-label={`${pin.name} — hover or click for branch info`}
              onClick={(e) => {
                e.stopPropagation();
                if (activeSlug === pin.slug) {
                  onSelect(pin.slug);
                } else {
                  openPin(pin.slug);
                }
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onSelect(pin.slug);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(pin.slug);
                }
              }}
              onMouseEnter={() => openPin(pin.slug)}
              onMouseLeave={scheduleClosePin}
              onFocus={() => openPin(pin.slug)}
              onBlur={scheduleClosePin}
            >
              {isDisplaced ? (
                <line
                  x1={pin.rawX}
                  y1={pin.rawY}
                  x2={pin.x}
                  y2={pin.y}
                  stroke="rgba(255, 222, 89, 0.55)"
                  strokeWidth={1.1 * invZoom}
                  strokeDasharray={`${2 * invZoom} ${2 * invZoom}`}
                />
              ) : null}

              <circle cx={pin.x} cy={pin.y} r={18 * invZoom} fill="transparent" />

              {isHot ? (
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r={13 * invZoom}
                  fill="none"
                  stroke="#ffde59"
                  strokeWidth={2 * invZoom}
                  className="kp-uk-pin__pulse"
                />
              ) : null}

              {/* KP2 Triangular Pin */}
              <g
                transform={`translate(${pin.x}, ${pin.y}) scale(${invZoom * 1.15})`}
                filter={`url(#${shadowFilterId})`}
              >
                <g className="kp-uk-pin__tri">
                  <path
                    d="M 0,10.5 C -1.8,10.5 -3.3,9.4 -4.2,7.6 L -10,-3 C -11.4,-5.6 -9.7,-8.8 -6.6,-8.8 L 6.6,-8.8 C 9.7,-8.8 11.4,-5.6 10,-3 L 4.2,7.6 C 3.3,9.4 1.8,10.5 0,10.5 Z"
                    fill={`url(#${isHot ? purpleGradId : goldGradId})`}
                    stroke="#151218"
                    strokeWidth="2"
                  />
                  <path
                    d="M -6,-6.6 L 6,-6.6"
                    stroke="rgba(255, 255, 255, 0.65)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </g>
              </g>

              {/* KP2 Brutalist Tag Label */}
              <g pointerEvents="none">
                <rect
                  x={pin.lx + 2 * invZoom}
                  y={pin.ly + 2 * invZoom}
                  width={pin.labelW}
                  height={pin.labelH}
                  fill="#151218"
                />
                <rect
                  x={pin.lx}
                  y={pin.ly}
                  width={pin.labelW}
                  height={pin.labelH}
                  fill={isHot ? "#ffde59" : "#1a102b"}
                  stroke={isHot ? "#151218" : "#ffde59"}
                  strokeWidth={1.5 * invZoom}
                />
                <text
                  x={pin.lx + pin.labelW / 2}
                  y={pin.ly + pin.labelH / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isHot ? "#151218" : "#fffdf5"}
                  style={{
                    fontFamily: 'var(--font-hanken), "Hanken Grotesk", sans-serif',
                    fontSize: `${10.2 * invZoom}px`,
                    fontWeight: 800,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {pin.cleanName}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* —— KP2 Floating Popup Card Over Map ————————————————————— */}
      {activePin && popoverPosition ? (
        <div
          className="kp-pin-popover"
          style={{ left: popoverPosition.left, top: popoverPosition.top }}
          onMouseEnter={() => openPin(activePin.slug)}
          onMouseLeave={scheduleClosePin}
        >
          <div className="kp-pin-popover__head">
            <div>
              <span className="kp-pin-popover__eyebrow">
                {activePin.miles != null
                  ? `${activePin.miles < 1 ? "<1" : Math.round(activePin.miles)} mi away`
                  : "Kharis Phase 2 Hub"}
              </span>
              <span className="kp-pin-popover__title">{activePin.name}</span>
            </div>
            <button
              type="button"
              className="kp-pin-popover__close"
              aria-label="Close branch info"
              onClick={() => setActiveSlug(null)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                close
              </span>
            </button>
          </div>

          <ul className="kp-pin-popover__facts">
            <li>
              <span className="kp-pin-popover__label">Est.</span>
              <span className="kp-pin-popover__val">{activePin.estText}</span>
            </li>
            <li>
              <span className="kp-pin-popover__label">Service</span>
              <span className="kp-pin-popover__val">{activePin.serviceText}</span>
            </li>
            <li>
              <span className="kp-pin-popover__label">Location</span>
              <span className="kp-pin-popover__val">{activePin.venueText}</span>
            </li>
          </ul>

          <button
            type="button"
            className="kp-pin-popover__cta"
            onClick={() => onSelect(activePin.slug)}
          >
            <span>See Full Branch</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
