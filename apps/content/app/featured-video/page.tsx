"use client";

import { CrudPage } from "@/components/studio/crud-page";
import { PickWorkspace } from "@/components/studio/pick-workspace";
import { deleteFeatured, listFeatured, saveFeatured } from "@/lib/content-repo";
import type { FeaturedVideoRow } from "@/lib/types";
import { useWorkspaceId } from "@/lib/workspace-context";

export default function FeaturedVideoPage() {
  const workspace = useWorkspaceId();
  if (!workspace) return <PickWorkspace />;

  return (
    <CrudPage<FeaturedVideoRow>
      title="Featured video"
      description="The video this website should feature. Publish the one you want on the homepage."
      loadKey={workspace}
      fields={[
        { key: "title", label: "Title", kind: "text" },
        { key: "video_url", label: "Video URL", kind: "url" },
        { key: "published", label: "Published", kind: "toggle" },
      ]}
      load={() => listFeatured(workspace)}
      blank={() => ({ title: "", video_url: "", published: "true" })}
      toDraft={(row) => ({
        title: row.title ?? "",
        video_url: row.video_url ?? "",
        published: row.published ? "true" : "false",
      })}
      titleOf={(row) => row.title || row.video_url || "Untitled"}
      metaOf={(row) => (row.published ? "Published" : "Draft")}
      searchOf={(row) => `${row.title ?? ""} ${row.video_url ?? ""}`}
      save={(draft, id) =>
        saveFeatured({
          id,
          workspace,
          title: draft.title ?? "",
          video_url: draft.video_url ?? "",
          published: draft.published === "true",
        })
      }
      remove={deleteFeatured}
    />
  );
}
