import SplashCursor from '../../components/SplashCursor';
import IntroOnce from '../../components/intro-once';
import { OrbitalHero } from '../../components/orbital-hero';
import { HomeSections } from '../../components/home-sections';

export default async function Page({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
     <IntroOnce />

      <SplashCursor
        RAINBOW_MODE={false}
        COLOR="#D12129"
        DYE_RESOLUTION={1024}
        SPLAT_RADIUS={0.16}
        SPLAT_FORCE={4200}
        DENSITY_DISSIPATION={4.4}
      />

      <OrbitalHero locale={locale} />

      <HomeSections locale={locale} />
    </>
  );
}