"use client";

import { CrudPage } from "@/components/studio/crud-page";
import { deleteVisitor, listVisitors, saveVisitor } from "@/lib/content-repo";
import type { VisitorRow } from "@/lib/types";
import { visitorToDraft } from "@/lib/visitors";

export default function VisitorsPage() {
  return (
    <CrudPage<VisitorRow>
      title="Visitors"
      description="People who asked to visit, with their message for the branch team."
      loadKey="visitors"
      fields={[
        { key: "name", label: "Name", kind: "text" },
        { key: "email", label: "Email", kind: "text" },
        { key: "phone", label: "Phone", kind: "text" },
        { key: "branch_name", label: "Branch", kind: "text" },
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
