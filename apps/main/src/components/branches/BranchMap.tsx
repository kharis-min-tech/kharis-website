"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { globeOrigin } from "@/lib/globe-origin";
import countryOutlines from "@/data/countryOutlines.json";
import "./globe.css";

const destinations = [
  { id: "world", label: "Whole world", lat: 35, lng: -2, zoom: 1 },
  { id: "United Kingdom", label: "United Kingdom", lat: 54, lng: -2, zoom: 3 },
  { id: "Ghana", label: "Ghana", lat: 7.9, lng: -1.1, zoom: 4 },
  { id: "Sierra Leone", label: "Sierra Leone", lat: 8.6, lng: -11.9, zoom: 4.5 },
];
const rad = Math.PI / 180;
export interface GlobeBranch {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  country: string | null;
}

interface Props {
  branches?: GlobeBranch[];
  onSelectBranch?: (slug: string) => void;
  bare?: boolean;
  country?: string;
  onCountryChange?: (country: string) => void;
  origin?: { lat: number; lng: number } | null;
}

export function BranchMap({
  branches = [],
  onSelectBranch,
  bare = false,
  country,
  onCountryChange,
  origin,
}: Props) {
  const router = useRouter();
  const [selection, setSelection] = useState("world");
  const [land, setLand] = useState<{ x: number; y: number; z: number }[]>([]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const controller = new AbortController();
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        // 34KB of coordinates, fetched only near the viewport instead of bundled as JavaScript.
        void fetch("/maps/world-land-v1.bin", { signal: controller.signal })
          .then((response) => {
            if (!response.ok) throw new Error("Globe unavailable");
            return response.arrayBuffer();
          })
          .then((buffer) => {
            const data = new DataView(buffer);
            const points = [];
            for (let i = 0; i + 3 < data.byteLength; i += 4) {
              const lng = (data.getInt16(i, true) / 100) * rad;
              const lat = (data.getInt16(i + 2, true) / 100) * rad;
              points.push({
                x: Math.cos(lat) * Math.sin(lng),
                y: Math.sin(lat),
                z: Math.cos(lat) * Math.cos(lng),
              });
            }
            setLand(points);
          })
          .catch(() => {
            /* The country picker and branch links remain available offline. */
          });
      },
      { rootMargin: "200px" },
    );
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      controller.abort();
    };
  }, []);
  const [paused, setPaused] = useState(false);
  const [initialCenter, setInitialCenter] = useState({ lat: 35, lng: -2 });
  useEffect(() => {
    setInitialCenter(
      globeOrigin(Intl.DateTimeFormat().resolvedOptions().timeZone, new Date().getTimezoneOffset()),
    );
  }, []);
  const selected = country === undefined ? selection : country;
  const destination = destinations.find((d) => d.id === selected) ?? destinations[0];
  const [cameraCountry, setCameraCountry] = useState(destination.id);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(
      () => setCameraCountry(destination.id),
      reduced || destination.id === "world" ? 0 : 950,
    );
    return () => window.clearTimeout(timer);
  }, [destination.id]);
  const cameraDestination = destinations.find((d) => d.id === cameraCountry) ?? destinations[0];
  const hitPins = useRef<{ x: number; y: number; slug: string; name: string }[]>([]);
  const worldAngle = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const camera = useRef({ lat: 35, lng: -2, zoom: 1 });
  const pins = useMemo(() => branches, [branches]);
  const visible = pins.filter(
    (pin) => destination.id === "world" || pin.country === destination.id,
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let last = 0;
    let active = false;
    let width = 0;
    let height = 0;
    let settled = false;
    const target =
      cameraDestination.id === "world"
        ? { ...(origin ?? initialCenter), zoom: 1 }
        : { ...cameraDestination };
    if (cameraDestination.id === "world") target.lng += worldAngle.current;
    const project = (x: number, y: number, z: number) => {
      const c = camera.current;
      const longitude = c.lng * rad;
      const latitude = c.lat * rad;
      const depth = x * Math.sin(longitude) + z * Math.cos(longitude);
      const radius = Math.min(width, height) * 0.42 * c.zoom;
      return {
        x: width / 2 + (x * Math.cos(longitude) - z * Math.sin(longitude)) * radius,
        y: height / 2 - (y * Math.cos(latitude) - depth * Math.sin(latitude)) * radius,
        depth: y * Math.sin(latitude) + depth * Math.cos(latitude),
      };
    };
    const draw = (time: number) => {
      if (!active || document.hidden) return;
      // Cap drawing at 30fps; elapsed time keeps motion consistent across devices.
      if (time - last < 32 && !motion.matches) {
        frame = requestAnimationFrame(draw);
        return;
      }
      const elapsed = Math.min((time - (last || time)) / 1000, 0.1);
      last = time;
      const c = camera.current;
      const ease = motion.matches ? 1 : 1 - Math.exp(-elapsed * 5);
      const delta = ((target.lng - c.lng + 540) % 360) - 180;
      settled =
        Math.abs(delta) + Math.abs(c.lat - target.lat) + Math.abs(c.zoom - target.zoom) < 0.02;
      if (cameraDestination.id === "world" && settled && !paused && !motion.matches) {
        target.lng += elapsed * 3;
        worldAngle.current += elapsed * 3;
        c.lng = target.lng;
      } else {
        c.lng += delta * ease;
      }
      c.lat += (target.lat - c.lat) * ease;
      c.zoom += (target.zoom - c.zoom) * ease;
      ctx.clearRect(0, 0, width, height);
      const radius = Math.min(width, height) * 0.42 * c.zoom;
      const ocean = ctx.createRadialGradient(
        width * 0.4,
        height * 0.35,
        0,
        width / 2,
        height / 2,
        radius,
      );
      ocean.addColorStop(0, "#3c2064");
      ocean.addColorStop(0.8, "#180f2c");
      ocean.addColorStop(1, "#090610");
      ctx.fillStyle = ocean;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#b99ad855";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "#b299d2";
      ctx.beginPath();
      for (const dot of land) {
        const p = project(dot.x, dot.y, dot.z);
        if (p.depth <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) continue;
        const size = Math.min(2.4, 0.8 * Math.sqrt(c.zoom));
        ctx.moveTo(p.x + size, p.y);
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      }
      ctx.fill();
      const outlineKey = (
        { "United Kingdom": "uk", Ghana: "ghana", "Sierra Leone": "sierra-leone" } as Record<
          string,
          string
        >
      )[cameraDestination.id];
      const outlines = countryOutlines as Record<string, number[][][]>;
      ctx.strokeStyle = "#ffde59";
      ctx.lineWidth = 1.5;
      for (const ring of outlines[outlineKey ?? ""] ?? []) {
        ctx.beginPath();
        let drawing = false;
        for (const [lng, lat] of ring) {
          const p = project(
            Math.cos(lat * rad) * Math.sin(lng * rad),
            Math.sin(lat * rad),
            Math.cos(lat * rad) * Math.cos(lng * rad),
          );
          if (p.depth <= 0) {
            drawing = false;
            continue;
          }
          if (drawing) ctx.lineTo(p.x, p.y);
          else ctx.moveTo(p.x, p.y);
          drawing = true;
        }
        ctx.stroke();
      }
      hitPins.current = [];
      for (const pin of pins) {
        const lat = pin.lat * rad,
          lng = pin.lng * rad;
        const p = project(
          Math.cos(lat) * Math.sin(lng),
          Math.sin(lat),
          Math.cos(lat) * Math.cos(lng),
        );
        if (p.depth <= 0) continue;
        hitPins.current.push({ ...p, slug: pin.slug, name: pin.name });
        ctx.fillStyle = "#ffde59";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!motion.matches && (!settled || (cameraDestination.id === "world" && !paused)))
        frame = requestAnimationFrame(draw);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (active && !document.hidden) frame = requestAnimationFrame(draw);
    };
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      start();
    });
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      start();
    });
    resize.observe(canvas);
    observer.observe(canvas);
    document.addEventListener("visibilitychange", start);
    motion.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", start);
      motion.removeEventListener("change", start);
    };
  }, [cameraDestination, pins, paused, origin, initialCenter, land]);

  return (
    <section
      className={`location-globe${bare ? " location-globe--bare" : ""}`}
      aria-label="Explore Kharis around the world"
    >
      <div className="location-globe__toolbar">
        <label>
          Explore our family
          <select
            value={destination.id}
            onChange={(event) => {
              setSelection(event.target.value);
              onCountryChange?.(event.target.value);
            }}
          >
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={() => setPaused((value) => !value)} aria-pressed={paused}>
          {paused ? "Resume rotation" : "Pause rotation"}
        </button>
      </div>
      <div className="location-globe__scene">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const pin = hitPins.current.find(
              (pin) =>
                Math.hypot(
                  pin.x - (event.clientX - rect.left),
                  pin.y - (event.clientY - rect.top),
                ) < 14,
            );
            event.currentTarget.style.cursor = pin ? "pointer" : "default";
            event.currentTarget.title = pin?.name ?? "";
          }}
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const pin = hitPins.current.find(
              (pin) =>
                Math.hypot(
                  pin.x - (event.clientX - rect.left),
                  pin.y - (event.clientY - rect.top),
                ) < 14,
            );
            if (pin) {
              if (onSelectBranch) onSelectBranch(pin.slug);
              else router.push(`/locations/${pin.slug}`);
            }
          }}
        />
        <div
          className={`location-globe__welcome${destination.id !== "world" ? " location-globe__welcome--journey" : ""}`}
          key={destination.id}
          role="status"
        >
          <p>{destination.id === "world" ? "One global family" : "Your family is here"}</p>
          <h2
            aria-label={
              destination.id === "world"
                ? "A world of welcome"
                : `Welcome to ${destination.id === "United Kingdom" ? "the United Kingdom" : destination.label}`
            }
          >
            {destination.id === "world" ? (
              "A world of welcome"
            ) : (
              <>
                <span className="location-globe__word-mask" aria-hidden="true">
                  <span className="location-globe__word location-globe__word--intro">
                    Welcome to
                  </span>
                </span>{" "}
                <span className="location-globe__word-mask" aria-hidden="true">
                  <span className="location-globe__word location-globe__word--country">
                    {destination.id === "United Kingdom" ? "the United Kingdom" : destination.label}
                  </span>
                </span>
              </>
            )}
          </h2>
          <span className="location-globe__detail">
            {branches.length
              ? "A place for you. A family to call home."
              : "Explore our global family. Branch details are temporarily unavailable."}
          </span>
        </div>
      </div>
      <div className="location-globe__branches" aria-label="Explore a branch">
        {visible.map((pin) => (
          <button
            key={pin.slug}
            type="button"
            onClick={() =>
              onSelectBranch ? onSelectBranch(pin.slug) : router.push(`/locations/${pin.slug}`)
            }
          >
            {pin.name} <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
    </section>
  );
}
export default BranchMap;
