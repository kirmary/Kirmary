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
    const type = String(data.get("type") || "image");
    if (!(file instanceof File) || !["image", "cover"].includes(type))
      throw new Error("Invalid upload");
    const result = await storeUpload(
      file,
      type === "cover" ? "gallery-sections" : "gallery",
      String(data.get("section") || "general"),
    );
    return NextResponse.json({ ...result, success: true, type });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    );
  }
}
