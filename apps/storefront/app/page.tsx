import { HeroSection } from '../components/hero/hero-section';
import { ProductGrid } from '../components/products/product-grid';
import { ProductCard } from '../components/products/product-card';
import { getProducts } from '../lib/api';
import type { IPerfume } from '@luxe-scentique/shared-types';

async function FeaturedProducts() {
  let products: IPerfume[];

  try {
    const result = await getProducts({ limit: 3, isActive: true, page: 1 });
    products = result.data;
  } catch {
    products = [];
  }

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

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <ProductGrid products={[]} isLoading={false} />
      )}

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
      title: 'Free Shipping over GHS 500',
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <BrandValues />
      <NewsletterCTA />
    </>
  );
}
