"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Navigation, Loader2, ChevronDown, Plus, Minus, RotateCcw } from "lucide-react";
import type { BranchData } from "@/lib/branches";
import { branchDisplayName, sundayVenue, venueAddress } from "@/lib/branch-display";
import worldDots from "@/data/worldDots.json";
import countryOutlines from "@/data/countryOutlines.json";

const W = 1000;
const H = 500;

type ViewId = "world" | "uk" | "ghana" | "sierra-leone";

interface ViewConfig {
  id: ViewId;
  label: string;
  /** Camera centre and vertical span in degrees of latitude. */
  centerLat: number;
  centerLng: number;
  spanLat: number;
  /** Country outline keys drawn for context; the first entry is the focus country. */
  focus?: string[];
  context?: string[];
  blurb: string;
}

const VIEWS: ViewConfig[] = [
  {
    id: "world",
    label: "Whole world",
    centerLat: 18,
    centerLng: 0,
    spanLat: 150,
    blurb: "Every Kharis branch, one global family.",
  },
  {
    id: "uk",
    label: "United Kingdom",
    centerLat: 53.4,
    centerLng: -2.4,
    spanLat: 9.5,
    focus: ["uk"],
    context: ["ireland", "france", "belgium", "netherlands"],
    blurb: "Where most of our branches meet.",
  },
  {
    id: "ghana",
    label: "Ghana",
    centerLat: 7.9,
    centerLng: -1.1,
    spanLat: 7.6,
    focus: ["ghana"],
    context: ["ivory-coast", "togo", "burkina-faso", "benin"],
    blurb: "Our West African home in Accra, off the Nsawam Road.",
  },
  {
    id: "sierra-leone",
    label: "Sierra Leone",
    centerLat: 8.6,
    centerLng: -11.9,
    spanLat: 4.6,
    focus: ["sierra-leone"],
    context: ["guinea", "liberia"],
    blurb: "Kharis Freetown, gathering on Robert Street.",
  },
];

/** Equirectangular projection with latitude-corrected horizontal scale so countries keep their shape. */
function makeProjection(v: ViewConfig) {
  const s = H / v.spanLat; // px per degree latitude
  const k = v.id === "world" ? 1 : Math.cos((v.centerLat * Math.PI) / 180);
  const spanLng = W / s / k;
  return {
    project: (lat: number, lng: number) => ({
      x: W / 2 + (lng - v.centerLng) * k * s,
      y: H / 2 - (lat - v.centerLat) * s,
    }),
    bounds: {
      minLng: v.centerLng - spanLng / 2,
      maxLng: v.centerLng + spanLng / 2,
      minLat: v.centerLat - v.spanLat / 2,
      maxLat: v.centerLat + v.spanLat / 2,
    },
  };
}

function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Rail label box width for 14px bold text: names run from "Luton" to "KP2 Peterborough". */
const labelWidth = (name: string) => Math.round(22 + name.length * 8.6);

const OUTLINES = countryOutlines as unknown as Record<string, [number, number][][]>;

/** Countries we have branches in, outlined on the world map once it's zoomed in enough for the dots to thin out. */
const BRANCH_COUNTRIES = ["uk", "ghana", "sierra-leone"];

/** The zoomed window onto the map, in map units: scale k, top-left corner x/y. */
type Camera = { k: number; x: number; y: number };
const HOME: Camera = { k: 1, x: 0, y: 0 };

const clampCamera = ({ k, x, y }: Camera, maxK: number): Camera => {
  const kk = Math.min(Math.max(k, 1), maxK);
  const vw = W / kk;
  const vh = H / kk;
  return {
    k: kk,
    x: Math.min(Math.max(x, 0), W - vw),
    y: Math.min(Math.max(y, 0), H - vh),
  };
};

interface BranchMapProps {
  onSelectBranch?: (slug: string) => void;
  branches?: BranchData[];
  /** Just the map and its country picker, for pages that have their own heading and search. */
  bare?: boolean;
}

