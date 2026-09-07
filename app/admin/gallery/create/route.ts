import { NextResponse } from "next/server"
import { db } from "../../../../lib/db"
import { requireAdmin } from "../../../../lib/admin-auth"

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const formData = await request.formData()

    const image = String(formData.get("image") ?? "").trim()
    const title = String(formData.get("title") ?? "").trim()
    const titleAr = String(formData.get("titleAr") ?? "").trim()

    const description =
      String(formData.get("description") ?? "").trim() || null

    const descriptionAr =
      String(formData.get("descriptionAr") ?? "").trim() || null

    const category =
      String(formData.get("category") ?? "").trim() || null

    const section =
      String(formData.get("section") ?? "").trim() || "general"

    const featured =
      formData.get("featured") === "on"

    const visible =
      formData.get("visible") === "on"

    const sortOrder = Number(
      formData.get("sortOrder") ?? 0
    )

    if (!image || !title || !titleAr) {
      return NextResponse.json(
        {
          error: "Image, English title and Arabic title are required.",
        },
        {
          status: 400,
        }
      )
    }

    const galleryImage = await db.galleryImage.create({
      data: {
        image,
        title,
        titleAr,
        description,
        descriptionAr,
        category,
        section,
        featured,
        visible,
        sortOrder: Number.isFinite(sortOrder)
          ? sortOrder
          : 0,
      },
    })

    return NextResponse.json({
      success: true,
      image: galleryImage,
    })
  } catch (error) {
    console.error("Gallery create error:", error)

    return NextResponse.json(
      {
        error: "Failed to create gallery image.",
      },
      {
        status: 500,
      }
    )
  }
}