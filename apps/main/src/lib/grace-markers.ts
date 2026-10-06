/**
 * Control markers Grace may emit in replies:
 * - [[MESSAGE:video_id]] → recommended Pastor David message (rendered as a card)
 * - [[CONTACT_FORM]]     → show the contact handoff CTA
 * - [[APP_DOWNLOAD]]     → show App Store / Google Play buttons for the Kharis app
 * Shared by the API route (parsing) and the chat UI (hiding).
 */

const MESSAGE_MARKER = /\[\[\s*MESSAGE\s*:\s*([A-Za-z0-9_-]+)\s*\]\]/gi;
const CONTACT_MARKER = /\[\[\s*CONTACT[_ ]FORM\s*\]\]/i;
const APP_MARKER = /\[\[\s*APP[_ ]DOWNLOAD\s*\]\]/i;
const ANY_MARKER =
  /\[\[\s*(?:MESSAGE\s*:\s*[A-Za-z0-9_-]*|CONTACT[_ ]FORM|APP[_ ]DOWNLOAD)\s*\]\]/gi;
/** "via [[CONTACT_FORM]]" reads as a sentence once the CTA sits below. */
const CONTACT_INLINE =
  /\b(using|via|through|with|use|fill in|fill out|complete)\s+(?:the\s+|our\s+)?\[\[\s*CONTACT[_ ]FORM\s*\]\]/gi;
const CONTACT_AS_NOUN = /\b(?:the|our)\s+\[\[\s*CONTACT[_ ]FORM\s*\]\]/gi;
/** A marker still arriving at the end of a streamed buffer, e.g. "[[MES". */
const PARTIAL_MARKER_AT_END =
  /\[(?:\[\s*(?:[A-Za-z_ ]*|MESSAGE\s*:\s*[A-Za-z0-9_-]*)\s*\]?)?$/i;

export function extractMessageMarkerIds(text: string, max = 3): string[] {
  const ids: string[] = [];
  for (const m of text.matchAll(MESSAGE_MARKER)) {
    const id = m[1];
    if (!ids.includes(id)) ids.push(id);
    if (ids.length >= max) break;
  }
  return ids;
}

export function hasContactMarker(text: string): boolean {
  return CONTACT_MARKER.test(text);
}

export function hasAppMarker(text: string): boolean {
  return APP_MARKER.test(text);
}

/** Remove every marker (and a trailing half-streamed one) from visible text. */
export function stripGraceMarkers(text: string): string {
  return text
    .replace(CONTACT_INLINE, "$1 the contact form below")
    .replace(CONTACT_AS_NOUN, (m) =>
      /^[A-Z]/.test(m) ? "The contact form below" : "the contact form below",
    )
    .replace(/:[ \t]*\[\[\s*(?:CONTACT[_ ]FORM|APP[_ ]DOWNLOAD)\s*\]\][ \t]*$/gm, ".")
    .replace(ANY_MARKER, "")
    .replace(PARTIAL_MARKER_AT_END, "")
    .replace(/^[ \t]*(?:[-•*]|\d+[.)])[ \t]*$/gm, "")
    .replace(/[ \t]+([.,;!?])/g, "$1")
    .replace(/[:;,]+([.!?])/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
