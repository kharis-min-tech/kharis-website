"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import {
  getSiteTheme,
  subscribeSiteTheme,
  toggleSiteTheme,
  type SiteTheme,
} from "@/lib/theme";

type Props = {
  onDark?: boolean;
  className?: string;
};

export function ThemeToggle({ onDark = false, className = "" }: Props) {
  const theme = useSyncExternalStore(
    subscribeSiteTheme,
    getSiteTheme,
    () => "light" as SiteTheme,
  );
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => toggleSiteTheme()}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`theme-toggle ${onDark ? "theme-toggle--on-dark" : ""} ${className}`}
    >
      <span className="theme-toggle__icon" aria-hidden>
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </span>
      <span className="theme-toggle__label">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
