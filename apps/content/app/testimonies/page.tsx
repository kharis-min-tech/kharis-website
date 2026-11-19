"use client";

import { CrudPage } from "@/components/studio/crud-page";
import { PickWorkspace } from "@/components/studio/pick-workspace";
import { deleteTestimony, listTestimonies, saveTestimony } from "@/lib/content-repo";
import type { TestimonyRow } from "@/lib/types";
import { useWorkspaceId } from "@/lib/workspace-context";
import { isWorkspaceId, type WorkspaceId } from "@/lib/workspaces";

function slotOf(row: TestimonyRow) {
  if (row.is_featured) return "home";
  if (row.is_featured_giving) return "giving";
  return "";
}

function siteLabel(workspace: string | null | undefined) {
  if (workspace === "kp2") return "KP2";
  if (workspace === "kharis") return "Kharis";
  if (workspace === "app") return "App";
  if (workspace === "general") return "General";
  return workspace || "Unassigned";
}

function saveWorkspace(
  scope: WorkspaceId,
  draftWorkspace: string | undefined,
  existing?: string | null,
) {
  if (scope !== "general") return scope;
  if (isWorkspaceId(draftWorkspace) && draftWorkspace !== "general") return draftWorkspace;
  if (isWorkspaceId(existing) && existing !== "general") return existing;
  return "kharis";
}

export default function TestimoniesPage() {
  const workspace = useWorkspaceId();
  if (!workspace) return <PickWorkspace />;

  const showAll = workspace === "general";

  return (
    <CrudPage<TestimonyRow>
      title="Testimonies"
      description={
        showAll
          ? "Every testimony across the sites. Pick which site each one belongs to. Home and giving slots are what the websites feature."
          : "Home and giving slots are what the websites feature. Unpublished testimonies stay in review."
      }
      loadKey={workspace}
      fields={[
        { key: "name", label: "Name", kind: "text" },
        ...(showAll
          ? [
              {
                key: "site",
                label: "Site",
                kind: "select" as const,
                options: [
                  { value: "kharis", label: "Kharis website" },
                  { value: "kp2", label: "KP2 website" },
                  { value: "app", label: "Mobile app" },
                  { value: "general", label: "General" },
                ],
              },
            ]
          : []),
        { key: "branch", label: "Branch", kind: "text" },
        { key: "category", label: "Category", kind: "text" },
        { key: "short_description", label: "Short description", kind: "textarea" },
        { key: "description", label: "Full description", kind: "textarea" },
        { key: "image_url", label: "Photo", kind: "image", folder: "testimonies" },
        {
          key: "slot",
          label: "Featured slot",
          kind: "select",
          options: [
            { value: "", label: "Not featured" },
            { value: "home", label: "Home" },
            { value: "giving", label: "Giving" },
          ],
        },
        { key: "anonymous", label: "Anonymous", kind: "toggle" },
        { key: "published", label: "Published", kind: "toggle" },
      ]}
      load={() => listTestimonies(workspace)}
      blank={() => ({
        name: "",
        site: showAll ? "kharis" : workspace,
        branch: "",
        category: "",
        short_description: "",
        description: "",
        image_url: "",
        slot: "",
        anonymous: "false",
        published: "false",
      })}
      toDraft={(row) => ({
        name: row.name ?? "",
        site: row.workspace ?? "kharis",
        branch: row.branch_name ?? "",
        category: row.category ?? "",
        short_description: row.short_description ?? "",
        description: row.description ?? "",
        image_url: row.image_url ?? "",
        slot: slotOf(row),
        anonymous: row.is_anonymous ? "true" : "false",
        published: row.is_published ? "true" : "false",
      })}
      titleOf={(row) => row.name}
      metaOf={(row) =>
        [
          showAll ? siteLabel(row.workspace) : null,
          row.branch_name,
          slotOf(row) || "Not featured",
          row.is_published ? "Published" : "Draft",
        ]
          .filter(Boolean)
          .join(" · ")
      }
      searchOf={(row) =>
        `${row.name} ${row.workspace ?? ""} ${row.branch_name ?? ""} ${row.category ?? ""} ${row.description ?? ""}`
      }
      imageOf={(row) => row.image_url}
      publishedOf={(row) => Boolean(row.is_published)}
      save={(draft, id) =>
        saveTestimony({
          id,
          workspace: saveWorkspace(workspace, draft.site, draft.site),
          name: draft.name ?? "",
          branch_name: draft.branch ?? "",
          category: draft.category ?? "",
          short_description: draft.short_description ?? "",
          description: draft.description ?? "",
          image_url: draft.image_url ?? "",
          is_anonymous: draft.anonymous === "true",
          is_featured: draft.slot === "home",
          is_featured_giving: draft.slot === "giving",
          is_published: draft.published === "true",
        })
      }
      remove={deleteTestimony}
    />
  );
}
