"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import outlines from "@/data/family-outlines.json";
import "./petitpoint.css";

/* ------------------------------------------------------------------------ *
 * Embedded 240×96 world land mask (1.5° resolution) from Petitpoint        *
 * ------------------------------------------------------------------------ */
const WORLD_MASK =
  "AAAAAAAAAAA/+AB//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB////////8AAAAAAAcAAAAAAAAAAAAAAAAAAAAABf//3/////gAAD/AA9fAAAfgAAAAAAAAAAAAAAAOf/////////AAAf4AAAAAAAH8AAAAAAAAAAAAAAD+Qc/wf/////AAADMAAAAMABAfAAAAAAAAAAAAAAN//v/gMf///+AAAAAAAAP4Ah//8AA/4AAAAAAAAAfsBv/gAD///+AAAAAAAA8AAH//wAACAAAAAAAAAA//z+/8AB///4AAAAAAABwDv/////wHwAAAwAHgAAd/58//gB///8AAAADgADwP/////////8ABAB//8/8/+/P/8B///4AAAB/+AIHn//////////+/4H/////+8//P+A///AAAAD//5n///////////////n/////////D/g//wIYAAP///////////////////P////////+P/A//AP4AAf7+////////////////Bh////////vR+Af4AHwAB/3/////////////////AH///////+CvcAPwAAAQD/P/////////////////AH///////8AP4AHwAAABH/f//////////////z/gAA/QH////4Af7AAAAAAEH/n//////////////jwAAAPgB////+AP/gAAAAAeD+v////////////8APgAAA6AA/////wf/wAAAAAOB+P////////////wAPgAADAAAf////+f/8AAAAA/Bx/////////////wAfIAAIAAAX/////f/+AAAAB3n///////////////AOAQGAAAAB///////+AAAABnv///////////////AMAAAAAAAD///////+AAAAAM////////////////AQAAAAAAAA//////+ngAAAAH////////////////gAAAAAAAAAf//////PgAAAAD///////////////7BAAAAAAAAAf//////wAAAAAB/////7/////////yCAAAAAAAAAf/////7AAAAAAB/7/if3/////////jgAAAAAAAAAf/////gAAAAAA/x9/gHz/////////HgAAAAAAAAAf/////gAAAAAA/wvf//5////////4GAAAAAAAAAAf////+AAAAAAA/Bj9//5///////3wGAAAAAAAAAAf////8AAAAAAA/AOc//4///////xwOAAAAAAAAAAP////8AAAAAAA+/kM//////////84cAAAAAAAAAAH////8AAAAAAAP/wDG/////////w78AAAAAAAAAAD////wAAAAAAA//wAB/////////4vgAAAAAAAAAAA////gAAAAAAB//+eB/////////4EAAAAAAAAAAAA////AAAAAAAB//////////////4EAAAAAAAAAAAAf/7jAAAAAAAB//////3///////4AAAAAAAAAAAAAb/gBgAAAAAAH//////7///////4AAAAAAAAAAAAAN/gBwAAAAAAP////+/+P//////wAAAAAAAAAAAAAE/gAEAAAAAAP/////f+wP/////6AAAAAAAAAAAAACfgDgAAAAAAf/////f/8H/////oAAAAAAAAYAAAAAfgx4AAAAAA//////v/8D////8AAAAAAAAAGAAAAAfxwPgAAAAAf/////v/8A/8f+QAAAAAAAAACAAAAAP/wL8AAAAAf/////3/4A/4P+wIAAAAAAAAAAAAAAD/gAAAAAAAf/////z/gAfwH/AMAAAAAAAAAAAAAAA/8AAAAAAIf/////7+AAfAF/gMAAAAAAAAAAAAAAAD+AAAAAAA///////4AAfAB/gKAAAAAAAAAAAAAAAAeAgIAAAAf//////hAAPAB/gPAAAAAAAAAAAAAAAAOD4AAAAAf/////+cAAOARvgHAAAAAAAAAAAAAAAAGX/wAAAAP//////8AAHABCARAAAAAAAAAAAAAAAAD//4AAAAH//////8AAFgBgAngAAAAAAAAAAAAAAAAP/8AAAAD//////4AABgAwBjgAAAAAAAAAAAAAAAAP//gAAAB/H////4AAAAHYDwAAAAAAAAAAAAAAAAAP//wAAAAAB////wAAAAD4HgAAAAAAAAAAAAAAAAAf//4AAAAAA////gAAAAB8PgQAAAAAAAAAAAAAAAA///4AAAAAA////AAAAAA4/vQAAAAAAAAAAAAAABA////AAAAAA///+AAAAAA8/83gAAAAAAAAAAAAAAA////wAAAAA///8AAAAAA+fdLcCAAAAAAAAAAAAAA////+AAAAAf//4AAAAAAOLc7/hAAAAAAAAAAAAAA/////gAAAAP//4AAAAAAGAUBf3QAAAAAAAAAAAAA/////gAAAAP//4AAAAAAD+AVP4YAAAAAAAAAAAAAf////gAAAAH//4AAAAAAAf/gPaJAAAAAAAAAAAAAf////gAAAAH//4AAAAAAAAbACOAAAAAAAAAAAAAAP////AAAAAH//4AAAAAAAAAECACAAAAAAAAAAAAAH///+AAAAAP//4MAAAAAAAAHzAAAAAAAAAAAAAAAH///8AAAAAP//4MAAAAAAAB/jgAAAAAAAAAAAAAAD///8AAAAAP//48AAAAAAAB/zgAEAAAAIAAAAAAAA///8AAAAAP//x4AAAAAAAH//wACDAAAAAAAAAAAAf//8AAAAAP//h4AAAAAAAH//wAACAAAAAAAAAAAAf//8AAAAAP/+B4IAAAAAA///4AQAAAAAAAAAAAAAf//4AAAAAH//BwAAAAAAD///8AMAAAAAAAAAAAAAf//wAAAAAH//BwAAAAAAH///+AAAAAAAAAAAAAAAf/+AAAAAAH//BwAAAAAAH////AAAAAAAAAAAAAAAf/8AAAAAAD/8AAAAAAAAH////AAAAAAAAAAAAAAA//8AAAAAAD/8AAAAAAAAD////gAAAAAAAAAAAAAA//4AAAAAAB/8AAAAAAAAD////AAAAAAAAAAAAAAA//wAAAAAAB/4AAAAAAAAD////AAAAAAAAAAAAAAA//gAAAAAAA/wAAAAAAAAB/z//AAAAAAAAAAAAAAA//gAAAAAAA/AAAAAAAAAD+A/+AAAAAAAAAAAAAAB/9AAAAAAAAAAAAAAAAAABgAf+AAYAAAAAAAAAAAB/8AAAAAAAAAAAAAAAAAAAAAH8AAMAAAAAAAAAAAB/8AAAAAAAAAAAAAAAAAAAAAH4AAOAAAAAAAAAAAB/gAAAAAAAAAAAAAAAAAAAAAAIAAMAAAAAAAAAAAD/gAAAAAAAAAAAAAAAAAAAAAA4AA8AAAAAAAAAAAD/AAAAAAAAAAAAAAAAAAAAAAAYABwAAAAAAAAAAAD+AAAAAAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH8AAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAH4AAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAD4YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

const SRC_COLS = 240;
const SRC_ROWS = 96;
const WORLD_NORTH = 84;
const SRC_DEG = 1.5;
const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const RAD = Math.PI / 180;

type Ring = number[][];
type RGBA = [number, number, number, number];

/* ------------------------------------------------------------------------ *
 * Public Types                                                             *
 * ------------------------------------------------------------------------ */
export type PetitpointLocation = {
  id?: string;
  title: string;
  caption?: string;
  category?: string;
  latitude: number;
  longitude: number;
  value?: number;
  color?: string;
  imageURL?: string;
  imageAlt?: string;
  link?: string;
};

export type PetitpointRegion =
  | "fit"
  | "world"
  | "uk"
  | "england"
  | "northAmerica"
  | "southAmerica"
  | "europe"
  | "africa"
  | "middleEast"
  | "asia"
  | "oceania"
  | "custom";

export type PetitpointDetail = "fine" | "medium" | "chunky";
export type PetitpointShape = "square" | "soft" | "dot";
export type PetitpointPalette =
  "kp2" | "thermal" | "spectrum" | "aurora" | "ember" | "ice" | "accent";
export type PetitpointThemePreset =
  "system" | "kp2" | "midnight" | "graphite" | "deepsea" | "frost" | "paper" | "sand" | "custom";

export type PetitpointThemeTokens = {
  background: string;
  land: string;
  night: string;
  highlight: string;
  ocean: string;
  accent: string;
  panel: string;
  hairline: string;
  text: string;
  muted: string;
};

export type PetitpointProps = {
  locations?: PetitpointLocation[];
  data?: {
    source?: "list" | "csv" | "json";
    csv?: string;
    json?: string;
  };
  view?: {
    region?: PetitpointRegion;
    padding?: number;
    centerLongitude?: number;
    centerLatitude?: number;
    zoom?: number;
    animate?: boolean;
    detail?: PetitpointDetail;
    shape?: PetitpointShape;
    gap?: number;
    oceanGrid?: boolean;
  };
  layers?: {
    heatmap?: boolean;
    markers?: boolean;
    routes?: boolean;
    closeLoop?: boolean;
    routeSpeed?: number;
    daylight?: boolean;
  };
  heatmap?: {
    palette?: PetitpointPalette;
    spread?: number;
    strength?: number;
    breathe?: boolean;
    seaGlow?: boolean;
    legend?: boolean;
    lowLabel?: string;
    highLabel?: string;
  };
  markers?: {
    style?: "square" | "dot" | "diamond" | "ring";
    size?: number;
    colorBy?: "theme" | "accent" | "category" | "value";
    sizeByValue?: boolean;
    pulse?: boolean;
    labels?: "hover" | "always" | "none";
  };
  card?: {
    enabled?: boolean;
    width?: number;
    showImage?: boolean;
    showCoords?: boolean;
    meter?: boolean;
    meterLabel?: string;
    prefix?: string;
    suffix?: string;
    compact?: boolean;
    linkText?: string;
    newTab?: boolean;
  };
  tour?: {
    autoplay?: boolean;
    interval?: number;
  };
  theme?: Partial<PetitpointThemeTokens> & {
    preset?: PetitpointThemePreset;
    lightPreset?: Exclude<PetitpointThemePreset, "system" | "custom" | "kp2">;
    darkPreset?: Exclude<PetitpointThemePreset, "system" | "custom" | "kp2">;
  };
  ui?: {
    intro?: "sweep" | "bloom" | "rain" | "none";
    readout?: boolean;
    countLabel?: string;
    filters?: boolean;
    allLabel?: string;
    radius?: number;
    ariaLabel?: string;
  };
  userLocation?: {
    latitude: number;
    longitude: number;
    label?: string;
  } | null;
  controls?: boolean;
  onSelectLink?: (location: PetitpointLocation) => void;
  className?: string;
  style?: CSSProperties;
};

/* ------------------------------------------------------------------------ *
 * Internal Sheet & Spot Models                                             *
 * ------------------------------------------------------------------------ */
