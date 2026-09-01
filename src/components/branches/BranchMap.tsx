"use client";
import React, { useMemo, useState } from 'react';
import { useRouter } from "next/navigation";
import { MapPin, Navigation, Loader2, Globe2, ChevronDown } from 'lucide-react';
import { BRANCHES_DATA, type BranchData } from '@/data/branchesData';
import worldDots from '@/data/worldDots.json';
import countryOutlines from '@/data/countryOutlines.json';

const W = 1000;
const H = 500;

type ViewId = 'world' | 'uk' | 'ghana' | 'sierra-leone';

interface ViewConfig {
  id: ViewId;
  label: string;
  flag: string;
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
    id: 'uk',
    label: 'United Kingdom',
    flag: '🇬🇧',
    centerLat: 52.6,
    centerLng: -1.9,
    spanLat: 7.2,
    focus: ['uk'],
    context: ['ireland', 'france', 'belgium', 'netherlands'],
    blurb: 'Thirteen branches across England, from Brighton up to Nottingham.',
  },
  {
    id: 'ghana',
    label: 'Ghana',
    flag: '🇬🇭',
    centerLat: 7.9,
    centerLng: -1.1,
    spanLat: 7.6,
    focus: ['ghana'],
    context: ['ivory-coast', 'togo', 'burkina-faso', 'benin'],
    blurb: 'Our West African home in Accra, off the Nsawam Road.',
  },
  {
    id: 'sierra-leone',
    label: 'Sierra Leone',
    flag: '🇸🇱',
    centerLat: 8.6,
    centerLng: -11.9,
    spanLat: 4.6,
    focus: ['sierra-leone'],
    context: ['guinea', 'liberia'],
    blurb: 'Kharis Freetown, gathering on Robert Street.',
  },
  {
    id: 'world',
    label: 'Whole world',
    flag: '🌍',
    centerLat: 18,
    centerLng: 0,
    spanLat: 150,
    blurb: 'Every Kharis branch, one global family.',
  },
];

