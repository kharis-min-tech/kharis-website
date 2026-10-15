import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground shadow-[0_18px_50px_rgba(40,10,80,0.1)]",
        className,
      )}
      {...props}
    />
  );
}
