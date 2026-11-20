"use client";

import { useEffect } from "react";

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
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
          padding: "2rem",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: "#0d0a12",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "28rem" }}>
          <h1 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>This page couldn&apos;t load.</h1>
          <p style={{ opacity: 0.8, marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Something went wrong loading Kharis Church. Please try again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
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
        </div>
      </body>
    </html>
  );
}
