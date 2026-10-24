"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  downloadIcs,
  formatVisitWhen,
  googleCalendarUrl,
  outlookCalendarUrl,
  type CalendarItem,
} from "@/lib/calendar";
import { withBasePath } from "@/lib/base-path";

type Props = {
  item?: CalendarItem;
  directionsUrl?: string;
  branchName?: string;
  /** Ask for their details so the branch sees the visit in Content Studio. */
  collectDetails?: boolean;
  className?: string;
  children?: ReactNode;
  "aria-label"?: string;
};

export function PlanVisitButton({
  item,
  directionsUrl,
  branchName,
  collectDetails = false,
  className,
  children,
  "aria-label": ariaLabel,
}: Props) {
  const titleId = useId();
  const consentId = useId();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [childrenComing, setChildrenComing] = useState(false);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");
  const request = useRef<AbortController | null>(null);

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
      request.current?.abort();
    };
  }, [open]);

  function saveReminder() {
    if (!item) return;
    downloadIcs(item);
    setDownloaded(true);
  }

  async function sendDetails(event: FormEvent) {
    event.preventDefault();
    if (!consent) {
      setError("Please confirm the branch can contact you about this visit.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      request.current?.abort();
      request.current = new AbortController();
      const res = await fetch(withBasePath("/api/visit"), {
        method: "POST",
        signal: request.current.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          branch: branchName || item?.location || "",
          gathering: item?.title || "Next Sunday",
          children: childrenComing,
          consent,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Unable to save your visit. Please try again.");
        return;
      }
      setSent(name.trim().split(/\s+/)[0] || name.trim());
      setName("");
      setEmail("");
      setPhone("");
      setChildrenComing(false);
      setConsent(false);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError("Unable to save your visit. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const fieldClass =
    "w-full border-2 border-[#151218] bg-white px-3 py-3 font-body-md text-sm text-[#151218]";

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
                className="relative z-10 max-h-[min(90svh,760px)] w-full max-w-md overflow-y-auto bg-surface-container-lowest brutalist-border brutalist-shadow-lg"
              >
                <div className="relative border-b-2 border-on-background px-5 py-4 pr-16 bg-secondary-container">
                  <p className="font-label-md text-xs uppercase tracking-[0.16em] text-primary mb-1">
                    Plan your visit
                  </p>
                  <h2 id={titleId} className="font-headline-md text-xl uppercase leading-tight">
                    {item?.title || branchName || "Tell the branch you're coming"}
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
                  {collectDetails ? (
                    sent ? (
                      <p className="font-body-md text-on-surface-variant" role="status">
                        You&apos;re on the list{sent ? `, ${sent}` : ""}. The branch has your
                        details and can contact you about this visit.
                      </p>
                    ) : (
                      <form onSubmit={sendDetails} className="space-y-3">
                        <p className="font-body-md text-on-surface-variant">
                          Leave your details and the branch can see that you&apos;re coming.
                        </p>
                        <label className="block font-label-md text-xs uppercase tracking-wide">
                          Full name
                          <input
                            required
                            autoComplete="name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className={`${fieldClass} mt-1`}
                          />
                        </label>
                        <label className="block font-label-md text-xs uppercase tracking-wide">
                          Email
                          <input
                            required
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className={`${fieldClass} mt-1`}
                          />
                        </label>
                        <label className="block font-label-md text-xs uppercase tracking-wide">
                          Phone (optional)
                          <input
                            type="tel"
                            autoComplete="tel"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            className={`${fieldClass} mt-1`}
                          />
                        </label>
                        <label className="flex items-start gap-3 border-2 border-[#151218] bg-white p-3">
                          <input
                            type="checkbox"
                            checked={childrenComing}
                            onChange={(event) => setChildrenComing(event.target.checked)}
                            className="mt-0.5 h-4 w-4"
                          />
                          <span className="font-body-md text-sm text-[#151218]">
                            I will be bringing children (ages 0-12).
                          </span>
                        </label>
                        <label
                          htmlFor={consentId}
                          className="flex items-start gap-3 border-2 border-[#151218] bg-[#f7be1d] p-3"
                        >
                          <input
                            id={consentId}
                            type="checkbox"
                            checked={consent}
                            onChange={(event) => setConsent(event.target.checked)}
                            className="mt-0.5 h-4 w-4"
                          />
                          <span className="font-body-md text-sm text-[#151218]">
                            The branch can contact me about this visit if needed.
                          </span>
                        </label>
                        {error ? (
                          <p className="font-body-md text-sm text-[#9b1c1c]">{error}</p>
                        ) : null}
                        <button
                          type="submit"
                          disabled={busy || !consent}
                          className="flex w-full items-center justify-center bg-primary px-5 py-4 font-headline-md text-sm uppercase text-on-primary brutalist-border brutalist-shadow disabled:opacity-60"
                        >
                          {busy ? "Sending…" : "Send my details"}
                        </button>
                      </form>
                    )
                  ) : (
                    <p className="font-body-md text-on-surface-variant">
                      Add this gathering to your phone or laptop so you get a reminder when
                      it&apos;s time to go.
                    </p>
                  )}

                  {item ? (
                    <>
                      <p className="font-label-md uppercase tracking-wide flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary">schedule</span>
                        {formatVisitWhen(item)}
                      </p>
                      {item.location ? (
                        <p className="font-label-md uppercase tracking-wide flex items-start gap-2">
                          <span className="material-symbols-outlined text-primary">place</span>
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
                    </>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
