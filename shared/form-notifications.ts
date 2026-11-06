/**
 * Which inbox a form submission goes to, and what the branch team receives.
 *
 * Branch addresses live in one place only: `branches.contact_email` in
 * Supabase, edited in the content studio. Nothing here hardcodes an address.
 */

export type BranchContact = {
  id?: string;
  name: string;
  contact_email: string | null;
};

/**
 * Branch names are typed in three places — the directory, the quiz list and
 * the form dropdowns — so they are compared loosely: case, punctuation and
 * spacing are ignored, and the directory's "Chelmesford" misspelling is
 * folded onto the correct "Chelmsford".
 */
export function normaliseBranchName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/^chelmesford\b/, "chelmsford")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** The branch row a submitted name refers to, or null when nothing matches. */
export function findBranch(branches: BranchContact[], name: string): BranchContact | null {
  const wanted = normaliseBranchName(name ?? "");
  if (!wanted) return null;
  return branches.find((b) => normaliseBranchName(b.name) === wanted) ?? null;
}

/**
 * Where a submission should be emailed: the branch inbox when the visitor
 * chose a branch we know, otherwise the site-wide fallback. Returns an empty
 * string when neither is available, which tells the caller to record the
 * submission without sending anything.
 */
export function notifyAddress(
  branches: BranchContact[],
  branchName: string,
  fallback?: string,
): string {
  const branch = findBranch(branches, branchName);
  const email = branch?.contact_email?.trim();
  if (email) return email;
  return fallback?.trim() ?? "";
}

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Visitor-supplied text is never trusted in an HTML email body. */
export function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);
}

function row(label: string, value: unknown): string {
  const text = String(value ?? "").trim();
  if (!text) return "";
  return `<tr>
      <td style="padding:6px 16px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:6px 0;color:#111827;font-size:14px;">${escapeHtml(text)}</td>
    </tr>`;
}

function shell(heading: string, intro: string, rows: string, body?: string): string {
  return `<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;">
    <h2 style="color:#5D3FD3;margin:0 0 8px;">${escapeHtml(heading)}</h2>
    <p style="color:#374151;font-size:14px;margin:0 0 20px;">${escapeHtml(intro)}</p>
    <table style="border-collapse:collapse;width:100%;">${rows}</table>
    ${
      body
        ? `<div style="margin-top:20px;padding:16px;background:#f9fafb;border-left:4px solid #5D3FD3;color:#111827;font-size:14px;white-space:pre-wrap;">${escapeHtml(body)}</div>`
        : ""
    }
    <hr style="margin:28px 0 12px;border:none;border-top:1px solid #e5e7eb;" />
    <p style="font-size:12px;color:#6b7280;margin:0;">
      Sent automatically from the Kharis website. Reply to this email to answer the sender directly.
    </p>
  </div>`;
}

/** Plain-text twin of the HTML body, for clients that prefer it. */
function plain(heading: string, pairs: [string, unknown][], body?: string): string {
  const lines = pairs
    .map(([label, value]) => [label, String(value ?? "").trim()] as const)
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`);
  return [heading, "", ...lines, ...(body ? ["", body] : [])].join("\n");
}

export type ContactNotification = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  topic: string;
  branchName?: string | null;
  message: string;
  site: "Main site" | "KP2";
};

export function contactEmail(input: ContactNotification): {
  subject: string;
  html: string;
  text: string;
} {
  const who = `${input.firstName} ${input.lastName}`.trim();
  const where = input.branchName?.trim() || "No branch chosen";
  const pairs: [string, unknown][] = [
    ["From", who],
    ["Email", input.email],
    ["Phone", input.phone],
    ["Topic", input.topic],
    ["Branch", where],
    ["Site", input.site],
  ];
  return {
    subject: `${input.topic} enquiry from ${who}${input.branchName ? ` (${input.branchName})` : ""}`,
    html: shell(
      "New message from the website",
      `${who} wrote in through the ${input.site} contact form.`,
      pairs.map(([l, v]) => row(l, v)).join(""),
      input.message,
    ),
    text: plain("New message from the website", pairs, input.message),
  };
}

export type VisitNotification = {
  name: string;
  email: string;
  phone?: string | null;
  branchName?: string | null;
  gathering?: string | null;
  children: boolean;
  site: "Main site" | "KP2";
};

export function visitEmail(input: VisitNotification): {
  subject: string;
  html: string;
  text: string;
} {
  const where = input.branchName?.trim() || "No branch chosen";
  const pairs: [string, unknown][] = [
    ["Name", input.name],
    ["Email", input.email],
    ["Phone", input.phone],
    ["Branch", where],
    ["Gathering", input.gathering],
    ["Bringing children", input.children ? "Yes (ages 0-12)" : "No"],
    ["Site", input.site],
  ];
  return {
    subject: `Planning a visit: ${input.name}${input.branchName ? ` (${input.branchName})` : ""}`,
    html: shell(
      "Someone is planning a visit",
      `${input.name} said they are coming and agreed to be contacted about the visit.`,
      pairs.map(([l, v]) => row(l, v)).join(""),
    ),
    text: plain("Someone is planning a visit", pairs),
  };
}

export type QuizNotification = {
  branchName: string;
  language: string;
  departments: string[];
  site: "Main site" | "KP2";
};

export function quizEmail(input: QuizNotification): {
  subject: string;
  html: string;
  text: string;
} {
  const departments = input.departments.filter(Boolean);
  const pairs: [string, unknown][] = [
    ["Branch", input.branchName],
    ["Language", input.language],
    ["1st match", departments[0]],
    ["2nd match", departments[1]],
    ["3rd match", departments[2]],
    ["Site", input.site],
  ];
  return {
    subject: `Department quiz result (${input.branchName})`,
    html: shell(
      "A department quiz was completed",
      "Someone finished the department discovery quiz. The quiz is anonymous, so there is no name or contact detail to follow up — these results are for planning.",
      pairs.map(([l, v]) => row(l, v)).join(""),
    ),
    text: plain("A department quiz was completed", pairs),
  };
}
