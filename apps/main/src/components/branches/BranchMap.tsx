"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSmoothRouter } from "@/lib/use-smooth-router";
import { Plus, Minus, RotateCcw, ChevronDown, Check, ArrowUpRight } from "lucide-react";
import { interpolateGlobeCamera } from "@/lib/globe-camera";
import Image from "@/components/SiteImage";
import { createEarthRenderer } from "@/lib/earth-renderer";
import {
  globeCallouts,
  globeCardPosition,
  globeGeometry,
  projectGlobePoint,
} from "@/lib/globe-layout";
import countryOutlines from "@/data/countryOutlines.json";
import "./globe.css";

const destinations = [
  { id: "world", label: "Whole world", lat: 30, lng: -4, zoom: 1.05 },
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
  photo?: string;
  city?: string | null;
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
  const camera = useRef({ lat: 30, lng: -4, zoom: 1.05 });
  const pins = useMemo(() => branches, [branches]);
  const callouts = useMemo(
    () => globeCallouts(branches, destination.id),
    [branches, destination.id],
  );
  const earthRef = useRef<HTMLCanvasElement>(null);
  const earthRenderer = useRef<ReturnType<typeof createEarthRenderer>>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const beamRefs = useRef<(SVGPathElement | null)[]>([]);
  const lineRefs = useRef<(SVGPathElement | null)[]>([]);
  useEffect(() => {
    if (!earthRef.current) return;
    const renderer = createEarthRenderer(
      earthRef.current,
      "https://images.kharis.org/site-images/main/56fb0dba60f8e277/globe/earth-blue-marble.webp",
      () => redraw.current?.(),
    );
    earthRenderer.current = renderer;
    return () => {
      renderer?.dispose();
      earthRenderer.current = null;
    };
  }, []);

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
      const radius = globeGeometry(width, height, c.zoom).radius;
      return {
        x: width / 2 + (x * Math.cos(longitude) - z * Math.sin(longitude)) * radius,
        y: height * 0.48 - (y * Math.cos(latitude) - depth * Math.sin(latitude)) * radius,
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
      const radius = globeGeometry(width, height, c.zoom).radius;
      const textured = earthRenderer.current?.draw(
        {
          ...c,
          ...globeGeometry(width, height, c.zoom),
        },
        width,
        height,
      );
      if (!textured) {
        const ocean = ctx.createRadialGradient(
          width * 0.4,
          height * 0.35,
          0,
          width / 2,
          height * 0.48,
          radius,
        );
        ocean.addColorStop(0, "#22425d");
        ocean.addColorStop(1, "#060b17");
        ctx.fillStyle = ocean;
        ctx.beginPath();
        ctx.arc(width / 2, height * 0.48, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#9cb5c9";
        ctx.beginPath();
        for (const dot of land) {
          const p = project(dot.x, dot.y, dot.z);
          if (p.depth <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) continue;
          const size = Math.min(2.4, 0.8 * Math.sqrt(c.zoom));
          ctx.moveTo(p.x + size, p.y);
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        }
        ctx.fill();
      }
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
        const p = projectGlobePoint(pin, c, width, height);
        if (p.depth <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) continue;
        hitPins.current.push({ ...p, slug: pin.slug, name: pin.name, country: pin.country });
        ctx.fillStyle = "#ffdf8d";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
      callouts.forEach((branch, index) => {
        const p = projectGlobePoint(branch, c, width, height);
        const front = p.depth > 0.05 && p.x > 0 && p.x < width && p.y > 0 && p.y < height;
        const card = cardRefs.current[index];
        const beam = beamRefs.current[index];
        const line = lineRefs.current[index];
        if (card) {
          card.dataset.visible = String(front);
          if (width >= 760) {
            const position = globeCardPosition(index, callouts.length, width, height);
            card.style.setProperty("--card-x", `${position.x}px`);
            card.style.setProperty("--card-y", `${position.y}px`);
            card.style.setProperty("--card-width", `${position.width}px`);
            const { anchorX: x, anchorY: y } = position;
            beam?.setAttribute(
              "d",
              front ? `M${p.x},${p.y} L${x},${y - 20} L${x},${y + 20} Z` : "",
            );
            line?.setAttribute(
              "d",
              front ? `M${p.x},${p.y} Q${(p.x + x) / 2},${Math.min(p.y, y) - 24} ${x},${y}` : "",
            );
          }
        }
        if (!front) return;
        const highlighted = hoveredSlug.current === branch.slug;
        const halo = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, highlighted ? 30 : 23);
        halo.addColorStop(0, "#ffce69cc");
        halo.addColorStop(0.35, "#ffb24355");
        halo.addColorStop(1, "#ffb24300");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(p.x, p.y, highlighted ? 30 : 23, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffdf8d";
        ctx.lineWidth = highlighted ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, highlighted ? 10 : 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#fff4ce";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
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
  }, [cameraDestination, pins, callouts, paused, origin, land, zoomMultiplier]);

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
        <div className="location-globe__viewport">
          <canvas ref={earthRef} className="location-globe__earth" aria-hidden="true" />
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
            className="location-globe__markers"
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
                {hovered.slug.startsWith("country:")
                  ? "Explore this country"
                  : "Explore this branch"}{" "}
                <ArrowUpRight size={15} />
              </span>
            </div>
          ) : null}
          <svg className="globe-connections" width="100%" height="100%" aria-hidden="true">
            <defs>
              <linearGradient id="globe-beam" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#ffe2a0" stopOpacity="0.02" />
                <stop offset="1" stopColor="#ffe2a0" stopOpacity="0.24" />
              </linearGradient>
            </defs>
            {callouts.map((branch, index) => (
              <g key={branch.slug}>
                <path
                  ref={(node) => {
                    beamRefs.current[index] = node;
                  }}
                  fill="url(#globe-beam)"
                />
                <path
                  ref={(node) => {
                    lineRefs.current[index] = node;
                  }}
                  className="globe-connections__line"
                />
              </g>
            ))}
          </svg>
        </div>
        <div className="globe-callouts" aria-label="Explore our branches">
          {callouts.map((branch, index) => (
            <button
              type="button"
              key={branch.slug}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className="globe-card"
              aria-label={`Explore ${branch.name}`}
              onPointerEnter={() => {
                hoveredSlug.current = branch.slug;
                redraw.current?.();
              }}
              onPointerLeave={() => {
                hoveredSlug.current = null;
                redraw.current?.();
              }}
              onFocus={() => {
                hoveredSlug.current = branch.slug;
                redraw.current?.();
              }}
              onBlur={() => {
                hoveredSlug.current = null;
                redraw.current?.();
              }}
              onClick={() =>
                onSelectBranch
                  ? onSelectBranch(branch.slug)
                  : router.push(`/locations/${branch.slug}`)
              }
            >
              <span className="globe-card__photo">
                {branch.photo ? (
                  <Image
                    src={branch.photo}
                    alt=""
                    fill
                    sizes="(max-width: 759px) 240px, 224px"
                    className="object-cover"
                  />
                ) : (
                  <span className="globe-card__monogram" aria-hidden="true">
                    {branch.name.slice(0, 1)}
                  </span>
                )}
              </span>
              <span className="globe-card__copy">
                <strong>{branch.name}</strong>
                <span>
                  {branch.city || branch.country}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
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
                <span className="location-globe__word location-globe__word--intro">Welcome to</span>
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
      <details className="location-globe__credit">
        <summary>Image credits</summary>
        <p>
          Earth imagery:{" "}
          <a
            href="https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-map/"
            target="_blank"
            rel="noreferrer"
          >
            NASA Blue Marble
          </a>
          . Accra:{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Independence_Arch_-_Accra,_Ghana2.jpg"
            target="_blank"
            rel="noreferrer"
          >
            George Appiah
          </a>
          . Freetown:{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Freetown-aerialview.jpg"
            target="_blank"
            rel="noreferrer"
          >
            David Hond
          </a>
          . City images cropped and resized,{" "}
          <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">
            CC BY 2.0
          </a>
          .
        </p>
      </details>
    </section>
  );
}
export default BranchMap;
