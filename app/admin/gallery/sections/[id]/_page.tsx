import Link from "next/link"
import { db } from "../../../../../lib/db"
import { requireAdmin } from "../../../../../lib/admin-auth"
import { updateGallerySection } from "../../../actions"
import SectionEditForm from "../section-edit-form"

export default async function EditGallerySectionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()

  const { id } = await params

  const section = await (db as any).gallerySection.findUnique({
    where: { id },
  })

  if (!section) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>Section not found</h1>

        <p style={{ opacity: 0.7 }}>
          ID: {id}
        </p>

        <Link href="/admin/gallery">
          ← Back to Gallery
        </Link>
      </main>
    )
  }

  return (
    <main
      style={{
        padding: "32px",
        maxWidth: "700px",
      }}
    >
      <div style={{ marginBottom: "28px" }}>
        <Link href="/admin/gallery">
          ← Back to Gallery
        </Link>

        <h1
          style={{
            marginTop: "20px",
            marginBottom: "8px",
          }}
        >
          Edit Gallery Section
        </h1>

        <p style={{ opacity: 0.7 }}>
          Update the section information without affecting its images.
        </p>
      </div>

      <SectionEditForm
        action={updateGallerySection}
        section={{
          id: section.id,
          name: section.name,
          nameAr: section.nameAr,
          slug: section.slug,
          coverImage: section.coverImage ?? null,
          sortOrder: section.sortOrder,
          visible: section.visible,
        }}
      />
    </main>
  )
}