type Sheet = {
  key: string;
  cols: number;
  rows: number;
  west: number;
  north: number;
  degLon: number;
  degLat: number;
  wrap: boolean;
  land: Uint8Array;
  grain: Float32Array;
};

type Spot = {
  id: string;
  title: string;
  caption: string;
  lat: number;
  lon: number;
  raw: number;
  value: number;
  category: string;
  color: string;
  src: string;
  alt: string;
  link: string;
  source: PetitpointLocation;
};

type ViewBox = { w: number; e: number; s: number; n: number };

const DETAIL_STEP: Record<PetitpointDetail, number> = {
  fine: 1,
  medium: 2,
  chunky: 3,
};

let unpackedWorld: Uint8Array | null = null;
function sourceWorldMask(): Uint8Array {
  if (unpackedWorld) return unpackedWorld;
  const out = new Uint8Array(SRC_COLS * SRC_ROWS);
  let bit = 0;
  for (let i = 0; i < WORLD_MASK.length && bit < out.length; i++) {
    const v = B64.indexOf(WORLD_MASK[i]);
    if (v < 0) break;
    for (let k = 5; k >= 0 && bit < out.length; k--) {
      out[bit++] = (v >> k) & 1;
    }
  }
  unpackedWorld = out;
  return out;
}

const sheetCache = new Map<string, Sheet>();

function worldSheetFor(step: number): Sheet {
  const key = `world-${step}`;
  const hit = sheetCache.get(key);
  if (hit) return hit;

  const src = sourceWorldMask();
  const cols = Math.floor(SRC_COLS / step);
  const rows = Math.floor(SRC_ROWS / step);
  const need = step === 3 ? 3 : 1;
  const land = new Uint8Array(cols * rows);
  const grain = new Float32Array(cols * rows);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let n = 0;
      for (let y = 0; y < step; y++) {
        for (let x = 0; x < step; x++) {
          n += src[(r * step + y) * SRC_COLS + c * step + x];
        }
      }
      const i = r * cols + c;
      land[i] = n >= need ? 1 : 0;
      const g = Math.sin(i * 91.7 + 13.1) * 43758.5453;
      grain[i] = g - Math.floor(g);
    }
  }

  const deg = SRC_DEG * step;
  const made: Sheet = {
    key,
    cols,
    rows,
    west: -180,
    north: WORLD_NORTH,
    degLon: deg,
    degLat: deg,
    wrap: true,
    land,
    grain,
  };
  sheetCache.set(key, made);
  return made;
}

function pointInRing(x: number, y: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

const UK_RINGS = (outlines as { uk: Ring[] }).uk;

/** High-resolution cosine-corrected UK/England sheet rasterized onto the same Petitpoint grid. */
function ukSheetFor(detail: PetitpointDetail): Sheet {
  const key = `uk-${detail}`;
  const hit = sheetCache.get(key);
  if (hit) return hit;

  const degLat = detail === "fine" ? 0.135 : detail === "medium" ? 0.19 : 0.27;
  // Cosine aspect correction around 53°N so square canvas pixels preserve UK proportions
  const degLon = degLat / Math.cos(53 * RAD);
  const west = -11.8;
  const east = 6.2;
  const south = 48.8;
  const north = 60.8;
  const cols = Math.ceil((east - west) / degLon);
  const rows = Math.ceil((north - south) / degLat);
  const land = new Uint8Array(cols * rows);
  const grain = new Float32Array(cols * rows);

  for (let r = 0; r < rows; r++) {
    const lat = north - (r + 0.5) * degLat;
    for (let c = 0; c < cols; c++) {
      const lon = west + (c + 0.5) * degLon;
      const i = r * cols + c;
      land[i] = UK_RINGS.some((ring) => pointInRing(lon, lat, ring)) ? 1 : 0;
      const g = Math.sin(i * 91.7 + 13.1) * 43758.5453;
      grain[i] = g - Math.floor(g);
    }
  }

  const made: Sheet = {
    key,
    cols,
    rows,
    west,
    north,
    degLon,
    degLat,
    wrap: false,
    land,
    grain,
  };
  sheetCache.set(key, made);
  return made;
}

/* ------------------------------------------------------------------------ *
 * Maths & Colour Helpers                                                   *
 * ------------------------------------------------------------------------ */
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const wrapDeg = (lon: number) => ((((lon + 180) % 360) + 360) % 360) - 180;
const modi = (n: number, m: number) => ((n % m) + m) % m;
const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

function overshoot(x: number): number {
  const a = 1.6;
  const u = x - 1;
  return 1 + (a + 1) * u * u * u + a * u * u;
}

function readColor(input: string | undefined, fallback: RGBA): RGBA {
  if (!input) return fallback;
  let s = String(input).trim();
  const v = s.match(/^var\([^,]+,\s*(.+)\)$/);
  if (v) s = v[1].trim();
  if (s[0] === "#") {
    let h = s.slice(1);
    if (h.length === 3 || h.length === 4) {
      h = h
        .split("")
        .map((q) => q + q)
        .join("");
    }
    const n = parseInt(h.slice(0, 6), 16);
    if (Number.isNaN(n)) return fallback;
    const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, a];
  }
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const p = m[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map(parseFloat);
    return [p[0] || 0, p[1] || 0, p[2] || 0, p.length > 3 ? p[3] : 1];
  }
  if (s === "transparent") return [0, 0, 0, 0];
  return fallback;
}

function blend(a: RGBA, b: RGBA, t: number): RGBA {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
    a[3] + (b[3] - a[3]) * t,
  ];
}

const cssOf = (c: RGBA) =>
  `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${+c[3].toFixed(3)})`;

/* ------------------------------------------------------------------------ *
 * Theme Presets (Original + KP2 Light/Dark)                                *
 * ------------------------------------------------------------------------ */
const THEMES: Record<string, PetitpointThemeTokens> = {
  "kp2-dark": {
    background: "#110b1a",
    land: "#3f2766",
    night: "#23143d",
    highlight: "#ffde59",
    ocean: "#231639",
    accent: "#ffde59",
    panel: "rgba(21, 13, 36, 0.96)",
    hairline: "rgba(255, 222, 89, 0.28)",
    text: "#fffdf5",
    muted: "rgba(232, 222, 248, 0.72)",
  },
  "kp2-light": {
    background: "#f5f1ff",
    land: "#c4b0e8",
    night: "#9f84d4",
    highlight: "#4c08a8",
    ocean: "#e2d9f7",
    accent: "#630ed4",
    panel: "rgba(255, 253, 245, 0.98)",
    hairline: "rgba(21, 18, 24, 0.2)",
    text: "#151218",
    muted: "rgba(21, 18, 24, 0.68)",
  },
  midnight: {
    background: "#0A0B0D",
    land: "#4A5059",
    night: "#24272D",
    highlight: "#F2EEE6",
    ocean: "#1C1F24",
    accent: "#FF6A3D",
    panel: "rgba(19, 20, 24, 0.92)",
    hairline: "rgba(255, 255, 255, 0.09)",
    text: "#F2EEE6",
    muted: "rgba(242, 238, 230, 0.58)",
  },
  graphite: {
    background: "#17181B",
    land: "#5C616B",
    night: "#30333A",
    highlight: "#FFFFFF",
    ocean: "#25272C",
    accent: "#7C9CFF",
    panel: "rgba(31, 32, 37, 0.94)",
    hairline: "rgba(255, 255, 255, 0.1)",
    text: "#F4F5F7",
    muted: "rgba(244, 245, 247, 0.6)",
  },
  deepsea: {
    background: "#061624",
    land: "#2F5873",
    night: "#173246",
    highlight: "#E6F6FF",
    ocean: "#0F2639",
    accent: "#3FE0C5",
    panel: "rgba(8, 28, 44, 0.92)",
    hairline: "rgba(160, 220, 255, 0.12)",
    text: "#E6F6FF",
    muted: "rgba(230, 246, 255, 0.6)",
  },
  frost: {
    background: "#FFFFFF",
    land: "#D3D8DF",
    night: "#B7BFCA",
    highlight: "#0E1116",
    ocean: "#EDF0F4",
    accent: "#2F6BFF",
    panel: "rgba(255, 255, 255, 0.96)",
    hairline: "rgba(14, 17, 22, 0.1)",
    text: "#0E1116",
    muted: "rgba(14, 17, 22, 0.56)",
  },
  paper: {
    background: "#F4F1EA",
    land: "#C9C3B6",
    night: "#A9A396",
    highlight: "#1C1B19",
    ocean: "#E4DFD4",
    accent: "#E4572E",
    panel: "rgba(255, 253, 248, 0.95)",
    hairline: "rgba(28, 27, 25, 0.12)",
    text: "#1C1B19",
    muted: "rgba(28, 27, 25, 0.58)",
  },
  sand: {
    background: "#EFE6D8",
    land: "#CDB99A",
    night: "#B39F80",
    highlight: "#2A2118",
    ocean: "#E3D7C4",
    accent: "#B4532A",
    panel: "rgba(250, 245, 237, 0.95)",
    hairline: "rgba(42, 33, 24, 0.12)",
    text: "#2A2118",
    muted: "rgba(42, 33, 24, 0.58)",
  },
};

function themeFor(t: PetitpointProps["theme"], dark: boolean): PetitpointThemeTokens {
  const preset = t?.preset || "kp2";
  if (preset === "kp2") {
    return dark ? THEMES["kp2-dark"] : THEMES["kp2-light"];
  }
  if (preset === "custom") {
    const base = THEMES.midnight;
    return {
      background: t?.background || base.background,
      land: t?.land || base.land,
      night: t?.night || base.night,
      highlight: t?.highlight || base.highlight,
      ocean: t?.ocean || base.ocean,
      accent: t?.accent || base.accent,
      panel: t?.panel || base.panel,
      hairline: t?.hairline || base.hairline,
      text: t?.text || base.text,
      muted: t?.muted || base.muted,
    };
  }
  if (preset === "system") {
    return dark ? THEMES[t?.darkPreset || "midnight"] : THEMES[t?.lightPreset || "frost"];
  }
  return THEMES[preset] || THEMES.midnight;
}

function prefersDark(): boolean {
  if (typeof document !== "undefined") {
    if (document.documentElement.classList.contains("dark")) return true;
    const attr =
      document.documentElement.getAttribute("data-theme") ||
      document.body?.getAttribute("data-theme");
    if (attr === "dark") return true;
    if (attr === "light") return false;
    // KP2 explicitly toggles `.dark` on <html>; when absent, light mode is active
    return false;
  }
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return true;
}

const CATEGORY_INKS = [
  "#FFDE59",
  "#630ED4",
  "#2EC4A0",
  "#FF6A3D",
  "#4C8DFF",
  "#FF5C8A",
  "#4FD1E6",
  "#94D15A",
];

const RAMPS: Record<Exclude<PetitpointPalette, "accent">, string[]> = {
  kp2: ["#3B1278", "#630ED4", "#8E44FF", "#F7BE1D", "#FFDE59", "#FFF8D6"],
  thermal: ["#2A1B5E", "#6B1F7C", "#C42F6A", "#FF6A3D", "#FFC15C", "#FFF5DA"],
  spectrum: ["#1A3A8F", "#1EA4C6", "#3ECF8E", "#E9E14B", "#FF8A2B", "#FF3D3D"],
  aurora: ["#0F3B4A", "#127A7A", "#2BC4A0", "#9BEA8F", "#E9F7C4", "#FFFFFF"],
  ember: ["#3A1408", "#7A240C", "#C43D12", "#FF6A3D", "#FFB27A", "#FFF1E4"],
  ice: ["#0B2447", "#19376D", "#2F6BFF", "#5FA8FF", "#A5D7FF", "#F0FAFF"],
};

