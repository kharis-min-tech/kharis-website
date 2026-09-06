"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Testimony } from "@/lib/testimonies";

type Props = {
  testimony: Testimony | null;
  onClose: () => void;
};

export function TestimonyReadModal({ testimony, onClose }: Props) {
  const reduce = useReducedMotion();
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!testimony) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [testimony, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {testimony ? (
        <motion.div
          className="testimony-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <button
            type="button"
            className="testimony-modal__scrim"
            aria-label="Close testimony"
            onClick={onClose}
          />

          <motion.div
            className="testimony-modal__panel testimony-modal__panel--read"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={reduce ? false : { opacity: 0, y: 36, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
          >
            <div className="testimony-modal__toolbar">
              <p className="testimony-modal__toolbar-label">Testimony</p>
              <h2 id={titleId} className="testimony-modal__toolbar-title">
                {testimony.name}
              </h2>
              <button
                type="button"
                className="testimony-modal__close"
                onClick={onClose}
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7a1 1 0 0 0-1.4 1.4L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4Z"
                  />
                </svg>
              </button>
            </div>

            <div className="testimony-modal__body testimony-read">
              {testimony.category ? (
                <p className="testimony-read__category">{testimony.category}</p>
              ) : null}
              <p className="testimony-read__quote">{testimony.description}</p>
              <div className="testimony-read__meta">
                <strong>{testimony.name}</strong>
                {testimony.branch_name ? (
                  <span>{testimony.branch_name}</span>
                ) : null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
