/** Puts the submitting site on the first line so the studio can tell Main from KP2. */
export function withSiteLine(message: string, site: "Main site" | "KP2") {
  const line = `From: ${site}`;
  if (new RegExp(`^From:\\s*${site}\\s*$`, "im").test(message)) return message;
  return `${line}\n\n${message}`;
}

/** Topic values match the ones the studio inbox and the main site use. */
export const CONTACT_TOPICS = [
  { value: "Sunday visit", label: "planning a visit" },
  { value: "Prayer", label: "prayer" },
  { value: "Pastoral", label: "pastoral care" },
  { value: "Baptism", label: "baptism" },
  { value: "Giving", label: "giving" },
  { value: "General", label: "something else" },
] as const;
