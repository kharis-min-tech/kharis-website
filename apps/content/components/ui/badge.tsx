import { cn } from "@/lib/utils";

const tones = {
  default: "bg-brand-soft text-brand ring-brand-line",
  muted: "bg-muted text-muted-foreground ring-border",
  accent: "bg-accent text-foreground ring-border",
  success: "bg-success-soft text-success ring-success-line",
  gold: "bg-gold-soft text-gold ring-gold-line",
  danger: "bg-danger-soft text-danger ring-danger-line",
};

export type BadgeTone = keyof typeof tones;

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
