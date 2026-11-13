"use client";

import { ArrowLeft, ArrowRight, Check, Church, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ShowInactiveToggle } from "@/components/studio/active-filter";
import { IconTile } from "@/components/studio/blocks";
import { BranchList } from "@/components/studio/branch-list";
import { BranchPageMap, type DraftPreviews } from "@/components/studio/branch-page-map";
import { AreaField, SelectField, TextField, ToggleField } from "@/components/studio/fields";
import { ImageDrop, MultiImageDrop, VideoDrop } from "@/components/studio/image-drop";
import { PageHeader } from "@/components/studio/page-header";
import { VenueLocation } from "@/components/studio/venue-location";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { isActive } from "@/lib/active-filter";
import { BRANCH_STEPS, checkBranch, issuesFor, type BranchStep } from "@/lib/branch-checks";
import {
  branchFamily,
  branchPagePath,
  defaultFamily,
  FAMILY_LABEL,
  type BranchFamily,
} from "@/lib/branch-family";
import {
  ensureBranchImageFolder,
  pruneBranchImageFolder,
  uploadBranchImage,
} from "@/lib/branch-images";
import { branchTemplate } from "@/lib/branch-template";
import {
  emptyService,
  emptyVenue,
  pastorPreview,
  type BranchDraft,
  type BranchRow,
} from "@/lib/branch-types";
import {
  DEFAULT_COUNTRY,
  emptyBranch,
  listBranches,
  loadBranchDraft,
  saveBranch,
  saveBranchImageUrl,
  setBranchActive,
  venueHasContent,
} from "@/lib/branches-repo";
import { confirmAction } from "@/lib/confirm";
import { syncBranchVideo, syncGallery, syncVenueImages } from "@/lib/media-repo";
import { useStudioRole } from "@/lib/studio-role";
import { cn, slugify } from "@/lib/utils";
import { useWorkspaceId } from "@/lib/workspace-context";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const FAMILY_HINT: Record<BranchFamily, string> = {
  kharis: "Listed on kharis.org/locations with the other Kharis Church branches.",
  kp2: "Listed on the KP2 site at kharis.org/kp2, and in the KP2 group on kharis.org.",
};

const NO_PREVIEWS: DraftPreviews = { galleryQueued: 0 };

function freePreviews(previews: DraftPreviews) {
  if (previews.hero) URL.revokeObjectURL(previews.hero);
  if (previews.pastor) URL.revokeObjectURL(previews.pastor);
}

