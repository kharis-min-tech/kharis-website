/**
 * The shape the Locations globe needs from a branch: a point on the sphere
 * plus enough to label and link it. Lives here rather than beside a component
 * so the server page can build it without importing any client code.
 */
export interface GlobeBranch {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  country: string | null;
  photo?: string;
  city?: string | null;
}
