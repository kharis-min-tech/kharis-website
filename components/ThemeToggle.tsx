"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("kharis-theme");
    const isDark = stored ? stored === "dark" : false;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    const root = document.documentElement;

    root.classList.add("theme-transition");
    window.clearTimeout(
      (window as unknown as { __themeTimer?: number }).__themeTimer,
    );
    (window as unknown as { __themeTimer?: number }).__themeTimer =
      window.setTimeout(() => root.classList.remove("theme-transition"), 400);

    setDark(next);
    root.classList.toggle("dark", next);
    localStorage.setItem("kharis-theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="fixed bottom-5 right-5 z-[999] flex items-center gap-2 border-2 border-on-background bg-primary px-4 py-3 font-label-comic text-label-comic uppercase text-on-primary neo-shadow transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
    >
      <span className="material-symbols-outlined text-base">
        {dark ? "light_mode" : "dark_mode"}
      </span>
      {dark ? "Light" : "Dark"}
    </button>
  );
}
