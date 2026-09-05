import crypto from "node:crypto"

// نفس شكل الرقم المرجعي اللي الفورم بيولّده: RFQ-20260904-A7B3X
// بس دلوقتي بيتولّد على السرفر وبيتخزّن في قاعدة البيانات،
// فلو العميل اتصل وقال الرقم ده تلاقيه فورًا في لوحة التحكم.

export function createReference() {
  const now = new Date()

  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("")

  // 5 حروف عشوائية بشكل آمن (مش Math.random)
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  const bytes = crypto.randomBytes(5)
  let randomPart = ""
  for (const byte of bytes) {
    randomPart += alphabet[byte % alphabet.length]
  }

  return "RFQ-" + datePart + "-" + randomPart
}
