"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RouteLoading } from "@/components/KpIntro";
import { pageReloadAction, pageReloadStorageKey } from "@/lib/page-reload";

function storageKey() {
  return pageReloadStorageKey(window.location.pathname, window.location.search);
}

function documentStamp() {
  return String(performance.timeOrigin);
}

export default function PageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    console.error(error);
    try {
      const key = storageKey();
      const action = pageReloadAction(sessionStorage.getItem(key), documentStamp());
      if (action === "show") {
        sessionStorage.removeItem(key);
        setShowError(true);
        return;
      }
      if (action === "wait") return;
      sessionStorage.setItem(key, documentStamp());
      window.location.reload();
    } catch {
      setShowError(true);
    }
  }, [error]);

  function tryAgain() {
    try {
      sessionStorage.setItem(storageKey(), "manual");
      window.location.reload();
    } catch {
      reset();
    }
  }

  if (!showError) return <RouteLoading />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-on-background">
      <div className="max-w-md text-center">
        <h1 className="font-headline-md text-headline-md uppercase tracking-tight">
          This page didn&apos;t load
        </h1>
        <p className="mt-3 font-body-md text-on-surface-variant">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={tryAgain}
            className="inline-flex items-center justify-center bg-primary px-6 py-3 font-label-md text-sm uppercase tracking-wide text-on-primary brutalist-border brutalist-shadow"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-surface px-6 py-3 font-label-md text-sm uppercase tracking-wide text-on-background brutalist-border"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
