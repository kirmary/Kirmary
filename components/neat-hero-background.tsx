'use client';

import { useEffect, useRef } from 'react';
import { NeatGradient } from '@firecms/neat';

export default function NeatHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const gradient = new NeatGradient({
      ref: canvas,

      colors: [
        {
          color: '#020617',
          enabled: true
        },
        {
          color: '#0B2A72',
          enabled: true
        },
        {
          color: '#315DCC',
          enabled: true
        },
        {
          color: '#D12129',
          enabled: true
        },
        {
          color: '#FF5A61',
          enabled: true
        }
      ],

      speed: 2.8,

      horizontalPressure: 3,
      verticalPressure: 4,

      waveFrequencyX: 2.8,
      waveFrequencyY: 3.4,
      waveAmplitude: 5,

      shadows: 3,
      highlights: 10,

      colorBrightness: 1.15,
      colorSaturation: 1.35,
      colorBlending: 8,

      backgroundColor: '#020617',
      backgroundAlpha: 1,

      resolution: 0.75,
      wireframe: false,

      grainIntensity: 0.015,
      grainScale: 2,
      grainSparsity: 0.1,
      grainSpeed: 0.1,

      yOffset: 0,
      yOffsetWaveMultiplier: 5,
      yOffsetColorMultiplier: 4,
      yOffsetFlowMultiplier: 5,

      flowEnabled: true,
      flowDistortionA: 0.5,
      flowDistortionB: 3.5,
      flowScale: 3,
      flowEase: 0.5,

      enableProceduralTexture: false,

      shapeType: 'plane',

      shapeRotationX: 0,
      shapeRotationY: 0,
      shapeRotationZ: 0,

      shapeAutoRotateSpeedX: 0,
      shapeAutoRotateSpeedY: 0,

      planeBend: 0,
      planeTwist: 0,

      flatShading: true,

      cameraLock: true,

      cameraX: 0,
      cameraY: 0,
      cameraZ: 0,

      cameraRotationX: 0,
      cameraRotationY: 0,
      cameraRotationZ: 0,

      cameraZoom: 1
    });

    const handleScroll = () => {
      gradient.yOffset = window.scrollY * 0.22;
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      gradient.destroy();
    };
  }, []);

  return (
    <div
      className="neat-hero-background"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="neat-hero-canvas"
      />
    </div>
  );
}