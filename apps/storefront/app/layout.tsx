import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Playfair_Display, Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { CartProvider } from '../components/cart/cart-context';
import { CartDrawer } from '../components/cart/cart-drawer';
import { WhatsAppFloat } from '../components/ui/whatsapp-float';
import './globals.css';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Luxe Scentique - The Finest Fragrances',
    template: '%s | Luxe Scentique',
  },
  description:
    'Discover the world\'s finest luxury fragrances at Luxe Scentique. Curated collection of premium perfumes for the discerning sophisticate.',
  keywords: ['luxury perfume', 'fragrances', 'Luxe Scentique', 'premium scents', 'Ghana'],
  authors: [{ name: 'Luxe Scentique' }],
  creator: 'Luxe Scentique',
  metadataBase: new URL('https://luxescentique.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://luxescentique.com',
    siteName: 'Luxe Scentique',
    title: 'Luxe Scentique - The Finest Fragrances',
    description:
      'Discover the world\'s finest luxury fragrances. Curated collection of premium perfumes for the discerning sophisticate.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Luxe Scentique - The Finest Fragrances',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxe Scentique - The Finest Fragrances',
    description: 'Discover the world\'s finest luxury fragrances.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-cream text-onyx font-body antialiased">
        <CartProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
          <CartDrawer />
          <div className="flex flex-col min-h-screen">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold focus:text-onyx focus:rounded focus:font-medium"
            >
              Skip to main content
            </a>

            <header role="banner">
              <Navbar />
            </header>

            <main id="main-content" role="main" className="flex-1" tabIndex={-1}>
              {children}
            </main>

            <footer role="contentinfo">
              <Footer />
            </footer>
          </div>
          <WhatsAppFloat />
          </ThemeProvider>
        </CartProvider>
      </body>
    </html>
  );
}
