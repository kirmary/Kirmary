import Link from "next/link"
import { db } from "../../../../lib/db"
import { requireAdmin } from "../../../../lib/admin-auth"
import { createTechnicalDocument } from "../../actions"
import TechnicalDocumentForm from "../technical-document-form"

export default async function NewTechnicalDocumentPage() {
  await requireAdmin()

  const products =
    await db.product.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        nameAr: true,
      },
      orderBy: [
        { sortOrder: "asc" },
        { name: "asc" },
      ],
    })

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
        <Link href="/admin/technical-library">
          ← Back to Technical Library
        </Link>

        <h1
          style={{
            marginTop: "20px",
            marginBottom: "8px",
          }}
        >
          Add Technical Document
        </h1>

        <p
          style={{
            margin: 0,
            opacity: 0.65,
          }}
        >
          Upload a PDF and attach it to a
          product.
        </p>
      </div>

      <TechnicalDocumentForm
        products={products}
        action={createTechnicalDocument}
      />
    </main>
  )
}
