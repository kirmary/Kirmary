
'use client';

import { useEffect, useState } from 'react';
import SiteIntro from './site-intro';

const INTRO_STORAGE_KEY = 'kirmary-intro-played';

export default function IntroOnce() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const introAlreadyPlayed =
      sessionStorage.getItem(INTRO_STORAGE_KEY);

    if (introAlreadyPlayed === 'true') {
      return;
    }

    setShowIntro(true);

    sessionStorage.setItem(
      INTRO_STORAGE_KEY,
      'true'
    );
  }, []);

  if (!showIntro) {
    return null;
  }

  return <SiteIntro />;
}

