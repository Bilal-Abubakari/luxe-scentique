import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, getProducts, getFeaturedProducts } from '../../../lib/api';
import { formatPrice } from '../../../lib/utils';
import { ProductImageGallery } from '../../../components/products/product-image-gallery';
import { AddToCartSection } from '../../../components/products/add-to-cart-section';
import { ProductCard } from '../../../components/products/product-card';

const SERVICE_FEE_RATE = 0.0195;
const SERVICE_FEE_CAP = 1000;
const SERVICE_FEE_MIN = 0.5;

function calcFee(price: number): number {
  const fee = price * SERVICE_FEE_RATE;
  return Math.min(Math.max(fee, SERVICE_FEE_MIN), SERVICE_FEE_CAP);
}

const VIBE_COLORS: Record<string, string> = {
  CORPORATE: 'bg-blue-50 text-blue-700 border-blue-100',
  CASUAL: 'bg-green-50 text-green-700 border-green-100',
  EVENING: 'bg-purple-50 text-purple-700 border-purple-100',
  SPORT: 'bg-orange-50 text-orange-700 border-orange-100',
  UNISEX: 'bg-gray-50 text-gray-700 border-gray-200',
  FEMININE: 'bg-pink-50 text-pink-700 border-pink-100',
  MASCULINE: 'bg-slate-50 text-slate-700 border-slate-200',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProduct(id);
    return {
      title: `${product.title} by ${product.brand}`,
      description:
        product.description ??
        `${product.title} — a premium fragrance by ${product.brand}`,
    };
  } catch {
    return { title: 'Fragrance Not Found' };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  let product;
  try {
    product = await getProduct(id);
  } catch {
    notFound();
  }

  // Fetch related products in parallel: same vibe + featured fallback
  const [vibeData, featured] = await Promise.all([
    product.vibe
      ? getProducts({ vibe: product.vibe, limit: 5 }).catch(() => null)
      : Promise.resolve(null),
    getFeaturedProducts(8).catch(() => []),
  ]);

  const vibeMatches = (vibeData?.data ?? []).filter((p) => p.id !== id);
  const seen = new Set(vibeMatches.map((p) => p.id));
  const featuredPad = (featured as typeof vibeMatches)
    .filter((p) => p.id !== id && !seen.has(p.id));
  const relatedProducts = [...vibeMatches, ...featuredPad].slice(0, 4);
  const relatedLabel = product.vibe
    ? `More ${product.vibe.charAt(0) + product.vibe.slice(1).toLowerCase()} Fragrances`
    : 'You May Also Like';
  const relatedHref = product.vibe
    ? `/shop?vibe=${encodeURIComponent(product.vibe)}`
    : '/shop';

  const fee = calcFee(product.price);
  const total = product.price + fee;
  const vibeColor = product.vibe
    ? (VIBE_COLORS[product.vibe] ?? 'bg-gold/10 text-gold border-gold/20')
    : null;

  return (
    <div className="section-padding container-luxury">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 md:mb-12">
        <ol className="flex items-center gap-1.5 text-sm text-onyx-400 flex-wrap">
          <li>
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link href="/shop" className="hover:text-gold transition-colors">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li
            className="text-onyx font-medium truncate max-w-[180px] sm:max-w-xs"
            aria-current="page"
          >
            {product.title}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Left: Image Gallery */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ProductImageGallery images={product.images} title={product.title} />
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          {/* Brand */}
          <p className="text-gold font-medium tracking-widest uppercase text-xs mb-2">
            {product.brand}
          </p>

          {/* Title */}
          <h1 className="font-display text-display-sm text-onyx mb-3 leading-tight">
            {product.title}
          </h1>

          {/* Vibe badge */}
          {product.vibe && vibeColor && (
            <span
              className={`inline-block self-start px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border mb-6 ${vibeColor}`}
            >
              {product.vibe.charAt(0) + product.vibe.slice(1).toLowerCase()}
            </span>
          )}

          {/* Pricing card */}
          <div className="bg-onyx-50 rounded-xl p-5 mb-6 space-y-2">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="font-display text-3xl text-onyx font-semibold">
                {formatPrice(product.price)}
              </span>
            </div>
            <p className="text-sm text-onyx-400">
              Service fee:{' '}
              <span className="text-onyx font-medium">{formatPrice(fee)}</span>
              <span className="mx-2 text-onyx-300">·</span>
              Total:{' '}
              <span className="text-onyx font-semibold">
                {formatPrice(total)}
              </span>
            </p>
            <p
              className={`text-xs font-medium flex items-center gap-1.5 ${
                product.stock > 0 ? 'text-green-600' : 'text-red-500'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full inline-block ${
                  product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
                aria-hidden="true"
              />
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
            {product.stock > 0 && (
              <p className="text-xs font-medium flex items-center gap-1.5 text-onyx-500 border-t border-onyx-100 pt-2 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-gold flex-shrink-0" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Delivered within <strong className="text-onyx ml-1">24 hours</strong>
              </p>
            )}
          </div>

          {/* Add to Cart */}
          <AddToCartSection product={product} />

          {/* Description */}
          {product.description && (
            <div className="mt-8 pt-8 border-t border-onyx-100">
              <h2 className="font-display text-lg text-onyx mb-3">
                About this Fragrance
              </h2>
              <p className="text-onyx-500 leading-relaxed text-sm">
                {product.description}
              </p>
            </div>
          )}

          {/* Fragrance Notes */}
          {product.notes &&
            (product.notes.top?.length ||
              product.notes.middle?.length ||
              product.notes.base?.length) && (
              <div className="mt-8 pt-8 border-t border-onyx-100 space-y-5">
                <h2 className="font-display text-lg text-onyx">
                  Fragrance Notes
                </h2>

                {product.notes.top && product.notes.top.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-onyx-400 mb-2">
                      Top Notes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.notes.top.map((note) => (
                        <span
                          key={note}
                          className="px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-full text-xs font-medium"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.notes.middle && product.notes.middle.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-onyx-400 mb-2">
                      Heart Notes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.notes.middle.map((note) => (
                        <span
                          key={note}
                          className="px-3 py-1 bg-onyx/5 text-onyx-600 border border-onyx-100 rounded-full text-xs font-medium"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.notes.base && product.notes.base.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-onyx-400 mb-2">
                      Base Notes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.notes.base.map((note) => (
                        <span
                          key={note}
                          className="px-3 py-1 bg-onyx-800 text-cream rounded-full text-xs font-medium"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* Back to shop */}
          <div className="mt-10 pt-8 border-t border-onyx-100">
            <Link
              href="/shop"
              className="btn-outline-gold inline-flex items-center gap-2 text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Back to Collection
            </Link>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-onyx-100" aria-labelledby="related-heading">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-1">
                You May Also Like
              </p>
              <h2
                id="related-heading"
                className="font-display text-display-sm text-onyx leading-tight"
              >
                {relatedLabel}
              </h2>
            </div>
            <Link
              href={relatedHref}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-onyx-400 hover:text-gold transition-colors font-medium shrink-0"
            >
              View all
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>

          <div className="mt-6 sm:hidden">
            <Link
              href={relatedHref}
              className="btn-outline-gold inline-flex items-center gap-2 text-sm w-full justify-center"
            >
              View all {relatedLabel.toLowerCase()}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
