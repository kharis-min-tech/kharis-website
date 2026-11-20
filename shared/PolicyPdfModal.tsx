"use client";

import { useEffect, useRef } from "react";

export type PolicyPdfModalProps = {
  title: string;
  pdfUrl: string;
  onClose: () => void;
};

/**
 * A simple popup that just embeds the policy PDF, scrollable in place — no
 * transcribed text, no redirect. Closing returns focus to whatever opened it.
 */
export function PolicyPdfModal({ title, pdfUrl, onClose }: PolicyPdfModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close.current();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
      if (trigger?.isConnected) trigger.focus();
    };
  }, []);

  return (
    <div
      className="policy-pdf-modal"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="policy-pdf-modal__box" ref={panelRef} tabIndex={-1}>
        <div className="policy-pdf-modal__bar">
          <p className="policy-pdf-modal__title">{title}</p>
          <a
            className="policy-pdf-modal__open"
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in a new tab
          </a>
          <button
            type="button"
            className="policy-pdf-modal__close"
            onClick={onClose}
            aria-label={`Close ${title}`}
          >
            ×
          </button>
        </div>
        <div className="policy-pdf-modal__frame">
          <iframe title={title} src={`${pdfUrl}#view=FitH`} loading="lazy" />
        </div>
      </div>
    </div>
  );
}
