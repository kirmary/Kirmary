import Link from "next/link"
import { createProduct } from "../../actions"
import { requireAdmin } from "../../../../lib/admin-auth"

export default async function NewProductPage() {
  await requireAdmin()

  return (
    <main style={{ padding: "32px", maxWidth: "900px" }}>
      <div style={{ marginBottom: "28px" }}>
        <Link href="/admin/products">← Back to Products</Link>

        <h1 style={{ marginTop: "20px", marginBottom: "8px" }}>
          Add Product
        </h1>

        <p style={{ opacity: 0.7 }}>
          Add a new product to the KIRMARY catalog.
        </p>
      </div>

      <form
        action={createProduct}
        style={{
          display: "grid",
          gap: "20px",
        }}
      >
        <div>
          <label htmlFor="number">Product Number</label>
          <input
            id="number"
            name="number"
            required
            placeholder="e.g. KRM-001"
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="slug">Slug</label>
          <input
            id="slug"
            name="slug"
            required
            placeholder="e.g. kirmary-fire-hydrant"
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="name">Name (English)</label>
          <input
            id="name"
            name="name"
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="nameAr">Name (Arabic)</label>
          <input
            id="nameAr"
            name="nameAr"
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="description">Description (English)</label>
          <textarea
            id="description"
            name="description"
            rows={5}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="descriptionAr">Description (Arabic)</label>
          <textarea
            id="descriptionAr"
            name="descriptionAr"
            rows={5}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="brand">Brand</label>
          <input
            id="brand"
            name="brand"
            placeholder="KIRMARY"
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <input
            id="category"
            name="category"
            placeholder="Fire Protection"
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            name="tags"
            placeholder="hydrant, fire protection, KIRMARY"
            style={inputStyle}
          />
          <small style={{ opacity: 0.6 }}>
            Separate tags with commas.
          </small>
        </div>

        <div>
          <label htmlFor="image">Image URL</label>
          <input
            id="image"
            name="image"
            placeholder="/orbit/kirmary-hydrant.png"
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="sortOrder">Sort Order</label>
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
          {" "}Featured product
        </label>

        <label>
          <input
            type="checkbox"
            name="visible"
            defaultChecked
          />
          {" "}Visible on website
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
            style={{
              padding: "12px 20px",
              border: 0,
              borderRadius: "8px",
              background: "#111",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Create Product
          </button>

          <Link
            href="/admin/products"
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