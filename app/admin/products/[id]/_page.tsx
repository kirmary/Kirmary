import { productDocuments, legacyProductFeatures } from '../../../../lib/legacy-product-content'
import ProductForm from "../product-form"

import Link from "next/link"
import { db } from "../../../../lib/db"
import {
  deleteProduct,
  hideProduct,
  showProduct,
  updateProduct,
} from "../../actions"
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
    include: {features:{orderBy:[{sortOrder:"asc"},{createdAt:"asc"}]},documents:{orderBy:[{sortOrder:"asc"},{createdAt:"asc"}]}},
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

      <ProductForm product={product} action={updateProduct} />

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
      ) : (
        <form
          action={showProduct}
          style={{ marginTop: "28px" }}
        >
          <input type="hidden" name="id" value={product.id} />
          <input type="hidden" name="slug" value={product.slug} />
          <button
            type="submit"
            style={{
              padding: "10px 16px",
              border: "1px solid #1a7a1a",
              borderRadius: "8px",
              background: "#fff",
              color: "#1a7a1a",
              cursor: "pointer",
            }}
          >
            Show on website
          </button>
        </form>
      )}

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
          Permanently delete this product — type{" "}
          <strong>{product.slug}</strong> to confirm
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

