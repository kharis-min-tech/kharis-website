export type SiteTheme = "light" | "dark";

// Share the main site's preference while preserving existing KP2 choices.
export const THEME_STORAGE_KEY = "kharis-site-theme";

export function readTheme(storage: Pick<Storage, "getItem">): SiteTheme | null {
  try {
    const value = storage.getItem(THEME_STORAGE_KEY) ?? storage.getItem("kharis-theme");
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function writeTheme(storage: Pick<Storage, "setItem">, theme: SiteTheme) {
  try {
    storage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The current page still changes theme when browser storage is unavailable.
  }
}
