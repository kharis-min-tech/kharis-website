"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "kharis-content-theme";

type Theme = "light" | "dark";

function useTheme() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const read = () =>
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode: the choice lasts for this page only.
    }
  }

  return { theme, toggle };
}

/** Icon button for the sidebar footer, or a labelled pill for the sign-in screens. */
export function ThemeToggle({
  variant = "icon",
  className,
}: {
  variant?: "icon" | "pill";
  className?: string;
}) {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        variant === "icon"
          ? "h-8 w-8 rounded-lg hover:bg-accent"
          : "h-8 rounded-full border border-border bg-card px-3 text-xs font-medium shadow-card",
        className,
      )}
    >
      <Icon className="h-4 w-4" />
      {variant === "pill" ? <span>{next === "dark" ? "Dark mode" : "Light mode"}</span> : null}
    </button>
  );
}
