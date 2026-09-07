"use client"
import { uploadAdminFile } from "../../../../lib/admin-upload-client";

import { useState } from "react"
import { useRouter } from "next/navigation"

type SectionEditFormProps = {
  action: (formData: FormData) => Promise<void>
  section: {
    id: string
    name: string
    nameAr: string
    slug: string
    coverImage: string | null
    sortOrder: number
    visible: boolean
  }
}

export default function SectionEditForm({
  action,
  section,
}: SectionEditFormProps) {
  const router = useRouter()

  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [removeCover, setRemoveCover] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")
    setSaving(true)

    try {
      const form = event.currentTarget
      const formData = new FormData(form)
      formData.delete("coverImageFile")

      /*
       * Upload a NEW cover only if the user selected one.
       */
      if (coverFile) {
        const slug = String(
          formData.get("slug") ?? ""
        ).trim()

        if (!slug) {
          throw new Error(
            "Please enter the section slug first."
          )
        }

        const uploadData = new FormData()

        uploadData.append(
          "file",
          coverFile
        )

        uploadData.append(
          "section",
          slug
        )

        uploadData.append(
          "type",
          "cover"
        )

        const response = await uploadAdminFile("/api/admin/gallery/upload", uploadData)

        const result = await response.json()

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Cover upload failed"
          )
        }

        formData.set(
          "coverImage",
          result.path
        )

        formData.set(
          "removeCover",
          "false"
        )
      } else if (removeCover) {
        /*
         * Empty coverImage means remove the current cover.
         */
        formData.set(
          "coverImage",
          ""
        )

        formData.set(
          "removeCover",
          "true"
        )
      } else {
        /*
         * Keep the existing cover.
         */
        formData.set(
          "coverImage",
          section.coverImage || ""
        )

        formData.set(
          "removeCover",
          "false"
        )
      }

      await action(formData)
    } catch (error) {
      if (error instanceof Error && error.message === "NEXT_REDIRECT") return
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      )

      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: "20px",
      }}
    >
      <input
        type="hidden"
        name="id"
        value={section.id}
      />

      <div>
        <label htmlFor="name">
          Section Name (English)
        </label>

        <input
          id="name"
          name="name"
          required
          defaultValue={section.name}
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="nameAr">
          Section Name (Arabic)
        </label>

        <input
          id="nameAr"
          name="nameAr"
          required
          defaultValue={section.nameAr}
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="slug">
          Slug
        </label>

        <input
          id="slug"
          name="slug"
          required
          defaultValue={section.slug}
          style={inputStyle}
        />

        <p
          style={{
            marginTop: "6px",
            fontSize: "13px",
            opacity: 0.6,
          }}
        >
          If you change the slug, existing images
          assigned to this section will be updated
          automatically.
        </p>
      </div>

      <div>
        <label>
          Section Cover Image
        </label>

        {section.coverImage &&
          !removeCover && (
            <div
              style={{
                marginTop: "10px",
                marginBottom: "12px",
              }}
            >
              <img
                src={section.coverImage}
                alt="Current section cover"
                style={{
                  width: "100%",
                  maxWidth: "420px",
                  height: "220px",
                  objectFit: "cover",
                  display: "block",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                }}
              />

              <p
                style={{
                  marginTop: "8px",
                  fontSize: "13px",
                  opacity: 0.6,
                }}
              >
                Current section cover
              </p>
            </div>
          )}

        <input
          id="coverImageFile"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          onChange={(event) => {
            const file =
              event.target.files?.[0] ?? null

            setCoverFile(file)

            if (file) {
              setRemoveCover(false)
            }
          }}
          style={{
            display: "block",
            marginTop: "7px",
          }}
        />

        <p
          style={{
            marginTop: "6px",
            fontSize: "13px",
            opacity: 0.6,
          }}
        >
          Uploading a new image will replace the
          current section cover.
        </p>

        {section.coverImage && (
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "12px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={removeCover}
              onChange={(event) => {
                setRemoveCover(
                  event.target.checked
                )

                if (event.target.checked) {
                  setCoverFile(null)
                }
              }}
            />

            <span>
              Remove current cover
            </span>
          </label>
        )}
      </div>

      <div>
        <label htmlFor="sortOrder">
          Sort Order
        </label>

        <input
          id="sortOrder"
          name="sortOrder"
          type="number"
          defaultValue={section.sortOrder}
          style={inputStyle}
        />
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          name="visible"
          defaultChecked={section.visible}
        />

        <span>
          Visible
        </span>
      </label>

      {error && (
        <div
          style={{
            padding: "12px",
            borderRadius: "8px",
            background: "#fee2e2",
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "10px",
        }}
      >
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "12px 20px",
            border: 0,
            borderRadius: "8px",
            background: saving
              ? "#777"
              : "#111",
            color: "#fff",
            cursor: saving
              ? "not-allowed"
              : "pointer",
          }}
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={() =>
            router.push("/admin/gallery")
          }
          style={{
            padding: "12px 20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

const inputStyle = {
  display: "block",
  width: "100%",
  marginTop: "7px",
  padding: "11px 12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "15px",
  boxSizing: "border-box" as const,
}
