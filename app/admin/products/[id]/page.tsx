import Link from "next/link"
import { db } from "../../../../lib/db"
import { deleteProduct, hideProduct, updateProduct } from "../../actions"
import { requireAdmin } from "../../../../lib/admin-auth"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()

  const { id } = await params

  const product = await db.product.findUnique({
    where: { id },
  })

  if (!product) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>Product not found</h1>
        <p>ID: {id}</p>
        <Link href="/admin/products">← Back to Products</Link>
      </main>
    )
  }

  return (
    <main style={{ padding: "32px", maxWidth: "900px" }}>
      <div style={{ marginBottom: "28px" }}>
        <Link href="/admin/products">← Back to Products</Link>

        <h1 style={{ marginTop: "20px", marginBottom: "8px" }}>
          Edit Product
        </h1>

        <p style={{ opacity: 0.7 }}>
          Edit product information.
        </p>
      </div>

    <form
  action={updateProduct}
  style={{
    display: "grid",
    gap: "20px",
  }}
>
  <input type="hidden" name="id" value={product.id} />

  <div>
    <label htmlFor="number">Product Number</label>
          <input
            id="number"
            name="number"
            defaultValue={product.number}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="slug">Slug</label>
          <input
            id="slug"
            name="slug"
            defaultValue={product.slug}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="name">Name (English)</label>
          <input
            id="name"
            name="name"
            defaultValue={product.name}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="nameAr">Name (Arabic)</label>
          <input
            id="nameAr"
            name="nameAr"
            defaultValue={product.nameAr}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="description">Description (English)</label>
          <textarea
            id="description"
            name="description"
            defaultValue={product.description}
            rows={5}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="descriptionAr">Description (Arabic)</label>
          <textarea
            id="descriptionAr"
            name="descriptionAr"
            defaultValue={product.descriptionAr}
            rows={5}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="brand">Brand</label>
          <input
            id="brand"
            name="brand"
            defaultValue={product.brand ?? ""}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <input
            id="category"
            name="category"
            defaultValue={product.category ?? ""}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            name="tags"
            defaultValue={product.tags.join(", ")}
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
            defaultValue={product.image ?? ""}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="sortOrder">Sort Order</label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={product.sortOrder}
            style={inputStyle}
          />
        </div>

        <label>
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product.featured}
          />
          {" "}Featured product
        </label>

        <label>
          <input
            type="checkbox"
            name="visible"
            defaultChecked={product.visible}
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
            Save Changes
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

      {product.visible ? (
        <form
          action={hideProduct}
          style={{ marginTop: "28px" }}
        >
          <input type="hidden" name="id" value={product.id} />
          <input type="hidden" name="slug" value={product.slug} />
          <button
            type="submit"
            style={{
              padding: "10px 16px",
              border: "1px solid #777",
              borderRadius: "8px",
              background: "#fff",
              color: "#222",
              cursor: "pointer",
            }}
          >
            Hide from website
          </button>
        </form>
      ) : null}

      <form
        action={deleteProduct}
        style={{
          marginTop: "28px",
          paddingTop: "24px",
          borderTop: "1px solid #ddd",
        }}
      >
        <input type="hidden" name="id" value={product.id} />
        <input type="hidden" name="slug" value={product.slug} />
        <label htmlFor="confirmation">
          Permanently delete this product — type <strong>{product.slug}</strong> to confirm
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
          style={{
            marginTop: "12px",
            padding: "10px 16px",
            border: 0,
            borderRadius: "8px",
            background: "#a71920",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Permanently Delete Product
        </button>
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
