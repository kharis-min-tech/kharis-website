import { cn } from "@/lib/utils";

const FILTER_ID = "kharis-mark-alpha";

/**
 * The logo file is a white dove on an opaque light grey square. This filter keeps
 * only the near-white strokes (alpha from brightness) so the dove sits cleanly on
 * the violet tile in both themes. Rendered once in the root layout.
 */
export function MarkFilter() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <filter id={FILTER_ID} colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  8.504 28.608 2.888 0 -39"
        />
      </filter>
    </svg>
  );
}

export function Mark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(140deg,#8b5cf6_0%,#5b2fd6_55%,#3b1a8f_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_16px_-6px_rgba(91,47,214,0.7)]",
        className,
      )}
    >
      <img
        src="/kharis-logo.png"
        alt="Kharis"
        className="h-[74%] w-[74%] object-contain"
        style={{ filter: `url(#${FILTER_ID})` }}
      />
    </span>
  );
}
