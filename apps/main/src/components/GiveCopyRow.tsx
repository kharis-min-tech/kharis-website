/**
 * One line of account details with a copy button.
 *
 * Lifted out of GiveExperience when the Ghana details moved to their own
 * page at /give/accra, so the two pages share one row rather than keeping
 * two that have to be changed together.
 */
"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyRow({ label, value, hint }: { label: string; value: string; hint?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="gv-row">
      <dt>{label}</dt>
      <dd>
        {value}
        {hint ? <span className="gv-row__hint">{hint}</span> : null}
      </dd>
      <button
        type="button"
        className={`gv-row__copy${copied ? " is-done" : ""}`}
        onClick={copy}
        aria-label={copied ? `${label} copied` : `Copy ${label.toLowerCase()}`}
      >
        {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
        <span aria-hidden>{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}
