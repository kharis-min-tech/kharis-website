"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const BASE = "/kp2";
const MIN_COVER_MS = 460;
const LEAVE_MS = 400;
const SAFETY_MS = 8000;

const LABELS: Record<string, string> = {
  "/": "Home",
  "/mission": "Mission",
  "/governance": "Governance",
  "/departments": "Departments",
  "/life": "Life",
  "/events": "Events",
  "/messages": "Messages",
  "/media": "Media",
  "/giving": "Giving",
  "/contact": "Contact",
  "/quiz": "Quiz",
  "/branches": "Branches",
};

function normalizePath(pathname: string) {
  let path = pathname;
  if (path === BASE || path.startsWith(`${BASE}/`)) path = path.slice(BASE.length) || "/";
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path || "/";
}

function labelFor(pathname: string) {
  const known = LABELS[pathname];
  if (known) return known;
  if (pathname.startsWith("/branches/")) {
    const slug = pathname.split("/")[2] ?? "branch";
    return slug.replace(/^kp2-/, "").replace(/-/g, " ");
  }
  const tail = pathname.split("/").filter(Boolean).pop() ?? "KP2";
  return tail.replace(/-/g, " ");
}

function destinationFrom(anchor: HTMLAnchorElement) {
  if (anchor.target && anchor.target !== "_self") return null;
  if (anchor.hasAttribute("download")) return null;
  const raw = anchor.getAttribute("href");
  if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:"))
    return null;
  let url: URL;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return null;
  }
  if (url.origin !== window.location.origin) return null;
  const nextPath = normalizePath(url.pathname);
  if (nextPath === normalizePath(window.location.pathname)) return null;
  return nextPath;
}

function pageReadyPath() {
  const value = document.documentElement.dataset.kpPageReady;
  if (!value) return "";
  return normalizePath(value);
}

/** Covers the screen between pages and stays there until the next page is ready. */
export function PageTurn() {
  const currentPath = usePathname() || "/";
  const [stamp, setStamp] = useState("Home");
  const seen = useRef(normalizePath(currentPath));
  const pending = useRef<string | null>(null);
  const coveredAt = useRef(0);
  const leaveTimer = useRef(0);
  const safetyTimer = useRef(0);

  const clearTimers = useCallback(() => {
    window.clearTimeout(leaveTimer.current);
    window.clearTimeout(safetyTimer.current);
  }, []);

  const finishLeave = useCallback(() => {
    leaveTimer.current = window.setTimeout(() => {
      if (document.documentElement.dataset.kpTurn === "leave") {
        delete document.documentElement.dataset.kpTurn;
      }
    }, LEAVE_MS);
  }, []);

  const reveal = useCallback(() => {
    const root = document.documentElement;
    if (root.dataset.kpTurn !== "on") return;
    const wait = Math.max(0, MIN_COVER_MS - (performance.now() - coveredAt.current));
    window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => {
      if (document.documentElement.dataset.kpTurn !== "on") return;
      pending.current = null;
      document.documentElement.dataset.kpTurn = "leave";
      finishLeave();
    }, wait);
  }, [finishLeave]);

  const cover = useCallback(
    (nextPath: string) => {
      const skip =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.documentElement.dataset.kpIntro === "playing";
      if (skip) {
        pending.current = null;
        window.clearTimeout(safetyTimer.current);
        delete document.documentElement.dataset.kpTurn;
        return;
      }
      pending.current = nextPath;
      coveredAt.current = performance.now();
      window.clearTimeout(safetyTimer.current);
      safetyTimer.current = window.setTimeout(reveal, SAFETY_MS);
      setStamp(labelFor(nextPath));
      const root = document.documentElement;
      delete root.dataset.kpTurn;
      void root.offsetWidth;
      root.dataset.kpTurn = "on";
    },
    [reveal],
  );

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const nextPath = destinationFrom(anchor);
      if (!nextPath) return;
      cover(nextPath);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [cover]);

  useEffect(() => {
    const path = normalizePath(currentPath);
    if (pending.current && pending.current !== path) return;
    if (!pending.current) {
      if (seen.current === path) return;
      cover(path);
    }
    seen.current = path;
    if (pending.current !== path) return;

    const onReady = () => {
      if (pageReadyPath() !== path) return;
      reveal();
    };
    window.addEventListener("kp:page-ready", onReady);
    onReady();
    return () => window.removeEventListener("kp:page-ready", onReady);
  }, [cover, currentPath, reveal]);

  useEffect(() => clearTimers, [clearTimers]);

  return (
    <div className="kp-turn" aria-hidden="true">
      <span className="kp-turn__band" />
      <span className="kp-turn__band" />
      <span className="kp-turn__band" />
      <p className="kp-turn__stamp">
        <span>Next panel</span>
        <strong>{stamp}</strong>
      </p>
    </div>
  );
}
