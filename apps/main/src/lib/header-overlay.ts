/**
 * Lets a page section ask the fixed site header to go transparent (light text) while it sits
 * underneath, e.g. a pinned full-screen section. Off by default; the header ignores it otherwise.
 */
let active = false;
const listeners = new Set<() => void>();

export function setHeaderOverlay(on: boolean) {
  if (on === active) return;
  active = on;
  listeners.forEach((listener) => listener());
}

export function subscribeHeaderOverlay(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getHeaderOverlay() {
  return active;
}
