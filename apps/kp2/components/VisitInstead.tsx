import Link from "next/link";
import type { ReactNode } from "react";
import "./visit-instead.css";

/** Shown when a list is actually empty, not when a filter missed. */
export function VisitInstead({
  title,
  children,
  icon = "location_on",
  action,
}: {
  title: string;
  children: ReactNode;
  icon?: string;
  action?: ReactNode;
}) {
  return (
    <div className="kp-empty-panel">
      <div className="kp-empty-panel__mark" aria-hidden="true">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <h3 className="kp-empty-panel__title">{title}</h3>
      <p className="kp-empty-panel__copy">{children}</p>
      {action ?? (
        <Link href="/branches" className="kp-depth-button kp-button-purple kp-empty-panel__cta">
          Find a branch
        </Link>
      )}
    </div>
  );
}
