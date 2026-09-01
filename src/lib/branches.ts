/**
 * Branch data layer — the ONLY place the locations pages read data from.
 *
 * Right now everything is served from the static file `src/data/branchesData.ts`.
 * All functions are async on purpose: when you move the content into Supabase,
 * replace the bodies below with queries and nothing else in the app has to change.
 *
 * See README.md ("Swapping in Supabase") for the exact swap points.
 */
import { BRANCHES_DATA, type BranchData } from "@/data/branchesData";

/** Card-level projection used by the /locations grid. */
export interface BranchItem {
  id: string;
  name: string;
  city: string;
  region: BranchData["region"];
  heroImage: string;
  postcode: string;
  address: string;
  description: string;
  serviceSummary: string;
  midweekSummary?: string;
}

/** Everything a single branch page needs. */
export interface BranchDetail {
  id: string;
  branch: BranchData;
  /** id/name pairs for the in-page branch switcher. */
  siblings: { id: string; name: string }[];
}

function toBranchItem(branch: BranchData): BranchItem {
  const first = branch.serviceTimes[0];
  return {
    id: branch.slug,
    name: branch.name,
    city: branch.city,
    region: branch.region,
    heroImage: branch.heroImage,
    postcode: branch.postcode,
    address: branch.address,
    description: branch.description,
    serviceSummary: first ? `Sunday ${first.time} ${first.ampm}` : "Sundays 10:00 AM",
    midweekSummary: branch.midweek
      ? `${branch.midweek.day} ${branch.midweek.time} ${branch.midweek.ampm}`
      : undefined,
  };
}

/** Full branch records, ordered as defined in the data file. */
export async function listBranchData(): Promise<BranchData[]> {
  return Object.values(BRANCHES_DATA);
}

/** Card projections for the directory grid. */
export async function listBranches(): Promise<BranchItem[]> {
  const branches = await listBranchData();
  return branches.map(toBranchItem);
}

/** Slugs for `generateStaticParams`. */
export async function listBranchIds(): Promise<string[]> {
  const branches = await listBranchData();
  return branches.map((b) => b.slug);
}

/** A single branch, or null when the slug is unknown. */
export async function getBranchDetail(id: string): Promise<BranchDetail | null> {
  const branches = await listBranchData();
  const branch = branches.find((b) => b.slug === id);
  if (!branch) return null;

  return {
    id: branch.slug,
    branch,
    siblings: branches.map((b) => ({ id: b.slug, name: b.name })),
  };
}
