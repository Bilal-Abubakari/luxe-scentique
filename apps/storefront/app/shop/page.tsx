'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProductGrid } from '../../components/products/product-grid';
import { getProducts } from '../../lib/api';
import type { IPerfume, IPerfumePaginated } from '@luxe-scentique/shared-types';
import { ProductVibe } from '@luxe-scentique/shared-types';
import { cn } from '../../lib/utils';

const VIBES = Object.values(ProductVibe);
const PRICE_RANGES = [
  { label: 'All Prices', min: undefined, max: undefined },
  { label: 'Under GHS 200', min: undefined, max: 200 },
  { label: 'GHS 200 – 500', min: 200, max: 500 },
  { label: 'GHS 500 – 1,000', min: 500, max: 1000 },
  { label: 'Over GHS 1,000', min: 1000, max: undefined },
];

interface Filters {
  vibe: ProductVibe | '';
  minPrice: number | undefined;
  maxPrice: number | undefined;
  brand: string;
  search: string;
}

const initialFilters: Filters = {
  vibe: '',
  minPrice: undefined,
  maxPrice: undefined,
  brand: '',
  search: '',
};

export default function ShopPage() {
  const [products, setProducts] = useState<IPerfume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pick<IPerfumePaginated, 'total' | 'totalPages'>>({
    total: 0,
    totalPages: 1,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getProducts({
        page,
        limit: 12,
        isActive: true,
        vibe: filters.vibe || undefined,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        brand: filters.brand || undefined,
        search: filters.search || undefined,
      });
      setProducts(result.data);
      setPagination({ total: result.total, totalPages: result.totalPages });
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handlePriceRange = (min: number | undefined, max: number | undefined) => {
    setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setPage(1);
  };

  const hasActiveFilters =
    filters.vibe !== '' ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.brand !== '' ||
    filters.search !== '';

  return (
    <div className="min-h-screen bg-cream">
      {/* Page Header */}
      <div className="bg-onyx py-16 text-center">
        <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
          Our Collection
        </p>
        <h1 className="font-display text-display-sm text-cream">Explore Fragrances</h1>
        <p className="text-onyx-300 mt-3 max-w-lg mx-auto">
          {pagination.total > 0
            ? `${pagination.total} fragrances curated for the discerning mind`
            : 'Discover our curated fragrance collection'}
        </p>
      </div>

      <div className="container-luxury py-10">
        {/* Search + Mobile Filter Toggle */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <label htmlFor="search-products" className="sr-only">
              Search fragrances
            </label>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-onyx-400 pointer-events-none"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              id="search-products"
              type="search"
              placeholder="Search fragrances, brands..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input-luxury pl-10"
              aria-label="Search fragrances"
            />
          </div>

          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 border border-onyx-200 rounded-md text-onyx hover:border-gold transition-colors"
            aria-expanded={isSidebarOpen}
            aria-controls="filter-sidebar"
            aria-label="Toggle filters"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              />
            </svg>
            Filters
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gold hover:text-gold-500 underline underline-offset-2 transition-colors"
              aria-label="Clear all filters"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            id="filter-sidebar"
            className={cn(
              'w-64 flex-shrink-0 space-y-8',
              'lg:block',
              isSidebarOpen ? 'block' : 'hidden',
            )}
            aria-label="Product filters"
          >
            {/* Vibe Filter */}
            <div>
              <h2 className="font-display text-lg text-onyx mb-4">Shop by Vibe</h2>
              <fieldset className="space-y-2">
                <legend className="sr-only">Filter by vibe</legend>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="vibe"
                    value=""
                    checked={filters.vibe === ''}
                    onChange={() => handleFilterChange('vibe', '')}
                    className="accent-gold w-4 h-4"
                  />
                  <span className="text-sm text-onyx group-hover:text-gold transition-colors">
                    All Vibes
                  </span>
                </label>
                {VIBES.map((vibe) => (
                  <label key={vibe} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="vibe"
                      value={vibe}
                      checked={filters.vibe === vibe}
                      onChange={() => handleFilterChange('vibe', vibe)}
                      className="accent-gold w-4 h-4"
                    />
                    <span className="text-sm text-onyx group-hover:text-gold transition-colors capitalize">
                      {vibe.charAt(0) + vibe.slice(1).toLowerCase()}
                    </span>
                  </label>
                ))}
              </fieldset>
            </div>

            {/* Price Range Filter */}
            <div>
              <h2 className="font-display text-lg text-onyx mb-4">Price Range</h2>
              <fieldset className="space-y-2">
                <legend className="sr-only">Filter by price range</legend>
                {PRICE_RANGES.map((range) => {
                  const isSelected =
                    filters.minPrice === range.min && filters.maxPrice === range.max;
                  return (
                    <label
                      key={range.label}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="price-range"
                        checked={isSelected}
                        onChange={() => handlePriceRange(range.min, range.max)}
                        className="accent-gold w-4 h-4"
                      />
                      <span className="text-sm text-onyx group-hover:text-gold transition-colors">
                        {range.label}
                      </span>
                    </label>
                  );
                })}
              </fieldset>
            </div>

            {/* Brand Filter */}
            <div>
              <h2 className="font-display text-lg text-onyx mb-4">Brand</h2>
              <label htmlFor="brand-filter" className="sr-only">
                Filter by brand
              </label>
              <input
                id="brand-filter"
                type="text"
                placeholder="e.g. Chanel, Dior..."
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="input-luxury text-sm"
                aria-label="Filter by brand name"
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid products={products} isLoading={isLoading} />

            {/* Pagination */}
            {!isLoading && pagination.totalPages > 1 && (
              <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-onyx-200 rounded-md text-sm hover:border-gold hover:text-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label="Previous page"
                >
                  Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      'w-10 h-10 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-gold',
                      p === page
                        ? 'bg-gold text-onyx'
                        : 'border border-onyx-200 hover:border-gold hover:text-gold',
                    )}
                    aria-label={`Go to page ${p}`}
                    aria-current={p === page ? 'page' : undefined}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="px-4 py-2 border border-onyx-200 rounded-md text-sm hover:border-gold hover:text-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label="Next page"
                >
                  Next
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
