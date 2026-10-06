"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Progressively reveals page sections as they scroll into view.
 * Purely presentational: adds/removes the `is-revealed` class.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    // Wait until lazy route boundaries have hydrated before touching DOM nodes
    // React owns, otherwise React reports a hydration mismatch in the console.
    const setup = () => {
      if (cancelled) return;

      const targets = Array.from(
        document.querySelectorAll<HTMLElement>("main section"),
      );
      if (!targets.length) return;

      targets.forEach((el, i) => {
        el.classList.add("reveal-on-scroll");
        // Every third section wipes in diagonally, alternating direction.
        if (i % 3 === 2) {
          el.classList.add(
            (i / 3) % 2 < 1 ? "reveal-diagonal-left" : "reveal-diagonal-right",
          );
        }
        el.style.setProperty("--reveal-delay", `${(i % 4) * 70}ms`);
      });

      let rafId = 0;
      let ticking = false;

      const reveal = () => {
        const vh = window.innerHeight;
        targets.forEach((el) => {
          if (el.classList.contains("is-revealed")) return;
          const rect = el.getBoundingClientRect();
          if (rect.top < vh * 0.92 && rect.bottom > vh * 0.05) {
            el.classList.add("is-revealed");
          }
        });
      };

      const onTick = () => {
        reveal();
        ticking = false;
      };

      const onScroll = () => {
        if (!ticking) {
          rafId = requestAnimationFrame(onTick);
          ticking = true;
        }
      };

      reveal();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });

      cleanup = () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        cancelAnimationFrame(rafId);
      };
    };

    // Wait for the page (and its lazy route boundary) to finish loading before
    // mutating server-rendered DOM, otherwise React logs a hydration mismatch.
    let setupId = 0;
    const schedule = () => {
      setupId = window.setTimeout(setup, 60);
    };
    if (document.readyState === "complete") {
      schedule();
    } else {
      window.addEventListener("load", schedule, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      window.clearTimeout(setupId);
      cleanup?.();
    };
  }, [pathname]);

  return null;
}
