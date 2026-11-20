import { NextResponse } from "next/server";

type GeocodeResult = {
  lat: number;
  lng: number;
  label: string;
};

type CacheEntry = {
  value: GeocodeResult | null;
  expiresAt: number;
};

const CACHE_TTL_MS = 1000 * 60 * 60 * 24;
const CACHE_MAX_ENTRIES = 300;
const geocodeCache = new Map<string, CacheEntry>();

const UK_POSTCODE_RE = /^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i;
const UK_OUTCODE_RE = /^[a-z]{1,2}\d[a-z\d]?$/i;

function readCache(key: string): GeocodeResult | null | undefined {
  const entry = geocodeCache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    geocodeCache.delete(key);
    return undefined;
  }
  return entry.value;
}

function writeCache(key: string, value: GeocodeResult | null) {
  if (geocodeCache.size >= CACHE_MAX_ENTRIES) {
    const oldest = geocodeCache.keys().next().value;
    if (oldest) geocodeCache.delete(oldest);
  }
  geocodeCache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
}

async function lookupUkPostcode(query: string): Promise<GeocodeResult | null> {
  const compact = query.replace(/\s+/g, "").toUpperCase();

  if (UK_POSTCODE_RE.test(query)) {
    const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(compact)}`, {
      signal: AbortSignal.timeout(4500),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      result?: {
        postcode?: string;
        latitude?: number | null;
        longitude?: number | null;
        admin_district?: string | null;
        parish?: string | null;
        region?: string | null;
      };
    };
    const r = data.result;
    if (r?.latitude == null || r?.longitude == null) return null;
    const area = r.admin_district || r.parish || r.region;
    return {
      lat: r.latitude,
      lng: r.longitude,
      label: area ? `${r.postcode ?? compact} (${area})` : (r.postcode ?? compact),
    };
  }

  if (UK_OUTCODE_RE.test(query)) {
    const res = await fetch(`https://api.postcodes.io/outcodes/${encodeURIComponent(compact)}`, {
      signal: AbortSignal.timeout(4500),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      result?: {
        outcode?: string;
        latitude?: number | null;
        longitude?: number | null;
        admin_district?: string[];
        admin_county?: string[];
      };
    };
    const r = data.result;
    if (r?.latitude == null || r?.longitude == null) return null;
    const area = r.admin_district?.[0] || r.admin_county?.[0];
    return {
      lat: r.latitude,
      lng: r.longitude,
      label: area ? `${r.outcode ?? compact} (${area})` : (r.outcode ?? compact),
    };
  }

  return null;
}

async function lookupNominatim(query: string): Promise<GeocodeResult | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "1");
  url.searchParams.set("q", query);

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "KharisChurchWebsite/1.0 (https://kharis.org)",
      "Accept-Language": "en",
    },
    signal: AbortSignal.timeout(6000),
    next: { revalidate: 86400 },
  });

  if (!res.ok) return null;
  const rows = (await res.json()) as Array<{
    lat?: string;
    lon?: string;
    display_name?: string;
    address?: {
      road?: string;
      suburb?: string;
      town?: string;
      city?: string;
      village?: string;
      county?: string;
      postcode?: string;
      country?: string;
    };
  }>;

  const first = rows[0];
  if (!first?.lat || !first?.lon) return null;
  const lat = Number(first.lat);
  const lng = Number(first.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const addr = first.address;
  const parts = [
    addr?.road,
    addr?.suburb || addr?.town || addr?.city || addr?.village,
    addr?.postcode,
  ].filter(Boolean);

  const fallbackLabel = first.display_name
    ? first.display_name
        .split(",")
        .slice(0, 2)
        .map((s) => s.trim())
        .filter(Boolean)
        .join(", ")
    : query;

  return {
    lat,
    lng,
    label: parts.length ? parts.slice(0, 2).join(", ") : fallbackLabel,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = (searchParams.get("q") ?? "").trim();

  if (raw.length < 2 || raw.length > 200) {
    return NextResponse.json({ result: null }, { status: 200 });
  }

  const cacheKey = raw.toLowerCase().replace(/\s+/g, " ");
  const cached = readCache(cacheKey);
  if (cached !== undefined) {
    return NextResponse.json({ result: cached }, { status: 200 });
  }

  try {
    const result = (await lookupUkPostcode(raw)) ?? (await lookupNominatim(raw));
    writeCache(cacheKey, result);
    return NextResponse.json({ result }, { status: 200 });
  } catch {
    return NextResponse.json({ result: null }, { status: 200 });
  }
}
