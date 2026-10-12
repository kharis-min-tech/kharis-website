import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-brand-end font-heading text-lg font-bold text-primary-foreground",
        className,
      )}
    >
      K
    </span>
  );
}
