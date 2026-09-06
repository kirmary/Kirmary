import Link from 'next/link';

import { Reveal } from './reveal';

import { ProductShowcase } from './product-showcase';

function SectionHead({
  index,
  kicker,
  title,
  copy
}: {
  index: string;
  kicker: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="section-head">
      <span>{index}</span>

      <div>
        <p>{kicker}</p>
        <h2>{title}</h2>

        {copy && (
          <div className="section-copy">
            {copy}
          </div>
        )}
      </div>
    </div>
  );
}

type WebsiteProduct = {
  id: string;
  number: string;
  name: string;
  ar: string;
  description: string;
  descriptionAr: string;
  image: string | null;
  tags: string[];
};

type WebsiteProject = {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  subtitle: string | null;
  sortOrder: number;
};

export function HomeSections({
  locale,
  products,
  projects
}: {
  locale: string;
  products: WebsiteProduct[];
  projects: WebsiteProject[];
}) {
  const ar = locale === 'ar';

  return (
    <>
      <section
        id="about"
        className="story-section about-section"
      >
        <Reveal>
          <SectionHead
            index="01"
            kicker={ar ? 'عن KIRMARY' : 'THE SYSTEM'}
            title={
              ar
                ? 'من التوريد الهندسي إلى الحماية الكاملة.'
                : 'ONE ENGINEERING PORTFOLIO.\nBUILT AROUND PROTECTION.'
            }
            copy={
              ar
? 'اكتشف حلول KIRMARY المتكاملة لأنظمة مكافحة الحريق، ومنتجاتها الخاصة، وشراكاتها مع البراندات العالمية، إلى جانب أبرز المشروعات والملفات الفنية.'                : 'KIRMARY brings proprietary fire-protection products, international brands, project references and technical documents into one connected presentation system.'
            }
          />
        </Reveal>

        <div className="about-media-grid">
  <div className="about-video">
    <iframe 
      src="https://www.youtube.com/embed/3guUc0S_FoI?autoplay=1&mute=1&loop=1&playlist=3guUc0S_FoI&controls=0&showinfo=0" 
      width="100%" 
      height="100%" 
      style={{ minHeight: '500px', border: 'none', pointerEvents: 'none' }}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowFullScreen
    />

            <span>VISUAL ARCHIVE // KIRMARY</span>
          </div>
        </div>
      </section>

      <ProductShowcase
  locale={locale}
  products={products}
/>

      <section
        id="projects"
        className="story-section projects-section"
      >
        <Reveal>
          <SectionHead
            index="03"
            kicker={ar ? 'المشروعات' : 'PROJECT RECORD'}
            title={
              ar
                ? 'حلول هندسية\nلأبرز مشروعات مصر.'
                : 'ENGINEERING SOLUTIONS FOR\nEGYPT’S LANDMARK PROJECTS.'
            }
          />
        </Reveal>

        <div className="project-grid">
          {projects.map(project => (
              <Reveal
                key={project.id}
                className={`project-card project-${project.sortOrder}`}
              >
                <img
                  src={project.image}
                  alt={ar ? project.nameAr : project.name}
                />

                <div>
                  <span>
                    {String(project.sortOrder).padStart(2, '0')}
                  </span>

                  <h3>
                    {ar ? project.nameAr : project.name}
                  </h3>

                  {project.subtitle && (
                    <p className="project-location">
                      {project.subtitle}
                    </p>
                  )}
                </div>
              </Reveal>
          ))}
        </div>

        <Link
          className="section-link"
          href={`/${locale}/projects`}
        >
          {ar
            ? 'فتح أرشيف المشروعات'
            : 'Open the project archive'}{' '}
          →
        </Link>
      </section>
    </>
  );
}
