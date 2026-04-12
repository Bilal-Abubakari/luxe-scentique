'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './cart-context';
import { formatPrice } from '../../lib/utils';

const SERVICE_FEE_RATE = 0.0195;
const SERVICE_FEE_CAP = 1000;
const SERVICE_FEE_MIN = 0.5;

function calcFee(subtotal: number): number {
  if (subtotal === 0) return 0;
  const fee = subtotal * SERVICE_FEE_RATE;
  return Math.min(Math.max(fee, SERVICE_FEE_MIN), SERVICE_FEE_CAP);
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } =
    useCart();
  const fee = calcFee(subtotal);
  const total = subtotal + fee;
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [closeCart]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-onyx/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed z-[100] right-0 top-0 h-full w-full max-w-md bg-cream shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-onyx border-b border-onyx-800">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-lg text-cream">Your Cart</h2>
            {totalQty > 0 && (
              <span className="bg-gold text-onyx text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalQty}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-onyx-300 hover:text-cream transition-colors rounded focus-visible:ring-2 focus-visible:ring-gold"
            aria-label="Close cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-16 h-16 text-onyx-200"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm5.625 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <div>
                <p className="font-display text-lg text-onyx mb-1">
                  Your cart is empty
                </p>
                <p className="text-sm text-onyx-400">
                  Discover our curated collection of luxury fragrances
                </p>
              </div>
              <button onClick={closeCart} className="btn-outline-gold text-sm">
                Browse Collection
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-onyx-100 px-6" aria-label="Cart items">
              {items.map((item) => (
                <li key={item.id} className="py-5 flex gap-4">
                  {/* Image */}
                  <Link
                    href={`/shop/${item.id}`}
                    onClick={closeCart}
                    className="relative w-20 h-20 rounded-lg overflow-hidden bg-onyx-50 flex-shrink-0 hover:opacity-90 transition-opacity"
                    aria-label={`View ${item.title}`}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-onyx-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1}
                          stroke="currentColor"
                          className="w-8 h-8 text-onyx-300"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.414 2.798H4.212c-1.444 0-2.414-1.798-1.414-2.798L4.2 15.3"
                          />
                        </svg>
                      </div>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-onyx-400 mb-0.5">{item.brand}</p>
                    <Link
                      href={`/shop/${item.id}`}
                      onClick={closeCart}
                      className="font-display text-sm text-onyx font-medium leading-snug line-clamp-2 hover:text-gold transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm font-semibold text-onyx mt-1">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity + Remove */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-onyx-200 rounded">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-onyx hover:text-gold transition-colors text-base"
                          aria-label={`Decrease quantity of ${item.title}`}
                        >
                          −
                        </button>
                        <span
                          className="w-7 text-center text-sm font-medium text-onyx"
                          aria-live="polite"
                          aria-label={`Quantity: ${item.quantity}`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-onyx hover:text-gold transition-colors text-base"
                          aria-label={`Increase quantity of ${item.title}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto p-1 text-onyx-300 hover:text-red-500 transition-colors"
                        aria-label={`Remove ${item.title} from cart`}
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
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-onyx-100 px-6 py-5 bg-white space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-onyx-500">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-onyx-500">
                <span>Service Fee</span>
                <span>{formatPrice(fee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-onyx text-base pt-2 border-t border-onyx-100">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg py-2 px-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Order now — delivered within <strong>24 hours</strong></span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-gold w-full text-center block"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-center text-sm text-onyx-400 hover:text-onyx transition-colors py-1"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
