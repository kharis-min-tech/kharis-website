/** Client-side handoff from the Grace chat to the contact form. */

export const GRACE_HANDOFF_KEY = "kharis_grace_handoff";

/** Ticket receipt ID format, e.g. GR-20260917-A3F9 */
export const GRACE_TICKET_PATTERN = /^GR-\d{8}-[A-Z0-9]{4}$/;

export type GraceHandoffMessage = {
  role: "user" | "assistant";
  content: string;
};

export type GraceHandoffPayload = {
  ticketId: string;
  createdAt: string;
  messages: GraceHandoffMessage[];
  summary: string;
};

function randomChunk(len = 4): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  const bytes =
    typeof crypto !== "undefined" && crypto.getRandomValues
      ? crypto.getRandomValues(new Uint8Array(len))
      : Array.from({ length: len }, () => Math.floor(Math.random() * 256));
  for (let i = 0; i < len; i++) {
    out += alphabet[(bytes[i] as number) % alphabet.length];
  }
  return out;
}

export function isGraceTicketId(
  value: string | null | undefined,
): value is string {
  return Boolean(value && GRACE_TICKET_PATTERN.test(value));
}

export function createGraceTicketId(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `GR-${y}${m}${d}-${randomChunk(4)}`;
}

function plainText(content: string): string {
  return content
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, "$1 ($2)")
    .replace(/\*\*|__|`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function summarizeGraceChat(
  messages: GraceHandoffMessage[],
  maxTurns = 8,
): string {
  const usable = messages
    .filter((m) => m.content.trim())
    .slice(-maxTurns);
  if (!usable.length) return "No prior chat turns captured.";
  return usable
    .map((m) => {
      const who = m.role === "user" ? "Visitor" : "Grace";
      return `${who}: ${plainText(m.content).slice(0, 280)}`;
    })
    .join("\n");
}

export function buildContactPrefill(payload: GraceHandoffPayload): string {
  return [
    `Grace chat ticket: ${payload.ticketId}`,
    "",
    "I'd like help with something from my chat with Grace.",
    "",
    "--- Chat summary ---",
    payload.summary,
  ].join("\n");
}

export function saveGraceHandoff(
  messages: GraceHandoffMessage[],
  ticketId?: string,
): GraceHandoffPayload {
  const payload: GraceHandoffPayload = {
    ticketId: ticketId || createGraceTicketId(),
    createdAt: new Date().toISOString(),
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content.slice(0, 2000),
    })),
    summary: summarizeGraceChat(messages),
  };
  try {
    sessionStorage.setItem(GRACE_HANDOFF_KEY, JSON.stringify(payload));
  } catch {
    /* private mode / quota — still return payload for query-param flow */
  }
  return payload;
}

export function readGraceHandoff(
  ticketIdFromQuery?: string | null,
): GraceHandoffPayload | null {
  try {
    const raw = sessionStorage.getItem(GRACE_HANDOFF_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GraceHandoffPayload;
    if (!isGraceTicketId(parsed?.ticketId) || !Array.isArray(parsed.messages)) {
      return null;
    }
    if (ticketIdFromQuery && parsed.ticketId !== ticketIdFromQuery) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearGraceHandoff() {
  try {
    sessionStorage.removeItem(GRACE_HANDOFF_KEY);
  } catch {
    /* ignore */
  }
}

export function contactHandoffUrl(ticketId: string): string {
  return `/contact?chatTicket=${encodeURIComponent(ticketId)}`;
}

/** True when a reply is steering the user toward the contact form. */
export function replyOffersContact(text: string): boolean {
  return /\/contact|contact form|message (the |our )?team|talk to (the |our )?team|reach (the |our )?team|send (us|the church) a message/i.test(
    text,
  );
}
