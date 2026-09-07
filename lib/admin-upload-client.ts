"use client";

import { put } from "@vercel/blob/client";

// Same response contract as the existing multipart endpoints. Only the transport
// changes: production file bytes go directly to Blob, avoiding Function limits.
export async function uploadAdminFile(
  endpoint: string,
  data: FormData,
): Promise<Response> {
  const file = data.get("file");
  if (!(file instanceof File)) throw new Error("No file provided.");
  const gallery = endpoint.includes("/gallery/");
  const type = String(data.get("type") || "image");
  const folder = gallery
    ? type === "cover"
      ? "gallery-sections"
      : "gallery"
    : type === "cover"
      ? "product-covers"
      : type === "image"
        ? "products"
        : "Technical";
  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operation: "prepare",
      folder,
      slug: String(data.get(gallery ? "section" : "slug") || "general"),
      name: file.name,
      type: file.type,
      size: file.size,
    }),
  });
  if (!response.ok) return response;
  const prepared = await response.json();
  if (prepared.storage === "local")
    return fetch(endpoint, { method: "POST", body: data });
  await put(prepared.pathname, file, {
    access: "public",
    token: prepared.clientToken,
    contentType: file.type,
    multipart: file.size > 4 * 1024 * 1024,
  });
  return fetch("/api/admin/uploads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operation: "complete", ticket: prepared.ticket }),
  });
}
