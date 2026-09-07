"use client";

import { useEffect, useState, type ImgHTMLAttributes } from "react";
import {
  FALLBACK_BRANCH_IMAGE,
  isMissingImage,
  withBranchImage,
} from "@/lib/branch-images";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
  fallback?: string;
  seed?: string;
};

export function BranchFallbackImage({
  src,
  fallback,
  seed = "",
  alt = "",
  onError,
  ...rest
}: Props) {
  const placeholder = fallback ?? withBranchImage(null, seed);
  const resolved = isMissingImage(src) ? placeholder : src!.trim();
  const [current, setCurrent] = useState(resolved);

  useEffect(() => {
    setCurrent(resolved);
  }, [resolved]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...rest}
      src={current}
      alt={alt}
      onError={(event) => {
        if (current !== placeholder) {
          setCurrent(placeholder);
        } else if (current !== FALLBACK_BRANCH_IMAGE) {
          setCurrent(FALLBACK_BRANCH_IMAGE);
        }
        onError?.(event);
      }}
    />
  );
}
