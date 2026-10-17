"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Animate upcoming sections while keeping visible content and keyboard targets readable. */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || !("IntersectionObserver" in window)) return;

    const targets = new Set<HTMLElement>();
    const reveal = (element: HTMLElement) => {
      element.classList.add("is-revealed");
      observer.unobserve(element);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        });
      },
      { rootMargin: "0px 0px -32px 0px", threshold: 0 },
    );

    const setup = () => {
      document.querySelectorAll<HTMLElement>("main section").forEach((element) => {
        if (targets.has(element)) return;
        targets.add(element);
        // Never hide an initial viewport, restored scroll position or hash destination.
        if (element.getBoundingClientRect().top < window.innerHeight) return;
        element.classList.add("reveal-on-scroll");
        observer.observe(element);
      });
    };
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      targets.forEach((element) => {
        if (element.contains(event.target as Node)) reveal(element);
      });
    };
    const onMotionChange = () => {
      if (motion.matches) targets.forEach(reveal);
    };

    // The header signals after its page hydrates. Layout effects alone can run
    // while a streamed page still contains React-owned server markup.
    let setupFrame = 0;
    const onPageReady = () => {
      if (document.documentElement.dataset.kpPageReady !== pathname) return;
      cancelAnimationFrame(setupFrame);
      setupFrame = requestAnimationFrame(setup);
    };
    window.addEventListener("kp:page-ready", onPageReady);
    onPageReady();
    document.addEventListener("focusin", onFocus);
    motion.addEventListener("change", onMotionChange);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(setupFrame);
      window.removeEventListener("kp:page-ready", onPageReady);
      document.removeEventListener("focusin", onFocus);
      motion.removeEventListener("change", onMotionChange);
      targets.forEach((element) => {
        element.classList.remove("reveal-on-scroll", "is-revealed");
      });
    };
  }, [pathname]);

  return null;
}
