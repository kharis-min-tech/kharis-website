"use client";

import { ImagePlus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isR2ObjectKey, type BranchImageCategory } from "@/lib/branch-image-paths";
import { uploadBranchImage } from "@/lib/branch-images";
import { pathFromPublicUrl, removeStored, uploadImage } from "@/lib/media-repo";
import { cn } from "@/lib/utils";

async function clearUrl(url: string) {
  const path = pathFromPublicUrl(url);
  if (path) await removeStored(path).catch(() => undefined);
}

export function ImageDrop({
  label,
  value,
  folder,
  onChange,
  branch,
  onQueue,
}: {
  label: string;
  value: string;
  folder?: string;
  onChange: (url: string, key?: string) => void;
  branch?: { id: string | null; category: BranchImageCategory };
  onQueue?: (file: File) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [paste, setPaste] = useState("");
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const waitingForSave = Boolean(branch && !branch.id);
  const needsSave = waitingForSave && !onQueue;

  async function takeFile(file: File | undefined) {
    if (!file) return;
    if (waitingForSave) {
      if (!onQueue) {
        toast.error("Save the branch before uploading images.");
        return;
      }
      setLocalPreview((current) => {
        if (current) URL.revokeObjectURL(current);
        return URL.createObjectURL(file);
      });
      onQueue(file);
      toast.success("Ready. This image uploads when you save.");
      return;
    }
    setUploading(true);
    setProgress(branch ? 0 : null);
    try {
      if (branch?.id) {
        const uploaded = await uploadBranchImage({
          branchId: branch.id,
          category: branch.category,
          file,
          onProgress: setProgress,
        });
        onChange(uploaded.publicUrl, uploaded.key);
      } else {
        const uploaded = await uploadImage(file, folder ?? "uploads");
        if (value) await clearUrl(value);
        onChange(uploaded.url);
      }
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(null);
    }
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium">{label}</p>
      <label
        className={cn(
          "flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background px-4 py-4 text-center text-sm text-muted-foreground",
          uploading && "opacity-60",
        )}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void takeFile(event.dataTransfer.files[0]);
        }}
      >
        {localPreview || value ? (
          <img src={localPreview || value} alt="" className="max-h-36 rounded-md object-cover" />
        ) : (
          <ImagePlus className="h-5 w-5" />
        )}
        <span>{uploading ? `Uploading${progress != null ? ` ${progress}%` : "…"}` : "Drop an image, or click to browse"}</span>
        {progress != null ? (
          <span className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-muted">
            <span className="block h-full bg-primary" style={{ width: `${progress}%` }} />
          </span>
        ) : null}
        {waitingForSave ? (
          <span>Save the branch to create its Cloudflare folder and upload this image.</span>
        ) : null}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="sr-only"
          disabled={needsSave || uploading}
          onChange={(event) => {
            void takeFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </label>
      <div className="mt-2 flex gap-2">
        <Input
          value={paste}
          placeholder="Or paste an image URL"
          onChange={(event) => setPaste(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (paste.trim()) onChange(paste.trim());
              setPaste("");
            }
          }}
        />
        <Button
          variant="outline"
          onClick={() => {
            if (paste.trim()) onChange(paste.trim());
            setPaste("");
          }}
        >
          Use URL
        </Button>
        {value ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Remove image"
            onClick={() => {
              void clearUrl(value);
              onChange("");
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function MultiImageDrop({
  items,
  onChange,
  branchId,
  onQueueFiles,
}: {
  items: { key: string; id?: string; url: string; path?: string }[];
  onChange: (items: { key: string; id?: string; url: string; path?: string }[]) => void;
  branchId?: string | null;
  onQueueFiles?: (files: File[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [queued, setQueued] = useState<{ key: string; url: string }[]>([]);
  const usesR2 = branchId !== undefined;
  const waitingForSave = usesR2 && !branchId;
  const needsSave = waitingForSave && !onQueueFiles;

  async function takeFiles(files: FileList | File[]) {
    const list = [...files].filter((file) => file.type.startsWith("image/"));
    if (!list.length) return;
    if (waitingForSave) {
      if (!onQueueFiles) {
        toast.error("Save the branch before uploading images.");
        return;
      }
      setQueued((current) => [
        ...current,
        ...list.map((file) => ({ key: crypto.randomUUID(), url: URL.createObjectURL(file) })),
      ]);
      onQueueFiles(list);
      toast.success(list.length === 1 ? "Ready. This image uploads when you save." : `${list.length} images upload when you save.`);
      return;
    }
    setUploading(true);
    setProgress(usesR2 ? 0 : null);
    try {
      const uploaded = [];
      for (const [index, file] of list.entries()) {
        if (branchId) {
          const image = await uploadBranchImage({
            branchId,
            category: "gallery",
            file,
            onProgress: (percent) => setProgress(Math.round(((index + percent / 100) / list.length) * 100)),
          });
          uploaded.push({ key: crypto.randomUUID(), url: image.publicUrl, path: image.key });
        } else {
          throw new Error("Save the branch before uploading gallery images.");
        }
      }
      onChange([...items, ...uploaded]);
      toast.success(uploaded.length === 1 ? "Image uploaded" : `${uploaded.length} images uploaded`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(null);
    }
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium">Gallery</p>
      <label
        className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background px-4 py-4 text-sm text-muted-foreground"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void takeFiles(event.dataTransfer.files);
        }}
      >
        <ImagePlus className="h-5 w-5" />
        <span>{uploading ? `Uploading${progress != null ? ` ${progress}%` : "…"}` : "Drop gallery images, or click to browse"}</span>
        {progress != null ? (
          <span className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-muted">
            <span className="block h-full bg-primary" style={{ width: `${progress}%` }} />
          </span>
        ) : null}
        {waitingForSave ? (
          <span>Save the branch to create its Cloudflare folder and upload these images.</span>
        ) : null}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          multiple
          className="sr-only"
          disabled={needsSave || uploading}
          onChange={(event) => {
            if (event.target.files) void takeFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </label>
      {items.length || queued.length ? (
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {queued.map((item) => (
            <li key={item.key} className="relative">
              <img src={item.url} alt="" className="h-24 w-full rounded-md object-cover" />
            </li>
          ))}
          {items.map((item, index) => (
            <li key={item.key} className="relative">
              <img src={item.url} alt="" className="h-24 w-full rounded-md object-cover" />
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7"
                aria-label="Remove gallery image"
                onClick={() => {
                  if (!isR2ObjectKey(item.path)) void removeStored(item.path).catch(() => undefined);
                  onChange(items.filter((_, itemIndex) => itemIndex !== index));
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">No gallery images yet.</p>
      )}
    </div>
  );
}