function rampStops(palette: PetitpointPalette, accent: RGBA, ink: RGBA): RGBA[] {
  if (palette === "accent") return [accent, ink];
  return (RAMPS[palette] || RAMPS.thermal).map((h) => readColor(h, [0, 0, 0, 1]));
}

function rampAt(stops: RGBA[], land: RGBA, u: number): RGBA {
  const lead = 0.14;
  if (u <= lead) return blend(land, stops[0], u / lead);
  const k = ((u - lead) / (1 - lead)) * (stops.length - 1);
  const j = Math.min(stops.length - 2, Math.floor(k));
  return blend(stops[j], stops[j + 1], k - j);
}

function rampCss(stops: RGBA[], land: RGBA): string {
  const marks = [0, 0.14, 0.3, 0.45, 0.6, 0.75, 0.88, 1];
  return `linear-gradient(90deg, ${marks
    .map((m) => `${cssOf(rampAt(stops, land, m))} ${Math.round(m * 100)}%`)
    .join(", ")})`;
}

const TONES = 26;
const DUSK = 6;
const HEAT = 40;

type Inks = {
  table: string[];
  heat: string[];
  lit: string;
  accent: string;
  background: string;
  ocean: string;
  landRGBA: RGBA;
  stops: RGBA[];
};

function buildInks(theme: PetitpointThemeTokens, palette: PetitpointPalette): Inks {
  const bg = readColor(theme.background, [17, 11, 26, 1]);
  const land = readColor(theme.land, [63, 39, 102, 1]);
  const lit = readColor(theme.highlight, [255, 222, 89, 1]);
  const night = readColor(theme.night, [35, 20, 61, 1]);
  const accent = readColor(theme.accent, [255, 222, 89, 1]);

  const table: string[] = [];
  for (let d = 0; d < DUSK; d++) {
    const baseTone = blend(land, night, d / (DUSK - 1));
    for (let t = 0; t < TONES; t++) {
      table.push(cssOf(blend(baseTone, lit, (t / (TONES - 1)) * 0.85)));
    }
  }
  const stops = rampStops(palette, accent, lit);
  const heat: string[] = [];
  for (let t = 0; t < HEAT; t++) {
    heat.push(cssOf(rampAt(stops, land, t / (HEAT - 1))));
  }
  return {
    table,
    heat,
    lit: cssOf(lit),
    accent: cssOf(accent),
    background: bg[3] > 0 ? cssOf(bg) : "",
    ocean: cssOf(readColor(theme.ocean, [35, 22, 57, 1])),
    landRGBA: land,
    stops,
  };
}

const REGIONS: Record<Exclude<PetitpointRegion, "fit" | "custom">, ViewBox> = {
  world: { w: -180, e: 180, s: -58, n: 82 },
  uk: { w: -9.8, e: 3.8, s: 49.4, n: 59.8 },
  england: { w: -6.4, e: 2.8, s: 49.9, n: 55.6 },
  northAmerica: { w: -168, e: -50, s: 8, n: 72 },
  southAmerica: { w: -95, e: -30, s: -56, n: 14 },
  europe: { w: -25, e: 45, s: 34, n: 71 },
  africa: { w: -20, e: 55, s: -36, n: 38 },
  middleEast: { w: 24, e: 64, s: 11, n: 42 },
  asia: { w: 25, e: 150, s: -10, n: 72 },
  oceania: { w: 108, e: 180, s: -48, n: 2 },
};

function viewFor(view: PetitpointProps["view"], spots: Spot[]): ViewBox {
  const region = view?.region || "fit";
  if (region === "custom") {
    const z = clamp(view?.zoom ?? 1.6, 1, 12);
    const lon = wrapDeg(view?.centerLongitude ?? 0);
    const lat = clamp(view?.centerLatitude ?? 25, -50, 75);
    const hw = 180 / z;
    const hh = 70 / z;
    return { w: lon - hw, e: lon + hw, s: lat - hh, n: lat + hh };
  }
  if (region === "fit" && spots.length) {
    let w = Infinity;
    let e = -Infinity;
    let s = Infinity;
    let n = -Infinity;
    for (const p of spots) {
      if (p.lon < w) w = p.lon;
      if (p.lon > e) e = p.lon;
      if (p.lat < s) s = p.lat;
      if (p.lat > n) n = p.lat;
    }
    const pad = clamp(view?.padding ?? 14, 0, 60);
    w -= pad;
    e += pad;
    s -= pad * 0.7;
    n += pad * 0.7;
    if (e - w < 36) {
      const c = (w + e) / 2;
      w = c - 18;
      e = c + 18;
    }
    if (n - s < 20) {
      const c = (n + s) / 2;
      s = c - 10;
      n = c + 10;
    }
    if (e - w > 360) {
      w = -180;
      e = 180;
    }
    return { w, e, s: Math.max(-60, s), n: Math.min(84, n) };
  }
  return REGIONS[region === "fit" ? "world" : region] || REGIONS.world;
}

/* ------------------------------------------------------------------------ *
 * Data Parsing (List / CSV / JSON)                                         *
 * ------------------------------------------------------------------------ */
const FIELD_NAMES: Record<string, string[]> = {
  title: ["title", "name", "city", "label", "location", "place"],
  caption: ["caption", "description", "desc", "subtitle", "address", "summary"],
  lat: ["lat", "latitude", "y"],
  lon: ["lng", "lon", "long", "longitude", "x"],
  value: ["value", "count", "amount", "total", "score", "heat", "weight"],
  category: ["category", "group", "type", "tag", "segment"],
  color: ["color", "colour", "pincolor"],
  image: ["imageurl", "image", "image_url", "img", "photo", "thumbnail"],
  link: ["link", "url", "href", "website"],
};

function fieldOf(row: Record<string, unknown>, key: string): unknown {
  const names = FIELD_NAMES[key];
  for (const k of Object.keys(row)) {
    const low = k.toLowerCase().replace(/[\s-]/g, "");
    if (names.includes(low)) {
      const v = row[k];
      if (v !== undefined && v !== null && v !== "") return v;
    }
  }
  return undefined;
}

function toSpot(row: Record<string, unknown>, index: number): Spot | null {
  const lat = parseFloat(String(fieldOf(row, "lat") ?? ""));
  const lon = parseFloat(String(fieldOf(row, "lon") ?? ""));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  const img = fieldOf(row, "image");
  const raw = parseFloat(String(fieldOf(row, "value") ?? "").replace(/[^0-9.\-]/g, ""));
  const title = String(fieldOf(row, "title") ?? "");
  const caption = String(fieldOf(row, "caption") ?? "");
  const category = String(fieldOf(row, "category") ?? "").trim();
  const color = String(fieldOf(row, "color") ?? "");
  const src =
    typeof img === "object" && img !== null && "src" in img
      ? String((img as { src?: unknown }).src ?? "")
      : String(img ?? "");
  const alt =
    typeof img === "object" && img !== null && "alt" in img
      ? String((img as { alt?: unknown }).alt ?? "")
      : String(row.imageAlt ?? "");
  const link = String(fieldOf(row, "link") ?? "");
  const clampedLat = clamp(lat, -59, 83);
  const wrappedLon = wrapDeg(lon);
  const id = String(row.id ?? `spot-${index}`);
  return {
    id,
    title,
    caption,
    lat: clampedLat,
    lon: wrappedLon,
    raw: Number.isFinite(raw) ? raw : NaN,
    value: 0,
    category,
    color,
    src,
    alt,
    link,
    source: {
      id,
      title,
      caption,
      category,
      latitude: clampedLat,
      longitude: wrappedLon,
      value: Number.isFinite(raw) ? raw : undefined,
      color: color || undefined,
      imageURL: src || undefined,
      imageAlt: alt || undefined,
      link: link || undefined,
    },
  };
}

function parseCSV(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const src = String(text || "").replace(/^\uFEFF/, "");
  const firstLine = src.split("\n")[0] || "";
  const delim =
    (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ";" : ",";
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else quoted = false;
      } else cell += ch;
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === delim) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const body = rows.filter((r) => r.some((c) => c.trim() !== ""));
  if (body.length < 2) return [];
  const head = body[0].map((h) => h.trim());
  return body.slice(1).map((r) => {
    const o: Record<string, string> = {};
    head.forEach((h, i) => {
      o[h] = (r[i] ?? "").trim();
    });
    return o;
  });
}

function parseJSON(text: string): Record<string, unknown>[] {
  try {
    const v = JSON.parse(text);
    if (Array.isArray(v)) return v as Record<string, unknown>[];
    for (const k of ["data", "locations", "items", "points", "markers", "features"]) {
      if (Array.isArray(v?.[k])) {
        if (k === "features") {
          return (
            v[k] as Array<{
              properties?: Record<string, unknown>;
              geometry?: { coordinates?: [number, number] };
            }>
          ).map((f) => ({
            ...(f.properties || {}),
            longitude: f.geometry?.coordinates?.[0],
            latitude: f.geometry?.coordinates?.[1],
          }));
        }
        return v[k] as Record<string, unknown>[];
      }
    }
  } catch {
    // Ignore malformed JSON
  }
  return [];
}

function finishSpots(list: Array<Spot | null>): Spot[] {
  const spots = list.filter((s): s is Spot => Boolean(s));
  let top = 0;
  for (const s of spots) {
    if (Number.isFinite(s.raw) && s.raw > top) top = s.raw;
  }
  for (const s of spots) {
    s.value = Number.isFinite(s.raw) && top > 0 ? clamp(s.raw / top, 0, 1) : 0.65;
  }
  return spots;
}

function spotsFrom(p: PetitpointProps): Spot[] {
  const source = p.data?.source || "list";
  if (source === "csv") {
    return finishSpots(parseCSV(p.data?.csv || "").map((r, i) => toSpot(r, i)));
  }
  if (source === "json") {
    return finishSpots(parseJSON(p.data?.json || "").map((r, i) => toSpot(r, i)));
  }
  return finishSpots(
    (p.locations || []).map((e, i) =>
      toSpot(
        {
          id: e.id,
          title: e.title,
          caption: e.caption,
          latitude: e.latitude,
          longitude: e.longitude,
          value: e.value,
          category: e.category,
          color: e.color,
          imageURL: e.imageURL,
          imageAlt: e.imageAlt,
          link: e.link,
        },
        i,
      ),
    ),
  );
}

function categoriesOf(spots: Spot[]): string[] {
  const out: string[] = [];
  for (const s of spots) {
    if (s.category && !out.includes(s.category)) out.push(s.category);
  }
  return out;
}

/* ------------------------------------------------------------------------ *
 * Heatmap, Daylight & Route Arc Fields                                     *
 * ------------------------------------------------------------------------ */
