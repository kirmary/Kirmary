"use client"

import { uploadAdminFile } from "../../../../lib/admin-upload-client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createGalleryImage } from "../../actions"

type GallerySectionOption = {
  value: string
  label: string
}

type GalleryImageFormProps = {
  sections: GallerySectionOption[]
}

function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`
}

function titleFromFileName(fileName: string) {
  const withoutExtension = fileName.replace(/\.[^/.]+$/, "")

  const cleaned = withoutExtension
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  return cleaned || "Gallery Image"
}

export default function GalleryImageForm({
  sections,
}: GalleryImageFormProps) {
  const router = useRouter()

  const [files, setFiles] = useState<File[]>([])

  const [section, setSection] = useState(
    sections[0]?.value ?? "general"
  )

  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [processedCount, setProcessedCount] =
    useState(0)

  const [currentFileName, setCurrentFileName] =
    useState("")

  const addFiles = (fileList: FileList | File[]) => {
    const selectedFiles = Array.from(fileList)

    const images = selectedFiles.filter(
      (file) => file.type.startsWith("image/")
    )

    const rejectedCount =
      selectedFiles.length - images.length

    if (rejectedCount > 0) {
      alert(
        `${rejectedCount} file(s) were ignored because they are not images.`
      )
    }

    setFiles((currentFiles) => {
      const existing = new Map(
        currentFiles.map((file) => [
          fileKey(file),
          file,
        ])
      )

      for (const image of images) {
        existing.set(
          fileKey(image),
          image
        )
      }

      return Array.from(existing.values())
    })
  }

  const removeFile = (fileToRemove: File) => {
    const key = fileKey(fileToRemove)

    setFiles((currentFiles) =>
      currentFiles.filter(
        (file) => fileKey(file) !== key
      )
    )
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!files.length) {
      alert("Please select one or more images.")
      return
    }

    if (!section) {
      alert("Please select a Gallery Section.")
      return
    }

    const formData =
      new FormData(event.currentTarget)

    const category = String(
      formData.get("category") ?? ""
    ).trim()

    const startSortOrder = Number(
      formData.get("sortOrder") ?? 0
    )

    const visible =
      formData.get("visible") === "on"

    try {
      setUploading(true)
      setProcessedCount(0)
      setCurrentFileName("")

      const uploadedImages: Array<{
        image: string
        title: string
        titleAr: string
        category: string | null
        section: string
        visible: boolean
        sortOrder: number
      }> = []

      const failedFiles: string[] = []

      for (
        let index = 0;
        index < files.length;
        index++
      ) {
        const file = files[index]

        setCurrentFileName(file.name)

        try {
          const uploadData = new FormData()

          uploadData.append(
            "file",
            file
          )

          uploadData.append(
            "section",
            section
          )

          const uploadResponse =
            await uploadAdminFile(
              "/api/admin/gallery/upload",
              uploadData
            )

          const uploadText =
            await uploadResponse.text()

          let uploadResult: {
            success?: boolean
            path?: string
            error?: string
          } = {}

          try {
            uploadResult =
              JSON.parse(uploadText)
          } catch {
            throw new Error(
              `Upload API returned an invalid response (${uploadResponse.status}).`
            )
          }

          if (!uploadResponse.ok) {
            throw new Error(
              uploadResult.error ||
                "Upload failed."
            )
          }

          if (!uploadResult.path) {
            throw new Error(
              "Upload succeeded but no image path was returned."
            )
          }

          const automaticTitle =
            titleFromFileName(file.name)

          uploadedImages.push({
            image: uploadResult.path,

            // اسم الملف بيتحول تلقائيًا لـ Title
            title: automaticTitle,

            // لأن Title Arabic مطلوب في الـDatabase
            // بنستخدم نفس اسم الملف تلقائيًا
            titleAr: automaticTitle,

            category:
              category || null,

            section,

            visible,

            sortOrder:
              (Number.isFinite(
                startSortOrder
              )
                ? startSortOrder
                : 0) + index,
          })
        } catch (error) {
          console.error(
            `Failed to upload ${file.name}`,
            error
          )

          failedFiles.push(file.name)
        }

        setProcessedCount(index + 1)
      }

      if (!uploadedImages.length) {
        throw new Error(
          "None of the selected images could be uploaded."
        )
      }

      await Promise.all(
        uploadedImages.map((image) => {
          const imageFormData = new FormData()

          imageFormData.append("image", image.image)
          imageFormData.append("title", image.title)
          imageFormData.append("titleAr", image.titleAr)
          imageFormData.append(
            "category",
            image.category ?? ""
          )
          imageFormData.append("section", image.section)
          imageFormData.append(
            "visible",
            String(image.visible)
          )
          imageFormData.append(
            "sortOrder",
            String(image.sortOrder)
          )

          return createGalleryImage(imageFormData)
        })
      )

      const result = {
        created: uploadedImages.length,
      }

      if (
        !result ||
        result.created === 0
      ) {
        throw new Error(
          "Images were uploaded but could not be added to the gallery database."
        )
      }

      if (failedFiles.length > 0) {
        alert(
          `${result.created} image(s) added successfully.\n\n${failedFiles.length} image(s) failed:\n${failedFiles.join(
            "\n"
          )}`
        )
      } else {
        alert(
          `${result.created} images uploaded successfully.`
        )
      }

      router.push("/admin/gallery")
      router.refresh()
    } catch (error) {
      console.error(error)

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      )
    } finally {
      setUploading(false)
      setCurrentFileName("")
    }
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
        <Link href="/admin/gallery">
          ← Back to Gallery
        </Link>

        <h1
          style={{
            marginTop: "20px",
            marginBottom: "8px",
          }}
        >
          Add Gallery Images
        </h1>

        <p style={{ opacity: 0.7 }}>
          Drag and drop multiple images and
          upload them to one gallery section.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "20px",
        }}
      >
        {/* MULTIPLE IMAGE DROP ZONE */}

        <div>
          <label>
            Gallery Images
          </label>

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

              if (uploading) return

              addFiles(
                event.dataTransfer.files
              )
            }}
            onClick={() => {
              if (uploading) return

              document
                .getElementById(
                  "gallery-files"
                )
                ?.click()
            }}
            style={{
              marginTop: "8px",
              padding: "48px 20px",

              border: `2px dashed ${
                dragging
                  ? "#111"
                  : "#ccc"
              }`,

              borderRadius: "12px",

              textAlign: "center",

              background: dragging
                ? "#f5f5f5"
                : "#fafafa",

              cursor: uploading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {files.length > 0 ? (
              <>
                <strong
                  style={{
                    fontSize: "20px",
                  }}
                >
                  {files.length} images
                  selected
                </strong>

                <p
                  style={{
                    marginTop: "8px",
                    opacity: 0.6,
                  }}
                >
                  Drop more images here or
                  click to add more
                </p>
              </>
            ) : (
              <>
                <strong
                  style={{
                    fontSize: "18px",
                  }}
                >
                  Drag & Drop ALL images here
                </strong>

                <p
                  style={{
                    marginTop: "8px",
                    opacity: 0.6,
                  }}
                >
                  or click to select multiple
                  images
                </p>
              </>
            )}

            <input
              id="gallery-files"
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              style={{
                display: "none",
              }}
              onChange={(event) => {
                if (
                  event.target.files
                ) {
                  addFiles(
                    event.target.files
                  )
                }

                // يسمح باختيار نفس الصور تاني
                event.currentTarget.value =
                  ""
              }}
            />
          </div>
        </div>

        {/* SELECTED IMAGES */}

        {files.length > 0 && (
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "16px",
              background: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              <strong>
                Selected Images (
                {files.length})
              </strong>

              <button
                type="button"
                disabled={uploading}
                onClick={() =>
                  setFiles([])
                }
                style={{
                  border: 0,
                  background:
                    "transparent",
                  cursor: uploading
                    ? "not-allowed"
                    : "pointer",
                  color: "#c00",
                }}
              >
                Clear All
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gap: "8px",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {files.map(
                (file, index) => (
                  <div
                    key={fileKey(file)}
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      gap: "12px",
                      padding:
                        "10px 12px",
                      border:
                        "1px solid #eee",
                      borderRadius:
                        "8px",
                    }}
                  >
                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <strong>
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                        {" · "}
                        {file.name}
                      </strong>

                      <div
                        style={{
                          marginTop:
                            "3px",
                          fontSize:
                            "12px",
                          opacity: 0.55,
                        }}
                      >
                        {(
                          file.size /
                          1024 /
                          1024
                        ).toFixed(2)}{" "}
                        MB
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={
                        uploading
                      }
                      onClick={() =>
                        removeFile(
                          file
                        )
                      }
                      style={{
                        border: 0,
                        background:
                          "transparent",
                        color: "#c00",
                        cursor:
                          uploading
                            ? "not-allowed"
                            : "pointer",
                        fontSize:
                          "18px",
                      }}
                    >
                      ×
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* SECTION */}

        <div>
          <label htmlFor="section">
            Gallery Section
          </label>

          <select
            id="section"
            name="section"
            value={section}
            disabled={uploading}
            onChange={(event) => {
              setSection(
                event.target.value
              )
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

        {/* CATEGORY */}

        <div>
          <label htmlFor="category">
            Category
          </label>

          <input
            id="category"
            name="category"
            placeholder="Events, Products, Exhibitions..."
            disabled={uploading}
            style={inputStyle}
          />
        </div>

        {/* STARTING SORT ORDER */}

        <div>
          <label htmlFor="sortOrder">
            Starting Sort Order
          </label>

          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={0}
            disabled={uploading}
            style={inputStyle}
          />

          <small
            style={{
              display: "block",
              marginTop: "7px",
              opacity: 0.6,
            }}
          >
            Images will automatically become
            0, 1, 2, 3...
          </small>
        </div>

        {/* VISIBILITY */}

        <label>
          <input
            type="checkbox"
            name="visible"
            defaultChecked
            disabled={uploading}
          />
          {" "}
          Visible on website
        </label>

        {/* UPLOAD PROGRESS */}

        {uploading && (
          <div
            style={{
              padding: "18px",
              borderRadius: "10px",
              background: "#f5f5f5",
              border: "1px solid #ddd",
            }}
          >
            <strong>
              Uploading {processedCount} /{" "}
              {files.length}
            </strong>

            {currentFileName && (
              <p
                style={{
                  marginBottom: 0,
                  opacity: 0.7,
                  overflowWrap:
                    "anywhere",
                }}
              >
                {currentFileName}
              </p>
            )}

            <div
              style={{
                width: "100%",
                height: "8px",
                marginTop: "14px",
                borderRadius: "999px",
                overflow: "hidden",
                background: "#ddd",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${
                    files.length
                      ? (processedCount /
                          files.length) *
                        100
                      : 0
                  }%`,
                  background: "#111",
                  transition:
                    "width 0.2s ease",
                }}
              />
            </div>
          </div>
        )}

        {/* BUTTONS */}

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "10px",
          }}
        >
          <button
            type="submit"
            disabled={
              uploading ||
              files.length === 0
            }
            style={{
              padding: "12px 20px",
              border: 0,
              borderRadius: "8px",
              background: "#111",
              color: "#fff",

              cursor:
                uploading ||
                files.length === 0
                  ? "not-allowed"
                  : "pointer",

              opacity:
                uploading ||
                files.length === 0
                  ? 0.55
                  : 1,
            }}
          >
            {uploading
              ? `Uploading ${processedCount}/${files.length}...`
              : `Upload ${files.length} ${
                  files.length === 1
                    ? "Image"
                    : "Images"
                }`}
          </button>

          <Link
            href="/admin/gallery"
            style={{
              padding: "12px 20px",
              border:
                "1px solid #ccc",
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