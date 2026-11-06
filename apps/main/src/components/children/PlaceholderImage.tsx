import type { CSSProperties } from "react";
import type { PhotoSlot } from "@/data/children-groups";

/**
 * Tinted stand-in for a photo we still need, labelled with the slot and the intended shot.
 * `fill` sizes it to its container instead of the slot's aspect ratio; `compact` shows only the
 * slot name, for spaces too small for the full brief (the alt text still describes the shot).
 */
export function PlaceholderImage({
  slot,
  className = "",
  fill = false,
  compact = false,
}: {
  slot: PhotoSlot;
  className?: string;
  fill?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`kids-placeholder${fill ? " kids-placeholder--fill" : ""} ${className}`}
      role="img"
      aria-label={slot.alt}
      data-photo-slot={slot.id}
      style={
        fill
          ? undefined
          : ({
              "--ph-aspect": slot.aspect,
              "--ph-aspect-mobile": slot.mobileAspect ?? slot.aspect,
            } as CSSProperties)
      }
    >
      <span className="kids-placeholder__label" aria-hidden>
        <strong>Photo needed: {slot.id}</strong>
        {compact ? null : (
          <>
            <span>{slot.alt}</span>
            <em>{slot.art}</em>
          </>
        )}
      </span>
    </div>
  );
}
