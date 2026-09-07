import Link from "next/link"
import { db } from "../../../../lib/db"
import { deleteGalleryImage, hideGalleryImage, showGalleryImage, updateGalleryImage } from "../../actions"
import { requireAdmin } from "../../../../lib/admin-auth"

export default async function EditGalleryImagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()

  const { id } = await params

  const sections = await db.gallerySection.findMany({orderBy:[{sortOrder:"asc"},{createdAt:"asc"}]})
  const image = await db.galleryImage.findUnique({ where: { id } })

  if (!image) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>Image not found</h1>
        <p>ID: {id}</p>
        <Link href="/admin/gallery">← Back to Gallery</Link>
      </main>
    )
  }

  return (
    <main style={{ padding: "32px", maxWidth: "900px" }}>
      <div style={{ marginBottom: "28px" }}>
        <Link href="/admin/gallery">← Back to Gallery</Link>

        <h1 style={{ marginTop: "20px", marginBottom: "8px" }}>
          Edit Gallery Image
        </h1>

        <p style={{ opacity: 0.7 }}>Edit gallery image information.</p>
      </div>

      <form action={updateGalleryImage} style={{ display: "grid", gap: "20px" }}>
        <input type="hidden" name="id" value={image.id} />

        <div>
          <label htmlFor="image">Image URL / Path</label>
          <input
            id="image"
            name="image"
            defaultValue={image.image}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="title">Title (English)</label>
          <input id="title" name="title" defaultValue={image.title} required style={inputStyle} />
        </div>

        <div>
          <label htmlFor="titleAr">Title (Arabic)</label>
          <input id="titleAr" name="titleAr" defaultValue={image.titleAr} required style={inputStyle} />
        </div>

        <div>
          <label htmlFor="description">Description (English)</label>
          <textarea
            id="description"
            name="description"
            defaultValue={image.description ?? ""}
            rows={4}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="descriptionAr">Description (Arabic)</label>
          <textarea
            id="descriptionAr"
            name="descriptionAr"
            defaultValue={image.descriptionAr ?? ""}
            rows={4}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <input
            id="category"
            name="category"
            defaultValue={image.category ?? ""}
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="section">Gallery Section</label>
          <select id="section" name="section" defaultValue={image.section} style={inputStyle}>
            {!sections.some(s=>s.slug===image.section) && <option value={image.section}>{image.section}</option>}
            {sections.map(section=><option key={section.id} value={section.slug}>{section.name}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="sortOrder">Sort Order</label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={image.sortOrder}
            style={inputStyle}
          />
        </div>

        <label>
          <input type="checkbox" name="featured" defaultChecked={image.featured} />
          {" "}Featured image
        </label>

        <label>
          <input type="checkbox" name="visible" defaultChecked={image.visible} />
          {" "}Visible on website
        </label>

        <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
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
            href="/admin/gallery"
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

      {image.visible ? (
        <form action={hideGalleryImage} style={{ marginTop: "28px" }}>
          <input type="hidden" name="id" value={image.id} />
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
        <form action={showGalleryImage} style={{ marginTop: "28px" }}>
          <input type="hidden" name="id" value={image.id} />
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
        action={deleteGalleryImage}
        style={{ marginTop: "28px", paddingTop: "24px", borderTop: "1px solid #ddd" }}
      >
        <input type="hidden" name="id" value={image.id} />
        <input type="hidden" name="title" value={image.title} />
        <label htmlFor="confirmation">
          Permanently delete this image — type <strong>{image.title}</strong> to confirm
        </label>
        <input id="confirmation" name="confirmation" required autoComplete="off" style={inputStyle} />
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
          Permanently Delete Image
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