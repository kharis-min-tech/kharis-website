"use client";

import { ArrowRight, FileQuestion } from "lucide-react";
import Link from "next/link";
import { AuthLayout } from "@/components/studio/auth-layout";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Full-page 404 that matches the sign-in / password screens. */
export function NotFoundScreen() {
  return (
    <AuthLayout
      title="Page not found"
      description="That address is not in Content Studio."
      center
      footer={
        <a href="/documentation" className="font-semibold text-brand hover:underline">
          Open the documentation
        </a>
      }
    >
      <div className="flex flex-col items-center gap-5 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FileQuestion className="h-8 w-8" aria-hidden />
        </span>
        <div className="space-y-2">
          <p className="font-heading text-5xl font-bold tracking-tight text-brand/80">404</p>
          <p className="text-sm text-muted-foreground">
            The page may have moved, or the link is incomplete. Head back to the overview to keep
            editing.
          </p>
        </div>
        <Link href="/" className={cn(buttonClasses("default", "default"), "h-10 w-full")}>
          Back to the studio
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </AuthLayout>
  );
}
