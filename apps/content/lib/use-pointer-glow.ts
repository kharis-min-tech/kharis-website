"use client";

import { useEffect, useState, type RefObject } from "react";

type Options = {
  enabled?: boolean;
  /** When set, track pointer only inside this element (local %). */
  containerRef?: RefObject<HTMLElement | null>;
};

/** Tracks pointer as CSS % vars; disabled when prefers-reduced-motion. */
export function usePointerGlow(enabledOrOptions: boolean | Options = true) {
  const options: Options =
    typeof enabledOrOptions === "boolean" ? { enabled: enabledOrOptions } : enabledOrOptions;
  const { enabled = true, containerRef } = options;
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled || reduced) return;
    const root = document.documentElement;
    let frame = 0;

    function apply(clientX: number, clientY: number, bounds: DOMRect | null) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let x: number;
        let y: number;
        let parallaxX: number;
        let parallaxY: number;
        if (bounds && bounds.width > 0 && bounds.height > 0) {
          x = ((clientX - bounds.left) / bounds.width) * 100;
          y = ((clientY - bounds.top) / bounds.height) * 100;
          parallaxX = ((clientX - bounds.left) / bounds.width - 0.5) * 12;
          parallaxY = ((clientY - bounds.top) / bounds.height - 0.5) * 12;
        } else {
          x = (clientX / window.innerWidth) * 100;
          y = (clientY / window.innerHeight) * 100;
          parallaxX = (clientX / window.innerWidth - 0.5) * 12;
          parallaxY = (clientY / window.innerHeight - 0.5) * 12;
        }
        root.style.setProperty("--pointer-x", `${Math.min(100, Math.max(0, x)).toFixed(2)}%`);
        root.style.setProperty("--pointer-y", `${Math.min(100, Math.max(0, y)).toFixed(2)}%`);
        root.style.setProperty("--pointer-parallax-x", `${parallaxX.toFixed(2)}px`);
        root.style.setProperty("--pointer-parallax-y", `${parallaxY.toFixed(2)}px`);
      });
    }

    root.style.setProperty("--pointer-x", "42%");
    root.style.setProperty("--pointer-y", "38%");
    root.style.setProperty("--pointer-parallax-x", "0px");
    root.style.setProperty("--pointer-parallax-y", "0px");

    function onMove(event: PointerEvent) {
      const el = containerRef?.current ?? null;
      if (el) {
        const bounds = el.getBoundingClientRect();
        const inside =
          event.clientX >= bounds.left &&
          event.clientX <= bounds.right &&
          event.clientY >= bounds.top &&
          event.clientY <= bounds.bottom;
        if (!inside) return;
        apply(event.clientX, event.clientY, bounds);
        return;
      }
      apply(event.clientX, event.clientY, null);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [enabled, reduced, containerRef]);

  return { reducedMotion: reduced };
}
