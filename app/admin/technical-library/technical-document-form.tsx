"use client"

import { useState } from "react"
import Link from "next/link"
import { uploadAdminFile } from "../../../lib/admin-upload-client"

type ProductOption = {
  id: string
  slug: string
  name: string
  nameAr: string
}

type TechnicalDocumentValue = {
  id: string
  productId: string
  title: string
  titleAr: string
  originalFileName: string
  documentType: string
  fileUrl: string
  visible: boolean
  sortOrder: number
}

type TechnicalDocumentFormProps = {
  products: ProductOption[]
  document?: TechnicalDocumentValue
  action: (formData: FormData) => Promise<void>
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

function titleFromFileName(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export default function TechnicalDocumentForm({
  products,
  document,
  action,
}: TechnicalDocumentFormProps) {
  const [productId, setProductId] = useState(
    document?.productId ?? products[0]?.id ?? ""
  )

  const [title, setTitle] = useState(
    document?.title ?? ""
  )

  const [titleAr, setTitleAr] = useState(
    document?.titleAr ?? ""
  )

  const [documentType, setDocumentType] =
    useState(
      document?.documentType ??
        "TECHNICAL DATA"
    )

  const [fileUrl, setFileUrl] = useState(
    document?.fileUrl ?? ""
  )

  const [
    originalFileName,
    setOriginalFileName,
  ] = useState(
    document?.originalFileName ?? ""
  )

  const [dragging, setDragging] =
    useState(false)

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [status, setStatus] = useState("")

  const selectedProduct =
    products.find(
      (product) => product.id === productId
    ) ?? null

  const handleFile = async (
    file: File | null
  ) => {
    if (!file || busy) {
      return
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name
        .toLowerCase()
        .endsWith(".pdf")

    if (!isPdf) {
      setError("Please select a PDF file.")
      return
    }

    if (!selectedProduct) {
      setError(
        "Please select a product first."
      )
      return
    }

    try {
      setBusy(true)
      setError("")
      setStatus(
        `Uploading ${file.name}...`
      )

      const uploadData = new FormData()

      uploadData.set("file", file)
      uploadData.set(
        "slug",
        selectedProduct.slug
      )
      uploadData.set("type", "document")

      const response =
        await uploadAdminFile(
          "/api/admin/products/upload",
          uploadData
        )

      const result = (await response.json()) as {
        path?: string
        originalFileName?: string
        error?: string
      }

      if (!response.ok) {
        throw new Error(
          result.error || "Upload failed."
        )
      }

      if (!result.path) {
        throw new Error(
          "Upload succeeded but no file path was returned."
        )
      }

      setFileUrl(result.path)
      setOriginalFileName(
        result.originalFileName ||
          file.name
      )

      if (!title.trim()) {
        setTitle(
          titleFromFileName(file.name)
        )
      }

      setStatus(
        "PDF uploaded successfully. Save the document to attach it to the product."
      )
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Upload failed."
      )
      setStatus("")
    } finally {
      setBusy(false)
    }
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (busy) {
      return
    }

    if (!productId) {
      setError(
        "Please select a product."
      )
      return
    }

    if (!fileUrl) {
      setError(
        "Please upload a PDF file."
      )
      return
    }

    try {
      setBusy(true)
      setError("")
      setStatus("Saving...")

      const formData =
        new FormData(event.currentTarget)

      formData.set(
        "productId",
        productId
      )

      formData.set("title", title)
      formData.set("titleAr", titleAr)

      formData.set(
        "documentType",
        documentType
      )

      formData.set(
        "fileUrl",
        fileUrl
      )

      formData.set(
        "originalFileName",
        originalFileName
      )

      await action(formData)
    } catch (saveError) {
      if (
        saveError instanceof Error &&
        saveError.message ===
          "NEXT_REDIRECT"
      ) {
        return
      }

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Save failed."
      )

      setStatus("")
      setBusy(false)
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
      {document && (
        <input
          type="hidden"
          name="id"
          value={document.id}
        />
      )}

      <fieldset
        disabled={busy}
        style={{
          border: 0,
          padding: 0,
          margin: 0,
          display: "grid",
          gap: "20px",
        }}
      >
        <div>
          <label htmlFor="productId">
            Product
          </label>

          <select
            id="productId"
            name="productId"
            value={productId}
            onChange={(event) => {
              setProductId(
                event.target.value
              )
            }}
            required
            style={inputStyle}
          >
            {products.length === 0 && (
              <option value="">
                No products available
              </option>
            )}

            {products.map((product) => (
              <option
                key={product.id}
                value={product.id}
              >
                {product.name}
                {product.nameAr
                  ? ` — ${product.nameAr}`
                  : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title">
            Display Title English
          </label>

          <input
            id="title"
            name="title"
            value={title}
            onChange={(event) =>
              setTitle(
                event.target.value
              )
            }
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="titleAr">
            Display Title Arabic
          </label>

          <input
            id="titleAr"
            name="titleAr"
            value={titleAr}
            onChange={(event) =>
              setTitleAr(
                event.target.value
              )
            }
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="documentType">
            Document Type / Label
          </label>

          <input
            id="documentType"
            name="documentType"
            list="technical-document-types"
            value={documentType}
            onChange={(event) =>
              setDocumentType(
                event.target.value
              )
            }
            required
            style={inputStyle}
          />

          <datalist id="technical-document-types">
            <option value="TECHNICAL DATA" />
            <option value="TECHNICAL SUBMITTAL" />
            <option value="CATALOGUE" />
            <option value="CERTIFICATE" />
            <option value="DATASHEET" />
          </datalist>
        </div>

        <div>
          <label>
            PDF File
          </label>

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

              void handleFile(
                event.dataTransfer
                  .files?.[0] ?? null
              )
            }}
            onClick={() => {
              window.document
                .getElementById(
                  "technical-document-file"
                )
                ?.click()
            }}
            style={{
              marginTop: "8px",
              padding: "36px 20px",
              border: `2px dashed ${
                dragging
                  ? "#111"
                  : "#aaa"
              }`,
              borderRadius: "10px",
              textAlign: "center",
              background: dragging
                ? "#f3f3f3"
                : "#fafafa",
              cursor: busy
                ? "not-allowed"
                : "pointer",
            }}
          >
            {originalFileName ? (
              <>
                <strong>
                  {originalFileName}
                </strong>

                <p
                  style={{
                    marginBottom: 0,
                    opacity: 0.6,
                  }}
                >
                  Drop another PDF here
                  to replace it, or click
                  to browse.
                </p>
              </>
            ) : (
              <>
                <strong>
                  DROP PDF HERE
                </strong>

                <p
                  style={{
                    marginBottom: 0,
                    opacity: 0.6,
                  }}
                >
                  or click to browse ·
                  PDF · up to 20 MB
                </p>
              </>
            )}

            <input
              id="technical-document-file"
              type="file"
              accept="application/pdf"
              style={{
                display: "none",
              }}
              onChange={(event) => {
                void handleFile(
                  event.target
                    .files?.[0] ?? null
                )

                event.currentTarget.value =
                  ""
              }}
            />
          </div>

          {fileUrl && (
            <div
              style={{
                marginTop: "10px",
              }}
            >
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open current PDF ↗
              </a>
            </div>
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
            defaultValue={
              document?.sortOrder ?? 0
            }
            style={inputStyle}
          />
        </div>

        <label>
          <input
            type="checkbox"
            name="visible"
            defaultChecked={
              document?.visible ?? true
            }
          />{" "}
          Visible on website
        </label>
      </fieldset>

      {error && (
        <p
          role="alert"
          style={{
            margin: 0,
            color: "#a71920",
            whiteSpace: "pre-line",
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

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="submit"
          disabled={
            busy ||
            !products.length
          }
          style={{
            padding: "12px 20px",
            border: 0,
            borderRadius: "8px",
            background: "#111",
            color: "#fff",
            cursor:
              busy ||
              !products.length
                ? "not-allowed"
                : "pointer",
            opacity:
              busy ||
              !products.length
                ? 0.6
                : 1,
          }}
        >
          {busy
            ? "Please wait..."
            : document
              ? "Save Changes"
              : "Add Document"}
        </button>

        <Link
          href="/admin/technical-library"
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
  )
}
