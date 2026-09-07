import Link from "next/link"
import { createGallerySection } from "../../../actions"
import SectionForm from "../section-form"

export default function NewGallerySectionPage() {
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
          Add Gallery Section
        </h1>

        <p style={{ opacity: 0.7 }}>
          Create a new section for organizing gallery images.
        </p>
      </div>

      <SectionForm action={createGallerySection} />
    </main>
  )
}