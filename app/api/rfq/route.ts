import { db } from "../../../lib/db"
import { validateRfq } from "../../../lib/validate"
import { createReference } from "../../../lib/reference"
import { rateLimit, clientIp } from "../../../lib/rate-limit"
import { sendMail, teamEmails, rfqTeamMail, rfqCustomerMail } from "../../../lib/mail"

// POST /api/rfq
// ده المسار اللي فورم الـ RFQ هيبعتله بدل Web3Forms.

export async function POST(request: Request) {
  // 1) حماية من التكرار: 8 طلبات في الساعة من نفس الجهاز
  const limit = rateLimit("rfq:" + clientIp(request), 8)
  if (!limit.allowed) {
    return Response.json(
      { ok: false, message: "Too many requests. Please try again later." },
      { status: 429 },
    )
  }

  // 2) قراءة البيانات والتحقق منها
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, message: "Invalid request body." }, { status: 400 })
  }

  const { errors, data } = validateRfq(body)
  if (!data) {
    return Response.json({ ok: false, message: "Please check the form fields.", errors }, { status: 422 })
  }

  try {
    // 3) الحفظ في قاعدة البيانات (لو الرقم المرجعي اتكرر بنجرّب تاني)
    let rfq
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        rfq = await db.rfq.create({
          data: { ...data, reference: createReference() },
        })
        break
      } catch (error: unknown) {
        const code = (error as { code?: string }).code
        if (code !== "P2002") throw error // P2002 = قيمة مكررة
      }
    }

    if (!rfq) {
      return Response.json({ ok: false, message: "Could not create a reference. Please retry." }, { status: 500 })
    }

    // 4) الإيميلات — بعد الحفظ، وأي فشل فيها مايأثرش على الطلب
    const siteUrl = process.env.SITE_URL ?? "http://localhost:3000"
    const adminUrl = siteUrl + "/admin/rfq/" + rfq.id
    const team = teamEmails()

    await Promise.allSettled([
      team.length ? sendMail({ to: team, ...rfqTeamMail(rfq, adminUrl) }) : Promise.resolve(),
      sendMail({ to: rfq.workEmail, ...rfqCustomerMail(rfq) }),
    ])

    // 5) الرد على الفورم بالرقم المرجعي
    return Response.json({ ok: true, reference: rfq.reference }, { status: 201 })
  } catch (error) {
    console.error("[api/rfq]", error)
    return Response.json({ ok: false, message: "Something went wrong. Please try again." }, { status: 500 })
  }
}
