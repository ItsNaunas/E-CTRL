import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'e-ctrl — Free Amazon Growth Audit Tool (UK/EU)',
    template: '%s | e-ctrl',
  },
  description: 'Free AI-powered Amazon listing audit tool for UK/EU sellers. Get instant insights to boost sales. No credit card required.',
  keywords: ['Amazon', 'marketplace', 'audit', 'UK', 'EU', 'seller', 'listing optimization', 'free tool', 'ASIN analysis'],
  authors: [{ name: 'e-ctrl' }],
  creator: 'e-ctrl',
  metadataBase: new URL('https://e-ctrl.com'), // TODO: Replace with actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://e-ctrl.com', // TODO: Replace with actual domain
    title: 'e-ctrl — Free Amazon Growth Audit Tool (UK/EU)',
    description: 'Free AI-powered Amazon listing audit tool for UK/EU sellers. Get instant insights to boost sales. No credit card required.',
    siteName: 'e-ctrl',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'e-ctrl - Free Amazon Growth Audit Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'e-ctrl — Free Amazon Growth Audit Tool (UK/EU)',
    description: 'Free AI-powered Amazon listing audit tool for UK/EU sellers. Get instant insights to boost sales. No credit card required.',
    images: ['/og-image.png'],
    creator: '@e_ctrl', // TODO: Replace with actual Twitter handle
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
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
        
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
