export const BANK = {
  accountName: "Kharis Ministries",
  accountNumber: "80608335",
  sortCode: "20-71-82",
  swift: "BUKBGB22",
  iban: "GB88BUKB20718280608335",
} as const;

export const TEXT_GIVE = {
  keyword: "KCGIVE",
  number: "70085",
  maxPounds: 20,
} as const;

export const ONLINE_GIVE_URL = "https://kharis.org/giving/";

export const ONLINE_BRANCHES = [
  "Kharis Church Accra",
  "Kharis Church Birmingham",
  "Kharis Church Brighton",
  "Kharis Church Bristol",
  "Kharis Church Chatham",
  "Kharis Church Chelmsford",
  "Kharis Church Coventry",
  "Kharis Church Croydon",
  "Kharis Church London",
  "Kharis Church Luton",
  "Kharis Church Manchester",
  "Kharis Church Northampton",
  "Kharis Church Nottingham",
  "Kharis Church Orpington",
  "Kharis Church Reading",
  "Kharis Phase 2 Barking",
  "Kharis Phase 2 Birmingham",
  "Kharis Phase 2 London",
  "Kharis Phase 2 Peterborough",
  "Kharis Phase 2 Romford",
  "Kharis Phase 2 Southampton",
] as const;

export const GIVE_WAYS = [
  {
    id: "bank",
    title: "Bank transfer",
    blurb: "Give tithes or offerings directly to Kharis Ministries. Use these details from your own bank.",
  },
  {
    id: "text",
    title: "Text (UK)",
    blurb: "Send a short text. The gift is added to your phone bill or taken from pay-as-you-go, up to £20.",
  },
  {
    id: "online",
    title: "Give online",
    blurb: "Choose your branch and continue to the secure Kharis giving page.",
  },
] as const;
