"use client";

import { Church, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ActiveFilterTabs, ShowInactiveToggle } from "@/components/studio/active-filter";
import {
  EmptyState,
  ErrorNotice,
  GridSkeleton,
  IconTile,
  SearchInput,
  Toolbar,
} from "@/components/studio/blocks";
import { AreaField, SelectField, TextField, ToggleField } from "@/components/studio/fields";
import { ImageDrop, MultiImageDrop, VideoDrop } from "@/components/studio/image-drop";
import { PageHeader } from "@/components/studio/page-header";
import { VenueLocation } from "@/components/studio/venue-location";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { branchTemplate } from "@/lib/branch-template";
import {
  emptyService,
  emptyVenue,
  pastorPreview,
  type BranchDraft,
  type BranchRow,
} from "@/lib/branch-types";
import {
  activeCounts,
  isActive,
  matchesActiveFilter,
  type ActiveFilter,
} from "@/lib/active-filter";
import {
  emptyBranch,
  listBranches,
  loadBranchDraft,
  saveBranch,
  saveBranchImageUrl,
  setBranchActive,
  venueHasContent,
} from "@/lib/branches-repo";
import {
  ensureBranchImageFolder,
  pruneBranchImageFolder,
  uploadBranchImage,
} from "@/lib/branch-images";
import { confirmAction } from "@/lib/confirm";
import { syncBranchVideo, syncGallery, syncVenueImages } from "@/lib/media-repo";
import { useStudioRole } from "@/lib/studio-role";
import { cn, slugify } from "@/lib/utils";
import { WORKSPACES } from "@/lib/workspaces";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** "2 venues" or "2 venues (1 inactive)". */
function countLabel(items: { is_active?: boolean | null }[], noun: string) {
  const { active, inactive } = activeCounts(items, isActive);
  const label = `${active} ${noun}${active === 1 ? "" : "s"}`;
  return inactive ? `${label} (${inactive} inactive)` : label;
}

