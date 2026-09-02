'use client';

export default function HeroVideoBackground() {
  return (
    <div
      className="hero-video-background"
      aria-hidden="true"
    >
      <video
        className="hero-video-background__media"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source
          src="/videos/neat-bg.mp4"
          type="video/mp4"
        />
      </video>

      <div className="hero-video-background__overlay" />
    </div>
  );
}