export const DOCUMENT_STEPS = [
  {
    id: "governance",
    label: "Governance PDFs",
    hint: "Safeguarding, privacy, disclaimer and cookies for the public sites",
  },
  {
    id: "fasting",
    label: "Fasting PDFs",
    hint: "Booklet and schedule downloads on the Life fasting page",
  },
] as const;

export type DocumentStep = (typeof DOCUMENT_STEPS)[number]["id"];
