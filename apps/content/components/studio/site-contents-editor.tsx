"use client";

import {
  Camera,
  ChevronDown,
  ExternalLink,
  GripVertical,
  Images,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { IconTile } from "@/components/studio/blocks";
import { ImageDrop, VideoDrop } from "@/components/studio/image-drop";
import { TextField } from "@/components/studio/fields";
import { PageHeader } from "@/components/studio/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ensurePage,
  getSiteContents,
  guideOverride,
  saveSiteContents,
  withGuideOverride,
  type ListSlot,
  type MediaItem,
  type PageContents,
  type SingleSlot,
  type SiteContents,
  type SiteContentsWorkspace,
} from "@/lib/site-contents";
import {
  type DefaultMedia,
  sectionDefaults,
  sectionGuideImage,
  sectionPreviewUrl,
} from "@/lib/site-contents-defaults";
import {
  emptyListSlot,
  emptyMediaItem,
  emptySingleSlot,
  pageDef,
  pagesForWorkspace,
  type SectionDef,
} from "@/lib/site-contents-schema";
import { uploadImage } from "@/lib/media-repo";
import { hrefWithWorkspace } from "@/lib/workspaces";
import { cn } from "@/lib/utils";

function uploadSubfolder(workspace: SiteContentsWorkspace, pageId: string, sectionId: string) {
  return `${workspace}/${pageId}/${sectionId}`;
}

function addItemLabel(section: SectionDef) {
  if (section.id === "hero" || section.id === "heroMosaic") return "Add slide";
  if (section.allowVideo) return "Add media";
  return "Add photo";
}

function MediaThumb({
  item,
  alt,
  usingDefault,
  active,
  onChangeClick,
}: {
  item: DefaultMedia;
  alt: string;
  usingDefault?: boolean;
  active?: boolean;
  onChangeClick?: () => void;
}) {
  const src = item.kind === "video" ? item.posterUrl || item.url : item.url;
  return (
    <button
      type="button"
      onClick={onChangeClick}
      className={cn(
        "group relative aspect-video w-full overflow-hidden rounded-md border bg-muted text-left transition",
        active ? "border-brand ring-2 ring-brand/40" : "border-border hover:border-brand/60",
        onChangeClick ? "cursor-pointer" : "cursor-default",
      )}
    >
      {src ? (
        item.kind === "video" && !item.posterUrl ? (
          <video src={item.url} className="h-full w-full object-cover" muted playsInline />
        ) : (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        )
      ) : (
        <div className="flex h-full items-center justify-center px-3 text-center text-[11px] text-muted-foreground">
          No preview
        </div>
      )}
      {usingDefault ? (
        <span className="absolute bottom-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
          Site default
        </span>
      ) : null}
      {onChangeClick ? (
        <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded-md bg-black/75 px-1.5 py-1 text-[10px] font-medium text-white opacity-100 shadow-sm transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
          <Pencil className="h-3 w-3" />
          Change
        </span>
      ) : null}
    </button>
  );
}

function previewList(
  section: SectionDef,
  value: ListSlot | null,
  defaults: DefaultMedia[],
): Array<{ item: DefaultMedia; usingDefault: boolean }> {
  const items = value?.items ?? [];
  const studioFilled = items.some((item) => item.url.trim());

  if (!studioFilled) {
    if (defaults.length) {
      return defaults.map((item) => ({ item, usingDefault: true }));
    }
    return items.map((item) => ({
      item: {
        kind: item.kind,
        url: item.url,
        posterUrl: item.posterUrl,
        alt: item.alt,
      },
      usingDefault: !item.url,
    }));
  }

  const count =
    section.kind === "fixedList"
      ? Math.max(section.itemCount ?? items.length, items.length)
      : items.length;

  return Array.from({ length: count }, (_, index) => {
    const studio = items[index];
    const fallback = defaults[index];
    if (studio?.url) {
      return {
        item: {
          kind: studio.kind,
          url: studio.url,
          posterUrl: studio.posterUrl,
          alt: studio.alt,
        },
        usingDefault: false,
      };
    }
    if (fallback) return { item: fallback, usingDefault: true };
    return {
      item: { kind: "image" as const, url: "", posterUrl: "", alt: "" },
      usingDefault: true,
    };
  });
}

