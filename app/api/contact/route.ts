import { db } from "../../../lib/db"
import { validateMessage } from "../../../lib/validate"
import { rateLimit, clientIp } from "../../../lib/rate-limit"
import { sendMail, teamEmails, messageTeamMail } from "../../../lib/mail"

// POST /api/contact — رسائل التواصل العادية

export async function POST(request: Request) {
  const limit = rateLimit("contact:" + clientIp(request), 10)
  if (!limit.allowed) {
    return Response.json(
      { ok: false, message: "Too many requests. Please try again later." },
      { status: 429 },
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, message: "Invalid request body." }, { status: 400 })
  }

  const { errors, data } = validateMessage(body)
  if (!data) {
    return Response.json({ ok: false, message: "Please check the form fields.", errors }, { status: 422 })
  }

  try {
    const message = await db.message.create({ data })

    const team = teamEmails()
    if (team.length) {
      await sendMail({ to: team, ...messageTeamMail(message) })
    }

    return Response.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error("[api/contact]", error)
    return Response.json({ ok: false, message: "Something went wrong. Please try again." }, { status: 500 })
  }
}
