"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AreaField, SelectField, TextField, ToggleField } from "@/components/studio/fields";
import { ImageDrop, MultiImageDrop } from "@/components/studio/image-drop";
import { PageHeader } from "@/components/studio/page-header";
import { VenueLocation } from "@/components/studio/venue-location";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { branchTemplate } from "@/lib/branch-template";
import { emptyService, emptyVenue, pastorPreview, type BranchDraft, type BranchRow } from "@/lib/branch-types";
import { deleteBranch, emptyBranch, listBranches, loadBranchDraft, saveBranch, saveBranchImageUrl, venueHasContent } from "@/lib/branches-repo";
import { deleteBranchImageFolder, ensureBranchImageFolder, pruneBranchImageFolder, uploadBranchImage } from "@/lib/branch-images";
import { confirmDelete } from "@/lib/confirm";
import { syncGallery, syncVenueImages } from "@/lib/media-repo";
import { slugify } from "@/lib/utils";
import { WORKSPACES } from "@/lib/workspaces";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function BranchEditor() {
  const [rows, setRows] = useState<BranchRow[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<BranchDraft | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [originalIds, setOriginalIds] = useState<{ venues: string[]; services: string[] }>({ venues: [], services: [] });
  const [pendingOwner] = useState(() => crypto.randomUUID());
  const pendingImages = useRef<{ hero: File | null; pastor: File | null; gallery: File[]; venues: Record<string, File> }>({
    hero: null,
    pastor: null,
    gallery: [],
    venues: {},
  });

  function clearPendingImages() {
    pendingImages.current = { hero: null, pastor: null, gallery: [], venues: {} };
  }

  function refresh() {
    setError("");
    setRows(null);
    listBranches()
      .then(setRows)
      .catch((caught) => {
        setRows([]);
        setError(caught instanceof Error ? caught.message : "Could not load branches.");
      });
  }

  useEffect(() => {
    refresh();
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!rows) return [];
    if (!needle) return rows;
    return rows.filter((row) => `${row.name} ${row.slug} ${row.subtitle ?? ""}`.toLowerCase().includes(needle));
  }, [query, rows]);

  async function openRow(row: BranchRow) {
    try {
      const next = await loadBranchDraft(row);
      clearPendingImages();
      setDraft(next);
      setSlugTouched(true);
      setOriginalIds({
        venues: (row.venues ?? []).map((venue) => venue.id),
        services: (row.services ?? []).map((service) => service.id),
      });
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not open this branch.");
    }
  }

  function openNew() {
    clearPendingImages();
    setDraft(emptyBranch());
    setSlugTouched(false);
    setOriginalIds({ venues: [], services: [] });
  }

  function patch(partial: Partial<BranchDraft>) {
    setDraft((current) => (current ? { ...current, ...partial } : current));
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    if (!draft) return;
    setSaving(true);
    try {
      const id = await saveBranch(draft, originalIds);
      const waiting = pendingImages.current;
      try {
        await ensureBranchImageFolder(id);
      } catch (caught) {
        toast.error(
          caught instanceof Error
            ? `Branch saved, but its Cloudflare folder was not created: ${caught.message}`
            : "Branch saved, but its Cloudflare folder was not created",
        );
      }
      try {
        if (waiting.hero) {
          const uploaded = await uploadBranchImage({ branchId: id, category: "hero", file: waiting.hero });
          await saveBranchImageUrl(id, "hero_image_url", uploaded.publicUrl);
        }
        if (waiting.pastor) {
          const uploaded = await uploadBranchImage({ branchId: id, category: "pastor", file: waiting.pastor });
          await saveBranchImageUrl(id, "pastor_image_url", uploaded.publicUrl);
        }
      } catch (caught) {
        toast.error(caught instanceof Error ? `Branch saved, but an image was not uploaded: ${caught.message}` : "An image was not uploaded");
      }
      let gallery = draft.gallery;
      try {
        for (const file of waiting.gallery) {
          const uploaded = await uploadBranchImage({ branchId: id, category: "gallery", file });
          gallery = [...gallery, { key: crypto.randomUUID(), url: uploaded.publicUrl, path: uploaded.key }];
        }
        await syncGallery(id, gallery, pendingOwner);
      } catch (caught) {
        toast.error(caught instanceof Error ? `Branch saved, but the gallery was not: ${caught.message}` : "Gallery was not saved");
      }
      try {
        const venues = [];
        for (const venue of draft.venues.filter(venueHasContent)) {
          const file = waiting.venues[venue.key];
          if (!file) {
            venues.push({ imageUrl: venue.imageUrl, imageKey: venue.imageKey });
            continue;
          }
          const uploaded = await uploadBranchImage({ branchId: id, category: "venue", file });
          venues.push({ imageUrl: uploaded.publicUrl, imageKey: uploaded.key });
        }
        await syncVenueImages(id, venues);
      } catch (caught) {
        toast.error(caught instanceof Error ? `Branch saved, but a venue photo was not: ${caught.message}` : "A venue photo was not saved");
      }
      try {
        await pruneBranchImageFolder(id);
      } catch (caught) {
        toast.error(
          caught instanceof Error
            ? `Branch saved, but unused images were not removed: ${caught.message}`
            : "Branch saved, but unused images were not removed",
        );
      }
      clearPendingImages();
      toast.success("Branch saved");
      setDraft(null);
      refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!draft?.id) return;
    const confirmed = await confirmDelete(draft.name || "this branch");
    if (!confirmed) return;
    try {
      await deleteBranchImageFolder(draft.id);
      await deleteBranch(draft.id);
      toast.success("Branch deleted");
      setDraft(null);
      refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Delete failed");
    }
  }

  return (
    <div>
      <PageHeader
        title="Branches"
        description="Campuses, venues, service times, and gallery photos. Addresses are stored on venues, which is what the websites show."
        action={<Button onClick={openNew}>New branch</Button>}
      />
      {draft ? (
        <form className="space-y-8" onSubmit={onSave}>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setDraft(null)}>
              Back to list
            </Button>
            {!draft.id ? (
              <Button variant="outline" onClick={() => setDraft((current) => (current ? branchTemplate(current) : current))}>
                Branch template
              </Button>
            ) : null}
          </div>
          <section className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Name"
              name="name"
              required
              value={draft.name}
              onChange={(event) => {
                const name = event.target.value;
                patch({ name, slug: slugTouched ? draft.slug : slugify(name) });
              }}
            />
            <TextField
              label="Slug"
              name="slug"
              required
              value={draft.slug}
              onChange={(event) => {
                setSlugTouched(true);
                patch({ slug: slugify(event.target.value) });
              }}
            />
            <TextField label="City" name="city" value={draft.city} onChange={(event) => patch({ city: event.target.value })} />
            <SelectField
              label="Workspace"
              name="workspace"
              value={draft.workspace}
              onChange={(event) => patch({ workspace: event.target.value as BranchDraft["workspace"] })}
            >
              {WORKSPACES.filter((workspace) => workspace.id !== "app").map((workspace) => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </SelectField>
            <div className="md:col-span-2">
              <AreaField
                label="Short description"
                name="shortDescription"
                value={draft.shortDescription}
                onChange={(event) => patch({ shortDescription: event.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <AreaField
                label="Description"
                name="description"
                value={draft.description}
                onChange={(event) => patch({ description: event.target.value })}
              />
            </div>
            <TextField label="Sort order" name="sortOrder" type="number" value={draft.sortOrder} onChange={(event) => patch({ sortOrder: event.target.value })} />
            <div className="flex items-end">
              <ToggleField label="Published" checked={draft.published} onChange={(published) => patch({ published })} />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-lg font-semibold">Pastor</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Name" name="pastorName" value={draft.pastorName} onChange={(event) => patch({ pastorName: event.target.value })} />
              <SelectField
                label="Role"
                name="pastorRole"
                value={draft.pastorRole}
                onChange={(event) => patch({ pastorRole: event.target.value as BranchDraft["pastorRole"] })}
              >
                <option value="pastor">Pastor</option>
                <option value="lead">Branch Lead</option>
              </SelectField>
            </div>
            <p className="text-sm text-muted-foreground">Shown on the site as {pastorPreview(draft.pastorName, draft.pastorRole)}.</p>
            <AreaField label="Bio" name="pastorBio" value={draft.pastorBio} onChange={(event) => patch({ pastorBio: event.target.value })} />
            <ImageDrop
              label="Pastor photo"
              value={draft.pastorPhoto}
              branch={{ id: draft.id ?? null, category: "pastor" }}
              onChange={(pastorPhoto) => patch({ pastorPhoto })}
              onQueue={(file) => {
                pendingImages.current.pastor = file;
              }}
            />
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <h2 className="font-heading text-lg font-semibold md:col-span-2">Contact</h2>
            <TextField label="Email" name="email" type="email" value={draft.email} onChange={(event) => patch({ email: event.target.value })} />
            <TextField label="Phone" name="phone" value={draft.phone} onChange={(event) => patch({ phone: event.target.value })} />
            <TextField label="Giving link" name="givingLink" type="url" placeholder="https://" value={draft.givingLink} onChange={(event) => patch({ givingLink: event.target.value })} />
            <TextField label="Instagram" name="instagram" placeholder="https://instagram.com/…" value={draft.instagram} onChange={(event) => patch({ instagram: event.target.value })} />
          </section>

          <ImageDrop
            label="Hero image"
            value={draft.heroImage}
            branch={{ id: draft.id ?? null, category: "hero" }}
            onChange={(heroImage) => patch({ heroImage })}
            onQueue={(file) => {
              pendingImages.current.hero = file;
            }}
          />

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-heading text-lg font-semibold">Venues</h2>
              <Button variant="outline" onClick={() => patch({ venues: [...draft.venues, emptyVenue()] })}>
                Add venue
              </Button>
            </div>
            {draft.venues.map((venue, index) => (
              <div key={venue.key} className="space-y-3 rounded-xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Venue {index + 1}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => patch({ venues: draft.venues.filter((item) => item.key !== venue.key) })}
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <TextField
                    label="Name"
                    value={venue.name}
                    onChange={(event) =>
                      patch({ venues: draft.venues.map((item) => (item.key === venue.key ? { ...item, name: event.target.value } : item)) })
                    }
                  />
                  <TextField
                    label="City"
                    value={venue.city}
                    onChange={(event) =>
                      patch({ venues: draft.venues.map((item) => (item.key === venue.key ? { ...item, city: event.target.value } : item)) })
                    }
                  />
                  <TextField
                    label="Address"
                    value={venue.address}
                    onChange={(event) =>
                      patch({ venues: draft.venues.map((item) => (item.key === venue.key ? { ...item, address: event.target.value } : item)) })
                    }
                  />
                  <TextField
                    label="Postcode"
                    value={venue.postcode}
                    onChange={(event) =>
                      patch({ venues: draft.venues.map((item) => (item.key === venue.key ? { ...item, postcode: event.target.value } : item)) })
                    }
                  />
                  <TextField
                    label="Parking"
                    value={venue.parkingInfo}
                    onChange={(event) =>
                      patch({ venues: draft.venues.map((item) => (item.key === venue.key ? { ...item, parkingInfo: event.target.value } : item)) })
                    }
                  />
                  <TextField
                    label="Public transport"
                    value={venue.transitInfo}
                    onChange={(event) =>
                      patch({ venues: draft.venues.map((item) => (item.key === venue.key ? { ...item, transitInfo: event.target.value } : item)) })
                    }
                  />
                </div>
                <VenueLocation
                  venue={venue}
                  onChange={(next) => patch({ venues: draft.venues.map((item) => (item.key === venue.key ? next : item)) })}
                />
                <ImageDrop
                  label="Venue photo"
                  value={venue.imageUrl}
                  branch={{ id: draft.id ?? null, category: "venue" }}
                  onQueue={(file) => {
                    pendingImages.current.venues[venue.key] = file;
                  }}
                  onChange={(imageUrl, imageKey) =>
                    patch({
                      venues: draft.venues.map((item) =>
                        item.key === venue.key ? { ...item, imageUrl, imageKey: imageKey ?? item.imageKey } : item,
                      ),
                    })
                  }
                />
              </div>
            ))}
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-heading text-lg font-semibold">Services</h2>
              <Button variant="outline" onClick={() => patch({ services: [...draft.services, emptyService()] })}>
                Add service
              </Button>
            </div>
            {draft.services.map((service, index) => (
              <div key={service.key} className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-4">
                <SelectField
                  label="Day"
                  value={service.day}
                  onChange={(event) =>
                    patch({
                      services: draft.services.map((item) => (item.key === service.key ? { ...item, day: event.target.value } : item)),
                    })
                  }
                >
                  {DAYS.map((day) => (
                    <option key={day}>{day}</option>
                  ))}
                </SelectField>
                <TextField
                  label="Time"
                  type="time"
                  value={service.time}
                  onChange={(event) =>
                    patch({
                      services: draft.services.map((item) => (item.key === service.key ? { ...item, time: event.target.value } : item)),
                    })
                  }
                />
                <TextField
                  label="Label"
                  value={service.label}
                  onChange={(event) =>
                    patch({
                      services: draft.services.map((item) => (item.key === service.key ? { ...item, label: event.target.value } : item)),
                    })
                  }
                />
                <SelectField
                  label="Venue"
                  value={String(service.venueIndex)}
                  onChange={(event) =>
                    patch({
                      services: draft.services.map((item) =>
                        item.key === service.key ? { ...item, venueIndex: Number(event.target.value) } : item,
                      ),
                    })
                  }
                >
                  {draft.venues.map((venue, venueIndex) => (
                    <option key={venue.key} value={venueIndex}>
                      {venue.name || `Venue ${venueIndex + 1}`}
                    </option>
                  ))}
                </SelectField>
                <div className="md:col-span-4">
                  <Button variant="ghost" size="sm" onClick={() => patch({ services: draft.services.filter((_, itemIndex) => itemIndex !== index) })}>
                    Remove service
                  </Button>
                </div>
              </div>
            ))}
          </section>

          <MultiImageDrop
            branchId={draft.id ?? null}
            items={draft.gallery}
            onChange={(gallery) => patch({ gallery })}
            onQueueFiles={(files) => {
              pendingImages.current.gallery.push(...files);
            }}
          />

          <p className="text-sm text-muted-foreground">
            Saving creates this branch&apos;s Cloudflare folder, including for a campus that does not have one yet. Images chosen before the first save upload then.
          </p>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save branch"}
            </Button>
            {draft.id ? (
              <Button variant="destructive" onClick={() => void onDelete()}>
                Delete branch
              </Button>
            ) : null}
          </div>
        </form>
      ) : (
        <div>
          <Input value={query} placeholder="Search branches" onChange={(event) => setQuery(event.target.value)} className="mb-4 max-w-sm" />
          {rows === null ? (
            <div className="space-y-3">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-border p-6">
              <p className="text-sm text-destructive">{error}</p>
              <Button className="mt-3" variant="outline" onClick={refresh}>
                Try again
              </Button>
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
              No branches yet.
            </div>
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {visible.map((row) => (
                <li key={row.id}>
                  <button type="button" className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-accent" onClick={() => void openRow(row)}>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{row.name}</span>
                      <span className="block truncate text-sm text-muted-foreground">
                        {row.subtitle || row.slug}
                      </span>
                    </span>
                    <Badge tone={row.is_active ? "default" : "muted"}>{row.is_active ? "Published" : "Draft"}</Badge>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
