import { toast } from "sonner";

/** Asks in a toast. Resolves true only when the action button is pressed. */
export function confirmAction(question: string, actionLabel: string) {
  return new Promise<boolean>((resolve) => {
    let settled = false;
    const finish = (value: boolean) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    toast(question, {
      duration: 8000,
      action: { label: actionLabel, onClick: () => finish(true) },
      cancel: { label: "Cancel", onClick: () => finish(false) },
      onDismiss: () => finish(false),
      onAutoClose: () => finish(false),
    });
  });
}

export function confirmDelete(label: string) {
  return confirmAction(`Delete ${label}?`, "Delete");
}
