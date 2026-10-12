"use client";

import { CrudPage } from "@/components/studio/crud-page";
import { deleteSermon, listSermons, saveSermon } from "@/lib/content-repo";
import type { SermonRow } from "@/lib/types";

export default function SermonsPage() {
  return (
    <CrudPage<SermonRow>
      title="Sermons"
      description="The shared sermon library. Daily messages pick from published and unpublished sermons."
      loadKey="sermons"
      fields={[
        { key: "title", label: "Title", kind: "text" },
        { key: "speaker", label: "Speaker", kind: "text" },
        { key: "date", label: "Date", kind: "date" },
        { key: "series", label: "Series", kind: "text" },
        { key: "description", label: "Description", kind: "textarea" },
        { key: "video_url", label: "Video URL", kind: "url" },
        { key: "audio_url", label: "Audio URL", kind: "url" },
        { key: "thumbnail", label: "Thumbnail", kind: "image", folder: "sermons" },
        { key: "published", label: "Published", kind: "toggle" },
      ]}
      load={listSermons}
      blank={() => ({
        title: "",
        speaker: "",
        date: "",
        series: "",
        description: "",
        video_url: "",
        audio_url: "",
        thumbnail: "",
        published: "true",
      })}
      toDraft={(row) => ({
        title: row.title ?? "",
        speaker: row.speaker ?? "",
        date: (row.date ?? "").slice(0, 10),
        series: row.series ?? "",
        description: row.description ?? "",
        video_url: row.video_url ?? "",
        audio_url: row.audio_url ?? "",
        thumbnail: row.thumbnail ?? "",
        published: row.published ? "true" : "false",
      })}
      titleOf={(row) => row.title}
      metaOf={(row) => [row.speaker, row.date?.slice(0, 10), row.published ? "Published" : "Draft"].filter(Boolean).join(" · ")}
      searchOf={(row) => `${row.title} ${row.speaker ?? ""} ${row.series ?? ""}`}
      save={(draft, id) =>
        saveSermon({
          id,
          title: draft.title ?? "",
          speaker: draft.speaker ?? "",
          date: draft.date || null,
          series: draft.series ?? "",
          description: draft.description ?? "",
          video_url: draft.video_url ?? "",
          audio_url: draft.audio_url ?? "",
          thumbnail: draft.thumbnail ?? "",
          published: draft.published === "true",
        })
      }
      remove={deleteSermon}
    />
  );
}
