import { studioData } from "@/lib/studio-data";

export const SITE_DOCUMENTS_KEY = "site_documents";

export const POLICY_IDS = ["safeguarding", "privacy", "disclaimer", "cookies"] as const;
export type PolicyId = (typeof POLICY_IDS)[number];

export const FASTING_IDS = ["booklet", "schedule"] as const;
export type FastingId = (typeof FASTING_IDS)[number];

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

export async function getSiteDocuments(): Promise<SiteDocuments> {
  const [row] = await studioData.list<{ value: unknown }>("app_config", {
    where: { key: SITE_DOCUMENTS_KEY },
    limit: 1,
  });
  return parseSiteDocuments(row?.value);
}

export async function saveSiteDocuments(documents: SiteDocuments) {
  const now = new Date().toISOString();
  const next: SiteDocuments = {
    policies: Object.fromEntries(
      POLICY_IDS.map((id) => {
        const slot = documents.policies[id];
        const previous = emptySiteDocuments().policies[id];
        const url = slot.url.trim();
        return [
          id,
          {
            title: slot.title.trim() || previous.title,
            blurb: slot.blurb.trim() || previous.blurb,
            url,
            updatedAt: url ? slot.updatedAt || now : "",
          },
        ];
      }),
    ) as SiteDocuments["policies"],
    fasting: Object.fromEntries(
      FASTING_IDS.map((id) => {
        const slot = documents.fasting[id];
        const previous = emptySiteDocuments().fasting[id];
        const url = slot.url.trim();
        return [
          id,
          {
            title: slot.title.trim() || previous.title,
            blurb: slot.blurb.trim() || previous.blurb,
            url,
            updatedAt: url ? slot.updatedAt || now : "",
          },
        ];
      }),
    ) as SiteDocuments["fasting"],
  };
  await studioData.upsert("app_config", {
    key: SITE_DOCUMENTS_KEY,
    value: next,
  });
  return next;
}
