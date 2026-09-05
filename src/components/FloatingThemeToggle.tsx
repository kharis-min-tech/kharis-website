"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import {
  getSiteTheme,
  subscribeSiteTheme,
  toggleSiteTheme,
  type SiteTheme,
} from "@/lib/theme";

export function FloatingThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeSiteTheme,
    getSiteTheme,
    () => "light" as SiteTheme,
  );
  const dark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="floating-theme-toggle"
      onClick={() => toggleSiteTheme()}
    >
      <span className="floating-theme-toggle__icon" aria-hidden>
        {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </span>
    </button>
  );
}
