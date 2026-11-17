"use client";

import { useRef, type RefObject } from "react";
import { usePointerGlow } from "@/lib/use-pointer-glow";
import { cn } from "@/lib/utils";

type AtmosphereTone = "studio" | "auth" | "authDark";

/** Quiet brand glow + grid; pointer-driven unless reduced motion. */
export function StudioAtmosphere({
  className,
  tone = "studio",
  reactive = true,
  containerRef,
}: {
  className?: string;
  tone?: AtmosphereTone;
  /** When false, only static layers render (no pointer spotlight). */
  reactive?: boolean;
  containerRef?: RefObject<HTMLElement | null>;
}) {
  const localRef = useRef<HTMLDivElement>(null);
  const trackRef = containerRef ?? localRef;
  const { reducedMotion } = usePointerGlow({
    enabled: reactive,
    containerRef: reactive && tone === "authDark" ? trackRef : undefined,
  });

  return (
    <div
      ref={localRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      data-atmosphere={tone}
      data-reduced-motion={reducedMotion ? "true" : "false"}
    >
      <div
        className={cn(
          "absolute inset-0",
          tone === "authDark"
            ? "auth-atmosphere-base-dark"
            : tone === "auth"
              ? "auth-atmosphere-base"
              : "studio-atmosphere-base",
        )}
      />
      {reactive ? (
        <div
          className={cn(
            "absolute inset-0",
            tone === "authDark"
              ? "auth-atmosphere-spotlight-dark"
              : tone === "auth"
                ? "auth-atmosphere-spotlight"
                : "studio-atmosphere-spotlight",
          )}
        />
      ) : null}
      <div
        className={cn(
          "absolute inset-[-8%]",
          tone === "authDark"
            ? "auth-atmosphere-grid-dark opacity-[0.45]"
            : tone === "auth"
              ? "auth-atmosphere-grid opacity-[0.28] dark:opacity-[0.2]"
              : "studio-atmosphere-grid opacity-[0.35] dark:opacity-[0.22]",
          !reactive && "auth-atmosphere-static-mask",
        )}
      />
      {reactive ? (
        <div
          className={cn(
            "absolute inset-0",
            tone === "authDark"
              ? "auth-atmosphere-nodes-dark"
              : tone === "auth"
                ? "auth-atmosphere-nodes"
                : "studio-atmosphere-nodes",
          )}
        />
      ) : null}
      {tone === "authDark" && reactive ? (
        <div className="auth-atmosphere-scan absolute inset-0" />
      ) : null}
    </div>
  );
}
