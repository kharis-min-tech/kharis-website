import { siteGet } from "@/lib/kharis-api";

export type PolicyId = "safeguarding" | "privacy" | "disclaimer" | "cookies";
export type FastingId = "booklet" | "schedule";

export type DocumentSlot = {
  title: string;
  blurb: string;
  url: string;
  updatedAt: string;
};

export type SiteDocuments = {
  policies: Record<PolicyId, DocumentSlot>;
  fasting: Record<FastingId, DocumentSlot>;
};

const POLICY_DEFAULTS: Record<PolicyId, Pick<DocumentSlot, "title" | "blurb">> = {
  safeguarding: {
    title: "Safeguarding Policy",
    blurb:
      "How we protect children, young people and adults at risk across every Kharis gathering and activity.",
  },
  privacy: {
    title: "Privacy Policy",
    blurb:
      "How we collect, use and look after personal information when you engage with Kharis Ministries.",
  },
  disclaimer: {
    title: "Website Disclaimer",
    blurb: "Important notes about information on this website and your use of our online spaces.",
  },
  cookies: {
    title: "Cookie Policy",
    blurb:
      "The cookies and browser storage this site uses, and why a consent banner is not required.",
  },
};

const FASTING_DEFAULTS: Record<FastingId, Pick<DocumentSlot, "title" | "blurb">> = {
  booklet: {
    title: "Fasting booklet",
    blurb: "Guidance and teaching for corporate fasting seasons.",
  },
  schedule: {
    title: "Fasting schedule",
    blurb: "Dates, times and focus for the current fasting period.",
  },
};

function emptySlot(defaults: Pick<DocumentSlot, "title" | "blurb">): DocumentSlot {
  return { title: defaults.title, blurb: defaults.blurb, url: "", updatedAt: "" };
}

export function emptySiteDocuments(): SiteDocuments {
  return {
    policies: {
      safeguarding: emptySlot(POLICY_DEFAULTS.safeguarding),
      privacy: emptySlot(POLICY_DEFAULTS.privacy),
      disclaimer: emptySlot(POLICY_DEFAULTS.disclaimer),
      cookies: emptySlot(POLICY_DEFAULTS.cookies),
    },
    fasting: {
      booklet: emptySlot(FASTING_DEFAULTS.booklet),
      schedule: emptySlot(FASTING_DEFAULTS.schedule),
    },
  };
}

function readSlot(value: unknown, defaults: Pick<DocumentSlot, "title" | "blurb">): DocumentSlot {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    title: typeof row.title === "string" && row.title.trim() ? row.title.trim() : defaults.title,
    blurb: typeof row.blurb === "string" && row.blurb.trim() ? row.blurb.trim() : defaults.blurb,
    url: typeof row.url === "string" ? row.url.trim() : "",
    updatedAt: typeof row.updatedAt === "string" ? row.updatedAt : "",
  };
}

export function parseSiteDocuments(value: unknown): SiteDocuments {
  const root = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const policies =
    root.policies && typeof root.policies === "object"
      ? (root.policies as Record<string, unknown>)
      : {};
  const fasting =
    root.fasting && typeof root.fasting === "object"
      ? (root.fasting as Record<string, unknown>)
      : {};
  return {
    policies: {
      safeguarding: readSlot(policies.safeguarding, POLICY_DEFAULTS.safeguarding),
      privacy: readSlot(policies.privacy, POLICY_DEFAULTS.privacy),
      disclaimer: readSlot(policies.disclaimer, POLICY_DEFAULTS.disclaimer),
      cookies: readSlot(policies.cookies, POLICY_DEFAULTS.cookies),
    },
    fasting: {
      booklet: readSlot(fasting.booklet, FASTING_DEFAULTS.booklet),
      schedule: readSlot(fasting.schedule, FASTING_DEFAULTS.schedule),
    },
  };
}

/** Server-side fetch of studio PDF slots. Empty URLs mean the public site should hide the link. */
export async function fetchSiteDocuments(): Promise<SiteDocuments> {
  const { data } = await siteGet<unknown>("/documents");
  return parseSiteDocuments(data);
}
