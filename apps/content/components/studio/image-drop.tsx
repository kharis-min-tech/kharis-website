"use client";

import { ImagePlus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
}: {
  label: string;
  value: string;
  folder: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [paste, setPaste] = useState("");

  async function takeFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadImage(file, folder);
      if (value) await clearUrl(value);
      onChange(uploaded.url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
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
        {value ? (
          <img src={value} alt="" className="max-h-36 rounded-md object-cover" />
        ) : (
          <ImagePlus className="h-5 w-5" />
        )}
        <span>{uploading ? "Uploading…" : "Drop an image, or click to browse"}</span>
        <input
          type="file"
          accept="image/*"
          className="sr-only"
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
}: {
  items: { key: string; id?: string; url: string; path?: string }[];
  onChange: (items: { key: string; id?: string; url: string; path?: string }[]) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function takeFiles(files: FileList | File[]) {
    const list = [...files].filter((file) => file.type.startsWith("image/"));
    if (!list.length) return;
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of list) {
        const image = await uploadImage(file, "branches");
        uploaded.push({ key: crypto.randomUUID(), url: image.url, path: image.path });
      }
      onChange([...items, ...uploaded]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
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
        <span>{uploading ? "Uploading…" : "Drop gallery images, or click to browse"}</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(event) => {
            if (event.target.files) void takeFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </label>
      {items.length ? (
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {items.map((item, index) => (
            <li key={item.key} className="relative">
              <img src={item.url} alt="" className="h-24 w-full rounded-md object-cover" />
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7"
                aria-label="Remove gallery image"
                onClick={() => {
                  void removeStored(item.path).catch(() => undefined);
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
