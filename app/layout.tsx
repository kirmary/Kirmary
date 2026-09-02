import './globals.css';
import './premium-inner-pages.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'KIRMARY | International Engineering Supplies',
    template: '%s | KIRMARY'
  },
  description:
    'KIRMARY fire protection products, global brands, project references and technical documentation.',
  icons: {
    icon: '/brand/logos/Kirmary-Logo-02-copy.png'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
