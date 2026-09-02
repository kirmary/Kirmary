
'use client';

import { useEffect, useRef, useState } from 'react';

type IntroPhase = 'playing' | 'leaving' | 'done';

export function SiteIntro() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<IntroPhase>('playing');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('intro-running');

    const video = videoRef.current;

    const finishIntro = () => {
      setPhase(current =>
        current === 'done'
          ? current
          : 'leaving'
      );

      root.classList.remove('intro-running');
    };

    const removeIntro = () => {
      setPhase('done');
    };

    const fallbackTimer = window.setTimeout(
      finishIntro,
      10200
    );

    const removeTimer = window.setTimeout(
      removeIntro,
      11050
    );

    const handleEnded = () => {
      finishIntro();

      window.setTimeout(
        removeIntro,
        850
      );
    };

    const handleCanPlay = () => {
      if (!video) return;

      void video.play().catch(() => {
        // Browser can still delay autoplay.
        // The fallback timer will close the intro.
      });
    };

    video?.addEventListener(
      'ended',
      handleEnded
    );

    video?.addEventListener(
      'canplay',
      handleCanPlay
    );

    if (video) {
      video.load();

      void video.play().catch(() => {
        // Wait for canplay event.
      });
    }

    return () => {
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(removeTimer);

      video?.removeEventListener(
        'ended',
        handleEnded
      );

      video?.removeEventListener(
        'canplay',
        handleCanPlay
      );

      root.classList.remove('intro-running');
    };
  }, []);

  if (phase === 'done') {
    return null;
  }

  return (
    <div
      className={`video-site-intro ${
        phase === 'leaving'
          ? 'is-leaving'
          : ''
      }`}
      aria-label="KIRMARY introduction"
    >
      <video
        ref={videoRef}
        className="video-site-intro__media"
        src="/videos/kirmary-intro.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
      />

      <div
        className="video-site-intro__edge"
        aria-hidden="true"
      />

      <style jsx>{`
        .video-site-intro {
          position: fixed;
          inset: 0;
          z-index: 99999;

          display: grid;
          place-items: center;

          overflow: hidden;
          background: #000000;

          opacity: 1;
          visibility: visible;

          transition:
            opacity 800ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              ),
            visibility 0ms
              linear
              800ms;
        }

        .video-site-intro.is-leaving {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .video-site-intro__media {
          position: absolute;
          inset: 0;

          width: 100%;
          height: 100%;

          object-fit: cover;
          object-position: center;

          background: #000000;
          user-select: none;
          pointer-events: none;
        }

        .video-site-intro__edge {
          position: absolute;
          inset: 0;

          box-shadow:
            inset 0 0 90px
              rgba(0, 0, 0, 0.18);

          pointer-events: none;
        }

        @media (
          orientation: portrait
        ) {
          .video-site-intro__media {
            object-fit: contain;
          }
        }

        @media (
          prefers-reduced-motion:
          reduce
        ) {
          .video-site-intro {
            transition-duration:
              250ms;
          }
        }
      `}</style>
    </div>
  );
}

export default SiteIntro;

