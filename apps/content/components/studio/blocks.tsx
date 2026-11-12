import { Search, TriangleAlert, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type Tone = "brand" | "success" | "gold" | "danger";

const TONE_CARD: Record<Tone, string> = {
  brand: "border-brand-line from-card to-brand-soft",
  success: "border-success-line from-card to-success-soft",
  gold: "border-gold-line from-card to-gold-soft",
  danger: "border-danger-line from-card to-danger-soft",
};

const TONE_TEXT: Record<Tone, string> = {
  brand: "text-brand",
  success: "text-success",
  gold: "text-gold",
  danger: "text-danger",
};

/** Square tile behind an icon, used in headers, tiles and list rows. */
export function IconTile({
  icon: Icon,
  tone = "brand",
  className,
}: {
  icon: LucideIcon;
  tone?: Tone;
  className?: string;
}) {
  const fill: Record<Tone, string> = {
    brand: "bg-brand-soft",
    success: "bg-success-soft",
    gold: "bg-gold-soft",
    danger: "bg-danger-soft",
  };
  return (
    <span
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
        fill[tone],
        TONE_TEXT[tone],
        className,
      )}
    >
      <Icon className="h-[18px] w-[18px]" />
    </span>
  );
}

/** A Pulse number: small caps label, large tinted value, icon in the corner. */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
  href,
}: {
  label: string;
  value: number | string | null | undefined;
  hint?: string;
  icon: LucideIcon;
  tone: Tone;
  href?: string;
}) {
  const body = (
    <div
      className={cn(
        "relative h-full overflow-hidden rounded-xl border bg-gradient-to-b p-5 shadow-card transition",
        TONE_CARD[tone],
        href && "hover:-translate-y-0.5 hover:shadow-pop",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="studio-eyebrow">{label}</p>
        <Icon className={cn("h-[18px] w-[18px] opacity-80", TONE_TEXT[tone])} />
      </div>
      {value === undefined ? (
        <Skeleton className="mt-3 h-9 w-14" />
      ) : (
        <p
          className={cn("mt-2 font-heading text-[2.15rem] font-bold leading-none", TONE_TEXT[tone])}
        >
          {value ?? "—"}
        </p>
      )}
      {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
  if (!href) return body;
  return (
    <Link
      href={href}
      className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {body}
    </Link>
  );
}

/** A dashboard block: small caps title, optional "View all" style action. */
export function SectionCard({
  title,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <h2 className="studio-eyebrow">{title}</h2>
        {action}
      </header>
      <div className={cn("flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}

export function SectionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-xs font-semibold text-brand hover:underline">
      {children}
    </Link>
  );
}

/** Weekday and day number in a tinted square, like an agenda entry. */
export function DateTile({ date, className }: { date: Date; className?: string }) {
  return (
    <span
      className={cn(
        "flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-brand-soft text-brand ring-1 ring-inset ring-brand-line",
        className,
      )}
      aria-hidden
    >
      <span className="text-[9px] font-bold uppercase tracking-wider">
        {date.toLocaleDateString("en-GB", { weekday: "short" })}
      </span>
      <span className="font-heading text-lg font-bold leading-none">{date.getDate()}</span>
    </span>
  );
}

/** Initials in a soft circle. */
export function Avatar({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-bold uppercase text-brand ring-1 ring-inset ring-brand-line",
        className,
      )}
      aria-hidden
    >
      {label}
    </span>
  );
}

export function SearchInput({
  className,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input type="search" className="pl-9" {...props} />
    </div>
  );
}

/** Filters and search above a list. */
export function Toolbar({ children }: { children: React.ReactNode }) {
  return <div className="mb-5 flex flex-wrap items-center gap-2">{children}</div>;
}
export function EmptyState({
  icon: Icon,
  title,
  children,
  action,
}: {
  icon?: LucideIcon;
  title?: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
      {Icon ? <IconTile icon={Icon} className="mb-4" /> : null}
      {title ? <p className="font-heading text-base font-semibold">{title}</p> : null}
      {children ? (
        <p className={cn("max-w-md text-sm text-muted-foreground", title && "mt-1")}>{children}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorNotice({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-danger-line bg-danger-soft px-5 py-4">
      <TriangleAlert className="h-4 w-4 shrink-0 text-danger" />
      <p className="min-w-0 flex-1 text-sm text-danger">{message}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function ListSkeleton({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-[4.5rem]" />
      ))}
    </div>
  );
}

export function GridSkeleton({ items = 6 }: { items?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: items }, (_, index) => (
        <Skeleton key={index} className="h-36 rounded-xl" />
      ))}
    </div>
  );
}