function UpdateGuideWarningModal({
  sectionLabel,
  open,
  busy,
  onCancel,
  onContinue,
}: {
  sectionLabel: string;
  open: boolean;
  busy: boolean;
  onCancel: () => void;
  onContinue: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-warning-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
          Content Studio only
        </p>
        <h2 id="guide-warning-title" className="mt-1 text-lg font-semibold">
          Update preview screenshot for {sectionLabel}?
        </h2>
        <div className="mt-3 space-y-3 text-sm text-muted-foreground">
          <p>
            This image is only shown inside Content Studio under “How this looks on the site”. It
            helps editors recognise the section while they upload media.
          </p>
          <p>
            It does <span className="font-medium text-foreground">not</span> change the live
            website, and it does <span className="font-medium text-foreground">not</span> replace
            the site’s built-in default photos or videos. Visitors still see the same site defaults
            until you fill and save the media slots above.
          </p>
          <p>
            The curated default screenshot stays available. You can reset to it later if you clear a
            custom Studio preview.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button type="button" onClick={onContinue} disabled={busy}>
            {busy ? "Opening…" : "Continue to upload"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionPreview({
  workspace,
  pageId,
  section,
  value,
  activeSlotIndex,
  guideUrl,
  usingCustomGuide,
  onSelectSlot,
  onGuideChange,
}: {
  workspace: SiteContentsWorkspace;
  pageId: string;
  section: SectionDef;
  value: SingleSlot | ListSlot | null;
  activeSlotIndex: number | null;
  guideUrl: string | null;
  usingCustomGuide: boolean;
  onSelectSlot: (index: number) => void;
  onGuideChange: (url: string | null) => void;
}) {
  const defaults = sectionDefaults(workspace, pageId, section.id);
  const builtInGuide = sectionGuideImage(workspace, pageId, section.id);
  const previewHref = sectionPreviewUrl(workspace, pageId, section.id);
  const [warnOpen, setWarnOpen] = useState(false);
  const [uploadingGuide, setUploadingGuide] = useState(false);
  const guideInputRef = useRef<HTMLInputElement | null>(null);

  if (section.kind === "deferred") {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        This section is not editable yet. The live site keeps using its built-in media.
      </div>
    );
  }

  const siteLink = previewHref ? (
    <a
      href={previewHref}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:underline"
    >
      View on site
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  ) : null;

  async function uploadGuideFile(file: File | undefined) {
    if (!file) return;
    setUploadingGuide(true);
    try {
      const uploaded = await uploadImage(
        file,
        "site-contents",
        undefined,
        undefined,
        `${uploadSubfolder(workspace, pageId, section.id)}/guide`,
      );
      onGuideChange(uploaded.url);
      toast.success("Studio preview updated — save the page to keep it.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not upload preview screenshot.");
    } finally {
      setUploadingGuide(false);
      if (guideInputRef.current) guideInputRef.current.value = "";
    }
  }

  const guide = (
    <div className="space-y-2">
      {guideUrl ? (
        <figure className="overflow-hidden rounded-lg border border-border bg-muted">
          <img
            src={guideUrl}
            alt={`How ${section.label} looks on the site`}
            className="h-auto w-full"
          />
          <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-2.5 py-1.5 text-[11px] text-muted-foreground">
            <span>How this looks on the site</span>
            {usingCustomGuide ? (
              <span className="rounded bg-amber-500/15 px-1.5 py-0.5 font-medium text-amber-800 dark:text-amber-300">
                Custom Studio preview
              </span>
            ) : null}
          </figcaption>
        </figure>
      ) : (
        <div className="rounded-lg border border-dashed border-border bg-muted/40 px-3 py-6 text-center text-xs text-muted-foreground">
          No section screenshot yet. Upload a desktop still so editors can recognise this band.
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploadingGuide}
          onClick={() => setWarnOpen(true)}
        >
          <Camera className="h-3.5 w-3.5" />
          {uploadingGuide ? "Uploading…" : "Update preview screenshot"}
        </Button>
        {usingCustomGuide ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={uploadingGuide}
            onClick={() => {
              onGuideChange(null);
              toast.message(
                builtInGuide
                  ? "Reset to the default Studio screenshot — save the page to keep it."
                  : "Custom Studio preview cleared — save the page to keep it.",
              );
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to default
          </Button>
        ) : null}
        <input
          ref={guideInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={(event) => void uploadGuideFile(event.target.files?.[0])}
        />
      </div>
      <UpdateGuideWarningModal
        sectionLabel={section.label}
        open={warnOpen}
        busy={uploadingGuide}
        onCancel={() => setWarnOpen(false)}
        onContinue={() => {
          setWarnOpen(false);
          guideInputRef.current?.click();
        }}
      />
    </div>
  );

  if (section.kind === "single") {
    const slot = (value as SingleSlot | null) ?? { url: "", alt: "" };
    const fallback = defaults[0];
    const usingDefault = !slot.url.trim();
    const shown: DefaultMedia = usingDefault
      ? (fallback ?? { kind: "image", url: "", posterUrl: "", alt: "" })
      : { kind: "image", url: slot.url, posterUrl: "", alt: slot.alt };
    return (
      <div className="space-y-3">
        {guide}
        <MediaThumb
          item={shown}
          alt={shown.alt || section.label}
          usingDefault={usingDefault && Boolean(shown.url)}
          active={activeSlotIndex === 0}
          onChangeClick={() => onSelectSlot(0)}
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">{section.hint}</p>
          {siteLink}
        </div>
      </div>
    );
  }

  const tiles = previewList(section, value as ListSlot | null, defaults);
  return (
    <div className="space-y-3">
      {guide}
      <div className="grid grid-cols-2 gap-2">
        {tiles.length ? (
          tiles.map(({ item, usingDefault }, index) => (
            <MediaThumb
              key={`${item.url}-${index}`}
              item={item}
              alt={item.alt || `${section.label} ${index + 1}`}
              usingDefault={usingDefault}
              active={activeSlotIndex === index}
              onChangeClick={() => onSelectSlot(index)}
            />
          ))
        ) : (
          <div className="col-span-2 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No default media mapped for this section yet.
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{section.hint}</p>
        {siteLink}
      </div>
    </div>
  );
}

function MediaItemFields({
  item,
  allowVideo,
  subfolder,
  active,
  draggable,
  onChange,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  item: MediaItem;
  allowVideo: boolean;
  subfolder: string;
  active?: boolean;
  draggable?: boolean;
  onChange: (next: MediaItem) => void;
  onRemove?: () => void;
  onDragStart?: () => void;
  onDragOver?: (event: React.DragEvent) => void;
  onDrop?: () => void;
}) {
  return (
    <div
      ref={(node) => {
        if (active && node) {
          node.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={(event) => {
        event.preventDefault();
        onDrop?.();
      }}
      className={cn(
        "space-y-3 rounded-lg border bg-background p-3 transition",
        active ? "border-brand ring-2 ring-brand/30" : "border-border",
        draggable ? "cursor-grab active:cursor-grabbing" : null,
      )}
    >
      <div className="flex items-center gap-2">
        {draggable ? (
          <span className="text-muted-foreground" aria-hidden>
            <GripVertical className="h-4 w-4" />
          </span>
        ) : null}
        {allowVideo ? (
          <>
            <Button
              type="button"
              size="sm"
              variant={item.kind === "image" ? "default" : "outline"}
              onClick={() => onChange({ ...item, kind: "image", posterUrl: "" })}
            >
              Image
            </Button>
            <Button
              type="button"
              size="sm"
              variant={item.kind === "video" ? "default" : "outline"}
              onClick={() => onChange({ ...item, kind: "video" })}
            >
              Video
            </Button>
          </>
        ) : (
          <p className="text-xs font-medium text-muted-foreground">Photo</p>
        )}
        {onRemove ? (
          <Button type="button" size="sm" variant="ghost" className="ml-auto" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      {item.kind === "video" ? (
        <>
          <VideoDrop
            label="Video file"
            value={item.url}
            folder="site-contents"
            subfolder={subfolder}
            onChange={(url) => onChange({ ...item, url })}
          />
          <ImageDrop
            label="Poster image"
            value={item.posterUrl}
            folder="site-contents"
            subfolder={`${subfolder}/posters`}
            onChange={(url) => onChange({ ...item, posterUrl: url })}
          />
        </>
      ) : (
        <ImageDrop
          label="Image"
          value={item.url}
          folder="site-contents"
          subfolder={subfolder}
          onChange={(url) => onChange({ ...item, url })}
        />
      )}
      <TextField
        label="Alt text"
        value={item.alt}
        onChange={(event) => onChange({ ...item, alt: event.target.value })}
      />
    </div>
  );
}

function SectionEditor({
  workspace,
  pageId,
  section,
  value,
  open,
  guideUrl,
  usingCustomGuide,
  onToggle,
  onChange,
  onGuideChange,
}: {
  workspace: SiteContentsWorkspace;
  pageId: string;
  section: SectionDef;
  value: SingleSlot | ListSlot;
  open: boolean;
  guideUrl: string | null;
  usingCustomGuide: boolean;
  onToggle: () => void;
  onChange: (next: SingleSlot | ListSlot) => void;
  onGuideChange: (url: string | null) => void;
}) {
  const subfolder = uploadSubfolder(workspace, pageId, section.id);
  const allowVideo = Boolean(section.allowVideo);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const dragFrom = useRef<number | null>(null);
  const singleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) setActiveSlotIndex(null);
  }, [open]);

  function ensureOrderedSlot(index: number) {
    if (section.kind !== "orderedList" && section.kind !== "fixedList") return;
    const list = value as ListSlot;
    if (section.kind === "fixedList") {
      setActiveSlotIndex(index);
      return;
    }
    if (list.items.length > index) {
      setActiveSlotIndex(index);
      return;
    }
    const next = [...list.items];
    while (next.length <= index) next.push(emptyMediaItem(allowVideo ? "image" : "image"));
    onChange({ items: next });
    setActiveSlotIndex(index);
  }

  function selectSlot(index: number) {
    if (section.kind === "single") {
      setActiveSlotIndex(0);
      singleRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }
    ensureOrderedSlot(index);
  }

  function reorder(from: number, to: number) {
    if (from === to || from < 0 || to < 0) return;
    const list = value as ListSlot;
    if (to >= list.items.length) return;
    const items = [...list.items];
    const [moved] = items.splice(from, 1);
    if (!moved) return;
    items.splice(to, 0, moved);
    onChange({ items });
    setActiveSlotIndex(to);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
        onClick={onToggle}
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{section.label}</p>
          <p className="truncate text-xs text-muted-foreground">{section.hint}</p>
        </div>
        <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="grid gap-4 border-t border-border p-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-3">
            {section.kind === "deferred" ? (
              <p className="text-sm text-muted-foreground">
                This section is reserved for a later release. Nothing to upload here yet.
              </p>
            ) : null}
            {section.kind === "single" ? (
              <div
                ref={singleRef}
                className={cn(
                  "space-y-3 rounded-lg border p-3 transition",
                  activeSlotIndex === 0
                    ? "border-brand ring-2 ring-brand/30"
                    : "border-transparent",
                )}
              >
                <ImageDrop
                  label="Image"
                  value={(value as SingleSlot).url}
                  folder="site-contents"
                  subfolder={subfolder}
                  onChange={(url) => onChange({ ...(value as SingleSlot), url })}
                />
                <TextField
                  label="Alt text"
                  value={(value as SingleSlot).alt}
                  onChange={(event) =>
                    onChange({ ...(value as SingleSlot), alt: event.target.value })
                  }
                />
              </div>
            ) : null}
            {section.kind === "fixedList" || section.kind === "orderedList" ? (
              <div className="space-y-3">
                {(value as ListSlot).items.map((item, index) => (
                  <MediaItemFields
                    key={`${section.id}-${index}`}
                    item={item}
                    allowVideo={allowVideo}
                    subfolder={`${subfolder}/${index + 1}`}
                    active={activeSlotIndex === index}
                    draggable={section.kind === "orderedList"}
                    onDragStart={() => {
                      dragFrom.current = index;
                    }}
                    onDragOver={(event) => {
                      if (section.kind !== "orderedList") return;
                      event.preventDefault();
                    }}
                    onDrop={() => {
                      if (section.kind !== "orderedList") return;
                      const from = dragFrom.current;
                      dragFrom.current = null;
                      if (from == null) return;
                      reorder(from, index);
                    }}
                    onChange={(next) => {
                      const items = [...(value as ListSlot).items];
                      items[index] = next;
                      onChange({ items });
                    }}
                    onRemove={
                      section.kind === "orderedList"
                        ? () => {
                            const items = (value as ListSlot).items.filter((_, i) => i !== index);
                            onChange({ items });
                            setActiveSlotIndex(null);
                          }
                        : undefined
                    }
                  />
                ))}
                {section.kind === "orderedList" &&
                (value as ListSlot).items.length < (section.maxItems ?? 24) ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const nextIndex = (value as ListSlot).items.length;
                      onChange({
                        items: [...(value as ListSlot).items, emptyMediaItem()],
                      });
                      setActiveSlotIndex(nextIndex);
                    }}
                  >
                    <Plus className="mr-1.5 h-4 w-4" />
                    {addItemLabel(section)}
                  </Button>
                ) : null}
                {section.kind === "orderedList" ? (
                  <p className="text-xs text-muted-foreground">
                    Drag a card by the handle to change its position in the band.
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Preview
            </p>
            <SectionPreview
              workspace={workspace}
              pageId={pageId}
              section={section}
              value={value}
              activeSlotIndex={activeSlotIndex}
              guideUrl={guideUrl}
              usingCustomGuide={usingCustomGuide}
              onSelectSlot={selectSlot}
              onGuideChange={onGuideChange}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SiteContentsIndex({ workspace }: { workspace: SiteContentsWorkspace }) {
  const pages = pagesForWorkspace(workspace);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Site contents"
        description="Edit images and videos for each page section. Empty slots keep the site’s built-in defaults."
        icon={<IconTile icon={Images} />}
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {pages.map((page) => (
          <Link
            key={page.id}
            href={hrefWithWorkspace(`/site-contents/${page.id}`, workspace)}
            className="rounded-xl border border-border bg-card p-4 transition hover:border-brand hover:shadow-sm"
          >
            <p className="font-semibold">{page.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{page.hint}</p>
            <p className="mt-3 text-xs font-medium text-brand">
              {page.sections.length} section{page.sections.length === 1 ? "" : "s"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SiteContentsPageEditor({
  workspace,
  pageId,
}: {
  workspace: SiteContentsWorkspace;
  pageId: string;
}) {
  const def = pageDef(workspace, pageId);
  const [contents, setContents] = useState<SiteContents | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(def?.sections[0]?.id ?? null);
  const pagePreviewHref = useMemo(() => {
    if (!def) return null;
    const first = def.sections.find((section) => section.kind !== "deferred");
    return first
      ? sectionPreviewUrl(workspace, pageId, first.id)
      : sectionPreviewUrl(workspace, pageId, "home");
  }, [def, workspace, pageId]);

  useEffect(() => {
    getSiteContents(workspace)
      .then((loaded) => setContents(ensurePage(loaded, workspace, pageId)))
      .catch((caught) =>
        setError(caught instanceof Error ? caught.message : "Could not load site contents."),
      );
  }, [workspace, pageId]);

  const pageContents: PageContents | null = useMemo(() => {
    if (!contents || !def) return null;
    return contents.pages[pageId] ?? null;
  }, [contents, def, pageId]);

  if (!def) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">That page is not in the site contents map.</p>
        <Link
          href={hrefWithWorkspace("/site-contents", workspace)}
          className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
        >
          Back to pages
        </Link>
      </div>
    );
  }

  function patchSection(sectionId: string, next: SingleSlot | ListSlot) {
    setContents((current) => {
      if (!current) return current;
      const page = current.pages[pageId] ?? {};
      return {
        ...current,
        pages: {
          ...current.pages,
          [pageId]: { ...page, [sectionId]: next },
        },
      };
    });
  }

  function patchGuide(sectionId: string, url: string | null) {
    setContents((current) =>
      current ? withGuideOverride(current, pageId, sectionId, url) : current,
    );
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    if (!contents) return;
    setSaving(true);
    try {
      const saved = await saveSiteContents(workspace, contents);
      setContents(saved);
      toast.success("Site contents saved");
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not save site contents.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={onSave}>
      <PageHeader
        title={def.label}
        description={def.hint}
        icon={<IconTile icon={Images} />}
        back={{ href: hrefWithWorkspace("/site-contents", workspace), label: "All pages" }}
        action={
          <div className="flex flex-wrap items-center gap-2">
            {pagePreviewHref ? (
              <a
                href={pagePreviewHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                <ExternalLink className="h-4 w-4" />
                Preview page
              </a>
            ) : null}
            <Button type="submit" disabled={!contents || saving}>
              {saving ? "Saving…" : "Save page"}
            </Button>
          </div>
        }
      />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {!contents || !pageContents ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <div className="space-y-3">
          {def.sections.map((section) => {
            const customGuide = guideOverride(contents, pageId, section.id);
            const builtIn = sectionGuideImage(workspace, pageId, section.id);
            return (
              <SectionEditor
                key={section.id}
                workspace={workspace}
                pageId={pageId}
                section={section}
                value={
                  pageContents[section.id] ??
                  (section.kind === "single" || section.kind === "deferred"
                    ? emptySingleSlot()
                    : emptyListSlot(
                        section.kind === "fixedList" ? (section.itemCount ?? 0) : 0,
                        Boolean(section.allowVideo),
                      ))
                }
                open={openSection === section.id}
                guideUrl={customGuide ?? builtIn}
                usingCustomGuide={Boolean(customGuide)}
                onToggle={() =>
                  setOpenSection((current) => (current === section.id ? null : section.id))
                }
                onChange={(next) => patchSection(section.id, next)}
                onGuideChange={(url) => patchGuide(section.id, url)}
              />
            );
          })}
        </div>
      )}
    </form>
  );
}
