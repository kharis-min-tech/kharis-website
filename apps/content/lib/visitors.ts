import type { VisitorRow } from "@/lib/types";

/** What the studio form edits; every field is plain text. */
export type VisitorDraft = {
  name: string;
  email: string;
  phone: string;
  branch_name: string;
  message: string;
};

export function visitorToDraft(row: Partial<VisitorRow>): VisitorDraft {
  return {
    name: row.name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    branch_name: row.branch_name ?? "",
    message: row.message ?? "",
  };
}

/** Site and contact consent recorded by the public Plan Your Visit forms. */
export function visitorListNotes(message: string | null | undefined) {
  const text = message ?? "";
  const site = text.match(/^Site:\s*(.+)$/im);
  const contact = text.match(/May contact:\s*(yes|no)/i);
  const notes: string[] = [];
  if (site?.[1]) notes.push(site[1].trim());
  if (contact) notes.push(contact[1].toLowerCase() === "yes" ? "May contact" : "Do not contact");
  return notes;
}

/** The row saved to public.visitors: trimmed, with empty optional fields stored as null. */
export function visitorPayload(draft: VisitorDraft, id?: string) {
  const name = draft.name.trim();
  if (!name) throw new Error("A visitor needs a name.");
  const optional = (value: string) => value.trim() || null;
  return {
    name,
    email: optional(draft.email),
    phone: optional(draft.phone),
    branch_name: optional(draft.branch_name),
    message: optional(draft.message),
    ...(id ? { id } : {}),
  };
}
