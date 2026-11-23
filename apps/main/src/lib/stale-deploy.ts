/**
 * Recovering from a deploy that happened while someone was on the site.
 *
 * Every build gives its JavaScript and CSS a fresh content hash, and
 * Cloudflare Workers Static Assets serves only the files belonging to the
 * current deploy — the previous build's are deleted. So a tab still holding
 * HTML from the old deploy asks for a chunk that no longer exists, gets a
 * 404, and webpack raises a ChunkLoadError.
 *
 * The important part: there is nothing to retry. That URL is gone for good,
 * so the error boundary's `reset()` only re-renders and asks for the very
 * same dead file again — which is why "Try again" could be pressed all day
 * without ever working. The one thing that does fix it is a fresh document
 * load, because the new HTML names the chunks that actually exist.
 */

/** Whether this error is a hashed asset that the current deploy no longer has. */
export function isStaleDeployError(error: unknown): boolean {
  const e = error as { name?: string; message?: string } | null;
  if (!e) return false;
  if (e.name === "ChunkLoadError") return true;
  const message = e.message ?? "";
  return (
    /Loading chunk \S+ failed/i.test(message) ||
    /Loading CSS chunk/i.test(message) ||
    /Failed to fetch dynamically imported module/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message)
  );
}

const KEY = "kharis:stale-deploy-reload";
/** How long after a reload we refuse to reload again. */
const QUIET_MS = 30_000;

/**
 * Reload the document, but only once in a short window.
 *
 * The guard is a timestamp rather than a flag so that it clears itself. If
 * the reload fixed things, a genuine chunk error an hour later is still
 * allowed to reload; if it did not fix them, we stop after one go and leave
 * the error page up rather than putting the browser in a refresh loop.
 *
 * Returns whether a reload was started, so the caller can keep showing the
 * error page when it was not.
 */
export function reloadOnceForStaleDeploy(): boolean {
  if (typeof window === "undefined") return false;

  let last = 0;
  try {
    last = Number(window.sessionStorage.getItem(KEY)) || 0;
  } catch {
    /* Private mode, or storage blocked. Treat it as "not tried yet": one
       reload is the right move even when we cannot remember making it. */
  }
  if (Date.now() - last < QUIET_MS) return false;

  try {
    window.sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* Ignore - worst case we reload twice rather than once. */
  }
  window.location.reload();
  return true;
}
