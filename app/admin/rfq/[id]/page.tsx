import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "../../../../lib/db"
import { StatusSelect } from "../../../../components/admin/status-select"
import { NoteBox } from "../../../../components/admin/note-box"
import styles from "../../../../components/admin/admin.module.css"

export default async function RfqDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const rfq = await db.rfq.findUnique({ where: { id } })
  if (!rfq) notFound()

  const rows: Array<[string, string | null]> = [
    ["Full name", rfq.fullName],
    ["Work email", rfq.workEmail],
    ["Phone / WhatsApp", rfq.phone],
    ["Company", rfq.companyName],
    ["Project name", rfq.projectName],
    ["Project location", rfq.projectLocation],
    ["Required products", rfq.products],
    ["Quantities", rfq.quantities],
    ["Technical requirements", rfq.technicalRequirements],
    ["Language", rfq.locale.toUpperCase()],
    ["Received", rfq.createdAt.toLocaleString("en-GB")],
  ]

  return (
    <>
      <Link href="/admin" className={styles.backLink}>
        Back to all requests
      </Link>

      <header className={styles.pageHead}>
        <h1>{rfq.reference}</h1>
        <p>{rfq.projectName}</p>
      </header>

      <div className={styles.detailActions}>
        <StatusSelect id={rfq.id} value={rfq.status} kind="rfq" />

        <a className={styles.replyButton} href={"mailto:" + rfq.workEmail + "?subject=" + encodeURIComponent("KIRMARY " + rfq.reference)}>
          Reply by email
        </a>

        <a className={styles.replyButton} href={"tel:" + rfq.phone}>
          Call
        </a>
      </div>

      <div className={styles.detailCard}>
        <table className={styles.detailTable}>
          <tbody>
            {rows.map(([label, value]) =>
              value ? (
                <tr key={label}>
                  <th>{label}</th>
                  <td>{value}</td>
                </tr>
              ) : null,
            )}
          </tbody>
        </table>
      </div>

      <NoteBox id={rfq.id} value={rfq.note ?? ""} />
    </>
  )
}
