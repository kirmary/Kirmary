import { createHmac, timingSafeEqual } from "node:crypto";
import path from "node:path";
import {
  del,
  head,
  issueSignedToken,
  presignUrl,
} from "@vercel/blob";
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

function ticketSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is required for secure admin uploads.",
    );
  }

  return secret;
}

function signature(payload: string) {
  return createHmac("sha256", ticketSecret())
    .update(`admin-upload:${payload}`)
    .digest("hex");
}

export function readUploadTicket(ticket: string): UploadTicket {
  const [payload, mac, ...rest] = ticket.split(".");

  if (
    !payload ||
    !mac ||
    rest.length ||
    mac.length !== 64
  ) {
    throw new Error("Invalid upload ticket.");
  }

  const expected = Buffer.from(signature(payload), "utf8");
  const received = Buffer.from(mac, "utf8");

  if (
    expected.length !== received.length ||
    !timingSafeEqual(received, expected)
  ) {
    throw new Error("Invalid upload ticket.");
  }

  const value = JSON.parse(
    Buffer.from(payload, "base64url").toString(),
  ) as UploadTicket;

  if (value.expires < Date.now()) {
    throw new Error(
      "Upload expired. Please upload the file again.",
    );
  }

  return value;
}

export async function prepareBlobUpload(
  file: {
    name: string;
    type: string;
    size: number;
  },
  folder: UploadFolder,
  slug: string,
) {
  const ext = validateUploadMetadata(
    file,
    folder,
    slug,
  );

  const pathname =
    `${folder}/${slug}/${uploadFilename(
      file.name,
      ext,
    )}`;

  const expires =
    Date.now() + 15 * 60 * 1000;

  const payload = Buffer.from(
    JSON.stringify({
      pathname,
      name: path.basename(file.name),
      type: file.type,
      size: file.size,
      expires,
    } satisfies UploadTicket),
  ).toString("base64url");

  /*
   * Vercel Blob 2.4+:
   * issueSignedToken authenticates server-side with Vercel OIDC.
   * No BLOB_READ_WRITE_TOKEN is required.
   */
  const signedToken =
    await issueSignedToken({
      pathname,
      operations: ["put"],
      allowedContentTypes: [file.type],
      maximumSizeInBytes: file.size,
      validUntil: expires,
    });

  const { presignedUrl } =
    await presignUrl(signedToken, {
      access: "public",
      operation: "put",
      pathname,
      validUntil: expires,
      allowedContentTypes: [file.type],
      maximumSizeInBytes: file.size,
      addRandomSuffix: false,
      allowOverwrite: false,
    });

  return {
    storage: "blob",
    pathname,
    presignedUrl,
    ticket: `${payload}.${signature(payload)}`,
  };
}

export async function completeBlobUpload(
  ticket: string,
) {
  const upload = readUploadTicket(ticket);

  /*
   * head() and del() also authenticate through Vercel OIDC
   * automatically when running inside the connected Vercel project.
   */
  const blob = await head(upload.pathname);

  if (blob.pathname !== upload.pathname) {
    throw new Error("Upload path mismatch.");
  }

  if (
    blob.size !== upload.size ||
    blob.size > MAX_UPLOAD_BYTES ||
    blob.contentType !== upload.type
  ) {
    throw new Error(
      "Uploaded file metadata does not match.",
    );
  }

  const response = await fetch(blob.url, {
    headers: {
      Range: "bytes=0-31",
    },
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok || !response.body) {
    throw new Error(
      "Unable to verify the uploaded file. Please retry.",
    );
  }

  const reader = response.body.getReader();
  let prefix = Buffer.alloc(0);

  try {
    while (prefix.length < 32) {
      const chunk = await reader.read();

      if (chunk.done) {
        break;
      }

      prefix = Buffer.concat([
        prefix,
        Buffer.from(chunk.value).subarray(
          0,
          32 - prefix.length,
        ),
      ]);
    }
  } finally {
    await reader.cancel();
  }

  try {
    validateUploadSignature(
      prefix,
      path.extname(upload.pathname),
    );
  } catch (error) {
    /*
     * Only this newly issued upload is removed.
     * Existing website assets are never touched.
     */
    await del(blob.url);
    throw error;
  }

  return {
    success: true,
    path: blob.url,
    originalFileName: upload.name,
  };
}
