import Link from 'next/link';
import Image from 'next/image';
import { SOCIAL_LINKS, CONTACT_INFO } from '../../lib/constants';

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
            <div className="flex gap-3" aria-label="Social media links">
              {/* Instagram */}
              <a
                href={SOCIAL_LINKS.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-onyx-700 text-onyx-300 hover:border-gold hover:text-gold transition-colors focus-visible:ring-2 focus-visible:ring-gold"
                aria-label={SOCIAL_LINKS.instagram.ariaLabel}
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

              {/* WhatsApp */}
              <a
                href={SOCIAL_LINKS.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-onyx-700 text-onyx-300 hover:border-gold hover:text-gold transition-colors focus-visible:ring-2 focus-visible:ring-gold"
                aria-label={SOCIAL_LINKS.whatsapp.ariaLabel}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>

              {/* Snapchat */}
              <a
                href={SOCIAL_LINKS.snapchat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-onyx-700 text-onyx-300 hover:border-gold hover:text-gold transition-colors focus-visible:ring-2 focus-visible:ring-gold"
                aria-label={SOCIAL_LINKS.snapchat.ariaLabel}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.476-1.663.879-.615.45-1.245.93-2.08.93-.055 0-.109-.004-.165-.01h-.085c-.84 0-1.469-.48-2.085-.93-.539-.403-1.063-.775-1.662-.879a6.459 6.459 0 00-.913-.074c-.54 0-.959.075-1.274.135-.24.045-.419.074-.554.074-.299 0-.509-.148-.569-.42-.061-.192-.105-.359-.135-.553-.044-.195-.105-.48-.165-.571-1.873-.283-2.906-.702-3.145-1.271a.76.76 0 01-.046-.225c-.015-.239.166-.465.42-.509 3.266-.54 4.791-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.333-.809-.121-.045-.24-.09-.345-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.083.3.24 0 .375-.06.45-.09l-.016-.06c-.104-1.574-.225-3.615.3-4.842C7.847 1.07 11.206.793 12.206.793z" />
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
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="hover:text-gold transition-colors focus-visible:ring-2 focus-visible:ring-gold rounded"
                  aria-label="Send us an email"
                >
                  {CONTACT_INFO.email}
                </a>
              </p>
              <p>
                <span className="sr-only">Phone:</span>
                <a
                  href={CONTACT_INFO.phoneHref}
                  className="hover:text-gold transition-colors focus-visible:ring-2 focus-visible:ring-gold rounded"
                  aria-label="Call us"
                >
                  {CONTACT_INFO.phoneDisplay}
                </a>
              </p>
              <p>
                <a
                  href={`https://maps.google.com/?q=${CONTACT_INFO.address.mapsQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors focus-visible:ring-2 focus-visible:ring-gold rounded"
                  aria-label="View our location on Google Maps (opens in new tab)"
                >
                  {CONTACT_INFO.address.street}
                  <br />
                  {CONTACT_INFO.address.city}, {CONTACT_INFO.address.country}
                </a>
              </p>
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
