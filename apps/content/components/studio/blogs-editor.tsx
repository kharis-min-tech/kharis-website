"use client";

import { Newspaper, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  EmptyState,
  ErrorNotice,
  GridSkeleton,
  IconTile,
  SearchInput,
  Toolbar,
} from "@/components/studio/blocks";
import { SelectField, TextField } from "@/components/studio/fields";
import { ImageDrop, MultiImageDrop } from "@/components/studio/image-drop";
import { PageHeader } from "@/components/studio/page-header";
import { Panel } from "@/components/studio/panel";
import { PickWorkspace } from "@/components/studio/pick-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label, Textarea } from "@/components/ui/input";
import { confirmDelete } from "@/lib/confirm";
import {
  BLOG_SITES,
  emptyContentBlog,
  siteLabel,
  statusLabel,
  type BlogSite,
  type BlogStatus,
  type ContentBlog,
} from "@/lib/content-blogs";
import { deleteContentBlog, listContentBlogs, saveContentBlog } from "@/lib/content-blogs-repo";
import { useWorkspaceId } from "@/lib/workspace-context";

function message(caught: unknown, fallback: string) {
  return caught instanceof Error ? caught.message : fallback;
}

export function BlogsEditor() {
  const workspace = useWorkspaceId();
  const [rows, setRows] = useState<ContentBlog[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BlogStatus>("all");
  const [editing, setEditing] = useState<ContentBlog | null>(null);
  const [saving, setSaving] = useState(false);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((value) => value + 1), []);

  useEffect(() => {
    if (!workspace || (workspace !== "kharis" && workspace !== "kp2")) return;
    let active = true;
    setRows(null);
    setError("");
    listContentBlogs()
      .then((blogs) => {
        if (!active) return;
        setRows(blogs.filter((blog) => blog.sites.includes(workspace)));
      })
      .catch((caught) => {
        if (!active) return;
        setRows([]);
        setError(message(caught, "Blogs could not be loaded."));
      });
    return () => {
      active = false;
    };
  }, [workspace, tick]);

  const visible = useMemo(() => {
    if (!rows) return [];
    const needle = query.trim().toLowerCase();
    return rows.filter((blog) => {
      if (statusFilter !== "all" && blog.status !== statusFilter) return false;
      if (!needle) return true;
      return `${blog.title} ${blog.body} ${blog.sites.join(" ")}`.toLowerCase().includes(needle);
    });
  }, [rows, query, statusFilter]);

  if (!workspace || (workspace !== "kharis" && workspace !== "kp2")) {
    return <PickWorkspace />;
  }

  const siteWorkspace = workspace;

  function openNew() {
    setEditing(emptyContentBlog([siteWorkspace]));
  }

  function patch(partial: Partial<ContentBlog>) {
    setEditing((current) => (current ? { ...current, ...partial } : current));
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    if (!editing) return;
    if (!editing.title.trim()) {
      toast.error("A blog needs a title.");
      return;
    }
    if (!editing.sites.length) {
      toast.error("Choose at least one site.");
      return;
    }
    setSaving(true);
    try {
      await saveContentBlog(editing);
      toast.success("Blog saved");
      setEditing(null);
      refresh();
    } catch (caught) {
      toast.error(message(caught, "The blog could not be saved."));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(blog: ContentBlog) {
    if (!(await confirmDelete(`Delete “${blog.title || "this blog"}”?`))) return;
    try {
      await deleteContentBlog(blog.id);
      toast.success("Blog deleted");
      if (editing?.id === blog.id) setEditing(null);
      refresh();
    } catch (caught) {
      toast.error(message(caught, "The blog could not be deleted."));
    }
  }

  function toggleSite(site: BlogSite, checked: boolean) {
    if (!editing) return;
    const sites = checked
      ? [...new Set([...editing.sites, site])]
      : editing.sites.filter((item) => item !== site);
    patch({ sites });
  }

  return (
    <div>
      <PageHeader
        title="Blogs"
        badge="experimental"
        description="Author posts for the Kharis and KP2 websites. Experimental: nothing is live on either site yet."
        icon={<IconTile icon={Newspaper} className="h-12 w-12 rounded-2xl" />}
        action={
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" />
            New blog
          </Button>
        }
      />
      <Toolbar>
        <SearchInput
          value={query}
          placeholder="Search blogs"
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          aria-label="Status"
          className="h-10 min-w-[10rem] rounded-lg border border-border bg-background px-3 text-sm"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as "all" | BlogStatus)}
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </Toolbar>

      {rows === null ? (
        <GridSkeleton />
      ) : error ? (
        <ErrorNotice message={error} onRetry={refresh} />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title={rows.length ? "No matches" : "No blogs yet"}
          action={
            rows.length ? undefined : (
              <Button onClick={openNew}>
                <Plus className="h-4 w-4" />
                New blog
              </Button>
            )
          }
        >
          {rows.length
            ? "Nothing matches that search."
            : "Create a draft for this site. You can also tick the other website if the same post should appear there later."}
        </EmptyState>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((blog) => (
            <li
              key={blog.id}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card"
            >
              {blog.featuredImageUrl ? (
                <img src={blog.featuredImageUrl} alt="" className="h-36 w-full object-cover" />
              ) : (
                <div className="flex h-36 items-center justify-center bg-muted text-muted-foreground">
                  <Newspaper className="h-8 w-8 opacity-40" />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={blog.status === "published" ? "success" : "muted"}>
                    {statusLabel(blog.status)}
                  </Badge>
                  {blog.sites.map((site) => (
                    <Badge key={site} tone="accent">
                      {siteLabel(site)}
                    </Badge>
                  ))}
                </div>
                <div>
                  <p className="font-heading text-[15px] font-semibold leading-snug">
                    {blog.title || "Untitled"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{blog.publishedAt}</p>
                </div>
                <div className="mt-auto flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditing({ ...blog })}>
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-danger hover:bg-danger-soft"
                    onClick={() => void onDelete(blog)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing ? (
        <Panel title={editing.title.trim() || "New blog"} onClose={() => setEditing(null)}>
          <form className="space-y-4" onSubmit={onSave}>
            <TextField
              label="Title"
              value={editing.title}
              onChange={(event) => patch({ title: event.target.value })}
              required
            />
            <TextField
              label="Date"
              type="date"
              value={editing.publishedAt}
              onChange={(event) => patch({ publishedAt: event.target.value })}
              required
            />
            <SelectField
              label="Status"
              value={editing.status}
              onChange={(event) => patch({ status: event.target.value as BlogStatus })}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </SelectField>
            <fieldset>
              <legend className="mb-2 text-sm font-medium">Show on</legend>
              <div className="flex flex-wrap gap-4">
                {BLOG_SITES.map((site) => (
                  <label key={site} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[var(--primary)]"
                      checked={editing.sites.includes(site)}
                      onChange={(event) => toggleSite(site, event.target.checked)}
                    />
                    {siteLabel(site)} website
                  </label>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Tick both if the same post should appear on kharis.org and KP2 later.
              </p>
            </fieldset>
            <ImageDrop
              label="Featured image"
              folder="blogs"
              value={editing.featuredImageUrl}
              onChange={(url) => patch({ featuredImageUrl: url })}
            />
            <div>
              <Label htmlFor="blog-body">Content</Label>
              <Textarea
                id="blog-body"
                rows={10}
                value={editing.body}
                onChange={(event) => patch({ body: event.target.value })}
                placeholder="Write the post…"
              />
            </div>
            <MultiImageDrop
              folder="blogs"
              items={editing.gallery.map((url) => ({ key: url, url }))}
              onChange={(items) => patch({ gallery: items.map((item) => item.url) })}
            />
            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save blog"}
              </Button>
            </div>
          </form>
        </Panel>
      ) : null}
    </div>
  );
}
