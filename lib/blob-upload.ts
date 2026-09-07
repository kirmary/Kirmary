import { createHmac, timingSafeEqual } from "node:crypto";
import path from "node:path";
import { head, del } from "@vercel/blob";
import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";
import {
  MAX_UPLOAD_BYTES,
  uploadFilename,
  validateUploadMetadata,
  validateUploadSignature,
  type UploadFolder,
} from "./local-upload";

type UploadTicket = {
  pathname: string;
  name: string;
  type: string;
  size: number;
  expires: number;
};
function secret() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error("Vercel Blob is not configured.");
  return token;
}
function signature(payload: string) {
  return createHmac("sha256", secret())
    .update(`admin-upload:${payload}`)
    .digest("hex");
}
export function readUploadTicket(ticket: string): UploadTicket {
  const [payload, mac, ...rest] = ticket.split(".");
  if (
    !payload ||
    !mac ||
    rest.length ||
    mac.length !== 64 ||
    !timingSafeEqual(Buffer.from(mac), Buffer.from(signature(payload)))
  )
    throw new Error("Invalid upload ticket.");
  const value = JSON.parse(
    Buffer.from(payload, "base64url").toString(),
  ) as UploadTicket;
  if (value.expires < Date.now())
    throw new Error("Upload expired. Please upload the file again.");
  return value;
}
export async function prepareBlobUpload(
  file: { name: string; type: string; size: number },
  folder: UploadFolder,
  slug: string,
) {
  const ext = validateUploadMetadata(file, folder, slug);
  const pathname = `${folder}/${slug}/${uploadFilename(file.name, ext)}`;
  const expires = Date.now() + 15 * 60 * 1000;
  const payload = Buffer.from(
    JSON.stringify({
      pathname,
      name: path.basename(file.name),
      type: file.type,
      size: file.size,
      expires,
    } satisfies UploadTicket),
  ).toString("base64url");
  const clientToken = await generateClientTokenFromReadWriteToken({
    token: secret(),
    pathname,
    allowedContentTypes: [file.type],
    maximumSizeInBytes: file.size,
    validUntil: expires,
    addRandomSuffix: false,
    allowOverwrite: false,
  });
  return {
    storage: "blob",
    pathname,
    clientToken,
    ticket: `${payload}.${signature(payload)}`,
  };
}
export async function completeBlobUpload(ticket: string) {
  const upload = readUploadTicket(ticket);
  // Resolve through this store's API, never a client-supplied URL (no SSRF).
  const blob = await head(upload.pathname, { token: secret() });
  if (blob.pathname !== upload.pathname)
    throw new Error("Upload path mismatch.");
  if (
    blob.size !== upload.size ||
    blob.size > MAX_UPLOAD_BYTES ||
    blob.contentType !== upload.type
  )
    throw new Error("Uploaded file metadata does not match.");
  const response = await fetch(blob.url, {
    headers: { Range: "bytes=0-31" },
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok || !response.body)
    throw new Error("Unable to verify the uploaded file. Please retry.");
  const reader = response.body.getReader();
  let prefix = Buffer.alloc(0);
  try {
    while (prefix.length < 32) {
      const chunk = await reader.read();
      if (chunk.done) break;
      prefix = Buffer.concat([
        prefix,
        Buffer.from(chunk.value).subarray(0, 32 - prefix.length),
      ]);
    }
  } finally {
    await reader.cancel();
  }
  try {
    validateUploadSignature(prefix, path.extname(upload.pathname));
  } catch (error) {
    // Only this newly issued, UUID-named upload can be removed, never old assets.
    await del(blob.url, { token: secret() });
    throw error;
  }
  return { success: true, path: blob.url, originalFileName: upload.name };
}
