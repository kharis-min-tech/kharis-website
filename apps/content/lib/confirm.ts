import { toast } from "sonner";

export function confirmDelete(label: string) {
  return new Promise<boolean>((resolve) => {
    let settled = false;
    const finish = (value: boolean) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    toast(`Delete ${label}?`, {
      duration: 8000,
      action: { label: "Delete", onClick: () => finish(true) },
      cancel: { label: "Cancel", onClick: () => finish(false) },
      onDismiss: () => finish(false),
      onAutoClose: () => finish(false),
    });
  });
}
