import Link from "next/link"
import { isAdmin } from "../../lib/admin-auth"
import { logout } from "./actions"
import styles from "../../components/admin/admin.module.css"

export const metadata = { title: "Dashboard | KIRMARY" }

// كل صفحة تحت /admin بتمر من هنا الأول.
// isAdmin بترجّع أي حد مش مسجّل لصفحة الدخول.
// صفحة /admin/login عندها layout خاص بيها عشان تتخطى الحماية دي.

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!(await isAdmin())) return children

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
  <Link href="/admin/products">Products</Link>
  <Link href="/admin/projects">Projects</Link>
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
