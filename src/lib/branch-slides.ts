export type BranchSlide = {
  name: string;
  href: string;
  title: string;
  subtitle: string;
  address?: string;
  image: string;
  accent: string;
};

/** Featured carousel slides — real branch names only */
const FEATURED = [
  {
    name: "KP2 Birmingham",
    href: "https://kharis.org/kp2/",
    title: "KP2",
    subtitle: "BIRMINGHAM",
    address: "Holly Ln, Erdington",
    accent: "#FD7F20",
    image: "/images/branch-slide-1.jpg",
  },
  {
    name: "KP2 London",
    href: "https://kharis.org/kp2/",
    title: "KP2",
    subtitle: "LONDON",
    address: "Kensington Town Hall, Horton Street",
    accent: "#800654",
    image: "/images/branch-slide-2.jpg",
  },
  {
    name: "Kharis Accra",
    href: "https://kharis.org/locations/accra/",
    title: "KHARIS",
    subtitle: "ACCRA",
    address: "Narpo Hotels, Nsawam Road, Near Mile 7 Police Station",
    accent: "#FD7F20",
    image: "/images/branch-slide-3.jpg",
  },
  {
    name: "Kharis Freetown",
    href: "https://kharis.org/locations/freetown/",
    title: "KHARIS",
    subtitle: "FREETOWN",
    address: "Robert Hall, 23 Robert Street",
    accent: "#800654",
    image: "/images/branch-slide-4.jpg",
  },
  {
    name: "Kharis Brighton",
    href: "https://kharis.org/locations/brighton/",
    title: "KHARIS",
    subtitle: "BRIGHTON",
    address: "Kharis Church Brighton, Richmond Parade, Brighton BN2 9AA",
    accent: "#FD7F20",
    image: "/images/branch-slide-5.jpg",
  },
] as const;

export async function fetchBranchSlides(): Promise<BranchSlide[]> {
  return FEATURED.map((b) => ({
    name: b.name,
    href: b.href,
    title: b.title,
    subtitle: b.subtitle,
    address: b.address,
    accent: b.accent,
    image: b.image,
  }));
}
