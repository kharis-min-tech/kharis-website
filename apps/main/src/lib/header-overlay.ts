/**
 * Lets page sections restyle the fixed site header while they sit underneath it:
 * - "clear": transparent with light text, for a pinned full-screen section.
 * - "dark": dark frosted glass with light text, for a dark section scrolling past, so its
 *   content doesn't collide with the nav links.
 * Each section requests a mode under its own key so sections on one page don't overwrite each
 * other; "clear" wins over "dark", and the header is normal when nothing is requested.
 */
export type HeaderOverlayMode = "clear" | "dark";

const owners = new Map<string, HeaderOverlayMode>();
const listeners = new Set<() => void>();

export function setHeaderOverlay(owner: string, mode: HeaderOverlayMode | null) {
  if ((owners.get(owner) ?? null) === mode) return;
  if (mode) owners.set(owner, mode);
  else owners.delete(owner);
  listeners.forEach((listener) => listener());
}

export function subscribeHeaderOverlay(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getHeaderOverlay(): HeaderOverlayMode | null {
  const modes = [...owners.values()];
  if (modes.includes("clear")) return "clear";
  return modes.includes("dark") ? "dark" : null;
}
