"use client";

import Link from "next/link";
import { useRef } from "react";
import { StudioAtmosphere } from "@/components/studio/studio-atmosphere";
import { ThemeToggle } from "@/components/studio/theme-toggle";
import { cn } from "@/lib/utils";

/**
 * Split screen for sign-in, password and access screens: a dark verse panel on
 * the left (large screens only) and the form card on the right.
 */
export function AuthLayout({
  title,
  description,
  children,
  footer,
  center = false,
}: {
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  center?: boolean;
}) {
  const bannerRef = useRef<HTMLElement>(null);

  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside
        ref={bannerRef}
        className="relative hidden overflow-hidden bg-[#071018] text-white lg:flex lg:flex-col lg:justify-center lg:p-10 xl:p-12"
      >
        <StudioAtmosphere tone="authDark" className="z-0" containerRef={bannerRef} />
        <div
          aria-hidden
          className="auth-orbit pointer-events-none absolute -left-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full border border-white/10"
        />
        <div
          aria-hidden
          className="auth-orbit auth-orbit-delayed pointer-events-none absolute -left-10 top-1/2 h-[20rem] w-[20rem] -translate-y-1/2 rounded-full border border-[#5ec8ff]/18"
        />
        <figure className="relative z-10 max-w-md">
          <p className="studio-eyebrow mb-4 text-white/45">Content Studio</p>
          <blockquote className="font-heading text-[2rem] font-medium leading-snug tracking-tight text-white/90 xl:text-[2.35rem]">
            The house that is to be built for the Lord must be{" "}
            <span className="font-bold text-[#7dd3fc]">exceedingly</span>{" "}
            <span className="font-bold text-[#f6b54e]">magnificent</span>.
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3 text-[11px] font-semibold tracking-[0.2em] text-white/50">
            <span className="h-px w-8 bg-white/30" />1 CHRONICLES 22:5
          </figcaption>
        </figure>
      </aside>

      <main className="relative flex flex-col items-center justify-center overflow-hidden bg-background px-4 py-16 sm:px-8">
        <StudioAtmosphere tone="auth" reactive={false} className="z-0" />
        <ThemeToggle variant="pill" className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6" />
        <div className="auth-form-enter relative z-10 w-full max-w-[25rem]">
          <div className="mb-6 flex flex-col items-center text-center">
            <h1 className="font-heading text-2xl font-bold tracking-tight">{title}</h1>
            {description ? (
              <div className="mt-1.5 text-sm text-muted-foreground">{description}</div>
            ) : null}
          </div>
          {children ? (
            <div
              className={cn(
                "auth-form-card rounded-2xl border border-border bg-card/95 p-6 shadow-pop backdrop-blur-sm sm:p-7",
                center && "text-center",
              )}
            >
              {children}
            </div>
          ) : null}
          {footer ? (
            <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
          ) : null}
        </div>
        <p className="absolute bottom-5 z-10 flex gap-4 text-xs text-muted-foreground">
          <a href="/documentation" className="hover:text-foreground hover:underline">
            Help
          </a>
          <Link href="/cookies" className="hover:text-foreground hover:underline">
            Cookie policy
          </Link>
        </p>
      </main>
    </div>
  );
}
