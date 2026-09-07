"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { productEditorData, productRows, saveProductRows } from "../../lib/product-editor"
import { validSlug } from "../../lib/local-upload"
import { db } from "../../lib/db"
import { checkPassword, startSession, endSession, isAdmin } from "../../lib/admin-auth"

// Server Actions: كود بيتنفذ على السيرفر بس، بيتنادى مباشرة من الفورم.
// مفيش API مطلوب للوحة التحكم بسببها.

const RFQ_STATUSES = ["NEW", "IN_REVIEW", "QUOTED", "WON", "LOST"] as const
const MESSAGE_STATUSES = ["NEW", "READ", "REPLIED"] as const

type RfqStatus = (typeof RFQ_STATUSES)[number]
type MessageStatus = (typeof MESSAGE_STATUSES)[number]

function revalidateProductPages(slug?: string) {
  revalidatePath("/admin/products")
  revalidatePath("/en")
  revalidatePath("/ar")
  revalidatePath("/en/products")
  revalidatePath("/ar/products")

  if (slug) {
    revalidatePath("/en/products/" + slug)
    revalidatePath("/ar/products/" + slug)
  }
}

function revalidateProjectPages() {
  revalidatePath("/admin/projects")
  revalidatePath("/en")
  revalidatePath("/ar")
  revalidatePath("/en/projects")
  revalidatePath("/ar/projects")
}

function revalidateGalleryPages() {
  revalidatePath("/[locale]/[...slug]", "page")
  revalidatePath("/admin/gallery")
  revalidatePath("/admin/gallery/sections")
}

function revalidateTechnicalLibrary(productSlug?: string) {
  revalidatePath("/admin/technical-library")
  revalidatePath("/en/technical-library")
  revalidatePath("/ar/technical-library")

  if (productSlug) {
    revalidatePath("/en/products/" + productSlug)
    revalidatePath("/ar/products/" + productSlug)
  }
}

// =========================
// AUTH
// =========================

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "")

  if (!checkPassword(password)) {
    redirect("/admin/login?error=1")
  }

  await startSession()
  redirect("/admin")
}

export async function logout() {
  await endSession()
  redirect("/admin/login")
}

// مهم: كل action بتتأكد من الصلاحية بنفسها.
// الحماية مش معتمدة على إخفاء الزرار من الواجهة.
async function guard() {
  if (!(await isAdmin())) {
    redirect("/admin/login")
  }
}

// =========================
// RFQ
// =========================

export async function updateRfqStatus(formData: FormData) {
  await guard()

  const id = String(formData.get("id") ?? "")
  const status = String(formData.get("status") ?? "") as RfqStatus

  if (!id || !RFQ_STATUSES.includes(status)) return

  await db.rfq.update({
    where: { id },
    data: { status },
  })

  revalidatePath("/admin")
  revalidatePath("/admin/rfq/" + id)
}

export async function updateRfqNote(formData: FormData) {
  await guard()

  const id = String(formData.get("id") ?? "")
  const note = String(formData.get("note") ?? "").slice(0, 4000)

  if (!id) return

  await db.rfq.update({
    where: { id },
    data: { note: note || null },
  })

  revalidatePath("/admin/rfq/" + id)
}

// =========================
// MESSAGES
// =========================

export async function updateMessageStatus(formData: FormData) {
  await guard()

  const id = String(formData.get("id") ?? "")
  const status = String(formData.get("status") ?? "") as MessageStatus

  if (!id || !MESSAGE_STATUSES.includes(status)) return

  await db.message.update({
    where: { id },
    data: { status },
  })

  revalidatePath("/admin/messages")
}

// =========================
// PRODUCTS
// =========================

export async function createProduct(formData: FormData) {
  await guard()
  const data=productEditorData(formData); const rows=productRows(formData)
  await db.$transaction(async tx => {
    if (await tx.productAlias.findUnique({where:{slug:data.slug}})) throw new Error('This slug is already used by an existing product URL.')
    const product=await tx.product.create({data:{...data,contentManaged:true}})
    await saveProductRows(tx,product.id,rows)
  })
  revalidateProductPages(data.slug)
  redirect('/admin/products')
}

export async function deleteProduct(formData: FormData) {
  await guard()

  const id = String(formData.get("id") ?? "").trim()
  const slug = String(formData.get("slug") ?? "").trim()
  const confirmation = String(formData.get("confirmation") ?? "").trim()

  if (!id || !slug || confirmation !== slug) return

  const product = await db.product.findFirst({
    where: { id, slug },
    select: {
      id: true,
      slug: true,
    },
  })

  if (!product) return

  await db.$transaction([
    db.productAlias.deleteMany({
      where: { productId: product.id },
    }),

    db.productFeature.deleteMany({
      where: { productId: product.id },
    }),

    db.productDocument.deleteMany({
      where: { productId: product.id },
    }),

    db.product.delete({
      where: { id: product.id },
    }),
  ])

  revalidateProductPages(product.slug)

  redirect("/admin/products")
}

