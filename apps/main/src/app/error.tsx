"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { isStaleDeployError, reloadOnceForStaleDeploy } from "@/lib/stale-deploy";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const stale = isStaleDeployError(error);
  /* Held so the page can say it is reloading rather than flashing the failure
   * copy for the moment before the document goes. */
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    console.error(error);
    /* A chunk that 404s because a deploy replaced it cannot be retried in
     * place - see lib/stale-deploy. Go straight for the one thing that works,
     * at most once, and fall through to the normal error page if we have
     * already tried. */
    if (stale && reloadOnceForStaleDeploy()) setReloading(true);
  }, [error, stale]);

  return (
    <main className="site-page route-error text-fg">
      <SiteHeader />
      <div className="route-error__panel">
        <p className="eyebrow">{reloading ? "One moment" : "Something went wrong"}</p>
        <h1>{reloading ? "Getting the latest version…" : "This page hit a snag."}</h1>
        <p>
          {reloading
            ? "The site updated while you were here, so we're fetching the new version. This takes a second."
            : stale
              ? "The site updated while you were here, so this page was out of step. Reloading should sort it."
              : "Sorry about that — something on this page didn't load right. It's usually a one-off; trying again normally fixes it."}
        </p>
        {reloading ? null : (
          <div className="route-error__actions">
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                /* `reset()` re-renders the same tree, which asks for the same
                 * missing file again. Only a fresh document load can fix a
                 * stale deploy, so send this button there instead. */
                if (stale) window.location.reload();
                else reset();
              }}
            >
              {stale ? "Reload the page" : "Try again"}
            </button>
            <Link className="btn-secondary" href="/">
              Back to home
            </Link>
          </div>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
