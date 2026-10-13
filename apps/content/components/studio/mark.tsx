import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <img
      src="/kharis-dove.jpg"
      alt=""
      className={cn("inline-block h-9 w-9 rounded-lg object-contain", className)}
    />
  );
}
