"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";

const CATEGORIES = [
  "Deliverance",
  "Education",
  "Family/Marriage",
  "Finances/Miracle Money",
  "Health/Healing",
  "Housing/Mortgage",
  "Job/Career",
  "Safe Passage/Protection",
  "Salvation",
  "Unusual Favour",
  "Other",
] as const;

const fieldClass =
  "w-full rounded-2xl border border-on-background/15 bg-surface-container-lowest p-3 font-body-md input-focus outline-none";
const labelClass = "font-label-md text-xs uppercase tracking-widest text-on-surface";
const chipClass =
  "inline-flex items-center justify-center min-h-11 px-4 rounded-full border border-on-background/15 bg-surface-container-lowest font-label-md text-xs uppercase tracking-wide cursor-pointer peer-checked:bg-amber peer-checked:text-[#1a0b00] peer-checked:border-amber";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function TestimonyFormModal({ open, onClose }: Props) {
  const titleId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onNativeClose = () => onClose();
    dialog.addEventListener("close", onNativeClose);
    return () => dialog.removeEventListener("close", onNativeClose);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSent(false);
      setSubmitError("");
    }
  }, [open]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const payload = {
        firstName: formData.get("firstName"),
        preferredName: formData.get("preferredName"),
        lastName: formData.get("lastName"),
        mobile: formData.get("mobile"),
        date: formData.get("date"),
        testimonyDate: formData.get("testimonyDate"),
        member: formData.get("member"),
        category: formData.get("category"),
        details: formData.get("details"),
        anonymous: formData.get("anonymous"),
        readOnBehalf: formData.get("readOnBehalf"),
        onlineUse: formData.get("onlineUse"),
      };

      const response = await fetch("/api/testimonies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to submit testimony.");
      }

      form.reset();
      setSent(true);
    } catch (error) {
      console.error(error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to submit testimony. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      id="testimony-form-dialog"
      className="ui-dialog w-[min(42rem,calc(100vw-2rem))] max-h-[85vh] overflow-hidden rounded-3xl border border-on-background/10 bg-surface-container-lowest p-0 text-on-surface vibe-glow"
      aria-labelledby={titleId}
    >
      <div className="relative z-10 flex max-h-[85vh] flex-col">
        <div className="relative shrink-0 border-b border-on-background/10 px-5 sm:px-6 py-4 pr-16 bg-amber">
          <p className="font-label-md text-xs uppercase tracking-[0.16em] text-[#1a0b00] mb-1">
            Testimony Form
          </p>
          <h2 id={titleId} className="font-headline-md text-xl sm:text-2xl uppercase leading-tight text-[#1a0b00]">
            Share what Jesus has done
          </h2>
          <button
            type="button"
            data-ui="close-dialog"
            onClick={onClose}
            className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center rounded-xl border border-[#1a0b00]/15 bg-white/80"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">
          {sent ? (
            <div className="flex flex-col items-start gap-3 py-4">
              <p className="font-label-md text-xs uppercase tracking-[0.16em] text-primary">
                Thank you
              </p>
              <h3 className="font-headline-md text-2xl uppercase">
                Your testimony has been received
              </h3>
              <p className="font-body-md text-on-surface-variant max-w-xl">
                Glory to God. Our team will review your story. Thank you for giving Him the praise.
              </p>
              <button
                type="button"
                data-ui="close-dialog"
                className="mt-4 rounded-2xl bg-primary text-on-primary px-8 py-3 font-headline-md uppercase vibe-glow"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          ) : (
            <form
                className="flex flex-col gap-5"
                action="/api/testimonies"
                method="POST"
                onSubmit={onSubmit}
              >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>
                    First Name <em className="text-primary not-italic">*</em>
                  </span>
                  <input
                    ref={firstFieldRef}
                    name="firstName"
                    type="text"
                    required
                    autoComplete="given-name"
                    className={fieldClass}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Preferred Name</span>
                  <input
                    name="preferredName"
                    type="text"
                    autoComplete="nickname"
                    className={fieldClass}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>
                    Last Name <em className="text-primary not-italic">*</em>
                  </span>
                  <input
                    name="lastName"
                    type="text"
                    required
                    autoComplete="family-name"
                    className={fieldClass}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Mobile Number</span>
                  <input
                    name="mobile"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    className={fieldClass}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Date</span>
                  <input name="date" type="date" className={fieldClass} />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Testimony Date</span>
                  <input name="testimonyDate" type="date" className={fieldClass} />
                </label>
              </div>

              <fieldset>
                <legend className={`${labelClass} mb-3`}>Are you a member of Kharis Phase 2?</legend>
                <div className="flex flex-wrap gap-2">
                  {["Yes", "No"].map((value) => (
                    <label key={`member-${value}`}>
                      <input type="radio" name="member" value={value} className="peer sr-only" />
                      <span className={chipClass}>{value}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className={`${labelClass} mb-3`}>
                  How would you categorise your testimony?{" "}
                  <em className="text-primary not-italic">*</em>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <label key={cat}>
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        required
                        className="peer sr-only"
                      />
                      <span className={chipClass}>{cat}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="flex flex-col gap-2">
                <span className={labelClass}>
                  Details of Testimony <em className="text-primary not-italic">*</em>
                </span>
                <textarea
                  name="details"
                  rows={6}
                  required
                  placeholder="Share what the Lord has done…"
                  className={`${fieldClass} min-h-32 resize-y`}
                />
              </label>

              <fieldset>
                <legend className={`${labelClass} mb-3`}>
                  Do you want your testimony to be shared anonymously?{" "}
                  <em className="text-primary not-italic">*</em>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {["Yes", "No"].map((value) => (
                    <label key={`anonymous-${value}`}>
                      <input
                        type="radio"
                        name="anonymous"
                        value={value}
                        required
                        className="peer sr-only"
                      />
                      <span className={chipClass}>{value}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className={`${labelClass} mb-3`}>
                  Would you like your testimony to be read on your behalf?{" "}
                  <em className="text-primary not-italic">*</em>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {["Yes", "No"].map((value) => (
                    <label key={`read-${value}`}>
                      <input
                        type="radio"
                        name="readOnBehalf"
                        value={value}
                        required
                        className="peer sr-only"
                      />
                      <span className={chipClass}>{value}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className={`${labelClass} mb-3`}>
                  Are you happy for your testimony to be used for online content?
                </legend>
                <div className="flex flex-wrap gap-2">
                  {["Yes", "No"].map((value) => (
                    <label key={`online-${value}`}>
                      <input type="radio" name="onlineUse" value={value} className="peer sr-only" />
                      <span className={chipClass}>{value}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {submitError ? (
                <p role="alert" className="font-body-md text-red-700">
                  {submitError}
                </p>
              ) : null}

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-2xl bg-primary text-on-primary px-8 py-3 font-headline-md uppercase vibe-glow disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit testimony"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}
