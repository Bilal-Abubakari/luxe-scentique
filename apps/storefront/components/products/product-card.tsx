import Image from 'next/image';
import Link from 'next/link';
import type { IPerfume } from '@luxe-scentique/shared-types';
import { formatPrice, cn } from '../../lib/utils';

const SERVICE_FEE_RATE = 0.02; // 2% service fee

function VibeTag({ vibe }: Readonly<{ vibe: string }>) {
  const vibeColors: Record<string, string> = {
    CORPORATE: 'bg-blue-50 text-blue-700 border-blue-100',
    CASUAL: 'bg-green-50 text-green-700 border-green-100',
    EVENING: 'bg-purple-50 text-purple-700 border-purple-100',
    SPORT: 'bg-orange-50 text-orange-700 border-orange-100',
    UNISEX: 'bg-gray-50 text-gray-700 border-gray-200',
    FEMININE: 'bg-pink-50 text-pink-700 border-pink-100',
    MASCULINE: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  const colorClass = vibeColors[vibe] ?? 'bg-gold/10 text-gold border-gold/20';

  return (
    <span
      className={cn(
        'inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border',
        colorClass,
      )}
    >
      {vibe.charAt(0) + vibe.slice(1).toLowerCase()}
    </span>
  );
}

interface ProductCardProps {
  product: IPerfume;
  className?: string;
}

export function ProductCard({ product, className }: Readonly<ProductCardProps>) {
  const serviceFee = Math.round(product.price * SERVICE_FEE_RATE * 100) / 100;
  const totalWithFee = product.price + serviceFee;
  const primaryImage = product.images[0] ?? null;

  return (
    <article
      className={cn('card-luxury group flex flex-col', className)}
      aria-label={`${product.title} by ${product.brand}`}
    >
      {/* Product Image */}
      <Link
        href={`/shop/${product.id}`}
        className="block relative overflow-hidden aspect-square bg-onyx-50 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset"
        aria-label={`View details for ${product.title}`}
        tabIndex={0}
      >
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={`${product.title} by ${product.brand}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-onyx-100 to-onyx-200"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-12 h-12 text-onyx-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.414 2.798H4.212c-1.444 0-2.414-1.798-1.414-2.798L4.2 15.3"
              />
            </svg>
            <span className="text-xs text-onyx-400 font-medium">No Image</span>
          </div>
        )}

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div
            className="absolute inset-0 bg-onyx/60 flex items-center justify-center"
            aria-label="Out of stock"
          >
            <span className="bg-white text-onyx text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4">
        {/* Vibe + Brand Row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          {product.vibe && <VibeTag vibe={product.vibe} />}
          <span className="text-xs text-onyx-400 font-medium ml-auto">{product.brand}</span>
        </div>

        {/* Title */}
        <Link
          href={`/shop/${product.id}`}
          className="group/title focus-visible:ring-2 focus-visible:ring-gold rounded"
          aria-label={`${product.title} — click to view details`}
        >
          <h2 className="font-display text-base text-onyx font-semibold leading-snug mb-1 group-hover/title:text-gold transition-colors line-clamp-2">
            {product.title}
          </h2>
        </Link>

        {/* Description preview */}
        {product.description && (
          <p className="text-xs text-onyx-400 line-clamp-2 mb-3 leading-relaxed flex-1">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-onyx-100">
          {/* Pricing */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span
                className="text-lg font-semibold text-onyx"
                aria-label={`Price: ${formatPrice(product.price)}`}
              >
                {formatPrice(product.price)}
              </span>
              {product.stock > 0 && product.stock <= 5 && (
                <span className="text-xs text-amber-600 font-medium">
                  Only {product.stock} left
                </span>
              )}
            </div>
            <p
              className="text-xs text-onyx-400 mt-0.5"
              aria-label={`Total including service fee: ${formatPrice(totalWithFee)}`}
            >
              Total incl. fees:{' '}
              <span className="font-medium text-onyx">{formatPrice(totalWithFee)}</span>
            </p>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            disabled={product.stock === 0}
            className={cn(
              'w-full py-2.5 px-4 rounded text-sm font-medium transition-all duration-200',
              'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
              product.stock > 0
                ? 'bg-gold text-onyx hover:bg-gold-500 hover:shadow-gold-md active:scale-[0.98]'
                : 'bg-onyx-100 text-onyx-400 cursor-not-allowed',
            )}
            aria-label={
              product.stock > 0
                ? `Add ${product.title} to cart`
                : `${product.title} is out of stock`
            }
            aria-disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </article>
  );
}
