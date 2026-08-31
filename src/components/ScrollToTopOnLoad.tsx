"use client";

import { useEffect } from "react";

/**
 * Refresh / restart always opens at the hero top.
 * (Hash links like #near-you from “Find a Branch” otherwise stick on reload.)
 */
export function ScrollToTopOnLoad() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const forceTop = () => {
      const { hash } = window.location;
      if (
        hash === "#near-you" ||
        hash === "#branches" ||
        hash === "#top" ||
        hash === "#know" ||
        hash === "#messages" ||
        hash === "#give" ||
        hash === "#vision" ||
        hash === "#testimonies"
      ) {
        history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}`,
        );
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
