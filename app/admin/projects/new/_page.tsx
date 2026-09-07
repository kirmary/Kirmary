import Link from "next/link"
import { createProject } from "../../actions"
import { requireAdmin } from "../../../../lib/admin-auth"
import ProjectForm from "../project-form"

export default async function NewProjectPage() {
  await requireAdmin()

  return (
    <main
      style={{
        padding: "32px",
        maxWidth: "900px",
      }}
    >
      <div
        style={{
          marginBottom: "28px",
        }}
      >
        <Link href="/admin/projects">
          ← Back to Projects
        </Link>

        <h1
          style={{
            marginTop: "20px",
            marginBottom: "8px",
          }}
        >
          Add Project
        </h1>

        <p
          style={{
            opacity: 0.7,
          }}
        >
          Add a project reference and choose
          its image from your device.
        </p>
      </div>

      <ProjectForm
        action={createProject}
        submitLabel="Create Project"
      />
    </main>
  )
}
