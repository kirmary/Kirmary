import { db } from "../../../lib/db"
import { requireAdmin } from "../../../lib/admin-auth"

export default async function AdminProductsPage() {
  await requireAdmin()

  const products = await db.product.findMany({
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "desc" },
    ],
  })

  return (
    <main style={{ padding: "32px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Products</h1>
          <p style={{ marginTop: "8px", opacity: 0.7 }}>
            Manage KIRMARY products
          </p>
        </div>

        <a
          href="/admin/products/new"
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            background: "#111",
            color: "#fff",
            textDecoration: "none",
          }}
        >
          + Add Product
        </a>
      </div>

      {products.length === 0 ? (
        <div
          style={{
            padding: "32px",
            border: "1px solid #ddd",
            borderRadius: "12px",
          }}
        >
          No products yet.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 160px 140px",
                gap: "16px",
                alignItems: "center",
                padding: "16px",
                border: "1px solid #ddd",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "8px",
                  background: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: "12px", opacity: 0.5 }}>
                    No image
                  </span>
                )}
              </div>

              <div>
                <strong>{product.name}</strong>

                <div style={{ marginTop: "4px", opacity: 0.65 }}>
                  {product.number}
                </div>

                <div
                  style={{
                    marginTop: "4px",
                    fontSize: "13px",
                    opacity: 0.65,
                  }}
                >
                  {product.brand || "No brand"}
                  {" · "}
                  {product.category || "No category"}
                </div>
              </div>

              <div>
                <span
                  style={{
                    display: "inline-block",
                    padding: "5px 9px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    background: product.visible ? "#e8f7e8" : "#eee",
                  }}
                >
                  {product.visible ? "Visible" : "Hidden"}
                </span>

                {product.featured && (
                  <span
                    style={{
                      marginLeft: "6px",
                      fontSize: "12px",
                    }}
                  >
                    ★ Featured
                  </span>
                )}
              </div>

              <div>
                <a href={`/admin/products/${product.id}`}>
                  Edit
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
