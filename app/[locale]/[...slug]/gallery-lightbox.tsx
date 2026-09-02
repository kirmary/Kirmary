'use client';

import { useCallback, useEffect, useState } from 'react';

type GalleryImage = {
  src: string;
  title: string;
};

export function GalleryLightbox({
  images
}: {
  images: GalleryImage[];
}) {
  const [activeIndex, setActiveIndex] =
    useState<number | null>(null);

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex(current =>
      current === null
        ? null
        : (current - 1 + images.length) % images.length
    );
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex(current =>
      current === null
        ? null
        : (current + 1) % images.length
    );
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox();
      }

      if (event.key === 'ArrowLeft') {
        showPrevious();
      }

      if (event.key === 'ArrowRight') {
        showNext();
      }
    };

    window.addEventListener('keydown', handleKeyboard);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyboard);
    };
  }, [activeIndex, closeLightbox, showNext, showPrevious]);

  const activeImage =
    activeIndex === null ? null : images[activeIndex];

  return (
    <>
      <div className="gallery-images-grid">
        {images.map((image, index) => (
          <button
            type="button"
            className="gallery-image-card gallery-image-button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Open ${image.title}`}
            key={image.src}
          >
            <figure>
              <span className="gallery-image-card__visual">
                <img
                  loading="lazy"
                  src={image.src}
                  alt={image.title}
                />
              </span>

            </figure>
          </button>
        ))}
      </div>

      {activeImage && activeIndex !== null && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
          onClick={event => {
            if (event.target === event.currentTarget) {
              closeLightbox();
            }
          }}
        >
          <button
            type="button"
            className="gallery-lightbox__close"
            onClick={closeLightbox}
            aria-label="Close"
          >
            ×
          </button>

          <button
            type="button"
            className="gallery-lightbox__arrow gallery-lightbox__arrow--previous"
            onClick={showPrevious}
            aria-label="Previous image"
          >
            ‹
          </button>

          <div className="gallery-lightbox__content">
            <img
              src={activeImage.src}
              alt={activeImage.title}
            />

            <div className="gallery-lightbox__caption">
              <span>{activeImage.title}</span>
              <span>
                {activeIndex + 1} / {images.length}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="gallery-lightbox__arrow gallery-lightbox__arrow--next"
            onClick={showNext}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}

      <style jsx>{`
        .gallery-image-button {
          width: 100%;
          padding: 0;
          font: inherit;
          text-align: left;
          cursor: zoom-in;
          appearance: none;
        }

        .gallery-image-button figure {
          margin: 0;
        }

        .gallery-lightbox {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: grid;
          place-items: center;
          padding: 30px 80px;
          background: rgba(0, 0, 0, 0.94);
        }

        .gallery-lightbox__content {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 1100px;
          max-height: calc(100vh - 60px);
        }

        .gallery-lightbox__content img {
          display: block;
          max-width: 100%;
          max-height: calc(100vh - 120px);
          object-fit: contain;
        }

        .gallery-lightbox__caption {
          display: flex;
          justify-content: space-between;
          gap: 30px;
          width: 100%;
          padding-top: 15px;
          color: #ffffff;
          font-size: 14px;
        }

        .gallery-lightbox__close,
        .gallery-lightbox__arrow {
          position: fixed;
          border: 0;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.12);
          cursor: pointer;
        }

        .gallery-lightbox__close {
          top: 20px;
          right: 25px;
          width: 48px;
          height: 48px;
          font-size: 34px;
        }

        .gallery-lightbox__arrow {
          top: 50%;
          width: 54px;
          height: 70px;
          transform: translateY(-50%);
          font-size: 52px;
        }

        .gallery-lightbox__arrow--previous {
          left: 20px;
        }

        .gallery-lightbox__arrow--next {
          right: 20px;
        }

        @media (max-width: 700px) {
          .gallery-lightbox {
            padding: 70px 15px;
          }

          .gallery-lightbox__arrow {
            width: 44px;
            height: 58px;
            font-size: 40px;
          }

          .gallery-lightbox__arrow--previous {
            left: 5px;
          }

          .gallery-lightbox__arrow--next {
            right: 5px;
          }
        }
      `}</style>
    </>
  );
}