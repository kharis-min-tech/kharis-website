"use client";

import { ChevronLeft, ChevronRight, Church } from "lucide-react";
import { useMemo, useState } from "react";
import { ActiveFilterTabs } from "@/components/studio/active-filter";
import {
  EmptyState,
  ErrorNotice,
  GridSkeleton,
  SearchInput,
  Toolbar,
} from "@/components/studio/blocks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  activeCounts,
  isActive,
  matchesActiveFilter,
  type ActiveFilter,
} from "@/lib/active-filter";
import { branchFamily, defaultFamily, FAMILY_LABEL, type BranchFamily } from "@/lib/branch-family";
import type { BranchRow } from "@/lib/branch-types";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/lib/workspace-context";

const PAGE_SIZE = 9;

type FamilyFilter = BranchFamily | "all";

const FAMILY_FILTERS: FamilyFilter[] = ["all", "kharis", "kp2"];

/** "2 venues" or "2 venues (1 inactive)". */
function countLabel(items: { is_active?: boolean | null }[], noun: string) {
  const { active, inactive } = activeCounts(items, isActive);
  const label = `${active} ${noun}${active === 1 ? "" : "s"}`;
  return inactive ? `${label} (${inactive} inactive)` : label;
}

export function BranchList({
  rows,
  error,
  isSuperAdmin,
  onRetry,
  onOpen,
}: {
  rows: BranchRow[] | null;
  error: string;
  isSuperAdmin: boolean;
  onRetry: () => void;
  onOpen: (row: BranchRow) => void;
}) {
  const workspace = useWorkspaceId();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ActiveFilter>("active");
  const [chosenFamily, setChosenFamily] = useState<FamilyFilter | null>(null);
  const [page, setPage] = useState(1);

  const editable = useMemo(() => rows ?? [], [rows]);
  const familyCounts = useMemo(() => {
    const counts: Record<FamilyFilter, number> = { all: editable.length, kharis: 0, kp2: 0 };
    for (const row of editable) counts[branchFamily(row)] += 1;
    return counts;
  }, [editable]);

  // Open on the side of the studio you are in, unless none of your branches are on it.
  const workspaceFamily: FamilyFilter =
    workspace === "kp2" || workspace === "kharis" ? defaultFamily(workspace) : "all";
  const family = chosenFamily ?? (familyCounts[workspaceFamily] ? workspaceFamily : "all");

  const inFamily = useMemo(
    () => editable.filter((row) => family === "all" || branchFamily(row) === family),
    [editable, family],
  );
  const counts = useMemo(() => activeCounts(inFamily, isActive), [inFamily]);
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return inFamily.filter(
      (row) =>
        matchesActiveFilter(view, isActive(row)) &&
        (!needle ||
          `${row.name} ${row.slug} ${row.subtitle ?? ""} ${row.pastor_name ?? ""}`
            .toLowerCase()
            .includes(needle)),
    );
  }, [query, view, inFamily]);

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const shown = visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      <Toolbar>
        <div
          role="tablist"
          aria-label="Kharis Church or KP2"
          className="inline-flex rounded-lg border border-border bg-card p-0.5"
        >
          {FAMILY_FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={family === item}
              onClick={() => {
                setChosenFamily(item);
                setPage(1);
              }}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground",
                family === item && "bg-brand-soft text-brand hover:text-brand",
              )}
            >
              {item === "all" ? "All" : FAMILY_LABEL[item]}
              <span className="ml-1.5 tabular-nums opacity-70">{familyCounts[item]}</span>
            </button>
          ))}
        </div>
        <ActiveFilterTabs
          value={view}
          counts={counts}
          onChange={(next) => {
            setView(next);
            setPage(1);
          }}
        />
        <SearchInput
          value={query}
          placeholder="Search branches"
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
        />
        {rows && !error ? (
          <span className="text-xs text-muted-foreground">
            {visible.length} branch{visible.length === 1 ? "" : "es"}
          </span>
        ) : null}
      </Toolbar>
      {rows === null ? (
        <GridSkeleton />
      ) : error ? (
        <ErrorNotice message={error} onRetry={onRetry} />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={Church}
          title={
            !editable.length
              ? "No branches yet"
              : query.trim()
                ? "No matches"
                : view === "inactive"
                  ? "No inactive branches"
                  : "No active branches"
          }
        >
          {editable.length
            ? query.trim()
              ? "No branches match that search."
              : view === "inactive"
                ? "Deactivated branches show here so you can reinstate them."
                : "Nothing active here. Try the Inactive tab, or switch between Kharis Church and KP2."
            : isSuperAdmin
              ? "Add the first campus with New branch."
              : "No branches are assigned to you yet. Ask a super admin to add one."}
        </EmptyState>
      ) : (
        <>
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((row) => {
              const kp2 = branchFamily(row) === "kp2";
              return (
                <li key={row.id}>
                  <button
                    type="button"
                    className={cn(
                      "group flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-left shadow-card transition hover:-translate-y-0.5 hover:border-brand-line hover:shadow-pop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      !isActive(row) &&
                        "opacity-70 grayscale-[35%] hover:opacity-100 hover:grayscale-0",
                    )}
                    onClick={() => onOpen(row)}
                  >
                    <span className="relative block h-28 w-full overflow-hidden border-b border-border bg-gradient-to-br from-brand-soft via-card to-gold-soft">
                      {row.hero_image_url ? (
                        <img
                          src={row.hero_image_url}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <Church className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-brand/40" />
                      )}
                      {kp2 ? (
                        <Badge className="absolute left-3 top-3 shadow-card">KP2</Badge>
                      ) : null}
                    </span>
                    <span className="flex flex-1 flex-col p-5">
                      <span className="flex items-start justify-between gap-3">
                        <span className="min-w-0">
                          <span className="block truncate font-semibold">{row.name}</span>
                          <span className="block truncate text-sm text-muted-foreground">
                            {row.subtitle || row.slug}
                          </span>
                        </span>
                        <Badge tone={isActive(row) ? "success" : "muted"}>
                          {isActive(row) ? "Active" : "Inactive"}
                        </Badge>
                      </span>
                      <span className="mt-3 space-y-0.5 text-xs text-muted-foreground">
                        {row.pastor_name ? (
                          <span className="block truncate">{row.pastor_name}</span>
                        ) : null}
                        {row.contact_email ? (
                          <span className="block truncate">{row.contact_email}</span>
                        ) : null}
                        {row.contact_phone ? (
                          <span className="block truncate">{row.contact_phone}</span>
                        ) : null}
                      </span>
                      <span className="mt-auto flex items-center gap-3 pt-4 text-xs text-muted-foreground">
                        <span>{countLabel(row.venues ?? [], "venue")}</span>
                        <span aria-hidden>·</span>
                        <span>{countLabel(row.services ?? [], "service")}</span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {pageCount > 1 ? (
            <nav
              aria-label="Branch pages"
              className="mt-6 flex items-center justify-center gap-2 text-sm"
            >
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                <Button
                  key={number}
                  variant={number === currentPage ? "default" : "ghost"}
                  size="sm"
                  aria-current={number === currentPage ? "page" : undefined}
                  onClick={() => setPage(number)}
                >
                  {number}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === pageCount}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          ) : null}
        </>
      )}
    </div>
  );
}
