import type { IPerfume } from '@luxe-scentique/shared-types';
import { ProductCard } from './product-card';
import { cn } from '../../lib/utils';

function ProductSkeleton() {
  return (
    <div
      className="card-luxury overflow-hidden"
      aria-hidden="true"
    >
      {/* Image skeleton */}
      <div className="aspect-square skeleton" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-16 skeleton rounded-full" />
          <div className="h-4 w-20 skeleton rounded" />
        </div>
        <div className="h-5 w-3/4 skeleton rounded" />
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-4 w-2/3 skeleton rounded" />
        <div className="pt-3 border-t border-onyx-100 space-y-2">
          <div className="h-6 w-24 skeleton rounded" />
          <div className="h-4 w-36 skeleton rounded" />
          <div className="h-10 w-full skeleton rounded mt-2" />
        </div>
      </div>
    </div>
  );
}

interface ProductGridProps {
  products: IPerfume[];
  isLoading: boolean;
  className?: string;
}

export function ProductGrid({ products, isLoading, className }: Readonly<ProductGridProps>) {
  if (isLoading) {
    return (
      <div
        className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6', className)}
        aria-label="Loading products"
        aria-busy="true"
      >
        <span className="sr-only">Loading fragrances, please wait…</span>
        {Array.from({ length: 6 }).map((value, i) => (
          <ProductSkeleton key={`${value}-${i}`} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <output
        className="flex flex-col items-center justify-center py-24 text-center"
        aria-label="No products found"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="w-16 h-16 text-onyx-200 mb-4"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.414 2.798H4.212c-1.444 0-2.414-1.798-1.414-2.798L4.2 15.3"
          />
        </svg>
        <h3 className="font-display text-xl text-onyx mb-2">No Fragrances Found</h3>
        <p className="text-onyx-400 text-sm max-w-sm">
          We couldn&apos;t find any fragrances matching your criteria. Try adjusting your filters or
          clearing them to see our full collection.
        </p>
      </output>
    );
  }

  return (
    <ul
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0',
        className,
      )}
      aria-label={`${products.length} fragrance${products.length === 1 ? '' : 's'} available`}
    >
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
