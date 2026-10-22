"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
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

const MIN_ZOOM = 1;
const MAX_ZOOM = 16;

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
  const view = useRef({ zoom: 1, panX: 0, panY: 0 });
  const moved = useRef(false);
  const controls = useRef<{
    zoomAt: (zoom: number, x: number, y: number) => void;
    panTo: (panX: number, panY: number) => void;
    reset: () => void;
  } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<
    | { kind: "drag"; id: number; x: number; y: number; panX: number; panY: number; moved: boolean }
    | { kind: "pinch"; dist: number; x: number; y: number; moved: boolean }
    | null
  >(null);
  const [level, setLevel] = useState(1);
  const [shifted, setShifted] = useState(false);
  const [tip, setTip] = useState<{ x: number; y: number; name: string; width: number } | null>(
    null,
  );

  useEffect(() => {
    view.current = { zoom: 1, panX: 0, panY: 0 };
    setLevel(1);
    setShifted(false);
    hot.current = null;
    setTip(null);
  }, [place]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let width = 0;
    let height = 0;

    const highlight = highlightFor(place);
    const isWorld = place === "world";
    const land = isWorld ? EARTH : highlight;

    const frameFor = (zoom: number, panX: number, panY: number) => {
      const frame = fit(land, width, height, zoom);
      frame.x += panX;
      frame.y += panY;
      return frame;
    };

    // Keep some of the highlighted land on screen, so a drag can't lose the map.
    const clampPan = (zoom: number, panX: number, panY: number) => {
      if (width < 2 || height < 2) return { panX, panY };
      const fitted = fit(land, width, height, zoom);
      const box = landBounds(land);
      const left = fitted.x + panX;
      const top = fitted.y + panY;
      const right = left + (box.maxLng - box.minLng) * fitted.scale;
      const bottom = top + (box.maxLat - box.minLat) * fitted.scale;
      const margin = 72;
      let x = panX;
      let y = panY;
      if (right < margin) x += margin - right;
      if (bottom < margin) y += margin - bottom;
      if (left > width - margin) x -= left - (width - margin);
      if (top > height - margin) y -= top - (height - margin);
      return { panX: x, panY: y };
    };

    const paint = () => {
      const { zoom, panX, panY } = view.current;
      const frame = frameFor(zoom, panX, panY);
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

    // Keeps the map point under (mx, my) fixed while the zoom changes.
    const zoomAt = (nextZoom: number, mx: number, my: number) => {
      if (width < 2 || height < 2) return;
      const prev = view.current;
      const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(nextZoom * 1000) / 1000));
      if (zoom === prev.zoom && (zoom !== MIN_ZOOM || (prev.panX === 0 && prev.panY === 0))) return;
      if (zoom === MIN_ZOOM) {
        view.current = { zoom, panX: 0, panY: 0 };
        setShifted(false);
      } else {
        const before = frameFor(prev.zoom, prev.panX, prev.panY);
        const lng = before.minLng + (mx - before.x) / before.scale;
        const lat = before.maxLat - (my - before.y) / before.scale;
        const fitted = fit(land, width, height, zoom);
        const pan = clampPan(
          zoom,
          mx - fitted.x - (lng - fitted.minLng) * fitted.scale,
          my - fitted.y - (fitted.maxLat - lat) * fitted.scale,
        );
        view.current = { zoom, ...pan };
        if (pan.panX !== 0 || pan.panY !== 0) setShifted(true);
      }
      setLevel(zoom);
      hot.current = null;
      setTip(null);
      paint();
    };

    const panTo = (panX: number, panY: number) => {
      const pan = clampPan(view.current.zoom, panX, panY);
      view.current.panX = pan.panX;
      view.current.panY = pan.panY;
      if (Math.abs(pan.panX) > 1 || Math.abs(pan.panY) > 1) setShifted(true);
      hot.current = null;
      setTip(null);
      paint();
    };

    controls.current = {
      zoomAt,
      panTo,
      reset: () => zoomAt(MIN_ZOOM, width / 2, height / 2),
    };

    redraw.current = paint;
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const pan = clampPan(view.current.zoom, view.current.panX, view.current.panY);
      view.current.panX = pan.panX;
      view.current.panY = pan.panY;
      paint();
    });
    resize.observe(canvas);

    paint();
    return () => {
      redraw.current = null;
      controls.current = null;
      resize.disconnect();
    };
  }, [pins, place]);

  const pinAt = (event: { clientX: number; clientY: number; currentTarget: HTMLCanvasElement }) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return hits.current.find((pin) => Math.hypot(pin.x - x, pin.y - y) < 16) ?? null;
  };

  const zoomBy = (factor: number) => {
    const canvas = canvasRef.current;
    controls.current?.zoomAt(
      view.current.zoom * factor,
      (canvas?.clientWidth ?? 0) / 2,
      (canvas?.clientHeight ?? 0) / 2,
    );
  };

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // A pointer that is already gone cannot be captured. The drag still tracks move events.
    }
    if (pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = {
        kind: "pinch",
        dist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
        moved: false,
      };
      return;
    }
    gesture.current = {
      kind: "drag",
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      panX: view.current.panX,
      panY: view.current.panY,
      moved: false,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (pointers.current.has(event.pointerId)) {
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    }
    const active = gesture.current;
    if (active?.kind === "pinch" && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      const rect = event.currentTarget.getBoundingClientRect();
      controls.current?.panTo(
        view.current.panX + (midX - active.x),
        view.current.panY + (midY - active.y),
      );
      controls.current?.zoomAt(
        view.current.zoom * (dist / active.dist),
        midX - rect.left,
        midY - rect.top,
      );
      active.dist = dist;
      active.x = midX;
      active.y = midY;
      active.moved = true;
      event.currentTarget.classList.add("is-grabbing");
      return;
    }
    if (active?.kind === "drag" && active.id === event.pointerId) {
      const dx = event.clientX - active.x;
      const dy = event.clientY - active.y;
      if (!active.moved && Math.hypot(dx, dy) < 4) return;
      active.moved = true;
      moved.current = true;
      event.currentTarget.classList.add("is-grabbing");
      controls.current?.panTo(active.panX + dx, active.panY + dy);
      return;
    }

    const pin = pinAt(event);
    event.currentTarget.style.cursor = pin ? "pointer" : "";
    if (event.pointerType === "touch") return;
    if (hot.current === (pin?.slug ?? null)) return;
    hot.current = pin?.slug ?? null;
    const rect = event.currentTarget.getBoundingClientRect();
    setTip(pin ? { x: pin.x, y: pin.y, name: pin.name, width: rect.width } : null);
    redraw.current?.();
  };

  const onPointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    pointers.current.delete(event.pointerId);
    const active = gesture.current;
    if (active?.kind === "drag" && active.id === event.pointerId) {
      if (active.moved) moved.current = true;
      gesture.current = null;
    }
    if (active?.kind === "pinch" && pointers.current.size < 2) {
      if (active.moved) moved.current = true;
      gesture.current = null;
    }
    if (pointers.current.size === 0) event.currentTarget.classList.remove("is-grabbing");
  };

  return (
    <div className="kp-find__stage">
      <div className="absolute right-4 bottom-4 z-[2] flex flex-col gap-2">
        <button
          type="button"
          aria-label="Zoom in"
          className="kp-find__zoom"
          disabled={level >= MAX_ZOOM}
          onClick={() => zoomBy(1.4)}
        >
          +
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          className="kp-find__zoom"
          disabled={level <= MIN_ZOOM}
          onClick={() => zoomBy(1 / 1.4)}
        >
          −
        </button>
        <button
          type="button"
          aria-label="Reset map"
          className="kp-find__zoom"
          disabled={level <= MIN_ZOOM && !shifted}
          onClick={() => controls.current?.reset()}
        >
          ↺
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="kp-find__canvas"
        aria-hidden="true"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          controls.current?.zoomAt(
            view.current.zoom * 1.8,
            event.clientX - rect.left,
            event.clientY - rect.top,
          );
        }}
        onPointerLeave={() => {
          if (gesture.current) return;
          hot.current = null;
          setTip(null);
          redraw.current?.();
        }}
        onClick={(event) => {
          if (moved.current) {
            moved.current = false;
            return;
          }
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
