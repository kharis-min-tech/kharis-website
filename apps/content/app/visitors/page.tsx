"use client";

import { CrudPage } from "@/components/studio/crud-page";
import { deleteVisitor, listVisitors, saveVisitor } from "@/lib/content-repo";
import type { VisitorRow } from "@/lib/types";

export default function VisitorsPage() {
  return (
    <CrudPage<VisitorRow>
      title="Visitors"
      description="People who asked to visit, with notes for the branch team."
      loadKey="visitors"
      fields={[
        { key: "first_name", label: "First name", kind: "text" },
        { key: "last_name", label: "Last name", kind: "text" },
        { key: "email", label: "Email", kind: "text" },
        { key: "phone", label: "Phone", kind: "text" },
        { key: "branch", label: "Branch", kind: "text" },
        { key: "notes", label: "Notes", kind: "textarea" },
      ]}
      load={listVisitors}
      blank={() => ({ first_name: "", last_name: "", email: "", phone: "", branch: "", notes: "" })}
      toDraft={(row) => ({
        first_name: row.first_name ?? "",
        last_name: row.last_name ?? "",
        email: row.email ?? "",
        phone: row.phone ?? "",
        branch: row.branch ?? "",
        notes: row.notes ?? "",
      })}
      titleOf={(row) => `${row.first_name} ${row.last_name ?? ""}`.trim()}
      metaOf={(row) => [row.branch, row.email].filter(Boolean).join(" · ")}
      searchOf={(row) => `${row.first_name} ${row.last_name ?? ""} ${row.email ?? ""} ${row.branch ?? ""} ${row.notes ?? ""}`}
      save={(draft, id) =>
        saveVisitor({
          id,
          first_name: draft.first_name ?? "",
          last_name: draft.last_name ?? "",
          email: draft.email ?? "",
          phone: draft.phone ?? "",
          branch: draft.branch ?? "",
          notes: draft.notes ?? "",
        })
      }
      remove={deleteVisitor}
    />
  );
}
