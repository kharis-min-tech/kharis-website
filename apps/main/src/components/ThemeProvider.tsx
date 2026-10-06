"use client";

import { useEffect } from "react";
import { applySiteTheme, getSiteTheme } from "@/lib/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applySiteTheme(getSiteTheme());
  }, []);

  return children;
}
