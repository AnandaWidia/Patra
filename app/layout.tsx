import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans, Spectral } from 'next/font/google';

import { DevicePreview } from '@/components/shell/device-preview';
import { AppProviders } from '@/contexts/app-providers';
import '@/styles/globals.css';

/**
 * §10 — two families, both open licence, subset to Latin plus the arrow glyph.
 * Spectral (Regular, Italic) and IBM Plex Sans (Regular, Medium).
 */
const spectral = Spectral({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-spectral',
  display: 'swap',
});

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PATRA',
  description:
    'Cultural experiences hosted by Balinese households. 80% of the payment reaches the host household.',
  applicationName: 'PATRA',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'PATRA', statusBarStyle: 'default' },
  openGraph: {
    title: 'PATRA',
    description:
      'Days spent with Balinese households, verified in person by their own banjar, booked directly.',
    type: 'website',
    images: [{ url: '/images/og/og-patra.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PATRA',
    images: ['/images/og/og-patra.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#FBFAF6',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-mode="light">
      <body className={`${spectral.variable} ${plexSans.variable}`}>
        <AppProviders>
          <DevicePreview>{children}</DevicePreview>
        </AppProviders>
      </body>
    </html>
  );
}
