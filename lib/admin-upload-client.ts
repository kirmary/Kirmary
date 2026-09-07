"use client";

// Same response contract as the existing multipart endpoints.
// Local development still uses the existing local endpoint.
// On Vercel the browser uploads directly to Blob through a
// short-lived presigned PUT URL issued by the server via OIDC.
export async function uploadAdminFile(
  endpoint: string,
  data: FormData,
): Promise<Response> {
  const file = data.get("file");

  if (!(file instanceof File)) {
    throw new Error("No file provided.");
  }

  const gallery =
    endpoint.includes("/gallery/");

  const type = String(
    data.get("type") || "image",
  );

  const folder = gallery
    ? type === "cover"
      ? "gallery-sections"
      : "gallery"
    : type === "cover"
      ? "product-covers"
      : type === "image"
        ? "products"
        : "Technical";

  const response = await fetch(
    "/api/admin/uploads",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operation: "prepare",
        folder,
        slug: String(
          data.get(
            gallery ? "section" : "slug",
          ) || "general",
        ),
        name: file.name,
        type: file.type,
        size: file.size,
      }),
    },
  );

  if (!response.ok) {
    return response;
  }

  const prepared =
    (await response.json()) as {
      storage: "local" | "blob";
      pathname?: string;
      presignedUrl?: string;
      ticket?: string;
    };

  if (prepared.storage === "local") {
    return fetch(endpoint, {
      method: "POST",
      body: data,
    });
  }

  if (
    !prepared.presignedUrl ||
    !prepared.ticket
  ) {
    throw new Error(
      "Upload preparation did not return a signed Blob URL.",
    );
  }

  /*
   * File bytes go straight from the browser to Vercel Blob.
   * They do not pass through the Next.js Function.
   */
  const blobResponse = await fetch(
    prepared.presignedUrl,
    {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    },
  );

  if (!blobResponse.ok) {
    let message =
      "Direct Blob upload failed.";

    try {
      const body =
        await blobResponse.json();

      if (
        body &&
        typeof body.error === "string"
      ) {
        message = body.error;
      }
    } catch {
      // Blob may return a non-JSON error response.
    }

    throw new Error(message);
  }

  return fetch("/api/admin/uploads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operation: "complete",
      ticket: prepared.ticket,
    }),
  });
}
