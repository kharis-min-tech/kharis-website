import { describe, expect, it } from "vitest";
import { checkBranch, issuesFor, type BranchIssue } from "./branch-checks";
import type { BranchDraft } from "./branch-types";

function draft(partial: Partial<BranchDraft> = {}): BranchDraft {
  return {
    name: "London",
    slug: "london",
    country: "United Kingdom",
    shortDescription: "A church family in London.",
    description: "",
    heroImage: "https://images.kharis.org/hero.jpg",
    videoUrl: "",
    pastorName: "Pastor Ada",
    pastorRole: "pastor",
    pastorPhoto: "https://images.kharis.org/pastor.jpg",
    pastorBio: "",
    email: "london@kharis.org",
    phone: "",
    givingLink: "",
    instagram: "",
    family: "kharis",
    published: true,
    sortOrder: "1",
    venues: [
      {
        key: "v1",
        name: "Main hall",
        address: "1 High Street",
        addressLine2: "",
        city: "London",
        postcode: "E1 1AA",
        country: "United Kingdom",
        latitude: "51.5",
        longitude: "-0.12",
        parkingInfo: "",
        transitInfo: "",
        imageUrl: "",
        imageKey: "",
        active: true,
      },
    ],
    services: [{ key: "s1", day: "Sunday", time: "10:00", label: "", venueIndex: 0, active: true }],
    gallery: [{ key: "g1", url: "https://images.kharis.org/g1.jpg" }],
    ...partial,
  };
}

const messages = (issues: BranchIssue[], level: BranchIssue["level"]) =>
  issues.filter((issue) => issue.level === level).map((issue) => issue.message);

describe("checkBranch", () => {
  it("passes a finished branch", () => {
    expect(checkBranch(draft())).toEqual([]);
  });

  it("blocks saving without a name or a usable, unique web address", () => {
    expect(messages(checkBranch(draft({ name: " ", slug: "" })), "error")).toEqual([
      "Add the branch name.",
      "Add the web address.",
    ]);
    expect(messages(checkBranch(draft({ slug: "London Town" })), "error")).toEqual([
      "The web address can only use lowercase letters, numbers and dashes.",
    ]);
    expect(messages(checkBranch(draft(), { otherSlugs: ["london"] }), "error")).toEqual([
      "Another branch already uses kharis.org/locations/london.",
    ]);
    expect(messages(checkBranch(draft({ sortOrder: "1.5" })), "error")).toEqual([
      "The list position must be a whole number.",
    ]);
  });

  it("flags a name and KP2 setting that disagree", () => {
    expect(messages(checkBranch(draft({ name: "KP2 London" })), "warning")).toEqual([
      "The name starts with KP2, but the branch is set as Kharis Church.",
    ]);
    expect(messages(checkBranch(draft({ family: "kp2" })), "warning")).toEqual([
      "KP2 branches are named “KP2 <place>”, for example “KP2 London”.",
    ]);
  });

  it("checks contact details and map pins", () => {
    const issues = checkBranch(
      draft({
        email: "london@",
        givingLink: "kharis.org/give",
        instagram: "not a handle!",
        venues: [{ ...draft().venues[0]!, latitude: "200", longitude: "0" }],
      }),
    );
    expect(issuesFor(issues, "contact").map((issue) => issue.level)).toEqual([
      "error",
      "error",
      "error",
    ]);
    expect(messages(issuesFor(issues, "visit"), "error")).toEqual([
      "Main hall: the map pin needs a valid latitude and longitude.",
    ]);
    expect(checkBranch(draft({ instagram: "@kharischurch" }))).toEqual([]);
    expect(checkBranch(draft({ instagram: "https://instagram.com/kharis" }))).toEqual([]);
  });

  it("warns about what the page will be missing, counting images waiting to upload", () => {
    const bare = draft({
      shortDescription: "",
      pastorName: "",
      pastorPhoto: "",
      heroImage: "",
      gallery: [],
      email: "",
      services: [
        { key: "s1", day: "Thursday", time: "19:00", label: "", venueIndex: 0, active: true },
      ],
    });
    expect(issuesFor(checkBranch(bare), "media")).toHaveLength(2);
    expect(checkBranch(bare).every((issue) => issue.level === "warning")).toBe(true);
    const queued = checkBranch(bare, { queued: { hero: true, pastor: true, gallery: 2 } });
    expect(issuesFor(queued, "media")).toEqual([]);
    expect(messages(issuesFor(queued, "pastor"), "warning")).toEqual([
      "No pastor yet. The page says “Coming soon”.",
    ]);
  });

  it("ignores inactive services and venues when deciding what the page shows", () => {
    const issues = checkBranch(
      draft({
        services: [{ key: "s1", day: "Sunday", time: "", label: "", venueIndex: 0, active: false }],
      }),
    );
    expect(messages(issues, "error")).toEqual([]);
    expect(messages(issues, "warning")).toEqual([
      "No Sunday service. The page shows “TBC” for Sunday.",
    ]);
  });
});
