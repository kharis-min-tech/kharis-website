"use client";

import { useEffect, useState } from "react";
import { CrudPage } from "@/components/studio/crud-page";
import { listBranchOptions } from "@/lib/branches-repo";
import { deleteVisitor, listVisitors, saveVisitor } from "@/lib/content-repo";
import type { BranchOption, VisitorRow } from "@/lib/types";
import { visitorToDraft } from "@/lib/visitors";

function branchChoices(branches: BranchOption[]) {
  const seen = new Set<string>();
  const options = [{ value: "", label: "Choose a branch" }];
  for (const branch of branches) {
    const name = branch.name.trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    options.push({ value: name, label: name });
  }
  return options;
}

export default function VisitorsPage() {
  const [branches, setBranches] = useState<BranchOption[]>([]);

  useEffect(() => {
    listBranchOptions()
      .then(setBranches)
      .catch(() => setBranches([]));
  }, []);

  return (
    <CrudPage<VisitorRow>
      title="Visitors"
      description="People who asked to visit, with their message for the branch team."
      loadKey="visitors"
      fields={[
        { key: "name", label: "Name", kind: "text" },
        { key: "email", label: "Email", kind: "text" },
        { key: "phone", label: "Phone", kind: "text" },
        { key: "branch_name", label: "Branch", kind: "select", options: branchChoices(branches) },
        { key: "message", label: "Message", kind: "textarea" },
      ]}
      load={listVisitors}
      blank={() => visitorToDraft({})}
      toDraft={visitorToDraft}
      titleOf={(row) => row.name?.trim() || "Unnamed"}
      metaOf={(row) => [row.branch_name, row.email].filter(Boolean).join(" · ")}
      searchOf={(row) =>
        `${row.name ?? ""} ${row.email ?? ""} ${row.branch_name ?? ""} ${row.message ?? ""}`
      }
      save={(draft, id) => saveVisitor(visitorToDraft(draft), id)}
      remove={deleteVisitor}
    />
  );
}
