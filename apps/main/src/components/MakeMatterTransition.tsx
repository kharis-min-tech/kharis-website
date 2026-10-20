"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type NavigateToDepartment = (href: string, image: string) => void;
const TransitionContext = createContext<NavigateToDepartment | null>(null);

export function MakeMatterTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [destination, setDestination] = useState<{ href: string; image: string } | null>(null);
  const [phase, setPhase] = useState<"idle" | "opening" | "arrived">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useCallback<NavigateToDepartment>(
    (href, image) => {
      if (phase !== "idle") return;
      setDestination({ href, image });
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setPhase("opening");
      if (reducedMotion) {
        router.push(href);
        return;
      }
      timer.current = setTimeout(() => router.push(href), 1650);
    },
    [phase, router],
  );

  useEffect(() => {
    if (phase !== "opening" || !destination) return;
    const targetPath = new URL(destination.href, window.location.href).pathname;
    if (pathname !== targetPath) return;
    if (timer.current) clearTimeout(timer.current);
    setPhase("arrived");
    routeTimer.current = setTimeout(() => {
      setPhase("idle");
      setDestination(null);
    }, 520);
  }, [destination, pathname, phase]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (routeTimer.current) clearTimeout(routeTimer.current);
    },
    [],
  );

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div
        className={`make-matter-transition${phase !== "idle" ? " is-opening" : ""}${phase === "arrived" ? " is-arrived" : ""}`}
        aria-hidden="true"
      >
        {destination && (
          <>
            <div className="make-matter-transition__panel make-matter-transition__panel--left" />
            <div className="make-matter-transition__panel make-matter-transition__panel--right" />
            <div className="make-matter-transition__image">
              <Image src={destination.image} alt="" fill priority sizes="100vw" />
            </div>
          </>
        )}
      </div>
    </TransitionContext.Provider>
  );
}

function useMakeMatterNavigation() {
  const navigate = useContext(TransitionContext);
  if (!navigate) throw new Error("MakeMatterTransitionProvider is required.");
  return navigate;
}

export function MakeMatterButton({
  href,
  image,
  className,
  ariaLabel,
  children,
}: {
  href: string;
  image: string;
  className?: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  const navigate = useMakeMatterNavigation();
  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      onClick={() => navigate(href, image)}
    >
      {children}
    </button>
  );
}

export function MakeItMatterBanner({
  leftText = "Make it",
  rightText = "Matter.",
  image,
  href,
  department = "department",
}: {
  leftText?: string;
  rightText?: string;
  image: string;
  href: string;
  department?: string;
}) {
  const navigate = useMakeMatterNavigation();
  const bannerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsOpen(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsOpen(true);
        observer.disconnect();
      },
      { threshold: 0.25 },
    );
    observer.observe(banner);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      ref={bannerRef}
      className={`make-matter-banner${isOpen ? " is-open" : ""}`}
      type="button"
      aria-label={`Join ${department}`}
      onClick={() => navigate(href, image)}
    >
      <span className="make-matter-banner__photo" aria-hidden="true">
        <Image src={image} alt="" fill priority sizes="(max-width: 700px) 38vw, 40vw" />
      </span>
      <span
        className="make-matter-banner__door make-matter-banner__door--left"
        aria-hidden="true"
      />
      <span
        className="make-matter-banner__door make-matter-banner__door--right"
        aria-hidden="true"
      />
      <span className="make-matter-banner__text">
        <span>{leftText}</span>
        <span>{rightText}</span>
      </span>
    </button>
  );
}
