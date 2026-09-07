import Link from "next/link"
import { db } from "../../../lib/db"
import { requireAdmin } from "../../../lib/admin-auth"

export default async function AdminGalleryPage() {
  await requireAdmin()

  const [sections, images] = await Promise.all([
    db.gallerySection.findMany({
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "asc" },
      ],
    }),

    db.galleryImage.findMany({
      select: {
        id: true,
        image: true,
        title: true,
        titleAr: true,
        category: true,
        featured: true,
        visible: true,
        sortOrder: true,
        createdAt: true,
        section: true,
      },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    }),
  ])

  const imageCountBySection = new Map<string, number>()

  for (const image of images) {
    const section = image.section || "general"

    imageCountBySection.set(
      section,
      (imageCountBySection.get(section) ?? 0) + 1
    )
  }

  return (
    <main style={{ padding: "32px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Gallery</h1>

          <p
            style={{
              marginTop: "8px",
              opacity: 0.7,
            }}
          >
            Manage KIRMARY gallery sections and images
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/admin/gallery/sections/new"
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              color: "#111",
              textDecoration: "none",
              background: "#fff",
            }}
          >
            + Add Section
          </Link>

          <Link
            href="/admin/gallery/new"
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              background: "#111",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            + Add Image
          </Link>
        </div>
      </div>

      {/* Sections */}
      {sections.length === 0 ? (
        <div
          style={{
            padding: "32px",
            border: "1px solid #ddd",
            borderRadius: "12px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            No gallery sections yet.
          </h2>

          <p style={{ opacity: 0.7 }}>
            Create your first gallery section to organize your images.
          </p>

          <Link
            href="/admin/gallery/sections/new"
            style={{
              display: "inline-block",
              marginTop: "12px",
              padding: "10px 16px",
              borderRadius: "8px",
              background: "#111",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            + Add Section
          </Link>
        </div>
      ) : (
        <>
          <h2
            style={{
              marginTop: 0,
              marginBottom: "16px",
            }}
          >
            Gallery Sections
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            {sections.map((section: {
              id: string
              slug: string
              name: string
              nameAr: string | null
              visible: boolean
            }) => {
              const count =
                imageCountBySection.get(section.slug) ?? 0

              return (
                <div
                  key={section.id}
                  style={{
                    padding: "24px",
                    border: "1px solid #ddd",
                    borderRadius: "14px",
                    background: "#fff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "20px",
                        }}
                      >
                        {section.name}
                      </h3>

                      <div
                        style={{
                          marginTop: "6px",
                          opacity: 0.65,
                        }}
                      >
                        {section.nameAr}
                      </div>
                    </div>

                    {!section.visible && (
                      <span
                        style={{
                          padding: "5px 9px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          background: "#eee",
                        }}
                      >
                        Hidden
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      marginTop: "24px",
                      fontSize: "15px",
                      opacity: 0.7,
                    }}
                  >
                    {count}{" "}
                    {count === 1 ? "Image" : "Images"}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "20px",
                    }}
                  >
                    <Link
                      href={`/admin/gallery/sections/${section.id}`}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        color: "#111",
                        textDecoration: "none",
                      }}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Existing Images */}
      {images.length > 0 && (
        <section
          style={{
            marginTop: "40px",
          }}
        >
          <h2
            style={{
              marginBottom: "16px",
            }}
          >
            All Gallery Images
          </h2>

          <div
            style={{
              display: "grid",
              gap: "12px",
            }}
          >
            {images.map((image: {
              id: string
              image: string
              title: string
              titleAr: string
              category: string | null
              featured: boolean
              visible: boolean
              sortOrder: number
              section: string | null
            }) => (
              <div
                key={image.id}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "80px 1fr 160px 140px",
                  gap: "16px",
                  alignItems: "center",
                  padding: "16px",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  background: "#fff",
                }}
              >
                {/* Thumbnail */}
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
                  <img
                    src={image.image}
                    alt={image.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>

                {/* Image information */}
                <div>
                  <strong>{image.title}</strong>

                  <div
                    style={{
                      marginTop: "4px",
                      opacity: 0.65,
                    }}
                  >
                    {image.titleAr}
                  </div>

                  <div
                    style={{
                      marginTop: "4px",
                      fontSize: "13px",
                      opacity: 0.65,
                    }}
                  >
                    Section: {image.section || "general"}
                    {" · "}
                    {image.category || "No category"}
                    {" · #"}
                    {String(image.sortOrder).padStart(
                      2,
                      "0"
                    )}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "5px 9px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      background: image.visible
                        ? "#e8f7e8"
                        : "#eee",
                    }}
                  >
                    {image.visible
                      ? "Visible"
                      : "Hidden"}
                  </span>

                  {image.featured && (
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

                {/* Edit */}
                <div>
                  <Link
                    href={`/admin/gallery/${image.id}`}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}