export type Branch = {
  slug: string;
  name: string;
  city: string;
  region: string;
  address: string;
  postcode: string;
  lat: number;
  lng: number;
  serviceTimes: { day: string; time: string; label: string }[];
  pastor: string;
  pastorRole: string;
  phone: string;
  email: string;
  instagram: string;
  blurb: string;
  tags: string[];
  image: string;
};

/** Placeholder data — swap for a Cloud query when the backend lands. */
export const BRANCHES: Branch[] = [
  {
    slug: "london-central",
    name: "Kharis Phase 2 — London Central",
    city: "London",
    region: "Greater London",
    address: "112 Great Eastern Street, Shoreditch",
    postcode: "EC2A 3JL",
    lat: 51.5253,
    lng: -0.0817,
    serviceTimes: [
      { day: "Sunday", time: "10:30 AM", label: "Main Gathering" },
      { day: "Thursday", time: "7:00 PM", label: "Midweek Encounter" },
    ],
    pastor: "Pastor David Oyelami",
    pastorRole: "Campus Pastor",
    phone: "+44 20 7946 0101",
    email: "london@kharisphase2.org",
    instagram: "@kp2london",
    blurb:
      "Our flagship campus in the heart of the city — a young, loud, sending church built for students, creatives and professionals.",
    tags: ["Students", "Young Adults", "Kids Ministry"],
    image: "/assets/branch-slide-1.jpg",
  },
  {
    slug: "manchester",
    name: "Kharis Phase 2 — Manchester",
    city: "Manchester",
    region: "North West",
    address: "45 Oxford Road, City Centre",
    postcode: "M1 5QA",
    lat: 53.4739,
    lng: -2.2374,
    serviceTimes: [
      { day: "Sunday", time: "11:00 AM", label: "Main Gathering" },
      { day: "Wednesday", time: "6:30 PM", label: "Fellowship Night" },
    ],
    pastor: "Pastor Awo Mensah",
    pastorRole: "Campus Pastor",
    phone: "+44 161 496 0102",
    email: "manchester@kharisphase2.org",
    instagram: "@kp2manchester",
    blurb:
      "A student-heavy campus with a heart for the streets — worship, discipleship and outreach across Greater Manchester.",
    tags: ["Students", "Outreach", "Worship School"],
    image: "/assets/branch-slide-1.jpg",
  },
  {
    slug: "birmingham",
    name: "Kharis Phase 2 — Birmingham",
    city: "Birmingham",
    region: "West Midlands",
    address: "8 Digbeth High Street",
    postcode: "B5 6DY",
    lat: 52.4776,
    lng: -1.888,
    serviceTimes: [
      { day: "Sunday", time: "10:00 AM", label: "Main Gathering" },
      { day: "Friday", time: "7:30 PM", label: "Prayer & Praise" },
    ],
    pastor: "Pastor Naomi Adeyemi",
    pastorRole: "Campus Pastor",
    phone: "+44 121 496 0103",
    email: "birmingham@kharisphase2.org",
    instagram: "@kp2birmingham",
    blurb:
      "Family-centred and multicultural, our Birmingham campus is a home for every generation in the Midlands.",
    tags: ["Families", "Kids Ministry", "Prayer"],
    image: "/assets/branch-slide-1.jpg",
  },
  {
    slug: "leeds",
    name: "Kharis Phase 2 — Leeds",
    city: "Leeds",
    region: "Yorkshire",
    address: "23 Call Lane, City Centre",
    postcode: "LS1 7BT",
    lat: 53.7955,
    lng: -1.5401,
    serviceTimes: [
      { day: "Sunday", time: "4:00 PM", label: "Evening Gathering" },
      { day: "Tuesday", time: "7:00 PM", label: "Bible Study" },
    ],
    pastor: "Pastor Josh Kimani",
    pastorRole: "Campus Lead",
    phone: "+44 113 496 0104",
    email: "leeds@kharisphase2.org",
    instagram: "@kp2leeds",
    blurb:
      "A church plant on the rise — small enough to know your name, bold enough to shake the city.",
    tags: ["Church Plant", "Students", "Small Groups"],
    image: "/assets/branch-slide-1.jpg",
  },
  {
    slug: "glasgow",
    name: "Kharis Phase 2 — Glasgow",
    city: "Glasgow",
    region: "Scotland",
    address: "60 Sauchiehall Street",
    postcode: "G2 3AF",
    lat: 55.8652,
    lng: -4.2576,
    serviceTimes: [
      { day: "Sunday", time: "11:30 AM", label: "Main Gathering" },
    ],
    pastor: "Pastor Ruth Campbell",
    pastorRole: "Campus Lead",
    phone: "+44 141 496 0105",
    email: "glasgow@kharisphase2.org",
    instagram: "@kp2glasgow",
    blurb:
      "Our northern-most campus, gathering students and families for worship every Sunday morning.",
    tags: ["Students", "Families"],
    image: "/assets/branch-slide-1.jpg",
  },
  {
    slug: "online",
    name: "Kharis Phase 2 — Online",
    city: "Online",
    region: "Everywhere",
    address: "Streaming wherever you are",
    postcode: "WWW",
    lat: 51.5072,
    lng: -0.1276,
    serviceTimes: [
      { day: "Sunday", time: "10:30 AM", label: "Live Stream" },
      { day: "Daily", time: "6:00 AM", label: "Morning Prayer Call" },
    ],
    pastor: "The Kharis Team",
    pastorRole: "Digital Campus",
    phone: "+44 20 7946 0100",
    email: "online@kharisphase2.org",
    instagram: "@kharisphase2",
    blurb:
      "No campus near you? Join the digital campus — live chat, prayer rooms and online community groups.",
    tags: ["Digital", "Global", "Prayer"],
    image: "/assets/branch-slide-1.jpg",
  },
];

export function getBranch(slug: string) {
  return BRANCHES.find((b) => b.slug === slug);
}

/** Great-circle distance in miles. */
export function distanceMiles(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function osmEmbedUrl(branch: { lat: number; lng: number }, zoomPad = 0.06) {
  const { lat, lng } = branch;
  const bbox = [lng - zoomPad, lat - zoomPad / 2, lng + zoomPad, lat + zoomPad / 2]
    .map((n) => n.toFixed(4))
    .join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}
