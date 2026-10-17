"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/** Longest we hold the old page on screen while the next route loads. */
const MAX_WAIT_MS = 500;

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void> | void) => {
    ready: Promise<void>;
    finished: Promise<void>;
  };
};

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Internal links crossfade to the
 * next page with the View Transitions API instead of snapping. Clicking a link
 * to the page you are already on (e.g. the logo on the homepage) glides to the top.
 * Browsers without the API, or with reduced motion, navigate normally.
 */
export function SmoothNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const finish = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!finish.current) return;
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    finish.current();
    finish.current = null;
  }, [pathname]);

  useEffect(() => {
    const navigate = (href: string) => {
      const doc = document as ViewTransitionDocument;
      if (!doc.startViewTransition || reducedMotion()) {
        router.push(href);
        return;
      }
      if (finish.current) finish.current();
      document.documentElement.dataset.navigating = "true";
      const transition = doc.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            const done = () => {
              window.clearTimeout(timer);
              finish.current = null;
              delete document.documentElement.dataset.navigating;
              resolve();
            };
            const timer = window.setTimeout(done, MAX_WAIT_MS);
            finish.current = done;
            router.push(href);
          }),
      );
      // A second click can skip an earlier snapshot. That is a normal navigation outcome.
      void transition.ready.catch(() => {});
      void transition.finished.catch(() => {});
    };
    const onRequest = (event: Event) => {
      const request = event as CustomEvent<string>;
      request.preventDefault();
      navigate(request.detail);
    };
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.closest("[data-no-smooth-nav]")) return;
      if ((link.target && link.target !== "_self") || link.hasAttribute("download")) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname.startsWith("/api/")) return;

      const here = window.location;
      if (url.pathname === here.pathname) {
        if (url.hash || url.search !== here.search) return;
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      navigate(`${url.pathname}${url.search}${url.hash}`);
    };

    const warmed = new Set<string>();
    const warm = (e: Event) => {
      const link = (e.target as Element | null)?.closest?.("[data-smooth-nav] a[href^='/']");
      if (!(link instanceof HTMLAnchorElement)) return;
      if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
        return;
      const href = `${link.pathname}${link.search}`;
      if (warmed.has(href)) return;
      warmed.add(href);
      router.prefetch(href);
    };

    window.addEventListener("kharis:navigate", onRequest);
    document.addEventListener("click", onClick, true);
    document.addEventListener("pointerover", warm, { passive: true });
    document.addEventListener("focusin", warm);
    return () => {
      finish.current?.();
      window.removeEventListener("kharis:navigate", onRequest);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("pointerover", warm);
      document.removeEventListener("focusin", warm);
    };
  }, [router]);

  return null;
}
