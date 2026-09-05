import Link from "next/link"
import { isAdmin } from "../../lib/admin-auth"
import { logout } from "./actions"
import styles from "../../components/admin/admin.module.css"

export const metadata = { title: "Dashboard | KIRMARY" }

// ملاحظة مهمة:
// في Next.js الـ layout الداخلي مابيلغيش الـ layout الأب — بيتدمج جواه.
// فلو حطينا redirect هنا، صفحة /admin/login نفسها هتمر منه وتحوّل لنفسها للأبد.
// الحل: الـ layout بيرسم الشكل بس (مفيش تحويل)، وكل صفحة محمية
// بتنادي requireAdmin() في أول سطر عندها.

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const signedIn = await isAdmin()

  // صفحة الدخول: مفيش قائمة جانبية، الفورم لوحده في نص الشاشة
  if (!signedIn) return <>{children}</>

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          KIRMARY
          <span>DASHBOARD</span>
        </div>

        <nav className={styles.nav}>
          <Link href="/admin">Quotation requests</Link>
          <Link href="/admin/messages">Messages</Link>
          <Link href="/">View website</Link>
        </nav>

        <form action={logout} className={styles.logoutForm}>
          <button type="submit" className={styles.logout}>
            Sign out
          </button>
        </form>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  )
}