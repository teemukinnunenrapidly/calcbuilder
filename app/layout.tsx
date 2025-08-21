import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import VercelAnalytics from '../src/components/analytics/VercelAnalytics';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CalcBuilder Pro - Advanced Calculator Builder Platform',
  description:
    'Build custom calculators, lead generation forms, and interactive business solutions with CalcBuilder Pro.',
  keywords: ['calculator', 'builder', 'saas', 'lead generation', 'business tools'],
  authors: [{ name: 'Teemu Kinnunen' }],
  creator: 'Teemu Kinnunen',
  publisher: 'CalcBuilder Pro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://calcbuilder.com'),
  alternates: {
    canonical: '/',
    languages: {
      en: '/en',
      fi: '/fi',
      sv: '/sv',
    },
  },
  openGraph: {
    title: 'CalcBuilder Pro - Advanced Calculator Builder Platform',
    description:
      'Build custom calculators, lead generation forms, and interactive business solutions.',
    url: 'https://calcbuilder.com',
    siteName: 'CalcBuilder Pro',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CalcBuilder Pro Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CalcBuilder Pro - Advanced Calculator Builder Platform',
    description:
      'Build custom calculators, lead generation forms, and interactive business solutions.',
    images: ['/og-image.jpg'],
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
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={inter.className}>
      <head>
        <link rel='icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />
        <meta name='theme-color' content='#2563eb' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </head>
      <body className='antialiased'>
        {children}
        <VercelAnalytics mode={process.env.NODE_ENV as 'production' | 'development'} />
      </body>
    </html>
  );
}
