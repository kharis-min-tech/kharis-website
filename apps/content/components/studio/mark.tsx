import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <img
      src="/kharis-logo.png"
      alt="Kharis"
      className={cn("h-9 w-9 object-contain", className)}
    />
  );
}
