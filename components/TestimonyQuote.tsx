"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

const TEASER_CHARS = 160;

function excerpt(text: string, max = TEASER_CHARS) {
  const clean = text.replace(/^["“]|["”]$/g, "").trim();
  if (clean.length <= max) return { teaser: clean, truncated: false };
  const cut = clean.slice(0, max).replace(/\s+\S*$/, "").trim();
  return { teaser: `${cut}…`, truncated: true };
}

export function TestimonyQuote({
  quote,
  name,
  meta,
  className = "font-body-lg italic text-on-surface leading-relaxed",
  onOpenChange,
}: {
  quote: string;
  name: string;
  meta?: string;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const { teaser, truncated } = excerpt(quote);

  function toggle(next: boolean) {
    setOpen(next);
    onOpenChange?.(next);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        onOpenChange?.(false);
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  const modal = (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 pt-24 bg-on-background/70"
      onClick={() => toggle(false)}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-[#1f1c24] brutalist-border brutalist-shadow-lg p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => toggle(false)}
          className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center brutalist-border bg-secondary-container"
          aria-label="Close testimony"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <span className="material-symbols-outlined text-primary text-4xl">format_quote</span>
        <p className="font-body-lg italic text-on-surface leading-relaxed mt-2 whitespace-pre-wrap pr-10">
          {quote.replace(/^["“]|["”]$/g, "")}
        </p>
        <h3 id={titleId} className="font-headline-md text-2xl uppercase mt-6">
          — {name}
        </h3>
        {meta ? (
          <p className="font-label-sm text-primary uppercase mt-1">{meta}</p>
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      <p className={className}>{teaser}</p>
      {truncated ? (
        <button
          type="button"
          onClick={() => toggle(true)}
          className="mt-3 font-label-md uppercase tracking-widest text-primary hover:underline"
        >
          Read more
        </button>
      ) : null}
      {mounted && open ? createPortal(modal, document.body) : null}
    </>
  );
}
