'use client';

import { useEffect, useState } from 'react';
import SiteIntro from './site-intro';

const INTRO_STORAGE_KEY = 'kirmary-intro-played';

export default function IntroOnce() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const introAlreadyPlayed = sessionStorage.getItem(
      INTRO_STORAGE_KEY
    );

    if (introAlreadyPlayed !== 'true') {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem(
      INTRO_STORAGE_KEY,
      'true'
    );

    setShowIntro(false);
  };

  if (!showIntro) {
    return null;
  }

  return (
    <SiteIntro
      onComplete={handleIntroComplete}
    />
  );
}