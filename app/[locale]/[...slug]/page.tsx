import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GalleryLightbox } from './gallery-lightbox';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
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
  ownedProducts,
  projects
} from '../../../lib/site-content';

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

const galleryCollections = [
  {
    slug: 'nfpa-exhibition',
    folder: 'nfpa-exhibition',
    name: 'NFPA Exhibition',
    mark: 'NFPA'
  },
  {
    slug: 'intersec-dubai-exhibition',
    folder: 'intersec-dubai-exhibition',
    name: 'Intersec Dubai Exhibition',
    mark: 'DUBAI'
  },
    {
    slug: 'firex-exhibition',
    folder: 'firex-exhibition',
    name: 'FIREX Exhibition ',
    mark: 'FIREX'
  },
  {
    slug: 'cairo-ict-exhibition',
    folder: 'cairo-ict-exhibition',
    name: 'CAIRO ICT Exhibition',
    mark: 'ICT'
  },
  {
    slug: 'kirmary-international-llc',
    folder: 'kirmary-international-llc',
    name: 'KIRMARY International L.L.C.',
    mark: 'KIRMARY'
  },
  {
    slug: 'bristol',
    folder: 'bristol',
    name: 'Bristol',
    mark: 'BRISTOL'
  },
  {
    slug: 'spp',
    folder: 'spp',
    name: 'SPP',
    mark: 'SPP'
  },
  {
    slug: 'viking',
    folder: 'viking',
    name: 'Viking',
    mark: 'VIKING'
  },
  {
    slug: 'tiger-steel-erw-pipes',
    folder: 'tiger-steel-erw-pipes',
    name: 'Tiger Steel ERW Pipes',
    mark: 'TIGER'
  },
  {
    slug: 'lede',
    folder: 'lede',
    name: 'LEDE',
    mark: 'LEDE'
  },
  {
    slug: 'mech',
    folder: 'mech',
    name: 'MECH',
    mark: 'MECH'
  },
  {
    slug: 'zurn',
    folder: 'zurn',
    name: 'Zurn',
    mark: 'ZURN'
  },
  {
    slug: 'general',
    folder: 'general',
    name: 'General',
    mark: 'GENERAL'
  }
] as const;

type GalleryCollection =
  (typeof galleryCollections)[number];

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
            href={document.src}
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

