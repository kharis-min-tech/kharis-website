import { MAX_BRANCH_IMAGE_BYTES, type BranchImageCategory } from "@/lib/branch-image-paths";
import { getSupabase } from "@/lib/supabase";

export type BranchUploadResult = {
  key: string;
  publicUrl: string;
};

function putWithProgress(url: string, file: File, contentType: string, onProgress?: (percent: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error("The image could not be stored. Try again."));
    };
    xhr.onerror = () => {
      reject(new Error("The image could not be stored. Check that the bucket allows uploads from this site."));
    };
    xhr.send(file);
  });
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

  const { data } = await getSupabase().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Sign in again to upload images.");

  const response = await fetch("/api/uploads/branch", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      branchId,
      category,
      contentType: file.type,
      fileSize: file.size,
    }),
  });

  const body = (await response.json().catch(() => null)) as { error?: string; uploadUrl?: string; key?: string; publicUrl?: string } | null;
  if (!response.ok || !body?.uploadUrl || !body.key || !body.publicUrl) {
    throw new Error(body?.error || "Could not start the upload.");
  }

  await putWithProgress(body.uploadUrl, file, file.type, onProgress);
  return { key: body.key, publicUrl: body.publicUrl };
}
