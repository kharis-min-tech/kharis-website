"use client";

import { useId, type ReactNode } from "react";
import {
  formatVisitWhen,
  googleCalendarUrl,
  icsContent,
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

function icsFilename(item: CalendarItem) {
  const start = new Date(item.start);
  const stamp = `${String(start.getUTCMonth() + 1).padStart(2, "0")}${String(start.getUTCDate()).padStart(2, "0")}`;
  const safe =
    item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ||
    "kharis-event";
  return `${safe}-${stamp}.ics`;
}

const actionClass =
  "flex items-center justify-between gap-3 rounded-2xl border border-on-background/10 bg-surface text-on-background px-5 py-4 font-headline-md text-sm uppercase hover:bg-amber hover:text-[#1a0b00]";

export function PlanVisitButton({
  item,
  directionsUrl,
  className,
  children,
  "aria-label": ariaLabel,
}: Props) {
  const dialogId = `plan-visit-${useId().replace(/:/g, "")}`;
  const titleId = `${dialogId}-title`;
  const icsHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent(item))}`;

  return (
    <>
      <button
        type="button"
        className={className}
        aria-label={ariaLabel}
        data-ui="open-dialog"
        data-dialog={dialogId}
      >
        {children ?? (
          <>
            Plan Your Visit
            <span className="material-symbols-outlined">calendar_add_on</span>
          </>
        )}
      </button>

      <dialog
        id={dialogId}
        className="ui-dialog w-[min(42rem,calc(100vw-2rem))] max-h-[85vh] overflow-hidden rounded-3xl border border-on-background/10 bg-surface-container-lowest p-0 text-on-surface vibe-glow"
        aria-labelledby={titleId}
      >
        <div className="relative border-b border-on-background/10 px-5 py-4 pr-16 bg-amber">
          <p className="font-label-comic text-xs uppercase tracking-[0.16em] text-[#1a0b00] mb-1">
            Plan your visit
          </p>
          <h2
            id={titleId}
            className="font-headline-md text-xl uppercase leading-tight text-[#1a0b00]"
          >
            {item.title}
          </h2>
          <button
            type="button"
            data-ui="close-dialog"
            className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center rounded-xl border border-[#1a0b00]/15 bg-white/80"
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
          <p className="font-label-comic uppercase tracking-wide flex items-start gap-2">
            <span className="material-symbols-outlined text-primary">
              schedule
            </span>
            {formatVisitWhen(item)}
          </p>
          {item.location ? (
            <p className="font-label-comic uppercase tracking-wide flex items-start gap-2">
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
              className="flex items-center justify-between gap-3 rounded-2xl bg-primary text-on-primary px-5 py-4 font-headline-md text-sm uppercase vibe-glow"
            >
              Google Calendar
              <span className="material-symbols-outlined">open_in_new</span>
            </a>
            <a
              href={outlookCalendarUrl(item)}
              target="_blank"
              rel="noreferrer"
              className={actionClass}
            >
              Outlook
              <span className="material-symbols-outlined">open_in_new</span>
            </a>
            <a
              href={icsHref}
              download={icsFilename(item)}
              className={actionClass}
            >
              Apple, phone &amp; laptop
              <span className="material-symbols-outlined">download</span>
            </a>
            {directionsUrl ? (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className={actionClass}
              >
                Get directions
                <span className="material-symbols-outlined">near_me</span>
              </a>
            ) : null}
          </div>

          <p className="font-label-comic text-xs text-on-surface-variant uppercase tracking-wide">
            Apple, Samsung and Outlook on a computer use the download.
          </p>

          <form method="dialog">
            <button
              type="submit"
              className="rounded-2xl bg-amber px-6 py-3 font-label-comic text-sm uppercase text-[#1a0b00]"
            >
              Close
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
