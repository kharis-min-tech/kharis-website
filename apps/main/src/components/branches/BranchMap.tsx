"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSmoothRouter } from "@/lib/use-smooth-router";
import { Plus, Minus, RotateCcw, ChevronDown, Check, ArrowUpRight } from "lucide-react";
import { interpolateGlobeCamera } from "@/lib/globe-camera";
import countryOutlines from "@/data/countryOutlines.json";
import "./globe.css";

const destinations = [
  { id: "world", label: "Whole world", lat: 30, lng: -4, zoom: 1.35 },
  { id: "United Kingdom", label: "United Kingdom", lat: 54, lng: -2, zoom: 6 },
  { id: "Ghana", label: "Ghana", lat: 7.9, lng: -1.1, zoom: 9 },
  { id: "Sierra Leone", label: "Sierra Leone", lat: 8.6, lng: -11.9, zoom: 16 },
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
  const router = useSmoothRouter();
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
  const selected = country === undefined ? selection : country;
  const destination = destinations.find((d) => d.id === selected) ?? destinations[0];
  const [zoomMultiplier, setZoomMultiplier] = useState(1);
  const [cameraCountry, setCameraCountry] = useState(destination.id);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setZoomMultiplier(1);
      setCameraCountry(destination.id);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [destination.id]);
  const cameraDestination = destinations.find((d) => d.id === cameraCountry) ?? destinations[0];
  type HoverPin = {
    x: number;
    y: number;
    slug: string;
    name: string;
    country: string | null;
    width: number;
    hitWidth?: number;
  };
  const [hovered, setHovered] = useState<HoverPin | null>(null);
  const hoveredSlug = useRef<string | null>(null);
  const redraw = useRef<(() => void) | null>(null);
  const pickerRef = useRef<HTMLDetailsElement>(null);
  const hitPins = useRef<Omit<HoverPin, "width">[]>([]);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node))
        pickerRef.current.open = false;
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  useEffect(() => {
    hoveredSlug.current = null;
    setHovered(null);
  }, [destination.id, zoomMultiplier]);
  const worldAngle = useRef(0);
  const manualCenter = useRef<{ lat: number; lng: number } | null>(null);
  const drag = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  useEffect(() => {
    manualCenter.current = null;
  }, [cameraCountry, origin]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const camera = useRef({ lat: 30, lng: -4, zoom: 1.35 });
  const pins = useMemo(() => branches, [branches]);
  const countryPins = useMemo(
    () =>
      destinations.slice(1).flatMap((country) => {
        const members = branches.filter((branch) => branch.country === country.id);
        if (!members.length) return [];
        return [
          {
            slug: `country:${country.id}`,
            name: `${country.label} · ${members.length} ${members.length === 1 ? "branch" : "branches"}`,
            lat: country.lat,
            lng: country.lng,
            country: country.id,
          },
        ];
      }),
    [branches],
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
    let travelStarted: number | null = null;
    const departure = { ...camera.current };
    const target =
      cameraDestination.id === "world"
        ? { ...(origin ?? cameraDestination), zoom: cameraDestination.zoom }
        : { ...cameraDestination };
    if (manualCenter.current) Object.assign(target, manualCenter.current);
    target.zoom = Math.min(32, Math.max(1, target.zoom * zoomMultiplier));
    if (cameraDestination.id === "world" && !manualCenter.current) target.lng += worldAngle.current;
    const project = (x: number, y: number, z: number) => {
      const c = camera.current;
      const longitude = c.lng * rad;
      const latitude = c.lat * rad;
      const depth = x * Math.sin(longitude) + z * Math.cos(longitude);
      const radius = Math.min(width, height) * 0.42 * c.zoom;
      return {
        x: width / 2 + (x * Math.cos(longitude) - z * Math.sin(longitude)) * radius,
        y: height * 0.43 - (y * Math.cos(latitude) - depth * Math.sin(latitude)) * radius,
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
      if (drag.current?.moved && manualCenter.current) {
        Object.assign(target, manualCenter.current);
        travelStarted = time - 1900;
      }
      const c = camera.current;
      travelStarted ??= time;
      const progress = motion.matches ? 1 : Math.min(1, (time - travelStarted) / 1900);
      settled = progress === 1;
      if (drag.current?.moved) {
        Object.assign(c, manualCenter.current);
      } else if (!settled || motion.matches) {
        Object.assign(c, interpolateGlobeCamera(departure, target, progress));
      } else {
        c.lat = target.lat;
        c.lng = target.lng;
        if (manualCenter.current) manualCenter.current.lng = target.lng;
        c.zoom = target.zoom;
      }
      if (
        settled &&
        !motion.matches &&
        cameraDestination.id === "world" &&
        !paused &&
        !hoveredSlug.current
      ) {
        target.lng += elapsed * 2;
        worldAngle.current += elapsed * 2;
        c.lng = target.lng;
      }
      ctx.clearRect(0, 0, width, height);
      const radius = Math.min(width, height) * 0.42 * c.zoom;
      const ocean = ctx.createRadialGradient(
        width * 0.4,
        height * 0.35,
        0,
        width / 2,
        height * 0.43,
        radius,
      );
      ocean.addColorStop(0, "#3c2064");
      ocean.addColorStop(0.8, "#180f2c");
      ocean.addColorStop(1, "#090610");
      ctx.fillStyle = ocean;
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.43, radius, 0, Math.PI * 2);
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
      const clustered = cameraDestination.id === "world" && c.zoom < 3;
      for (const pin of clustered ? countryPins : pins) {
        const lat = pin.lat * rad,
          lng = pin.lng * rad;
        const p = project(
          Math.cos(lat) * Math.sin(lng),
          Math.sin(lat),
          Math.cos(lat) * Math.cos(lng),
        );
        if (p.depth <= 0) continue;
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) continue;
        hitPins.current.push({ ...p, slug: pin.slug, name: pin.name, country: pin.country });
        if (clustered) {
          ctx.font = "600 12px system-ui, sans-serif";
          const labelWidth = Math.min(width - 24, ctx.measureText(pin.name).width + 22);
          const left = Math.max(
            12,
            Math.min(
              width - labelWidth - 12,
              pin.country !== "Ghana" ? p.x - labelWidth - 12 : p.x + 14,
            ),
          );
          const top = Math.max(12, p.y - (pin.country === "Sierra Leone" ? 64 : 32));
          ctx.strokeStyle = "#ffde5980";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(left + labelWidth / 2, top + 30);
          ctx.stroke();
          ctx.fillStyle = "#211330";
          ctx.fillRect(left, top, labelWidth, 30);
          ctx.strokeRect(left, top, labelWidth, 30);
          ctx.fillStyle = "#ffed9d";
          ctx.fillText(pin.name, left + 11, top + 19);
          hitPins.current.push({
            x: left + labelWidth / 2,
            y: top + 15,
            hitWidth: labelWidth / 2,
            slug: pin.slug,
            name: pin.name,
            country: pin.country,
          });
        }
        ctx.fillStyle = "#ffde5928";
        ctx.beginPath();
        ctx.arc(p.x, p.y, clustered ? 13 : 10, 0, Math.PI * 2);
        ctx.fill();
        const highlighted = hoveredSlug.current === pin.slug;
        if (highlighted) {
          ctx.strokeStyle = "#ffde5990";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = "#ffde5930";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = "#ffde59";
        ctx.beginPath();
        ctx.arc(p.x, p.y, highlighted ? 7 : 5, 0, Math.PI * 2);
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
    redraw.current = start;
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
      redraw.current = null;
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", start);
      motion.removeEventListener("change", start);
    };
  }, [cameraDestination, pins, countryPins, paused, origin, land, zoomMultiplier]);

  return (
    <section
      className={`location-globe${bare ? " location-globe--bare" : ""}`}
      aria-label="Explore Kharis around the world"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setPaused(true);
      }}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="location-globe__toolbar">
        <details
          className="globe-picker"
          ref={pickerRef}
          onKeyDown={(event) => {
            const details = event.currentTarget;
            if (event.key === "Escape") {
              details.open = false;
              details.querySelector("summary")?.focus();
            }
            if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
            event.preventDefault();
            details.open = true;
            const options = [
              ...details.querySelectorAll<HTMLButtonElement>("[role='menuitemradio']"),
            ];
            const current = options.indexOf(document.activeElement as HTMLButtonElement);
            const next =
              current < 0
                ? 0
                : (current + (event.key === "ArrowDown" ? 1 : -1) + options.length) %
                  options.length;
            options[next]?.focus();
          }}
        >
          <summary aria-haspopup="menu" aria-label={`Explore our family: ${destination.label}`}>
            <span className="globe-picker__text">
              <span>Explore our family</span>
              <strong>{destination.label}</strong>
            </span>
            <ChevronDown className="globe-picker__chevron" size={18} aria-hidden="true" />
          </summary>
          <div className="globe-picker__menu" role="menu" aria-label="Choose a country">
            {destinations.map((d) => (
              <button
                key={d.id}
                type="button"
                role="menuitemradio"
                aria-label={d.label}
                aria-checked={destination.id === d.id}
                onClick={() => {
                  setZoomMultiplier(1);
                  setSelection(d.id);
                  onCountryChange?.(d.id);
                  if (pickerRef.current) {
                    pickerRef.current.open = false;
                    pickerRef.current.querySelector("summary")?.focus();
                  }
                }}
              >
                <span>
                  <strong>{d.label}</strong>
                  <small>
                    {d.id === "world"
                      ? "One global family"
                      : `Discover Kharis in ${d.label === "United Kingdom" ? "the UK" : d.label}`}
                  </small>
                </span>
                {destination.id === d.id ? <Check size={17} aria-hidden="true" /> : null}
              </button>
            ))}
          </div>
        </details>
      </div>
      <div className="location-globe__scene">
        <div className="location-globe__zoom" role="group" aria-label="Globe zoom">
          <button
            type="button"
            aria-label="Zoom in"
            disabled={cameraDestination.zoom * zoomMultiplier >= 32}
            onClick={() =>
              setZoomMultiplier((zoom) => Math.min(32 / cameraDestination.zoom, zoom * 1.5))
            }
          >
            <Plus aria-hidden="true" size={18} />
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            disabled={cameraDestination.zoom * zoomMultiplier <= 1}
            onClick={() =>
              setZoomMultiplier((zoom) => Math.max(1 / cameraDestination.zoom, zoom / 1.5))
            }
          >
            <Minus aria-hidden="true" size={18} />
          </button>
          <button type="button" aria-label="Reset zoom" onClick={() => setZoomMultiplier(1)}>
            <RotateCcw aria-hidden="true" size={16} />
          </button>
        </div>
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0) return;
            drag.current = {
              id: event.pointerId,
              x: event.clientX,
              y: event.clientY,
              moved: false,
            };
            suppressClick.current = false;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerUp={(event) => {
            if (drag.current?.id !== event.pointerId) return;
            suppressClick.current = drag.current.moved;
            drag.current = null;
            event.currentTarget.releasePointerCapture(event.pointerId);
            event.currentTarget.style.cursor = "grab";
          }}
          onPointerCancel={() => {
            drag.current = null;
            suppressClick.current = true;
          }}
          onLostPointerCapture={() => {
            drag.current = null;
          }}
          onPointerMove={(event) => {
            const gesture = drag.current;
            if (gesture?.id === event.pointerId) {
              const dx = event.clientX - gesture.x;
              const dy = event.clientY - gesture.y;
              if (!gesture.moved && Math.hypot(dx, dy) < 5) return;
              gesture.moved = true;
              gesture.x = event.clientX;
              gesture.y = event.clientY;
              const scale = 180 / (event.currentTarget.clientWidth * camera.current.zoom);
              manualCenter.current = {
                lat: Math.max(-85, Math.min(85, camera.current.lat + dy * scale)),
                lng: camera.current.lng - dx * scale,
              };
              Object.assign(camera.current, manualCenter.current);
              setPaused(true);
              hoveredSlug.current = null;
              setHovered(null);
              event.currentTarget.style.cursor = "grabbing";
              redraw.current?.();
              return;
            }
            const rect = event.currentTarget.getBoundingClientRect();
            const pin = hitPins.current.find((pin) =>
              pin.hitWidth
                ? Math.abs(pin.x - (event.clientX - rect.left)) < pin.hitWidth &&
                  Math.abs(pin.y - (event.clientY - rect.top)) < 18
                : Math.hypot(
                    pin.x - (event.clientX - rect.left),
                    pin.y - (event.clientY - rect.top),
                  ) < 18,
            );
            event.currentTarget.style.cursor = pin ? "pointer" : "grab";
            event.currentTarget.removeAttribute("title");
            if (event.pointerType === "touch") return;
            if (hoveredSlug.current !== (pin?.slug ?? null)) {
              hoveredSlug.current = pin?.slug ?? null;
              setHovered(pin ? { ...pin, width: rect.width } : null);
              redraw.current?.();
            }
          }}
          onPointerLeave={() => {
            hoveredSlug.current = null;
            setHovered(null);
            redraw.current?.();
          }}
          onClick={(event) => {
            if (suppressClick.current) {
              suppressClick.current = false;
              return;
            }
            const rect = event.currentTarget.getBoundingClientRect();
            const pin = hitPins.current.find((pin) =>
              pin.hitWidth
                ? Math.abs(pin.x - (event.clientX - rect.left)) < pin.hitWidth &&
                  Math.abs(pin.y - (event.clientY - rect.top)) < 18
                : Math.hypot(
                    pin.x - (event.clientX - rect.left),
                    pin.y - (event.clientY - rect.top),
                  ) < 18,
            );
            if (pin?.slug.startsWith("country:")) {
              setZoomMultiplier(1);
              setSelection(pin.country!);
              onCountryChange?.(pin.country!);
            } else if (pin) {
              if (onSelectBranch) onSelectBranch(pin.slug);
              else router.push(`/locations/${pin.slug}`);
            }
          }}
        />
        {hovered ? (
          <div
            className="globe-hover"
            aria-hidden="true"
            style={{
              left: Math.max(12, Math.min(hovered.width - 240, hovered.x - 110)),
              top: Math.max(12, hovered.y - 126),
            }}
          >
            <span className="globe-hover__eyebrow">{hovered.country ?? "Kharis Church"}</span>
            <strong>{hovered.name}</strong>
            <span className="globe-hover__action">
              {hovered.slug.startsWith("country:") ? "Explore this country" : "Explore this branch"}{" "}
              <ArrowUpRight size={15} />
            </span>
          </div>
        ) : null}
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
    </section>
  );
}
export default BranchMap;
