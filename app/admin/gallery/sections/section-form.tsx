"use client"
import { uploadAdminFile } from "../../../../lib/admin-upload-client";

import { useState } from "react"
import { useRouter } from "next/navigation"

type SectionFormProps = {
  action: (formData: FormData) => Promise<void>
}

export default function SectionForm({
  action,
}: SectionFormProps) {
  const router = useRouter()

  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")
    setUploading(true)

    try {
      const form = event.currentTarget
      const formData = new FormData(form)
      // The file travels through the upload endpoint; save only its resulting path.
      formData.delete("coverImageFile")

      /*
       * Upload the section cover first.
       * The cover is stored separately from Gallery images.
       */
      if (coverFile) {
        const section = String(
          formData.get("slug") ?? ""
        ).trim()

        if (!section) {
          setError("Please enter the section slug first.")
          setUploading(false)
          return
        }

        const uploadData = new FormData()
        uploadData.append("file", coverFile)
        uploadData.append("section", section)
        uploadData.append("type", "cover")

        const response = await uploadAdminFile("/api/admin/gallery/upload", uploadData)

        const result = await response.json()

        if (!response.ok) {
          throw new Error(
            result.error || "Cover upload failed"
          )
        }

        formData.append(
          "coverImage",
          result.path
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
      setUploading(false)
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
      <div>
        <label htmlFor="name">
          Section Name (English)
        </label>

        <input
          id="name"
          name="name"
          required
          placeholder="KIRMARY VALVES"
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
          placeholder="كيرماري فالفات"
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
          placeholder="kirmary-valves"
          style={inputStyle}
        />

        <p
          style={{
            marginTop: "6px",
            fontSize: "13px",
            opacity: 0.6,
          }}
        >
          Use lowercase letters, numbers, and hyphens.
        </p>
      </div>

      <div>
        <label htmlFor="coverImage">
          Section Cover Image
        </label>

        <input
          id="coverImage"
          name="coverImageFile"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          onChange={(event) => {
            setCoverFile(
              event.target.files?.[0] ?? null
            )
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
          This image will be used as the section cover.
          It will NOT be counted as a Gallery image.
        </p>
      </div>

      <div>
        <label htmlFor="sortOrder">
          Sort Order
        </label>

        <input
          id="sortOrder"
          name="sortOrder"
          type="number"
          defaultValue={0}
          style={inputStyle}
        />
      </div>

      <label><input type="checkbox" name="visible" defaultChecked /> Visible</label>
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
          disabled={uploading}
          style={{
            padding: "12px 20px",
            border: 0,
            borderRadius: "8px",
            background: uploading
              ? "#777"
              : "#111",
            color: "#fff",
            cursor: uploading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {uploading
            ? "Creating Section..."
            : "Add Section"}
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
