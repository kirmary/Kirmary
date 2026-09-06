import Link from "next/link"
import { db } from "../../../lib/db"
import { requireAdmin } from "../../../lib/admin-auth"

export default async function AdminProjectsPage() {
  await requireAdmin()

  const projects = await db.project.findMany({
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "desc" },
    ],
  })

  return (
    <main style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: 0 }}>Projects</h1>
          <p style={{ marginTop: "8px", opacity: 0.7 }}>Manage KIRMARY project references</p>
        </div>

        <Link href="/admin/projects/new" style={primaryLinkStyle}>
          + Add Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div style={emptyStyle}>No projects yet.</div>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {projects.map(project => (
            <div key={project.id} style={rowStyle}>
              <div style={imageStyle}>
                <img src={project.image} alt={project.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>

              <div>
                <strong>{project.name}</strong>
                <div style={{ marginTop: "4px", opacity: 0.65 }}>{project.nameAr}</div>
                <div style={{ marginTop: "4px", fontSize: "13px", opacity: 0.65 }}>
                  #{String(project.sortOrder).padStart(2, "0")}{project.subtitle ? ` · ${project.subtitle}` : ""}
                </div>
              </div>

              <span style={{ display: "inline-block", padding: "5px 9px", borderRadius: "999px", fontSize: "12px", background: project.visible ? "#e8f7e8" : "#eee" }}>
                {project.visible ? "Visible" : "Hidden"}
              </span>

              <Link href={`/admin/projects/${project.id}`}>Edit</Link>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

const primaryLinkStyle = { padding: "10px 16px", borderRadius: "8px", background: "#111", color: "#fff", textDecoration: "none" }
const emptyStyle = { padding: "32px", border: "1px solid #ddd", borderRadius: "12px" }
const rowStyle = { display: "grid", gridTemplateColumns: "80px 1fr 140px 60px", gap: "16px", alignItems: "center", padding: "16px", border: "1px solid #ddd", borderRadius: "12px" }
const imageStyle = { width: "64px", height: "64px", borderRadius: "8px", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }
