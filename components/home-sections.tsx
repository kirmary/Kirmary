import Link from 'next/link';
import {Reveal} from './reveal';
import {ProductShowcase} from './product-showcase';
import {ownedProducts,projects} from '../lib/site-content';

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

export function HomeSections({
  locale
}: {
  locale: string;
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
            <video
              src="/videos/kirmary-archive.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />

            <span>VISUAL ARCHIVE // KIRMARY</span>
          </div>
        </div>
      </section>

      <ProductShowcase
        locale={locale}
        products={ownedProducts}
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
          {projects.map((project, i) => {
            const isNewAdministrativeCapital =
              (i >= 3 && i <= 7) ||
              (i >= 10 && i <= 12);

            return (
              <Reveal
                key={project.name}
                className={`project-card project-${i + 1}`}
              >
                <img
                  src={project.image}
                  alt={ar ? project.ar : project.name}
                />

                <div>
                  <span>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <h3>
                    {ar ? project.ar : project.name}
                  </h3>

                  {isNewAdministrativeCapital && (
                    <p className="project-location">
                      New Administrative Capital
                    </p>
                  )}
                </div>
              </Reveal>
            );
          })}
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