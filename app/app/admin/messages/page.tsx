import { db } from "../../../lib/db"
import { requireAdmin } from "../../../lib/admin-auth"
import { StatusSelect } from "../../../components/admin/status-select"
import styles from "../../../components/admin/admin.module.css"

export default async function MessagesPage() {
  await requireAdmin()

  const rows = await db.message.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return (
    <>
      <header className={styles.pageHead}>
        <h1>Messages</h1>
        <p>Contact messages sent from the website.</p>
      </header>

      {rows.length === 0 ? (
        <p className={styles.empty}>No messages yet.</p>
      ) : (
        <div className={styles.messageList}>
          {rows.map((row) => (
            <article key={row.id} className={styles.messageCard}>
              <div className={styles.messageTop}>
                <div>
                  <strong>{row.name}</strong>
                  <small>
                    {row.email}
                    {row.phone ? " — " + row.phone : ""}
                  </small>
                </div>

                <StatusSelect id={row.id} value={row.status} kind="message" />
              </div>

              {row.subject ? <p className={styles.messageSubject}>{row.subject}</p> : null}

              <p className={styles.messageBody}>{row.message}</p>

              <div className={styles.messageFoot}>
                <span>{row.createdAt.toLocaleString("en-GB")}</span>
                <a href={"mailto:" + row.email}>Reply</a>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