/** Equirectangular projection with latitude-corrected horizontal scale so countries keep their shape. */
function makeProjection(v: ViewConfig) {
  const s = H / v.spanLat; // px per degree latitude
  const k = v.id === 'world' ? 1 : Math.cos((v.centerLat * Math.PI) / 180);
  const spanLng = (W / s) / k;
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

const OUTLINES = countryOutlines as unknown as Record<string, [number, number][][]>;

interface BranchMapProps {
  onSelectBranch?: (slug: string) => void;
  /** Live branch list; falls back to the bundled static data. */
  branches?: BranchData[];
}

export function BranchMap({ onSelectBranch, branches: branchesProp }: BranchMapProps) {
  const router = useRouter();
  const [viewId, setViewId] = useState<ViewId>('uk');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [nearestSlug, setNearestSlug] = useState<string | null>(null);
  const [nearestKm, setNearestKm] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const view = VIEWS.find((v) => v.id === viewId)!;
  const isWorld = viewId === 'world';
  const { project, bounds } = useMemo(() => makeProjection(view), [view]);

  const source = useMemo(
    () => (branchesProp?.length ? branchesProp : Object.values(BRANCHES_DATA)),
    [branchesProp],
  );

  const branches = useMemo(
    () =>
      source.map((b) => ({
        slug: b.slug,
        name: b.name,
        city: b.name.replace(/^Kharis\s+/, "") || b.city,
        region: b.region,
        address: b.address,
        ...project(b.mapCoordinates.lat, b.mapCoordinates.lng),
        lat: b.mapCoordinates.lat,
        lng: b.mapCoordinates.lng,
        inView:
          b.mapCoordinates.lng >= bounds.minLng &&
          b.mapCoordinates.lng <= bounds.maxLng &&
          b.mapCoordinates.lat >= bounds.minLat &&
          b.mapCoordinates.lat <= bounds.maxLat,
      })),
    [source, project, bounds]
  );

  const visible = branches.filter((b) => b.inView);

  const dots = useMemo(
    () =>
      isWorld
        ? (worldDots as [number, number][])
            .filter(
              ([lng, lat]) =>
                lng >= bounds.minLng && lng <= bounds.maxLng && lat >= bounds.minLat && lat <= bounds.maxLat
            )
            .map(([lng, lat]) => project(lat, lng))
        : [],
    [isWorld, bounds, project]
  );

  /** Build SVG path strings for country outlines in the current view. */
  const paths = useMemo(() => {
    const toPath = (rings: [number, number][][]) =>
      rings
        .map(
          (ring) =>
            ring
              .map(([lng, lat], i) => {
                const p = project(lat, lng);
                return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
              })
              .join(' ') + ' Z'
        )
        .join(' ');
    return {
      focus: (view.focus ?? []).map((k) => ({ key: k, d: toPath(OUTLINES[k] ?? []) })),
      context: (view.context ?? []).map((k) => ({ key: k, d: toPath(OUTLINES[k] ?? []) })),
    };
  }, [view, project]);

  /**
   * Country views: every branch label sits on a left or right rail with a leader line,
   * so tight clusters (like the south-east) stay perfectly legible.
   */
  const callouts = useMemo(() => {
    if (isWorld) return [];
    // Sparse views read better with inline labels than a rail.
    if (visible.length <= 2) return [];
    const build = (items: typeof visible, side: 'left' | 'right') => {
      const sorted = [...items].sort((a, b) => a.y - b.y);
      const gap = 34;
      const total = (sorted.length - 1) * gap;
      const mid = Math.min(Math.max(H / 2, 60 + total / 2), H - 60 - total / 2);
      return sorted.map((b, i) => ({
        ...b,
        side,
        slotY: mid - total / 2 + i * gap,
        railX: side === 'left' ? 128 : W - 128,
      }));
    };
    // Balance the two rails so leader lines stay short.
    const byX = [...visible].sort((a, b) => a.x - b.x);
    const half = Math.ceil(byX.length / 2);
    const left = byX.slice(0, half);
    const right = byX.slice(half);
    return [...build(left, 'left'), ...build(right, 'right')];
  }, [isWorld, visible]);


  const go = (slug: string) => {
    if (onSelectBranch) onSelectBranch(slug);
    else router.push(`/branches/${slug}`);
  };

  const locateMe = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
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
          if (best.slug === 'accra') setViewId('ghana');
          else if (best.slug === 'freetown') setViewId('sierra-leone');
          else setViewId('uk');
        }
        setLocating(false);
      },
      () => {
        setGeoError('Location access was denied, browse the map or search below instead.');
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const hoveredBranch = branches.find((b) => b.slug === hovered);
  const nearestBranch = branches.find((b) => b.slug === nearestSlug);

  return (
    <section className="relative px-5 md:px-8 pb-20 -mt-6">
      <div className="max-w-[1536px] mx-auto">
        <div className="relative rounded-[2rem] overflow-hidden border border-[#3a1030] bg-[#12060f] shadow-2xl shadow-[#800654]/20">
          <div className="absolute -top-32 -left-24 w-96 h-96 bg-[#800654]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-24 w-96 h-96 bg-[#d4920a]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-20 flex flex-col md:flex-row md:items-end justify-between gap-4 px-6 md:px-10 pt-8 pb-2">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#e8a33d]">
                One Global Family
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Find a Kharis Branch
              </h2>
              <p className="text-sm text-white/60 font-medium mt-1">{view.blurb}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
              {/* Country picker */}
              <div className="relative">
                <button
                  onClick={() => setPickerOpen((o) => !o)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-haspopup="listbox"
                  aria-expanded={pickerOpen}
                >
                  <Globe2 className="w-4 h-4 text-[#e8a33d]" />
                  <span>
                    {view.flag} {view.label}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${pickerOpen ? 'rotate-180' : ''}`} />
                </button>

                {pickerOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setPickerOpen(false)} />
                    <ul
                      role="listbox"
                      className="absolute z-30 mt-2 right-0 w-60 rounded-2xl border border-[#e8a33d]/25 bg-[#1a0b16]/98 backdrop-blur-md p-2 shadow-2xl"
                    >
                      {VIEWS.map((v) => {
                        const count = source.filter((b) => {
                          const p = makeProjection(v).bounds;
                          return (
                            b.mapCoordinates.lng >= p.minLng &&
                            b.mapCoordinates.lng <= p.maxLng &&
                            b.mapCoordinates.lat >= p.minLat &&
                            b.mapCoordinates.lat <= p.maxLat
                          );
                        }).length;
                        return (
                          <li key={v.id}>
                            <button
                              role="option"
                              aria-selected={v.id === viewId}
                              onClick={() => {
                                setViewId(v.id);
                                setPickerOpen(false);
                              }}
                              className={`w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                                v.id === viewId
                                  ? 'bg-[#e8a33d] text-[#1a0b16]'
                                  : 'text-white/80 hover:bg-white/10'
                              }`}
                            >
                              <span>
                                {v.flag} {v.label}
                              </span>
                              <span className={v.id === viewId ? 'text-[#1a0b16]/70' : 'text-white/40'}>
                                {count} {count === 1 ? 'branch' : 'branches'}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>

              <button
                onClick={locateMe}
                disabled={locating}
                className="inline-flex items-center gap-2 rounded-full bg-[#e8a33d] px-5 py-2.5 text-xs font-extrabold text-[#1a0b16] shadow-lg shadow-[#e8a33d]/25 hover:bg-[#f2b254] transition-colors disabled:opacity-60 cursor-pointer"
              >
                {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                {locating ? 'Locating…' : 'Find My Nearest Branch'}
              </button>
            </div>
          </div>

          {(geoError || nearestBranch) && (
            <div className="relative z-10 mx-6 md:mx-10 mt-3">
              {geoError ? (
                <p className="text-xs font-semibold text-[#f2b254] bg-[#e8a33d]/10 border border-[#e8a33d]/25 rounded-xl px-4 py-2.5">
                  {geoError}
                </p>
              ) : nearestBranch ? (
                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#800654]/25 border border-[#e8a33d]/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#e8a33d]" />
                    Your nearest branch is <span className="text-[#e8a33d]">{nearestBranch.name}</span>
                    {nearestKm !== null && (
                      <span className="text-white/60 font-semibold">
                        · about {Math.round(nearestKm).toLocaleString()} km away
                      </span>
                    )}
                  </p>
                  <button
                    onClick={() => go(nearestBranch.slug)}
                    className="text-xs font-extrabold text-[#e8a33d] hover:text-white transition-colors cursor-pointer"
                  >
                    Visit branch →
                  </button>
                </div>
              ) : null}
            </div>
          )}

          <div className="relative z-10 px-2 md:px-6 pb-4">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full h-auto select-none"
              role="img"
              aria-label={`Map of Kharis Church branches, ${view.label}`}
            >
              <defs>
                <linearGradient id="focusFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8c1a63" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#4a0b34" stopOpacity="0.45" />
                </linearGradient>
                <filter id="landGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* graticule for orientation in country views */}
              {!isWorld && (
                <g opacity={0.14}>
                  {Array.from({ length: 11 }).map((_, i) => (
                    <line key={`h${i}`} x1={0} x2={W} y1={(i * H) / 10} y2={(i * H) / 10} stroke="#e8a33d" strokeWidth={0.4} />
                  ))}
                  {Array.from({ length: 21 }).map((_, i) => (
                    <line key={`v${i}`} y1={0} y2={H} x1={(i * W) / 20} x2={(i * W) / 20} stroke="#e8a33d" strokeWidth={0.4} />
                  ))}
                </g>
              )}

              {/* world view: dotted landmass */}
              {dots.map((d, i) => (
                <circle key={i} cx={d.x} cy={d.y} r={1.7} fill="#6b2c55" opacity={0.55} />
              ))}

              {/* neighbouring countries for context */}
              {paths.context.map((p) => (
                <path key={p.key} d={p.d} fill="#2a0d22" stroke="#4b1a3c" strokeWidth={1} />
              ))}

              {/* focus country */}
              {paths.focus.map((p) => (
                <path
                  key={p.key}
                  d={p.d}
                  fill="url(#focusFill)"
                  stroke="#e8a33d"
                  strokeWidth={1.6}
                  strokeOpacity={0.8}
                  filter="url(#landGlow)"
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
                    transform={`translate(${b.x} ${b.y})`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHovered(b.slug)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => go(b.slug)}
                  >
                    <circle r={hitR} fill="transparent" />
                    <circle r={pulse} fill="#e8a33d" opacity={0.25}>
                      <animate
                        attributeName="r"
                        values={`${pulse};${pulse * 2};${pulse}`}
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                      <animate attributeName="opacity" values="0.35;0;0.35" dur="2.4s" repeatCount="indefinite" />
                    </circle>
                    <circle
                      r={r}
                      fill={active ? '#ffffff' : '#f2b254'}
                      stroke="#12060f"
                      strokeWidth={1.4}
                      style={{ transition: 'r 0.2s' }}
                    />
                    {(isWorld ? active || b.slug === 'london' : callouts.length === 0) && (
                      <text
                        y={-10}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={13}
                        fontWeight={800}
                        style={{ pointerEvents: 'none', paintOrder: 'stroke' }}
                        stroke="#12060f"
                        strokeWidth={3.5}
                      >
                        {b.city}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Country views: label rails with leader lines, one per side */}
              {callouts.map((b) => {
                const active = hovered === b.slug || nearestSlug === b.slug;
                const isLeft = b.side === 'left';
                const anchorX = b.railX + (isLeft ? -6 : 6);
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
                      stroke="#e8a33d"
                      strokeOpacity={active ? 0.9 : 0.3}
                      strokeWidth={active ? 1.8 : 1}
                      fill="none"
                    />
                    <circle cx={b.railX} cy={b.slotY} r={2.6} fill="#e8a33d" />
                    <rect
                      x={isLeft ? 0 : b.railX + 6}
                      y={b.slotY - 13}
                      width={122}
                      height={26}
                      rx={13}
                      fill={active ? '#e8a33d' : '#1a0b16'}
                      fillOpacity={active ? 1 : 0.72}
                      stroke={active ? '#e8a33d' : '#e8a33d'}
                      strokeOpacity={active ? 1 : 0.2}
                    />
                    <text
                      x={isLeft ? anchorX : b.railX + 16}
                      y={b.slotY + 5}
                      textAnchor={isLeft ? 'end' : 'start'}
                      fill={active ? '#1a0b16' : '#ffffff'}
                      fontSize={14}
                      fontWeight={800}
                    >
                      {b.city}
                    </text>
                  </g>
                );
              })}

            </svg>

            {hoveredBranch && (
              <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-10 bg-[#1a0b16]/95 backdrop-blur-md border border-[#e8a33d]/30 rounded-2xl px-5 py-4 shadow-2xl min-w-[220px]">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#e8a33d]">
                  {hoveredBranch.region}
                </p>
                <p className="text-lg font-extrabold text-white leading-tight">{hoveredBranch.name}</p>
                <p className="text-xs font-medium text-white/60 mt-0.5">{hoveredBranch.address}</p>
                <p className="text-[11px] font-bold text-[#e8a33d] mt-2">Click to explore branch →</p>
              </div>
            )}
          </div>

          {/* legend */}
          <div className="relative z-10 flex flex-wrap items-center gap-5 px-6 md:px-10 pb-6 text-[11px] font-semibold text-white/50">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f2b254]" /> Kharis branch
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#5c2a4d]" /> {visible.length} in {view.label}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#5c2a4d]" /> {branches.length} worldwide
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BranchMap;
