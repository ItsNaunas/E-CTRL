import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { AuthProvider } from '@/lib/AuthContext';
import { ToastProvider } from '@/lib/toast';
import { GlobalErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorHandlerProvider } from '@/components/ErrorHandlerProvider';
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
  metadataBase: new URL('https://e-ctrl.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://e-ctrl.ai',
    title: 'e-ctrl — Free Amazon Growth Audit Tool',
    description: 'Free AI-powered Amazon listing audit tool for UK/EU sellers. Get instant insights to boost sales. No credit card required.',
    siteName: 'e-ctrl',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 627, // LinkedIn-optimized dimensions
        alt: 'e-ctrl - Free Amazon Growth Audit Tool for UK/EU Sellers',
      },
    ],
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
        <link rel="icon" type="image/png" sizes="32x32" href="/logos/logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logos/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logos/logo.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/logos/logo.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/logos/logo.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} h-full flex flex-col bg-[#0B0B0C] text-white`}>
        <ErrorHandlerProvider>
          <GlobalErrorBoundary>
            <ToastProvider>
              <AuthProvider>
                <main className="flex-1">
                  {children}
                </main>
              </AuthProvider>
            </ToastProvider>
          </GlobalErrorBoundary>
        </ErrorHandlerProvider>
        
        {/* Vercel Analytics - Only load in production on Vercel */}
        {process.env.NODE_ENV === 'production' && process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
