"use client";

import { useSyncExternalStore } from "react";
import type { ServiceBranch } from "@/lib/service-branches";
import "./event-categories.css";

const DEFAULT_BRANCH = "london";
const BRANCH_KEY = "kharis-service-branch";

const branchListeners = new Set<() => void>();

function subscribeBranch(listener: () => void) {
  branchListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    branchListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readBranch() {
  try {
    return localStorage.getItem(BRANCH_KEY);
  } catch {
    return null;
  }
}

export function saveBranch(slug: string) {
  try {
    localStorage.setItem(BRANCH_KEY, slug);
  } catch {
    /* private mode: the choice just won't persist */
  }
  branchListeners.forEach((listener) => listener());
}

/** The visitor's chosen branch, shared by every branch picker on the page. */
export function useStoredBranch(branches: ServiceBranch[]) {
  const stored = useSyncExternalStore(subscribeBranch, readBranch, () => null);
  return (
    branches.find((b) => b.slug === stored) ??
    branches.find((b) => b.slug === DEFAULT_BRANCH) ??
    branches[0] ??
    null
  );
}

export function BranchSelect({
  label,
  branch,
  branches,
  className = "",
  id,
}: {
  label: string;
  branch: ServiceBranch;
  branches: ServiceBranch[];
  className?: string;
  id?: string;
}) {
  const kharis = branches.filter((b) => b.group === "kharis");
  const kp2 = branches.filter((b) => b.group === "kp2");

  return (
    <label className={`events-branch__pick ${className}`.trim()}>
      <span>{label}</span>
      <select id={id} value={branch.slug} onChange={(e) => saveBranch(e.target.value)}>
        <optgroup label="Kharis Church">
          {kharis.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.name}
            </option>
          ))}
        </optgroup>
        {kp2.length ? (
          <optgroup label="KP2">
            {kp2.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </optgroup>
        ) : null}
      </select>
    </label>
  );
}
