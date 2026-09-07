import Link from "next/link"
import { db } from "../../../../lib/db"
import {
  deleteProject,
  hideProject,
  showProject,
  updateProject,
} from "../../actions"
import { requireAdmin } from "../../../../lib/admin-auth"
import ProjectForm, {
  inputStyle,
} from "../project-form"

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) {
  await requireAdmin()

  const { id } = await params

  const project =
    await db.project.findUnique({
      where: { id },
    })

  if (!project) {
    return (
      <main
        style={{
          padding: "40px",
        }}
      >
        <h1>Project not found</h1>

        <Link href="/admin/projects">
          ← Back to Projects
        </Link>
      </main>
    )
  }

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
          Edit Project
        </h1>

        <p
          style={{
            opacity: 0.7,
          }}
        >
          Edit project information or choose
          a replacement project image.
        </p>
      </div>

      <ProjectForm
        project={project}
        action={updateProject}
        submitLabel="Save Changes"
      />

      {project.visible ? (
        <form
          action={hideProject}
          style={{
            marginTop: "28px",
          }}
        >
          <input
            type="hidden"
            name="id"
            value={project.id}
          />

          <input
            type="hidden"
            name="slug"
            value={project.slug}
          />

          <button
            type="submit"
            style={secondaryButtonStyle}
          >
            Hide from website
          </button>
        </form>
      ) : (
        <form
          action={showProject}
          style={{
            marginTop: "28px",
          }}
        >
          <input
            type="hidden"
            name="id"
            value={project.id}
          />

          <input
            type="hidden"
            name="slug"
            value={project.slug}
          />

          <button
            type="submit"
            style={secondaryButtonStyle}
          >
            Show on website
          </button>
        </form>
      )}

      <form
        action={deleteProject}
        style={{
          marginTop: "28px",
          paddingTop: "24px",
          borderTop: "1px solid #ddd",
        }}
      >
        <input
          type="hidden"
          name="id"
          value={project.id}
        />

        <input
          type="hidden"
          name="slug"
          value={project.slug}
        />

        <label htmlFor="confirmation">
          Permanently delete this project —
          type{" "}
          <strong>
            {project.slug}
          </strong>{" "}
          to confirm
        </label>

        <input
          id="confirmation"
          name="confirmation"
          required
          autoComplete="off"
          style={inputStyle}
        />

        <button
          type="submit"
          style={deleteButtonStyle}
        >
          Permanently Delete Project
        </button>
      </form>
    </main>
  )
}

const secondaryButtonStyle = {
  padding: "10px 16px",
  border: "1px solid #777",
  borderRadius: "8px",
  background: "#fff",
  color: "#222",
  cursor: "pointer",
}

const deleteButtonStyle = {
  marginTop: "12px",
  padding: "10px 16px",
  border: 0,
  borderRadius: "8px",
  background: "#a71920",
  color: "#fff",
  cursor: "pointer",
}
