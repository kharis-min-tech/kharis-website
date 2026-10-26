/** Pure helper for Plan Your Visit: the row saved to public.visitors. */

export type VisitSite = "Main site" | "KP2";

export type VisitFields = {
  name: string;
  email: string;
  phone: string;
  branch: string;
  gathering: string;
  children: boolean;
  consent: boolean;
  site: VisitSite;
};

export type VisitorInsert = {
  name: string;
  email: string;
  phone: string | null;
  branch_name: string;
  message: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cleanVisitText(value: unknown, max: number) {
  return String(value ?? "")
    .trim()
    .slice(0, max);
}

/** Builds the visitors row. Consent has to be given before any details are stored. */
export function visitorInsert(
  fields: VisitFields,
): { ok: true; row: VisitorInsert } | { ok: false; error: string } {
  const name = fields.name.trim();
  const email = fields.email.trim();
  if (!name) return { ok: false, error: "Please enter your name." };
  if (!EMAIL.test(email)) return { ok: false, error: "Please enter a valid email." };
  if (!fields.consent) {
    return {
      ok: false,
      error: "Please confirm the branch can contact you about this visit.",
    };
  }

  const branch = fields.branch.trim();
  const gathering = fields.gathering.trim() || "Next Sunday";
  const place = branch || fields.site;
  const message = [
    "May contact: yes",
    `Site: ${fields.site}`,
    `Plan your visit for ${place}.`,
    `Gathering: ${gathering}.`,
    fields.children ? "Bringing children (ages 0-12)." : "No children noted.",
  ].join("\n");

  return {
    ok: true,
    row: {
      name,
      email,
      phone: fields.phone.trim() || null,
      branch_name: place,
      message,
    },
  };
}
