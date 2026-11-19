"use client";

import { ArrowLeft, ArrowRight, Check, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DocumentsPageMap } from "@/components/studio/documents-page-map";
import { AreaField, TextField } from "@/components/studio/fields";
import { PdfDrop } from "@/components/studio/image-drop";
import { IconTile } from "@/components/studio/blocks";
import { PageHeader } from "@/components/studio/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DOCUMENT_STEPS, type DocumentStep } from "@/lib/document-checks";
import {
  FASTING_IDS,
  POLICY_IDS,
  getSiteDocuments,
  saveSiteDocuments,
  type DocumentSlot,
  type FastingId,
  type PolicyId,
  type SiteDocuments,
} from "@/lib/site-documents";
import { cn } from "@/lib/utils";

function SlotFields({
  slot,
  onChange,
  subfolder,
}: {
  slot: DocumentSlot;
  onChange: (next: DocumentSlot) => void;
  subfolder: string;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-background p-4">
      <TextField
        label="Title"
        value={slot.title}
        onChange={(event) => onChange({ ...slot, title: event.target.value })}
      />
      <AreaField
        label="Short description"
        value={slot.blurb}
        onChange={(event) => onChange({ ...slot, blurb: event.target.value })}
      />
      <PdfDrop
        label="PDF file"
        value={slot.url}
        subfolder={subfolder}
        onChange={(url) =>
          onChange({
            ...slot,
            url,
            updatedAt: url ? new Date().toISOString() : "",
          })
        }
      />
    </div>
  );
}

export function DocumentsEditor() {
  const [documents, setDocuments] = useState<SiteDocuments | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState<DocumentStep>("governance");
  const stepIndex = DOCUMENT_STEPS.findIndex((item) => item.id === step);

  useEffect(() => {
    getSiteDocuments()
      .then(setDocuments)
      .catch((caught) =>
        setError(caught instanceof Error ? caught.message : "Could not load documents."),
      );
  }, []);

  function patchPolicy(id: PolicyId, slot: DocumentSlot) {
    setDocuments((current) =>
      current ? { ...current, policies: { ...current.policies, [id]: slot } } : current,
    );
  }

  function patchFasting(id: FastingId, slot: DocumentSlot) {
    setDocuments((current) =>
      current ? { ...current, fasting: { ...current.fasting, [id]: slot } } : current,
    );
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    if (!documents) return;
    setSaving(true);
    try {
      const saved = await saveSiteDocuments(documents);
      setDocuments(saved);
      toast.success("Documents saved");
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not save documents.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Documents"
        description="Upload governance and fasting PDFs. Public sites show a download when a file is set; cookies keep the HTML page when empty."
        icon={<IconTile icon={FileText} className="h-12 w-12 rounded-2xl" />}
      />
      {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}
      {!documents && !error ? <Skeleton className="h-64" /> : null}
      {documents ? (
        <form onSubmit={onSave}>
          <ol className="mb-6 grid gap-2 sm:grid-cols-2" aria-label="Steps">
            {DOCUMENT_STEPS.map((item, index) => {
              const current = item.id === step;
              const filled =
                item.id === "governance"
                  ? POLICY_IDS.some((id) => documents.policies[id].url)
                  : FASTING_IDS.some((id) => documents.fasting[id].url);
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
                        filled
                          ? "bg-success-soft text-success ring-1 ring-inset ring-success-line"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {filled ? <Check className="h-3.5 w-3.5" /> : index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{item.label}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {item.hint}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
              <header className="mb-5">
                <p className="studio-eyebrow">
                  Step {stepIndex + 1} of {DOCUMENT_STEPS.length}
                </p>
                <h2 className="font-heading text-xl font-semibold">
                  {DOCUMENT_STEPS[stepIndex]?.label}
                </h2>
                <p className="text-sm text-muted-foreground">{DOCUMENT_STEPS[stepIndex]?.hint}</p>
              </header>

              <section hidden={step !== "governance"} className="space-y-4">
                {POLICY_IDS.map((id) => (
                  <div key={id}>
                    <p className="mb-2 text-sm font-semibold capitalize">{id}</p>
                    <SlotFields
                      slot={documents.policies[id]}
                      subfolder={`policies/${id}`}
                      onChange={(slot) => patchPolicy(id, slot)}
                    />
                    {id === "cookies" ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Without a PDF, the Cookie Policy card keeps linking to the /cookies HTML
                        page.
                      </p>
                    ) : null}
                  </div>
                ))}
              </section>

              <section hidden={step !== "fasting"} className="space-y-4">
                {FASTING_IDS.map((id) => (
                  <div key={id}>
                    <p className="mb-2 text-sm font-semibold capitalize">{id}</p>
                    <SlotFields
                      slot={documents.fasting[id]}
                      subfolder={`fasting/${id}`}
                      onChange={(slot) => patchFasting(id, slot)}
                    />
                  </div>
                ))}
              </section>

              <footer className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={stepIndex === 0}
                    onClick={() => setStep(DOCUMENT_STEPS[stepIndex - 1]!.id)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  {stepIndex < DOCUMENT_STEPS.length - 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setStep(DOCUMENT_STEPS[stepIndex + 1]!.id)}
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
                <Button type="submit" size="sm" className="shrink-0" disabled={saving}>
                  {saving ? "Saving…" : "Save documents"}
                </Button>
              </footer>
            </div>

            <aside className="lg:sticky lg:top-6 lg:self-start">
              <DocumentsPageMap documents={documents} step={step} onStep={setStep} />
            </aside>
          </div>
        </form>
      ) : null}
    </div>
  );
}
