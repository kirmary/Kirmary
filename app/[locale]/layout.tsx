import {notFound} from 'next/navigation';
import Link from 'next/link';
import {SiteHeader} from '../../components/site-header';

export default async function LocaleLayout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){
  const {locale}=await params;
  if(!['en','ar'].includes(locale))notFound();
  return <div dir={locale==='ar'?'rtl':'ltr'} lang={locale} className="locale-root">
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader locale={locale}/>
    <main id="main">{children}</main>
    <footer className="site-footer">
      <div><img src="/brand/logos/Kirmary-white-Logo-02-copy.png" alt="KIRMARY"/><p>INTERNATIONAL ENGINEERING SUPPLIES</p></div>
      <div><span>EXPLORE</span><Link href={`/${locale}/products`}>Products</Link><Link href={`/${locale}/technical-library`}>Technical library</Link><Link href={`/${locale}/gallery`}>Visual archive</Link></div>
      <div className="footer-contact">
  <span>CONTACT</span>

  <strong>HEAD OFFICE</strong>

  <p>
    5A Khaled Ibn Al Walid St., Sheraton Residences,
    8th Floor, Cairo, Egypt.
  </p>

  <a
    href="https://mail.google.com/mail/?view=cm&fs=1&to=sales@kirmary.com"
    target="_blank"
    rel="noreferrer"
  >
     sales@kirmary.com ↗
  </a>

  <a
    href="https://mail.google.com/mail/?view=cm&fs=1&to=info@kirmary.com"
    target="_blank"
    rel="noreferrer"
  >
     info@kirmary.com ↗
  </a>

  <a href="tel:+201227905248">
    +20 122 790 5248
  </a>
</div>
      <small>© {new Date().getFullYear()} KIRMARY</small>
    </footer>
  </div>;
}
