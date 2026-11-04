/**
 * Field names and the public Turnstile sitekey, shared by the browser forms and
 * the route handlers that validate them. Kept free of imports so both a client
 * component and a Worker route can pull it in.
 */

/**
 * A hidden input real visitors never fill. Commodity spam bots fill every field
 * they find, so a non-empty value is a reliable bot signal. Named `company`
 * rather than `honeypot` so it reads as a plausible field to a scraper.
 */
export const HONEYPOT_FIELD = "company";

/** Turnstile posts its token under this name; we carry it in the JSON body. */
export const TURNSTILE_FIELD = "cf-turnstile-response";

/**
 * The Turnstile sitekey is public — it ships in the page like a Google
 * Analytics ID. It is read from the environment at BUILD time (NEXT_PUBLIC_*
 * is inlined by Next, not read from Worker vars), so the deploy workflow must
 * provide it. Empty means Turnstile is off: no widget renders and the routes
 * skip verification, which is how local development works.
 */
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

/** One stable action per protected surface, checked again server-side. */
export type FormAction = "contact" | "visit" | "quiz";