export function BranchEditor() {
  const { isSuperAdmin, canEditBranch } = useStudioRole();
  const workspace = useWorkspaceId();
  const [rows, setRows] = useState<BranchRow[] | null>(null);
  const [error, setError] = useState("");
  const [showInactive, setShowInactive] = useState({ venues: false, services: false });
  const [draft, setDraft] = useState<BranchDraft | null>(null);
  const [baseline, setBaseline] = useState("");
  const [step, setStep] = useState<BranchStep>("basics");
  const [session, setSession] = useState(0);
  const [triedSave, setTriedSave] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [originalIds, setOriginalIds] = useState<{ venues: string[]; services: string[] }>({
    venues: [],
    services: [],
  });
  const [pendingOwner] = useState(() => crypto.randomUUID());
  const [previews, setPreviews] = useState<DraftPreviews>(NO_PREVIEWS);
  const [queuedVenuePhotos, setQueuedVenuePhotos] = useState(0);
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
    setPreviews((current) => {
      freePreviews(current);
      return NO_PREVIEWS;
    });
    setQueuedVenuePhotos(0);
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
    () => (rows === null ? null : rows.filter((row) => canEditBranch(row.id))),
    [rows, canEditBranch],
  );

  const countries = useMemo(
    () =>
      [
        ...new Set([DEFAULT_COUNTRY, ...(rows ?? []).map((row) => row.subtitle?.trim() ?? "")]),
      ].filter(Boolean),
    [rows],
  );

  const issues = useMemo(() => {
    if (!draft) return [];
    return checkBranch(draft, {
      otherSlugs: (rows ?? []).filter((row) => row.id !== draft.id).map((row) => row.slug),
      queued: {
        hero: Boolean(previews.hero),
        pastor: Boolean(previews.pastor),
        gallery: previews.galleryQueued,
      },
    });
  }, [draft, rows, previews]);
  const errors = issues.filter((issue) => issue.level === "error");

  const dirty = Boolean(
    draft &&
    (JSON.stringify(draft) !== baseline ||
      previews.hero ||
      previews.pastor ||
      previews.galleryQueued ||
      queuedVenuePhotos),
  );

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function startEditing(next: BranchDraft, ids: typeof originalIds, existing: boolean) {
    clearPendingImages();
    setShowInactive({ venues: false, services: false });
    setDraft(next);
    setBaseline(JSON.stringify(next));
    setStep("basics");
    setTriedSave(false);
    setSlugTouched(existing);
    setOriginalIds(ids);
    setSession((current) => current + 1);
  }

  async function openRow(row: BranchRow) {
    try {
      const next = await loadBranchDraft(row);
      startEditing(
        next,
        {
          venues: (row.venues ?? []).map((venue) => venue.id),
          services: (row.services ?? []).map((service) => service.id),
        },
        true,
      );
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not open this branch.");
    }
  }

  function openNew() {
    startEditing(emptyBranch(defaultFamily(workspace)), { venues: [], services: [] }, false);
  }

  async function closeEditor() {
    if (dirty) {
      const leave = await confirmAction(
        `Leave without saving? Your changes to ${draft?.name.trim() || "this branch"} will be lost.`,
        "Leave",
      );
      if (!leave) return;
    }
    clearPendingImages();
    setDraft(null);
  }

  function patch(partial: Partial<BranchDraft>) {
    setDraft((current) => (current ? { ...current, ...partial } : current));
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

  function queuePreview(kind: "hero" | "pastor", file: File) {
    pendingImages.current[kind] = file;
    setPreviews((current) => {
      const old = current[kind];
      if (old) URL.revokeObjectURL(old);
      return { ...current, [kind]: URL.createObjectURL(file) };
    });
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    if (!draft) return;
    if (errors.length) {
      setTriedSave(true);
      setStep(errors[0]!.step);
      toast.error(
        errors.length === 1
          ? errors[0]!.message
          : `Fix ${errors.length} things before saving. They are listed in red.`,
      );
      return;
    }
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
      clearPendingImages();
      setDraft(null);
      refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not update the branch");
    }
  }

  const savedRow = draft?.id ? rows?.find((row) => row.id === draft.id) : undefined;
  const savedActive = savedRow ? isActive(savedRow) : true;
  const inactiveVenues = draft ? draft.venues.filter((venue) => !venue.active).length : 0;
  const inactiveServices = draft ? draft.services.filter((service) => !service.active).length : 0;
  const stepIndex = BRANCH_STEPS.findIndex((item) => item.id === step);
  const liveUrl =
    savedRow && savedActive
      ? `https://${branchPagePath(branchFamily(savedRow), savedRow.slug)}`
      : undefined;

  function stepErrors(id: BranchStep) {
    if (!triedSave) return null;
    const list = issuesFor(errors, id);
    if (!list.length) return null;
    return (
      <ul className="space-y-1 rounded-lg border border-danger-line bg-danger-soft px-4 py-3 text-sm text-danger">
        {list.map((issue) => (
          <li key={issue.message}>{issue.message}</li>
        ))}
      </ul>
    );
  }

  return (
    <div>
      <PageHeader
        icon={<IconTile icon={Church} className="h-12 w-12 rounded-2xl" />}
        title={draft ? draft.name.trim() || "New branch" : "Branches"}
        description={
          draft
            ? draft.id
              ? `${FAMILY_LABEL[draft.family]} branch. Work through the steps, then save. Nothing changes on the websites until you save.`
              : "Work through the steps, then save. Nothing is public until you save."
            : "Campuses, venues, service times, and gallery photos. Pick a branch to edit it step by step."
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

      <div hidden={Boolean(draft)}>
        <BranchList
          rows={editable}
          error={error}
          isSuperAdmin={isSuperAdmin}
          onRetry={refresh}
          onOpen={(row) => void openRow(row)}
        />
      </div>

      {draft ? (
        <form
          key={session}
          onSubmit={onSave}
          onKeyDown={(event) => {
            const target = event.target as HTMLElement;
            if (event.key === "Enter" && target.tagName === "INPUT") event.preventDefault();
          }}
        >
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => void closeEditor()}>
              <ArrowLeft className="h-4 w-4" />
              All branches
            </Button>
            {!draft.id ? (
              <Button
                variant="ghost"
                onClick={() => setDraft((current) => (current ? branchTemplate(current) : current))}
              >
                Fill with sample text
              </Button>
            ) : null}
            <span className="ml-auto flex items-center gap-2">
              <Badge tone={draft.family === "kp2" ? "default" : "muted"}>
                {FAMILY_LABEL[draft.family]}
              </Badge>
              {draft.id ? (
                <Badge tone={savedActive ? "success" : "muted"}>
                  {savedActive ? "Active" : "Inactive"}
                </Badge>
              ) : null}
              {draft.id && isSuperAdmin ? (
                <Button variant="ghost" size="sm" onClick={() => void onSetActive(!savedActive)}>
                  {savedActive ? "Deactivate branch" : "Reinstate branch"}
                </Button>
              ) : null}
            </span>
          </div>

          <ol className="mb-6 grid gap-2 sm:grid-cols-5" aria-label="Steps">
            {BRANCH_STEPS.map((item, index) => {
              const stepIssues = issuesFor(issues, item.id);
              const hasError = stepIssues.some((issue) => issue.level === "error");
              const current = item.id === step;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-current={current ? "step" : undefined}
                    onClick={() => setStep(item.id)}
                    className={cn(
                      "flex h-full w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition",
                      current
                        ? "border-brand-line bg-brand-soft shadow-card"
                        : "border-border bg-card hover:border-brand-line",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                        hasError && (triedSave || current)
                          ? "bg-danger text-white"
                          : stepIssues.length
                            ? "bg-gold-soft text-gold ring-1 ring-inset ring-gold-line"
                            : "bg-success-soft text-success ring-1 ring-inset ring-success-line",
                      )}
                    >
                      {stepIssues.length ? index + 1 : <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{item.label}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {stepIssues.length
                          ? `${stepIssues.length} to check`
                          : current
                            ? "Looks good"
                            : "Done"}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
              <header className="mb-5">
                <p className="studio-eyebrow">
                  Step {stepIndex + 1} of {BRANCH_STEPS.length}
                </p>
                <h2 className="font-heading text-xl font-semibold">
                  {BRANCH_STEPS[stepIndex]?.label}
                </h2>
                <p className="text-sm text-muted-foreground">{BRANCH_STEPS[stepIndex]?.hint}</p>
              </header>

              <section hidden={step !== "basics"} className="space-y-5">
                {stepErrors("basics")}
                <fieldset>
                  <legend className="mb-1.5 text-sm font-medium">
                    Which site is this branch on?
                  </legend>
                  {isSuperAdmin ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {(["kharis", "kp2"] as const).map((family) => (
                        <label
                          key={family}
                          className={cn(
                            "flex cursor-pointer gap-3 rounded-lg border p-3 text-sm transition",
                            draft.family === family
                              ? "border-brand-line bg-brand-soft ring-1 ring-brand-line"
                              : "border-border hover:border-brand-line",
                          )}
                        >
                          <input
                            type="radio"
                            name="family"
                            value={family}
                            checked={draft.family === family}
                            onChange={() => patch({ family })}
                            className="mt-0.5 h-4 w-4 accent-[var(--primary)]"
                          />
                          <span>
                            <span className="block font-semibold">
                              {family === "kp2" ? "KP2 (Kharis Phase 2)" : "Kharis Church"}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {FAMILY_HINT[family]}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
                      <span className="font-semibold">{FAMILY_LABEL[draft.family]}.</span>{" "}
                      {FAMILY_HINT[draft.family]} Ask a super admin if this is wrong.
                    </p>
                  )}
                </fieldset>
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    label="Branch name"
                    name="name"
                    placeholder={draft.family === "kp2" ? "e.g. KP2 London" : "e.g. London"}
                    value={draft.name}
                    onChange={(event) => {
                      const name = event.target.value;
                      patch({ name, slug: slugTouched ? draft.slug : slugify(name) });
                    }}
                  />
                  <div>
                    <TextField
                      label="Country"
                      name="country"
                      list="branch-countries"
                      value={draft.country}
                      onChange={(event) => patch({ country: event.target.value })}
                    />
                    <datalist id="branch-countries">
                      {countries.map((country) => (
                        <option key={country} value={country} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div>
                  <Label htmlFor="slug">Web address</Label>
                  <div className="flex items-stretch overflow-hidden rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                    <span className="flex items-center border-r border-input bg-muted/50 px-3 text-sm text-muted-foreground">
                      {branchPagePath(draft.family, "").replace(/…$/, "")}
                    </span>
                    <Input
                      id="slug"
                      name="slug"
                      className="border-0 shadow-none focus-visible:ring-0"
                      value={draft.slug}
                      onChange={(event) => {
                        setSlugTouched(true);
                        patch({ slug: slugify(event.target.value) });
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {savedRow && draft.slug !== savedRow.slug
                      ? "Changing the address breaks links people have already shared or saved."
                      : slugTouched
                        ? "Lowercase letters, numbers and dashes."
                        : "Filled in from the branch name."}
                  </p>
                </div>
                <AreaField
                  label="Short description"
                  name="shortDescription"
                  rows={2}
                  placeholder="One or two sentences for branch cards and search results."
                  value={draft.shortDescription}
                  onChange={(event) => patch({ shortDescription: event.target.value })}
                />
                <AreaField
                  label="Welcome text (optional)"
                  name="description"
                  placeholder="A longer welcome shown near the top of the branch page."
                  value={draft.description}
                  onChange={(event) => patch({ description: event.target.value })}
                />
                {!draft.id ? (
                  <ToggleField
                    label="Show on the websites as soon as it is saved"
                    checked={draft.published}
                    onChange={(published) => patch({ published })}
                  />
                ) : null}
                <details className="rounded-lg border border-border px-4 py-3 text-sm">
                  <summary className="cursor-pointer font-medium">Advanced</summary>
                  <div className="mt-3 max-w-xs">
                    <TextField
                      label="List position"
                      name="sortOrder"
                      type="number"
                      step={1}
                      value={draft.sortOrder}
                      onChange={(event) => patch({ sortOrder: event.target.value })}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Lower numbers appear first in branch lists.
                    </p>
                  </div>
                </details>
              </section>

              <section hidden={step !== "pastor"} className="space-y-4">
                {stepErrors("pastor")}
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    label="Name"
                    name="pastorName"
                    placeholder="Leave empty to show “Coming soon”"
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
                {draft.pastorName.trim() ? (
                  <p className="text-sm text-muted-foreground">
                    Shown on the site as {pastorPreview(draft.pastorName, draft.pastorRole)}.
                  </p>
                ) : null}
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
                  onQueue={(file) => queuePreview("pastor", file)}
                />
              </section>

              <section hidden={step !== "visit"} className="space-y-6">
                {stepErrors("visit")}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-heading text-base font-semibold">Venues</h3>
                        <ShowInactiveToggle
                          shown={showInactive.venues}
                          count={inactiveVenues}
                          onChange={(venues) =>
                            setShowInactive((current) => ({ ...current, venues }))
                          }
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        The address, map and travel tips people see. The first venue is the main
                        one.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => patch({ venues: [...draft.venues, emptyVenue()] })}
                    >
                      <Plus className="h-4 w-4" />
                      Add venue
                    </Button>
                  </div>
                  {draft.venues.map((venue, index) => {
                    const usedBy = draft.services.filter(
                      (service) => service.active && service.venueIndex === index,
                    ).length;
                    return (
                      <div
                        key={venue.key}
                        hidden={!venue.active && !showInactive.venues}
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
                            {index === 0 ? <Badge tone="muted">Main</Badge> : null}
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
                          ) : draft.venues.length > 1 ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                patch({
                                  venues: draft.venues.filter((item) => item.key !== venue.key),
                                })
                              }
                            >
                              Remove
                            </Button>
                          ) : null}
                        </div>
                        {!venue.active && usedBy ? (
                          <p className="text-xs text-muted-foreground">
                            {usedBy} active service{usedBy === 1 ? " still uses" : "s still use"}{" "}
                            this venue. Move {usedBy === 1 ? "it" : "them"} to another venue so the
                            address shows on the websites.
                          </p>
                        ) : null}
                        <div className="grid gap-3 md:grid-cols-2">
                          <TextField
                            label="Venue name"
                            placeholder="e.g. Barking Community Hall"
                            value={venue.name}
                            onChange={(event) =>
                              patchVenue(venue.key, { name: event.target.value })
                            }
                          />
                          <TextField
                            label="Town or city"
                            value={venue.city}
                            onChange={(event) =>
                              patchVenue(venue.key, { city: event.target.value })
                            }
                          />
                          <TextField
                            label="Street address"
                            value={venue.address}
                            onChange={(event) =>
                              patchVenue(venue.key, { address: event.target.value })
                            }
                          />
                          <TextField
                            label="Postcode"
                            value={venue.postcode}
                            onChange={(event) =>
                              patchVenue(venue.key, { postcode: event.target.value })
                            }
                          />
                          <TextField
                            label="Parking (optional)"
                            value={venue.parkingInfo}
                            onChange={(event) =>
                              patchVenue(venue.key, { parkingInfo: event.target.value })
                            }
                          />
                          <TextField
                            label="Public transport (optional)"
                            value={venue.transitInfo}
                            onChange={(event) =>
                              patchVenue(venue.key, { transitInfo: event.target.value })
                            }
                          />
                        </div>
                        <VenueLocation
                          venue={venue}
                          onChange={(next) =>
                            setDraft((current) =>
                              current
                                ? {
                                    ...current,
                                    venues: current.venues.map((item) =>
                                      item.key === venue.key ? next : item,
                                    ),
                                  }
                                : current,
                            )
                          }
                        />
                        <ImageDrop
                          label="Venue photo (optional)"
                          value={venue.imageUrl}
                          branch={{ id: draft.id ?? null, category: "venue" }}
                          onQueue={(file) => {
                            if (!pendingImages.current.venues[venue.key]) {
                              setQueuedVenuePhotos((count) => count + 1);
                            }
                            pendingImages.current.venues[venue.key] = file;
                          }}
                          onChange={(imageUrl, imageKey) =>
                            patchVenue(venue.key, {
                              imageUrl,
                              imageKey: imageKey ?? venue.imageKey,
                            })
                          }
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-heading text-base font-semibold">Service times</h3>
                        <ShowInactiveToggle
                          shown={showInactive.services}
                          count={inactiveServices}
                          onChange={(services) =>
                            setShowInactive((current) => ({ ...current, services }))
                          }
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Sunday services fill “Join us this Sunday”. Other days show as midweek.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => patch({ services: [...draft.services, emptyService()] })}
                    >
                      <Plus className="h-4 w-4" />
                      Add service
                    </Button>
                  </div>
                  {draft.services.map((service) => (
                    <div
                      key={service.key}
                      hidden={!service.active && !showInactive.services}
                      className={cn(
                        "grid gap-3 rounded-xl border border-border p-4 transition-opacity md:grid-cols-4",
                        !service.active && "border-dashed bg-muted/30 opacity-75",
                      )}
                    >
                      <SelectField
                        label="Day"
                        value={service.day}
                        onChange={(event) => patchService(service.key, { day: event.target.value })}
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
                          patchService(service.key, { time: event.target.value })
                        }
                      />
                      <TextField
                        label="Name (optional)"
                        placeholder="e.g. Sunday Service"
                        value={service.label}
                        onChange={(event) =>
                          patchService(service.key, { label: event.target.value })
                        }
                      />
                      <SelectField
                        label="Venue"
                        value={String(service.venueIndex)}
                        onChange={(event) =>
                          patchService(service.key, { venueIndex: Number(event.target.value) })
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
                  ))}
                </div>
              </section>

              <section hidden={step !== "media"} className="space-y-6">
                {stepErrors("media")}
                <ImageDrop
                  label="Main photo (top of the branch page and branch cards)"
                  value={draft.heroImage}
                  branch={{ id: draft.id ?? null, category: "hero" }}
                  onChange={(heroImage) => patch({ heroImage })}
                  onQueue={(file) => queuePreview("hero", file)}
                />
                <div className="space-y-1.5">
                  <VideoDrop
                    label="Branch video (optional)"
                    value={draft.videoUrl}
                    folder="branch-videos"
                    mediaBranchId={draft.id ?? null}
                    onChange={(videoUrl) => patch({ videoUrl })}
                  />
                  <p className="text-xs text-muted-foreground">
                    An .mp4 or .mov file for the &ldquo;A look at …&rdquo; section. Without one, the
                    main photo is shown there.
                  </p>
                </div>
                <MultiImageDrop
                  branchId={draft.id ?? null}
                  items={draft.gallery}
                  onChange={(gallery) => patch({ gallery })}
                  onQueueFiles={(files) => {
                    pendingImages.current.gallery.push(...files);
                    setPreviews((current) => ({
                      ...current,
                      galleryQueued: current.galleryQueued + files.length,
                    }));
                  }}
                />
                {!draft.id ? (
                  <p className="text-xs text-muted-foreground">
                    Photos picked now upload to the branch&apos;s Cloudflare folder when you save.
                  </p>
                ) : null}
              </section>

              <section hidden={step !== "contact"} className="space-y-4">
                {stepErrors("contact")}
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="e.g. london@kharis.org"
                    value={draft.email}
                    onChange={(event) => patch({ email: event.target.value })}
                  />
                  <TextField
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={draft.phone}
                    onChange={(event) => patch({ phone: event.target.value })}
                  />
                  <TextField
                    label="Instagram"
                    name="instagram"
                    placeholder="@kharischurch or an instagram.com link"
                    value={draft.instagram}
                    onChange={(event) => patch({ instagram: event.target.value })}
                  />
                  <TextField
                    label="Giving link (optional)"
                    name="givingLink"
                    type="url"
                    placeholder="https://"
                    value={draft.givingLink}
                    onChange={(event) => patch({ givingLink: event.target.value })}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Messages from the branch contact form go to the studio inbox. Without a giving
                  link, the Give button opens the main giving page.
                </p>
              </section>

              <footer className="mt-8 flex flex-wrap items-center gap-2 border-t border-border pt-5">
                <Button
                  variant="outline"
                  disabled={stepIndex === 0}
                  onClick={() => setStep(BRANCH_STEPS[stepIndex - 1]!.id)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                {stepIndex < BRANCH_STEPS.length - 1 ? (
                  <Button
                    variant="outline"
                    onClick={() => setStep(BRANCH_STEPS[stepIndex + 1]!.id)}
                  >
                    Next: {BRANCH_STEPS[stepIndex + 1]!.label}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : null}
                <span className="ml-auto flex items-center gap-3">
                  {dirty ? (
                    <span className="text-xs text-muted-foreground">Unsaved changes</span>
                  ) : null}
                  <Button type="submit" disabled={saving || (!dirty && Boolean(draft.id))}>
                    {saving ? "Saving…" : draft.id ? "Save changes" : "Save branch"}
                  </Button>
                </span>
              </footer>
            </div>

            <aside className="lg:sticky lg:top-6 lg:self-start">
              <BranchPageMap
                draft={draft}
                step={step}
                issues={issues}
                previews={previews}
                liveUrl={liveUrl}
                onStep={setStep}
              />
            </aside>
          </div>
        </form>
      ) : null}
    </div>
  );
}
