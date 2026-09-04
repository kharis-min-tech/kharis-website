"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import BranchTemplate from "@/components/branches/BranchTemplate";
import type { BranchData } from "@/lib/branches";

interface Props {
  branch: BranchData;
}

export function LocationBranchView({ branch }: Props) {
  const router = useRouter();

  const goToBranch = useCallback((id: string) => router.push(`/locations/${id}`), [router]);

  return (
    <BranchTemplate
      slug={branch.slug}
      branchData={branch}
      onNavigateBranch={goToBranch}
      onNavigateDirectory={() => router.push("/locations")}
    />
  );
}
