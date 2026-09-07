import { productDocuments } from '../../../lib/legacy-product-content';
import { assetDownloadUrl } from '../../../lib/asset-url';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GalleryLightbox } from './gallery-lightbox';
import type { ReactNode } from 'react';
import { TechnicalLibrarySearch } from '../../../components/technical-library-search';

import RibbonFlowBackground from '../../../components/ribbon-flow-background';

import { RfqForm } from '../../../components/rfq-form';
import {
  ProductCertificationProvider,
  ProductDetailVisual,
  ProductFeatureList
} from '../../../components/product-certification-swap';

import {
  archiveDocuments,
  archiveLogos,
  featured
} from '../../../lib/archive-data';

import {
  brands,
  contacts,
  ownedProducts
} from '../../../lib/site-content';
import { db } from '../../../lib/db';
import { readdir } from 'fs/promises';
import { join } from 'path';

/* ==================================================
   TYPES
================================================== */

type ShellProps = {
  title: string;
  kicker: string;
  summary?: string;
  children: ReactNode;
  pageClassName?: string;
};

/* ==================================================
   SHARED PAGE SHELL
================================================== */

function Shell({
  kicker,
  title,
  summary,
  children,
  pageClassName = ''
}: ShellProps) {
  return (
    <section
  className={`inner-page ${pageClassName}`}
>
<style>{`
  .inner-page .inner-hero__content h1 {
  max-width: 920px !important;
  margin-left: 0 !important;
  margin-right: auto !important;
  font-size: clamp(42px, 6vw, 78px) !important;
  line-height: 1.25 !important;
  letter-spacing: 0 !important;
  word-spacing: 0.12em;
  text-align: right !important;
}

html[dir="rtl"] .inner-page .inner-hero__content {
  text-align: right !important;
  align-items: flex-end !important;
}

html[dir="rtl"] .inner-page .inner-hero__content h1,
html[dir="rtl"] .inner-page .inner-hero__content .inner-kicker,
html[dir="rtl"] .inner-page .inner-hero__content .inner-hero__summary {
  text-align: right !important;
}

  @media (max-width: 640px) {
    .inner-page .inner-hero__content h1 {
      font-size: clamp(36px, 11vw, 50px) !important;
      line-height: 1.3 !important;
    }
  }
`}</style>
<header className="inner-hero">
  <div className="inner-hero__background" aria-hidden="true">
    <span className="inner-hero__glow inner-hero__glow--red" />
    <span className="inner-hero__glow inner-hero__glow--blue" />
    <span className="inner-hero__grid" />
  </div>

  <div className="inner-hero__content">
    <p className="inner-kicker">{kicker}</p>

    <h1
      dir="auto"
      style={{
        display: 'block',
        maxWidth: '100%',
        height: 'auto',
        minHeight: 0,
        lineHeight: 1.3,
        whiteSpace: 'normal',
        overflow: 'visible',
        overflowWrap: 'break-word',
        paddingBottom: '0.12em'
      }}
    >
      {title}
    </h1>

    {summary ? (
      <p className="inner-hero__summary">{summary}</p>
    ) : null}
  </div>

  <div className="inner-hero__mark" aria-hidden="true">
    K
  </div>
</header>

      <div className="inner-content">
        {children}
      </div>
    </section>
  );
}

/* ==================================================
   SECTION HEADING
================================================== */

function SectionIntro({
  label,
  title,
  copy
}: {
  label: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="page-section-intro">
      <p>{label}</p>

      <h2>{title}</h2>

      {copy ? (
        <div>{copy}</div>
      ) : null}
    </div>
  );
}

/* ==================================================
   TECHNICAL DOCUMENT ROWS
================================================== */

type ProductDocument = {
  src: string;
  title: string;
  category: string;
  sourceYear?: string | number | null;
};

function DocumentRows({
  documents,
  locale
}: {
  documents: readonly ProductDocument[];
  locale: string;
}) {
  const ar = locale === 'ar';

  return (
    <div className="premium-document-list">
      {documents.map((document, index) => (
        <div
          className="premium-document-list__row"
          key={document.src}
        >
          <a
            className="premium-document-list__open"
            href={document.src}
            target="_blank"
            rel="noreferrer"
          >
            <span className="premium-document-list__number">
              {String(index + 1).padStart(2, '0')}
            </span>

            <span className="premium-document-list__copy">
              <strong>
                {document.title}
              </strong>

              <small>
                {document.category}

                {document.sourceYear
                  ? ` · ${document.sourceYear}`
                  : ''}
              </small>
            </span>
          </a>

          <a
            className="botao"
            href={assetDownloadUrl(document.src)}
            download
            aria-label={
              ar
                ? `تحميل ${document.title}`
                : `Download ${document.title}`
            }
          >
            <span className="texto">
              {ar ? 'تحميل' : 'DOWNLOAD'}
            </span>

            <svg
              className="mysvg"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 3V15M12 15L7.5 10.5M12 15L16.5 10.5M5 19H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      ))}
    </div>
  );
}


/* ==================================================
   PRODUCT DOCUMENT FILTER
================================================== */


/* ==================================================
   TECHNICAL LIBRARY — USED SUBMITTALS ONLY
================================================== */

const technicalLibraryDocuments: ProductDocument[] = ownedProducts
  .flatMap(product => productDocuments(product.id))
  .filter(document =>
    document.category
      .toLowerCase()
      .includes('submittal')
  )
  .filter(
    (document, index, documents) =>
      documents.findIndex(
        item => item.src === document.src
      ) === index
  );

/* ==================================================
   DYNAMIC ROUTE
================================================== */

