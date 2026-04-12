import { Suspense } from 'react';
import { HeroSection } from '../components/hero/hero-section';
import { ProductGrid } from '../components/products/product-grid';
import { getFeaturedProducts } from '../lib/api';
import { IPerfume } from '@luxe-scentique/shared-types';
import { SOCIAL_LINKS, CONTACT_INFO } from '../lib/constants';

async function FeaturedProductsGrid() {
  let products: IPerfume[] = [];
  try {
    products = await getFeaturedProducts(6);
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
  }

  return <ProductGrid products={products} isLoading={false} />;
}

function FeaturedProducts() {
  return (
    <section
      aria-labelledby="featured-heading"
      className="section-padding container-luxury"
    >
      <div className="text-center mb-12">
        <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
          Handpicked for You
        </p>
        <h2
          id="featured-heading"
          className="font-display text-display-sm text-onyx mb-4"
        >
          Featured Fragrances
        </h2>
        <p className="text-onyx-400 max-w-2xl mx-auto">
          Each fragrance in our collection is carefully selected for its exceptional quality,
          unique character, and lasting impression.
        </p>
      </div>

      <Suspense fallback={<ProductGrid products={[]} isLoading={true} />}>
        <FeaturedProductsGrid />
      </Suspense>

      <div className="text-center mt-12">
        <a
          href="/shop"
          className="btn-outline-gold inline-block"
          aria-label="View all fragrances in our collection"
        >
          View Full Collection
        </a>
      </div>
    </section>
  );
}

