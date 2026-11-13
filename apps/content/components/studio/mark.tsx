import { cn } from "@/lib/utils";

const LOGO_URL = "https://images.kharis.org/site-images/main/113a6a24b1d3741b/kharis-logo.png";

/**
 * The white line-art dove from the main site's nav bar. Its strokes break up
 * below about 32px, so keep it at h-8 or larger.
 */
export function Mark({
  className,
  tone = "auto",
}: {
  className?: string;
  /** `auto` = dark dove in light mode, white in dark mode; `onDark` = always white */
  tone?: "auto" | "onDark";
}) {
  return (
    <img
      src={LOGO_URL}
      alt="Kharis"
      className={cn(
        "h-10 w-10 shrink-0 object-contain",
        tone === "auto" && "brightness-0 dark:brightness-100",
        className,
      )}
    />
  );
}
