// حماية بسيطة: نفس الجهاز مش هيبعت أكتر من عدد معين في الساعة.
// دي محفوظة في ذاكرة السرفر، فبتصفّر مع كل نشر جديد. كفاية للبداية.

type Entry = { count: number; resetAt: number }

const buckets = new Map<string, Entry>()
const WINDOW_MS = 60 * 60 * 1000 // ساعة

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return request.headers.get("x-real-ip") ?? "unknown"
}

export function rateLimit(key: string, max: number) {
  const now = Date.now()
  const entry = buckets.get(key)

  if (!entry || entry.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, remaining: max - 1 }
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0 }
  }

  entry.count += 1
  return { allowed: true, remaining: max - entry.count }
}
