'use client';

import { useEffect, useRef, useState } from 'react';

type IntroPhase = 'playing' | 'leaving';

type SiteIntroProps = {
  onComplete?: () => void;
};

export function SiteIntro({
  onComplete,
}: SiteIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] =
    useState<IntroPhase>('playing');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('intro-running');

    const video = videoRef.current;

    const finishIntro = () => {
      setPhase('leaving');

      root.classList.remove('intro-running');

      window.setTimeout(() => {
        onComplete?.();
      }, 800);
    };

    const handleEnded = () => {
      finishIntro();
    };

    const handleError = () => {
      console.error(
        'KIRMARY intro video could not be loaded.'
      );

      finishIntro();
    };

    if (video) {
      video.addEventListener(
        'ended',
        handleEnded
      );

      video.addEventListener(
        'error',
        handleError
      );

      video.play().catch(error => {
        console.error(
          'Video autoplay failed:',
          error
        );
      });
    }

    return () => {
      root.classList.remove('intro-running');

      video?.removeEventListener(
        'ended',
        handleEnded
      );

      video?.removeEventListener(
        'error',
        handleError
      );
    };
  }, [onComplete]);

  return (
    <div
      className={`video-site-intro ${
        phase === 'leaving'
          ? 'is-leaving'
          : ''
      }`}
    >
      <video
        ref={videoRef}
        className="video-site-intro__media"
        muted
        playsInline
        autoPlay
        preload="auto"
        onEnded={() => {}}
      >
        <source
          src="/videos/kirmary-intro.mp4"
          type="video/mp4"
        />
      </video>

      <style jsx>{`
        .video-site-intro {
          position: fixed;
          inset: 0;
          z-index: 999999;

          width: 100%;
          height: 100%;

          overflow: hidden;
          background: #000;

          opacity: 1;

          transition: opacity 0.8s ease;
        }

        .video-site-intro.is-leaving {
          opacity: 0;
          pointer-events: none;
        }

        .video-site-intro__media {
          position: absolute;
          inset: 0;

          width: 100%;
          height: 100%;

          object-fit: cover;
          object-position: center;

          display: block;
        }

        @media (orientation: portrait) {
          .video-site-intro__media {
            object-fit: contain;
          }
        }
      `}</style>
    </div>
  );
}

export default SiteIntro;