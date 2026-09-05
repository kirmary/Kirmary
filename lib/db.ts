import { PrismaClient } from "@prisma/client"

// اتصال واحد بقاعدة البيانات بيتشارك في كل المشروع.
// السبب: في وضع التطوير Next بيعيد تحميل الملفات كتير،
// ولو عملنا اتصال جديد كل مرة قاعدة البيانات هتزهق وترفض.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db
}
