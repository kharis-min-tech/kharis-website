"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import BranchTemplate from "@/components/branches/BranchTemplate";
import type { BranchDetail } from "@/lib/branches";

interface Props {
  detail: BranchDetail;
}

export function LocationBranchView({ detail }: Props) {
  const router = useRouter();

  const goToBranch = useCallback((id: string) => router.push(`/locations/${id}`), [router]);

  return (
    <BranchTemplate
      slug={detail.id}
      branchData={detail.branch}
      onNavigateBranch={goToBranch}
      onNavigateDirectory={() => router.push("/locations")}
    />
  );
}