function heatField(sh: Sheet, spots: Spot[], spread: number, strength: number): Float32Array {
  const out = new Float32Array(sh.cols * sh.rows);
  if (!spots.length) return out;
  const inv = 1 / (2 * spread * spread);
  for (let r = 0; r < sh.rows; r++) {
    const lat = sh.north - (r + 0.5) * sh.degLat;
    const squeeze = Math.cos(lat * RAD);
    for (let c = 0; c < sh.cols; c++) {
      const lon = sh.west + (c + 0.5) * sh.degLon;
      let sum = 0;
      for (let k = 0; k < spots.length; k++) {
        const m = spots[k];
        const dLon = wrapDeg(lon - m.lon) * squeeze;
        const dLat = lat - m.lat;
        const q = (dLon * dLon + dLat * dLat) * inv;
        if (q < 9) sum += m.value * Math.exp(-q);
      }
      const i = r * sh.cols + c;
      out[i] = (1 - Math.exp(-sum * 1.7 * strength)) * (0.86 + sh.grain[i] * 0.28);
    }
  }
  return out;
}

function duskField(sh: Sheet): Float32Array {
  const d = new Date();
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 0);
  const day = (d.getTime() - yearStart) / 864e5;
  const tilt = -23.44 * Math.cos(((2 * Math.PI) / 365) * (day + 10)) * RAD;
  const hours = d.getUTCHours() + d.getUTCMinutes() / 60;
  const sunLon = (12 - hours) * 15 * RAD;
  const out = new Float32Array(sh.cols * sh.rows);
  const sT = Math.sin(tilt);
  const cT = Math.cos(tilt);
  for (let r = 0; r < sh.rows; r++) {
    const la = (sh.north - (r + 0.5) * sh.degLat) * RAD;
    const a = Math.sin(la) * sT;
    const b = Math.cos(la) * cT;
    for (let c = 0; c < sh.cols; c++) {
      const lo = (sh.west + (c + 0.5) * sh.degLon) * RAD;
      const z = a + b * Math.cos(lo - sunLon);
      out[r * sh.cols + c] = clamp((0.06 - z) / 0.2, 0, 1);
    }
  }
  return out;
}

function toVec(lon: number, lat: number): [number, number, number] {
  const a = lat * RAD;
  const o = lon * RAD;
  return [Math.cos(a) * Math.cos(o), Math.cos(a) * Math.sin(o), Math.sin(a)];
}

function traceArc(a: Spot, b: Spot, sh: Sheet): number[] {
  const p = toVec(a.lon, a.lat);
  const q = toVec(b.lon, b.lat);
  const dot = clamp(p[0] * q[0] + p[1] * q[1] + p[2] * q[2], -1, 1);
  const ang = Math.acos(dot);
  const steps = Math.max(2, Math.ceil((ang / RAD / sh.degLat) * 2.2));
  const sinA = Math.sin(ang) || 1;
  const cells: number[] = [];
  let prevC = NaN;
  let lastKeyC = NaN;
  let lastKeyR = NaN;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const wa = ang < 1e-6 ? 1 - t : Math.sin((1 - t) * ang) / sinA;
    const wb = ang < 1e-6 ? t : Math.sin(t * ang) / sinA;
    const x = p[0] * wa + q[0] * wb;
    const y = p[1] * wa + q[1] * wb;
    const z = p[2] * wa + q[2] * wb;
    const lat = Math.atan2(z, Math.hypot(x, y)) / RAD;
    const lon = Math.atan2(y, x) / RAD;
    let c = (lon - sh.west) / sh.degLon;
    if (sh.wrap && !Number.isNaN(prevC)) {
      while (c - prevC > sh.cols / 2) c -= sh.cols;
      while (prevC - c > sh.cols / 2) c += sh.cols;
    }
    prevC = c;
    const cc = Math.floor(c);
    const rr = clamp(Math.floor((sh.north - lat) / sh.degLat), 0, sh.rows - 1);
    if (cc !== lastKeyC || rr !== lastKeyR) {
      cells.push(cc, rr);
      lastKeyC = cc;
      lastKeyR = rr;
    }
  }
  return cells;
}

function formatValue(n: number, card?: PetitpointProps["card"]): string {
  if (!Number.isFinite(n)) return "";
  const body =
    Math.abs(n) >= 1e3 && card?.compact !== false
      ? new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(
          n,
        )
      : new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n);
  return `${card?.prefix || ""}${body}${card?.suffix || ""}`;
}

function coordLabel(lat: number, lon: number): string {
  return `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? "N" : "S"}  ${Math.abs(lon).toFixed(2)}°${
    lon >= 0 ? "E" : "W"
  }`;
}

/* ------------------------------------------------------------------------ *
 * Environment Hooks                                                        *
 * ------------------------------------------------------------------------ */
function useOnScreen(ref: React.RefObject<HTMLDivElement | null>): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let seen = false;
    let tabOpen = typeof document === "undefined" ? true : !document.hidden;
    const sync = () => setOn(seen && tabOpen);
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === "undefined") {
      seen = true;
      sync();
    } else {
      io = new IntersectionObserver(
        (list) => {
          seen = list.some((e) => e.isIntersecting);
          sync();
        },
        { threshold: 0 },
      );
      io.observe(el);
    }
    const onTab = () => {
      tabOpen = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onTab);
    return () => {
      if (io) io.disconnect();
      document.removeEventListener("visibilitychange", onTab);
    };
  }, [ref]);
  return on;
}

function useCalmPreference(): boolean {
  const [calm, setCalm] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setCalm(q.matches);
    set();
    q.addEventListener?.("change", set);
    return () => q.removeEventListener?.("change", set);
  }, []);
  return calm;
}

function useThemeTick(): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    bump();
    const mq =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;
    mq?.addEventListener?.("change", bump);
    const mo = typeof MutationObserver !== "undefined" ? new MutationObserver(bump) : null;
    if (mo) {
      const opts = { attributes: true, attributeFilter: ["class", "style", "data-theme"] };
      mo.observe(document.documentElement, opts);
      if (document.body) mo.observe(document.body, opts);
    }
    return () => {
      mq?.removeEventListener?.("change", bump);
      mo?.disconnect();
    };
  }, []);
  return tick;
}

function pinInkFor(
  s: Spot,
  cats: string[],
  mode: string,
  theme: PetitpointThemeTokens,
  inks: Inks,
): string {
  if (s.color) return s.color;
  if (mode === "category" && s.category) {
    return CATEGORY_INKS[cats.indexOf(s.category) % CATEGORY_INKS.length];
  }
  if (mode === "value") return cssOf(rampAt(inks.stops, inks.landRGBA, 0.4 + s.value * 0.6));
  if (mode === "accent") return theme.accent;
  return theme.highlight;
}

/* ------------------------------------------------------------------------ *
 * Main Component                                                           *
 * ------------------------------------------------------------------------ */
const INTRO_END = 1.75;
const THEME_KEYS: (keyof PetitpointThemeTokens)[] = [
  "background",
  "land",
  "night",
  "highlight",
  "ocean",
  "accent",
  "panel",
  "hairline",
  "text",
  "muted",
];

const MIN_USER_ZOOM = 0.55;
const MAX_USER_ZOOM = 6;

type RuntimeState = {
  w: number;
  h: number;
  dpr: number;
  px: number;
  py: number;
  inside: boolean;
  press: {
    id: number;
    x0: number;
    y0: number;
    panLon0: number;
    panLat0: number;
    moved: boolean;
  } | null;
  pinch: { dist: number; midX: number; midY: number } | null;
  born: number;
  prev: number;
  hover: number;
  dusk: Float32Array | null;
  duskAt: number;
  duskKey: string;
  frame: number;
  pins: { x: number; y: number; rawX: number; rawY: number; r: number }[];
  lastUser: number;
  readText: string;
  cam: ViewBox | null;
  userZoom: number;
  panLon: number;
  panLat: number;
  scalePx: number;
};