function BrandValues() {
  const values = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
          />
        </svg>
      ),
      title: 'Premium Quality',
      description:
        'Every fragrance is sourced directly from world-renowned perfume houses, ensuring authenticity and the highest olfactory standards.',
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
          />
        </svg>
      ),
      title: 'Free Shipping over GHS 1000',
      description:
        'Enjoy complimentary delivery on all orders above GHS 500. Your luxury fragrance arrives beautifully packaged at your door.',
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
      ),
      title: 'Authentic Fragrances',
      description:
        'We guarantee 100% authentic products. Each bottle comes with a certificate of authenticity, backed by our personal promise.',
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: '24-Hour Delivery',
      description:
        'Order today and receive your luxury fragrance within 24 hours. We move fast so your signature scent reaches you without the wait.',
    },
  ];

  return (
    <section
      aria-labelledby="values-heading"
      className="bg-onyx py-16 md:py-24"
    >
      <div className="container-luxury">
        <div className="text-center mb-12">
          <h2
            id="values-heading"
            className="font-display text-display-sm text-cream mb-4"
          >
            The Luxe Scentique Promise
          </h2>
          <p className="text-onyx-300 max-w-2xl mx-auto">
            Our commitment to excellence extends beyond the fragrance itself.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value) => (
            <article
              key={value.title}
              className="text-center p-8 border border-onyx-700 rounded-lg hover:border-gold transition-colors duration-300"
            >
              <div
                className="text-gold flex justify-center mb-6"
                aria-hidden="true"
              >
                {value.icon}
              </div>
              <h3 className="font-display text-xl text-cream mb-3">
                {value.title}
              </h3>
              <p className="text-onyx-300 text-sm leading-relaxed">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterCTA() {
  return (
    <section
      aria-labelledby="newsletter-heading"
      className="section-padding"
    >
      <div className="container-luxury">
        <div className="bg-gold-gradient rounded-2xl p-12 md:p-16 text-center">
          <h2
            id="newsletter-heading"
            className="font-display text-display-sm text-onyx mb-4"
          >
            Enter the Inner Circle
          </h2>
          <p className="text-onyx-700 max-w-xl mx-auto mb-8">
            Be the first to discover exclusive releases, private events, and members-only
            offers. The finest scents deserve the finest audience.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            aria-label="Newsletter subscription form"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Your email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Your email address"
              autoComplete="email"
              className="flex-1 px-4 py-3 rounded-md bg-white border-0 text-onyx placeholder:text-onyx-400 focus:outline-none focus:ring-2 focus:ring-onyx"
              aria-required="true"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-onyx text-cream rounded-md font-medium hover:bg-onyx-800 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-onyx focus-visible:ring-offset-2 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="text-onyx-600 text-xs mt-4">
            No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}

function SocialConnect() {
  const cards = [
    {
      key: 'instagram',
      href: SOCIAL_LINKS.instagram.url,
      ariaLabel: SOCIAL_LINKS.instagram.ariaLabel,
      label: SOCIAL_LINKS.instagram.label,
      handle: SOCIAL_LINKS.instagram.handle,
      description: SOCIAL_LINKS.instagram.description,
      cta: 'Follow Us',
      iconBg: 'bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737]',
      hoverBorder: 'hover:border-[#E1306C]',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(225,48,108,0.12)]',
      ctaColor: 'text-[#E1306C]',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
    {
      key: 'whatsapp',
      href: SOCIAL_LINKS.whatsapp.url,
      ariaLabel: SOCIAL_LINKS.whatsapp.ariaLabel,
      label: SOCIAL_LINKS.whatsapp.label,
      handle: SOCIAL_LINKS.whatsapp.handle,
      description: SOCIAL_LINKS.whatsapp.description,
      cta: 'Chat With Us',
      iconBg: 'bg-[#25D366]',
      hoverBorder: 'hover:border-[#25D366]',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(37,211,102,0.12)]',
      ctaColor: 'text-[#25D366]',
      icon: (
        <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      key: 'snapchat',
      href: SOCIAL_LINKS.snapchat.url,
      ariaLabel: SOCIAL_LINKS.snapchat.ariaLabel,
      label: SOCIAL_LINKS.snapchat.label,
      handle: SOCIAL_LINKS.snapchat.handle,
      description: SOCIAL_LINKS.snapchat.description,
      cta: 'Add Us',
      iconBg: 'bg-[#FFFC00]',
      hoverBorder: 'hover:border-[#FFFC00]',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(255,252,0,0.10)]',
      ctaColor: 'text-[#FFD600]',
      icon: (
        <svg viewBox="0 0 24 24" fill="#1A1A1A" className="w-6 h-6" aria-hidden="true">
          <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.476-1.663.879-.615.45-1.245.93-2.08.93-.055 0-.109-.004-.165-.01h-.085c-.84 0-1.469-.48-2.085-.93-.539-.403-1.063-.775-1.662-.879a6.459 6.459 0 00-.913-.074c-.54 0-.959.075-1.274.135-.24.045-.419.074-.554.074-.299 0-.509-.148-.569-.42-.061-.192-.105-.359-.135-.553-.044-.195-.105-.48-.165-.571-1.873-.283-2.906-.702-3.145-1.271a.76.76 0 01-.046-.225c-.015-.239.166-.465.42-.509 3.266-.54 4.791-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.333-.809-.121-.045-.24-.09-.345-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.083.3.24 0 .375-.06.45-.09l-.016-.06c-.104-1.574-.225-3.615.3-4.842C7.847 1.07 11.206.793 12.206.793z" />
        </svg>
      ),
    },
  ];

  return (
    <section
      aria-labelledby="social-connect-heading"
      className="bg-onyx border-t border-onyx-800 py-20 md:py-28"
    >
      <div className="container-luxury">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
            Our Community
          </p>
          <h2
            id="social-connect-heading"
            className="font-display text-display-sm text-cream mb-4"
          >
            Connect With Us
          </h2>
          <p className="text-onyx-300 max-w-2xl mx-auto">
            Follow our journey, get exclusive drops, and reach out directly — we love
            hearing from our community.
          </p>
        </div>

        {/* Social Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {cards.map((card) => (
            <a
              key={card.key}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={card.ariaLabel}
              className={[
                'group flex flex-col p-8 rounded-xl',
                'border border-onyx-700 bg-onyx-800/40',
                card.hoverBorder,
                card.hoverShadow,
                'transition-all duration-300',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
              ].join(' ')}
            >
              {/* Icon badge */}
              <div className={`w-14 h-14 rounded-2xl ${card.iconBg} flex items-center justify-center mb-6 flex-shrink-0`}>
                {card.icon}
              </div>
              {/* Platform label */}
              <p className="text-xs uppercase tracking-widest text-onyx-400 mb-1">{card.label}</p>
              {/* Handle */}
              <p className="font-display text-xl text-cream mb-3 group-hover:text-gold transition-colors duration-200">
                {card.handle}
              </p>
              {/* Description */}
              <p className="text-onyx-300 text-sm leading-relaxed flex-1">{card.description}</p>
              {/* CTA */}
              <div className={`mt-6 flex items-center gap-2 text-sm font-medium ${card.ctaColor} transition-colors duration-200`}>
                {card.cta}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        {/* Contact Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 pt-10 border-t border-onyx-800 flex-wrap">

          {/* Email */}
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            className="group flex items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg"
            aria-label={`Email us at ${CONTACT_INFO.email}`}
          >
            <div className="w-11 h-11 rounded-full border border-onyx-700 group-hover:border-gold flex items-center justify-center text-onyx-400 group-hover:text-gold transition-colors duration-200 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-onyx-400 mb-0.5">Email Us</p>
              <p className="text-cream font-medium group-hover:text-gold transition-colors duration-200">
                {CONTACT_INFO.email}
              </p>
            </div>
          </a>

          <div className="hidden sm:block w-px h-12 bg-onyx-800" aria-hidden="true" />

          {/* Phone */}
          <a
            href={CONTACT_INFO.phoneHref}
            className="group flex items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg"
            aria-label={`Call us at ${CONTACT_INFO.phoneDisplay}`}
          >
            <div className="w-11 h-11 rounded-full border border-onyx-700 group-hover:border-gold flex items-center justify-center text-onyx-400 group-hover:text-gold transition-colors duration-200 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-onyx-400 mb-0.5">Call Us</p>
              <p className="text-cream font-medium group-hover:text-gold transition-colors duration-200">
                {CONTACT_INFO.phoneDisplay}
              </p>
            </div>
          </a>

          <div className="hidden sm:block w-px h-12 bg-onyx-800" aria-hidden="true" />

          {/* Address */}
          <a
            href={`https://maps.google.com/?q=${CONTACT_INFO.address.mapsQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg"
            aria-label={`Visit us at ${CONTACT_INFO.address.full} (opens Google Maps in new tab)`}
          >
            <div className="w-11 h-11 rounded-full border border-onyx-700 group-hover:border-gold flex items-center justify-center text-onyx-400 group-hover:text-gold transition-colors duration-200 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-onyx-400 mb-0.5">Visit Us</p>
              <p className="text-cream font-medium group-hover:text-gold transition-colors duration-200">
                {CONTACT_INFO.address.street}
              </p>
              <p className="text-onyx-400 text-xs mt-0.5">
                {CONTACT_INFO.address.city}, {CONTACT_INFO.address.country}
              </p>
            </div>
          </a>

        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <BrandValues />
      <SocialConnect />
      <NewsletterCTA />
    </>
  );
}
