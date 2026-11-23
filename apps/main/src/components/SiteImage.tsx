import React from "react";
import Image, { type ImageProps } from "next/image";

/**
 * Keep large photos clear, while allowing small thumbnails to opt into lighter
 * quality.
 *
 * The default was 95, which is roughly double the bytes of 80 for a difference
 * you cannot see without magnifying a crop - on a site that is almost entirely
 * photographs. It also forced AVIF off, because encoding a large photo at 95
 * could take over a minute and the tile would render empty; at 80 that encode
 * is quick, so both formats are back on in next.config.ts. Call sites that
 * genuinely need more still pass `quality` themselves.
 */
export default function SiteImage({ quality = 80, alt, ...props }: ImageProps) {
  return <Image {...props} alt={alt} quality={quality} />;
}
