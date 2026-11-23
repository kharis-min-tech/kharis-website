"use client";

import { useEffect, useState } from "react";
import { isStaleDeployError, reloadOnceForStaleDeploy } from "@/lib/stale-deploy";

/**
 * Catches errors thrown by the root layout itself (fonts, providers, nav
 * chrome) — rarer than a route-level crash, but when it happens `error.tsx`
 * can't help because the layout that would render it is what broke. This
 * replaces the entire document, so it can't depend on the app's own CSS.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const stale = isStaleDeployError(error);
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    console.error(error);
    /* Same as the route-level boundary: a chunk the current deploy no longer
     * has cannot be retried in place, only reloaded. See lib/stale-deploy. */
    if (stale && reloadOnceForStaleDeploy()) setReloading(true);
  }, [error, stale]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
          padding: "2rem",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: "#0d0a12",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "28rem" }}>
          <h1 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>
            {reloading ? "Getting the latest version…" : "This page couldn't load."}
          </h1>
          <p style={{ opacity: 0.8, marginBottom: "1.5rem", lineHeight: 1.6 }}>
            {reloading || stale
              ? "The site updated while you were here. Reloading picks up the new version."
              : "Something went wrong loading Kharis Church. Please try again."}
          </p>
          {reloading ? null : (
            <button
              type="button"
              /* A stale deploy needs a new document, not a re-render. */
              onClick={() => (stale ? window.location.reload() : reset())}
              style={{
                padding: "0.65rem 1.5rem",
                background: "#fff",
                color: "#0d0a12",
                border: 0,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Reload
            </button>
          )}
        </div>
      </body>
    </html>
  );
}
