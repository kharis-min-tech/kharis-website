export type SiteTheme = "light" | "dark";

const STORAGE_KEY = "kharis-site-theme";
const listeners = new Set<() => void>();

export function getSiteTheme(): SiteTheme {
  if (typeof window === "undefined") return "light";
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function applySiteTheme(theme: SiteTheme) {
  document.documentElement.dataset.theme = theme;
}

export function setSiteTheme(theme: SiteTheme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* private mode */
  }
  applySiteTheme(theme);
  listeners.forEach((l) => l());
}

export function subscribeSiteTheme(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function toggleSiteTheme(): SiteTheme {
  const next = getSiteTheme() === "dark" ? "light" : "dark";
  setSiteTheme(next);
  return next;
}
