"use client";

import { useEffect, useState } from "react";

function currentDark() {
  return document.documentElement.classList.contains("dark");
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const sync = () => setDark(currentDark());
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <button
      type="button"
      id="theme-toggle"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      style={{ zIndex: 9999 }}
      className="pointer-events-auto fixed bottom-5 right-5 z-[9999] flex items-center gap-2 rounded-full border border-on-background/15 bg-surface-container-highest px-4 py-3 font-label-comic text-label-comic uppercase text-on-surface shadow-[0_12px_40px_-12px_rgba(6,7,10,0.55)]"
    >
      <span data-theme-icon className="material-symbols-outlined text-base">
        {dark ? "light_mode" : "dark_mode"}
      </span>
      <span data-theme-label>{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
