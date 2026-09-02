'use client';

import { useMemo, useState } from 'react';

type ProductDocument = {
  src: string;
  title: string;
  category: string;
  sourceYear?: string | number | null;
};

export function TechnicalLibrarySearch({
  documents,
  locale
}: {
  documents: readonly ProductDocument[];
  locale: string;
}) {
  const [query, setQuery] = useState('');

  const ar = locale === 'ar';

  const filteredDocuments = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return documents;
    }

    return documents.filter(document => {
      return (
        document.title.toLowerCase().includes(value) ||
        document.category.toLowerCase().includes(value)
      );
    });
  }, [documents, query]);

  return (
    <>
      <div className="tech-galaxy-search-section">

        <div
          className="tech-galaxy-stars"
          aria-hidden="true"
        />

        <div className="tech-galaxy-search-container">

          <div className="tech-galaxy-nebula" />
          <div className="tech-galaxy-starfield" />
          <div className="tech-galaxy-stardust" />
          <div className="tech-galaxy-cosmic-ring" />

          <div className="tech-galaxy-main">

            <input
              className="tech-galaxy-input"
              type="text"
              value={query}
              onChange={event =>
                setQuery(event.target.value)
              }
              placeholder={
                ar
                  ? 'ابحث عن Submittal...'
                  : 'Search submittals...'
              }
              aria-label={
                ar
                  ? 'البحث في الملفات الفنية'
                  : 'Search technical submittals'
              }
            />

            <span className="tech-galaxy-search-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M16.5 16.5L21 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <div
              className="tech-galaxy-cosmic-glow"
              aria-hidden="true"
            />

            {query && (
              <>
                <div
                  className="tech-galaxy-wormhole-border"
                  aria-hidden="true"
                />

                <button
                  type="button"
                  className="tech-galaxy-clear"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  ×
                </button>
              </>
            )}
          </div>
        </div>

        <div className="tech-galaxy-result-count">
          <span>
            {String(
              filteredDocuments.length
            ).padStart(2, '0')}
          </span>

          <small>
            {ar
              ? 'ملف متاح'
              : filteredDocuments.length === 1
                ? 'SUBMITTAL FOUND'
                : 'SUBMITTALS FOUND'}
          </small>
        </div>
      </div>

      {filteredDocuments.length ? (
        <div className="premium-document-list">
          {filteredDocuments.map(
            (document, index) => (
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
                    {String(index + 1).padStart(
                      2,
                      '0'
                    )}
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
                >
                  <span className="texto">
                    {ar
                      ? 'تحميل'
                      : 'DOWNLOAD'}
                  </span>

                  <svg
                    className="mysvg"
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="none"
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
            )
          )}
        </div>
      ) : (
        <div className="tech-search-empty">
          <span>00</span>

          <div>
            <strong>
              {ar
                ? 'لا توجد ملفات مطابقة.'
                : 'No matching submittals found.'}
            </strong>

            <p>
              {ar
                ? 'جرب البحث باسم منتج آخر.'
                : 'Try searching for another product.'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}