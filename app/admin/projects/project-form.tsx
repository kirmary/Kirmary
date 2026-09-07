"use client"

import { useRef, useState } from "react"
import { uploadAdminFile } from "../../../lib/admin-upload-client"

type ProjectValue = {
  slug: string
  name: string
  nameAr: string
  image: string
  subtitle: string | null
  subtitleAr: string | null
  sortOrder: number
  visible: boolean
}

type ProjectFormProps = {
  project?: ProjectValue
  action: (formData: FormData) => Promise<void>
  submitLabel: string
}

export default function ProjectForm({
  project,
  action,
  submitLabel,
}: ProjectFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  const [image, setImage] = useState(
    project?.image ?? ""
  )

  const [dragging, setDragging] =
    useState(false)

  const [uploading, setUploading] =
    useState(false)

  const [error, setError] =
    useState("")

  const [status, setStatus] =
    useState("")

  async function handleImage(
    file: File | null
  ) {
    if (!file || uploading) {
      return
    }

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select an image file."
      )
      return
    }

    const form = formRef.current

    if (!form) {
      return
    }

    const slug = String(
      new FormData(form).get("slug") ?? ""
    ).trim()

    if (!slug) {
      setError(
        "Enter the project Slug first, then choose the image."
      )
      return
    }

    try {
      setUploading(true)
      setError("")
      setStatus(
        `Uploading ${file.name}...`
      )

      const uploadData =
        new FormData()

      uploadData.set("file", file)
      uploadData.set("slug", slug)

      /*
       * بنستخدم نفس uploader الشغال بالفعل
       * مع صور الـProducts.
       * النتيجة بترجع path جاهز للحفظ في Project.image.
       */
      uploadData.set("type", "image")

      const response =
        await uploadAdminFile(
          "/api/admin/products/upload",
          uploadData
        )

      const result =
        (await response.json()) as {
          path?: string
          originalFileName?: string
          error?: string
        }

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Image upload failed."
        )
      }

      if (!result.path) {
        throw new Error(
          "Upload succeeded but no image path was returned."
        )
      }

      setImage(result.path)

      setStatus(
        "Project image uploaded successfully."
      )
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Image upload failed."
      )

      setStatus("")
    } finally {
      setUploading(false)
    }
  }

  return (
    <form
      ref={formRef}
      action={action}
      style={{
        display: "grid",
        gap: "20px",
      }}
    >
      <Field
        label="Project Name (English)"
        name="name"
        value={project?.name}
        required
      />

      <Field
        label="Project Name (Arabic)"
        name="nameAr"
        value={project?.nameAr}
        required
      />

      <Field
        label="Slug"
        name="slug"
        value={project?.slug}
        required
      />

      {/* PROJECT IMAGE */}

      <div>
        <label>
          Project Image
        </label>

        <input
          type="hidden"
          name="image"
          value={image}
        />

        <div
          onDragOver={(event) => {
            event.preventDefault()

            if (!uploading) {
              setDragging(true)
            }
          }}
          onDragLeave={() => {
            setDragging(false)
          }}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)

            if (uploading) {
              return
            }

            void handleImage(
              event.dataTransfer
                .files?.[0] ?? null
            )
          }}
          onClick={() => {
            if (uploading) {
              return
            }

            window.document
              .getElementById(
                "project-image-file"
              )
              ?.click()
          }}
          style={{
            marginTop: "8px",
            padding: image
              ? "18px"
              : "42px 20px",
            border: `2px dashed ${
              dragging
                ? "#111"
                : "#bbb"
            }`,
            borderRadius: "12px",
            background: dragging
              ? "#f3f3f3"
              : "#fafafa",
            cursor: uploading
              ? "not-allowed"
              : "pointer",
            textAlign: "center",
          }}
        >
          {image ? (
            <>
              <img
                src={image}
                alt="Project preview"
                style={{
                  display: "block",
                  width: "100%",
                  maxWidth: "520px",
                  height: "280px",
                  margin: "0 auto",
                  objectFit: "contain",
                  background: "#fff",
                  borderRadius: "8px",
                }}
              />

              <strong
                style={{
                  display: "block",
                  marginTop: "14px",
                }}
              >
                Click or drop another image
                to replace it
              </strong>
            </>
          ) : (
            <>
              <strong>
                Drag & Drop project image here
              </strong>

              <p
                style={{
                  marginBottom: 0,
                  opacity: 0.6,
                }}
              >
                or click to choose an image
              </p>
            </>
          )}

          <input
            id="project-image-file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            disabled={uploading}
            style={{
              display: "none",
            }}
            onChange={(event) => {
              void handleImage(
                event.target
                  .files?.[0] ?? null
              )

              event.currentTarget.value =
                ""
            }}
          />
        </div>

        {image && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => {
              setImage("")
              setStatus("")
              setError("")
            }}
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              background: "#fff",
              cursor: uploading
                ? "not-allowed"
                : "pointer",
            }}
          >
            Remove image
          </button>
        )}
      </div>

      <Field
        label="Subtitle / Location (English)"
        name="subtitle"
        value={project?.subtitle ?? ""}
      />

      <Field
        label="Subtitle / Location (Arabic)"
        name="subtitleAr"
        value={project?.subtitleAr ?? ""}
      />

      <Field
        label="Sort Order"
        name="sortOrder"
        value={project?.sortOrder ?? 0}
        type="number"
        required
      />

      <label>
        <input
          type="checkbox"
          name="visible"
          defaultChecked={
            project?.visible ?? true
          }
        />{" "}
        Visible on website
      </label>

      {error && (
        <p
          role="alert"
          style={{
            margin: 0,
            color: "#a71920",
          }}
        >
          {error}
        </p>
      )}

      {status && (
        <p
          role="status"
          style={{
            margin: 0,
          }}
        >
          {status}
        </p>
      )}

      <button
        type="submit"
        disabled={
          uploading || !image
        }
        style={{
          ...primaryButtonStyle,
          cursor:
            uploading || !image
              ? "not-allowed"
              : "pointer",
          opacity:
            uploading || !image
              ? 0.55
              : 1,
        }}
      >
        {uploading
          ? "Uploading..."
          : submitLabel}
      </button>
    </form>
  )
}

function Field({
  label,
  name,
  value,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string
  name: string
  value?: string | number
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={name}>
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        required={required}
        style={inputStyle}
      />
    </div>
  )
}

export const inputStyle = {
  display: "block",
  width: "100%",
  marginTop: "7px",
  padding: "11px 12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "15px",
  boxSizing: "border-box" as const,
}

export const primaryButtonStyle = {
  padding: "12px 20px",
  border: 0,
  borderRadius: "8px",
  background: "#111",
  color: "#fff",
  width: "max-content",
}
