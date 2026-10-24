"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const BASE = "/kp2";
const TURN_MS = 920;

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

/** Slams comic panels across the viewport whenever navigation opens another page. */
export function PageTurn() {
  const currentPath = usePathname();
  const [stamp, setStamp] = useState("Home");
  const seen = useRef(currentPath);
  const playedFor = useRef<string | null>(null);
  const timer = useRef(0);

  const play = useCallback((nextPath: string) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.dataset.kpIntro === "playing") return;
    const label = labelFor(nextPath);
    // React owns this text. Writing textContent here detaches that node and
    // the next page commit throws, which is the "didn't load" screen.
    setStamp(label);
    const root = document.documentElement;
    delete root.dataset.kpTurn;
    void root.offsetWidth;
    root.dataset.kpTurn = "on";
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      delete document.documentElement.dataset.kpTurn;
    }, TURN_MS);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const nextPath = destinationFrom(anchor);
      if (!nextPath) return;
      playedFor.current = nextPath;
      if (nextPath === "/") return;
      play(nextPath);
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(timer.current);
      delete document.documentElement.dataset.kpTurn;
    };
  }, [play]);

  useEffect(() => {
    if (seen.current === currentPath) return;
    const alreadyPlaying = playedFor.current === currentPath;
    seen.current = currentPath;
    playedFor.current = null;
    if (alreadyPlaying) return;
    play(currentPath);
  }, [currentPath, play]);

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
