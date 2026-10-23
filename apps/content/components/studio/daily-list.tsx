"use client";

import { CrudPage } from "@/components/studio/crud-page";
import { PickWorkspace } from "@/components/studio/pick-workspace";
import { readingHint } from "@/lib/bible-reference";
import { deleteDaily, listDaily, saveDaily } from "@/lib/content-repo";
import type { DailyEntryRow, DailyKind } from "@/lib/types";
import { useWorkspaceId } from "@/lib/workspace-context";

export function DailyList({
  kind,
  title,
  description,
}: {
  kind: DailyKind;
  title: string;
  description: string;
}) {
  const workspace = useWorkspaceId();
  if (!workspace) return <PickWorkspace />;

  return (
    <CrudPage<DailyEntryRow>
      title={title}
      description={description}
      loadKey={`${workspace}-${kind}`}
      fields={[
        { key: "date", label: "Date", kind: "date" },
        { key: "title", label: "Title", kind: "text" },
        {
          key: "reference",
          label: "Reference",
          kind: "text",
          placeholder: "John 3:16",
          ...(kind === "reading" ? { detail: readingHint } : {}),
        },
        { key: "body", label: "Body", kind: "textarea" },
      ]}
      load={() => listDaily(workspace, kind)}
      blank={() => ({ date: "", title: "", reference: "", body: "" })}
      toDraft={(row) => ({
        date: (row.date ?? "").slice(0, 10),
        title: row.title ?? "",
        reference: row.reference ?? "",
        body: row.body ?? "",
      })}
      titleOf={(row) => row.title || "Untitled"}
      metaOf={(row) => [row.date?.slice(0, 10), row.reference].filter(Boolean).join(" · ")}
      searchOf={(row) => `${row.title ?? ""} ${row.reference ?? ""} ${row.body ?? ""}`}
      save={(draft, id) =>
        saveDaily({
          id,
          workspace,
          kind,
          date: draft.date || null,
          title: draft.title ?? "",
          reference: draft.reference ?? "",
          body: draft.body ?? "",
        })
      }
      remove={deleteDaily}
    />
  );
}
