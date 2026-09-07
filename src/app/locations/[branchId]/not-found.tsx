import Link from "next/link";

export default function BranchMissing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--page-bg)] px-6 text-center text-[var(--page-fg)]">
      <h1 className="text-3xl font-semibold">We couldn&apos;t find that branch</h1>
      <p className="text-[var(--muted)]">That branch isn&apos;t in the directory yet.</p>
      <Link
        href="/locations"
        className="rounded-full bg-[var(--purple)] px-5 py-2.5 text-sm font-semibold text-white"
      >
        Browse all locations
      </Link>
    </div>
  );
}
