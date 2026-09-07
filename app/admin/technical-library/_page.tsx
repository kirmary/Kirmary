import Link from "next/link"
import { db } from "../../../lib/db"
import { requireAdmin } from "../../../lib/admin-auth"
import { productDocuments } from "../../../lib/legacy-product-content"
import { ownedProducts } from "../../../lib/site-content"

export default async function AdminTechnicalLibraryPage() {
  await requireAdmin()

  /*
   * الـ16 ملف الحاليين الموجودين بالفعل
   * في صفحة Technical Library العامة.
   */
  const legacyTechnicalDocuments = ownedProducts
    .flatMap((product) => productDocuments(product.id))
    .filter((document) =>
      document.category
        .toLowerCase()
        .includes("submittal")
    )
    .filter(
      (document, index, documents) =>
        documents.findIndex(
          (item) => item.src === document.src
        ) === index
    )

  /*
   * أي ملفات جديدة محفوظة في ProductDocument.
   */
  const products = await db.product.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      nameAr: true,
      visible: true,

      documents: {
        orderBy: [
          { sortOrder: "asc" },
          { createdAt: "asc" },
        ],
      },
    },

    orderBy: [
      { sortOrder: "asc" },
      { name: "asc" },
    ],
  })

  /*
   * لو ملف جديد له نفس رابط ملف من الـ16 القدام،
   * ما نظهرهوش مرتين.
   */
  const legacyPaths = new Set(
    legacyTechnicalDocuments.map(
      (document) => document.src
    )
  )

  const productsWithNewDocuments = products
    .map((product) => ({
      ...product,
      documents: product.documents.filter(
        (document) =>
          !legacyPaths.has(document.fileUrl)
      ),
    }))
    .filter(
      (product) =>
        product.documents.length > 0
    )

  const newDocumentsCount =
    productsWithNewDocuments.reduce(
      (total, product) =>
        total + product.documents.length,
      0
    )

  const totalDocuments =
    legacyTechnicalDocuments.length +
    newDocumentsCount

  return (
    <main
      style={{
        padding: "32px",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>
            Technical Library
          </h1>

          <p
            style={{
              marginTop: "8px",
              marginBottom: 0,
              opacity: 0.65,
            }}
          >
            Existing website submittals plus
            all new product technical
            documentation.
          </p>
        </div>

        <Link
          href="/admin/technical-library/new"
          style={{
            padding: "11px 18px",
            borderRadius: "8px",
            background: "#111",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          + Add Technical Document
        </Link>
      </div>

      {/* SUMMARY */}

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            minWidth: "180px",
            padding: "18px 20px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            background: "#fff",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              opacity: 0.6,
            }}
          >
            DOCUMENTS
          </div>

          <strong
            style={{
              display: "block",
              marginTop: "5px",
              fontSize: "28px",
            }}
          >
            {totalDocuments}
          </strong>
        </div>

        <div
          style={{
            minWidth: "180px",
            padding: "18px 20px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            background: "#fff",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              opacity: 0.6,
            }}
          >
            EXISTING WEBSITE FILES
          </div>

          <strong
            style={{
              display: "block",
              marginTop: "5px",
              fontSize: "28px",
            }}
          >
            {legacyTechnicalDocuments.length}
          </strong>
        </div>

        <div
          style={{
            minWidth: "180px",
            padding: "18px 20px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            background: "#fff",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              opacity: 0.6,
            }}
          >
            NEW DATABASE FILES
          </div>

          <strong
            style={{
              display: "block",
              marginTop: "5px",
              fontSize: "28px",
            }}
          >
            {newDocumentsCount}
          </strong>
        </div>
      </div>

      {/* CURRENT 16 WEBSITE SUBMITTALS */}

      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: "14px",
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <div
          style={{
            padding: "20px 22px",
            borderBottom: "1px solid #eee",
            background: "#fafafa",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
            }}
          >
            Current Website Submittals
          </h2>

          <p
            style={{
              marginTop: "6px",
              marginBottom: 0,
              opacity: 0.6,
              fontSize: "14px",
            }}
          >
            These are the existing Technical
            Library files already used on the
            public website.
          </p>
        </div>

        <div>
          {legacyTechnicalDocuments.map(
            (document, index) => (
              <div
                key={document.src}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "55px minmax(220px, 1fr) 190px 150px",
                  alignItems: "center",
                  gap: "16px",
                  padding: "17px 22px",
                  borderBottom:
                    index ===
                    legacyTechnicalDocuments.length -
                      1
                      ? undefined
                      : "1px solid #eee",
                }}
              >
                <div
                  style={{
                    opacity: 0.45,
                    fontWeight: 700,
                  }}
                >
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </div>

                <div
                  style={{
                    minWidth: 0,
                  }}
                >
                  <strong>
                    {document.title}
                  </strong>

                  <div
                    style={{
                      marginTop: "5px",
                      fontSize: "12px",
                      opacity: 0.5,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {document.src}
                  </div>
                </div>

                <div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      background: "#f2f2f2",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {document.category}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <a
                    href={document.src}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open
                  </a>

                  <span
                    style={{
                      fontSize: "12px",
                      opacity: 0.5,
                    }}
                  >
                    Existing file
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* NEW DATABASE DOCUMENTS */}

      <section
        style={{
          marginTop: "28px",
        }}
      >
        <div
          style={{
            marginBottom: "16px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
            }}
          >
            New Technical Documentation
          </h2>

          <p
            style={{
              marginTop: "6px",
              marginBottom: 0,
              opacity: 0.6,
              fontSize: "14px",
            }}
          >
            Any Technical File saved inside a
            product appears here automatically.
          </p>
        </div>

        {productsWithNewDocuments.length ===
        0 ? (
          <div
            style={{
              padding: "30px",
              border: "1px solid #ddd",
              borderRadius: "12px",
              background: "#fff",
            }}
          >
            <strong>
              No new database documents yet.
            </strong>

            <p
              style={{
                marginBottom: 0,
                opacity: 0.65,
              }}
            >
              The 16 current website
              submittals are shown above. Any
              new technical document added
              from a Product or from this
              Technical Library will appear
              here.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "24px",
            }}
          >
            {productsWithNewDocuments.map(
              (product) => (
                <section
                  key={product.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#fff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      gap: "16px",
                      flexWrap: "wrap",
                      padding: "20px 22px",
                      borderBottom:
                        "1px solid #eee",
                      background: "#fafafa",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "18px",
                        }}
                      >
                        {product.name}
                      </h3>

                      {product.nameAr && (
                        <div
                          style={{
                            marginTop: "5px",
                            opacity: 0.55,
                            fontSize: "14px",
                          }}
                        >
                          {product.nameAr}
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/admin/products/${product.id}`}
                    >
                      Edit Product
                    </Link>
                  </div>

                  <div>
                    {product.documents.map(
                      (document, index) => (
                        <div
                          key={document.id}
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "55px minmax(220px, 1fr) 190px 130px",
                            alignItems:
                              "center",
                            gap: "16px",
                            padding:
                              "17px 22px",
                            borderBottom:
                              index ===
                              product.documents
                                .length -
                                1
                                ? undefined
                                : "1px solid #eee",
                          }}
                        >
                          <div
                            style={{
                              opacity: 0.45,
                              fontWeight: 700,
                            }}
                          >
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </div>

                          <div
                            style={{
                              minWidth: 0,
                            }}
                          >
                            <strong>
                              {document.title}
                            </strong>

                            {document.titleAr && (
                              <div
                                style={{
                                  marginTop:
                                    "4px",
                                  opacity:
                                    0.55,
                                  fontSize:
                                    "13px",
                                }}
                              >
                                {
                                  document.titleAr
                                }
                              </div>
                            )}

                            <div
                              style={{
                                marginTop:
                                  "5px",
                                fontSize:
                                  "12px",
                                opacity: 0.5,
                                overflowWrap:
                                  "anywhere",
                              }}
                            >
                              {
                                document.originalFileName
                              }
                            </div>
                          </div>

                          <div>
                            <span
                              style={{
                                display:
                                  "inline-block",
                                padding:
                                  "6px 10px",
                                borderRadius:
                                  "999px",
                                background:
                                  "#f2f2f2",
                                fontSize:
                                  "12px",
                                fontWeight:
                                  600,
                              }}
                            >
                              {
                                document.documentType
                              }
                            </span>

                            {!document.visible && (
                              <div
                                style={{
                                  marginTop:
                                    "6px",
                                  fontSize:
                                    "12px",
                                  opacity:
                                    0.55,
                                }}
                              >
                                Hidden
                              </div>
                            )}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: "12px",
                              alignItems:
                                "center",
                            }}
                          >
                            <a
                              href={
                                document.fileUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open
                            </a>

                            <Link
                              href={`/admin/technical-library/${document.id}`}
                            >
                              Edit
                            </Link>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </section>
              )
            )}
          </div>
        )}
      </section>
    </main>
  )
}
