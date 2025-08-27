import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { StickyCTA } from '@/components/CTAButton';
import { copy } from '@/lib/copy';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: `${copy.brand} — Free Amazon Growth Audit (UK/EU)`,
    template: `%s | ${copy.brand}`,
  },
  description: copy.heroSub,
  keywords: ['Amazon', 'marketplace', 'audit', 'UK', 'EU', 'seller', 'consultant', 'listing optimization'],
  authors: [{ name: copy.brand }],
  creator: copy.brand,
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://e-ctrl.example', // TODO: Replace with actual domain
    title: `${copy.brand} — Free Amazon Growth Audit (UK/EU)`,
    description: copy.heroSub,
    siteName: copy.brand,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${copy.brand} - Amazon Growth Audit Tool`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${copy.brand} — Free Amazon Growth Audit (UK/EU)`,
    description: copy.heroSub,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // TODO: Add verification tokens when domains are set up
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Favicon placeholder - TODO: Add actual favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} h-full flex flex-col`}>
        <Header />
        <StickyCTA />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