export async function hideProduct(formData: FormData) {
  await guard()

  const id = String(formData.get("id") ?? "").trim()
  const slug = String(formData.get("slug") ?? "").trim()

  if (!id || !slug) return

  const result = await db.product.updateMany({
    where: { id, slug, visible: true },
    data: { visible: false },
  })

  if (!result.count) return

  revalidateProductPages(slug)

  redirect("/admin/products")
}

export async function showProduct(formData: FormData) {
  await guard()

  const id = String(formData.get("id") ?? "").trim()
  const slug = String(formData.get("slug") ?? "").trim()

  if (!id || !slug) return

  const result = await db.product.updateMany({
    where: { id, slug, visible: false },
    data: { visible: true },
  })

  if (!result.count) return

  revalidateProductPages(slug)

  redirect("/admin/products")
}

export async function updateProduct(formData: FormData) {
  await guard()
  const id=String(formData.get('id') || '')
  const data=productEditorData(formData); const rows=productRows(formData)
  const oldSlug=await db.$transaction(async tx => {
    const existing=await tx.product.findUniqueOrThrow({where:{id}})
    const alias=await tx.productAlias.findUnique({where:{slug:data.slug}})
    if (alias && alias.productId !== id) throw new Error('This slug is already used by another product URL.')
    if (existing.slug !== data.slug) {
      await tx.productAlias.upsert({where:{slug:existing.slug},create:{slug:existing.slug,productId:id},update:{}})
    }
    await tx.product.update({where:{id},data:{...data,legacySlug:existing.legacySlug || existing.slug}})
    await saveProductRows(tx,id,rows)
    return existing.slug
  })
  revalidateProductPages(oldSlug)
  revalidateProductPages(data.slug)
  redirect('/admin/products')
}

// =========================
// TECHNICAL LIBRARY
// =========================

export async function createTechnicalDocument(formData: FormData) {
  await guard()

  const productId = String(
    formData.get("productId") ?? ""
  ).trim()

  const title = String(
    formData.get("title") ?? ""
  ).trim()

  const titleAr = String(
    formData.get("titleAr") ?? ""
  ).trim()

  const originalFileName = String(
    formData.get("originalFileName") ?? ""
  ).trim()

  const documentType = String(
    formData.get("documentType") ?? ""
  ).trim()

  const fileUrl = String(
    formData.get("fileUrl") ?? ""
  ).trim()

  const sortOrder = Number(
    formData.get("sortOrder") ?? 0
  )

  const visible =
    formData.get("visible") === "on"

  if (
    !productId ||
    !title ||
    !originalFileName ||
    !documentType ||
    !fileUrl
  ) {
    return
  }

  const product = await db.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      slug: true,
    },
  })

  if (!product) {
    return
  }

  await db.productDocument.create({
    data: {
      productId: product.id,
      title,
      titleAr,
      originalFileName,
      documentType,
      fileUrl,
      visible,
      sortOrder: Number.isFinite(sortOrder)
        ? sortOrder
        : 0,
    },
  })

  revalidateTechnicalLibrary(product.slug)

  redirect("/admin/technical-library")
}

export async function updateTechnicalDocument(formData: FormData) {
  await guard()

  const id = String(
    formData.get("id") ?? ""
  ).trim()

  const productId = String(
    formData.get("productId") ?? ""
  ).trim()

  const title = String(
    formData.get("title") ?? ""
  ).trim()

  const titleAr = String(
    formData.get("titleAr") ?? ""
  ).trim()

  const originalFileName = String(
    formData.get("originalFileName") ?? ""
  ).trim()

  const documentType = String(
    formData.get("documentType") ?? ""
  ).trim()

  const fileUrl = String(
    formData.get("fileUrl") ?? ""
  ).trim()

  const sortOrder = Number(
    formData.get("sortOrder") ?? 0
  )

  const visible =
    formData.get("visible") === "on"

  if (
    !id ||
    !productId ||
    !title ||
    !originalFileName ||
    !documentType ||
    !fileUrl
  ) {
    return
  }

  const existingDocument =
    await db.productDocument.findUnique({
      where: { id },
      select: {
        id: true,
        product: {
          select: {
            slug: true,
          },
        },
      },
    })

  if (!existingDocument) {
    return
  }

  const newProduct =
    await db.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        slug: true,
      },
    })

  if (!newProduct) {
    return
  }

  await db.productDocument.update({
    where: { id },
    data: {
      productId: newProduct.id,
      title,
      titleAr,
      originalFileName,
      documentType,
      fileUrl,
      visible,
      sortOrder: Number.isFinite(sortOrder)
        ? sortOrder
        : 0,
    },
  })

  revalidateTechnicalLibrary(
    existingDocument.product.slug
  )

  if (
    newProduct.slug !==
    existingDocument.product.slug
  ) {
    revalidateTechnicalLibrary(
      newProduct.slug
    )
  }

  redirect("/admin/technical-library")
}

