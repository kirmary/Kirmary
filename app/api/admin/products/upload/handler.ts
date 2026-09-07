import { NextResponse } from "next/server";
import { isAdmin } from "../../../../../lib/admin-auth";
import { storeUpload } from "../../../../../lib/local-upload";

export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (
    request.headers.get("origin") &&
    request.headers.get("origin") !== new URL(request.url).origin
  )
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  try {
    const data = await request.formData();
    const file = data.get("file");
    const kind = String(data.get("type"));
    if (
      !(file instanceof File) ||
      !["cover", "image", "document"].includes(kind)
    )
      throw new Error("Invalid upload.");
    const result = await storeUpload(
      file,
      kind === "cover"
        ? "product-covers"
        : kind === "image"
          ? "products"
          : "Technical",
      String(data.get("slug") || ""),
    );
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    );
  }
}
