
"use client"
import { uploadAdminFile } from "../../../../lib/admin-upload-client";

import Link from "next/link"
import { useState } from "react"
import { createGalleryImage } from "../../actions"

type GallerySectionOption = {
  value: string
  label: string
}

type GalleryImageFormProps = {
  sections: GallerySectionOption[]
}

export default function GalleryImageForm({
  sections,
}: GalleryImageFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [section, setSection] = useState(
    sections[0]?.value ?? "general"
  )
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleFile = (selectedFile: File | null) => {
    if (!selectedFile) return

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select an image file.")
      return
    }

    setFile(selectedFile)
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!file) {
      alert("Please select an image.")
      return
    }

    try {
      setUploading(true)

      const formData = new FormData(event.currentTarget)
      formData.set("section", section)

      const uploadData = new FormData()
      uploadData.append("file", file)
      uploadData.append("section", section)

      const uploadResponse = await uploadAdminFile("/api/admin/gallery/upload", uploadData)

      const uploadText = await uploadResponse.text()

      let uploadResult: {
        success?: boolean
        path?: string
        error?: string
      } = {}

      try {
        uploadResult = JSON.parse(uploadText)
      } catch {
        throw new Error(
          `Upload API returned an invalid response (${uploadResponse.status}).`
        )
      }

      if (!uploadResponse.ok) {
        throw new Error(
          uploadResult.error || "Upload failed."
        )
      }

      if (!uploadResult.path) {
        throw new Error(
          "Upload succeeded but no image path was returned."
        )
      }

      formData.set("image", uploadResult.path)

      await createGalleryImage(formData)
    } catch (error) {
      if (error instanceof Error && error.message === "NEXT_REDIRECT") return
      console.error(error)

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <main
      style={{
        padding: "32px",
        maxWidth: "900px",
      }}
    >
      <div style={{ marginBottom: "28px" }}>
        <Link href="/admin/gallery">
          ← Back to Gallery
        </Link>

        <h1
          style={{
            marginTop: "20px",
            marginBottom: "8px",
          }}
        >
          Add Gallery Image
        </h1>

        <p style={{ opacity: 0.7 }}>
          Add a new image to the KIRMARY visual archive.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "20px",
        }}
      >
        <div>
          <label>Gallery Image</label>

          <div
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => {
              setDragging(false)
            }}
            onDrop={(event) => {
              event.preventDefault()
              setDragging(false)

              handleFile(
                event.dataTransfer.files?.[0] ?? null
              )
            }}
            onClick={() => {
              document
                .getElementById("file")
                ?.click()
            }}
            style={{
              marginTop: "8px",
              padding: "40px 20px",
              border: `2px dashed ${
                dragging ? "#111" : "#ccc"
              }`,
              borderRadius: "12px",
              textAlign: "center",
              background: dragging
                ? "#f5f5f5"
                : "#fafafa",
              cursor: "pointer",
            }}
          >
            {file ? (
              <div>
                <strong>{file.name}</strong>

                <p
                  style={{
                    marginTop: "8px",
                    opacity: 0.6,
                  }}
                >
                  Image selected successfully
                </p>
              </div>
            ) : (
              <>
                <strong>
                  Drag & Drop your image here
                </strong>

                <p
                  style={{
                    marginTop: "8px",
                    opacity: 0.6,
                  }}
                >
                  or click to choose an image
                </p>
              </>
            )}

            <input
              id="file"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(event) => {
                handleFile(
                  event.target.files?.[0] ?? null
                )
              }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="title">
            Title (English)
          </label>

          <input
            id="title"
            name="title"
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="titleAr">
            Title (Arabic)
          </label>

          <input
            id="titleAr"
            name="titleAr"
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="description">
            Description (English)
          </label>

          <textarea
            id="description"
            name="description"
            rows={4}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="descriptionAr">
            Description (Arabic)
          </label>

          <textarea
            id="descriptionAr"
            name="descriptionAr"
            rows={4}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="category">
            Category
          </label>

          <input
            id="category"
            name="category"
            placeholder="Projects, Products, Events..."
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="section">
            Gallery Section
          </label>

          <select
            id="section"
            name="section"
            value={section}
            onChange={(event) => {
              setSection(event.target.value)
            }}
            style={inputStyle}
          >
            {sections.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
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

        <label>
          <input
            type="checkbox"
            name="featured"
          />
          {" "}
          Featured image
        </label>

        <label>
          <input
            type="checkbox"
            name="visible"
            defaultChecked
          />
          {" "}
          Visible on website
        </label>

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
              background: "#111",
              color: "#fff",
              cursor: uploading
                ? "not-allowed"
                : "pointer",
              opacity: uploading ? 0.6 : 1,
            }}
          >
            {uploading
              ? "Uploading..."
              : "Add Image"}
          </button>

          <Link
            href="/admin/gallery"
            style={{
              padding: "12px 20px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
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

