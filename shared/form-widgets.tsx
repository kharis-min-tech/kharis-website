"use client";

/**
 * The browser half of the form defences: a hidden honeypot input and the
 * Turnstile widget. Both are no-ops when Turnstile is not configured, so the
 * forms behave exactly as before on a developer's machine.
 */

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { HONEYPOT_FIELD, TURNSTILE_SITE_KEY, type FormAction } from "./form-fields";

type TurnstileOptions = {
  sitekey: string;
  action?: string;
  size?: "normal" | "flexible" | "compact";
  appearance?: "always" | "execute" | "interaction-only";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

type TurnstileApi = {
  render: (el: HTMLElement, options: TurnstileOptions) => string | undefined;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise: Promise<void> | null = null;

/** Load the Turnstile script once per page, however many widgets ask for it. */
function loadTurnstile(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    const script = existing ?? document.createElement("script");
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Turnstile failed to load")), {
      once: true,
    });
    if (!existing) {
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }).catch((error) => {
    // Let a later mount retry rather than caching the failure forever.
    scriptPromise = null;
    throw error;
  });

  return scriptPromise;
}

/**
 * Off-screen rather than `display: none`: some bots skip hidden inputs, and a
 * field that is merely positioned away still gets filled. Kept out of the tab
 * order and the accessibility tree so nobody using a keyboard or a screen
 * reader ever meets it.
 */
const honeypotStyle: CSSProperties = {
  position: "absolute",
  left: "-9999px",
  width: "1px",
  height: "1px",
  opacity: 0,
  pointerEvents: "none",
};

export function HoneypotField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="text"
      name={HONEYPOT_FIELD}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      style={honeypotStyle}
    />
  );
}

export type TurnstileHandle = {
  /** The current token, or "" when there isn't one yet. */
  token: string;
  /** True when a sitekey is configured, i.e. a token is actually expected. */
  enabled: boolean;
  /** Tokens are single-use — reset after every submit attempt. */
  reset: () => void;
  /** Render this where the challenge should appear. */
  widget: React.ReactNode;
};

/**
 * Renders a managed Turnstile widget and hands back its token. Usually the
 * visitor sees nothing: managed mode only shows a challenge when the request
 * looks suspicious.
 */
export function useTurnstile(
  action: FormAction,
  /**
   * "always" shows the widget box; "interaction-only" keeps it invisible
   * unless a challenge is actually needed, which suits a surface with no
   * submit button of its own.
   */
  appearance: "always" | "interaction-only" = "always",
): TurnstileHandle {
  const [token, setToken] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    loadTurnstile()
      .then(() => {
        if (cancelled || !window.turnstile) return;
        widgetIdRef.current =
          window.turnstile.render(container, {
            sitekey: TURNSTILE_SITE_KEY,
            action,
            appearance,
            size: "flexible",
            callback: (value) => setToken(value),
            "expired-callback": () => setToken(""),
            "error-callback": () => setToken(""),
          }) ?? null;
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      cancelled = true;
      const id = widgetIdRef.current;
      widgetIdRef.current = null;
      if (id && window.turnstile) {
        try {
          window.turnstile.remove(id);
        } catch {
          // The widget is already gone; nothing to clean up.
        }
      }
    };
  }, [action, appearance]);

  const reset = useCallback(() => {
    setToken("");
    const id = widgetIdRef.current;
    if (id && window.turnstile) {
      try {
        window.turnstile.reset(id);
      } catch {
        // Nothing to reset.
      }
    }
  }, []);

  return {
    token,
    enabled: Boolean(TURNSTILE_SITE_KEY),
    reset,
    widget: TURNSTILE_SITE_KEY ? <div ref={containerRef} className="turnstile-field" /> : null,
  };
}