export function Petitpoint(props: PetitpointProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const readRef = useRef<HTMLSpanElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);

  const onScreen = useOnScreen(hostRef);
  const calm = useCalmPreference();
  const tick = useThemeTick();

  const view = props.view;
  const layers = props.layers;
  const hm = props.heatmap;
  const mk = props.markers;
  const cardCfg = props.card;
  const tour = props.tour;
  const ui = props.ui;
  const data = props.data;

  const isKp2Theme = (props.theme?.preset || "kp2") === "kp2";
  const dark = useMemo(() => {
    void tick;
    return prefersDark();
  }, [tick]);

  const themeKey = JSON.stringify(props.theme || {});
  const theme = useMemo(() => themeFor(props.theme, dark), [themeKey, dark]); // eslint-disable-line react-hooks/exhaustive-deps

  const solid = useMemo(() => {
    void tick;
    const probe = probeRef.current;
    const out = {} as PetitpointThemeTokens;
    for (const k of THEME_KEYS) {
      const v = theme[k];
      if (probe && typeof v === "string" && v.includes("var(")) {
        probe.style.color = "";
        probe.style.color = v;
        out[k] = getComputedStyle(probe).color || v;
      } else {
        out[k] = v;
      }
    }
    return out;
  }, [theme, tick]);

  const resolveColor = useCallback(
    (v: string) => {
      void tick;
      const probe = probeRef.current;
      if (!probe || !v || !v.includes("var(")) return v;
      probe.style.color = "";
      probe.style.color = v;
      return getComputedStyle(probe).color || v;
    },
    [tick],
  );

  const source = data?.source || "list";
  const listKey = JSON.stringify(props.locations || []);
  const allSpots = useMemo(
    () => spotsFrom(props),
    [listKey, source, data?.csv, data?.json], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const cats = useMemo(() => categoriesOf(allSpots), [allSpots]);

  const [filter, setFilter] = useState("");
  useEffect(() => {
    if (filter && !cats.includes(filter)) setFilter("");
  }, [cats, filter]);

  const spots = useMemo(
    () => (filter ? allSpots.filter((s) => s.category === filter) : allSpots),
    [allSpots, filter],
  );

  const region = view?.region || "fit";
  const isUkMode = region === "uk" || region === "england";
  const detail = view?.detail || "medium";

  const sheet = useMemo(
    () => (isUkMode ? ukSheetFor(detail) : worldSheetFor(DETAIL_STEP[detail] || 2)),
    [isUkMode, detail],
  );

  const palette: PetitpointPalette = hm?.palette || (isKp2Theme ? "kp2" : "thermal");
  const inks = useMemo(() => buildInks(solid, palette), [solid, palette]);
  const gradient = useMemo(() => rampCss(inks.stops, inks.landRGBA), [inks]);
  const colorBy = mk?.colorBy || "theme";
  const pinInks = useMemo(
    () => spots.map((s) => resolveColor(pinInkFor(s, cats, colorBy, solid, inks))),
    [spots, cats, colorBy, solid, inks, resolveColor],
  );

  const heatOn = layers?.heatmap !== false;
  const defaultSpread = isUkMode ? 0.8 : 13;
  const field = useMemo(
    () => (heatOn ? heatField(sheet, spots, hm?.spread ?? defaultSpread, hm?.strength ?? 1) : null),
    [heatOn, sheet, spots, hm?.spread, defaultSpread, hm?.strength],
  );

  const routes = useMemo(() => {
    const out: number[][] = [];
    if (!layers?.routes || spots.length < 2) return out;
    if (isUkMode) {
      // Hub-and-spoke from London HQ (or first branch) for KP2 England branches
      const hubIdx = Math.max(
        0,
        spots.findIndex((s) => s.title.toLowerCase().includes("london")),
      );
      for (let i = 0; i < spots.length; i++) {
        if (i !== hubIdx) out.push(traceArc(spots[hubIdx], spots[i], sheet));
      }
      return out;
    }
    for (let i = 0; i < spots.length - 1; i++) {
      out.push(traceArc(spots[i], spots[i + 1], sheet));
    }
    if (layers.closeLoop && spots.length > 2) {
      out.push(traceArc(spots[spots.length - 1], spots[0], sheet));
    }
    return out;
  }, [spots, sheet, layers?.routes, layers?.closeLoop, isUkMode]);

  const viewKey = JSON.stringify(view || {});
  const target = useMemo(() => viewFor(view, spots), [viewKey, spots]); // eslint-disable-line react-hooks/exhaustive-deps

  const live = useRef({
    props,
    sheet,
    inks,
    solid,
    spots,
    pinInks,
    routes,
    calm,
    onScreen,
    field,
    target,
    isUkMode,
  });
  live.current = {
    props,
    sheet,
    inks,
    solid,
    spots,
    pinInks,
    routes,
    calm,
    onScreen,
    field,
    target,
    isUkMode,
  };

  const [picked, setPicked] = useState(-1);
  const pickedRef = useRef(-1);
  const [zoomUi, setZoomUi] = useState(1);
  const [pannedUi, setPannedUi] = useState(false);
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const cardHoveredRef = useRef(false);
  const leaveTimerRef = useRef<number | null>(null);

  const st = useRef<RuntimeState>({
    w: 0,
    h: 0,
    dpr: 1,
    px: -999,
    py: -999,
    inside: false,
    press: null,
    pinch: null,
    born: -1,
    prev: 0,
    hover: -1,
    dusk: null,
    duskAt: 0,
    duskKey: "",
    frame: 0,
    pins: [],
    lastUser: 0,
    readText: "",
    cam: null,
    userZoom: 1,
    panLon: 0,
    panLat: 0,
    scalePx: 10,
  });

  const paint = useCallback((now: number): boolean => {
    const S = st.current;
    const L = live.current;
    const P = L.props;
    const G = L.sheet;
    const K = L.inks;
    const T = L.solid;
    const SP = L.spots;
    const still = L.calm;
    const cv = canvasRef.current;
    if (!cv) return false;
    const ctx = cv.getContext("2d");
    if (!ctx || S.w < 2 || S.h < 2) return false;

    const W = S.w;
    const H = S.h;
    const vw = P.view || {};
    const ly = P.layers || {};
    const HM = P.heatmap || {};
    const MK = P.markers || {};
    const UI = P.ui || {};

    const step = Math.min(50, S.prev ? now - S.prev : 16);
    S.prev = now;
    const secs = now / 1000;
    let more = false;
    if (S.born < 0) S.born = now;
    const intro = still || UI.intro === "none" ? 99 : (now - S.born) / 1000;
    if (intro < INTRO_END) more = true;

    const goal = L.target;
    if (!S.cam || still || vw.animate === false) {
      S.cam = { ...goal };
    } else {
      const k = 1 - Math.exp(-step / 170);
      let moving = false;
      for (const key of ["w", "e", "s", "n"] as const) {
        const d = goal[key] - S.cam[key];
        if (Math.abs(d) > 0.02) {
          S.cam[key] += d * k;
          moving = true;
        } else {
          S.cam[key] = goal[key];
        }
      }
      if (moving) more = true;
    }
    const baseCam = S.cam;
    const baseLonC = (baseCam.w + baseCam.e) / 2;
    const baseLatC = (baseCam.n + baseCam.s) / 2;
    const halfW = (baseCam.e - baseCam.w) / 2 / S.userZoom;
    const halfH = (baseCam.n - baseCam.s) / 2 / S.userZoom;
    const cam: ViewBox = {
      w: baseLonC + S.panLon - halfW,
      e: baseLonC + S.panLon + halfW,
      s: baseLatC + S.panLat - halfH,
      n: baseLatC + S.panLat + halfH,
    };

    const cols = G.cols;
    const rows = G.rows;
    const s = Math.max(
      0.5,
      Math.min(W / ((cam.e - cam.w) / G.degLon), H / ((cam.n - cam.s) / G.degLat)),
    );
    S.scalePx = s;
    const worldW = cols * s;
    const roll = G.wrap && worldW > W + 0.5;
    const lonC = (cam.w + cam.e) / 2;
    const latC = (cam.n + cam.s) / 2;
    const ox = W / 2 - ((lonC - G.west) / G.degLon) * s;
    const tall = rows * s;
    const rawOy = H / 2 - ((G.north - latC) / G.degLat) * s;
    const oy = G.wrap ? clamp(rawOy, Math.min(0, H - tall), Math.max(0, H - tall)) : rawOy;

    const cFrom = roll ? Math.floor(-ox / s) - 1 : Math.max(0, Math.floor(-ox / s));
    const cTo = roll ? Math.ceil((W - ox) / s) + 1 : Math.min(cols - 1, Math.ceil((W - ox) / s));
    const rFrom = Math.max(0, Math.floor(-oy / s));
    const rTo = Math.min(rows - 1, Math.ceil((H - oy) / s));

    const daylight = Boolean(ly.daylight);
    if (daylight && (!S.dusk || S.duskKey !== G.key || Date.now() - S.duskAt > 30000)) {
      S.dusk = duskField(G);
      S.duskKey = G.key;
      S.duskAt = Date.now();
    }
    const dusk = daylight ? S.dusk : null;

    const F = L.field;
    const breathe = Boolean(F) && HM.breathe !== false && !still;
    if (breathe) more = true;
    const reveal = still ? 1 : clamp((intro - 0.5) / 1.1, 0, 1);
    const fieldAt = (i: number) => {
      if (!F) return 0;
      let f = F[i] * reveal;
      if (breathe && f > 0.02) f *= 0.88 + 0.12 * Math.sin(secs * 1.6 - f * 5 + G.grain[i] * 3);
      return f > 1 ? 1 : f;
    };

    const dpr = S.dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (K.background) {
      ctx.fillStyle = K.background;
      ctx.fillRect(0, 0, W, H);
    }

    const introStyle = UI.intro || "sweep";
    const halfDiag = Math.hypot(W, H) / 2;
    const gap = clamp(vw.gap ?? 0.22, 0, 0.8);
    const unit = s * (1 - gap);
    const shape = vw.shape || "square";

    const arrival = (cx: number, cy: number, g: number) => {
      if (intro >= INTRO_END) return 1;
      let d: number;
      if (introStyle === "bloom")
        d = (Math.hypot(cx - W / 2, cy - H / 2) / halfDiag) * 0.85 + g * 0.15;
      else if (introStyle === "rain") d = (cy / H) * 0.45 + g * 0.55;
      else d = (cx / W) * 0.8 + g * 0.2;
      return clamp((intro - d * 1.15) / 0.5, 0, 1);
    };

    const hoverActive = S.inside && S.px > -900;
    const hoverLandR = 40;
    const hoverSeaR = 32;

    /* Sea dot grid */
    if (vw.oceanGrid !== false) {
      const dot = Math.max(1.2, s * 0.16);
      let sea = "";
      for (let cu = cFrom; cu <= cTo; cu++) {
        const c = roll ? modi(cu, cols) : cu;
        const cx = ox + cu * s + s / 2;
        if (cx < -s || cx > W + s) continue;
        for (let r = rFrom; r <= rTo; r++) {
          const i = r * cols + c;
          if (G.land[i]) continue;
          const cy = oy + r * s + s / 2;
          const a = arrival(cx, cy, G.grain[i]);
          if (a <= 0) continue;
          const t = HM.seaGlow !== false ? fieldAt(i) : 0;
          let fill = K.ocean;
          let z = dot * a;
          if (t > 0.06) {
            fill = K.heat[Math.round(t * 0.62 * (HEAT - 1))];
            z = dot + (unit * 0.42 - dot) * t;
          }
          if (hoverActive) {
            const hd = Math.hypot(cx - S.px, cy - S.py);
            if (hd < hoverSeaR) {
              const hg = (1 - hd / hoverSeaR) ** 2;
              fill = `rgba(255, 222, 89, ${(0.22 + hg * 0.52).toFixed(2)})`;
              z = Math.max(z, dot + (unit * 0.34 - dot) * hg);
            }
          }
          if (fill !== sea) {
            ctx.fillStyle = fill;
            sea = fill;
          }
          ctx.fillRect(cx - z / 2, cy - z / 2, z, z);
        }
      }
    }

    /* Land pixels */
    let ink = "";
    const round = shape === "dot";
    const soft = shape === "soft" && Boolean(ctx.roundRect);
    for (let cu = cFrom; cu <= cTo; cu++) {
      const c = roll ? modi(cu, cols) : cu;
      const cx = ox + cu * s + s / 2;
      if (cx < -s || cx > W + s) continue;
      for (let r = rFrom; r <= rTo; r++) {
        const i = r * cols + c;
        if (!G.land[i]) continue;
        const cy = oy + r * s + s / 2;
        const a = arrival(cx, cy, G.grain[i]);
        if (a <= 0) continue;
        const t = fieldAt(i);
        const night = dusk ? Math.round(dusk[i] * (DUSK - 1)) : 0;
        let fill =
          t > 0.025
            ? K.heat[Math.round(t * (HEAT - 1))]
            : K.table[
                night * TONES + Math.round(clamp(a < 1 ? (1 - a) * 0.9 : 0, 0, 1) * (TONES - 1))
              ];
        let z = unit * overshoot(a);
        if (hoverActive) {
          const hd = Math.hypot(cx - S.px, cy - S.py);
          if (hd < hoverLandR) {
            const hg = (1 - hd / hoverLandR) ** 1.6;
            const baseCol = readColor(fill, K.landRGBA);
            fill = cssOf(blend(baseCol, [255, 222, 89, 1], hg * 0.88));
            z *= 1 + hg * 0.08;
          }
        }
        if (fill !== ink) {
          ctx.fillStyle = fill;
          ink = fill;
        }
        if (round) {
          ctx.beginPath();
          ctx.arc(cx, cy, z / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (soft) {
          ctx.beginPath();
          ctx.roundRect(cx - z / 2, cy - z / 2, z, z, z * 0.3);
          ctx.fill();
        } else {
          ctx.fillRect(cx - z / 2, cy - z / 2, z, z);
        }
      }
    }

    /* Animated comet routes */
    const RT = L.routes;
    if (ly.routes && RT.length) {
      const fade = still ? 1 : clamp((intro - 1) / 0.6, 0, 1);
      if (fade > 0) {
        ctx.fillStyle = K.accent;
        const dot = Math.max(1.4, s * 0.22);
        const speed = ly.routeSpeed ?? 14;
        for (let ri = 0; ri < RT.length; ri++) {
          const cells = RT[ri];
          const n = cells.length / 2;
          if (n < 2) continue;
          let lo = Infinity;
          let hi = -Infinity;
          for (let q = 0; q < cells.length; q += 2) {
            if (cells[q] < lo) lo = cells[q];
            if (cells[q] > hi) hi = cells[q];
          }
          const kFrom = roll ? Math.floor((cFrom - hi) / cols) : 0;
          const kTo = roll ? Math.ceil((cTo - lo) / cols) : 0;
          const head = still ? -1 : (secs * speed + ri * 9.7) % (n + 14);
          for (let kk = kFrom; kk <= kTo; kk++) {
            const shift = kk * cols;
            ctx.globalAlpha = 0.4 * fade;
            for (let q = 0; q < cells.length; q += 2) {
              const x = ox + (cells[q] + shift) * s + s / 2;
              if (x < -s || x > W + s) continue;
              const y = oy + cells[q + 1] * s + s / 2;
              ctx.fillRect(x - dot / 2, y - dot / 2, dot, dot);
            }
            if (head >= 0) {
              for (let tail = 0; tail < 9; tail++) {
                const idx = Math.floor(head) - tail;
                if (idx < 0 || idx >= n) continue;
                const x = ox + (cells[idx * 2] + shift) * s + s / 2;
                if (x < -s || x > W + s) continue;
                const y = oy + cells[idx * 2 + 1] * s + s / 2;
                ctx.globalAlpha = (1 - tail / 9) * fade;
                const z = Math.max(2.2, s * (tail === 0 ? 0.64 : 0.44 - tail * 0.025));
                ctx.fillRect(x - z / 2, y - z / 2, z, z);
              }
            }
          }
        }
        ctx.globalAlpha = 1;
        if (!still) more = true;
      }
    }

    /* Markers (with gentle separation for closely-clustered UK cities like London/Barking/Romford) */
    const sel = pickedRef.current;
    const scale = clamp(MK.size ?? 1, 0.5, 2.5);
    const pins = SP.map((m) => {
      let x = ox + ((m.lon - G.west) / G.degLon) * s;
      if (roll) x += worldW * Math.round((W / 2 - x) / worldW);
      const y = oy + ((G.north - m.lat) / G.degLat) * s;
      const k = MK.sizeByValue ? 0.75 + m.value * 0.6 : 1;
      return { x, y, rawX: x, rawY: y, r: Math.round(20 * scale * k) };
    });

    if (L.isUkMode && pins.length > 1) {
      const minSep = 32;
      for (let iter = 0; iter < 10; iter++) {
        for (let i = 0; i < pins.length; i++) {
          for (let j = i + 1; j < pins.length; j++) {
            const dx = pins[j].x - pins[i].x;
            const dy = pins[j].y - pins[i].y;
            const d = Math.hypot(dx, dy);
            if (d < minSep) {
              const ang = d > 0.01 ? Math.atan2(dy, dx) : (j - i) * 1.15;
              const push = (minSep - d) * 0.5;
              pins[i].x -= Math.cos(ang) * push;
              pins[i].y -= Math.sin(ang) * push;
              pins[j].x += Math.cos(ang) * push;
              pins[j].y += Math.sin(ang) * push;
            }
          }
        }
      }
    }

    S.pins = pins;

    const showPins = ly.markers !== false;
    const show = still ? 1 : clamp((intro - 0.8) / 0.5, 0, 1);
    if (showPins && show > 0) {
      const PI = L.pinInks;
      const bgInk = K.background || T.background;
      const tagMode = MK.labels || "hover";
      const kind = MK.style || "square";
      const placedTags: { x: number; y: number; w: number; h: number }[] = [];
      const pinBoxes = pins.map((pin) => ({
        x: Math.round(pin.x - pin.r / 2 - 5),
        y: Math.round(pin.y - pin.r / 2 - 5),
        w: pin.r + 10,
        h: pin.r + 10,
      }));

      const hitsAny = (bx: number, by: number, bw: number, bh: number) => {
        if (bx < 8 || bx + bw > W - 8 || by < 8 || by + bh > H - 8) return true;
        const hitsTag = placedTags.some(
          (b) => bx < b.x + b.w + 4 && bx + bw + 4 > b.x && by < b.y + b.h + 3 && by + bh + 3 > b.y,
        );
        if (hitsTag) return true;
        return pinBoxes.some(
          (b) => bx < b.x + b.w && bx + bw > b.x && by < b.y + b.h && by + bh > b.y,
        );
      };

      const drawTag = (i: number, x: number, y: number, plate: number) => {
        const label = SP[i].title
          .replace(/^KP2\s+/i, "")
          .replace(/^Kharis Phase 2\s*[—–-]?\s*/i, "")
          .toUpperCase();
        if (!label) return;
        ctx.font = `700 10.5px "Space Mono", ui-monospace, monospace`;
        const tw = ctx.measureText(label).width;
        const bw = Math.ceil(tw + 16);
        const bh = 21;
        const rightX = Math.round(x + plate / 2 + 8);
        const leftX = Math.round(x - plate / 2 - 8 - bw);
        const midY = Math.round(y - bh / 2);
        const preferLeft = label === "LONDON";

        const candidates: [number, number][] = preferLeft
          ? [
              [leftX, midY],
              [leftX, midY + bh + 4],
              [leftX, midY - bh - 4],
              [rightX, midY],
              [Math.round(x - bw / 2), Math.round(y + plate / 2 + 7)],
              [Math.round(x - bw / 2), Math.round(y - plate / 2 - 7 - bh)],
            ]
          : [
              [rightX, midY],
              [leftX, midY],
              [rightX, midY + bh + 4],
              [rightX, midY - bh - 4],
              [leftX, midY + bh + 4],
              [Math.round(x - bw / 2), Math.round(y + plate / 2 + 7)],
              [Math.round(x - bw / 2), Math.round(y - plate / 2 - 7 - bh)],
            ];

        let bx = candidates[0][0];
        let by = candidates[0][1];
        for (const [cx, cy] of candidates) {
          if (!hitsAny(cx, cy, bw, bh)) {
            bx = cx;
            by = cy;
            break;
          }
        }
        bx = clamp(bx, 8, Math.max(8, W - bw - 8));
        by = clamp(by, 8, Math.max(8, H - bh - 8));

        placedTags.push({ x: bx, y: by, w: bw, h: bh });
        ctx.globalAlpha = show;
        ctx.fillStyle = T.panel;
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = T.hairline;
        ctx.lineWidth = 1.25;
        ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
        ctx.fillStyle = T.text;
        ctx.textBaseline = "middle";
        ctx.fillText(label, bx + 8, by + bh / 2 + 0.5);
      };

      const shapePath = (x: number, y: number, z: number) => {
        ctx.beginPath();
        if (kind === "dot" || kind === "ring") {
          ctx.arc(x, y, z / 2, 0, Math.PI * 2);
        } else if (kind === "diamond") {
          ctx.moveTo(x, y - z / 2);
          ctx.lineTo(x + z / 2, y);
          ctx.lineTo(x, y + z / 2);
          ctx.lineTo(x - z / 2, y);
          ctx.closePath();
        } else {
          ctx.rect(x - z / 2, y - z / 2, z, z);
        }
      };

      const order = SP.map((_, i) => i).sort((a, b) => (a === sel ? 1 : 0) - (b === sel ? 1 : 0));
      for (const i of order) {
        const pin = pins[i];
        if (pin.x < -60 || pin.x > W + 60 || pin.y < -60 || pin.y > H + 60) continue;
        const x = Math.round(pin.x);
        const y = Math.round(pin.y);
        const chosen = sel === i;
        const near = S.hover === i;
        const tone = PI[i] || K.lit;
        const pop = overshoot(show);
        const plate = pin.r;

        if (Math.hypot(pin.x - pin.rawX, pin.y - pin.rawY) > 4) {
          ctx.globalAlpha = 0.45 * show;
          ctx.strokeStyle = tone;
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 3]);
          ctx.beginPath();
          ctx.moveTo(pin.rawX, pin.rawY);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        if (MK.pulse !== false && !still) {
          ctx.lineWidth = 1.5;
          for (let q = 0; q < 2; q++) {
            const ph = (secs * 0.5 + q * 0.5 + i * 0.137) % 1;
            const z = plate + ph * plate * (chosen ? 2.6 : 1.8);
            ctx.globalAlpha = (1 - ph) * (1 - ph) * 0.85 * show;
            ctx.strokeStyle = chosen ? K.accent : tone;
            shapePath(x, y, z);
            ctx.stroke();
          }
          more = true;
        }

        /* Crosshair targeting lines on selected pin */
        if (chosen) {
          ctx.globalAlpha = 0.32 * show;
          ctx.strokeStyle = K.lit;
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 5]);
          ctx.beginPath();
          ctx.moveTo(0, y + 0.5);
          ctx.lineTo(x - plate, y + 0.5);
          ctx.moveTo(x + plate, y + 0.5);
          ctx.lineTo(W, y + 0.5);
          ctx.moveTo(x + 0.5, 0);
          ctx.lineTo(x + 0.5, y - plate);
          ctx.moveTo(x + 0.5, y + plate);
          ctx.lineTo(x + 0.5, H);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        const size = Math.round(plate * (chosen ? 1.25 : near ? 1.12 : 1) * pop);
        ctx.globalAlpha = show;
        ctx.fillStyle = bgInk;
        shapePath(x, y, size + 4);
        ctx.fill();
        ctx.strokeStyle = chosen ? K.accent : tone;
        ctx.lineWidth = 1.75;
        shapePath(x, y, size - 1.5);
        ctx.stroke();

        if (chosen) {
          const b = size / 2 + 7;
          const arm = Math.max(4, size * 0.28);
          ctx.strokeStyle = K.accent;
          ctx.beginPath();
          for (const [sx, sy] of [
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1],
          ] as const) {
            const cx = x + sx * b;
            const cy = y + sy * b;
            ctx.moveTo(cx - sx * arm, cy);
            ctx.lineTo(cx, cy);
            ctx.lineTo(cx, cy - sy * arm);
          }
          ctx.stroke();
        }

        if (kind !== "ring" || chosen) {
          const core = Math.max(3, Math.round(size * (chosen ? 0.46 : 0.38)));
          ctx.fillStyle = chosen ? K.accent : tone;
          shapePath(x, y, core);
          ctx.fill();
        }
      }

      /* Draw tags in a second pass after all markers so no pin ever covers a label */
      for (const i of order) {
        const pin = pins[i];
        if (pin.x < -60 || pin.x > W + 60 || pin.y < -60 || pin.y > H + 60) continue;
        const chosen = sel === i;
        const near = S.hover === i;
        if (!chosen && (tagMode === "always" || (near && tagMode !== "none"))) {
          drawTag(i, Math.round(pin.x), Math.round(pin.y), pin.r);
        }
      }
      ctx.globalAlpha = 1;
    }

    /* "You are here" user location pin after allowing GPS via "Near me" */
    const userLoc = P.userLocation;
    if (userLoc && Number.isFinite(userLoc.latitude) && Number.isFinite(userLoc.longitude)) {
      let ux = ox + ((userLoc.longitude - G.west) / G.degLon) * s;
      if (roll) ux += worldW * Math.round((W / 2 - ux) / worldW);
      const uy = oy + ((G.north - userLoc.latitude) / G.degLat) * s;

      // Dashed line to the nearest visible branch pin (pins[0])
      if (pins.length > 0) {
        ctx.save();
        ctx.strokeStyle = "#38bdf8";
        ctx.globalAlpha = 0.65;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(ux, uy);
        ctx.lineTo(pins[0].x, pins[0].y);
        ctx.stroke();
        ctx.restore();
      }

      if (ux >= -60 && ux <= W + 60 && uy >= -60 && uy <= H + 60) {
        if (!still) {
          const ph = (secs * 0.65) % 1;
          ctx.save();
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 2;
          ctx.globalAlpha = (1 - ph) * 0.85;
          ctx.beginPath();
          ctx.arc(ux, uy, 8 + ph * 22, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
          more = true;
        }

        // Glow halo + white-bordered cyan dot
        ctx.save();
        ctx.fillStyle = "rgba(56, 189, 248, 0.28)";
        ctx.beginPath();
        ctx.arc(ux, uy, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#38bdf8";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(ux, uy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Crisp "YOU ARE HERE" tag pill
        const label = (userLoc.label || "YOU ARE HERE").toUpperCase();
        ctx.font = `700 10px "Space Mono", ui-monospace, monospace`;
        const tw = ctx.measureText(label).width;
        const bw = Math.ceil(tw + 14);
        const bh = 20;
        const bx = clamp(Math.round(ux - bw / 2), 10, Math.max(10, W - bw - 10));
        const by = uy - 30 > 74 ? Math.round(uy - 30) : Math.round(uy + 14);
        ctx.fillStyle = "#0ea5e9";
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = "#151218";
        ctx.lineWidth = 2;
        ctx.strokeRect(bx, by, bw, bh);
        ctx.fillStyle = "#071420";
        ctx.textBaseline = "middle";
        ctx.fillText(label, bx + 7, by + bh / 2 + 0.5);
        ctx.restore();
      }
    }

    /* Position floating card next to the selected pin */
    const card = cardRef.current;
    if (card && sel >= 0 && pins[sel]) {
      const cw = card.offsetWidth || 260;
      const ch = card.offsetHeight || 220;
      const { x, y, r } = pins[sel];
      const off = r * 0.65 + 18;
      let left = x + off;
      if (left + cw > W - 14) left = x - off - cw;
      left = clamp(left, 14, Math.max(14, W - cw - 14));
      const top = clamp(y - ch / 2, 82, Math.max(82, H - ch - 14));
      card.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0)`;
    }

    /* Coordinate readout HUD */
    const rd = readRef.current;
    if (rd) {
      let text = "";
      if (S.inside && S.px > -900) {
        const cf = (S.px - ox) / s;
        const lon = wrapDeg(G.west + cf * G.degLon);
        const lat = G.north - ((S.py - oy) / s) * G.degLat;
        const ci = roll ? modi(Math.floor(cf), cols) : Math.floor(cf);
        const ri = Math.floor((S.py - oy) / s);
        const onLand = ci >= 0 && ci < cols && ri >= 0 && ri < rows && G.land[ri * cols + ci] === 1;
        text = `${coordLabel(clamp(lat, -90, 90), lon)}  ·  ${onLand ? "LAND" : "SEA"}`;
      } else if (sel >= 0 && SP[sel]) {
        text = `${coordLabel(SP[sel].lat, SP[sel].lon)}  ·  ${pad2(sel + 1)}`;
      } else {
        text = `${coordLabel(latC, wrapDeg(lonC))}  ·  ${pad2(SP.length)} ${UI.countLabel || "POINTS"}`;
      }
      if (text !== S.readText) {
        rd.textContent = text;
        S.readText = text;
      }
    }

    return more;
  }, []);

  const tickFrame = useCallback(
    (now: number) => {
      const S = st.current;
      S.frame = 0;
      if (!live.current.onScreen) {
        S.prev = 0;
        return;
      }
      const more = paint(now);
      if (more && live.current.onScreen) {
        S.frame = requestAnimationFrame(tickFrame);
      } else {
        S.prev = 0;
      }
    },
    [paint],
  );

  const wake = useCallback(() => {
    const S = st.current;
    if (S.frame || !live.current.onScreen) return;
    S.frame = requestAnimationFrame(tickFrame);
  }, [tickFrame]);

  useEffect(() => {
    const S = st.current;
    if (onScreen) {
      wake();
    } else {
      if (S.frame) cancelAnimationFrame(S.frame);
      S.frame = 0;
      S.prev = 0;
      S.press = null;
      S.inside = false;
    }
  }, [onScreen, wake]);

  useEffect(() => {
    const S = st.current;
    return () => {
      if (S.frame) cancelAnimationFrame(S.frame);
      S.frame = 0;
    };
  }, []);

  useEffect(() => {
    wake();
  });

  useEffect(() => {
    const host = hostRef.current;
    const cv = canvasRef.current;
    if (!host || !cv) return;
    const fit = () => {
      const S = st.current;
      const w = host.clientWidth;
      const h = host.clientHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (w === S.w && h === S.h && dpr === S.dpr) return;
      S.w = w;
      S.h = h;
      S.dpr = dpr;
      cv.width = Math.max(1, Math.round(w * dpr));
      cv.height = Math.max(1, Math.round(h * dpr));
      wake();
    };
    fit();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(fit);
      ro.observe(host);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [wake]);

  const choose = useCallback(
    (i: number, byUser: boolean) => {
      const S = st.current;
      if (byUser) S.lastUser = performance.now();
      const next = i >= 0 && i < live.current.spots.length ? i : -1;
      pickedRef.current = next;
      setPicked(next);
      wake();
    },
    [wake],
  );

  useEffect(() => {
    choose(-1, false);
  }, [filter, source, choose]);

  useEffect(() => {
    if (picked >= spots.length) choose(-1, false);
  }, [spots.length, picked, choose]);

  const inFrame = (q: { x: number; y: number }) => {
    const S = st.current;
    return q.x >= 8 && q.x <= S.w - 8 && q.y >= 8 && q.y <= S.h - 8;
  };

  /* Auto tour */
  useEffect(() => {
    if (!tour?.autoplay || !onScreen || calm || spots.length === 0 || cardCfg?.enabled === false) {
      return;
    }
    const every = Math.max(1.5, tour.interval ?? 5) * 1000;
    let id: number;
    const run = () => {
      const S = st.current;
      const idle = performance.now() - S.lastUser;
      if (S.lastUser && idle < every * 1.6) {
        id = window.setTimeout(run, every * 1.6 - idle);
        return;
      }
      if (S.press) {
        id = window.setTimeout(run, every);
        return;
      }
      const n = live.current.spots.length;
      const pins = S.pins;
      let next = -1;
      for (let k = 1; k <= n; k++) {
        const j = (pickedRef.current + k + n) % n;
        if (pins[j] && inFrame(pins[j])) {
          next = j;
          break;
        }
      }
      if (next >= 0) choose(next, false);
      id = window.setTimeout(run, every);
    };
    id = window.setTimeout(run, every * 0.6);
    return () => window.clearTimeout(id);
  }, [tour?.autoplay, tour?.interval, onScreen, calm, spots.length, choose, cardCfg?.enabled]);

  const clampUserPan = useCallback((nextZoom: number, lon: number, lat: number) => {
    const base = live.current.target;
    const spanLon = Math.max(4, (base.e - base.w) * Math.max(0.65, nextZoom * 0.45));
    const spanLat = Math.max(3, (base.n - base.s) * Math.max(0.65, nextZoom * 0.45));
    return {
      panLon: clamp(lon, -spanLon, spanLon),
      panLat: clamp(lat, -spanLat, spanLat),
    };
  }, []);

  const applyUserZoom = useCallback(
    (factor: number) => {
      const S = st.current;
      const next = clamp(Math.round(S.userZoom * factor * 100) / 100, MIN_USER_ZOOM, MAX_USER_ZOOM);
      S.userZoom = next;
      if (Math.abs(next - 1) < 0.04) {
        S.userZoom = 1;
      }
      const clamped = clampUserPan(S.userZoom, S.panLon, S.panLat);
      S.panLon = clamped.panLon;
      S.panLat = clamped.panLat;
      setZoomUi(S.userZoom);
      setPannedUi(Math.abs(S.panLon) > 0.01 || Math.abs(S.panLat) > 0.01);
      wake();
    },
    [clampUserPan, wake],
  );

  const resetUserView = useCallback(() => {
    const S = st.current;
    S.userZoom = 1;
    S.panLon = 0;
    S.panLat = 0;
    setZoomUi(1);
    setPannedUi(false);
    choose(-1, true);
    wake();
  }, [choose, wake]);

  // Scroll-safe zoom: normal page scroll passes straight through;
  // Ctrl/Cmd + Scroll (and trackpad pinch) zooms the map cleanly.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const onWheel = (event: globalThis.WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const factor = event.deltaY < 0 ? 1.14 : 1 / 1.14;
      applyUserZoom(factor);
    };
    host.addEventListener("wheel", onWheel, { passive: false });
    return () => host.removeEventListener("wheel", onWheel);
  }, [applyUserZoom]);

  const cancelLeaveClose = useCallback(() => {
    if (leaveTimerRef.current) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  const scheduleLeaveClose = useCallback(() => {
    cancelLeaveClose();
    leaveTimerRef.current = window.setTimeout(() => {
      if (!cardHoveredRef.current && st.current.hover < 0) {
        choose(-1, false);
      }
    }, 180);
  }, [cancelLeaveClose, choose]);

  /* Pointer interaction (drag to pan, pinch to zoom, hover card auto-dismiss) */
  const localCoords = (e: PointerEvent<HTMLDivElement>) => {
    const S = st.current;
    const host = hostRef.current;
    if (!host) return { x: 0, y: 0 };
    const b = host.getBoundingClientRect();
    const kx = b.width ? S.w / b.width : 1;
    const ky = b.height ? S.h / b.height : 1;
    return { x: (e.clientX - b.left) * kx, y: (e.clientY - b.top) * ky };
  };

  const pinAt = (x: number, y: number) => {
    const S = st.current;
    if ((live.current.props.layers || {}).markers === false) return -1;
    let best = -1;
    let bestD = Infinity;
    S.pins.forEach((q, i) => {
      if (!inFrame(q)) return;
      const d = Math.hypot(q.x - x, q.y - y);
      if (d < Math.max(18, q.r * 0.95) && d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return best;
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const S = st.current;
    const { x, y } = localCoords(e);
    pointersRef.current.set(e.pointerId, { x, y });
    S.lastUser = performance.now();

    if (pointersRef.current.size >= 2) {
      const [a, b] = [...pointersRef.current.values()];
      S.press = null;
      S.pinch = {
        dist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        midX: (a.x + b.x) / 2,
        midY: (a.y + b.y) / 2,
      };
      return;
    }

    // On touch devices at default zoom, allow 1-finger vertical page scrolling
    if (e.pointerType === "touch" && S.userZoom <= 1.05 && pinAt(x, y) < 0) {
      return;
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture is unavailable
    }
    S.press = {
      id: e.pointerId,
      x0: x,
      y0: y,
      panLon0: S.panLon,
      panLat0: S.panLat,
      moved: false,
    };
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const S = st.current;
    const { x, y } = localCoords(e);
    if (pointersRef.current.has(e.pointerId)) {
      pointersRef.current.set(e.pointerId, { x, y });
    }

    // Two-finger pinch zoom
    if (S.pinch && pointersRef.current.size >= 2) {
      const [a, b] = [...pointersRef.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const ratio = dist / S.pinch.dist;
      if (Math.abs(ratio - 1) > 0.015) {
        applyUserZoom(ratio);
        S.pinch.dist = dist;
      }
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      const G = live.current.sheet;
      const s = Math.max(0.5, S.scalePx);
      const next = clampUserPan(
        S.userZoom,
        S.panLon - ((midX - S.pinch.midX) / s) * G.degLon,
        S.panLat + ((midY - S.pinch.midY) / s) * G.degLat,
      );
      S.panLon = next.panLon;
      S.panLat = next.panLat;
      S.pinch.midX = midX;
      S.pinch.midY = midY;
      setPannedUi(true);
      wake();
      return;
    }

    // Drag to pan
    if (S.press && S.press.id === e.pointerId) {
      const dx = x - S.press.x0;
      const dy = y - S.press.y0;
      if (!S.press.moved && Math.hypot(dx, dy) > 4) {
        S.press.moved = true;
      }
      if (S.press.moved) {
        const G = live.current.sheet;
        const s = Math.max(0.5, S.scalePx);
        const next = clampUserPan(
          S.userZoom,
          S.press.panLon0 - (dx / s) * G.degLon,
          S.press.panLat0 + (dy / s) * G.degLat,
        );
        S.panLon = next.panLon;
        S.panLat = next.panLat;
        setPannedUi(Math.abs(S.panLon) > 0.01 || Math.abs(S.panLat) > 0.01);
        const host = hostRef.current;
        if (host) host.style.cursor = "grabbing";
        wake();
        return;
      }
    }

    S.px = x;
    S.py = y;
    S.inside = true;

    if (e.pointerType !== "touch") {
      const over = pinAt(x, y);
      if (over !== S.hover) {
        S.hover = over;
        const host = hostRef.current;
        if (host) host.style.cursor = over >= 0 ? "pointer" : "grab";
        if (over >= 0) {
          cancelLeaveClose();
          if (live.current.props.card?.enabled !== false) {
            choose(over, false);
          }
        } else {
          scheduleLeaveClose();
        }
      }
    }
    wake();
  };

  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    const S = st.current;
    pointersRef.current.delete(e.pointerId);
    if (S.pinch && pointersRef.current.size < 2) {
      S.pinch = null;
    }
    const pr = S.press;
    if (!pr || pr.id !== e.pointerId) return;
    S.press = null;
    const host = hostRef.current;
    if (host) host.style.cursor = S.hover >= 0 ? "pointer" : "grab";
    if (pr.moved) return;

    const { x, y } = localCoords(e);
    const hit = pinAt(x, y);
    const P = live.current.props;
    if (hit >= 0) {
      const card = P.card || {};
      const spot = live.current.spots[hit];
      // On desktop (already shown via hover) or when clicking the already-open pin, navigate directly
      if (
        spot?.link &&
        (e.pointerType !== "touch" || pickedRef.current === hit || card.enabled === false)
      ) {
        if (P.onSelectLink) {
          P.onSelectLink(spot.source);
        } else {
          window.open(spot.link, card.newTab ? "_blank" : "_self");
        }
        return;
      }
      if (card.enabled !== false) {
        choose(hit, true);
      }
    } else if (pickedRef.current >= 0) {
      choose(-1, true);
    }
    wake();
  };

  const onLeave = () => {
    const S = st.current;
    S.inside = false;
    S.hover = -1;
    scheduleLeaveClose();
    wake();
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = spots.length;
    if (!n || cardCfg?.enabled === false) return;
    const hop = (dir: number) => {
      const pins = st.current.pins;
      for (let k = 1; k <= n; k++) {
        const j = (pickedRef.current + dir * k + n * 2) % n;
        if (pins[j] && inFrame(pins[j])) return j;
      }
      return -1;
    };
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      choose(hop(1), true);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      choose(hop(-1), true);
    } else if (e.key === "Escape") {
      choose(-1, true);
    }
  };

  const cur = picked >= 0 && cardCfg?.enabled !== false ? spots[picked] : null;
  const cardW = cardCfg?.width ?? 264;
  const radius = ui?.radius ?? 0;
  const shield = (e: PointerEvent) => e.stopPropagation();
  const showLegend = heatOn && hm?.legend !== false;
  const showChips = ui?.filters !== false && cats.length > 1;
  const catInk = (c: string) =>
    colorBy === "category" ? CATEGORY_INKS[cats.indexOf(c) % CATEGORY_INKS.length] : theme.muted;
  const curInk = cur ? pinInkFor(cur, cats, colorBy, theme, inks) : theme.accent;

  return (
    <div
      ref={hostRef}
      tabIndex={0}
      role="application"
      aria-label={ui?.ariaLabel || "Interactive dot-matrix location map"}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerLeave={onLeave}
      onKeyDown={onKey}
      className={`pp-root${props.className ? ` ${props.className}` : ""}`}
      style={{
        ...props.style,
        borderRadius: radius,
        background: theme.background,
        ["--pp-accent" as string]: theme.accent,
      }}
    >
      <span ref={probeRef} aria-hidden className="pp-probe" />
      <canvas ref={canvasRef} className="pp-canvas" />

      {ui?.readout !== false ? (
        <div
          className="pp-readout"
          style={{
            background: theme.panel,
            border: `1px solid ${theme.hairline}`,
            color: theme.muted,
          }}
        >
          <span className="pp-readout__dot" style={{ background: theme.accent }} />
          <span ref={readRef} />
        </div>
      ) : null}

      {showLegend || showChips ? (
        <div
          className="pp-hud-bottom"
          onPointerDown={shield}
          onPointerUp={shield}
          style={{
            background: theme.panel,
            border: `1px solid ${theme.hairline}`,
            color: theme.muted,
          }}
        >
          {showChips ? (
            <div className="pp-chips">
              {["", ...cats].map((c) => {
                const active = filter === c;
                return (
                  <button
                    key={c || "all"}
                    type="button"
                    className="pp-chip"
                    onClick={() => setFilter(c)}
                    style={{
                      border: `1px solid ${active ? theme.highlight : theme.hairline}`,
                      color: active ? theme.text : theme.muted,
                    }}
                  >
                    {c ? (
                      <span className="pp-chip__swatch" style={{ background: catInk(c) }} />
                    ) : null}
                    {c || ui?.allLabel || "All"}
                  </button>
                );
              })}
            </div>
          ) : null}

          {showLegend ? (
            <div className="pp-legend">
              <div className="pp-legend__bar" style={{ background: gradient }} />
              <div className="pp-legend__labels">
                <span>{hm?.lowLabel || "Low"}</span>
                <span>{hm?.highLabel || "High"}</span>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {props.controls !== false ? (
        <div
          className="pp-controls"
          onPointerDown={shield}
          onPointerUp={shield}
          role="group"
          aria-label="Map zoom controls"
        >
          <button
            type="button"
            className="pp-ctrl-btn"
            aria-label="Zoom in"
            disabled={zoomUi >= MAX_USER_ZOOM}
            onClick={() => applyUserZoom(1.35)}
          >
            +
          </button>
          <button
            type="button"
            className="pp-ctrl-btn"
            aria-label="Zoom out"
            disabled={zoomUi <= MIN_USER_ZOOM}
            onClick={() => applyUserZoom(1 / 1.35)}
          >
            −
          </button>
          <button
            type="button"
            className="pp-ctrl-btn"
            aria-label="Reset map view"
            disabled={Math.abs(zoomUi - 1) < 0.02 && !pannedUi}
            onClick={resetUserView}
          >
            ↺
          </button>
        </div>
      ) : null}

      <div
        ref={cardRef}
        className="pp-card-anchor"
        onPointerDown={shield}
        onPointerMove={shield}
        onPointerUp={shield}
        onMouseEnter={() => {
          cardHoveredRef.current = true;
          cancelLeaveClose();
        }}
        onMouseLeave={() => {
          cardHoveredRef.current = false;
          scheduleLeaveClose();
        }}
        style={{
          width: cardW,
          pointerEvents: cur ? "auto" : "none",
        }}
      >
        {cur ? (
          <div
            key={`${filter}-${picked}`}
            className={`pp-card${isKp2Theme ? " pp-card--kp2" : ""}`}
            style={{
              background: theme.panel,
              border: `1px solid ${theme.hairline}`,
              color: theme.text,
            }}
          >
            {cur.src && cardCfg?.showImage !== false ? (
              <div className="pp-card__media" style={{ background: theme.ocean }}>
                <img
                  src={cur.src}
                  alt={cur.alt || cur.title}
                  className="pp-card__img"
                  draggable={false}
                />
              </div>
            ) : null}

            <div
              className="pp-card__meta"
              style={{
                color: theme.muted,
                paddingRight: cur.src && cardCfg?.showImage !== false ? 0 : 28,
              }}
            >
              <span className="pp-card__cat">
                <span className="pp-card__cat-dot" style={{ background: curInk }} />
                {cur.category || `${pad2(picked + 1)} / ${pad2(spots.length)}`}
              </span>
              {cardCfg?.showCoords !== false ? (
                <span className="pp-card__coords">{coordLabel(cur.lat, cur.lon)}</span>
              ) : null}
            </div>

            {cur.title ? (
              <div className="pp-card__title" style={{ color: theme.text }}>
                {cur.title}
              </div>
            ) : null}

            {cur.caption ? (
              <div className="pp-card__caption" style={{ color: theme.muted }}>
                {cur.caption}
              </div>
            ) : null}

            {cardCfg?.meter !== false && Number.isFinite(cur.raw) ? (
              <div className="pp-card__meter" style={{ color: theme.muted }}>
                <span>{cardCfg?.meterLabel || "Activity"}</span>
                <div className="pp-card__meter-track" style={{ background: theme.hairline }}>
                  <div
                    className="pp-card__meter-fill"
                    style={{
                      width: `${Math.max(2, Math.round(cur.value * 100))}%`,
                      background: heatOn ? gradient : curInk,
                      backgroundSize: `${cur.value > 0 ? 100 / cur.value : 100}% 100%`,
                    }}
                  />
                </div>
                <span style={{ color: theme.text }}>{formatValue(cur.raw, cardCfg)}</span>
              </div>
            ) : null}

            {cur.link ? (
              <a
                href={cur.link}
                target={cardCfg?.newTab ? "_blank" : undefined}
                rel={cardCfg?.newTab ? "noopener noreferrer" : undefined}
                className="pp-card__link"
                style={{
                  borderTop: `1px solid ${theme.hairline}`,
                  color: theme.accent,
                }}
                onClick={(e) => {
                  if (props.onSelectLink && !cardCfg?.newTab) {
                    e.preventDefault();
                    props.onSelectLink(cur.source);
                  }
                }}
              >
                {cardCfg?.linkText || "View details"}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M2 8L8 2M3.5 2H8V6.5" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </a>
            ) : null}

            <button
              type="button"
              aria-label="Close"
              className="pp-card__close"
              onClick={() => choose(-1, true)}
              style={{
                top: cur.src && cardCfg?.showImage !== false ? 18 : 10,
                right: cur.src && cardCfg?.showImage !== false ? 18 : 10,
                border: `1px solid ${theme.hairline}`,
                background: theme.panel,
                color: theme.muted,
              }}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                <path d="M1 1L7 7M7 1L1 7" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Petitpoint;
