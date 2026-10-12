import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { publicUrlForKey } from "@/lib/branch-image-paths";

function required(name: string) {
  const value = process.env[name]?.trim();
  return value || null;
}

export function r2Config() {
  const accountId = required("R2_ACCOUNT_ID");
  const accessKeyId = required("R2_ACCESS_KEY_ID");
  const secretAccessKey = required("R2_SECRET_ACCESS_KEY");
  const bucket = required("R2_BUCKET_NAME");
  const publicBase = required("R2_PUBLIC_URL");
  const endpoint =
    required("R2_ENDPOINT") ?? (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : null);
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBase || !endpoint) return null;
  return { accountId, accessKeyId, secretAccessKey, bucket, publicBase, endpoint };
}

function clientFor(config: NonNullable<ReturnType<typeof r2Config>>) {
  return new S3Client({
    region: "auto",
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    // R2 rejects the default flexible checksum headers on a browser PUT.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
}

export async function presignBranchUpload(key: string, contentType: string, fileSize: number) {
  const config = r2Config();
  if (!config) return null;
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: contentType,
    ContentLength: fileSize,
  });
  const uploadUrl = await getSignedUrl(clientFor(config), command, { expiresIn: 300 });
  return {
    uploadUrl,
    key,
    publicUrl: publicUrlForKey(config.publicBase, key),
  };
}
