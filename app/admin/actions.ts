"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { db } from "../../lib/db"
import { checkPassword, startSession, endSession, isAdmin } from "../../lib/admin-auth"

// Server Actions: كود بيتنفذ على السرفر بس، بيتنادى مباشرة من الفورم.
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
  if (!(await isAdmin())) redirect("/admin/login")
}

export async function updateRfqStatus(formData: FormData) {
  await guard()

  const id = String(formData.get("id") ?? "")
  const status = String(formData.get("status") ?? "") as RfqStatus

  if (!id || !RFQ_STATUSES.includes(status)) return

  await db.rfq.update({ where: { id }, data: { status } })

  revalidatePath("/admin")
  revalidatePath("/admin/rfq/" + id)
}

export async function updateRfqNote(formData: FormData) {
  await guard()

  const id = String(formData.get("id") ?? "")
  const note = String(formData.get("note") ?? "").slice(0, 4000)

  if (!id) return

  await db.rfq.update({ where: { id }, data: { note: note || null } })

  revalidatePath("/admin/rfq/" + id)
}

export async function updateMessageStatus(formData: FormData) {
  await guard()

  const id = String(formData.get("id") ?? "")
  const status = String(formData.get("status") ?? "") as MessageStatus

  if (!id || !MESSAGE_STATUSES.includes(status)) return

  await db.message.update({ where: { id }, data: { status } })

  revalidatePath("/admin/messages")
}
export async function createProduct(formData: FormData) {
  await guard()

  const slug = String(formData.get("slug") ?? "").trim()
  const number = String(formData.get("number") ?? "").trim()
  const name = String(formData.get("name") ?? "").trim()
  const nameAr = String(formData.get("nameAr") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const descriptionAr = String(formData.get("descriptionAr") ?? "").trim()
  const image = String(formData.get("image") ?? "").trim() || null
  const category = String(formData.get("category") ?? "").trim() || null
  const brand = String(formData.get("brand") ?? "").trim() || null
  const featured = formData.get("featured") === "on"
  const visible = formData.get("visible") !== "off"
  const sortOrder = Number(formData.get("sortOrder") ?? 0)

  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)

  if (!slug || !number || !name || !nameAr) {
    return
  }

  await db.product.create({
    data: {
      slug,
      number,
      name,
      nameAr,
      description,
      descriptionAr,
      image,
      tags,
      category,
      brand,
      featured,
      visible,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    },
  })

  revalidateProductPages(slug)

  redirect("/admin/products")
}
export async function deleteProduct(formData: FormData) {
  await guard()

  const id = String(formData.get("id") ?? "").trim()
  const slug = String(formData.get("slug") ?? "").trim()
  const confirmation = String(formData.get("confirmation") ?? "").trim()

  // Deletion requires typing the exact product slug in the admin UI.
  if (!id || !slug || confirmation !== slug) return

  const result = await db.product.deleteMany({
    where: { id, slug },
  })

  if (!result.count) return

  revalidateProductPages(slug)

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
export async function updateProduct(formData: FormData) {
  await guard()

  const id = String(formData.get("id") ?? "").trim()

  const slug = String(formData.get("slug") ?? "").trim()
  const number = String(formData.get("number") ?? "").trim()
  const name = String(formData.get("name") ?? "").trim()
  const nameAr = String(formData.get("nameAr") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const descriptionAr = String(formData.get("descriptionAr") ?? "").trim()
  const image = String(formData.get("image") ?? "").trim() || null
  const category = String(formData.get("category") ?? "").trim() || null
  const brand = String(formData.get("brand") ?? "").trim() || null
  const featured = formData.get("featured") === "on"
  const visible = formData.get("visible") === "on"

  const sortOrder = Number(formData.get("sortOrder") ?? 0)

  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)

  if (!id || !slug || !number || !name || !nameAr) {
    return
  }

  const existing = await db.product.findUnique({
    where: { id },
    select: { slug: true },
  })

  if (!existing) return

  await db.product.update({
    where: { id },
    data: {
      slug,
      number,
      name,
      nameAr,
      description,
      descriptionAr,
      image,
      category,
      brand,
      tags,
      featured,
      visible,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    },
  })

  revalidateProductPages(existing.slug)
  if (existing.slug !== slug) revalidateProductPages(slug)

  redirect("/admin/products")
}

function projectData(formData: FormData) {
  const sortOrder = Number(formData.get("sortOrder") ?? 0)

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    nameAr: String(formData.get("nameAr") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim() || null,
    subtitleAr: String(formData.get("subtitleAr") ?? "").trim() || null,
    visible: formData.get("visible") === "on",
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
  }
}

export async function createProject(formData: FormData) {
  await guard()

  const data = projectData(formData)
  if (!data.slug || !data.name || !data.nameAr || !data.image) return

  await db.project.create({ data })
  revalidateProjectPages()
  redirect("/admin/projects")
}

export async function updateProject(formData: FormData) {
  await guard()

  const id = String(formData.get("id") ?? "").trim()
  const data = projectData(formData)
  if (!id || !data.slug || !data.name || !data.nameAr || !data.image) return

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
