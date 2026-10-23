"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Keep changing tab content in normal flow while its container settles. */
export function AnimatedHeight({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ height: number; animate: boolean }>();

  useEffect(() => {
    const content = contentRef.current;
    if (!content || typeof ResizeObserver === "undefined") return;
    let previousWidth: number | undefined;
    const measure = () => {
      const { height, width } = content.getBoundingClientRect();
      setSize({ height, animate: previousWidth === width });
      previousWidth = width;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="kp-animated-height"
      style={{ height: size?.height, transitionDuration: size?.animate ? undefined : "0ms" }}
    >
      <div ref={contentRef} className="flow-root">
        {children}
      </div>
    </div>
  );
}
