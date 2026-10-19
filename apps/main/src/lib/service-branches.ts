import { BRANCHES_DATA } from "@/data/branchesData";
import type { BranchEvent } from "@/data/branchesData";
import { listBranchData, type BranchData, type Service, type Venue } from "@/lib/branches";

/** Where and when one kind of service meets at a branch. */
export type ServiceVisit = {
  day: string;
  times: string[];
  venue: string;
  address: string;
  mapsUrl: string;
};

/** Branch selection and special-event data used by the Events page. */
export type ServiceBranch = {
  slug: string;
  name: string;
  group: "kharis" | "kp2";
  href: string;
  country: string | null;
  sunday: ServiceVisit | null;
  midweek: ServiceVisit | null;
  upcomingEvents: BranchEvent[];
};

function staticCountry(slug: string) {
  const b = BRANCHES_DATA[slug];
  if (!b) return null;
  return b.region === "International" ? (b.fullAddress.split(", ").at(-1) ?? null) : "United Kingdom";
}

function formatTime(time: string) {
  const [h, m = "00"] = time.split(":");
  const hour = Number(h);
  if (Number.isNaN(hour)) return time;
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
}

function directionsUrl(destination: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

function visitFrom(services: Service[], venues: Venue[]): ServiceVisit | null {
  const first = services[0];
  if (!first) return null;

  const venue = venues.find((v) => v.id === first.venue_id) ?? venues[0];
  const sameDay = services.filter((s) => s.day === first.day);
  const venueName = venue?.address_line1 || venue?.name || "";
  const rest = [venue?.address_line2, venue?.city, venue?.postcode].filter(Boolean).join(", ");
  const full = [venueName, rest].filter(Boolean).join(", ");
  const coords =
    venue?.latitude != null && venue?.longitude != null
      ? `${venue.latitude},${venue.longitude}`
      : "";

  return {
    day: first.day,
    times: sameDay.map((s) => formatTime(s.start_time)).filter(Boolean),
    venue: venueName,
    address: rest,
    mapsUrl: full || coords ? directionsUrl(full || coords) : "",
  };
}

function fromSupabase(branch: BranchData): ServiceBranch {
  const active = branch.services.filter((s) => s.is_active);
  const ofType = (type: string) => active.filter((s) => s.type?.toLowerCase() === type);

  return {
    slug: branch.slug,
    name: branch.name.replace(/ Branch$/i, ""),
    group: branch.slug.startsWith("kp2-") ? "kp2" : "kharis",
    href: `/locations/${branch.slug}`,
    country: branch.venues.find((v) => v.country)?.country ?? staticCountry(branch.slug),
    sunday: visitFrom(ofType("sunday"), branch.venues),
    midweek: visitFrom(ofType("midweek"), branch.venues),
    upcomingEvents: BRANCHES_DATA[branch.slug]?.upcomingEvents ?? [],
  };
}

function fromStatic(): ServiceBranch[] {
  return Object.values(BRANCHES_DATA).map((b) => {
    const mapsUrl = directionsUrl(b.fullAddress);
    const [venue, ...rest] = b.fullAddress.split(", ");
    const base = { venue: venue ?? b.fullAddress, address: rest.join(", "), mapsUrl };

    return {
      slug: b.slug,
      name: b.city,
      group: "kharis" as const,
      href: `/locations/${b.slug}`,
      country: staticCountry(b.slug),
      sunday: b.serviceTimes.length
        ? { ...base, day: "Sunday", times: b.serviceTimes.map((t) => `${t.time} ${t.ampm}`) }
        : null,
      midweek: b.midweek
        ? { ...base, day: b.midweek.day, times: [`${b.midweek.time} ${b.midweek.ampm}`] }
        : null,
      upcomingEvents: b.upcomingEvents,
    };
  });
}

/** Branch service times and venues, from the same source as /locations. */
export async function listServiceBranches(): Promise<ServiceBranch[]> {
  const branches = await listBranchData();
  return branches.length ? branches.map(fromSupabase) : fromStatic();
}
