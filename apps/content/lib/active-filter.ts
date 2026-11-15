/** Rows with an is_active column (branches, venues, services). Missing counts as active. */
export type ActiveFilter = "active" | "inactive" | "all";

export const ACTIVE_FILTERS: ActiveFilter[] = ["active", "inactive", "all"];

export function isActive(row: { is_active?: boolean | null }) {
  return row.is_active !== false;
}

export function matchesActiveFilter(filter: ActiveFilter, active: boolean) {
  if (filter === "all") return true;
  return filter === "active" ? active : !active;
}

export function activeCounts<T>(rows: T[], active: (row: T) => boolean) {
  const live = rows.filter(active).length;
  return { active: live, inactive: rows.length - live, all: rows.length };
}
