// تحقق يدوي بسيط. مفيش مكتبات.
// كل فانكشن بترجّع الأخطاء في كائن: { fieldName: "رسالة الخطأ" }

export type FieldErrors = Record<string, string>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function str(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function optional(value: unknown) {
  const text = str(value)
  return text.length ? text.slice(0, 2000) : null
}

export type RfqInput = {
  fullName: string
  workEmail: string
  phone: string
  companyName: string | null
  projectName: string
  projectLocation: string | null
  products: string
  quantities: string | null
  technicalRequirements: string | null
  locale: string
}

export function validateRfq(body: Record<string, unknown>) {
  const errors: FieldErrors = {}

  const fullName = str(body.fullName)
  const workEmail = str(body.workEmail).toLowerCase()
  const phone = str(body.phone)
  const projectName = str(body.projectName)
  const products = str(body.products)

  if (fullName.length < 2) errors.fullName = "Please enter your full name."
  if (!EMAIL.test(workEmail)) errors.workEmail = "Please enter a valid email address."
  if (phone.length < 6) errors.phone = "Please enter a valid phone number."
  if (projectName.length < 2) errors.projectName = "Please enter the project name."
  if (products.length < 3) errors.products = "Please enter the required products."

  if (Object.keys(errors).length) return { errors, data: null }

  const locale = str(body.locale) === "ar" ? "ar" : "en"

  const data: RfqInput = {
    fullName: fullName.slice(0, 120),
    workEmail: workEmail.slice(0, 160),
    phone: phone.slice(0, 40),
    companyName: optional(body.companyName),
    projectName: projectName.slice(0, 200),
    projectLocation: optional(body.projectLocation),
    products: products.slice(0, 3000),
    quantities: optional(body.quantities),
    technicalRequirements: optional(body.technicalRequirements),
    locale,
  }

  return { errors: null, data }
}

export type MessageInput = {
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  locale: string
}

export function validateMessage(body: Record<string, unknown>) {
  const errors: FieldErrors = {}

  const name = str(body.name)
  const email = str(body.email).toLowerCase()
  const message = str(body.message)

  if (name.length < 2) errors.name = "Please enter your name."
  if (!EMAIL.test(email)) errors.email = "Please enter a valid email address."
  if (message.length < 10) errors.message = "Please write at least 10 characters."

  if (Object.keys(errors).length) return { errors, data: null }

  const data: MessageInput = {
    name: name.slice(0, 120),
    email: email.slice(0, 160),
    phone: optional(body.phone),
    subject: optional(body.subject),
    message: message.slice(0, 3000),
    locale: str(body.locale) === "ar" ? "ar" : "en",
  }

  return { errors: null, data }
}
