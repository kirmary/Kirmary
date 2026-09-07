
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "../../../../lib/db"
import { requireAdmin } from "../../../../lib/admin-auth"
import { updateTechnicalDocument } from "../../actions"
import TechnicalDocumentForm from "../technical-document-form"
import DeleteTechnicalDocumentButton from "../delete-technical-document-button"

export default async function EditTechnicalDocumentPage({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) {
  await requireAdmin()

  const { id } = await params

  const [document, products] =
    await Promise.all([
      db.productDocument.findUnique({
        where: { id },
        select: {
          id: true,
          productId: true,
          title: true,
          titleAr: true,
          originalFileName: true,
          documentType: true,
          fileUrl: true,
          visible: true,
          sortOrder: true,
        },
      }),

      db.product.findMany({
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
      }),
    ])

  if (!document) {
    notFound()
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
        <Link href="/admin/technical-library">
          ← Back to Technical Library
        </Link>

        <h1
          style={{
            marginTop: "20px",
            marginBottom: "8px",
          }}
        >
          Edit Technical Document
        </h1>

        <p
          style={{
            margin: 0,
            opacity: 0.65,
          }}
        >
          Update the document, replace its
          PDF, or move it to another product.
        </p>
      </div>

      <TechnicalDocumentForm
        products={products}
        document={document}
        action={updateTechnicalDocument}
      />

      <section
        style={{
          marginTop: "36px",
          paddingTop: "24px",
          borderTop: "1px solid #ddd",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#a71920",
          }}
        >
          Danger Zone
        </h2>

        <p
          style={{
            opacity: 0.7,
          }}
        >
          Deleting removes this document
          record from the database. The PDF
          file itself is kept in storage.
        </p>

        <DeleteTechnicalDocumentButton
          id={document.id}
          title={document.title}
        />
      </section>
    </main>
  )
}
