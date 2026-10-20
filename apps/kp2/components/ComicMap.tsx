"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import outlines from "@/data/family-outlines.json";
import world from "@/data/world-land.json";
import "./comic-map.css";

type Ring = number[][];

export type MapPlace = "world" | "uk" | "ghana" | "sierra-leone";

export type MapPin = {
  slug: string;
  name: string;
  lat: number;
  lng: number;
};

type Frame = {
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
  scale: number;
  x: number;
  y: number;
};

const LAND = outlines as Record<Exclude<MapPlace, "world">, Ring[]>;
const EARTH = world as Ring[];

function highlightFor(place: MapPlace): Ring[] {
  if (place === "world") return [...LAND.uk, ...LAND.ghana, ...LAND["sierra-leone"]];
  return LAND[place];
}

const FAMILY_BOUNDS = (["uk", "ghana", "sierra-leone"] as const).map((key) =>
  landBounds(LAND[key]),
);

const BASE = EARTH.filter((ring) => {
  const box = landBounds([ring]);
  return !FAMILY_BOUNDS.some(
    (family) =>
      box.minLng >= family.minLng - 0.5 &&
      box.maxLng <= family.maxLng + 0.5 &&
      box.minLat >= family.minLat - 0.5 &&
      box.maxLat <= family.maxLat + 0.5,
  );
}).concat(highlightFor("world"));

function landBounds(rings: Ring[]) {
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  for (const ring of rings) {
    for (const [lng, lat] of ring) {
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }
  }
  return { minLng, maxLng, minLat, maxLat };
}

function fit(rings: Ring[], width: number, height: number, zoom: number): Frame {
  const bounds = landBounds(rings);
  const spanLng = bounds.maxLng - bounds.minLng || 1;
  const spanLat = bounds.maxLat - bounds.minLat || 1;
  const padX = 36;
  const padY = 72;
  const innerW = Math.max(1, width - padX * 2);
  const innerH = Math.max(1, height - padY * 2);
  const scale = Math.min(innerW / spanLng, innerH / spanLat) * zoom;
  return {
    ...bounds,
    scale,
    x: padX + (innerW - spanLng * scale) / 2,
    y: padY + (innerH - spanLat * scale) / 2,
  };
}

function project(lng: number, lat: number, frame: Frame) {
  return {
    x: frame.x + (lng - frame.minLng) * frame.scale,
    y: frame.y + (frame.maxLat - lat) * frame.scale,
  };
}

function trace(ctx: CanvasRenderingContext2D, rings: Ring[], frame: Frame) {
  ctx.beginPath();
  for (const ring of rings) {
    ring.forEach(([lng, lat], index) => {
      const point = project(lng, lat, frame);
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
  }
}

function drawPin(ctx: CanvasRenderingContext2D, x: number, y: number, hot: boolean) {
  const radius = hot ? 8 : 6;
  ctx.fillStyle = "#151218";
  ctx.beginPath();
  ctx.arc(x + 3, y + 3, radius + 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hot ? "#ffffff" : "#7c3aed";
  ctx.strokeStyle = "#151218";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

export function ComicMap({
  pins,
  place,
  onSelect,
}: {
  pins: MapPin[];
  place: MapPlace;
  onSelect: (slug: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hits = useRef<Array<MapPin & { x: number; y: number }>>([]);
  const redraw = useRef<(() => void) | null>(null);
  const hot = useRef<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [tip, setTip] = useState<{ x: number; y: number; name: string; width: number } | null>(
    null,
  );

  useEffect(() => {
    hot.current = null;
    setTip(null);
  }, [pins, zoom, place]);

  useEffect(() => {
    setZoom(1);
  }, [place]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let width = 0;
    let height = 0;

    const highlight = highlightFor(place);
    const isWorld = place === "world";
    const paint = () => {
      const frame = fit(isWorld ? EARTH : highlight, width, height, zoom);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#110b1a";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "rgba(210, 187, 255, 0.16)";
      for (let y = 8; y < height; y += 16) {
        const offset = Math.floor(y / 16) % 2 ? 8 : 0;
        for (let x = offset; x < width; x += 16) ctx.fillRect(x, y, 2, 2);
      }

      const shadow = isWorld ? 5 : 8;
      ctx.lineJoin = "round";
      ctx.save();
      ctx.translate(shadow, shadow);
      trace(ctx, BASE, frame);
      ctx.fillStyle = "#000";
      ctx.fill();
      ctx.restore();

      trace(ctx, BASE, frame);
      ctx.fillStyle = "#f6e7a8";
      ctx.fill();
      ctx.lineWidth = isWorld ? 1.5 : 2.5;
      ctx.strokeStyle = "#151218";
      ctx.stroke();

      trace(ctx, highlight, frame);
      ctx.fillStyle = "#f7be1d";
      ctx.fill();
      ctx.lineWidth = isWorld ? 2 : 4;
      ctx.stroke();

      hits.current = [];
      for (const pin of pins) {
        const point = project(pin.lng, pin.lat, frame);
        if (point.x < 0 || point.y < 0 || point.x > width || point.y > height) continue;
        hits.current.push({ ...pin, ...point });
        drawPin(ctx, point.x, point.y, hot.current === pin.slug);
      }
    };

    redraw.current = paint;
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint();
    });
    resize.observe(canvas);
    paint();
    return () => {
      redraw.current = null;
      resize.disconnect();
    };
  }, [pins, place, zoom]);

  const pinAt = (event: MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return hits.current.find((pin) => Math.hypot(pin.x - x, pin.y - y) < 16) ?? null;
  };

  return (
    <div className="kp-find__stage">
      <div className="absolute right-4 bottom-4 z-[2] flex flex-col gap-2">
        <button
          type="button"
          aria-label="Zoom in"
          className="kp-find__zoom"
          onClick={() => setZoom((value) => Math.min(2.6, +(value * 1.3).toFixed(2)))}
        >
          +
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          className="kp-find__zoom"
          onClick={() => setZoom((value) => Math.max(1, +(value / 1.3).toFixed(2)))}
        >
          −
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="kp-find__canvas"
        aria-hidden="true"
        onPointerMove={(event) => {
          const pin = pinAt(event);
          event.currentTarget.style.cursor = pin ? "pointer" : "default";
          if (event.pointerType === "touch") return;
          if (hot.current === (pin?.slug ?? null)) return;
          hot.current = pin?.slug ?? null;
          const rect = event.currentTarget.getBoundingClientRect();
          setTip(pin ? { x: pin.x, y: pin.y, name: pin.name, width: rect.width } : null);
          redraw.current?.();
        }}
        onPointerLeave={() => {
          hot.current = null;
          setTip(null);
          redraw.current?.();
        }}
        onClick={(event) => {
          const pin = pinAt(event);
          if (pin) onSelect(pin.slug);
        }}
      />
      {tip ? (
        <div
          className="kp-find__tip"
          style={{
            left: Math.max(12, Math.min(tip.width - 220, tip.x - 80)),
            top: Math.max(12, tip.y - 78),
          }}
        >
          <strong>{tip.name}</strong>
          <span>Explore this branch</span>
        </div>
      ) : null}
    </div>
  );
}
