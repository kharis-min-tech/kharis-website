"use client";

import { useEffect, useRef } from "react";

export type PolicyPdfDocument = {
  title: string;
  pdfUrl: string;
};

export function PolicyPdfDialog({
  document,
  onClose,
  theme,
}: {
  document: PolicyPdfDocument | null;
  onClose: () => void;
  theme: "main" | "kp2";
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (document && !dialog.open) dialog.showModal();
    if (!document && dialog.open) dialog.close();
  }, [document]);

  return (
    <dialog
      ref={dialogRef}
      id="governance-policy-pdf-dialog"
      className={`policy-pdf-dialog policy-pdf-dialog--${theme}`}
      aria-labelledby="governance-policy-pdf-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
    >
      {document ? (
        <>
          <header className="policy-pdf-dialog__header">
            <h2 id="governance-policy-pdf-title">{document.title}</h2>
            <button type="button" onClick={() => dialogRef.current?.close()}>
              <span aria-hidden="true">×</span>
              <span className="sr-only">Close document</span>
            </button>
          </header>
          <iframe
            className="policy-pdf-dialog__frame"
            src={document.pdfUrl}
            title={`${document.title} PDF`}
            loading="eager"
          />
        </>
      ) : null}
    </dialog>
  );
}
