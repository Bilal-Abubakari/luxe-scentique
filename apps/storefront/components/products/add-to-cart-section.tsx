'use client';

import { useState } from 'react';
import type { IPerfume } from '@luxe-scentique/shared-types';
import { useCart } from '../cart/cart-context';
import { cn } from '../../lib/utils';

export function AddToCartSection({
  product,
}: Readonly<{ product: IPerfume }>) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const max = Math.min(product.stock, 10);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        image: product.images[0] ?? null,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (product.stock === 0) {
    return (
      <div className="space-y-3">
        <button
          disabled
          className="w-full py-4 bg-onyx-100 text-onyx-400 rounded text-sm font-medium cursor-not-allowed"
        >
          Out of Stock
        </button>
        <p className="text-center text-sm text-onyx-400">
          This fragrance is currently unavailable
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-onyx">Quantity</span>
        <div className="flex items-center border border-onyx-200 rounded">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="w-10 h-10 flex items-center justify-center text-lg text-onyx hover:text-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span
            className="w-12 text-center text-sm font-medium text-onyx"
            aria-live="polite"
            aria-label={`Quantity: ${quantity}`}
          >
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(max, q + 1))}
            disabled={quantity >= max}
            className="w-10 h-10 flex items-center justify-center text-lg text-onyx hover:text-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        {product.stock <= 5 && (
          <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Add to Cart */}
      <button
        onClick={handleAdd}
        className={cn(
          'w-full py-4 rounded font-medium text-sm tracking-wide transition-all duration-300',
          'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
          added
            ? 'bg-green-600 text-white'
            : 'bg-gold text-onyx hover:bg-gold-500 hover:shadow-gold-md active:scale-[0.98]',
        )}
        aria-label={`Add ${quantity} ${quantity === 1 ? 'unit' : 'units'} of ${product.title} to cart`}
      >
        {added ? '✓ Added to Cart' : 'Add to Cart'}
      </button>
    </div>
  );
}
