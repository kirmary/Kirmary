import SplashCursor from '../../components/SplashCursor';
import IntroOnce from '../../components/intro-once';
import { OrbitalHero } from '../../components/orbital-hero';
import { HomeSections } from '../../components/home-sections';
import { db } from '../../lib/db';

export default async function Page({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const products = await db.product.findMany({
    where: {
      visible: true
    },
    orderBy: [
      {
        sortOrder: 'asc'
      },
      {
        createdAt: 'desc'
      }
    ]
  });

  const projects = await db.project.findMany({
    where: {
      visible: true
    },
    orderBy: [
      {
        sortOrder: 'asc'
      },
      {
        createdAt: 'desc'
      }
    ]
  });

  const websiteProducts = products.map(product => ({
    id: product.slug,
    slug: product.slug,
    number: product.number,
    name: product.name,
    ar: product.nameAr,
    brand: product.brand ?? '',
    subtitle: product.subtitle ?? '',
    category: product.category ?? '',
    description: product.description,
    descriptionAr: product.descriptionAr,
    image: product.image || product.coverImage,
    coverImage: product.coverImage || product.image || '',
    tags: product.tags
  }));

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

      <OrbitalHero
        locale={locale}
        products={websiteProducts}
      />

      <HomeSections
        locale={locale}
        products={websiteProducts}
        projects={projects}
      />
    </>
  );
}
