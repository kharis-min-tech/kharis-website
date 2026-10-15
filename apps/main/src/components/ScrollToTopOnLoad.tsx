"use client";

import { useEffect } from "react";

/**
 * Refresh / restart always opens at the hero top.
 * (Hash links like #near-you from “Find a Branch” otherwise stick on reload.)
 * A link straight to a section (e.g. /#messages from another page) still lands on that section.
 */
export function ScrollToTopOnLoad() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const [entry] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    const section =
      entry?.type === "navigate" && window.location.hash.length > 1
        ? document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
        : null;
    if (section) {
      // The page shifts while the hero loads, so re-apply a few times; stop once the visitor scrolls.
      let expected = -1;
      const timers = [0, 250, 900, 1800].map((ms) =>
        window.setTimeout(() => {
          if (expected >= 0 && Math.abs(window.scrollY - expected) > 4) return;
          // "instant" overrides the page's smooth scrolling, so the check above reads the final position.
          section.scrollIntoView({ behavior: "instant", block: "start" });
          expected = window.scrollY;
        }, ms),
      );
      return () => timers.forEach((t) => window.clearTimeout(t));
    }

    const forceTop = () => {
      const { hash } = window.location;
      if (
        hash === "#near-you" ||
        hash === "#who-we-are" ||
        hash === "#branches" ||
        hash === "#top" ||
        hash === "#know" ||
        hash === "#messages" ||
        hash === "#give" ||
        hash === "#vision" ||
        hash === "#testimonies"
      ) {
        history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      }
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    forceTop();
    const t0 = window.setTimeout(forceTop, 0);
    const t1 = window.setTimeout(forceTop, 80);
    const t2 = window.setTimeout(forceTop, 250);

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) forceTop();
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
