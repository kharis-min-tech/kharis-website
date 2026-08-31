"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/Icon";
import {
  formatEventLong,
  googleCalendarUrl,
  type ChurchEvent,
} from "@/lib/events-content";

type Props = {
  event: ChurchEvent | null;
  onClose: () => void;
};

export function EventDetailModal({ event, onClose }: Props) {
  const reduce = useReducedMotion();
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!event) return;
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
  }, [event, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {event ? (
        <motion.div
          className="event-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <button
            type="button"
            className="event-modal__scrim"
            aria-label="Close event details"
            onClick={onClose}
          />
          <motion.div
            className="event-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduce ? false : { opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
          >
            <div className="event-modal__hero">
              <Image
                src={event.image}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 800px) 100vw, 48rem"
              />
              <div className="event-modal__hero-veil" />
              <button
                type="button"
                className="event-modal__close"
                onClick={onClose}
                aria-label="Close"
              >
                ×
              </button>
              <div className="event-modal__hero-copy">
                <p className="event-modal__eyebrow">{event.category}</p>
                <h2 id={titleId}>{event.title}</h2>
                <p className="event-modal__hero-place">{event.location}</p>
              </div>
            </div>

            <div className="event-modal__body">
              <div className="event-modal__facts">
                <div className="event-modal__fact">
                  <p className="event-modal__fact-label">
                    <Icon name="watch" className="h-4 w-4" />
                    Time
                  </p>
                  <p>
                    {formatEventLong(event.date, event.time, event.timezone)}
                  </p>
                </div>
                <div className="event-modal__fact">
                  <p className="event-modal__fact-label">
                    <Icon name="location" className="h-4 w-4" />
                    Location
                  </p>
                  <p>
                    {event.location}
                    <br />
                    <span>{event.address}</span>
                  </p>
                </div>
              </div>

              <a
                href={googleCalendarUrl(event)}
                target="_blank"
                rel="noreferrer"
                className="event-modal__cal"
              >
                Add to Google Calendar
              </a>

              <p className="event-modal__desc">{event.description}</p>

              <div className="event-modal__org">
                <p className="event-modal__org-label">Organizer</p>
                <div className="event-modal__org-row">
                  <span className="event-modal__org-mark" aria-hidden>
                    K
                  </span>
                  <div>
                    <strong>Kharis Church</strong>
                    <p>Changing the world with a touch of His Grace</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
