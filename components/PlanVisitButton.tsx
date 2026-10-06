"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  downloadIcs,
  formatVisitWhen,
  googleCalendarUrl,
  outlookCalendarUrl,
  type CalendarItem,
} from "@/lib/calendar";

type Props = {
  item: CalendarItem;
  directionsUrl?: string;
  className?: string;
  children?: ReactNode;
  "aria-label"?: string;
};

export function PlanVisitButton({
  item,
  directionsUrl,
  className,
  children,
  "aria-label": ariaLabel,
}: Props) {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) {
      setDownloaded(false);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function saveReminder() {
    downloadIcs(item);
    setDownloaded(true);
  }

  return (
    <>
      <button
        type="button"
        className={className}
        aria-label={ariaLabel}
        onClick={() => setOpen(true)}
      >
        {children ?? (
          <>
            Plan Your Visit
            <span className="material-symbols-outlined">calendar_add_on</span>
          </>
        )}
      </button>

      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 pt-24">
              <button
                type="button"
                className="absolute inset-0 bg-on-background/70"
                aria-label="Close plan your visit"
                onClick={() => setOpen(false)}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative z-10 w-full max-w-md overflow-hidden bg-surface-container-lowest brutalist-border brutalist-shadow-lg"
              >
                <div className="relative border-b-2 border-on-background px-5 py-4 pr-16 bg-secondary-container">
                  <p className="font-label-md text-xs uppercase tracking-[0.16em] text-primary mb-1">
                    Plan your visit
                  </p>
                  <h2
                    id={titleId}
                    className="font-headline-md text-xl uppercase leading-tight"
                  >
                    {item.title}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center brutalist-border bg-white"
                    aria-label="Close"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  <p className="font-body-md text-on-surface-variant">
                    Add this gathering to your phone or laptop so you get a reminder
                    when it&apos;s time to go.
                  </p>
                  <p className="font-label-md uppercase tracking-wide flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary">
                      schedule
                    </span>
                    {formatVisitWhen(item)}
                  </p>
                  {item.location ? (
                    <p className="font-label-md uppercase tracking-wide flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary">
                        place
                      </span>
                      {item.location}
                    </p>
                  ) : null}

                  <div className="flex flex-col gap-3 pt-2">
                    <a
                      href={googleCalendarUrl(item)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-3 bg-primary text-on-primary px-5 py-4 brutalist-border brutalist-shadow font-headline-md text-sm uppercase hover-press"
                    >
                      Google Calendar
                      <span className="material-symbols-outlined">open_in_new</span>
                    </a>
                    <a
                      href={outlookCalendarUrl(item)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-3 bg-surface text-on-background px-5 py-4 brutalist-border font-headline-md text-sm uppercase hover:bg-secondary-container"
                    >
                      Outlook
                      <span className="material-symbols-outlined">open_in_new</span>
                    </a>
                    <button
                      type="button"
                      onClick={saveReminder}
                      className="flex items-center justify-between gap-3 bg-surface text-on-background px-5 py-4 brutalist-border font-headline-md text-sm uppercase hover:bg-secondary-container text-left"
                    >
                      Apple, phone &amp; laptop
                      <span className="material-symbols-outlined">download</span>
                    </button>
                    {directionsUrl ? (
                      <a
                        href={directionsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-3 bg-surface text-on-background px-5 py-4 brutalist-border font-headline-md text-sm uppercase hover:bg-secondary-container"
                      >
                        Get directions
                        <span className="material-symbols-outlined">near_me</span>
                      </a>
                    ) : null}
                  </div>

                  {downloaded ? (
                    <p className="font-body-md text-on-surface-variant">
                      Reminder downloaded. Open the file to save it on this device.
                    </p>
                  ) : (
                    <p className="font-label-sm text-on-surface-variant uppercase">
                      Apple, Samsung and Outlook on a computer use the download.
                    </p>
                  )}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
