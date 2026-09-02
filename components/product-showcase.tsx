'use client';

import Link from 'next/link';
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent
} from 'react';

type ProductItem = {
  readonly id: string;
  readonly number: string;
  readonly name: string;
  readonly ar: string;
  readonly description: string;
  readonly descriptionAr: string;
  readonly image: string | null;
  readonly tags?: readonly string[] | null;
};

type ProductShowcaseProps = {
  locale: string;
  products: readonly ProductItem[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ProductShowcase({
  locale,
  products
}: ProductShowcaseProps) {
  const ar = locale === 'ar';
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let animationFrame = 0;

    const updateActiveProduct = () => {
      animationFrame = 0;

      const section = sectionRef.current;

      if (!section || products.length < 2) {
        return;
      }

      const sectionTop =
        section.getBoundingClientRect().top +
        window.scrollY;

      const scrollDistance = Math.max(
        1,
        section.offsetHeight -
          window.innerHeight
      );

      const progress = clamp(
        (window.scrollY - sectionTop) /
          scrollDistance,
        0,
        1
      );

      const nextIndex = Math.round(
        progress * (products.length - 1)
      );

      setActiveIndex(current =>
        current === nextIndex
          ? current
          : nextIndex
      );
    };

    const requestUpdate = () => {
      if (!animationFrame) {
        animationFrame =
          window.requestAnimationFrame(
            updateActiveProduct
          );
      }
    };

    updateActiveProduct();

    window.addEventListener(
      'scroll',
      requestUpdate,
      { passive: true }
    );

    window.addEventListener(
      'resize',
      requestUpdate
    );

    return () => {
      window.removeEventListener(
        'scroll',
        requestUpdate
      );

      window.removeEventListener(
        'resize',
        requestUpdate
      );

      if (animationFrame) {
        window.cancelAnimationFrame(
          animationFrame
        );
      }
    };
  }, [products.length]);

  const scrollToProduct = (index: number) => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const sectionTop =
      section.getBoundingClientRect().top +
      window.scrollY;

    const scrollDistance = Math.max(
      1,
      section.offsetHeight -
        window.innerHeight
    );

    if (index >= products.length) {
      window.scrollTo({
        top:
          sectionTop +
          section.offsetHeight +
          1,
        behavior: 'smooth'
      });

      return;
    }

    const progress =
      products.length === 1
        ? 0
        : index /
          (products.length - 1);

    window.scrollTo({
      top:
        sectionTop +
        progress * scrollDistance,
      behavior: 'smooth'
    });
  };

  const handlePointerMove = (
    event: PointerEvent<HTMLDivElement>
  ) => {
    if (
      window.matchMedia(
        '(pointer: coarse)'
      ).matches
    ) {
      return;
    }

    const rect =
      event.currentTarget.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) /
        rect.width -
      0.5;

    const y =
      (event.clientY - rect.top) /
        rect.height -
      0.5;

    event.currentTarget.style.setProperty(
      '--kps-rx',
      `${(-y * 5).toFixed(2)}deg`
    );

    event.currentTarget.style.setProperty(
      '--kps-ry',
      `${(x * 7).toFixed(2)}deg`
    );
  };

  const resetPointerTilt = () => {
    stageRef.current?.style.setProperty(
      '--kps-rx',
      '0deg'
    );

    stageRef.current?.style.setProperty(
      '--kps-ry',
      '0deg'
    );
  };

  const sectionStyle = {
    '--kps-height': `${
      100 +
      Math.max(0, products.length - 1) *
        58
    }vh`,

    '--kps-progress': `${
      ((activeIndex + 1) /
        Math.max(1, products.length)) *
      100
    }%`
  } as CSSProperties;

  return (
    <section
      ref={sectionRef}
      id="owned-products"
      className="k-product-showcase"
      style={sectionStyle}
      aria-label={
        ar
          ? 'مجموعة المنتجات'
          : 'Complete product range'
      }
    >
      <style>{`
        html body .k-product-showcase
        .kps-copy
        .kps-title-mask
        h2.kps-product-title-white {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
          background: none !important;
          background-image: none !important;
          background-clip: border-box !important;
          -webkit-background-clip: border-box !important;
          opacity: 1 !important;
          visibility: visible !important;
          mix-blend-mode: normal !important;
          filter: none !important;
          font-size: clamp(32px, 3.8vw, 56px) !important;
          line-height: 0.95 !important;
          letter-spacing: -0.055em !important;
          text-shadow: 0 8px 24px rgba(0, 0, 0, 0.18) !important;
        }

        html body .k-product-showcase
        .kps-card-stack
        .kps-card.is-active {
          transform:
            translate3d(0, 0, 0)
            rotateX(0deg)
            rotateY(0deg)
            rotateZ(0deg)
            scale(1) !important;
        }

        html body .k-product-showcase
        .kps-card-stack
        .kps-card.is-before {
          transform:
            translate3d(-15%, -88%, -180px)
            rotateX(0deg)
            rotateY(0deg)
            rotateZ(0deg)
            scale(0.78) !important;
        }

        html body .k-product-showcase
        .kps-card-stack
        .kps-card.is-after {
          transform:
            translate3d(15%, 88%, -180px)
            rotateX(0deg)
            rotateY(0deg)
            rotateZ(0deg)
            scale(0.78) !important;
        }

        html body .k-product-showcase
        .kps-card-stack
        .kps-card-media {
          position: relative !important;
          display: block !important;
          width: 100% !important;
          height: 100% !important;
          min-height: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
          background: #ffffff !important;
          background-image: none !important;
        }

        html body .k-product-showcase
        .kps-card-stack
        .kps-card-media
        .kps-card-wordmark {
          display: none !important;
        }

        html body .k-product-showcase
        .kps-card-stack
        .kps-card-media
        img {
          display: block !important;
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          max-width: 100% !important;
          max-height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          object-fit: contain !important;
          object-position: center center !important;
          background: #ffffff !important;
          transform: none !important;
          scale: 1 !important;
          filter: none !important;
        }

        html body .k-product-showcase
        .kps-card-stack
        .kps-card.is-active
        .kps-card-media
        img,
        html body .k-product-showcase
        .kps-card-stack
        .kps-card:hover
        .kps-card-media
        img {
          transform: none !important;
          scale: 1 !important;
        }

        html body .k-product-showcase
        .kps-card-media
        img.kps-hydrant-image {
          display: block !important;
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          max-width: 100% !important;
          max-height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          object-fit: contain !important;
          object-position: center center !important;
          transform: none !important;
          filter: drop-shadow(
            0 22px 24px rgba(7, 11, 54, 0.14)
          ) !important;
        }

        html body .k-product-showcase
        .kps-card.is-active
        .kps-card-media
        img.kps-hydrant-image {
          transform: none !important;
        }
      `}</style>

      <div className="kps-sticky">
        <div
          className="kps-grid"
          aria-hidden="true"
        />

        <div
          className="kps-glow kps-glow-red"
          aria-hidden="true"
        />

        <div
          className="kps-glow kps-glow-blue"
          aria-hidden="true"
        />

        <header className="kps-header">
          <div className="kps-section-id">
            <span>02</span>

            <p>
              {ar
                ? 'مجموعة منتجات متكاملة. مصدر هندسي واحد.'
                : 'A COMPLETE PRODUCT RANGE. ONE ENGINEERING SOURCE.'}
            </p>
          </div>

          <div
            className="kps-count"
            aria-live="polite"
          >
            <strong>
              {String(
                activeIndex + 1
              ).padStart(2, '0')}
            </strong>

            <i />

            <span>
              {String(
                products.length
              ).padStart(2, '0')}
            </span>
          </div>
        </header>

        <div
          ref={stageRef}
          className="kps-stage"
          onPointerMove={
            handlePointerMove
          }
          onPointerLeave={
            resetPointerTilt
          }
        >
          <div className="kps-copy-stack">
            {products.map(
              (product, index) => {
                const state =
                  index === activeIndex
                    ? 'is-active'
                    : index < activeIndex
                      ? 'is-before'
                      : 'is-after';

                return (
                  <article
                    key={product.id}
                    className={`kps-copy ${state}`}
                    aria-hidden={
                      index !== activeIndex
                    }
                  >
                    <p className="kps-eyebrow">
                      <span>
                        {product.number}
                      </span>

                      KIRMARY // PRODUCT SYSTEM
                    </p>

                    <div className="kps-title-mask">
                      <h2
                        className="kps-product-title-white"
                        style={{
                          color: '#ffffff',
                          WebkitTextFillColor: '#ffffff',
                          background: 'none',
                        }}
                      >
                        {ar
                          ? product.ar
                          : product.name}
                      </h2>
                    </div>

                    <div className="kps-description">
                      {ar
                        ? product.descriptionAr
                        : product.description}
                    </div>

                    <ul className="kps-tags">
                      {(product.tags ?? []).map(
                        tag => (
                          <li key={tag}>
                            <Link
                              href={`/${locale}/products/${product.id}`}
                              tabIndex={
                                index ===
                                activeIndex
                                  ? 0
                                  : -1
                              }
                              onClick={event =>
                                event.stopPropagation()
                              }
                            >
                              {tag}
                            </Link>
                          </li>
                        )
                      )}
                    </ul>

<Link
  className="kps-uiverse-btn"
  href={`/${locale}/products/${product.id}`}
  tabIndex={index === activeIndex ? 0 : -1}
>
  {ar ? 'استكشف النظام ↗' : 'EXPLORE SYSTEM ↗'}
</Link>
                  </article>
                );
              }
            )}
          </div>

          <div className="kps-card-stack">
            {products.map(
              (product, index) => {
                const state =
                  index === activeIndex
                    ? 'is-active'
                    : index < activeIndex
                      ? 'is-before'
                      : 'is-after';

                const imageSrc =
                  product.image ??
                  (
                    product.id === 'fire-hydrant'
                      ? '/orbit/kirmary-hydrant.png'
                      : null
                  );

                return (
                  <figure
                    key={product.id}
                    className={`kps-card ${state}`}
                    aria-hidden={
                      index !== activeIndex
                    }
                  >
                    <figcaption>
                      <div>
                        <strong>
                          {ar
                            ? product.ar
                            : product.name}
                        </strong>

                        <small>
                          {(product.tags ?? [])
                            .slice(0, 2)
                            .join(' · ')}
                        </small>
                      </div>

                      <span>
                        {product.number}
                      </span>
                    </figcaption>

                    <div
                      className={`kps-card-media ${
                        imageSrc
                          ? ''
                          : 'is-placeholder'
                      }`}
                    >
                      <div
                        className="kps-card-wordmark"
                        aria-hidden="true"
                      >
                        KIRMARY
                      </div>

                      {imageSrc ? (
                        <img
                          className={
                            product.id === 'fire-hydrant'
                              ? 'kps-hydrant-image'
                              : undefined
                          }
                          src={imageSrc}
                          alt={
                            ar
                              ? product.ar
                              : product.name
                          }
                          draggable={false}
                        />
                      ) : (
                        <div className="kps-missing-image">
                          <span>
                            {product.number}
                          </span>

                          <strong>
                            {ar
                              ? product.ar
                              : product.name}
                          </strong>
                        </div>
                      )}
                    </div>
                  </figure>
                );
              }
            )}
          </div>
        </div>

        <footer className="kps-footer">
          <button
            type="button"
            onClick={() =>
              scrollToProduct(
                activeIndex + 1
              )
            }
            aria-label={
              activeIndex ===
              products.length - 1
                ? ar
                  ? 'الانتقال إلى القسم التالي'
                  : 'Continue to the next section'
                : ar
                  ? 'عرض المنتج التالي'
                  : 'Show next product'
            }
          >
            <span>
              {activeIndex ===
              products.length - 1
                ? ar
                  ? 'استمرار'
                  : 'Continue'
                : ar
                  ? 'التالي'
                  : 'Next product'}
            </span>

            <b>↓</b>
          </button>

          <div
            className="kps-progress"
            aria-hidden="true"
          >
            <i />
          </div>

          <p>
            {ar
              ? 'حرّكي لعرض المجموعة'
              : 'SCROLL TO EXPLORE THE RANGE'}
          </p>
        </footer>
      </div>
    </section>
  );
}