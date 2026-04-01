import Link from 'next/link';
import Image from 'next/image';

const SHOP_LINKS = [
  { href: '/shop', label: 'All Fragrances' },
  { href: '/shop?vibe=CORPORATE', label: 'Corporate Vibes' },
  { href: '/shop?vibe=EVENING', label: 'Evening Wear' },
  { href: '/shop?vibe=CASUAL', label: 'Casual Scents' },
  { href: '/shop?vibe=UNISEX', label: 'Unisex Collection' },
];

const COMPANY_LINKS = [
  { href: '/about', label: 'About Us' },
  { href: '/track', label: 'Track Order' },
  { href: '/settings', label: 'My Account' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-onyx text-cream"
      aria-label="Site footer"
    >
      {/* Main Footer Content */}
      <div className="container-luxury py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="inline-block mb-6 focus-visible:ring-2 focus-visible:ring-gold rounded"
              aria-label="Luxe Scentique homepage"
            >
              <Image
                src="/images/logo.png"
                alt="Luxe Scentique"
                width={160}
                height={48}
                className="h-12 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-onyx-300 text-sm leading-relaxed mb-6">
              The Classic Sophisticate. We curate the world&apos;s finest fragrances for those
              who understand that scent is the most intimate expression of identity.
            </p>
            {/* Social Links */}
            <div className="flex gap-4" aria-label="Social media links">
              <a
                href="https://instagram.com/luxescentique"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-onyx-700 text-onyx-300 hover:border-gold hover:text-gold transition-colors focus-visible:ring-2 focus-visible:ring-gold"
                aria-label="Follow us on Instagram (opens in new tab)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://twitter.com/luxescentique"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-onyx-700 text-onyx-300 hover:border-gold hover:text-gold transition-colors focus-visible:ring-2 focus-visible:ring-gold"
                aria-label="Follow us on Twitter (opens in new tab)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="font-display text-base text-gold mb-6 uppercase tracking-widest">
              Shop
            </h3>
            <nav aria-label="Shop navigation">
              <ul className="space-y-3">
                {SHOP_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-onyx-300 hover:text-gold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-gold rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-display text-base text-gold mb-6 uppercase tracking-widest">
              Company
            </h3>
            <nav aria-label="Company navigation">
              <ul className="space-y-3">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-onyx-300 hover:text-gold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-gold rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact + Newsletter Column */}
          <div>
            <h3 className="font-display text-base text-gold mb-6 uppercase tracking-widest">
              Contact
            </h3>
            <address className="not-italic space-y-3 text-sm text-onyx-300 mb-6">
              <p>
                <span className="sr-only">Email:</span>
                <a
                  href="mailto:hello@luxescentique.com"
                  className="hover:text-gold transition-colors focus-visible:ring-2 focus-visible:ring-gold rounded"
                  aria-label="Send us an email"
                >
                  hello@luxescentique.com
                </a>
              </p>
              <p>
                <span className="sr-only">Phone:</span>
                <a
                  href="tel:+233000000000"
                  className="hover:text-gold transition-colors focus-visible:ring-2 focus-visible:ring-gold rounded"
                  aria-label="Call us"
                >
                  +233 00 000 0000
                </a>
              </p>
              <p>Accra, Ghana</p>
            </address>

            {/* Newsletter */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gold mb-3">
                Newsletter
              </h4>
              <form
                className="flex gap-2"
                aria-label="Newsletter subscription"
              >
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  Your email address
                </label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  placeholder="Your email"
                  autoComplete="email"
                  className="flex-1 min-w-0 px-3 py-2 text-xs bg-onyx-800 border border-onyx-700 text-cream placeholder:text-onyx-500 rounded focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                  aria-required="true"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-gold text-onyx text-xs font-medium rounded hover:bg-gold-500 transition-colors focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label="Subscribe to newsletter"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-onyx-800">
        <div className="container-luxury py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-onyx-400 text-center sm:text-left">
            &copy; {currentYear} Luxe Scentique. All rights reserved.
          </p>
          <p className="text-xs text-onyx-400">
            Crafted with passion in Ghana{''}
            <span className="text-gold mx-2" aria-hidden="true">✦</span>{''}
            The Classic Sophisticate
          </p>
        </div>
      </div>
    </footer>
  );
}
