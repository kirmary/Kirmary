import { NextResponse } from "next/server"

import { POST as createGalleryImage } from "../gallery/create/handler"
import { POST as uploadGalleryAsset } from "../gallery/upload/handler"
import { POST as uploadProductAsset } from "../products/upload/handler"
import { POST as prepareOrCompleteUpload } from "../uploads/handler"

export const runtime = "nodejs"
export const maxDuration = 60

type AdminApiContext = {
  params: Promise<{
    path?: string[]
  }>
}

/**
 * Preserve the existing /api/admin/... endpoints while making Vercel deploy
 * them as one catch-all Serverless Function on the Hobby plan.
 */
export async function POST(
  request: Request,
  { params }: AdminApiContext
) {
  const { path = [] } = await params
  const key = path.join("/")

  switch (key) {
    case "gallery/create":
      return createGalleryImage(request)

    case "gallery/upload":
      return uploadGalleryAsset(request)

    case "products/upload":
      return uploadProductAsset(request)

    case "uploads":
      return prepareOrCompleteUpload(request)

    default:
      return NextResponse.json(
        { error: "Admin API route not found" },
        { status: 404 }
      )
  }
}
