"use client";

import { CrudPage } from "@/components/studio/crud-page";
import { PickWorkspace } from "@/components/studio/pick-workspace";
import { deleteNews, listNews, saveNews } from "@/lib/content-repo";
import type { NewsRow } from "@/lib/types";
import { useWorkspaceId } from "@/lib/workspace-context";

export default function AnnouncementsPage() {
  const workspace = useWorkspaceId();
  if (!workspace) return <PickWorkspace />;

  return (
    <CrudPage<NewsRow>
      title="Announcements"
      description="News for this workspace. Published items are the ones the app and sites should show."
      loadKey={workspace}
      fields={[
        { key: "title", label: "Title", kind: "text" },
        { key: "body", label: "Body", kind: "textarea" },
        { key: "image", label: "Image", kind: "image", folder: "news" },
        { key: "published", label: "Published", kind: "toggle" },
      ]}
      load={() => listNews(workspace)}
      blank={() => ({ title: "", body: "", image: "", published: "true" })}
      toDraft={(row) => ({
        title: row.title ?? "",
        body: row.body ?? "",
        image: row.image ?? "",
        published: row.published ? "true" : "false",
      })}
      titleOf={(row) => row.title}
      metaOf={(row) => (row.published ? "Published" : "Draft")}
      searchOf={(row) => `${row.title} ${row.body ?? ""}`}
      save={(draft, id) =>
        saveNews({
          id,
          workspace,
          title: draft.title ?? "",
          body: draft.body ?? "",
          image: draft.image ?? "",
          published: draft.published === "true",
        })
      }
      remove={deleteNews}
    />
  );
}
