import Link from "next/link"
import { db } from "../../lib/db"
import { StatusSelect } from "../../components/admin/status-select"
import styles from "../../components/admin/admin.module.css"

const PER_PAGE = 20

const RFQ_STATUSES = ["NEW", "IN_REVIEW", "QUOTED", "WON", "LOST"]

function formatDate(value: Date) {
  return value.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function RfqInboxPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const { q, status, page } = await searchParams

  const currentPage = Math.max(1, Number(page ?? 1) || 1)
  const search = (q ?? "").trim()
  const activeStatus = RFQ_STATUSES.includes(status ?? "") ? status : undefined

  // بناء شرط البحث
  const where = {
    ...(activeStatus ? { status: activeStatus as never } : {}),
    ...(search
      ? {
          OR: [
            { reference: { contains: search, mode: "insensitive" as const } },
            { fullName: { contains: search, mode: "insensitive" as const } },
            { workEmail: { contains: search, mode: "insensitive" as const } },
            { companyName: { contains: search, mode: "insensitive" as const } },
            { projectName: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  }

  const [rows, total, counts, newMessages] = await Promise.all([
    db.rfq.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    db.rfq.count({ where }),
    db.rfq.groupBy({ by: ["status"], _count: { _all: true } }),
    db.message.count({ where: { status: "NEW" } }),
  ])

  const countOf = (value: string) =>
    counts.find((row) => row.status === value)?._count._all ?? 0

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  return (
    <>
      <header className={styles.pageHead}>
        <h1>Quotation requests</h1>
        <p>Every RFQ submitted from the website, stored and searchable.</p>
      </header>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <strong>{countOf("NEW")}</strong>
          <span>New</span>
        </div>
        <div className={styles.stat}>
          <strong>{countOf("IN_REVIEW")}</strong>
          <span>In review</span>
        </div>
        <div className={styles.stat}>
          <strong>{countOf("QUOTED")}</strong>
          <span>Quoted</span>
        </div>
        <div className={styles.stat}>
          <strong>{countOf("WON")}</strong>
          <span>Won</span>
        </div>
        <Link href="/admin/messages" className={styles.stat}>
          <strong>{newMessages}</strong>
          <span>New messages</span>
        </Link>
      </div>

      <form className={styles.filters} action="/admin">
        <input
          name="q"
          className={styles.input}
          placeholder="Search reference, name, email, company, project..."
          defaultValue={search}
        />

        <select name="status" className={styles.input} defaultValue={activeStatus ?? ""}>
          <option value="">All statuses</option>
          {RFQ_STATUSES.map((value) => (
            <option key={value} value={value}>
              {value.replace("_", " ")}
            </option>
          ))}
        </select>

        <button type="submit" className={styles.primaryButton}>
          Filter
        </button>
      </form>

      {rows.length === 0 ? (
        <p className={styles.empty}>No quotation requests found.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Customer</th>
                <th>Project</th>
                <th>Received</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Link href={"/admin/rfq/" + row.id} className={styles.reference}>
                      {row.reference}
                    </Link>
                  </td>
                  <td>
                    <strong>{row.fullName}</strong>
                    <small>{row.companyName ?? row.workEmail}</small>
                  </td>
                  <td>
                    {row.projectName}
                    <small>{row.projectLocation ?? ""}</small>
                  </td>
                  <td>{formatDate(row.createdAt)}</td>
                  <td>
                    <StatusSelect id={row.id} value={row.status} kind="rfq" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 ? (
        <nav className={styles.pager}>
          {currentPage > 1 ? (
            <Link
              href={"/admin?page=" + (currentPage - 1) + "&q=" + encodeURIComponent(search)}
            >
              Previous
            </Link>
          ) : null}

          <span>
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages ? (
            <Link
              href={"/admin?page=" + (currentPage + 1) + "&q=" + encodeURIComponent(search)}
            >
              Next
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  )
}
