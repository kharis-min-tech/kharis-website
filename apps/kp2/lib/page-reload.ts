/** Decides how the route error screen recovers.
 *  A soft retry keeps the failed client navigation, so the first failure
 *  reloads the address. A second failure in the new document shows the message.
 */
export function pageReloadAction(
  stored: string | null,
  documentStamp: string,
): "reload" | "wait" | "show" {
  if (!stored) return "reload";
  if (stored === documentStamp) return "wait";
  return "show";
}

export function pageReloadStorageKey(pathname: string, search: string) {
  return `kp-page-reload:${pathname}${search}`;
}