export function BranchMap({
  onSelectBranch,
  branches: branchesProp,
  bare = false,
}: BranchMapProps) {
  const router = useRouter();
  const [viewId, setViewId] = useState<ViewId>("world");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [nearestSlug, setNearestSlug] = useState<string | null>(null);
  const [nearestKm, setNearestKm] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [cam, setCam] = useState<Camera>(HOME);

  const view = VIEWS.find((v) => v.id === viewId)!;
  const isWorld = viewId === "world";
  // Country views go further in so the cluster around London can separate.
  const maxK = isWorld ? 10 : 12;
  const zoomed = cam.k > 1.01;

  const chooseView = (id: ViewId) => {
    setViewId(id);
    setCam(HOME);
  };

  const svgRef = useRef<SVGSVGElement>(null);

  // The map scales with its width, which shrank pins and labels to ~5px on a phone. `fit` grows them
  // back on narrow screens so they stay readable; at desktop widths it's 1.
  const [fit, setFit] = useState(1);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const ro = new ResizeObserver(([entry]) => {
      setFit(Math.max(1, (W / entry.contentRect.width) * 0.8));
    });
    ro.observe(svg);
    return () => ro.disconnect();
  }, []);

  /** Zoom by `factor`, keeping the map point (px, py) under the same spot on screen. */
  const zoomAt = (factor: number, px?: number, py?: number) =>
    setCam((c) => {
      const cx = px ?? c.x + W / c.k / 2;
      const cy = py ?? c.y + H / c.k / 2;
      const k = Math.min(Math.max(c.k * factor, 1), maxK);
      const ratio = c.k / k;
      return clampCamera({ k, x: cx - (cx - c.x) * ratio, y: cy - (cy - c.y) * ratio }, maxK);
    });

  const toMap = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return { x: W / 2, y: H / 2 };
    const pt = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    return { x: pt.x, y: pt.y };
  };

  // Ctrl/⌘ + wheel (and trackpad pinch, which arrives as ctrl + wheel) zooms; a plain wheel still scrolls the page.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const p = toMap(e.clientX, e.clientY);
      zoomAt(Math.exp(-e.deltaY * 0.01), p.x, p.y);
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  });

  // Drag to pan once zoomed; two fingers pinch. A drag never counts as a click on a pin.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef({ moved: false, startX: 0, startY: 0, pinch: 0 });

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    // A mouse released outside the map never sends pointerup here; don't let it linger as a second finger.
    if (e.pointerType === "mouse") pointers.current.clear();
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      gesture.current = { moved: false, startX: e.clientX, startY: e.clientY, pinch: 0 };
    }
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    if (e.pointerType === "mouse" && e.buttons === 0) {
      pointers.current.delete(e.pointerId);
      return;
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (g.pinch) {
        const mid = toMap((a.x + b.x) / 2, (a.y + b.y) / 2);
        zoomAt(dist / g.pinch, mid.x, mid.y);
      }
      g.pinch = dist;
      g.moved = true;
      return;
    }

    if (!g.moved && Math.hypot(e.clientX - g.startX, e.clientY - g.startY) < 5) return;
    if (!zoomed) return;
    if (!g.moved) {
      // Keep the drag going if the pointer leaves the map; a cancelled pointer can't be captured.
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    }
    g.moved = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const perPx = W / cam.k / rect.width;
    setCam((c) =>
      clampCamera(
        { ...c, x: c.x - (e.clientX - prev.x) * perPx, y: c.y - (e.clientY - prev.y) * perPx },
        maxK,
      ),
    );
  };

  const onPointerEnd = (e: React.PointerEvent<SVGSVGElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) gesture.current.pinch = 0;
  };
  const { project, bounds } = useMemo(() => makeProjection(view), [view]);

  const source = useMemo(() => branchesProp ?? [], [branchesProp]);

  const branches = useMemo(
    () =>
      source
        .map((b) => {
          // Pin the place people go on a Sunday, not whichever venue was saved first.
          const venue = sundayVenue(b);

          if (!venue || venue.latitude == null || venue.longitude == null) {
            return null;
          }

          const lat = venue.latitude;
          const lng = venue.longitude;

          return {
            slug: b.slug,
            name: branchDisplayName(b.name),

            city: venue.city ?? b.name.replace(/^Kharis\s+/i, ""),

            region: venue.country ?? b.subtitle ?? "United Kingdom",

            address: venueAddress(venue),

            ...project(lat, lng),

            lat,
            lng,

            inView:
              lng >= bounds.minLng &&
              lng <= bounds.maxLng &&
              lat >= bounds.minLat &&
              lat <= bounds.maxLat,
          };
        })
        .filter((b): b is NonNullable<typeof b> => b !== null),
    [source, project, bounds],
  );

  const visible = branches.filter((b) => b.inView);

  const dots = useMemo(
    () =>
      isWorld
        ? (worldDots as [number, number][])
            .filter(
              ([lng, lat]) =>
                lng >= bounds.minLng &&
                lng <= bounds.maxLng &&
                lat >= bounds.minLat &&
                lat <= bounds.maxLat,
            )
            .map(([lng, lat]) => project(lat, lng))
        : [],
    [isWorld, bounds, project],
  );

  // Dots shrink a little as you zoom so the landmass stays a texture, not polka dots. Stepped so
  // the 17k circles only re-render every half step of zoom, not on every frame of a pinch.
  const dotStep = Math.round(cam.k * 2) / 2;
  const dotNodes = useMemo(() => {
    const r = 1.7 / Math.sqrt(dotStep);
    return dots.map((d, i) => (
      <circle key={i} cx={d.x} cy={d.y} r={r} fill="#472c6b" opacity={0.55} />
    ));
  }, [dots, dotStep]);

  /** Build SVG path strings for country outlines in the current view. */
  const paths = useMemo(() => {
    const toPath = (rings: [number, number][][]) =>
      rings
        .map(
          (ring) =>
            ring
              .map(([lng, lat], i) => {
                const p = project(lat, lng);
                return `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
              })
              .join(" ") + " Z",
        )
        .join(" ");
    return {
      branchCountries: isWorld
        ? BRANCH_COUNTRIES.map((k) => ({ key: k, d: toPath(OUTLINES[k] ?? []) }))
        : [],
      focus: (view.focus ?? []).map((k) => ({
        key: k,
        d: toPath(OUTLINES[k] ?? []),
      })),
      context: (view.context ?? []).map((k) => ({
        key: k,
        d: toPath(OUTLINES[k] ?? []),
      })),
    };
  }, [view, project, isWorld]);

  /**
   * Country views: every branch label sits on a left or right rail with a leader line,
   * so tight clusters (like the south-east) stay perfectly legible.
   */
  const callouts = useMemo(() => {
    // Rails are laid out for the whole country at desktop size; zoomed in, or on a phone where
    // their text would be tiny, pins get inline labels instead.
    if (isWorld || zoomed || fit > 1.3) return [];
    // Sparse views read better with inline labels than a rail.
    if (visible.length <= 2) return [];
    const build = (items: typeof visible, side: "left" | "right") => {
      const sorted = [...items].sort((a, b) => a.y - b.y);
      const gap = 34;
      const total = (sorted.length - 1) * gap;
      const mid = Math.min(Math.max(H / 2, 60 + total / 2), H - 60 - total / 2);
      return sorted.map((b, i) => ({
        ...b,
        side,
        slotY: mid - total / 2 + i * gap,
        railX: side === "left" ? 172 : W - 172,
      }));
    };
    // Balance the two rails so leader lines stay short.
    const byX = [...visible].sort((a, b) => a.x - b.x);
    const half = Math.ceil(byX.length / 2);
    const left = byX.slice(0, half);
    const right = byX.slice(half);
    return [...build(left, "left"), ...build(right, "right")];
  }, [isWorld, zoomed, fit, visible]);

  /** Inline labels: hovered and London first, then any pin with room around it at this zoom. */
  const labelled = useMemo(() => {
    if (callouts.length) return new Map<string, number>();
    const priority = (slug: string) =>
      slug === hovered || slug === nearestSlug ? 0 : slug === "london" ? 1 : 2;
    const ordered = [...visible].sort((a, b) => priority(a.slug) - priority(b.slug));
    // At rest the world map only names London; zoomed in, any pin whose label box is clear gets one.
    const atRest = isWorld && cam.k < 3;
    // Label boxes in on-screen map units: 13px bold text 10 units above the pin, with a little air.
    const box = (b: (typeof visible)[number]) => {
      const w = (b.name.length * 7.6 + 12) * fit;
      return { x: b.x * cam.k - w / 2, y: b.y * cam.k - 28 * fit, w, h: 24 * fit };
    };
    const placed: ReturnType<typeof box>[] = [];
    // slug -> sideways nudge in label units, so a label at the edge of the map isn't cut off.
    const out = new Map<string, number>();
    const left = cam.x * cam.k + 4;
    const right = left + W - 8;
    for (const b of ordered) {
      const r = box(b);
      const shift = Math.min(Math.max(0, left - r.x), right - (r.x + r.w));
      r.x += shift;
      const free = placed.every(
        (q) => r.x + r.w < q.x || q.x + q.w < r.x || r.y + r.h < q.y || q.y + q.h < r.y,
      );
      const forced = priority(b.slug) === 0 || (priority(b.slug) === 1 && atRest);
      if (forced || (!atRest && free)) {
        out.set(b.slug, shift / fit);
        placed.push(r);
      }
    }
    return out;
  }, [callouts.length, visible, hovered, nearestSlug, isWorld, cam.k, cam.x, fit]);

  const go = (slug: string) => {
    if (gesture.current.moved) return;
    if (onSelectBranch) onSelectBranch(slug);
    else router.push(`/locations/${slug}`);
  };

  const locateMe = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let best: { slug: string; km: number; region: string } | null = null;
        for (const b of branches) {
          const km = haversineKm(latitude, longitude, b.lat, b.lng);
          if (!best || km < best.km) best = { slug: b.slug, km, region: b.region };
        }
        if (best) {
          setNearestSlug(best.slug);
          setNearestKm(best.km);
          // Jump the camera to whichever country holds the nearest branch.
          if (best.slug === "accra") chooseView("ghana");
          else if (best.slug === "freetown") chooseView("sierra-leone");
          else if (best.region === "United Kingdom") chooseView("uk");
          else chooseView("world");
        }
        setLocating(false);
      },
      () => {
        setGeoError("Location access was denied, browse the map or search below instead.");
        setLocating(false);
      },
      { timeout: 10000 },
    );
  };

  const hoveredBranch = branches.find((b) => b.slug === hovered);
  const nearestBranch = branches.find((b) => b.slug === nearestSlug);

  return (
    <section
      className={bare ? "branch-map branch-map--bare" : "branch-map relative px-5 md:px-8 pb-20"}
    >
      <div className="max-w-[1536px] mx-auto">
        <div className="branch-map__frame relative overflow-hidden">
          <div
            className={`relative z-20 flex flex-col md:flex-row md:items-end gap-4 px-6 md:px-10 pt-8 pb-2 ${
              bare ? "md:justify-end" : "justify-between"
            }`}
          >
            <div className={bare ? "sr-only" : undefined}>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#ffde59]">
                One Global Family
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white! tracking-tight">
                Find a Kharis Branch
              </h2>
              <p className="text-sm text-white/60 font-medium mt-1">{view.blurb}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
              {/* Country picker */}
              <div className="relative">
                <button
                  onClick={() => setPickerOpen((o) => !o)}
                  className="inline-flex items-center gap-2 border border-white/25 bg-white/5 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-haspopup="listbox"
                  aria-expanded={pickerOpen}
                >
                  <span>{view.label}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${pickerOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {pickerOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setPickerOpen(false)} />
                    <ul
                      role="listbox"
                      className="absolute z-30 mt-2 right-0 w-60 border border-white/15 bg-[#110b1a] p-2 shadow-2xl"
                    >
                      {VIEWS.map((v) => {
                        const count = source.filter((b) => {
                          const p = makeProjection(v).bounds;
                          const venue = sundayVenue(b);

                          if (venue?.longitude == null || venue?.latitude == null) {
                            return false;
                          }

                          return (
                            venue.longitude >= p.minLng &&
                            venue.longitude <= p.maxLng &&
                            venue.latitude >= p.minLat &&
                            venue.latitude <= p.maxLat
                          );
                        }).length;
                        return (
                          <li key={v.id}>
                            <button
                              role="option"
                              aria-selected={v.id === viewId}
                              onClick={() => {
                                chooseView(v.id);
                                setPickerOpen(false);
                              }}
                              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                                v.id === viewId
                                  ? "bg-[#ffde59] text-[#110b1a]"
                                  : "text-white/80 hover:bg-white/10"
                              }`}
                            >
                              <span>{v.label}</span>
                              <span
                                className={v.id === viewId ? "text-[#110b1a]/70" : "text-white/40"}
                              >
                                {count} {count === 1 ? "branch" : "branches"}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>

              {bare ? null : (
                <button
                  onClick={locateMe}
                  disabled={locating}
                  className="inline-flex items-center gap-2 bg-[#ffde59] px-5 py-2.5 text-xs font-extrabold text-[#110b1a] hover:bg-[#ffe678] transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {locating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4" />
                  )}
                  {locating ? "Locating…" : "Find my nearest branch"}
                </button>
              )}
            </div>
          </div>

          {(geoError || nearestBranch) && (
            <div className="relative z-10 mx-6 md:mx-10 mt-3">
              {geoError ? (
                <p className="text-xs font-semibold text-[#ffe678] bg-[#ffde59]/10 border border-[#ffde59]/25 px-4 py-2.5">
                  {geoError}
                </p>
              ) : nearestBranch ? (
                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#630ed4]/25 border border-[#ffde59]/30 px-4 py-3">
                  <p className="text-sm font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#ffde59]" />
                    Your nearest branch is{" "}
                    <span className="text-[#ffde59]">{nearestBranch.name}</span>
                    {nearestKm !== null && (
                      <span className="text-white/60 font-semibold">
                        · about {Math.round(nearestKm).toLocaleString()} km away
                      </span>
                    )}
                  </p>
                  <button
                    onClick={() => go(nearestBranch.slug)}
                    className="text-xs font-extrabold text-[#ffde59] hover:text-white transition-colors cursor-pointer"
                  >
                    Visit branch →
                  </button>
                </div>
              ) : null}
            </div>
          )}

          <div className="relative z-10 px-2 md:px-6 pb-4">
            <svg
              ref={svgRef}
              viewBox={`${cam.x} ${cam.y} ${W / cam.k} ${H / cam.k}`}
              className="w-full h-auto select-none"
              style={{
                touchAction: zoomed ? "none" : "pan-y",
                cursor: zoomed ? "grab" : undefined,
              }}
              role="img"
              aria-label={`Map of Kharis Church branches, ${view.label}`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerEnd}
              onPointerCancel={onPointerEnd}
              onDoubleClick={(e) => {
                const p = toMap(e.clientX, e.clientY);
                zoomAt(2, p.x, p.y);
              }}
            >
              {/* graticule for orientation in country views */}
              {!isWorld && (
                <g opacity={0.14}>
                  {Array.from({ length: 11 }).map((_, i) => (
                    <line
                      key={`h${i}`}
                      x1={0}
                      x2={W}
                      y1={(i * H) / 10}
                      y2={(i * H) / 10}
                      stroke="#ffde59"
                      strokeWidth={0.4}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                  {Array.from({ length: 21 }).map((_, i) => (
                    <line
                      key={`v${i}`}
                      y1={0}
                      y2={H}
                      x1={(i * W) / 20}
                      x2={(i * W) / 20}
                      stroke="#ffde59"
                      strokeWidth={0.4}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </g>
              )}

              {/* world view, zoomed in: the countries we're in, under the dots */}
              {cam.k >= 2.5
                ? paths.branchCountries.map((p) => (
                    <path
                      key={p.key}
                      d={p.d}
                      fill="#2a1060"
                      fillOpacity={0.55}
                      stroke="#ffde59"
                      strokeOpacity={0.5}
                      strokeWidth={1}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))
                : null}

              {/* world view: dotted landmass */}
              {dotNodes}

              {/* neighbouring countries for context */}
              {paths.context.map((p) => (
                <path
                  key={p.key}
                  d={p.d}
                  fill="#1a0d2a"
                  stroke="#2f1a4b"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              ))}

              {/* focus country */}
              {paths.focus.map((p) => (
                <path
                  key={p.key}
                  d={p.d}
                  fill="#2a1060"
                  stroke="#ffde59"
                  strokeWidth={1.4}
                  strokeOpacity={0.7}
                  vectorEffect="non-scaling-stroke"
                />
              ))}

              {/* branch markers */}
              {visible.map((b) => {
                const active = hovered === b.slug || nearestSlug === b.slug;
                const hitR = isWorld ? 14 : 24;
                const pulse = isWorld ? (active ? 9 : 5) : active ? 15 : 9;
                const r = isWorld ? (active ? 5 : 3.4) : active ? 8 : 5.6;
                return (
                  <g
                    key={b.slug}
                    transform={`translate(${b.x} ${b.y}) scale(${fit / cam.k})`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHovered(b.slug)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => go(b.slug)}
                  >
                    <circle r={hitR} fill="transparent" />
                    {active ? <circle r={pulse} fill="#ffde59" opacity={0.25} /> : null}
                    <circle
                      r={r}
                      fill={active ? "#ffffff" : "#ffde59"}
                      stroke="#0b0612"
                      strokeWidth={1.4}
                      style={{ transition: "r 0.2s" }}
                    />
                  </g>
                );
              })}

              {/* pin labels, drawn after every pin so a neighbouring pin never covers one */}
              {visible
                .filter((b) => labelled.has(b.slug))
                .map((b) => (
                  <text
                    key={`label-${b.slug}`}
                    transform={`translate(${b.x} ${b.y}) scale(${fit / cam.k})`}
                    x={labelled.get(b.slug)}
                    y={-10}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={13}
                    fontWeight={800}
                    style={{ pointerEvents: "none", paintOrder: "stroke" }}
                    stroke="#0b0612"
                    strokeWidth={3.5}
                  >
                    {b.name}
                  </text>
                ))}

              {/* Country views: label rails with leader lines, one per side */}
              {callouts.map((b) => {
                const active = hovered === b.slug || nearestSlug === b.slug;
                const isLeft = b.side === "left";
                const anchorX = b.railX - 16;
                return (
                  <g
                    key={`callout-${b.slug}`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHovered(b.slug)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => go(b.slug)}
                  >
                    <path
                      d={`M ${b.x + (isLeft ? -7 : 7)} ${b.y - 2} L ${b.railX} ${b.slotY}`}
                      stroke="#ffde59"
                      strokeOpacity={active ? 0.9 : 0.3}
                      strokeWidth={active ? 1.8 : 1}
                      fill="none"
                    />
                    <circle cx={b.railX} cy={b.slotY} r={2.6} fill="#ffde59" />
                    <rect
                      x={isLeft ? b.railX - 6 - labelWidth(b.name) : b.railX + 6}
                      y={b.slotY - 13}
                      width={labelWidth(b.name)}
                      height={26}
                      rx={0}
                      fill={active ? "#ffde59" : "#110b1a"}
                      fillOpacity={active ? 1 : 0.72}
                      stroke={active ? "#ffde59" : "#ffde59"}
                      strokeOpacity={active ? 1 : 0.2}
                    />
                    <text
                      x={isLeft ? anchorX : b.railX + 16}
                      y={b.slotY + 5}
                      textAnchor={isLeft ? "end" : "start"}
                      fill={active ? "#110b1a" : "#ffffff"}
                      fontSize={14}
                      fontWeight={800}
                    >
                      {b.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="branch-map__zoom" role="group" aria-label="Map zoom">
              <button
                type="button"
                onClick={() => zoomAt(1.6)}
                disabled={cam.k >= maxK}
                aria-label="Zoom in"
              >
                <Plus aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => zoomAt(1 / 1.6)}
                disabled={!zoomed}
                aria-label="Zoom out"
              >
                <Minus aria-hidden />
              </button>
              {zoomed ? (
                <button type="button" onClick={() => setCam(HOME)} aria-label="Reset zoom">
                  <RotateCcw aria-hidden />
                </button>
              ) : null}
            </div>

            {hoveredBranch && (
              <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-10 bg-[#110b1a] border border-white/15 px-5 py-4 shadow-2xl min-w-[220px]">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#ffde59]">
                  {hoveredBranch.region}
                </p>
                <p className="text-lg font-extrabold text-white leading-tight">
                  {hoveredBranch.name}
                </p>
                <p className="text-xs font-medium text-white/60 mt-0.5">{hoveredBranch.address}</p>
                <p className="text-[11px] font-bold text-[#ffde59] mt-2">Open the branch page →</p>
              </div>
            )}
          </div>

          {/* legend */}
          <div className="relative z-10 flex flex-wrap items-center gap-5 px-6 md:px-10 pb-6 text-[11px] font-semibold text-white/50">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ffde59]" /> Kharis branch
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#402a5c]" /> {branches.length} worldwide
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BranchMap;
