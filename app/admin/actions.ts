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
