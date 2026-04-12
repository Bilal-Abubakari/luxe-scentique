'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../components/cart/cart-context';
import { createOrder, initializePayment } from '../../lib/api';
import { formatPrice } from '../../lib/utils';

const SERVICE_FEE_RATE = 0.0195;
const SERVICE_FEE_CAP = 1000;
const SERVICE_FEE_MIN = 0.5;

function calcFee(subtotal: number): number {
  if (subtotal === 0) return 0;
  return Math.min(Math.max(subtotal * SERVICE_FEE_RATE, SERVICE_FEE_MIN), SERVICE_FEE_CAP);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, isHydrated } = useCart();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fee = calcFee(subtotal);
  const total = subtotal + fee;

  // Wait for cart to hydrate from localStorage before deciding to redirect
  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.replace('/shop');
    }
  }, [isHydrated, items.length, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const order = await createOrder({
        customerEmail: email.trim(),
        customerName: name.trim() || undefined,
        customerPhone: phone.trim() || undefined,
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
        notes: notes.trim() || undefined,
      });

      const payment = await initializePayment(order.id);
      globalThis.location.href = payment.authorization_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Show skeleton while cart is loading from localStorage
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="bg-onyx py-12" />
        <div className="container-luxury py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">
            <div className="bg-white rounded-xl border border-onyx-100 p-8 shadow-sm space-y-5">
              {new Array(4).map((value) => (
                  <div key={value} className="skeleton h-12 rounded-md" />
              ))}
            </div>
            <div className="bg-white rounded-xl border border-onyx-100 p-6 shadow-sm space-y-4">
              {new Array(3).map((value) => (
                <div key={value} className="skeleton h-16 rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-onyx-400 mb-4">Your cart is empty.</p>
          <Link href="/shop" className="btn-gold">
            Browse Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Page header */}
      <div className="bg-onyx py-14 text-center">
        <p className="text-gold font-medium tracking-widest uppercase text-xs mb-3">
          Secure Checkout
        </p>
        <h1 className="font-display text-display-sm text-cream">Complete Your Order</h1>
        <p className="text-onyx-300 mt-3 text-sm">
          Payments are processed securely via Paystack
        </p>
      </div>

      <div className="container-luxury py-12">
        {/* Back link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-onyx-400 hover:text-onyx transition-colors mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Continue Shopping
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
          {/* ── Left: Contact form ── */}
          <div className="bg-white rounded-xl border border-onyx-100 p-8 shadow-sm">
            <h2 className="font-display text-xl text-onyx mb-7">Your Details</h2>

            <form onSubmit={handleSubmit} noValidate aria-label="Checkout form">
              {/* Name */}
              <div className="mb-5">
                <label htmlFor="checkout-name" className="label-luxury">
                  Full Name{' '}
                  <span className="text-onyx-300 font-normal text-xs">(optional)</span>
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="input-luxury"
                  autoComplete="name"
                  disabled={isSubmitting}
                />
              </div>

              {/* Email */}
              <div className="mb-5">
                <label htmlFor="checkout-email" className="label-luxury">
                  Email Address <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="input-luxury"
                  required
                  aria-required="true"
                  autoComplete="email"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-onyx-400 mt-1.5">
                  Used to look up your order. No account needed.
                </p>
              </div>

              {/* Phone */}
              <div className="mb-5">
                <label htmlFor="checkout-phone" className="label-luxury">
                  Phone Number{' '}
                  <span className="text-onyx-300 font-normal text-xs">(optional)</span>
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+233 XX XXX XXXX"
                  className="input-luxury"
                  autoComplete="tel"
                  disabled={isSubmitting}
                />
              </div>

              {/* Notes */}
              <div className="mb-7">
                <label htmlFor="checkout-notes" className="label-luxury">
                  Order Notes{' '}
                  <span className="text-onyx-300 font-normal text-xs">(optional)</span>
                </label>
                <textarea
                  id="checkout-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests or instructions..."
                  rows={3}
                  className="input-luxury resize-none"
                  disabled={isSubmitting}
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-start"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="w-full btn-gold py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
                aria-label={`Pay ${formatPrice(total)} with Paystack`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Redirecting to Paystack…
                  </>
                ) : (
                  <>
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
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                    Pay {formatPrice(total)} with Paystack
                  </>
                )}
              </button>

              <p className="text-xs text-center text-onyx-400 mt-3 flex items-center justify-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
                256-bit SSL encryption · Powered by Paystack
              </p>
            </form>
          </div>

          {/* ── Right: Order summary ── */}
          <div className="space-y-4 lg:sticky lg:top-6">
            <div className="bg-white rounded-xl border border-onyx-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg text-onyx">
                  Order Summary{''}
                  <span className="ml-2 text-sm font-normal text-onyx-400 font-body">
                    ({items.reduce((s, i) => s + i.quantity, 0)}{' '}
                    {items.reduce((s, i) => s + i.quantity, 0) === 1 ? 'item' : 'items'})
                  </span>
                </h2>
              </div>

              {/* Items */}
              <ul className="space-y-4 mb-5" aria-label="Cart items">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 items-start">
                    {/* Image */}
                    <div className="relative w-14 h-14 rounded-lg bg-onyx-50 flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-onyx-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1}
                            stroke="currentColor"
                            className="w-6 h-6 text-onyx-300"
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
                      {item.quantity > 1 && (
                        <span
                          className="absolute -top-1.5 -right-1.5 bg-gold text-onyx text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                          aria-label={`Quantity: ${item.quantity}`}
                        >
                          {item.quantity}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-onyx-400 uppercase tracking-wide">
                        {item.brand}
                      </p>
                      <p className="text-sm font-medium text-onyx leading-snug line-clamp-2">
                        {item.title}
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-onyx flex-shrink-0 pt-1">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Totals */}
              <div className="border-t border-onyx-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-onyx-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-onyx-500">
                  <span className="flex items-center gap-1">
                    Service Fee{''}
                    <span
                      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-onyx-100 text-onyx text-[9px] cursor-help"
                      title="A small processing fee applied to all orders"
                      aria-label="Service fee: A small processing fee applied to all orders"
                    >
                      ?
                    </span>
                  </span>
                  <span>{formatPrice(fee)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-onyx-100">
                  <span className="text-onyx">Total</span>
                  <span className="text-gold">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Security badge */}
            <div className="bg-cream-200 rounded-xl p-4 flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-gold flex-shrink-0"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
              <div>
                <p className="text-xs font-semibold text-onyx">Your payment is protected</p>
                <p className="text-xs text-onyx-400 mt-0.5">
                  Secured by Paystack with 256-bit SSL encryption
                </p>
              </div>
            </div>

            {/* Delivery promise badge */}
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-green-600 flex-shrink-0"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-xs font-semibold text-green-800">24-Hour Delivery</p>
                <p className="text-xs text-green-700 mt-0.5">
                  Your order will be delivered within 24 hours of payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
