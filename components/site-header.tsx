'use client';

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import GlowNavItem from './glow-nav-item';

type SiteHeaderProps = {
  locale: string;
};

type NavigationItem = {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
};

/* =========================
   ICONS
========================= */

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M3 11.2 12 3l9 8.2v9.3a.5.5 0 0 1-.5.5H15v-6H9v6H3.5a.5.5 0 0 1-.5-.5v-9.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M12 10.8v6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="7.5"
        r="1.2"
        fill="currentColor"
      />
    </svg>
  );
}

function ProductsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="m12 3 8 4.3v9.4L12 21l-8-4.3V7.3L12 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="m4.4 7.5 7.6 4.2 7.6-4.2M12 11.7V21"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BrandsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M4 6.5h16v11H4v-11Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M8 6.5V4h8v2.5M7.5 12h9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="12"
        r="1.4"
        fill="currentColor"
      />
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M5 21V5h10v16M15 10h4v11M3 21h18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M8 8h4M8 12h4M8 16h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CertificationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="m12 3 7 3v5.2c0 4.5-2.7 7.7-7 9.8-4.3-2.1-7-5.3-7-9.8V6l7-3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="m8.7 12 2.1 2.1 4.7-4.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FilesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M6 3h8l4 4v14H6V3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M14 3v5h5M9 12h6M9 16h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M4 5h16v14H4V5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="m5 7 7 5 7-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================
   HEADER
========================= */

export function SiteHeader({
  locale
}: SiteHeaderProps) {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const isArabic = locale === 'ar';

  const labels = isArabic
    ? {
        home: 'الرئيسية',
        about: 'من نحن',
        products: 'المنتجات',
        brands: 'البراندات',
        projects: 'المشروعات',
        Gallery: 'معرض الصور',
        files: 'الملفات الفنية',
        contact: 'تواصل معنا',
        quote: 'طلب عرض سعر',
        menu: 'القائمة'
      }
    : {
        home: 'Home',
        about: 'About',
        products: 'Products',
        brands: 'Brands',
        projects: 'Projects',
        Gallery: 'Gallery',
        files: 'Technical Files',
        contact: 'Contact Us',
        quote: 'Request a Quote',
        menu: 'Menu'
      };

  const navigationItems =
    useMemo<NavigationItem[]>(
      () => [
        {
          id: 'home',
          label: labels.home,
          href: `/${locale}`,
          icon: <HomeIcon />
        },
        {
          id: 'about',
          label: labels.about,
          href: `/${locale}/about`,
          icon: <AboutIcon />
        },
        {
          id: 'products',
          label: labels.products,
          href: `/${locale}/products`,
          icon: <ProductsIcon />
        },
        
        {
          id: 'projects',
          label: labels.projects,
          href: `/${locale}/projects`,
          icon: <ProjectsIcon />
        },
        {
          id: 'Gallery',
          label: labels.Gallery,
          href: `/${locale}/gallery`,
          icon: <CertificationIcon />
        },
        {
          id: 'technical-files',
          label: labels.files,
          href: `/${locale}/technical-library`,
          icon: <FilesIcon />
        },
        {
          id: 'contact',
          label: labels.contact,
          href: `/${locale}/contact`,
          icon: <ContactIcon />
        }
      ],
      [
        locale,
        labels.home,
        labels.about,
        labels.products,
        labels.brands,
        labels.projects,
        labels.Gallery,
        labels.files,
        labels.contact
      ]
    );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener(
      'scroll',
      handleScroll,
      {
        passive: true
      }
    );

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      );
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow =
        'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const isItemActive = (
    item: NavigationItem
  ) => {
    if (item.id === 'home') {
      return (
        pathname === `/${locale}` ||
        pathname === `/${locale}/`
      );
    }

    return (
      pathname === item.href ||
      pathname.startsWith(
        `${item.href}/`
      )
    );
  };

  const otherLocale =
    locale === 'ar' ? 'en' : 'ar';

  const languageHref = (() => {
    const currentPath =
      pathname || `/${locale}`;

    const pathParts =
      currentPath
        .split('/')
        .filter(Boolean);

    if (
      pathParts[0] === 'ar' ||
      pathParts[0] === 'en'
    ) {
      pathParts[0] = otherLocale;
    } else {
      pathParts.unshift(otherLocale);
    }

    return `/${pathParts.join('/')}`;
  })();

  return (
    <>
      <header
        className={[
          'glow-site-header',
          scrolled ? 'is-scrolled' : '',
          menuOpen ? 'menu-is-open' : ''
        ]
          .filter(Boolean)
          .join(' ')}
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <div className="glow-header-inner">
          <Link
            href={`/${locale}`}
            className="glow-header-logo"
            aria-label="KIRMARY Home"
          >
            <img
              src="/brand/logos/Kirmary-white-Logo-02-copy.png"
              alt="KIRMARY"
            />
          </Link>

          <nav
            className="glow-desktop-nav"
            aria-label="Main navigation"
          >
            {navigationItems.map(item => (
              <GlowNavItem
                key={item.id}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={isItemActive(item)}
              />
            ))}
          </nav>

          <div className="glow-header-actions">
            <Link
              href={languageHref}
              className="glow-language-button"
              aria-label={
                isArabic
                  ? 'Switch to English'
                  : 'التبديل إلى العربية'
              }
            >
              {isArabic ? 'EN' : 'AR'}
            </Link>

            <Link
              href={`/${locale}/request-a-quote`}
              className="glow-quote-button"
            >
              <span>
                {labels.quote}
              </span>

              <b aria-hidden="true">
                ↗
              </b>
            </Link>

            <button
              type="button"
              className={`glow-menu-button ${
                menuOpen ? 'is-open' : ''
              }`}
              onClick={() =>
                setMenuOpen(current => !current)
              }
              aria-label={labels.menu}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`glow-mobile-menu ${
          menuOpen ? 'is-open' : ''
        }`}
        dir={isArabic ? 'rtl' : 'ltr'}
        aria-hidden={!menuOpen}
      >
        <div className="glow-mobile-menu-inner">
          <div className="glow-mobile-menu-heading">
            <span>
              KIRMARY
            </span>

            <small>
              INTERNATIONAL ENGINEERING
              SUPPLIES
            </small>
          </div>

          <nav
            className="glow-mobile-navigation"
            aria-label="Mobile navigation"
          >
            {navigationItems.map(item => (
              <GlowNavItem
                key={item.id}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={isItemActive(item)}
                onClick={() =>
                  setMenuOpen(false)
                }
              />
            ))}
          </nav>

          <div className="glow-mobile-menu-footer">
            <Link
              href={`/${locale}/request-a-quote`}
              className="glow-mobile-quote"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              {labels.quote}
              <span>↗</span>
            </Link>

            <Link
              href={languageHref}
              className="glow-mobile-language"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              {isArabic
                ? 'English'
                : 'العربية'}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SiteHeader;