export async function deleteTechnicalDocument(formData: FormData) {
  await guard()

  const id = String(
    formData.get("id") ?? ""
  ).trim()

  const confirmation = String(
    formData.get("confirmation") ?? ""
  ).trim()

  if (
    !id ||
    confirmation !== "DELETE"
  ) {
    return
  }

  const document =
    await db.productDocument.findUnique({
      where: { id },
      select: {
        id: true,
        product: {
          select: {
            slug: true,
          },
        },
      },
    })

  if (!document) {
    return
  }

  await db.productDocument.delete({
    where: {
      id: document.id,
    },
  })

  // بنحذف Record من الـDatabase فقط.
  // ملف الـPDF نفسه لا يتم حذفه من التخزين.
  revalidateTechnicalLibrary(
    document.product.slug
  )

  redirect("/admin/technical-library")
}

// =========================
// PROJECTS
// =========================

function projectData(formData: FormData) {
  const sortOrder = Number(formData.get("sortOrder") ?? 0)

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    nameAr: String(formData.get("nameAr") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim() || null,
    subtitleAr: String(formData.get("subtitleAr") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim(),
    descriptionAr: String(formData.get("descriptionAr") ?? "").trim(),
    visible: formData.get("visible") === "on",
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
  }
}

export async function createProject(formData: FormData) {
  await guard()

  const data = projectData(formData)

  if (!data.slug || !data.name || !data.nameAr || !data.image) {
    return
  }

  await db.project.create({ data })

  revalidateProjectPages()

  redirect("/admin/projects")
}

export async function updateProject(formData: FormData) {
  await guard()

  const id = String(formData.get("id") ?? "").trim()
  const data = projectData(formData)

  if (!id || !data.slug || !data.name || !data.nameAr || !data.image) {
    return
  }

  const result = await db.project.updateMany({
    where: { id },
    data,
  })

  if (!result.count) return

  revalidateProjectPages()

  redirect("/admin/projects")
}

export async function hideProject(formData: FormData) {
  await guard()

  const id = String(formData.get("id") ?? "").trim()
  const slug = String(formData.get("slug") ?? "").trim()

  if (!id || !slug) return

  const result = await db.project.updateMany({
    where: { id, slug, visible: true },
    data: { visible: false },
  })

  if (!result.count) return

  revalidateProjectPages()

  redirect("/admin/projects")
}

export async function showProject(formData: FormData) {
  await guard()

  const id = String(formData.get("id") ?? "").trim()
  const slug = String(formData.get("slug") ?? "").trim()

  if (!id || !slug) return

  const result = await db.project.updateMany({
    where: { id, slug, visible: false },
    data: { visible: true },
  })

  if (!result.count) return

  revalidateProjectPages()

  redirect("/admin/projects")
}

export async function deleteProject(formData: FormData) {
  await guard()

  const id = String(formData.get("id") ?? "").trim()
  const slug = String(formData.get("slug") ?? "").trim()
  const confirmation = String(formData.get("confirmation") ?? "").trim()

  if (!id || !slug || confirmation !== slug) return

  const result = await db.project.deleteMany({
    where: { id, slug },
  })

  if (!result.count) return

  revalidateProjectPages()

  redirect("/admin/projects")
}

// =========================
// GALLERY IMAGES
// =========================

export async function createGalleryImage(formData: FormData) {
  await guard()

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

  const featured = formData.get("featured") === "on"
  const visible = formData.get("visible") === "on"
  const sortOrder = Number(formData.get("sortOrder") ?? 0)

  if (!image || !title || !titleAr) {
    return
  }

  await db.galleryImage.create({
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
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    },
  })

  revalidateGalleryPages()

  redirect("/admin/gallery")
}

export async function updateGalleryImage(formData: FormData) {
  await guard()

  const id = String(formData.get("id") ?? "").trim()
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

  const featured = formData.get("featured") === "on"
  const visible = formData.get("visible") === "on"
  const sortOrder = Number(formData.get("sortOrder") ?? 0)

  if (!id || !image || !title || !titleAr) {
    return
  }

  const existing = await db.galleryImage.findUnique({
    where: { id },
    select: { id: true },
  })

  if (!existing) return

  await db.galleryImage.update({
    where: { id },
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
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    },
  })

  revalidateGalleryPages()

  redirect("/admin/gallery")
}

