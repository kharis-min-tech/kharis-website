import type { BranchData, Service, Venue } from "@/lib/branches";

/**
 * Development stand-in for the branch directory.
 *
 * Used only when Supabase is unconfigured, the same way `lib/testimonies.ts`
 * and `lib/youtube.ts` already fall back to built-in content. It exists so the
 * Locations globe — which needs real coordinates spread across three countries
 * to be worth looking at — renders offline and in CI without credentials.
 *
 * Coordinates are the real city centres; everything else is obviously
 * placeholder copy so a fixture can never be mistaken for live data.
 */

type Seed = {
  slug: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  group?: string;
};

const SEEDS: Seed[] = [
  { slug: "london", name: "London", city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
  { slug: "birmingham", name: "Birmingham", city: "Birmingham", country: "United Kingdom", lat: 52.4862, lng: -1.8904 },
  { slug: "manchester", name: "Manchester", city: "Manchester", country: "United Kingdom", lat: 53.4808, lng: -2.2426 },
  { slug: "nottingham", name: "Nottingham", city: "Nottingham", country: "United Kingdom", lat: 52.9548, lng: -1.1581 },
  { slug: "coventry", name: "Coventry", city: "Coventry", country: "United Kingdom", lat: 52.4068, lng: -1.5197 },
  { slug: "northampton", name: "Northampton", city: "Northampton", country: "United Kingdom", lat: 52.2405, lng: -0.9027 },
  { slug: "luton", name: "Luton", city: "Luton", country: "United Kingdom", lat: 51.8787, lng: -0.42 },
  { slug: "reading", name: "Reading", city: "Reading", country: "United Kingdom", lat: 51.4543, lng: -0.9781 },
  { slug: "bristol", name: "Bristol", city: "Bristol", country: "United Kingdom", lat: 51.4545, lng: -2.5879 },
  { slug: "brighton", name: "Brighton", city: "Brighton", country: "United Kingdom", lat: 50.8225, lng: -0.1372 },
  { slug: "croydon", name: "Croydon", city: "Croydon", country: "United Kingdom", lat: 51.3762, lng: -0.0982 },
  { slug: "orpington", name: "Orpington", city: "Orpington", country: "United Kingdom", lat: 51.3735, lng: 0.0988 },
  { slug: "chatham", name: "Chatham", city: "Chatham", country: "United Kingdom", lat: 51.38, lng: 0.52 },
  // Spelling matches the slug used by the live directory and globe photo map.
  { slug: "chelmesford", name: "Chelmsford", city: "Chelmsford", country: "United Kingdom", lat: 51.7356, lng: 0.4685 },
  { slug: "accra", name: "Accra", city: "Accra", country: "Ghana", lat: 5.6037, lng: -0.187 },
  { slug: "freetown", name: "Freetown", city: "Freetown", country: "Sierra Leone", lat: 8.4657, lng: -13.2317 },
  { slug: "kp2-barking", name: "KP2 Barking", city: "Barking", country: "United Kingdom", lat: 51.5362, lng: 0.0798, group: "Kharis Phase 2" },
  { slug: "kp2-romford", name: "KP2 Romford", city: "Romford", country: "United Kingdom", lat: 51.5812, lng: 0.1837, group: "Kharis Phase 2" },
  { slug: "kp2-peterborough", name: "KP2 Peterborough", city: "Peterborough", country: "United Kingdom", lat: 52.5695, lng: -0.2405, group: "Kharis Phase 2" },
  { slug: "kp2-southampton", name: "KP2 Southampton", city: "Southampton", country: "United Kingdom", lat: 50.9097, lng: -1.4044, group: "Kharis Phase 2" },
];

function venueFor(seed: Seed): Venue {
  return {
    id: `${seed.slug}-sunday-venue`,
    branch_id: seed.slug,
    name: "Sunday Service",
    address_line1: `${seed.city} Community Hall`,
    address_line2: null,
    city: seed.city,
    postcode: null,
    country: seed.country,
    latitude: seed.lat,
    longitude: seed.lng,
    parking_info: null,
    public_transport_info: null,
    directions_text: null,
  };
}

function serviceFor(seed: Seed): Service {
  return {
    id: `${seed.slug}-sunday`,
    branch_id: seed.slug,
    name: "Sunday Service",
    type: "sunday",
    day: "Sunday",
    start_time: "10:30",
    end_time: "12:30",
    venue_id: `${seed.slug}-sunday-venue`,
    description: null,
    sort_order: 0,
    is_active: true,
  };
}

export const BRANCH_FIXTURE: BranchData[] = SEEDS.map((seed, index) => ({
  id: seed.slug,
  name: seed.name,
  slug: seed.slug,
  subtitle: "Sample branch (development data)",
  group: seed.group ?? "Kharis",
  short_description: "Placeholder branch used when the directory is unavailable.",
  description: "Placeholder branch used when the directory is unavailable.",
  hero_image_url: null,
  hero_subtitle: null,
  gradient_start: null,
  gradient_end: null,
  pastor_name: null,
  pastor_image_url: null,
  pastor_bio: null,
  pastor_role: null,
  contact_email: `${seed.slug.replace(/^kp2-/, "")}@example.invalid`,
  contact_phone: "+44 20 7946 0000",
  instagram: null,
  sort_order: index,
  is_active: true,
  venues: [venueFor(seed)],
  services: [serviceFor(seed)],
  gallery: [],
}));
