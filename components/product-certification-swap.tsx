'use client';
import { legacyProductFeatures } from '../lib/legacy-product-content';

import {
  createContext,
  useContext,
  type ReactNode
} from 'react';

type CertificateItem = {
  label: string;
  pdf: string;
};

type CertificationContextValue = {
  productId: string;
};

const CertificationContext =
  createContext<CertificationContextValue | null>(null);

export function ProductCertificationProvider({
  productId,
  children
}: {
  productId: string;
  children: ReactNode;
}) {
  return (
    <CertificationContext.Provider value={{ productId }}>
      {children}
    </CertificationContext.Provider>
  );
}

function useCertification() {
  const context = useContext(CertificationContext);

  if (!context) {
    throw new Error(
      'Product certification components must be inside ProductCertificationProvider.'
    );
  }

  return context;
}

export function ProductDetailVisual({
  productId,
  productNumber,
  productImage,
  productName,
  isHydrant = false
}: {
  productId: string;
  productNumber: string;
  productImage: string | null;
  productName: string;
  isHydrant?: boolean;
}) {
  const classes = [
    'product-detail-visual',
    isHydrant ? 'product-detail-visual--hydrant' : '',
    !productImage ? 'hydrant-placeholder' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <span className="product-visual-label">
        KIRMARY · {productNumber}
      </span>

      {productImage ? (
        <img src={productImage} alt={productName} />
      ) : (
        <div className="hydrant-illustration">
          <span />
          <i />
          <b />
          <em />
        </div>
      )}
    </div>
  );
}

export function ProductFeatureList({
  tags = []
}: {
  tags?: readonly string[];
}) {
  const { productId } = useCertification();

  const features = legacyProductFeatures(productId, tags);

  return (
    <div className="product-feature-list">
      {features.map(({title: tag, certificate}, index) => {

        const content = (
          <>
            <span>
              {String(index + 1).padStart(2, '0')}
            </span>

            <h3>{tag}</h3>

            {certificate && (
              <small>
                OPEN PDF ↗
              </small>
            )}
          </>
        );

        if (certificate) {
          return (
            <a
              key={tag}
              href={certificate.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="product-feature product-feature--certificate-link"
              aria-label={`Open ${certificate.label} PDF`}
            >
              {content}
            </a>
          );
        }

        return (
          <article
            className="product-feature"
            key={tag}
          >
            {content}
          </article>
        );
      })}
    </div>
  );
}
