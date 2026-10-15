/** Pure helpers for showing branch details on the contact page. */

export interface ContactVenue {
  id: string;
  name: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postcode: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface ContactService {
  id: string;
  name: string | null;
  type: string | null;
  day: string | null;
  start_time: string | null;
  venue_id: string | null;
  sort_order: number | null;
  is_active: boolean | null;
}

export interface ContactLocation {
  id: string;
  slug: string;
  name: string;
  contact_email: string | null;
  contact_phone: string | null;
  pastor_name: string | null;
  pastor_role: "pastor" | "lead" | null;
  /** Set in the content studio: "kharis", "kp2" or "general". */
  workspace?: string | null;
  venues: ContactVenue[];
  services: ContactService[];
}

/** "09:00:00" → "9:00 AM" */
export function formatServiceTime(time: string | null | undefined): string {
  if (!time) return "";
  const [h, m = "00"] = time.split(":");
  const hour = Number(h);
  if (!h || !Number.isFinite(hour)) return "";
  return `${hour % 12 || 12}:${m.padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
}

function activeServices(branch: ContactLocation, type: "sunday" | "midweek") {
  return (branch.services ?? [])
    .filter((s) => s.is_active !== false && s.type?.toLowerCase() === type)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

export type BranchSchedule = {
  /** "9:00 AM", or "11:00 AM & 1:00 PM" for two services */
  sunday: string;
  /** e.g. [{ day: "Thursday", time: "7:00 PM" }] */
  midweek: { day: string; time: string }[];
};

const isSunday = (s: ContactService) => s.day?.trim().toLowerCase() === "sunday";

export function branchSchedule(branch: ContactLocation): BranchSchedule {
  // Some branches log a Sunday evening service as "midweek"; visitors read it as another Sunday time.
  const sundayServices = [
    ...activeServices(branch, "sunday"),
    ...activeServices(branch, "midweek").filter(isSunday),
  ];
  const sunday = [
    ...new Set(
      sundayServices
        .map((s) => s.start_time ?? "")
        .filter(Boolean)
        .sort()
        .map((t) => formatServiceTime(t)),
    ),
  ]
    .filter(Boolean)
    .join(" & ");

  const seen = new Set<string>();
  const midweek = activeServices(branch, "midweek")
    .filter((s) => !isSunday(s))
    .map((s) => ({ day: s.day ?? "", time: formatServiceTime(s.start_time) }))
    .filter((s) => {
      const key = `${s.day} ${s.time}`;
      if (!s.day || !s.time || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  return { sunday, midweek };
}

/** The venue of the first Sunday service, else the first venue listed. */
export function primaryVenue(branch: ContactLocation): ContactVenue | null {
  const sundayVenueId = activeServices(branch, "sunday")[0]?.venue_id;
  return (
    branch.venues.find((v) => sundayVenueId && v.id === sundayVenueId) ?? branch.venues[0] ?? null
  );
}

const GENERIC_VENUE_NAME = /\b(sunday|midweek)\s+(service|venue)\b/i;

function normalisePart(part: string) {
  return part
    .toLowerCase()
    .replace(/[(),./]/g, " ")
    .replace(/\brd\b/g, "road")
    .replace(/\bst\b/g, "street")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Address lines as people would write them. Venue rows often repeat a line
 * ("Carnation Road, Carnation Road") or carry a label instead of a place name
 * ("Sunday Service"), so repeats and labels are dropped.
 */
export function venueAddressParts(venue: ContactVenue | null): string[] {
  if (!venue) return [];
  const raw = [venue.name, venue.address_line1, venue.address_line2, venue.city, venue.postcode]
    .map((p) => p?.trim() ?? "")
    .filter((p) => p && !GENERIC_VENUE_NAME.test(p));

  return raw.filter((part, i) => {
    const norm = normalisePart(part);
    return !raw.some((other, j) => {
      if (j === i) return false;
      const otherNorm = normalisePart(other);
      // An exact repeat keeps its first copy; a part inside a longer one goes.
      return otherNorm === norm ? j < i : ` ${otherNorm} `.includes(` ${norm} `);
    });
  });
}

export function venueAddress(venue: ContactVenue | null): string {
  return venueAddressParts(venue).join(", ");
}

function mapsQuery(venue: ContactVenue | null) {
  if (!venue) return "";
  if (venue.latitude != null && venue.longitude != null) {
    return `${venue.latitude},${venue.longitude}`;
  }
  return [venueAddress(venue), venue.country].filter(Boolean).join(", ");
}

export function directionsUrl(venue: ContactVenue | null): string | null {
  const q = mapsQuery(venue);
  return q ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}` : null;
}

export function mapEmbedUrl(venue: ContactVenue | null): string | null {
  const q = mapsQuery(venue);
  return q ? `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed` : null;
}

/** Hides placeholder numbers such as "+44 0000 000000" that are still in the directory. */
export function publicPhone(phone: string | null | undefined): string | null {
  const trimmed = phone?.trim() ?? "";
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 9 || /0{6,}/.test(digits)) return null;
  return trimmed;
}

/** tel: link that keeps the + and drops the "(0)" trunk prefix. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/\(0\)/g, "").replace(/[^\d+]/g, "")}`;
}

export function isUkBranch(branch: ContactLocation): boolean {
  const country = primaryVenue(branch)?.country ?? "";
  return !country || /united kingdom|^uk$|england|scotland|wales/i.test(country);
}

/**
 * KP2 or Kharis, from the workspace set in the content studio. Rows left on the default
 * "general" workspace fall back to their name ("KP2 London").
 */
export function isKp2Branch(branch: Pick<ContactLocation, "name" | "workspace">): boolean {
  if (branch.workspace === "kp2") return true;
  if (branch.workspace === "kharis") return false;
  return /^KP2\b/i.test(branch.name.trim());
}

/** Branch names as the public sees them. Fixes a misspelling still in the directory. */
export function branchDisplayName(name: string): string {
  return name.replace(/^Chelmesford\b/, "Chelmsford");
}
