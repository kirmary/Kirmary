import { login } from "../actions"
import { isAdmin } from "../../../lib/admin-auth"
import { redirect } from "next/navigation"
import styles from "../../../components/admin/admin.module.css"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  // لو داخلة بالفعل، مفيش لزوم لصفحة الدخول
  if (await isAdmin()) redirect("/admin")

  const { error } = await searchParams

  return (
    <div className={styles.loginPage}>
      <form className={styles.loginCard} action={login}>
        <div className={styles.loginBrand}>
          KIRMARY
          <span>DASHBOARD</span>
        </div>

        <h1 className={styles.loginTitle}>Sign in</h1>

        {error ? (
          <p className={styles.loginError} role="alert">
            Incorrect password.
          </p>
        ) : null}

        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className={styles.input}
          autoComplete="current-password"
          autoFocus
          required
        />

        <button type="submit" className={styles.primaryButton}>
          Sign in
        </button>
      </form>
    </div>
  )
}
