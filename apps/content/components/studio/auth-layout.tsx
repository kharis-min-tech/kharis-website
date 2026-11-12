"use client";

import Link from "next/link";
import { Mark } from "@/components/studio/mark";
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
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="relative hidden overflow-hidden bg-[#0b0814] text-white lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_60%,rgba(109,61,240,0.42),transparent_70%),radial-gradient(40%_35%_at_85%_10%,rgba(246,181,78,0.12),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(70%_60%_at_30%_55%,black,transparent)]"
        />
        <div className="relative flex items-center gap-3">
          <Mark className="h-10 w-10" />
          <span className="text-sm font-bold tracking-[0.16em]">KHARIS CHURCH</span>
        </div>
        <figure className="relative max-w-md">
          <blockquote className="font-heading text-[2rem] font-medium leading-snug tracking-tight text-white/90 xl:text-[2.35rem]">
            Let all things be done <span className="font-bold text-[#a48bfa]">decently</span> and in{" "}
            <span className="font-bold text-[#f6b54e]">order</span>.
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3 text-[11px] font-semibold tracking-[0.2em] text-white/50">
            <span className="h-px w-8 bg-white/30" />1 CORINTHIANS 14:40
          </figcaption>
        </figure>
        <p className="relative text-xs text-white/40">Content Studio · content.kharis.org</p>
      </aside>

      <main className="relative flex flex-col items-center justify-center px-4 py-16 sm:px-8">
        <ThemeToggle variant="pill" className="absolute right-4 top-4 sm:right-6 sm:top-6" />
        <div className="w-full max-w-[25rem]">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Mark className="h-6 w-6 rounded-md" />
              Kharis Church
            </div>
            <h1 className="mt-4 font-heading text-2xl font-bold tracking-tight">{title}</h1>
            {description ? (
              <div className="mt-1.5 text-sm text-muted-foreground">{description}</div>
            ) : null}
          </div>
          {children ? (
            <div
              className={cn(
                "rounded-2xl border border-border bg-card p-6 shadow-pop sm:p-7",
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
        <p className="absolute bottom-5 text-xs text-muted-foreground">
          <Link href="/cookies" className="hover:text-foreground hover:underline">
            Cookie policy
          </Link>
        </p>
      </main>
    </div>
  );
}