export function BranchEditor() {
  const { isSuperAdmin, canEditBranch } = useStudioRole();
  const [rows, setRows] = useState<BranchRow[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ActiveFilter>("active");
  const [showInactive, setShowInactive] = useState({ venues: false, services: false });
  const [draft, setDraft] = useState<BranchDraft | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [originalIds, setOriginalIds] = useState<{ venues: string[]; services: string[] }>({
    venues: [],
    services: [],
  });
  const [pendingOwner] = useState(() => crypto.randomUUID());
  const pendingImages = useRef<{
    hero: File | null;
    pastor: File | null;
    gallery: File[];
    venues: Record<string, File>;
  }>({
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

  const editable = useMemo(
    () => (rows ?? []).filter((row) => canEditBranch(row.id)),
    [rows, canEditBranch],
  );

  const counts = useMemo(() => activeCounts(editable, isActive), [editable]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return editable.filter(
      (row) =>
        matchesActiveFilter(view, isActive(row)) &&
        (!needle || `${row.name} ${row.slug} ${row.subtitle ?? ""}`.toLowerCase().includes(needle)),
    );
  }, [query, view, editable]);

  async function openRow(row: BranchRow) {
    try {
      const next = await loadBranchDraft(row);
      clearPendingImages();
      setShowInactive({ venues: false, services: false });
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
    setShowInactive({ venues: false, services: false });
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
          const uploaded = await uploadBranchImage({
            branchId: id,
            category: "hero",
            file: waiting.hero,
          });
          await saveBranchImageUrl(id, "hero_image_url", uploaded.publicUrl);
        }
        if (waiting.pastor) {
          const uploaded = await uploadBranchImage({
            branchId: id,
            category: "pastor",
            file: waiting.pastor,
          });
          await saveBranchImageUrl(id, "pastor_image_url", uploaded.publicUrl);
        }
      } catch (caught) {
        toast.error(
          caught instanceof Error
            ? `Branch saved, but an image was not uploaded: ${caught.message}`
            : "An image was not uploaded",
        );
      }
      let gallery = draft.gallery;
      try {
        for (const file of waiting.gallery) {
          const uploaded = await uploadBranchImage({ branchId: id, category: "gallery", file });
          gallery = [
            ...gallery,
            { key: crypto.randomUUID(), url: uploaded.publicUrl, path: uploaded.key },
          ];
        }
        await syncGallery(id, gallery, pendingOwner);
      } catch (caught) {
        toast.error(
          caught instanceof Error
            ? `Branch saved, but the gallery was not: ${caught.message}`
            : "Gallery was not saved",
        );
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
        toast.error(
          caught instanceof Error
            ? `Branch saved, but a venue photo was not: ${caught.message}`
            : "A venue photo was not saved",
        );
      }
      try {
        await syncBranchVideo(id, draft.videoUrl);
      } catch (caught) {
        toast.error(
          caught instanceof Error
            ? `Branch saved, but the branch video was not: ${caught.message}`
            : "Branch video was not saved",
        );
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

  async function onSetActive(active: boolean) {
    if (!draft?.id || !isSuperAdmin) return;
    const name = draft.name.trim() || "this branch";
    if (!active) {
      const confirmed = await confirmAction(
        `Deactivate ${name}? It disappears from the websites and app. Venues, services, photos, events and messages are kept.`,
        "Deactivate",
      );
      if (!confirmed) return;
    }
    try {
      await setBranchActive(draft.id, active);
      toast.success(active ? `${name} reinstated` : `${name} deactivated`);
      setDraft(null);
      refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not update the branch");
    }
  }

  function patchVenue(key: string, partial: Partial<BranchDraft["venues"][number]>) {
    setDraft((current) =>
      current
        ? {
            ...current,
            venues: current.venues.map((item) =>
              item.key === key ? { ...item, ...partial } : item,
            ),
          }
        : current,
    );
  }

  function patchService(key: string, partial: Partial<BranchDraft["services"][number]>) {
    setDraft((current) =>
      current
        ? {
            ...current,
            services: current.services.map((item) =>
              item.key === key ? { ...item, ...partial } : item,
            ),
          }
        : current,
    );
  }

  const savedRow = draft?.id ? rows?.find((row) => row.id === draft.id) : undefined;
  const savedActive = savedRow ? isActive(savedRow) : true;
  const inactiveVenues = draft ? draft.venues.filter((venue) => !venue.active).length : 0;
  const inactiveServices = draft ? draft.services.filter((service) => !service.active).length : 0;

  return (
    <div>
      <PageHeader
        icon={<IconTile icon={Church} className="h-12 w-12 rounded-2xl" />}
        title={draft ? draft.name.trim() || "New branch" : "Branches"}
        description={
          draft
            ? "Details, pastor, venues, service times and photos. Save when you're done."
            : "Campuses, venues, service times, and gallery photos. Addresses are stored on venues, which is what the websites show."
        }
        action={
          isSuperAdmin && !draft ? (
            <Button onClick={openNew}>
              <Plus className="h-4 w-4" />
              New branch
            </Button>
          ) : undefined
        }
      />
      {draft ? (
        <form className="space-y-8" onSubmit={onSave}>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setDraft(null)}>
              Back to list
            </Button>
            {!draft.id ? (
              <Button
                variant="outline"
                onClick={() => setDraft((current) => (current ? branchTemplate(current) : current))}
              >
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
            <TextField
              label="City"
              name="city"
              value={draft.city}
              onChange={(event) => patch({ city: event.target.value })}
            />
            <SelectField
              label="Workspace"
              name="workspace"
              value={draft.workspace}
              onChange={(event) =>
                patch({ workspace: event.target.value as BranchDraft["workspace"] })
              }
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
            <TextField
              label="Sort order"
              name="sortOrder"
              type="number"
              value={draft.sortOrder}
              onChange={(event) => patch({ sortOrder: event.target.value })}
            />
            <div className="flex items-end">
              <ToggleField
                label="Active (shown on the websites and app)"
                checked={draft.published}
                onChange={(published) => patch({ published })}
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-lg font-semibold">Pastor</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Name"
                name="pastorName"
                value={draft.pastorName}
                onChange={(event) => patch({ pastorName: event.target.value })}
              />
              <SelectField
                label="Role"
                name="pastorRole"
                value={draft.pastorRole}
                onChange={(event) =>
                  patch({ pastorRole: event.target.value as BranchDraft["pastorRole"] })
                }
              >
                <option value="pastor">Pastor</option>
                <option value="lead">Branch Lead</option>
              </SelectField>
            </div>
            <p className="text-sm text-muted-foreground">
              Shown on the site as {pastorPreview(draft.pastorName, draft.pastorRole)}.
            </p>
            <AreaField
              label="Bio"
              name="pastorBio"
              value={draft.pastorBio}
              onChange={(event) => patch({ pastorBio: event.target.value })}
            />
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
            <TextField
              label="Email"
              name="email"
              type="email"
              value={draft.email}
              onChange={(event) => patch({ email: event.target.value })}
            />
            <TextField
              label="Phone"
              name="phone"
              value={draft.phone}
              onChange={(event) => patch({ phone: event.target.value })}
            />
            <TextField
              label="Giving link"
              name="givingLink"
              type="url"
              placeholder="https://"
              value={draft.givingLink}
              onChange={(event) => patch({ givingLink: event.target.value })}
            />
            <TextField
              label="Instagram"
              name="instagram"
              placeholder="https://instagram.com/…"
              value={draft.instagram}
              onChange={(event) => patch({ instagram: event.target.value })}
            />
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

          <div className="space-y-1.5">
            <VideoDrop
              label="Branch video"
              value={draft.videoUrl}
              folder="branch-videos"
              mediaBranchId={draft.id ?? null}
              onChange={(videoUrl) => patch({ videoUrl })}
            />
            <p className="text-sm text-muted-foreground">
              Upload a video file (.mp4 or .mov) from Finder / iCloud for the &ldquo;A look at
              …&rdquo; section on the branch page.
            </p>
          </div>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2 className="font-heading text-lg font-semibold">Venues</h2>
                <ShowInactiveToggle
                  shown={showInactive.venues}
                  count={inactiveVenues}
                  onChange={(venues) => setShowInactive((current) => ({ ...current, venues }))}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => patch({ venues: [...draft.venues, emptyVenue()] })}
              >
                Add venue
              </Button>
            </div>
            {draft.venues.map((venue, index) => {
              if (!venue.active && !showInactive.venues) return null;
              const usedBy = draft.services.filter(
                (service) => service.active && service.venueIndex === index,
              ).length;
              return (
                <div
                  key={venue.key}
                  className={cn(
                    "space-y-3 rounded-xl border border-border p-4 transition-opacity",
                    !venue.active && "border-dashed bg-muted/30 opacity-75",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {venue.name.trim() || `Venue ${index + 1}`}
                      </p>
                      {!venue.active ? <Badge tone="muted">Inactive</Badge> : null}
                    </div>
                    {venue.id ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => patchVenue(venue.key, { active: !venue.active })}
                      >
                        {venue.active ? "Deactivate" : "Reinstate"}
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          patch({ venues: draft.venues.filter((item) => item.key !== venue.key) })
                        }
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  {!venue.active && usedBy ? (
                    <p className="text-xs text-muted-foreground">
                      {usedBy} active service{usedBy === 1 ? " still uses" : "s still use"} this
                      venue. Move {usedBy === 1 ? "it" : "them"} to another venue so the address
                      shows on the websites.
                    </p>
                  ) : null}
                  <div className="grid gap-3 md:grid-cols-2">
                    <TextField
                      label="Name"
                      value={venue.name}
                      onChange={(event) =>
                        patch({
                          venues: draft.venues.map((item) =>
                            item.key === venue.key ? { ...item, name: event.target.value } : item,
                          ),
                        })
                      }
                    />
                    <TextField
                      label="City"
                      value={venue.city}
                      onChange={(event) =>
                        patch({
                          venues: draft.venues.map((item) =>
                            item.key === venue.key ? { ...item, city: event.target.value } : item,
                          ),
                        })
                      }
                    />
                    <TextField
                      label="Address"
                      value={venue.address}
                      onChange={(event) =>
                        patch({
                          venues: draft.venues.map((item) =>
                            item.key === venue.key
                              ? { ...item, address: event.target.value }
                              : item,
                          ),
                        })
                      }
                    />
                    <TextField
                      label="Postcode"
                      value={venue.postcode}
                      onChange={(event) =>
                        patch({
                          venues: draft.venues.map((item) =>
                            item.key === venue.key
                              ? { ...item, postcode: event.target.value }
                              : item,
                          ),
                        })
                      }
                    />
                    <TextField
                      label="Parking"
                      value={venue.parkingInfo}
                      onChange={(event) =>
                        patch({
                          venues: draft.venues.map((item) =>
                            item.key === venue.key
                              ? { ...item, parkingInfo: event.target.value }
                              : item,
                          ),
                        })
                      }
                    />
                    <TextField
                      label="Public transport"
                      value={venue.transitInfo}
                      onChange={(event) =>
                        patch({
                          venues: draft.venues.map((item) =>
                            item.key === venue.key
                              ? { ...item, transitInfo: event.target.value }
                              : item,
                          ),
                        })
                      }
                    />
                  </div>
                  <VenueLocation
                    venue={venue}
                    onChange={(next) =>
                      patch({
                        venues: draft.venues.map((item) => (item.key === venue.key ? next : item)),
                      })
                    }
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
                          item.key === venue.key
                            ? { ...item, imageUrl, imageKey: imageKey ?? item.imageKey }
                            : item,
                        ),
                      })
                    }
                  />
                </div>
              );
            })}
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2 className="font-heading text-lg font-semibold">Services</h2>
                <ShowInactiveToggle
                  shown={showInactive.services}
                  count={inactiveServices}
                  onChange={(services) => setShowInactive((current) => ({ ...current, services }))}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => patch({ services: [...draft.services, emptyService()] })}
              >
                Add service
              </Button>
            </div>
            {draft.services.map((service) =>
              !service.active && !showInactive.services ? null : (
                <div
                  key={service.key}
                  className={cn(
                    "grid gap-3 rounded-xl border border-border p-4 transition-opacity md:grid-cols-4",
                    !service.active && "border-dashed bg-muted/30 opacity-75",
                  )}
                >
                  <SelectField
                    label="Day"
                    value={service.day}
                    onChange={(event) =>
                      patch({
                        services: draft.services.map((item) =>
                          item.key === service.key ? { ...item, day: event.target.value } : item,
                        ),
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
                        services: draft.services.map((item) =>
                          item.key === service.key ? { ...item, time: event.target.value } : item,
                        ),
                      })
                    }
                  />
                  <TextField
                    label="Label"
                    value={service.label}
                    onChange={(event) =>
                      patch({
                        services: draft.services.map((item) =>
                          item.key === service.key ? { ...item, label: event.target.value } : item,
                        ),
                      })
                    }
                  />
                  <SelectField
                    label="Venue"
                    value={String(service.venueIndex)}
                    onChange={(event) =>
                      patch({
                        services: draft.services.map((item) =>
                          item.key === service.key
                            ? { ...item, venueIndex: Number(event.target.value) }
                            : item,
                        ),
                      })
                    }
                  >
                    {draft.venues.map((venue, venueIndex) => (
                      <option key={venue.key} value={venueIndex}>
                        {venue.name || `Venue ${venueIndex + 1}`}
                        {venue.active ? "" : " (inactive)"}
                      </option>
                    ))}
                  </SelectField>
                  <div className="flex items-center gap-2 md:col-span-4">
                    {service.id ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => patchService(service.key, { active: !service.active })}
                      >
                        {service.active ? "Deactivate service" : "Reinstate service"}
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          patch({
                            services: draft.services.filter((item) => item.key !== service.key),
                          })
                        }
                      >
                        Remove service
                      </Button>
                    )}
                    {!service.active ? <Badge tone="muted">Inactive</Badge> : null}
                  </div>
                </div>
              ),
            )}
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
            Saving creates this branch&apos;s Cloudflare folder, including for a campus that does
            not have one yet. Images chosen before the first save upload then.
          </p>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save branch"}
            </Button>
            {draft.id && isSuperAdmin ? (
              savedActive ? (
                <Button variant="outline" onClick={() => void onSetActive(false)}>
                  Deactivate branch
                </Button>
              ) : (
                <Button variant="outline" onClick={() => void onSetActive(true)}>
                  Reinstate branch
                </Button>
              )
            ) : null}
          </div>
        </form>
      ) : (
        <div>
          <Toolbar>
            <ActiveFilterTabs value={view} counts={counts} onChange={setView} />
            <SearchInput
              value={query}
              placeholder="Search branches"
              onChange={(event) => setQuery(event.target.value)}
            />
            {rows && !error ? (
              <span className="text-xs text-muted-foreground">
                {visible.length} branch{visible.length === 1 ? "" : "es"}
              </span>
            ) : null}
          </Toolbar>
          {rows === null ? (
            <GridSkeleton />
          ) : error ? (
            <ErrorNotice message={error} onRetry={refresh} />
          ) : visible.length === 0 ? (
            <EmptyState
              icon={Church}
              title={
                !editable.length
                  ? "No branches yet"
                  : query.trim()
                    ? "No matches"
                    : view === "inactive"
                      ? "No inactive branches"
                      : "No active branches"
              }
            >
              {editable.length
                ? query.trim()
                  ? "No branches match that search."
                  : view === "inactive"
                    ? "Deactivated branches show here so you can reinstate them."
                    : "Every branch is deactivated. Open the Inactive tab to reinstate one."
                : isSuperAdmin
                  ? "Add the first campus with New branch."
                  : "No branches are assigned to you yet. Ask a super admin to add one."}
            </EmptyState>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((row) => (
                <li key={row.id}>
                  <button
                    type="button"
                    className={cn(
                      "group flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-left shadow-card transition hover:-translate-y-0.5 hover:border-brand-line hover:shadow-pop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      !isActive(row) &&
                        "opacity-70 grayscale-[35%] hover:opacity-100 hover:grayscale-0",
                    )}
                    onClick={() => void openRow(row)}
                  >
                    <span className="relative block h-28 w-full overflow-hidden border-b border-border bg-gradient-to-br from-brand-soft via-card to-gold-soft">
                      {row.hero_image_url ? (
                        <img
                          src={row.hero_image_url}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <Church className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-brand/40" />
                      )}
                    </span>
                    <span className="flex flex-1 flex-col p-5">
                      <span className="flex items-start justify-between gap-3">
                        <span className="min-w-0">
                          <span className="block truncate font-semibold">{row.name}</span>
                          <span className="block truncate text-sm text-muted-foreground">
                            {row.subtitle || row.slug}
                          </span>
                        </span>
                        <Badge tone={isActive(row) ? "success" : "muted"}>
                          {isActive(row) ? "Active" : "Inactive"}
                        </Badge>
                      </span>
                      <span className="mt-3 space-y-0.5 text-xs text-muted-foreground">
                        {row.pastor_name ? (
                          <span className="block truncate">{row.pastor_name}</span>
                        ) : null}
                        {row.contact_email ? (
                          <span className="block truncate">{row.contact_email}</span>
                        ) : null}
                        {row.contact_phone ? (
                          <span className="block truncate">{row.contact_phone}</span>
                        ) : null}
                      </span>
                      <span className="mt-auto flex items-center gap-3 pt-4 text-xs text-muted-foreground">
                        <span>{countLabel(row.venues ?? [], "venue")}</span>
                        <span aria-hidden>·</span>
                        <span>{countLabel(row.services ?? [], "service")}</span>
                      </span>
                    </span>
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