function productDocuments(productId: string): ProductDocument[] {
  if (productId === 'valmatic-air-vent') {
    return [
      {
        src: '/Technical/valmatic-air-vent-submittal.pdf',
        title: 'VALMATIC Automatic Air Vent Submittal',
        category: 'TECHNICAL SUBMITTAL'
      }
    ];
  }
  if (productId === 'potter') {
    return [
      {
        src: '/Technical/potter-submittal.pdf',
        title: 'POTTER Fire Sprinkler Monitoring Submittal',
        category: 'TECHNICAL SUBMITTAL'
      }
    ];
  }

 if (productId === 'victaulic-machines') {
  return [
    {
      src: '/Technical/tuwei-machines-catalogue.pdf',
      title: 'VICTAULIC-TUWEI Pipe Machinery Catalogue',
      category: 'TECHNICAL SUBMITTAL'
    }
  ];
}

  if (productId === 'erico') {
    return [
      {
        src: '/Technical/erico-hangers-submittal.pdf',
        title: 'ERICO Hangers Submittal',
        category: 'TECHNICAL SUBMITTAL'
      }
    ];
  }

  if (productId === 'zurn-drains') {
    return [
      {
        src: '/Technical/zurn-drains-submittal.pdf',
        title: 'KIRMARY - ZURN Drains Submittal',
        category: 'TECHNICAL SUBMITTAL'
      }
    ];
  }

  if (productId === 'lede-valves') {
    return [
      {
        src: '/Technical/lede-fire-valves-catalogue.pdf',
        title: 'LEDE Fire Valves Catalogue',
        category: 'PRODUCT CATALOGUE'
      },
      {
        src: '/Technical/lede-fire-valves-submittal.pdf',
        title: 'LEDE Valves for Fire Fighting Works',
        category: 'TECHNICAL SUBMITTAL'
      }
    ];
  }

  if (productId === 'lede-grooved-fittings') {
    return [
      {
        src: '/Technical/lede-grooved-catalogue-up-to-24.pdf',
        title: 'LEDE Grooved Catalogue - Up to 24 Inch',
        category: 'PRODUCT CATALOGUE'
      },
      {
        src: '/Technical/lede-grooved-submittal-approvals.pdf',
        title: 'LEDE Grooved Fittings Submittal & Approvals',
        category: 'TECHNICAL SUBMITTAL'
      }
    ];
  }

  if (productId === 'viking-sprinklers') {
    return [
      {
        src: '/Technical/viking-sprinklers-submittal.pdf',
        title: 'VIKING Sprinklers Submittal',
        category: 'TECHNICAL SUBMITTAL'
      }
    ];
  }

  if (productId === 'tiger-steel-pipes') {
    return [
      {
        src: '/Technical/tiger-steel-erw-pipes-submittal.pdf',
        title: 'TIGER Steel ERW Pipes Submittal',
        category: 'TECHNICAL SUBMITTAL'
      }
    ];
  }

  if (productId === 'fire-cabinets') {
    return [
      {
        src: '/Technical/kirmary-fire-cabinets-submittal.pdf',
        title: 'KIRMARY Fire Hose Cabinets Submittal',
        category: 'TECHNICAL SUBMITTAL'
      }
    ];
  }

  if (productId === 'lede-plumbing-hvac-valves') {
    return [
      {
        src: '/Technical/lede-water-valves-catalogue.pdf',
        title: 'LEDE Water Valves Catalogue',
        category: 'PRODUCT CATALOGUE'
      },
      {
        src: '/Technical/lede-plumbing-hvac-submittal.pdf',
        title: 'LEDE Valves - Plumbing, Water Supply & HVAC',
        category: 'TECHNICAL SUBMITTAL'
      }
    ];
  }

  if (productId === 'fire-hydrant') {
    return [
      {
        src: '/Technical/km-fire-hydrant-submittal.pdf',
        title: 'KIRMARY Dry Fire Hydrant Technical Submittal',
        category: 'TECHNICAL SUBMITTAL'
      }
    ];
  }

  if (productId === 'bristol-fire-pumps') {
    return [
      {
        src: '/Technical/bristol-fire-pumps-submittal.pdf',
        title: 'BRISTOL Fire Pumps Submittal',
        category: 'TECHNICAL SUBMITTAL'
      }
    ];
  }

  if (productId === 'spp-fire-pumps') {
    return [
      {
        src: '/Technical/spp-fire-pumps-brochure.pdf',
        title: 'SPP Fire Pumps & Systems Brochure',
        category: 'PRODUCT BROCHURE'
      },
      {
        src: '/Technical/spp-fire-pumps-submittal.pdf',
        title: 'SPP Fire Pumps Submittal - USA - FM & UL',
        category: 'TECHNICAL SUBMITTAL'
      }
    ];
  }

  if (productId === 'mech-threaded-fittings') {
    return [
      {
        src: '/Technical/mech-ductile-cast-iron-pipe-fittings.pdf',
        title: 'MECH Ductile & Cast Iron Pipe Fittings',
        category: 'PRODUCT CATALOGUE'
      },
      {
        src: '/Technical/mech-threaded-fittings-300di-submittal.pdf',
        title: 'MECH Threaded Fittings 300DI',
        category: 'TECHNICAL SUBMITTAL'
      }
    ];
  }

  const archiveMatches = archiveDocuments.filter(document => {
    const name = document.title.toLowerCase();

    if (productId === 'fire-cabinets') {
      return name.includes('cabinet');
    }

    if (productId === 'fire-valves') {
      return (
        name.includes('valve') ||
        name.includes('km100') ||
        name.includes('km150') ||
        name.includes('km200') ||
        name.includes('km250') ||
        name.includes('km300')
      );
    }

    if (productId === 'fire-hydrant') {
      return name.includes('hydrant');
    }

    return false;
  });

  if (productId === 'fire-valves') {
    return [
      {
        src: '/Technical/kirmary-valves-submittal.pdf',
        title: 'KIRMARY Valves Technical Submittal',
        category: 'TECHNICAL SUBMITTAL'
      }
    ];
  }

  return archiveMatches;
}

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
      const product = ownedProducts.find(
        item => item.id === productSlug
      );

      if (!product) {
        return notFound();
      }

      const documents = productDocuments(
        product.id
      );

      return (
        <Shell
          kicker={
            ar
              ? 'منتجات KIRMARY'
              : 'KIRMARY OWN PRODUCTS'
          }
          title={
            ar
              ? product.ar
              : product.name
          }
          summary={
            ar
              ? 'حل هندسي من مجموعة KIRMARY، منظم لسهولة المراجعة الفنية والوصول إلى ملفات المنتج.'
              : 'A KIRMARY-engineered product system presented for clear specification review and direct access to technical documentation.'
          }
        >
          <ProductCertificationProvider productId={product.id}>
            <div className="product-detail-page premium-product-detail">
              <ProductDetailVisual
                productId={product.id}
                productNumber={product.number}
                productImage={product.image}
                productName={
                  ar
                    ? product.ar
                    : product.name
                }
                isHydrant={
                  product.id === 'fire-hydrant'
                }
              />

              <div className="product-detail-copy">
                {product.id !== 'victaulic-machines' && (
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

                    <ProductFeatureList
                      tags={product.tags}
                    />
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
          {ownedProducts.map(product => (
            <Link
              href={`/${locale}/products/${product.id}`}
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
                {product.image ? (
                  <img
                    src={product.image}
                    alt={
                      ar
                        ? product.ar
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
                    ? product.ar
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
            ? 'ملفات الـSubmittals الفنية المستخدمة حاليًا ضمن منتجات KIRMARY.'
            : 'Technical submittals currently used across the KIRMARY product portfolio.'
        }
      >
        <SectionIntro
          label={
            ar
              ? 'SUBMITTALS الفنية'
              : 'TECHNICAL SUBMITTALS'
          }
          title={
            ar
              ? 'ملفات المنتجات المستخدمة حاليًا.'
              : 'Current product submittals.'
          }
          copy={
            ar
              ? `تحتوي المكتبة على ${technicalLibraryDocuments.length} ملف Submittal فني مستخدم ضمن منتجات KIRMARY.`
              : `${technicalLibraryDocuments.length} technical submittals are available for direct access.`
          }
        />

        <TechnicalLibrarySearch
  documents={technicalLibraryDocuments}
  locale={locale}
/>
      </Shell>
    );
  }

  /* ==================================================
     GALLERY
  ================================================== */

  if (root?.toLowerCase() === 'gallery') {
    const imageFilePattern =
      /\.(?:avif|gif|jpe?g|png|webp)$/i;

    const readCollectionImages = async (
      collection: GalleryCollection
    ) => {
      try {
        const files = await readdir(
          join(
            process.cwd(),
            'public',
            'gallery',
            collection.folder
          ),
          { withFileTypes: true }
        );

        return files
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
          )
          .map(fileName => ({
            src: `/gallery/${collection.folder}/${encodeURIComponent(fileName)}`,
            title: fileName
              .replace(/\.[^.]+$/, '')
              .replace(/[-_]+/g, ' ')
          }));
      } catch {
        return [];
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
      const collection = galleryCollections.find(
        item => item.slug === gallerySlug
      );

      if (!collection) {
        return notFound();
      }

      const allImages = await readCollectionImages(
  collection
);

const images = allImages.slice(1);
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

                <p>
                  {ar
                    ? 'أضيفي الصور داخل الفولدر التالي وستظهر تلقائيًا.'
                    : 'Add image files to this folder and they will appear automatically.'}
                </p>

                <code>
                  public/gallery/{collection.folder}
                </code>
              </div>
            </div>
          )}
        </Shell>
      );
    }

    const collectionsWithImages = await Promise.all(
      galleryCollections.map(async collection => {
        const images = await readCollectionImages(
          collection
        );

        return {
  ...collection,
  preview: images[0]?.src ?? null,
  count: Math.max(images.length - 1, 0)
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
            (project, index) => (
              <article
                key={project.name}
                className="premium-project-card"
              >
                <div className="premium-project-card__image">
                  <img
                    src={project.image}
                    alt={
                      ar
                        ? project.ar
                        : project.name
                    }
                  />

                  <span>
                    {String(index + 1).padStart(
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
                      ? project.ar
                      : project.name}
                  </h2>

                  {'subtitle' in project && project.subtitle ? (
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