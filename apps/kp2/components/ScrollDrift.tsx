"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Slides its children as the nearest section moves through the viewport. */
export function ScrollDrift({
  className,
  travel = 80,
  children,
}: {
  className?: string;
  travel?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const section = el?.closest("section");
    if (!el || !section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const view = window.innerHeight || 1;
      const progress = (view - rect.top) / (view + rect.height);
      const clamped = Math.min(Math.max(progress, 0), 1);
      el.style.transform = `translate3d(0, ${(clamped - 0.5) * travel}px, 0)`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const targets: EventTarget[] = [window];
    let node = section.parentElement;
    while (node) {
      targets.push(node);
      node = node.parentElement;
    }

    update();
    targets.forEach((target) => target.addEventListener("scroll", schedule, { passive: true }));
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      targets.forEach((target) => target.removeEventListener("scroll", schedule));
      window.removeEventListener("resize", schedule);
    };
  }, [travel]);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {children}
    </div>
  );
}
