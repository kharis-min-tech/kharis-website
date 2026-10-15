"use client";

import { MotionConfig } from "framer-motion";
import { useEffect } from "react";
import { applySiteTheme, getSiteTheme } from "@/lib/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applySiteTheme(getSiteTheme());
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
