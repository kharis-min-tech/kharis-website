import React from "react";
import Image, { type ImageProps } from "next/image";

/** Keep large photos clear, while allowing small thumbnails to opt into lighter quality. */
export default function SiteImage({ quality = 95, alt, ...props }: ImageProps) {
  return <Image {...props} alt={alt} quality={quality} />;
}
