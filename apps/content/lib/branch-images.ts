import { MAX_BRANCH_IMAGE_BYTES, type BranchImageCategory } from "@/lib/branch-image-paths";
import { getSupabase } from "@/lib/supabase";

export type BranchUploadResult = {
  key: string;
  publicUrl: string;
};

async function studioToken() {
  const { data } = await getSupabase().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Sign in again to upload images.");
  return token;
}

function postFile(
  token: string,
  fields: { branchId: string; category: BranchImageCategory; file: File },
  onProgress?: (percent: number) => void,
) {
  return new Promise<BranchUploadResult>((resolve, reject) => {
    const form = new FormData();
    form.set("branchId", fields.branchId);
    form.set("category", fields.category);
    form.set("file", fields.file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/uploads/branch");
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
    };
    xhr.onload = () => {
      const body = parseJson(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300 && body?.key && body.publicUrl) {
        resolve({ key: body.key, publicUrl: body.publicUrl });
        return;
      }
      reject(new Error(body?.error || "The image could not be stored. Try again."));
    };
    xhr.onerror = () => reject(new Error("The image could not be stored. Try again."));
    xhr.send(form);
  });
}

function parseJson(value: string) {
  try {
    return JSON.parse(value) as { error?: string; key?: string; publicUrl?: string };
  } catch {
    return null;
  }
}

/** Makes branch-images/{id}/ exist. Existing branches get one the next time they are saved. */
export async function ensureBranchImageFolder(branchId: string) {
  const body = await storageRequest({ branchId, ensureFolder: true });
  if (!body?.key) throw new Error(body?.error || "The Cloudflare folder could not be created.");
  return body.key;
}

/** Deletes Cloudflare files for this branch that are no longer on the saved page. */
export async function pruneBranchImageFolder(branchId: string) {
  await storageRequest({ branchId, prune: true });
}

/** Deletes the whole Cloudflare folder when a branch is removed. */
export async function deleteBranchImageFolder(branchId: string) {
  await storageRequest({ branchId, deleteFolder: true });
}

async function storageRequest(body: Record<string, unknown>) {
  const token = await studioToken();
  const response = await fetch("/api/uploads/branch", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const payload = (await response.json().catch(() => null)) as { error?: string; key?: string } | null;
  if (!response.ok) {
    throw new Error(payload?.error || "Image storage could not be updated.");
  }
  return payload;
}

export async function uploadBranchImage({
  branchId,
  category,
  file,
  onProgress,
}: {
  branchId: string;
  category: BranchImageCategory;
  file: File;
  onProgress?: (percent: number) => void;
}): Promise<BranchUploadResult> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > MAX_BRANCH_IMAGE_BYTES) throw new Error("Images need to be 8MB or smaller.");
  const token = await studioToken();
  return postFile(token, { branchId, category, file }, onProgress);
}
