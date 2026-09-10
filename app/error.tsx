"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
            onClick={reset}
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
