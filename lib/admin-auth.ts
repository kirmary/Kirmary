import crypto from "node:crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// دخول الأدمن بأبسط طريقة آمنة: باسورد واحد في متغيرات البيئة،
// وكوكي موقّع بالـ HMAC عشان محدش يقدر يزوّره.
// مفيش جدول مستخدمين ومفيش تسجيل حسابات — انتي بس اللي بتدخلي.

const COOKIE_NAME = "km_admin"
const DAYS = 7

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET
  if (!value || value.length < 20) {
    throw new Error("ADMIN_SESSION_SECRET is missing or too short (min 20 chars)")
  }
  return value
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex")
}

// مقارنة آمنة ضد timing attacks
function safeEqual(a: string, b: string) {
  const bufferA = Buffer.from(a)
  const bufferB = Buffer.from(b)
  if (bufferA.length !== bufferB.length) return false
  return crypto.timingSafeEqual(bufferA, bufferB)
}

export function checkPassword(input: string) {
  const real = process.env.ADMIN_PASSWORD
  if (!real) return false
  // نعمل hash للاتنين الأول عشان المقارنة تبقى بنفس الطول دايمًا
  const hashOf = (value: string) =>
    crypto.createHash("sha256").update(value).digest("hex")
  return safeEqual(hashOf(input), hashOf(real))
}

function createToken() {
  const expiresAt = Date.now() + DAYS * 24 * 60 * 60 * 1000
  return String(expiresAt) + "." + sign(String(expiresAt))
}

function isValidToken(token: string | undefined) {
  if (!token) return false

  const [expiresPart, signature] = token.split(".")
  if (!expiresPart || !signature) return false
  if (!safeEqual(signature, sign(expiresPart))) return false

  return Number(expiresPart) > Date.now()
}

export async function startSession() {
  const store = await cookies()
  store.set(COOKIE_NAME, createToken(), {
    httpOnly: true,     // الجافاسكريبت في المتصفح مايقدرش يقراها
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DAYS * 24 * 60 * 60,
  })
}

export async function endSession() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export async function isAdmin() {
  const store = await cookies()
  return isValidToken(store.get(COOKIE_NAME)?.value)
}

// بنستخدمها في أول كل صفحة أدمن
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login")
}