export default async function Route({
  params
}: {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
}) {
  const { locale, slug } = await params;

  const root = slug[0];
  const ar = locale === 'ar';

  /* ==================================================
     PRODUCTS
  ================================================== */

  if (root === 'products') {
    const productSlug =
      slug.length > 1
        ? slug[1]
        : null;

    /* PRODUCT DETAIL */

    if (productSlug) {
      const product = await db.product.findFirst({
        where: {
          OR: [{slug: productSlug},{aliases:{some:{slug:productSlug}}}],
          visible: true
        },
        include:{features:{orderBy:[{sortOrder:"asc"},{createdAt:"asc"}]},documents:{orderBy:[{sortOrder:"asc"},{createdAt:"asc"}]}}
      });

      if (!product) {
        return notFound();
      }

      const legacySlug = product.legacySlug || product.slug;
      const documents = product.contentManaged ? product.documents.filter(d=>d.visible).map(d=>({src:d.fileUrl,title:ar ? d.titleAr || d.title : d.title,category:d.documentType})) : productDocuments(legacySlug);

      return (
        <Shell
          kicker={
            (product.contentManaged ? product.brand : null) || (ar
              ? 'منتجات KIRMARY'
              : 'KIRMARY OWN PRODUCTS')
          }
          title={
            ar
              ? product.nameAr
              : product.name
          }
          summary={
            (ar ? product.subtitleAr || product.subtitle : product.subtitle) || (ar
              ? 'حل هندسي من مجموعة KIRMARY، منظم لسهولة المراجعة الفنية والوصول إلى ملفات المنتج.'
              : 'A KIRMARY-engineered product system presented for clear specification review and direct access to technical documentation.')
          }
        >
          <ProductCertificationProvider productId={legacySlug}>
            <div className="product-detail-page premium-product-detail">
              <ProductDetailVisual
                productId={product.slug}
                productNumber={product.number}
                productImage={product.image || product.coverImage}
                productName={
                  ar
                    ? product.nameAr
                    : product.name
                }
                isHydrant={
                  product.slug === 'fire-hydrant'
                }
              />

              <div className="product-detail-copy">
                {(product.contentManaged || legacySlug !== 'victaulic-machines') && (
                  <>
                    <SectionIntro
                      label={
                        ar
                          ? 'نظرة عامة على المنتج'
                          : 'PRODUCT OVERVIEW'
                      }
                      title={
                        ar
                          ? 'مصمم لمتطلبات المشروعات.'
                          : 'Designed around project requirements.'
                      }
                      copy={
                        ar
                          ? product.descriptionAr
                          : product.description
                      }
                    />

                    {product.contentManaged ? (
                      <div className="product-feature-list">
                        {product.features.filter(feature => feature.visible).map((feature, index) => {
                          const description = ar ? feature.descriptionAr || feature.description : feature.description;
                          const content = (
                            <>
                              <span>{String(index + 1).padStart(2, '0')}</span>
                              <h3>{ar ? feature.titleAr || feature.title : feature.title}</h3>
                              {description && <p>{description}</p>}
                              {feature.documentUrl && <small>{feature.linkLabel || (ar ? 'افتح الملف ↗' : 'OPEN PDF ↗')}</small>}
                            </>
                          );
                          return feature.documentUrl ? (
                            <a key={feature.id} href={feature.documentUrl} target="_blank" rel="noopener noreferrer" className="product-feature product-feature--certificate-link">{content}</a>
                          ) : (
                            <article key={feature.id} className="product-feature">{content}</article>
                          );
                        })}
                      </div>
                    ) : <ProductFeatureList tags={product.tags} />}
                  </>
                )}

              <SectionIntro
                label={
                  ar
                    ? 'المستندات الفنية'
                    : 'TECHNICAL DOCUMENTATION'
                }
                title={
                  ar
                    ? 'ملفات المنتج المتاحة'
                    : 'Available Product Files'
                }
                copy={
                  ar
                    ? 'استعرض ملفات الاعتماد والـSubmittals والكتالوجات المتاحة داخل الأرشيف الفني.'
                    : 'Review the available submittals, catalogues, certification files and supporting technical documents.'
                }
              />

              {documents.length ? (
                <DocumentRows
                  documents={documents}
                  locale={locale}
                />
              ) : (
                <div className="empty-document-state">
                  <span>00</span>

                  <div>
                    <strong>
                      {ar
                        ? 'لا توجد ملفات مخصصة داخل الأرشيف الحالي.'
                        : 'No dedicated file is available in the current archive.'}
                    </strong>

                    <p>
                      {ar
                        ? 'يمكن طلب الملف الفني المطلوب مباشرة من فريق المبيعات.'
                        : 'The required technical document can be requested directly from the sales team.'}
                    </p>
                  </div>
                </div>
              )}

              <Link
                className="premium-primary-button"
                href={`/${locale}/request-a-quote`}
              >
                <span>
                  {ar
                    ? 'اطلب عرض سعر'
                    : 'REQUEST A QUOTATION'}
                </span>

                <b>↗</b>
              </Link>
              </div>
            </div>
          </ProductCertificationProvider>
        </Shell>
      );
    }

    /* PRODUCTS LISTING */

    const products = await db.product.findMany({
      where: {
        visible: true
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return (
      <Shell
        kicker={
          ar
            ? 'أنظمة KIRMARY'
            : 'KIRMARY PRODUCT SYSTEMS'
        }
        title={
          ar
            ? 'المنتجات'
            : 'Products'
        }
        summary={
          ar
            ? 'استكشف مجموعة KIRMARY المتكاملة من منتجات وأنظمة مكافحة الحريق..'
            : 'Explore KIRMARY’s comprehensive range of fire protection products and systems. .'
        }
      >
        <div className="premium-listing-grid">
          {products.map(product => (
            <Link
              href={`/${locale}/products/${product.slug}`}
              key={product.id}
              className="premium-product-card"
            >
              <div className="premium-product-card__topline">
                <span>
                  {product.number}
                </span>

                <small>
                  KIRMARY PRODUCT SYSTEM
                </small>
              </div>

              <div className="premium-product-card__visual">
                {(product.coverImage || product.image) ? (
                  <img
                    src={(product.coverImage || product.image)!}
                    alt={
                      ar
                        ? product.nameAr
                        : product.name
                    }
                  />
                ) : (
                  <div className="mini-hydrant" />
                )}
              </div>

              <div className="premium-product-card__copy">
                <h2>
                  {ar
                    ? product.nameAr
                    : product.name}
                </h2>

                <p>
                  {ar
                    ? product.descriptionAr
                    : product.description}
                </p>

                <strong>
                  {ar
                    ? 'استكشف النظام'
                    : 'EXPLORE '}{' '}
                  ↗
                </strong>
              </div>
            </Link>
          ))}
        </div>
      </Shell>
    );
  }

  /* ==================================================
     TECHNICAL LIBRARY
  ================================================== */

  if (root === 'technical-library') {
    /*
     * الـ16 Technical Submittals الأصليين يفضلوا كما هم.
     *
     * أي ProductDocument جديد يتم حفظه من:
     * - Product موجود
     * - Product جديد
     * - صفحة Technical Library في الـAdmin
     *
     * يظهر تلقائيًا بعدهم هنا.
     */

    const databaseTechnicalDocuments =
      await db.productDocument.findMany({
        where: {
          visible: true,
          product: {
            visible: true
          }
        },
        select: {
          id: true,
          title: true,
          titleAr: true,
          documentType: true,
          fileUrl: true,
          sortOrder: true,
          createdAt: true,
          product: {
            select: {
              sortOrder: true
            }
          }
        },
        orderBy: [
          {
            product: {
              sortOrder: 'asc'
            }
          },
          {
            sortOrder: 'asc'
          },
          {
            createdAt: 'asc'
          }
        ]
      });

    const newTechnicalDocuments: ProductDocument[] =
      databaseTechnicalDocuments
        .filter(document => document.fileUrl.trim())
        .map(document => ({
          src: document.fileUrl,
          title: ar
            ? document.titleAr || document.title
            : document.title,
          category:
            document.documentType ||
            'TECHNICAL DOCUMENT'
        }));

    /*
     * نحافظ على ترتيب الـ16 الأصليين أولًا.
     * ولو نفس الملف موجود بالفعل في الـ16
     * لا يتم عرضه مرة ثانية.
     */
    const existingTechnicalDocumentPaths =
      new Set(
        technicalLibraryDocuments.map(
          document => document.src
        )
      );

    const uniqueNewTechnicalDocuments =
      newTechnicalDocuments.filter(
        document => {
          if (
            existingTechnicalDocumentPaths.has(
              document.src
            )
          ) {
            return false;
          }

          existingTechnicalDocumentPaths.add(
            document.src
          );

          return true;
        }
      );

    const allTechnicalLibraryDocuments: ProductDocument[] = [
      ...technicalLibraryDocuments,
      ...uniqueNewTechnicalDocuments
    ];

    return (
      <Shell
        kicker={
          ar
            ? 'التحميلات'
            : 'DOWNLOADS'
        }
        title={
          ar
            ? 'المكتبة الفنية'
            : 'Technical Library'
        }
        summary={
          ar
            ? 'ملفات الـSubmittals والمستندات الفنية المتاحة ضمن منتجات KIRMARY.'
            : 'Technical submittals and documentation currently available across the KIRMARY product portfolio.'
        }
      >
        <SectionIntro
          label={
            ar
              ? 'المستندات الفنية'
              : 'TECHNICAL SUBMITTALS'
          }
          title={
            ar
              ? 'ملفات المنتجات الحالية.'
              : 'Current product submittals.'
          }
          copy={
            ar
              ? `تحتوي المكتبة حاليًا على ${allTechnicalLibraryDocuments.length} ملف فني متاح للوصول المباشر.`
              : `${allTechnicalLibraryDocuments.length} technical documents are available for direct access.`
          }
        />

        <TechnicalLibrarySearch
          documents={
            allTechnicalLibraryDocuments
          }
          locale={locale}
        />
      </Shell>
    );
  }

  /* ==================================================
     GALLERY
  ================================================== */

  if (root?.toLowerCase() === 'gallery') {
 const sections = await db.gallerySection.findMany({where:{visible:true},orderBy:[{sortOrder:'asc'},{createdAt:'asc'}]});
 const collections = sections.map(section => ({...section, name: ar ? section.nameAr || section.name : section.name, folder:section.slug, mark:section.name.slice(0,3).toUpperCase()}));
 const readCollectionImages = async (collection: {slug:string}) => (await db.galleryImage.findMany({where:{section:collection.slug,visible:true},orderBy:[{sortOrder:'asc'},{createdAt:'asc'}]})).map(image=>({src:image.image,title:ar ? image.titleAr || image.title : image.title}));

 const imageFilePattern = /\.(?:avif|gif|jpe?g|png|webp)$/i;

 const readLegacyCollectionCover = async (collection: {slug:string}) => {
   try {
     const files = await readdir(
       join(
         process.cwd(),
         'public',
         'gallery',
         collection.slug
       ),
       { withFileTypes: true }
     );

     const firstImageFile = files
       .filter(
         file =>
           file.isFile() &&
           imageFilePattern.test(file.name)
       )
       .map(file => file.name)
       .sort((first, second) =>
         first.localeCompare(second, undefined, {
           numeric: true,
           sensitivity: 'base'
         })
       )[0];

     return firstImageFile
       ? `/gallery/${collection.slug}/${encodeURIComponent(firstImageFile)}`
       : null;
   } catch {
     return null;
   }
 };

    const galleryStyles = `
      .gallery-collection-card
      .premium-product-card__visual {
        background: #ffffff;
      }

      .gallery-collection-card
      .premium-product-card__visual img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
      }

      .gallery-collection-placeholder {
        display: grid;
        place-items: center;
        width: 100%;
        height: 100%;
        min-height: 260px;
        background:
          radial-gradient(
            circle at 20% 15%,
            rgba(223, 36, 48, 0.2),
            transparent 34%
          ),
          radial-gradient(
            circle at 85% 80%,
            rgba(28, 76, 190, 0.26),
            transparent 38%
          ),
          #071836;
        color: #ffffff;
        font-size: clamp(24px, 3vw, 48px);
        font-weight: 700;
        letter-spacing: 0.08em;
      }

      .gallery-collection-count {
        display: block;
        margin-top: 8px;
        color: inherit;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .gallery-back-link {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 34px;
        color: #0b1d3c;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-decoration: none;
        text-transform: uppercase;
      }

      .gallery-images-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 20px;
      }

      .gallery-image-card {
        display: block;
        overflow: hidden;
        border: 1px solid rgba(11, 29, 60, 0.16);
        background: #ffffff;
        color: #0b1d3c;
        text-decoration: none;
      }

      .gallery-image-card figure {
  margin: 0;
  width: 100%;
}

.gallery-image-card__visual {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  padding: 0;
  overflow: hidden;
  background: #ffffff;
}

.gallery-image-card__visual img {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
      .gallery-image-card figcaption {
        display: flex;
        align-items: center;
        gap: 14px;
        min-height: 72px;
        padding: 14px 16px;
        border-top: 1px solid rgba(11, 29, 60, 0.12);
        font-size: 14px;
        font-weight: 600;
      }

      .gallery-image-card figcaption span {
        color: #df2430;
        font-size: 10px;
      }

      .gallery-empty-collection {
        display: grid;
        place-items: center;
        min-height: 300px;
        padding: 40px;
        border: 1px solid rgba(11, 29, 60, 0.16);
        background: #ffffff;
        text-align: center;
      }

      .gallery-empty-collection strong {
        display: block;
        margin-bottom: 12px;
        color: #0b1d3c;
        font-size: 24px;
      }

      .gallery-empty-collection code {
        display: inline-block;
        margin-top: 14px;
        padding: 8px 12px;
        background: #eef1f7;
        color: #0b1d3c;
        direction: ltr;
      }

      @media (max-width: 900px) {
        .gallery-images-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 620px) {
        .gallery-images-grid {
          grid-template-columns: 1fr;
        }
      }
    `;

    const gallerySlug =
      slug.length > 1
        ? slug[1]
        : null;

    if (gallerySlug) {
      const collection = collections.find(
        item => item.slug === gallerySlug
      );

      if (!collection) {
        return notFound();
      }

      const allImages = await readCollectionImages(
  collection
);

const images = allImages;
      return (
        <Shell
          kicker={
            ar
              ? 'الأرشيف البصري'
              : 'VISUAL ARCHIVE'
          }
          title={collection.name}
          summary={
            ar
              ? `صور ${collection.name} داخل مجموعة مستقلة.`
              : `${collection.name} imagery organized in one dedicated gallery.`
          }
          pageClassName="gallery-collection-page"
        >
          <style>{galleryStyles}</style>

          <Link
            className="gallery-back-link"
            href={`/${locale}/Gallery`}
          >
            ←{' '}
            {ar
              ? 'العودة إلى أقسام الجاليري'
              : 'BACK TO ALL GALLERIES'}
          </Link>

          {images.length ? (
            <GalleryLightbox images={images} />
          ) : (
            <div className="gallery-empty-collection">
              <div>
                <strong>
                  {ar
                    ? 'المجموعة جاهزة لإضافة الصور.'
                    : 'This gallery is ready for images.'}
                </strong>


              </div>
            </div>
          )}
        </Shell>
      );
    }

    const collectionsWithImages = await Promise.all(
      collections.map(async collection => {
        const images = await readCollectionImages(
          collection
        );

        const legacyCover = collection.coverImage
          ? null
          : await readLegacyCollectionCover(collection);

        return {
          ...collection,
          preview:
            collection.coverImage ||
            legacyCover ||
            images[0]?.src ||
            null,
          count: images.length
        };
      })
    );

    return (
      <Shell
        kicker={
          ar
            ? 'الأرشيف البصري'
            : 'VISUAL ARCHIVE'
        }
        title={
          ar
            ? 'الصور'
            : 'Gallery'
        }
        summary={
          ar
            ? 'استكشف أبرز مشاركات KIRMARY في المعارض والفعاليات وشراكات العلامات التجارية.   .'
            : 'Explore highlights from KIRMARY exhibitions, events, and brand partnerships..'
        }
      >
        <style>{galleryStyles}</style>

        <SectionIntro
          label={
            ar
              ? 'أقسام الجاليري'
              : 'GALLERY COLLECTIONS'
          }
          title={
            ar
              ? 'اختار المجموعة لعرض صورها.'
              : 'Choose a collection to view its images.'
          }

        />

        <div className="premium-listing-grid gallery-collection-list">
          {collectionsWithImages.map(
            (collection, index) => (
              <Link
                href={`/${locale}/Gallery/${collection.slug}`}
                key={collection.slug}
                className="premium-product-card gallery-collection-card"
              >
                <div className="premium-product-card__topline">
                  <span>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <small>
                    GALLERY COLLECTION
                  </small>
                </div>

                <div className="premium-product-card__visual">
                  {collection.preview ? (
                    <img
                      src={collection.preview}
                      alt={collection.name}
                    />
                  ) : (
                    <div className="gallery-collection-placeholder">
                      {collection.mark}
                    </div>
                  )}
                </div>

                <div className="premium-product-card__copy">
                  <h2>{collection.name}</h2>

                  <span className="gallery-collection-count">
                    {collection.count}{' '}
                    {collection.count === 1
                      ? 'IMAGE'
                      : 'IMAGES'}
                  </span>

                  <strong>
                    {ar
                      ? 'افتح الجاليري'
                      : 'OPEN GALLERY'}{' '}
                    ↗
                  </strong>
                </div>
              </Link>
            )
          )}
        </div>
      </Shell>
    );
  }

  /* ==================================================
     PROJECTS
  ================================================== */

  if (root === 'projects') {
    const projects = await db.project.findMany({
      where: {
        visible: true
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return (
      <Shell
        kicker={
          ar
            ? 'سجل المشروعات'
            : 'PROJECT RECORD'
        }
        title={
  ar
    ? 'المشروعات'
    : 'Projects'
}
summary={
  ar
    ? 'حلول موثوقة لمكافحة الحريق في أبرز المشروعات القومية بمصر.'
    : 'Trusted fire protection solutions for Egypt’s landmark projects.'
}


      >
        <SectionIntro
          label={
            ar
              ? 'مراجع التنفيذ'
              : 'DELIVERED REFERENCES'
          }
          title={
            ar
              ? 'مشروعات بارزة في أنحاء مصر.'
              : 'LANDMARK PROJECTS ACROSS EGYPT.'
          }
          copy={
            ar
              ? 'سجل حافل بالمشاركة في أبرز مشروعات البنية التحتية والرعاية الصحية والطيران والتنمية القومية في مصر.'
              : 'A proven record across Egypt’s most significant infrastructure, healthcare, aviation, and national development projects.'
          }
        />

        <div className="premium-project-grid">
          {projects.map(
            project => (
              <article
                key={project.id}
                className="premium-project-card"
              >
                <div className="premium-project-card__image">
                  <img
                    src={project.image}
                    alt={
                      ar
                        ? project.nameAr
                        : project.name
                    }
                  />

                  <span>
                    {String(project.sortOrder).padStart(
                      2,
                      '0'
                    )}
                  </span>
                </div>

                <div className="premium-project-card__copy">
                  <p>
                    {ar
                      ? 'مرجع مشروع'
                      : 'PROJECT REFERENCE'}
                  </p>

                  <h2>
                    {ar
                      ? project.nameAr
                      : project.name}
                  </h2>

                  {project.subtitle ? (
                    <h2
                      className="premium-project-card__location"
                      style={{
                        fontSize: '22px',
                        fontWeight: 400,
                        lineHeight: 1.2,
                        marginTop: '7px'
                      }}
                    >
                      {project.subtitle}
                    </h2>
                  ) : null}
                </div>
              </article>
            )
          )}
        </div>

        <section
          className="project-partners-section"
          style={{marginTop:'96px'}}
        >
          <SectionIntro
            label={ar?'الاستشاريون المعتمدون':'PROJECT PARTNERS'}
            title={ar?'الاستشاريون المعتمدون':'APPROVED CONSULTANTS'}
          />

          <div style={{width:'100%',overflow:'hidden',borderRadius:'18px',background:'#ffffff'}}>
            <img
  src="/projects/approved-consultants.png"
  alt="KIRMARY approved consultants"
  style={{
    display: 'block',
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
  }}
/>
          </div>
        </section>

        <section
          className="project-partners-section"
          style={{marginTop:'96px'}}
        >
          <SectionIntro
            label={ar?'عملاؤنا':'OUR CLIENTS'}
            title={ar?'شركات المقاولات':'OUR CLIENTS — CONSTRUCTION COMPANIES'}
          />
<img
  src="/projects/our-clients.png"
  alt="KIRMARY construction company clients"
  style={{
    display: 'block',
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
  }}
/>

        </section>
      </Shell>
    );
  }

  /* ==================================================
     BRANDS
  ================================================== */

  if (root === 'brands') {
    return (
      <Shell
        kicker={
          ar
            ? 'البورتفوليو العالمي'
            : 'GLOBAL PORTFOLIO'
        }
        title={
          ar
            ? 'البراندات'
            : 'Brands'
        }
        summary={
          ar
            ? 'مجموعة براندات متخصصة تكمل أنظمة الحماية من الحريق والإمدادات الهندسية.'
            : 'Specialized brands supporting a connected fire-protection and engineering-supplies portfolio.'
        }
      >
        <SectionIntro
          label={
            ar
              ? 'شبكة المنتجات'
              : 'PORTFOLIO NETWORK'
          }
          title={
            ar
              ? 'أنظمة متخصصة. تجربة واحدة.'
              : 'Specialized systems. One connected experience.'
          }
        />

        <div className="premium-brand-list">
          {brands.map(
            (brand, index) => (
              <article key={brand.name}>
                <span>
                  {String(index + 1).padStart(
                    2,
                    '0'
                  )}
                </span>

                <div>
                  <p>
                    {ar
                      ? 'براند متخصص'
                      : 'SPECIALIST BRAND'}
                  </p>

                  <h2>{brand.name}</h2>
                </div>

                <div>
                  <small>
                    {ar
                      ? 'مجال المنتجات'
                      : 'PRODUCT FIELD'}
                  </small>

                  <strong>
                    {brand.type}
                  </strong>
                </div>

                <div>
                  <small>
                    {ar
                      ? 'المرجع المتاح'
                      : 'AVAILABLE REFERENCE'}
                  </small>

                  <strong>
                    {brand.document}
                  </strong>
                </div>
              </article>
            )
          )}
        </div>
      </Shell>
    );
  }

  /* ==================================================
     APPROVALS
  ================================================== */

  if (
    root === 'approvals' ||
    root === 'certifications'
  ) {
    const approvalLogos =
      archiveLogos.filter(
        logo =>
          !logo.title
            .toLowerCase()
            .includes('kirmary')
      );

    return (
      <Shell
        kicker={
          ar
            ? 'المراجع والاعتمادات'
            : 'APPROVALS & REFERENCES'
        }
        title={
          ar
            ? 'الاعتمادات'
            : 'Approvals'
        }
        summary={
          ar
            ? 'العلامات والمراجع المرئية الموجودة داخل الأرشيف القديم، مع ضرورة مراجعة صلاحيتها الحالية قبل النشر النهائي.'
            : 'Visual approval and reference marks sourced from the legacy archive, subject to current-validity review before final publication.'
        }
      >
        <SectionIntro
          label={
            ar
              ? 'مكتبة العلامات'
              : 'MARK LIBRARY'
          }
          title={
            ar
              ? 'مرجع واضح لكل علامة.'
              : 'A clear reference for every supplied mark.'
          }
          copy={
            ar
              ? 'تم عرض كل علامة مرة واحدة، من دون تكرار النسخ المتطابقة.'
              : 'Each supplied mark is displayed once, without repeating identical copies.'
          }
        />

        <div className="premium-approval-grid">
          {approvalLogos.map(
            (logo, index) => (
              <figure key={logo.src}>
                <span>
                  {String(index + 1).padStart(
                    2,
                    '0'
                  )}
                </span>

                <img
                  src={logo.src}
                  alt={logo.title}
                />

                <figcaption>
                  {logo.title}
                </figcaption>
              </figure>
            )
          )}
        </div>
      </Shell>
    );
  }

  /* ==================================================
   CONTACT
================================================== */

if (root === 'contact') {
  const locations = [
    {
      number: '01',
      label: ar
        ? 'المكتب الرئيسي'
        : 'HEAD OFFICE',

      title: ar
        ? '5 أ شارع خالد بن الوليد مساكن شيراتون عمارة بنك QNB الدور الثامن.'
        : '5A Khaled Ibn Al Walid St., Sheraton Residences, QNB Bank Building, 8th Floor, Cairo, Egypt.',

      href:
        'https://maps.app.goo.gl/gMz2YDvTVQUTfK5z8'
    }
  ];

  const salesGroups = [
    {
      number: '03',

      label: ar
        ? 'المبيعات'
        : 'GENERAL SALES',

      phones: [
        '01281868225',
        '01205923742',
        '01227389528',
        '01208198121',
        '01220446050'
      ]
    },

    {
      number: '04',

      label: ar
        ? 'مبيعات المضخات'
        : 'PUMP SALES',

      phones: [
        '01282315418',
        '01211178250'
      ]
    },

    {
      number: '05',

      label: ar
        ? 'مبيعات منتجات الـ Plumbing & HVAC'
        : 'PLUMBING & HVAC SALES',

      phones: [
        '01282315428'
      ]
    }
  ];

  const whatsappLink = (phone: string) =>
    `https://wa.me/20${phone.slice(1)}`;

  return (
  <Shell
    pageClassName="contact-us-page"
    kicker={ar ? 'تواصل معنا' : 'CONTACT US'}
    title={ar ? 'تواصل معنا' : 'Contact Us'}
    summary={
      ar
        ? 'تواصل مع فريق KIRMARY لمناقشة احتياجات مشروعات مكافحة الحريق والتوريدات الفنية.'
        : 'Connect with KIRMARY to discuss your fire protection projects, technical requirements and supply needs.'
    }
  >

      {/* CONTACT CONTENT */}

      <div className="premium-contact-page">

        {/* LOCATIONS */}

        <div className="premium-location-grid">

          {locations.map((item) => (
            <article key={item.number}>

              <span className="contact-card-number">
                {item.number}
              </span>

              <p className="contact-card-label">
                {item.label}
              </p>

              <h2>
                {item.title}
              </h2>

              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="contact-action-button"
              >
                {ar
                  ? 'فتح الموقع'
                  : 'OPEN LOCATION'} ↗
              </a>

            </article>
          ))}

        </div>


        {/* SALES + WHATSAPP */}

        <div className="premium-sales-grid">

          {salesGroups.map((group) => (

            <article
              className="premium-sales-card"
              key={group.number}
            >

              <span className="contact-card-number">
                {group.number}
              </span>

              <p className="contact-card-label">
                {group.label}
              </p>

              <div className="premium-phone-list">

                {group.phones.map((phone) => (

                  <div
                    className="premium-phone-row"
                    key={phone}
                  >

                    <a
                      href={`tel:${phone}`}
                      className="premium-phone-number"
                    >
                      {phone}
                    </a>

                    <a
                      href={whatsappLink(phone)}
                      target="_blank"
                      rel="noreferrer"
                      className="contact-whatsapp-button"
                    >
                      WHATSAPP ↗
                    </a>

                  </div>

                ))}

              </div>

            </article>

          ))}

        </div>


        {/* EMAILS */}

        <article className="premium-email-card">

          <div>

            <span className="contact-card-number">
              06
            </span>

            <p className="contact-card-label">
              {ar
                ? 'البريد الإلكتروني'
                : 'EMAIL CONTACTS'}
            </p>

            <h2>
              {ar
                ? 'تواصل مباشرة مع القسم المناسب.'
                : 'Reach the right team directly.'}
            </h2>

          </div>


          <div className="premium-email-list">

            <div className="premium-email-row">

              <span>
                SALES
              </span>

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=sales@kirmary.com"
                target="_blank"
                rel="noreferrer"
              >
                sales@kirmary.com ↗
              </a>

            </div>


            <div className="premium-email-row">

              <span>
                INFO
              </span>

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=info@kirmary.com"
                target="_blank"
                rel="noreferrer"
              >
                info@kirmary.com ↗
              </a>

            </div>


            <div className="premium-email-row">

              <span>
                KIRMARY
              </span>

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=kirmary@kirmary.com"
                target="_blank"
                rel="noreferrer"
              >
                kirmary@kirmary.com ↗
              </a>

            </div>


            <div className="premium-email-row">

              <span>
                ENG. WAEL
              </span>

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=Eng.wael@kirmary.com"
                target="_blank"
                rel="noreferrer"
              >
                Eng.wael@kirmary.com ↗
              </a>

            </div>

          </div>

        </article>


        {/* RFQ */}

        <article className="premium-contact-rfq">

          <span className="contact-card-number">
            07
          </span>

          <p className="contact-card-label">
            RFQ
          </p>

          <h2>
            {ar
              ? 'أرسل متطلبات المشروع والكميات المطلوبة.'
              : 'Send your project requirements and required quantities.'}
          </h2>

          <Link
            href={`/${locale}/request-a-quote`}
            className="contact-action-button"
          >
            {ar
              ? 'طلب عرض سعر'
              : 'REQUEST A QUOTATION'} ↗
          </Link>

        </article>

      </div>

    </Shell>
  );
}
  /* ==================================================
     REQUEST A QUOTE
  ================================================== */

  if (root === 'request-a-quote') {
    return (
      <Shell
        kicker="RFQ"
        title={
          ar
            ? 'طلب عرض سعر'
            : 'Request a Quotation'
        }
        summary={
          ar
            ? 'أرسل بيانات المشروع والمنتجات والكميات المطلوبة ليتم توجيه الطلب إلى فريق المبيعات.'
            : 'Share the project details, required products and quantities so the request can be routed to the sales team.'
        }
      >
        <div className="premium-rfq-layout">
          <SectionIntro
            label={
              ar
                ? 'ابدأ الطلب'
                : 'START YOUR REQUEST'
            }
            title={
              ar
                ? 'ثلاث خطوات واضحة.'
                : 'Three clear steps.'
            }
            copy={
              ar
                ? 'بيانات التواصل، معلومات المشروع، ثم المتطلبات الفنية والكميات.'
                : 'Contact information, project details, then product quantities and technical requirements.'
            }
          />

          <RfqForm />
        </div>
      </Shell>
    );
  }

  /* ==================================================
     ABOUT
  ================================================== */

 if (root === 'about') {
  return (
    <Shell
      kicker={
        ar
          ? 'إمدادات هندسية دولية'
          : 'INTERNATIONAL ENGINEERING SUPPLIES'
      }

      title={
        ar
          ? 'عن KIRMARY'
          : 'About KIRMARY'
      }

      summary={
        ar
          ?' خبرة متخصصة في توريد حلول مكافحة الحريق بأعلى معايير الجودة والاعتماد.'
          : 'Specialized expertise in supplying fire protection solutions that meet the highest standards of quality and compliance.'
      }
    >
        <div className="premium-about-layout">
          <div className="premium-about-layout__copy">
            <SectionIntro
              label={
                ar
                  ? 'منظومة KIRMARY'
                  : 'THE KIRMARY SYSTEM'
              }
              title={
                ar
                  ? 'من التوريد الهندسي إلى الحماية المتكاملة.'
                  : 'From engineering supply to connected protection.'
              }
            />

            <div className="premium-about-story">
              {/* ABOUT KIRMARY */}
              <section className="premium-about-story__section">
                <p>
                  {ar ? (
                    <>
                      <strong>شركة كيرماري</strong> هي واحدة من أكبر الشركات نمواً في مصر. نحن نمد أكبر وأهم المشاريع التي تجري حاليًا في مصر. جميع منتجاتنا حاصلة على شهادات <strong>UL و FM و ULC و LBCP و ISO</strong>.
                    </>
                  ) : (
                    <>
                      <strong>KIRMARY</strong> is one of the fastest-growing companies in Egypt. We supply some of the largest and most important projects currently being carried out in Egypt. All our products are certified by <strong>UL, FM, ULC, LBCP, and ISO</strong>.
                    </>
                  )}
                </p>
              </section>

              {/* CHAIRMAN & FOUNDER */}
              <section className="premium-about-story__section premium-chairman-section">
                <div className="premium-chairman">
                  <div className="premium-chairman__photo">
                    <img
  className="premium-chairman__image"
  src="/images/eng-wael-bahig.png"
  alt={
    ar
      ? "المهندس وائل بهيج، رئيس مجلس الإدارة والمؤسس"
      : "Engineer Wael Bahig, Chairman and Founder"
  }
/>
                  </div>

                  <div className="premium-chairman__copy">
                    <span className="premium-chairman__eyebrow">
                      {ar
                        ? 'رئيس مجلس الإدارة والمؤسس'
                        : 'CHAIRMAN & FOUNDER'}
                    </span>

                    <h2>
                      {ar
                        ? 'المهندس وائل بهيج'
                        : 'ENGINEER WAEL BAHIG'}
                    </h2>

                    <strong className="premium-chairman__role">

                    </strong>

                    <p>
                      {ar
                        ? 'المهندس وائل بهيج هو رئيس مجلس الإدارة ومؤسس شركة كيرماري. وبخبرته الواسعة في مجال توريد أنظمة مكافحة الحرائق، يقود الشركة منذ تأسيسها عام 2008 برؤية تركز على جودة المنتجات، وموثوقية التوريد، ووضع احتياجات العميل أولاً.'
                        : 'Engineer Wael Bahig is the Chairman and Founder of KIRMARY With extensive experience in supplying firefighting systems, he has led the company since its establishment in 2008, focusing on product quality, reliable supply, and putting customers’ needs first..'}
                    </p>
                  </div>
                </div>
              </section>

              {/* HISTORY + AGENCIES + OBJECTIVE WITH STICKY TEAM IMAGE */}
              <div className="premium-about-sticky-stage">
                <div className="premium-about-sticky-stage__copy">

                  {/* KIRMARY HISTORY */}
                  <section className="premium-about-story__section premium-about-scroll-section">
                    <h2>
                      {ar
                        ? 'تاريخ كيرماري'
                        : 'KIRMARY History'}
                    </h2>

                    <p>
                      {ar
                        ? 'تأسست شركة كيرماري في عام 2008 من قبل رئيسها ومؤسسها المهندس وائل بهيج، بخبرته الكبيرة في مجال توريد جميع انظمة مكافحة الحرائق.'
                        : 'KIRMARY was established in 2008 by its Chairman and Founder, Engineer Wael Bahig, supported by his extensive experience in supplying all fire-fighting systems.'}
                    </p>

                    <p>
                      {ar
                        ? 'لقد تعاونا مع شركة Siemens العالمية في واحد من اكبر و اهم المشاريع العالمية (اكبر ثلاثة محطات توليد كهرباء في العالم)، ولقد قمنا بتوريد منتجاتنا إلى أنفاق قناة السويس.'
                        : 'We cooperated with Siemens on one of the largest and most important international projects, involving three of the largest power generation plants in the world. We also supplied our products to the Suez Canal Tunnels.'}
                    </p>

                    <p>
                      {ar
                        ? 'ونقوم بتزويد العديد من المشاريع القومية مؤخرًا؛ مثل القصور الرئاسية و ال29 وزارة ومبنى البرلمان الجديد ومبنى مجلس الوزراء في العاصمة الجديدة والكثير من المشاريع الضخمة الأخرى في جمهورية مصر العربية.'
                        : 'We currently supply many national projects, including the Presidential Palaces, the 29 Ministries, the New Parliament Building, the Cabinet Building in the New Administrative Capital, and many other major projects throughout the Arab Republic of Egypt.'}
                    </p>
                  </section>

                  {/* AGENCIES */}
<section className="premium-about-story__section premium-about-scroll-section">
  <h2>
    {ar
      ? 'شراكاتنا ووكالاتنا'
      : 'Our Agencies and Partnerships'}
  </h2>

  <div className="premium-about-agencies">
    <p>
      {ar ? (
        <>
          نحن نوفر خزائن خراطيم الحريق من{' '}
          <strong>KIRMARY</strong>، ومحابس{' '}
          <strong>KIRMARY</strong>، وحنفيات الحريق من{' '}
          <strong>KIRMARY</strong>.
        </>
      ) : (
        <>
          We provide <strong>KIRMARY</strong> fire hose cabinets,{' '}
          <strong>KIRMARY</strong> valves, and{' '}
          <strong>KIRMARY</strong> fire hydrants.
        </>
      )}
    </p>


                      <p>
                        {ar ? (
                          <>
                            نحن الوكيل الوحيد لمصنع <strong>SPP الأمريكية</strong> لمضخات الحريق و المصنعة وفقًا لـ <strong>NFPA 20</strong>،
                          </>
                        ) : (
                          <>
                            We are the exclusive agent for <strong>SPP USA</strong> for fire pumps manufactured in accordance with <strong>NFPA 20</strong>,
                          </>
                        )}
                      </p>
                      <p>
  {ar ? (
    <>
      والوكيل الحصري لمصنع <strong>BRISTOL</strong> لمضخات الحريق،
    </>
  ) : (
    <>
      the exclusive agent for <strong>BRISTOL</strong> for Fire Pumps,
    </>
  )}
</p>

                      <p>
                        {ar ? (
                          <>
                            والوكيل الوحيد لمصنع <strong>LEDE</strong> for Grooved Fittings, Valves, Fire Hydrants،
                          </>
                        ) : (
                          <>
                            the exclusive agent for <strong>LEDE</strong> for Grooved Fittings, Valves, and Fire Hydrants,
                          </>
                        )}
                      </p>

                      <p>
                        {ar ? (
                          <>
                            والوكيل الوحيد لمصنع <strong>MECH</strong> for Threaded Fittings 300DI،
                          </>
                        ) : (
                          <>
                            the exclusive agent for <strong>MECH</strong> for Threaded Fittings 300DI,
                          </>
                        )}
                      </p>

                      <p>
                        {ar ? (
                          <>
                            و الوكيل الوحيد لمصنع <strong>TIGER STEEL</strong> FOR ERW PIPES،
                          </>
                        ) : (
                          <>
                            the exclusive agent for <strong>TIGER STEEL</strong> for ERW Pipes,
                          </>
                        )}
                      </p>

                      <p>
                        {ar ? (
                          <>
                            والوكيل الوحيد لـمصنع <strong>Victaulic- Tuwei</strong> for Machines،
                          </>
                        ) : (
                          <>
                            the exclusive agent for <strong>Victaulic-Tuwei</strong> for Machines,
                          </>
                        )}
                      </p>

                      <p>
                        {ar ? (
                          <>
                            ووكيل لمصنع <strong>VIKING</strong> for Sprinklers, Valves, and Fire Hydrants،
                          </>
                        ) : (
                          <>
                            an agent for <strong>VIKING</strong> for Sprinklers, Valves, and Fire Hydrants,
                          </>
                        )}
                      </p>


                                        </div>

                    <p>
                      {ar ? (
                        <>
                          ولدينا العديد من الماركات التجارية الشهيرة مثل{' '}
                          <strong>
                            Giacomini Italy, Potter, Reliable, System Sensor,
                            Hangers, Winters for Pressure Gauges, Valmatic for
                            Air Vents, ATS, etc.
                          </strong>
                        </>
                      ) : (
                        <>
                          We also offer many well-known international brands,
                          including{' '}
                          <strong>
                            Giacomini Italy, Potter, Reliable, System Sensor,
                            Hangers, Winters for Pressure Gauges, Valmatic for
                            Air Vents, ATS, and others.
                          </strong>
                        </>
                      )}
                    </p>
                  </section>

                  {/* COMPANY OBJECTIVE */}
                  {/* COMPANY OBJECTIVE */}
                  <section className="premium-about-story__section premium-about-scroll-section">
                    <h2>
                      {ar
                        ? 'هدف الشركة'
                        : 'Company Objective'}
                    </h2>

                    <p>
                      {ar ? (
                        <>
                          تبني شركة كيرماري استراتيجيتها علي تقديم جميع منتجات أنظمة مكافحة الحرائق <strong>بجودة عالية وضمان التسليم علي الفور</strong>.
                        </>
                      ) : (
                        <>
                          KIRMARY builds its strategy around providing all fire-fighting system products with <strong>high quality and ensuring immediate delivery</strong>.
                        </>
                      )}
                    </p>

                    <p>
                      {ar ? (
                        <>
                          وتتمثل رؤيتنا في ضمان أفضل خدمة لعملائنا من خلال تزويدهم بكل ما يحتاجون له من خلال <strong>مخزونا الكبير المتوفر</strong>، لأننا من أكبر الشركات التي تقدم خدمة أنظمة مكافحة الحريق في مصر.
                        </>
                      ) : (
                        <>
                          Our vision is to guarantee the best service for our customers by supplying everything they need through our <strong>large available stock</strong>, as we are one of the largest companies providing fire-fighting system services in Egypt.
                        </>
                      )}
                    </p>

                    <p>
                      {ar
                        ? 'كما نوفر المزيد من التسهيلات لعملائنا.'
                        : 'We also provide additional facilities for our customers.'}
                    </p>

                    <strong className="premium-about-story__closing">
                      {ar
                        ? 'كيرمارى اسم يمكنك الوثوق به.'
                        : 'KIRMARY A Name You Can Trust.'}
                    </strong>
                  </section>
                </div>

                <aside className="premium-about-sticky-stage__visual">
                  <div className="premium-about-sticky-stage__visual-inner">
                    <img
  src={featured.team}
  alt="KIRMARY team"
/>

                    <div className="premium-about-sticky-stage__caption">
                      <span>KIRMARY</span>

                      <strong>
                        INTERNATIONAL ENGINEERING SUPPLIES
                      </strong>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  return notFound();
}