export async function hideGalleryImage(formData: FormData) {
  await guard()

  const id = String(formData.get("id") ?? "").trim()

  if (!id) return

  const result = await db.galleryImage.updateMany({
    where: { id, visible: true },
    data: { visible: false },
  })

  if (!result.count) return

  revalidateGalleryPages()

  redirect("/admin/gallery")
}

export async function showGalleryImage(formData: FormData) {
  await guard()

  const id = String(formData.get("id") ?? "").trim()

  if (!id) return

  const result = await db.galleryImage.updateMany({
    where: { id, visible: false },
    data: { visible: true },
  })

  if (!result.count) return

  revalidateGalleryPages()

  redirect("/admin/gallery")
}

export async function deleteGalleryImage(formData: FormData) {
  await guard()

  const id = String(formData.get("id") ?? "").trim()
  const title = String(formData.get("title") ?? "").trim()
  const confirmation = String(formData.get("confirmation") ?? "").trim()

  if (!id || !title || confirmation !== title) {
    return
  }

  const result = await db.galleryImage.deleteMany({
    where: { id },
  })

  if (!result.count) return

  revalidateGalleryPages()

  redirect("/admin/gallery")
}

// =========================
// GALLERY SECTIONS
// =========================

export async function createGallerySection(formData: FormData) {
  await guard()

  const name = String(
    formData.get("name") ?? ""
  ).trim()

  const nameAr = String(
    formData.get("nameAr") ?? ""
  ).trim()

  const slug = String(
    formData.get("slug") ?? ""
  ).trim()

  const coverImage = String(
    formData.get("coverImage") ?? ""
  ).trim()

  const sortOrder = Number(
    formData.get("sortOrder") ?? 0
  )

  if (!validSlug(slug)) throw new Error("Invalid section slug")
  if (!name || !nameAr || !slug) {
    return
  }

  await db.gallerySection.create({
    data: {
      name,
      nameAr,
      slug,

      // Section cover is stored separately
      // from GalleryImage records.
      coverImage: coverImage || null,

      visible: formData.get("visible") === "on",

      sortOrder: Number.isFinite(sortOrder)
        ? sortOrder
        : 0,
    },
  })

  revalidateGalleryPages()

  redirect("/admin/gallery")
}
export async function updateGallerySection(formData: FormData) {
  await guard()

  const id = String(
    formData.get("id") ?? ""
  ).trim()

  const name = String(
    formData.get("name") ?? ""
  ).trim()

  const nameAr = String(
    formData.get("nameAr") ?? ""
  ).trim()

  const slug = String(
    formData.get("slug") ?? ""
  ).trim()

  const coverImage = String(
    formData.get("coverImage") ?? ""
  ).trim()

  const sortOrder = Number(
    formData.get("sortOrder") ?? 0
  )

  const visible =
    formData.get("visible") === "on"

  if (!validSlug(slug)) throw new Error("Invalid section slug")
  if (!id || !name || !nameAr || !slug) {
    return
  }

  const existing = await db.gallerySection.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
    },
  })

  if (!existing) {
    return
  }

  if (existing.slug !== slug) {
    await db.$transaction([
      db.gallerySection.update({
        where: { id },
        data: {
          name,
          nameAr,
          slug,
          coverImage: coverImage || null,
          visible,
          sortOrder: Number.isFinite(sortOrder)
            ? sortOrder
            : 0,
        },
      }),

      db.galleryImage.updateMany({
        where: {
          section: existing.slug,
        },
        data: {
          section: slug,
        },
      }),
    ])
  } else {
    await db.gallerySection.update({
      where: { id },
      data: {
        name,
        nameAr,
        slug,
        coverImage: coverImage || null,
        visible,
        sortOrder: Number.isFinite(sortOrder)
          ? sortOrder
          : 0,
      },
    })
  }

  revalidateGalleryPages()

  redirect("/admin/gallery")
}
export async function deleteGallerySection(formData: FormData) {
  await guard()

  const id = String(
    formData.get("id") ?? ""
  ).trim()

  const confirmation = String(
    formData.get("confirmation") ?? ""
  ).trim()

  if (!id || confirmation !== "DELETE") {
    return
  }

  const section = await db.gallerySection.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
    },
  })

  if (!section) {
    return
  }

  await db.$transaction([
    db.galleryImage.deleteMany({
      where: {
        section: section.slug,
      },
    }),

    db.gallerySection.delete({
      where: {
        id: section.id,
      },
    }),
  ])

  revalidateGalleryPages()

  redirect("/admin/gallery")
}