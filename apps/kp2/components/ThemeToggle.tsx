"use client";

import { useEffect, useRef, useState } from "react";
import { readTheme, writeTheme } from "@/lib/theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    let stored = null;
    try {
      stored = readTheme(window.localStorage);
    } catch {
      // Accessing localStorage itself can be blocked by browser policy.
    }
    const isDark = stored ? stored === "dark" : document.documentElement.classList.contains("dark");
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    return () => {
      window.clearTimeout(timerRef.current);
      document.documentElement.classList.remove("theme-transition");
    };
  }, []);

  const toggle = () => {
    const next = !dark;
    const root = document.documentElement;

    root.classList.add("theme-transition");
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => root.classList.remove("theme-transition"), 400);

    setDark(next);
    root.classList.toggle("dark", next);
    root.style.colorScheme = next ? "dark" : "light";
    try {
      writeTheme(window.localStorage, next ? "dark" : "light");
    } catch {
      // Storage access must not prevent switching the current page's theme.
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="theme-toggle fixed bottom-5 right-5 z-[999] flex items-center gap-2 border-2 border-on-background bg-primary px-4 py-3 font-label-comic text-label-comic uppercase text-on-primary neo-shadow transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
    >
      <span className="material-symbols-outlined text-base">
        {dark ? "light_mode" : "dark_mode"}
      </span>
      <span className="hidden md:inline">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
