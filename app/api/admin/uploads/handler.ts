import { NextResponse } from "next/server";

import { isAdmin } from "../../../../lib/admin-auth";

import {
  uploadStorage,
  validateUploadMetadata,
  type UploadFolder,
} from "../../../../lib/local-upload";

import {
  prepareBlobUpload,
  completeBlobUpload,
} from "../../../../lib/blob-upload";

export const runtime = "nodejs";

export const maxDuration = 60;

function currentUploadStorage() {
  /*
   * A real Vercel deployment must use Blob storage.
   *
   * This intentionally does NOT call the old production-token
   * check in uploadStorage(), because the connected Blob store
   * now authenticates with Vercel OIDC instead of
   * BLOB_READ_WRITE_TOKEN.
   *
   * Local development keeps the existing local-upload behavior.
   */
  if (process.env.VERCEL === "1") {
    return "blob" as const;
  }

  return uploadStorage();
}

export async function POST(
  request: Request,
) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (
    request.headers.get("origin") &&
    request.headers.get("origin") !==
      new URL(request.url).origin
  ) {
    return NextResponse.json(
      { error: "Invalid origin" },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();

    const storage =
      currentUploadStorage();

    if (
      body.operation === "complete" &&
      storage === "blob"
    ) {
      return NextResponse.json(
        await completeBlobUpload(
          String(body.ticket || ""),
        ),
        {
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    if (body.operation !== "prepare") {
      throw new Error(
        "Invalid upload operation.",
      );
    }

    const file = {
      name: String(body.name || ""),
      type: String(body.type || ""),
      size: Number(body.size),
    };

    const folder =
      String(body.folder) as UploadFolder;

    const slug =
      String(body.slug || "");

    validateUploadMetadata(
      file,
      folder,
      slug,
    );

    return NextResponse.json(
      storage === "local"
        ? { storage }
        : await prepareBlobUpload(
            file,
            folder,
            slug,
          ),
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Upload failed",
      },
      { status: 400 },
    );
  }
}
