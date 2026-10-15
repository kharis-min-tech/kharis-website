import { cn } from "@/lib/utils";

const tones = {
  default: "bg-primary/15 text-primary",
  muted: "bg-muted text-muted-foreground",
  accent: "bg-accent text-foreground",
};

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-extrabold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
