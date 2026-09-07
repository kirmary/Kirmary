import ProductForm from "../product-form"
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

      <ProductForm action={createProduct} />
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