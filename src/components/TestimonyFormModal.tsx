"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

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

type Props = {
  open: boolean;
  onClose: () => void;
};

export function TestimonyFormModal({ open, onClose }: Props) {
  const reduce = useReducedMotion();
  const titleId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setSent(false);
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
        headers: {
          "Content-Type": "application/json",
        },
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

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
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
            aria-label="Close testimony form"
            onClick={onClose}
          />

          <motion.div
            className="testimony-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduce ? false : { opacity: 0, y: 36, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
          >
            <div className="testimony-modal__toolbar">
              <p className="testimony-modal__toolbar-label">Testimony Form</p>
              <h2 id={titleId} className="testimony-modal__toolbar-title">Share what Jesus has done</h2>
              <button
                type="button"
                className="testimony-modal__close"
                onClick={onClose}
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                  <path fill="currentColor" d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7a1 1 0 0 0-1.4 1.4L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4Z" />
                </svg>
              </button>
            </div>

            <div className="testimony-modal__body">
              {sent ? (
                <div className="testimony-modal__thanks">
                  <p className="testimony-modal__thanks-kicker">Thank you</p>
                  <h3>Your testimony has been received</h3>
                  <p>
                    Glory to God. Our team will review your story. Thank you for
                    giving Him the praise.
                  </p>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form className="testimony-modal__form" onSubmit={onSubmit}>
                  <div className="testimony-modal__grid">
                    <label className="testimony-modal__field">
                      <span>
                        First Name <em>*</em>
                      </span>
                      <input
                        ref={firstFieldRef}
                        name="firstName"
                        type="text"
                        required
                        autoComplete="given-name"
                      />
                    </label>
                    <label className="testimony-modal__field">
                      <span>Preferred Name</span>
                      <input
                        name="preferredName"
                        type="text"
                        autoComplete="nickname"
                      />
                    </label>
                    <label className="testimony-modal__field">
                      <span>
                        Last Name <em>*</em>
                      </span>
                      <input
                        name="lastName"
                        type="text"
                        required
                        autoComplete="family-name"
                      />
                    </label>
                    <label className="testimony-modal__field">
                      <span>Mobile Number</span>
                      <input
                        name="mobile"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                      />
                    </label>
                    <label className="testimony-modal__field">
                      <span>Date</span>
                      <input name="date" type="date" />
                    </label>
                    <label className="testimony-modal__field">
                      <span>Testimony Date</span>
                      <input name="testimonyDate" type="date" />
                    </label>
                  </div>

                  <fieldset className="testimony-modal__choice">
                    <legend>Are you a member of Kharis Church?</legend>
                    <div className="testimony-modal__radios">
                      <label>
                        <input type="radio" name="member" value="Yes" />
                        <span>Yes</span>
                      </label>
                      <label>
                        <input type="radio" name="member" value="No" />
                        <span>No</span>
                      </label>
                    </div>
                  </fieldset>

                  <fieldset className="testimony-modal__cats">
                    <legend>
                      How would you categorise your testimony? <em>*</em>
                    </legend>
                    <div className="testimony-modal__chips">
                      {CATEGORIES.map((cat) => (
                        <label key={cat}>
                          <input
                            type="radio"
                            name="category"
                            value={cat}
                            required
                          />
                          <span>{cat}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <label className="testimony-modal__field testimony-modal__field--full">
                    <span>
                      Details of Testimony <em>*</em>
                    </span>
                    <textarea
                      name="details"
                      rows={6}
                      required
                      placeholder="Share what the Lord has done…"
                    />
                  </label>

                  <fieldset className="testimony-modal__choice">
                    <legend>
                      Do you want your testimony to be shared anonymously?{" "}
                      <em>*</em>
                    </legend>
                    <div className="testimony-modal__radios">
                      <label>
                        <input
                          type="radio"
                          name="anonymous"
                          value="Yes"
                          required
                        />
                        <span>Yes</span>
                      </label>
                      <label>
                        <input type="radio" name="anonymous" value="No" />
                        <span>No</span>
                      </label>
                    </div>
                  </fieldset>

                  <fieldset className="testimony-modal__choice">
                    <legend>
                      Would you like your testimony to be read on your behalf?{" "}
                      <em>*</em>
                    </legend>
                    <div className="testimony-modal__radios">
                      <label>
                        <input
                          type="radio"
                          name="readOnBehalf"
                          value="Yes"
                          required
                        />
                        <span>Yes</span>
                      </label>
                      <label>
                        <input type="radio" name="readOnBehalf" value="No" />
                        <span>No</span>
                      </label>
                    </div>
                  </fieldset>

                  <fieldset className="testimony-modal__choice">
                    <legend>
                      Are you happy for your testimony to be used for online
                      content?
                    </legend>
                    <div className="testimony-modal__radios">
                      <label>
                        <input type="radio" name="onlineUse" value="Yes" />
                        <span>Yes</span>
                      </label>
                      <label>
                        <input type="radio" name="onlineUse" value="No" />
                        <span>No</span>
                      </label>
                    </div>
                  </fieldset>

                  {submitError && (
                    <p
                      role="alert"
                      style={{
                        color: "#b42318",
                        marginTop: "12px",
                      }}
                    >
                      {submitError}
                    </p>
                  )}

                  <div className="testimony-modal__actions">
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Submit testimony"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
