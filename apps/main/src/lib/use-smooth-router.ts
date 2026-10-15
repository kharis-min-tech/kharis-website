"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

/** Give button-driven navigation the same transition as ordinary links. */
export function useSmoothRouter() {
  const router = useRouter();
  const push = useCallback(
    (href: string) => {
      const request = new CustomEvent("kharis:navigate", { detail: href, cancelable: true });
      if (window.dispatchEvent(request)) router.push(href);
    },
    [router],
  );
  return { push };
}
