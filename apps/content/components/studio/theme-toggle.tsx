"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "kharis-content-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  function apply(next: "light" | "dark") {
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem(STORAGE_KEY, next);
    setTheme(next);
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-4 left-4 z-50 shadow-md"
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      onClick={() => apply(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
