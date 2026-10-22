"use client";

import { useEffect, useState } from "react";
import "./typed-text.css";

const TYPE_MS = 62;

function whenHeroIsVisible(run: () => void) {
  const root = document.documentElement;
  let cancelled = false;
  let timer = 0;

  const begin = () => {
    if (cancelled) return;
    timer = window.setTimeout(() => {
      if (!cancelled) run();
    }, 220);
  };

  if (root.dataset.kpIntro !== "playing") {
    timer = window.setTimeout(begin, 80);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }

  const observer = new MutationObserver(() => {
    if (root.dataset.kpIntro === "playing") return;
    observer.disconnect();
    window.clearTimeout(fallback);
    begin();
  });
  observer.observe(root, { attributes: true, attributeFilter: ["data-kp-intro"] });
  const fallback = window.setTimeout(() => {
    observer.disconnect();
    begin();
  }, 2200);

  return () => {
    cancelled = true;
    observer.disconnect();
    window.clearTimeout(fallback);
    window.clearTimeout(timer);
  };
}

/** Types a hero title once. The full word stays in the layout so nothing jumps. */
export function TypedText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length);
      return;
    }

    let interval = 0;
    let delayTimer = 0;
    const stopWaiting = whenHeroIsVisible(() => {
      let next = 0;
      delayTimer = window.setTimeout(() => {
        interval = window.setInterval(() => {
          next += 1;
          setCount(next);
          if (next >= text.length) window.clearInterval(interval);
        }, TYPE_MS);
      }, delay);
    });

    return () => {
      stopWaiting();
      window.clearTimeout(delayTimer);
      window.clearInterval(interval);
    };
  }, [text, delay]);

  const done = count >= text.length;

  return (
    <span className={className}>
      <span className="kp-typed">
        <span className="sr-only">{text}</span>
        <span className="kp-typed__sizer" aria-hidden="true">
          {text}
        </span>
        <span className="kp-typed__live" aria-hidden="true">
          {text.slice(0, count)}
          {done ? null : <span className="kp-typed__caret" />}
        </span>
      </span>
    </span>
  );
}
