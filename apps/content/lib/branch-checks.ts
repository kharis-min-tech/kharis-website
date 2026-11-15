import { branchPagePath } from "./branch-family";
import type { BranchDraft } from "./branch-types";

export const BRANCH_STEPS = [
  { id: "basics", label: "Basics", hint: "Name, KP2 or Kharis, web address and intro" },
  { id: "pastor", label: "Pastor", hint: "Who leads the branch" },
  { id: "visit", label: "Venues & times", hint: "Where and when people meet" },
  { id: "media", label: "Photos & video", hint: "Main photo, video and gallery" },
  { id: "contact", label: "Contact & giving", hint: "Email, phone, Instagram and giving" },
] as const;

export type BranchStep = (typeof BRANCH_STEPS)[number]["id"];

export type BranchIssue = {
  step: BranchStep;
  /** Errors stop the save. Warnings only mean the page will look unfinished. */
  level: "error" | "warning";
  message: string;
};

/** Images picked for a branch that has not been saved yet, so they are not in the draft. */
export type QueuedImages = { hero: boolean; pastor: boolean; gallery: number };

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INSTAGRAM_HANDLE = /^@?[A-Za-z0-9._]{1,30}$/;

function isWebUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function coordinateProblem(latitude: string, longitude: string) {
  const lat = latitude.trim();
  const lng = longitude.trim();
  if (!lat && !lng) return false;
  const latValue = Number(lat);
  const lngValue = Number(lng);
  return (
    !lat ||
    !lng ||
    !Number.isFinite(latValue) ||
    !Number.isFinite(lngValue) ||
    Math.abs(latValue) > 90 ||
    Math.abs(lngValue) > 180
  );
}

export function checkBranch(
  draft: BranchDraft,
  {
    otherSlugs = [],
    queued = { hero: false, pastor: false, gallery: 0 },
  }: { otherSlugs?: string[]; queued?: QueuedImages } = {},
): BranchIssue[] {
  const issues: BranchIssue[] = [];
  const error = (step: BranchStep, message: string) =>
    issues.push({ step, level: "error", message });
  const warn = (step: BranchStep, message: string) =>
    issues.push({ step, level: "warning", message });

  const name = draft.name.trim();
  const slug = draft.slug.trim();
  const startsKp2 = /^kp2\b/i.test(name);

  if (!name) error("basics", "Add the branch name.");
  if (!slug) error("basics", "Add the web address.");
  else if (!SLUG.test(slug)) {
    error("basics", "The web address can only use lowercase letters, numbers and dashes.");
  } else if (otherSlugs.includes(slug)) {
    error("basics", `Another branch already uses ${branchPagePath(draft.family, slug)}.`);
  }
  if (!/^-?\d+$/.test(draft.sortOrder.trim())) {
    error("basics", "The list position must be a whole number.");
  }
  if (name && draft.family === "kharis" && startsKp2) {
    warn("basics", "The name starts with KP2, but the branch is set as Kharis Church.");
  }
  if (name && draft.family === "kp2" && !startsKp2) {
    warn("basics", "KP2 branches are named “KP2 <place>”, for example “KP2 London”.");
  }
  if (!draft.shortDescription.trim()) {
    warn("basics", "No short description. The page shows a general sentence instead.");
  }

  if (!draft.pastorName.trim()) warn("pastor", "No pastor yet. The page says “Coming soon”.");
  if (!draft.pastorPhoto.trim() && !queued.pastor) warn("pastor", "No pastor photo.");

  const venues = draft.venues.filter((venue) => venue.active);
  const services = draft.services.filter((service) => service.active);
  draft.venues.forEach((venue, index) => {
    if (coordinateProblem(venue.latitude, venue.longitude)) {
      const label = venue.name.trim() || `Venue ${index + 1}`;
      error("visit", `${label}: the map pin needs a valid latitude and longitude.`);
    }
  });
  if (services.some((service) => !service.time.trim())) {
    warn("visit", "A service has no time, so the page shows “TBC” for it.");
  }
  if (!venues.some((venue) => venue.address.trim() || venue.postcode.trim())) {
    warn("visit", "No venue address. The page says “Address coming soon”.");
  } else if (!venues.some((venue) => venue.latitude.trim() && venue.longitude.trim())) {
    warn("visit", "No map pin, so the page shows no map.");
  }
  if (!services.some((service) => service.day === "Sunday")) {
    warn("visit", "No Sunday service. The page shows “TBC” for Sunday.");
  }

  if (!draft.heroImage.trim() && !queued.hero) {
    warn("media", "No main photo. The top of the page shows a placeholder.");
  }
  if (!draft.gallery.length && !queued.gallery) warn("media", "No gallery photos.");

  const email = draft.email.trim();
  const instagram = draft.instagram.trim();
  const giving = draft.givingLink.trim();
  if (email && !EMAIL.test(email)) error("contact", "The email address doesn't look right.");
  if (giving && !isWebUrl(giving)) {
    error("contact", "The giving link must be a full web address starting with https://.");
  }
  if (instagram && !INSTAGRAM_HANDLE.test(instagram) && !/instagram\.com\//i.test(instagram)) {
    error("contact", "Instagram must be a handle like @kharischurch or an instagram.com link.");
  }
  if (!email && !draft.phone.trim()) warn("contact", "No email or phone number for this branch.");

  return issues;
}

export function issuesFor(issues: BranchIssue[], step: BranchStep) {
  return issues.filter((issue) => issue.step === step);
}
