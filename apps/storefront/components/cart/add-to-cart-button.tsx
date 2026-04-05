'use client';

import { useState } from 'react';
import { useCart } from './cart-context';
import { cn } from '../../lib/utils';

interface AddToCartButtonProps {
  product: {
    id: string;
    title: string;
    brand: string;
    price: number;
    image: string | null;
    stock: number;
  };
  className?: string;
}

export function AddToCartButton({
  product,
  className,
}: Readonly<AddToCartButtonProps>) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={product.stock === 0}
      className={cn(
        'w-full py-2.5 px-4 rounded text-sm font-medium transition-all duration-200',
        'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
        product.stock > 0
          ? added
            ? 'bg-green-600 text-white'
            : 'bg-gold text-onyx hover:bg-gold-500 hover:shadow-gold-md active:scale-[0.98]'
          : 'bg-onyx-100 text-onyx-400 cursor-not-allowed',
        className,
      )}
      aria-label={
        product.stock > 0
          ? `Add ${product.title} to cart`
          : `${product.title} is out of stock`
      }
      aria-disabled={product.stock === 0}
    >
      {product.stock > 0
        ? added
          ? '✓ Added'
          : 'Add to Cart'
        : 'Out of Stock'}
    </button>
  );
}
