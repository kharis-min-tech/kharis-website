"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function Error({
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
    <main className="site-page route-error text-fg">
      <SiteHeader />
      <div className="route-error__panel">
        <p className="eyebrow">Something went wrong</p>
        <h1>This page hit a snag.</h1>
        <p>
          Sorry about that — something on this page didn&apos;t load right. It&apos;s usually a
          one-off; trying again normally fixes it.
        </p>
        <div className="route-error__actions">
          <button type="button" className="btn-primary" onClick={() => reset()}>
            Try again
          </button>
          <Link className="btn-secondary" href="/">
            Back to home
          </Link>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
