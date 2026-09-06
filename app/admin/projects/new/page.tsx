import Link from "next/link"
import { createProject } from "../../actions"
import { requireAdmin } from "../../../../lib/admin-auth"

export default async function NewProjectPage() {
  await requireAdmin()

  return (
    <main style={{ padding: "32px", maxWidth: "900px" }}>
      <div style={{ marginBottom: "28px" }}>
        <Link href="/admin/projects">← Back to Projects</Link>
        <h1 style={{ marginTop: "20px", marginBottom: "8px" }}>Add Project</h1>
        <p style={{ opacity: 0.7 }}>Add a project reference using an existing public image path.</p>
      </div>

      <form action={createProject} style={{ display: "grid", gap: "20px" }}>
        <ProjectFields />
        <button type="submit" style={primaryButtonStyle}>Create Project</button>
      </form>
    </main>
  )
}

export function ProjectFields({ project }: { project?: { slug: string; name: string; nameAr: string; image: string; subtitle: string | null; subtitleAr: string | null; sortOrder: number; visible: boolean } }) {
  return <>
    <Field label="Project Name (English)" name="name" value={project?.name} required />
    <Field label="Project Name (Arabic)" name="nameAr" value={project?.nameAr} required />
    <Field label="Slug" name="slug" value={project?.slug} required />
    <Field label="Image Path" name="image" value={project?.image} placeholder="/projects/project-image.png" required />
    <Field label="Subtitle / Location (English)" name="subtitle" value={project?.subtitle ?? ""} />
    <Field label="Subtitle / Location (Arabic)" name="subtitleAr" value={project?.subtitleAr ?? ""} />
    <Field label="Sort Order" name="sortOrder" value={project?.sortOrder ?? 0} type="number" required />
    <label><input type="checkbox" name="visible" defaultChecked={project?.visible ?? true} />{" "}Visible on website</label>
  </>
}

function Field({ label, name, value, placeholder, type = "text", required = false }: { label: string; name: string; value?: string | number; placeholder?: string; type?: string; required?: boolean }) {
  return <div>
    <label htmlFor={name}>{label}</label>
    <input id={name} name={name} type={type} defaultValue={value} placeholder={placeholder} required={required} style={inputStyle} />
  </div>
}

export const inputStyle = { display: "block", width: "100%", marginTop: "7px", padding: "11px 12px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "15px", boxSizing: "border-box" as const }
export const primaryButtonStyle = { padding: "12px 20px", border: 0, borderRadius: "8px", background: "#111", color: "#fff", cursor: "pointer", width: "max-content" }
