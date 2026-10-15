export const BANK = {
  accountName: "Kharis Ministries",
  accountNumber: "80608335",
  sortCode: "20-71-82",
  swift: "BUKBGB22",
  iban: "GB88BUKB20718280608335",
} as const;

export const BANK_ACCRA = {
  accountName: "Kharis Missions Church",
  accountNumber: "1400009476093",
  bank: "CalBank",
  swift: "ACCCGHAC",
  /** Some banks ask for the 11-character form. */
  swiftLong: "ACCCGHACXXX",
} as const;

export const MOMO = {
  accountName: "Kharis Mission Church",
  ussd: "*713*2766#",
} as const;

export const TEXT_GIVE = {
  keyword: "KCGIVE",
  number: "70085",
  maxPounds: 20,
} as const;

/**
 * Where each branch takes online gifts, as listed on kharis.org/giving.
 * `ghana` gives through the Ghana bank and Mobile Money details on the give page;
 * `building` is the Spurgeon's Centre project, which has its own giving site.
 * `slugs` match the branch in the content studio, whose giving link wins when set.
 */
export type GivingBranch = {
  name: string;
  kind: "online" | "ghana" | "building";
  url?: string;
  slugs?: string[];
};

const tithely = (formId: string) => `https://give.tithe.ly/?formId=${formId}`;

export const GIVING_BRANCHES: GivingBranch[] = [
  { name: "Kharis Church Accra", slugs: ["accra"], kind: "ghana" },
  {
    name: "Kharis Church Birmingham",
    slugs: ["birmingham"],
    kind: "online",
    url: tithely("eebc84dd-127a-43dd-bf03-29687a991673"),
  },
  {
    name: "Kharis Church Brighton",
    slugs: ["brighton"],
    kind: "online",
    url: tithely("974d9300-5c70-40ba-9420-0fb1df7b4f4d"),
  },
  {
    name: "Kharis Church Bristol",
    slugs: ["bristol"],
    kind: "online",
    url: tithely("ec4d0ce9-7e4c-47ef-b32c-e0ca6e9da6fd"),
  },
  {
    name: "Kharis Church Chatham",
    slugs: ["chatham"],
    kind: "online",
    url: tithely("75cd76e8-fa61-4d8f-b413-62246d5f7669"),
  },
  {
    name: "Kharis Church Chelmsford",
    slugs: ["chelmsford", "chelmesford"],
    kind: "online",
    url: tithely("e41e8d57-4d21-44c8-aaff-1a4be2fd6c91"),
  },
  {
    name: "Kharis Church Coventry",
    slugs: ["coventry"],
    kind: "online",
    url: tithely("bbe9dec7-7ab0-4ab2-aee5-954d78b2879a"),
  },
  {
    name: "Kharis Church Croydon",
    slugs: ["croydon"],
    kind: "online",
    url: tithely("aabad6bb-bbd7-4381-97e2-03e0b6c298f5"),
  },
  {
    name: "Kharis Church London",
    slugs: ["london"],
    kind: "online",
    url: tithely("45055754-5d3e-4613-882e-460bc78e8d16"),
  },
  {
    name: "Kharis Church Luton",
    slugs: ["luton"],
    kind: "online",
    url: tithely("6db8a8d8-44e5-4cee-bd23-9790e636dda4"),
  },
  {
    name: "Kharis Church Manchester",
    slugs: ["manchester"],
    kind: "online",
    url: tithely("3aeb802d-19d5-4952-bff3-0fa4085971be"),
  },
  {
    name: "Kharis Church Northampton",
    slugs: ["northampton"],
    kind: "online",
    url: tithely("281629f1-40ad-415f-9389-1d80a20d8be8"),
  },
  {
    name: "Kharis Church Nottingham",
    slugs: ["nottingham"],
    kind: "online",
    url: tithely("dc7c6a8a-0430-4578-9539-eac49d828673"),
  },
  {
    name: "Kharis Church Orpington",
    slugs: ["orpington"],
    kind: "online",
    url: tithely("f5d746fe-2c93-4eca-9d4d-466afcb53a63"),
  },
  {
    name: "Kharis Church Reading",
    slugs: ["reading"],
    kind: "online",
    url: tithely("ef2e9e79-611b-42e6-b28b-0a69f9fcf2ac"),
  },
  {
    name: "Kharis Phase 2 Barking",
    slugs: ["kp2-barking"],
    kind: "online",
    url: tithely("f5809c09-eacf-475a-a31c-5b722718f237"),
  },
  {
    name: "Kharis Phase 2 Birmingham",
    slugs: ["kp2-birmingham"],
    kind: "online",
    url: tithely("1fb872e2-0696-4bef-9a95-36d61a3512cf"),
  },
  {
    name: "Kharis Phase 2 London",
    slugs: ["kp2-london"],
    kind: "online",
    url: tithely("1f9358c0-6226-4abf-a526-4ef17e002c2f"),
  },
  {
    name: "Kharis Phase 2 Peterborough",
    slugs: ["kp2-peterborough"],
    kind: "online",
    url: tithely("5a5d795a-ec95-480b-b047-8fee14c04789"),
  },
  {
    name: "Kharis Phase 2 Romford",
    slugs: ["kp2-romford"],
    kind: "online",
    url: tithely("9bb02537-fd92-492a-bb76-3f2989c16c9d"),
  },
  {
    name: "Kharis Phase 2 Southampton",
    slugs: ["kp2-southampton"],
    kind: "online",
    url: tithely("a79fdf6d-6849-4751-95ba-dd248b953ea5"),
  },
  { name: "Spurgeon's Centre building fund", kind: "building" },
];

type StudioBranch = { slug: string; giving_link: string | null };

/** Uses the giving link set in the content studio where there is one; only https links count. */
export function withStudioLinks(branches: GivingBranch[], rows: StudioBranch[]): GivingBranch[] {
  const links = new Map<string, string>();
  for (const row of rows) {
    const url = row.giving_link?.trim();
    if (url && /^https:\/\//i.test(url)) links.set(row.slug, url);
  }

  return branches.map((branch) => {
    const url = branch.slugs?.map((slug) => links.get(slug)).find(Boolean);
    return url ? { ...branch, kind: "online", url } : branch;
  });
}
