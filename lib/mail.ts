import { Resend } from "resend"

// resend مثبتة عندك بالفعل في package.json.
// لو مفيش RESEND_API_KEY، الإيميل بيتطبع في الترمينال بدل ما يفشل.

type MailInput = {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

export function teamEmails() {
  return (process.env.TEAM_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
}

export async function sendMail(input: MailInput) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.MAIL_FROM ?? "KIRMARY <onboarding@resend.dev>"

  if (!apiKey) {
    console.log("[mail:dev]", { to: input.to, subject: input.subject })
    return
  }

  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from,
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      html: input.html,
      ...(input.replyTo ? { replyTo: input.replyTo } : {}),
    })
  } catch (error) {
    // مهم: الإيميل لو فشل، الطلب يفضل متسجّل في قاعدة البيانات
    console.error("[mail] failed", error)
  }
}

// ---- قوالب بألوان كيرماري ----

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

function shell(title: string, rows: Array<[string, string | null]>, footer?: string) {
  const body = rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        '<tr><td style="padding:9px 0;font-size:12px;color:#71789e;width:150px;vertical-align:top">' +
        escapeHtml(label) +
        '</td><td style="padding:9px 0;font-size:14px;color:#0b1040;white-space:pre-wrap">' +
        escapeHtml(String(value)) +
        "</td></tr>",
    )
    .join("")

  return (
    '<div style="background:#f5f7ff;padding:32px 16px;font-family:Arial,Helvetica,sans-serif">' +
    '<div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #d9ddf2">' +
    '<div style="background:#070b36;padding:22px 28px;color:#fff">' +
    '<div style="font-size:18px;font-weight:900;letter-spacing:.12em">KIRMARY</div>' +
    '<div style="font-size:9px;letter-spacing:.22em;color:#ff777e;margin-top:4px">INTERNATIONAL ENGINEERING SUPPLIES</div>' +
    "</div>" +
    '<div style="padding:28px">' +
    '<h1 style="margin:0 0 20px;font-size:19px;color:#2D3389">' +
    escapeHtml(title) +
    "</h1>" +
    '<table style="width:100%;border-collapse:collapse">' +
    body +
    "</table>" +
    (footer ? '<p style="margin:22px 0 0;font-size:13px;color:#4b527d;line-height:1.7">' + footer + "</p>" : "") +
    "</div>" +
    '<div style="border-top:1px solid #d9ddf2;padding:16px 28px;font-size:10px;color:#9ba2c4">Automated message from the KIRMARY website</div>' +
    "</div></div>"
  )
}

export function rfqTeamMail(rfq: {
  reference: string
  fullName: string
  workEmail: string
  phone: string
  companyName: string | null
  projectName: string
  projectLocation: string | null
  products: string
  quantities: string | null
  technicalRequirements: string | null
}, adminUrl: string) {
  return {
    subject: "New RFQ " + rfq.reference + " from " + rfq.fullName,
    replyTo: rfq.workEmail,
    html: shell("New quotation request", [
      ["RFQ Reference", rfq.reference],
      ["Full Name", rfq.fullName],
      ["Work Email", rfq.workEmail],
      ["Phone / WhatsApp", rfq.phone],
      ["Company", rfq.companyName],
      ["Project", rfq.projectName],
      ["Location", rfq.projectLocation],
      ["Required Products", rfq.products],
      ["Quantities", rfq.quantities],
      ["Technical Notes", rfq.technicalRequirements],
    ], 'Open it in the dashboard: <a href="' + adminUrl + '" style="color:#D12129">' + adminUrl + "</a>"),
  }
}

export function rfqCustomerMail(rfq: { reference: string; fullName: string; locale: string }) {
  if (rfq.locale === "ar") {
    return {
      subject: "استلمنا طلبك " + rfq.reference + " | كيرماري",
      html: shell("استلمنا طلب عرض السعر", [
        ["الرقم المرجعي", rfq.reference],
        ["الاسم", rfq.fullName],
      ], "شكرًا لثقتك في كيرماري. فريقنا بيراجع متطلباتك وهنتواصل معاك قريبًا. برجاء الاحتفاظ بالرقم المرجعي في أي مراسلات."),
    }
  }

  return {
    subject: "We received your request " + rfq.reference + " | KIRMARY",
    html: shell("Your quotation request was received", [
      ["RFQ Reference", rfq.reference],
      ["Name", rfq.fullName],
    ], "Thank you for choosing KIRMARY. Our team is reviewing your requirements and will contact you shortly. Please keep this reference number for any follow-up."),
  }
}

export function messageTeamMail(input: {
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
}) {
  return {
    subject: "Website message from " + input.name,
    replyTo: input.email,
    html: shell("New contact message", [
      ["Name", input.name],
      ["Email", input.email],
      ["Phone", input.phone],
      ["Subject", input.subject],
      ["Message", input.message],
    ]),
  }
}
