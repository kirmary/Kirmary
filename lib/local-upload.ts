import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";

export type UploadFolder =
  "gallery" | "gallery-sections" | "products" | "product-covers" | "Technical";
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export function uploadStorage() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob" as const;
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    throw new Error(
      "Production uploads require a connected public Vercel Blob store and BLOB_READ_WRITE_TOKEN.",
    );
  }
  return "local" as const;
}

const images: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};
export function validSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 120;
}
export function safeContentUrl(value: string) {
  if (!value) return value;
  if (/^\/(?!\/)/.test(value) && !/[\\\r\n]/.test(value)) return value;
  try {
    const url = new URL(value);
    if (["https:", "http:"].includes(url.protocol)) return value;
  } catch {}
  throw new Error("Use a local path or an HTTP(S) URL.");
}
export function validateUploadMetadata(
  file: { name: string; type: string; size: number },
  folder: UploadFolder,
  slug: string,
) {
  if (
    ![
      "gallery",
      "gallery-sections",
      "products",
      "product-covers",
      "Technical",
    ].includes(folder)
  )
    throw new Error("Invalid upload folder.");
  if (!validSlug(slug))
    throw new Error("Use lowercase letters, numbers and hyphens for the slug.");
  if (
    !Number.isSafeInteger(file.size) ||
    file.size < 1 ||
    file.size > MAX_UPLOAD_BYTES
  )
    throw new Error("Files must be between 1 byte and 20 MB.");
  const ext = path.extname(file.name).toLowerCase();
  const expected =
    folder === "Technical"
      ? ext === ".pdf"
        ? "application/pdf"
        : undefined
      : images[ext];
  if (!expected || file.type !== expected)
    throw new Error(
      folder === "Technical"
        ? "Only PDF documents are supported."
        : "Use JPG, PNG, WEBP, GIF or AVIF images.",
    );
  return ext;
}

export function validateUploadSignature(buffer: Buffer, ext: string) {
  const signatureOK =
    ext === ".pdf"
      ? buffer.subarray(0, 5).toString() === "%PDF-"
      : [".jpg", ".jpeg"].includes(ext)
        ? buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255
        : ext === ".png"
          ? buffer
              .subarray(0, 8)
              .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
          : ext === ".gif"
            ? /^GIF8[79]a/.test(buffer.subarray(0, 6).toString())
            : ext === ".webp"
              ? buffer.subarray(0, 4).toString() === "RIFF" &&
                buffer.subarray(8, 12).toString() === "WEBP"
              : buffer.subarray(4, 8).toString() === "ftyp" &&
                /avif|avis/.test(buffer.subarray(8, 32).toString());
  if (!signatureOK)
    throw new Error("File contents do not match the selected file type.");
}

export function uploadFilename(name: string, ext: string) {
  const base =
    path
      .basename(name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 80) || "upload";
  return `${base}-${randomUUID()}${ext}`;
}

export async function storeUpload(
  file: File,
  folder: UploadFolder,
  slug: string,
) {
  const storage = uploadStorage();
  const ext = validateUploadMetadata(file, folder, slug);
  const buffer = Buffer.from(await file.arrayBuffer());
  validateUploadSignature(buffer, ext);
  const filename = uploadFilename(file.name, ext);
  if (storage === "blob") {
    const blob = await put(`${folder}/${slug}/${filename}`, buffer, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
      allowOverwrite: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return { path: blob.url, originalFileName: path.basename(file.name) };
  }
  const directory = path.join(process.cwd(), "public", folder, slug);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), buffer, { flag: "wx" });
  return {
    path: `/${folder}/${slug}/${filename}`,
    originalFileName: path.basename(file.name),
  };
}
