"use client";
import { useSyncExternalStore, useCallback, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export type BranchTheme = "dark" | "light";

const STORAGE_KEY = "kharis-branch-theme";
const listeners = new Set<() => void>();

function getTheme(): BranchTheme {
  if (typeof window === "undefined") return "dark";
  try {
    return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function applyTheme(theme: BranchTheme) {
  const root = document.documentElement;
  root.classList.toggle("branch-light", theme === "light");
  root.classList.toggle("branch-dark", theme === "dark");
}

function setTheme(theme: BranchTheme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* private mode */
  }
  applyTheme(theme);
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** Shared reactive theme state for any branch-page component. */
export function useBranchTheme(): [BranchTheme, (t: BranchTheme) => void] {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as BranchTheme);
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);
  return [theme, setTheme];
}

/**
 * Floating dark/light toggle shown only on the branch pages
 * (/branches and /branches/<slug>). Persisted to localStorage and
 * pre-applied by an inline script in __root to avoid a flash.
 */
export function BranchThemeToggle() {
  const [theme] = useBranchTheme();
  const next: BranchTheme = theme === "dark" ? "light" : "dark";

  const onToggle = useCallback(() => setTheme(next), [next]);

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label={theme === "dark" ? "Switch branch pages to light mode" : "Switch branch pages to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed bottom-5 right-5 z-[90] flex h-12 w-12 items-center justify-center rounded-full border border-[#e8a33d]/40 bg-[#800654] text-[#f2b254] shadow-xl shadow-[#800654]/40 backdrop-blur-md transition-transform hover:scale-105 cursor-pointer"
      initial={{ opacity: 0, scale: 0.6, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 22, delay: 0.4 }}
      whileTap={{ scale: 0.9 }}
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </motion.button>
  );
}
