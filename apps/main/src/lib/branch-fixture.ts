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
  {
    slug: "london",
    name: "London",
    city: "London",
    country: "United Kingdom",
    lat: 51.5074,
    lng: -0.1278,
  },
  {
    slug: "birmingham",
    name: "Birmingham",
    city: "Birmingham",
    country: "United Kingdom",
    lat: 52.4862,
    lng: -1.8904,
  },
  {
    slug: "manchester",
    name: "Manchester",
    city: "Manchester",
    country: "United Kingdom",
    lat: 53.4808,
    lng: -2.2426,
  },
  {
    slug: "nottingham",
    name: "Nottingham",
    city: "Nottingham",
    country: "United Kingdom",
    lat: 52.9548,
    lng: -1.1581,
  },
  {
    slug: "coventry",
    name: "Coventry",
    city: "Coventry",
    country: "United Kingdom",
    lat: 52.4068,
    lng: -1.5197,
  },
  {
    slug: "northampton",
    name: "Northampton",
    city: "Northampton",
    country: "United Kingdom",
    lat: 52.2405,
    lng: -0.9027,
  },
  {
    slug: "luton",
    name: "Luton",
    city: "Luton",
    country: "United Kingdom",
    lat: 51.8787,
    lng: -0.42,
  },
  {
    slug: "reading",
    name: "Reading",
    city: "Reading",
    country: "United Kingdom",
    lat: 51.4543,
    lng: -0.9781,
  },
  {
    slug: "bristol",
    name: "Bristol",
    city: "Bristol",
    country: "United Kingdom",
    lat: 51.4545,
    lng: -2.5879,
  },
  {
    slug: "brighton",
    name: "Brighton",
    city: "Brighton",
    country: "United Kingdom",
    lat: 50.8225,
    lng: -0.1372,
  },
  {
    slug: "croydon",
    name: "Croydon",
    city: "Croydon",
    country: "United Kingdom",
    lat: 51.3762,
    lng: -0.0982,
  },
  {
    slug: "orpington",
    name: "Orpington",
    city: "Orpington",
    country: "United Kingdom",
    lat: 51.3735,
    lng: 0.0988,
  },
  {
    slug: "chatham",
    name: "Chatham",
    city: "Chatham",
    country: "United Kingdom",
    lat: 51.38,
    lng: 0.52,
  },
  // Spelling matches the slug used by the live directory and globe photo map.
  {
    slug: "chelmesford",
    name: "Chelmsford",
    city: "Chelmsford",
    country: "United Kingdom",
    lat: 51.7356,
    lng: 0.4685,
  },
  { slug: "accra", name: "Accra", city: "Accra", country: "Ghana", lat: 5.6037, lng: -0.187 },
  {
    slug: "freetown",
    name: "Freetown",
    city: "Freetown",
    country: "Sierra Leone",
    lat: 8.4657,
    lng: -13.2317,
  },
  {
    slug: "kp2-barking",
    name: "KP2 Barking",
    city: "Barking",
    country: "United Kingdom",
    lat: 51.5362,
    lng: 0.0798,
    group: "Kharis Phase 2",
  },
  {
    slug: "kp2-romford",
    name: "KP2 Romford",
    city: "Romford",
    country: "United Kingdom",
    lat: 51.5812,
    lng: 0.1837,
    group: "Kharis Phase 2",
  },
  {
    slug: "kp2-peterborough",
    name: "KP2 Peterborough",
    city: "Peterborough",
    country: "United Kingdom",
    lat: 52.5695,
    lng: -0.2405,
    group: "Kharis Phase 2",
  },
  {
    slug: "kp2-southampton",
    name: "KP2 Southampton",
    city: "Southampton",
    country: "United Kingdom",
    lat: 50.9097,
    lng: -1.4044,
    group: "Kharis Phase 2",
  },
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

const IMG = "https://images.kharis.org/site-images/main";

