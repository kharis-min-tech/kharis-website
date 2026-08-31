export type Branch = {
  name: string;
  address?: string;
  city: string;
  region: "United Kingdom" | "International";
  href: string;
  lat: number;
  lng: number;
};

/** Official branch list — names and venues as provided */
export const BRANCHES: Branch[] = [
  {
    name: "Kharis Accra",
    address: "Narpo Hotels, Nsawam Road, Near Mile 7 Police Station",
    city: "Accra",
    region: "International",
    href: "https://kharis.org/locations/accra/",
    lat: 5.6865,
    lng: -0.222,
  },
  {
    name: "Kharis Birmingham",
    city: "Birmingham",
    region: "United Kingdom",
    href: "https://kharis.org/locations/birmingham/",
    lat: 52.4862,
    lng: -1.8904,
  },
  {
    name: "Kharis Brighton",
    address: "Kharis Church Brighton, Richmond Parade, Brighton BN2 9AA",
    city: "Brighton",
    region: "United Kingdom",
    href: "https://kharis.org/locations/brighton/",
    lat: 50.8284,
    lng: -0.1292,
  },
  {
    name: "Kharis Bristol",
    city: "Bristol",
    region: "United Kingdom",
    href: "https://kharis.org/locations/bristol/",
    lat: 51.4545,
    lng: -2.5879,
  },
  {
    name: "Kharis Chatham",
    address: "Strood Academy, Carnation Rd",
    city: "Chatham",
    region: "United Kingdom",
    href: "https://kharis.org/locations/chatham/",
    lat: 51.3965,
    lng: 0.488,
  },
  {
    name: "Kharis Chelmsford",
    city: "Chelmsford",
    region: "United Kingdom",
    href: "https://kharis.org/locations/chelmsford/",
    lat: 51.7356,
    lng: 0.4685,
  },
  {
    name: "Kharis Coventry",
    address: "The Caribbean Centre, 159 Spon Street",
    city: "Coventry",
    region: "United Kingdom",
    href: "https://kharis.org/locations/coventry/",
    lat: 52.4073,
    lng: -1.518,
  },
  {
    name: "Kharis Croydon",
    city: "Croydon",
    region: "United Kingdom",
    href: "https://kharis.org/locations/croydon/",
    lat: 51.3762,
    lng: -0.0982,
  },
  {
    name: "Kharis Freetown",
    address: "Robert Hall, 23 Robert Street",
    city: "Freetown",
    region: "International",
    href: "https://kharis.org/locations/freetown/",
    lat: 8.484,
    lng: -13.2299,
  },
  {
    name: "Kharis London",
    address: "Kensington Townhall, Hornton Street",
    city: "London",
    region: "United Kingdom",
    href: "https://kharis.org/locations/london/",
    lat: 51.5015,
    lng: -0.1947,
  },
  {
    name: "Kharis Luton",
    city: "Luton",
    region: "United Kingdom",
    href: "https://kharis.org/locations/luton/",
    lat: 51.8787,
    lng: -0.42,
  },
  {
    name: "Kharis Northampton",
    city: "Northampton",
    region: "United Kingdom",
    href: "https://kharis.org/locations/northampton/",
    lat: 52.2405,
    lng: -0.9027,
  },
  {
    name: "Kharis Nottingham",
    address:
      "Bluecoat Wollaton Academy, Sutton Passeys Crescent, Wollaton Park",
    city: "Nottingham",
    region: "United Kingdom",
    href: "https://kharis.org/locations/nottingham/",
    lat: 52.9515,
    lng: -1.214,
  },
  {
    name: "Kharis Orpington",
    city: "Orpington",
    region: "United Kingdom",
    href: "https://kharis.org/locations/orpington/",
    lat: 51.3742,
    lng: 0.0977,
  },
  {
    name: "Kharis Reading",
    city: "Reading",
    region: "United Kingdom",
    href: "https://kharis.org/locations/reading/",
    lat: 51.4543,
    lng: -0.9781,
  },
  {
    name: "KP2 Birmingham",
    address: "Holly Ln, Erdington",
    city: "Birmingham",
    region: "United Kingdom",
    href: "https://kharis.org/kp2/",
    lat: 52.523,
    lng: -1.839,
  },
  {
    name: "KP2 London",
    address: "Kensington Town Hall, Horton Street",
    city: "London",
    region: "United Kingdom",
    href: "https://kharis.org/kp2/",
    lat: 51.5018,
    lng: -0.1952,
  },
  {
    name: "Manchester",
    city: "Manchester",
    region: "United Kingdom",
    href: "https://kharis.org/",
    lat: 53.4808,
    lng: -2.2426,
  },
];

export function branchQuery(branch: Branch) {
  return encodeURIComponent(
    [branch.name, branch.address, branch.city].filter(Boolean).join(", "),
  );
}

export function branchDirectionsUrl(branch: Branch) {
  return `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`;
}
