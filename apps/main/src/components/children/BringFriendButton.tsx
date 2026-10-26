"use client";

import { useState } from "react";

/** Shares a link to this age group, or copies it when the device has no share sheet. */
export function BringFriendButton({
  groupId,
  groupName,
  label,
}: {
  groupId: string;
  groupName: string;
  label: string;
}) {
  const [invite, setInvite] = useState<"idle" | "copied" | "failed">("idle");

  function flash(next: "copied" | "failed") {
    setInvite(next);
    window.setTimeout(() => setInvite("idle"), 2500);
  }

  async function bringAFriend() {
    const url = `${window.location.origin}${window.location.pathname}#${groupId}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: `${groupName} · Kharis Kids`, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      flash("copied");
    } catch {
      flash("failed");
    }
  }

  const inviteLabel =
    invite === "copied" ? "Link copied" : invite === "failed" ? "Couldn't share the link" : label;

  return (
    <>
      <button type="button" className="life-cta kids-cta kids-invite" onClick={bringAFriend}>
        {inviteLabel}
      </button>
      <p className="sr-only" aria-live="polite">
        {invite === "idle" ? "" : inviteLabel}
      </p>
    </>
  );
}