/**
 * One branch filled in, so the branch PAGE can be looked at.
 *
 * The seeds above are enough for the directory and the globe, which only need
 * a name and a coordinate. A branch page is a different question: it asks for
 * a hero, a pastor with a portrait and a bio, several services across the
 * week, a venue that knows about parking and trains, and a gallery. With the
 * bare seed every one of those sections either collapsed or fell back to
 * "coming soon", so the page could not be judged at all.
 *
 * Only London. Every other branch keeps the thin seed, which is also useful:
 * it is exactly what a newly added branch looks like before anyone fills it
 * in, and the page has to survive that too.
 *
 * The photographs are real Kharis ones, because layout cannot be judged
 * against grey boxes. The words are not: they are sample copy at roughly the
 * length real copy would run to, and the contact details are reserved
 * example.invalid addresses. This whole file is only reachable when Supabase
 * is unconfigured, which is to say never in production.
 */
const LONDON_MOCK: Partial<BranchData> = {
  subtitle: "Sample branch (development data)",
  short_description:
    "A church family in the heart of London, gathering every Sunday to worship, to sit under the Word, and to look after one another through the week.",
  description:
    "Kharis London has met in the city since 2003. Sundays are unhurried and warm: worship, teaching you can take into Monday, and time afterwards over coffee with people who will remember your name. Through the week we gather in smaller rooms to pray, to study, and to carry whatever each of us is carrying.",
  hero_image_url: `${IMG}/60262eef48c53cc5/locations/london-sunday-smiles.jpg`,
  pastor_name: "Pastor Sample Name",
  pastor_role: "Branch Pastor",
  pastor_image_url: `${IMG}/e666a073b590b3ff/leadership/pastor-david-sunday.jpg`,
  pastor_bio:
    "Come as you are. You will not be singled out, asked for anything, or left standing on your own.",
  instagram: "https://instagram.com/example",
  gallery: [
    `${IMG}/8687dacfd8faa5e2/locations/london-sunday-laughter.jpg`,
    `${IMG}/894014bef2ca905c/locations/london-sunday-prayer.jpg`,
    `${IMG}/fd4b6a19fbb8f4d3/events/sunday-worship-hands.jpg`,
    `${IMG}/2bf8a23f06e5bb67/events/hero-worship.jpg`,
    `${IMG}/548f1d84de49653b/contact/after-service-handshake.jpg`,
    `${IMG}/8527db06a4968c60/give/thanksgiving-hands-raised.jpg`,
  ],
  venues: [
    {
      id: "london-sunday-venue",
      branch_id: "london",
      name: "Sunday Service",
      address_line1: "Kharis Centre, 120 Sample Street",
      address_line2: "Southwark",
      city: "London",
      postcode: "SE1 0AA",
      country: "United Kingdom",
      latitude: 51.5074,
      longitude: -0.1278,
      parking_info:
        "Free on the street after 6.30pm and all day Sunday. A small car park behind the building fills by 10am, and there is a multi-storey five minutes' walk away.",
      public_transport_info:
        "Two minutes from London Bridge (Jubilee and Northern lines, and National Rail). Buses 43, 141 and 521 stop outside.",
      directions_text: null,
    },
  ],
  services: [
    {
      id: "london-sunday-1",
      branch_id: "london",
      name: "First Service",
      type: "sunday",
      day: "Sunday",
      start_time: "09:00",
      end_time: "10:45",
      venue_id: "london-sunday-venue",
      description: "Quieter, and the easiest one to slip into if you are visiting.",
      sort_order: 0,
      is_active: true,
    },
    {
      id: "london-sunday-2",
      branch_id: "london",
      name: "Second Service",
      type: "sunday",
      day: "Sunday",
      start_time: "11:30",
      end_time: "13:30",
      venue_id: "london-sunday-venue",
      description: "Our fullest gathering, with children's church running alongside.",
      sort_order: 1,
      is_active: true,
    },
    {
      id: "london-prayer",
      branch_id: "london",
      name: "Midweek Prayer",
      type: "midweek",
      day: "Tuesday",
      start_time: "19:00",
      end_time: "20:00",
      venue_id: "london-sunday-venue",
      description: "On Zoom and in the building.",
      sort_order: 2,
      is_active: true,
    },
    {
      id: "london-bible-study",
      branch_id: "london",
      name: "Bible Study",
      type: "midweek",
      day: "Thursday",
      start_time: "19:30",
      end_time: "21:00",
      venue_id: "london-sunday-venue",
      description: "Working through a book of the Bible together.",
      sort_order: 3,
      is_active: true,
    },
  ],
};

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
  ...(seed.slug === "london" ? LONDON_MOCK : {}),
}));
