"use client";
import { uploadAdminFile } from "../../../lib/admin-upload-client";

import { useRef, useState } from "react";
import type { Product, ProductFeature, ProductDocument } from "@prisma/client";

type Feature = Pick<
  ProductFeature,
  | "title"
  | "titleAr"
  | "description"
  | "descriptionAr"
  | "documentUrl"
  | "linkLabel"
  | "visible"
  | "sortOrder"
> & { id?: string; key: string };
type Document = Pick<
  ProductDocument,
  | "title"
  | "titleAr"
  | "originalFileName"
  | "documentType"
  | "fileUrl"
  | "visible"
  | "sortOrder"
> & { id?: string; key: string };
type EditableProduct = Product & {
  features: ProductFeature[];
  documents: ProductDocument[];
};
const inputStyle = {
  display: "block",
  width: "100%",
  marginTop: 7,
  padding: "11px 12px",
  border: "1px solid #ccc",
  borderRadius: 8,
  fontSize: 15,
  boxSizing: "border-box" as const,
};

export default function ProductForm({
  product,
  action,
}: {
  product?: EditableProduct;
  action: (form: FormData) => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [features, setFeatures] = useState<Feature[]>(
    product?.features.map((r, index) => ({
      ...r,
      key: r.id || `legacy-feature-${index}`,
    })) || [],
  );
  const [documents, setDocuments] = useState<Document[]>(
    product?.documents.map((r, index) => ({
      ...r,
      key: r.id || `legacy-document-${index}`,
    })) || [],
  );
  const [image, setImage] = useState(product?.image || "");
  const [cover, setCover] = useState(product?.coverImage || "");
  const [managed, setManaged] = useState(product?.contentManaged ?? true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [dragging, setDragging] = useState(false);
  async function upload(file: File, type: string, slug: string) {
    if (!slug) throw new Error("Enter the product slug before uploading.");
    const data = new FormData();
    data.set("file", file);
    data.set("slug", slug);
    data.set("type", type);
    const response = await uploadAdminFile("/api/admin/products/upload", data);
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Upload failed");
    return result as { path: string; originalFileName: string };
  }
  async function uploadFiles(files: File[], type: string, key?: string) {
    if (busy || !files.length) return;
    const slug = String(new FormData(formRef.current!).get("slug") || "");
    setBusy(true);
    setError("");
    setStatus("Uploading…");
    let completed = 0;
    const failures: string[] = [];
    for (const file of files) {
      try {
        const result = await upload(file, type, slug);
        if (type === "cover") setCover(result.path);
        else if (type === "image") setImage(result.path);
        else if (key?.startsWith("feature:")) {
          setManaged(true);
          setFeatures((rows) =>
            rows.map((r) =>
              r.key === key.slice(8) ? { ...r, documentUrl: result.path } : r,
            ),
          );
        } else {
          setManaged(true);
          setDocuments((rows) =>
            key
              ? rows.map((r) =>
                  r.key === key
                    ? {
                        ...r,
                        fileUrl: result.path,
                        originalFileName: result.originalFileName,
                      }
                    : r,
                )
              : [
                  ...rows,
                  {
                    key: crypto.randomUUID(),
                    title: file.name.replace(/\.[^.]+$/, ""),
                    titleAr: "",
                    fileUrl: result.path,
                    originalFileName: result.originalFileName,
                    documentType: "TECHNICAL DATA",
                    visible: true,
                    sortOrder:
                      Math.max(-1, ...rows.map((r) => r.sortOrder)) + 1,
                  },
                ],
          );
        }
        completed++;
      } catch (e) {
        failures.push(
          `${file.name}: ${e instanceof Error ? e.message : "Upload failed"}`,
        );
      }
    }
    setStatus(
      `${completed} file(s) uploaded. Save the product to attach changes.`,
    );
    setError(failures.join("\n"));
    setBusy(false);
  }
  function feature(key: string, patch: Partial<Feature>) {
    setManaged(true);
    setFeatures((rows) =>
      rows.map((r) => (r.key === key ? { ...r, ...patch } : r)),
    );
  }
  function document(key: string, patch: Partial<Document>) {
    setManaged(true);
    setDocuments((rows) =>
      rows.map((r) => (r.key === key ? { ...r, ...patch } : r)),
    );
  }
  const textFields = [
    ["number", "Product Number"],
    ["slug", "Slug"],
    ["name", "Product Name English"],
    ["nameAr", "Product Name Arabic"],
    ["brand", "Eyebrow / Brand"],
    ["subtitle", "Subtitle English"],
    ["subtitleAr", "Subtitle Arabic"],
    ["category", "Category"],
  ] as const;
  return (
    <form
      ref={formRef}
      onSubmit={async (event) => {
        event.preventDefault();
        if (busy) return;
        setBusy(true);
        setError("");
        const data = new FormData(event.currentTarget);
        data.set("features", JSON.stringify(features));
        data.set("documents", JSON.stringify(documents));
        try {
          await action(data);
        } catch (e) {
          if (e instanceof Error && e.message === "NEXT_REDIRECT") return;
          setError(
            e instanceof Error && /unique constraint/i.test(e.message)
              ? "This slug is already in use."
              : e instanceof Error
                ? e.message
                : "Save failed",
          );
          setBusy(false);
        }
      }}
      style={{ display: "grid", gap: 20 }}
    >
      {product && <input type="hidden" name="id" value={product.id} />}
      <fieldset
        disabled={busy}
        style={{ border: 0, padding: 0, display: "grid", gap: 20 }}
      >
        {textFields.map(([name, label]) => (
          <label key={name}>
            {label}
            <input
              name={name}
              defaultValue={product?.[name] || ""}
              required={["number", "slug", "name", "nameAr"].includes(name)}
              pattern={name === "slug" ? "[a-z0-9]+(-[a-z0-9]+)*" : undefined}
              style={inputStyle}
            />
          </label>
        ))}
        {(["description", "descriptionAr"] as const).map((name) => (
          <label key={name}>
            Product Overview {name === "description" ? "English" : "Arabic"}
            <textarea
              name={name}
              defaultValue={product?.[name] || ""}
              rows={5}
              style={inputStyle}
            />
          </label>
        ))}
        <label>
          Legacy Tags (comma separated)
          <input
            name="tags"
            defaultValue={product?.tags.join(", ") || ""}
            style={inputStyle}
          />
        </label>
        {(["cover", "image"] as const).map((type) => (
          <div key={type}>
            <label>
              {type === "cover"
                ? "Product Cover Image (listing)"
                : "Main Product Image (detail)"}
              <input
                name={type === "cover" ? "coverImage" : "image"}
                value={type === "cover" ? cover : image}
                onChange={(e) =>
                  type === "cover"
                    ? setCover(e.target.value)
                    : setImage(e.target.value)
                }
                style={inputStyle}
              />
            </label>
            {(type === "cover" ? cover : image) && (
              <img
                src={type === "cover" ? cover : image}
                alt={type === "cover" ? "Cover preview" : "Main image preview"}
                style={{ maxWidth: 220, maxHeight: 160 }}
              />
            )}
            <input
              aria-label={`Upload ${type} image`}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              onChange={(e) => {
                void uploadFiles(Array.from(e.target.files || []), type);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => (type === "cover" ? setCover("") : setImage(""))}
            >
              Remove image
            </button>
          </div>
        ))}
        <label>
          Sort Order
          <input
            type="number"
            name="sortOrder"
            defaultValue={product?.sortOrder || 0}
            style={inputStyle}
          />
        </label>
        <label>
          <input
            type="checkbox"
            name="visible"
            defaultChecked={product?.visible ?? true}
          />{" "}
          Visible on website
        </label>
        <label>
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product?.featured ?? false}
          />{" "}
          Featured
        </label>
        <label>
          <input
            type="checkbox"
            name="contentManaged"
            checked={managed}
            onChange={(e) => setManaged(e.target.checked)}
          />{" "}
          Use the features and technical files below
        </label>
        {!managed && (
          <p>
            The original features and documents are shown below. Editing them
            enables database content while retaining the other items.
          </p>
        )}
        <section>
          <h2>Product Features</h2>
          {features.map((row, index) => (
            <fieldset
              key={row.key}
              style={{
                marginBottom: 16,
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <legend>Feature {index + 1}</legend>
              {(
                [
                  "title",
                  "titleAr",
                  "description",
                  "descriptionAr",
                  "documentUrl",
                  "linkLabel",
                ] as const
              ).map((key) => (
                <label key={key}>
                  {
                    {
                      title: "Title English",
                      titleAr: "Title Arabic",
                      description: "Description English",
                      descriptionAr: "Description Arabic",
                      documentUrl: "Optional document / link URL",
                      linkLabel: "Optional link label",
                    }[key]
                  }
                  <input
                    value={row[key] || ""}
                    required={key === "title"}
                    style={inputStyle}
                    onChange={(e) =>
                      feature(row.key, { [key]: e.target.value })
                    }
                  />
                </label>
              ))}
              <label>
                Optional PDF
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    void uploadFiles(
                      Array.from(e.target.files || []),
                      "document",
                      `feature:${row.key}`,
                    );
                    e.target.value = "";
                  }}
                />
              </label>
              <label>
                Sort Order
                <input
                  type="number"
                  value={row.sortOrder}
                  onChange={(e) =>
                    feature(row.key, { sortOrder: Number(e.target.value) })
                  }
                  style={inputStyle}
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={row.visible}
                  onChange={(e) =>
                    feature(row.key, { visible: e.target.checked })
                  }
                />{" "}
                Visible
              </label>
              <button
                type="button"
                onClick={() => {
                  setManaged(true);
                  setFeatures((rows) => rows.filter((r) => r.key !== row.key));
                }}
              >
                Remove Feature
              </button>
            </fieldset>
          ))}
          <button
            type="button"
            onClick={() => {
              setManaged(true);
              setFeatures((rows) => [
                ...rows,
                {
                  key: crypto.randomUUID(),
                  title: "",
                  titleAr: "",
                  description: "",
                  descriptionAr: "",
                  documentUrl: null,
                  linkLabel: null,
                  visible: true,
                  sortOrder: Math.max(-1, ...rows.map((r) => r.sortOrder)) + 1,
                },
              ]);
            }}
          >
            Add Feature
          </button>
        </section>
        <section>
          <h2>Technical Files</h2>
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              void uploadFiles(Array.from(e.dataTransfer.files), "document");
            }}
            style={{
              display: "block",
              padding: 32,
              border: "2px dashed #999",
              borderRadius: 8,
              background: dragging ? "#eee" : undefined,
              textAlign: "center",
            }}
          >
            <strong>DROP TECHNICAL FILES HERE</strong>
            <p>or click to browse · PDF · up to 20 MB per file</p>
            <input
              aria-label="Browse Technical Files"
              type="file"
              multiple
              accept="application/pdf"
              onChange={(e) => {
                void uploadFiles(Array.from(e.target.files || []), "document");
                e.target.value = "";
              }}
            />
          </label>
          {documents.map((row, index) => (
            <fieldset
              key={row.key}
              style={{
                marginTop: 16,
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <legend>Technical File {index + 1}</legend>
              <p>{row.originalFileName}</p>
              {(["title", "titleAr", "documentType", "fileUrl"] as const).map(
                (key) => (
                  <label key={key}>
                    {
                      {
                        title: "Display Title English",
                        titleAr: "Display Title Arabic",
                        documentType: "Document Type / Label",
                        fileUrl: "File URL / path",
                      }[key]
                    }
                    <input
                      value={row[key]}
                      required={key !== "titleAr"}
                      style={inputStyle}
                      onChange={(e) =>
                        document(row.key, { [key]: e.target.value })
                      }
                    />
                  </label>
                ),
              )}
              <label>
                Replace File
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    void uploadFiles(
                      Array.from(e.target.files || []),
                      "document",
                      row.key,
                    );
                    e.target.value = "";
                  }}
                />
              </label>
              <label>
                Sort Order
                <input
                  type="number"
                  value={row.sortOrder}
                  style={inputStyle}
                  onChange={(e) =>
                    document(row.key, { sortOrder: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={row.visible}
                  onChange={(e) =>
                    document(row.key, { visible: e.target.checked })
                  }
                />{" "}
                Visible
              </label>
              <button
                type="button"
                onClick={() => {
                  setManaged(true);
                  setDocuments((rows) => rows.filter((r) => r.key !== row.key));
                }}
              >
                Remove Technical File
              </button>
            </fieldset>
          ))}
          <button
            type="button"
            onClick={() => {
              setManaged(true);
              setDocuments((rows) => [
                ...rows,
                {
                  key: crypto.randomUUID(),
                  title: "",
                  titleAr: "",
                  originalFileName: "",
                  documentType: "TECHNICAL DATA",
                  fileUrl: "",
                  visible: true,
                  sortOrder: Math.max(-1, ...rows.map((r) => r.sortOrder)) + 1,
                },
              ]);
            }}
          >
            Add Technical File
          </button>
        </section>
      </fieldset>
      {error && (
        <p role="alert" style={{ color: "#a71920", whiteSpace: "pre-line" }}>
          {error}
        </p>
      )}
      <p role="status">{status}</p>
      <button
        disabled={busy}
        type="submit"
        style={{
          padding: "12px 20px",
          border: 0,
          borderRadius: 8,
          background: "#111",
          color: "#fff",
        }}
      >
        {busy ? "Please wait…" : product ? "Save Changes" : "Create Product"}
      </button>
    </form>
  );
}
