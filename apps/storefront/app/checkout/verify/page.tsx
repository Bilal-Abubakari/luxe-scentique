'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../../components/cart/cart-context';
import { verifyPayment, markOrderAsPaid } from '../../../lib/api';
import { formatPrice } from '../../../lib/utils';
import type { IOrder } from '@luxe-scentique/shared-types';

type VerifyState = 'loading' | 'success' | 'failed' | 'error';

function VerifyContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const hasRun = useRef(false);

  const [state, setState] = useState<VerifyState>('loading');
  const [order, setOrder] = useState<IOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const reference = searchParams.get('reference') ?? searchParams.get('trxref') ?? '';

  useEffect(() => {
    // Guard against StrictMode double-invocation and page re-renders
    if (hasRun.current) return;
    hasRun.current = true;

    if (!reference) {
      setState('error');
      setErrorMessage('No payment reference found. This link may be invalid or expired.');
      return;
    }

    async function verify() {
      try {
        // 1. Verify with Paystack
        const result = await verifyPayment(reference);

        if (result.status !== 'success') {
          setState('failed');
          setErrorMessage(
            'Your payment was not completed. No charges have been made to your account.',
          );
          return;
        }

        // 2. Mark order as paid in our system (webhook is primary, this is belt-and-suspenders)
        const orderId = result.metadata?.orderId as string | undefined;
        if (orderId) {
          try {
            const updatedOrder = await markOrderAsPaid(orderId, reference);
            setOrder(updatedOrder);
          } catch {
            // Webhook may have already marked it paid — not a blocking error
          }
        }

        // 3. Clear the cart on success
        clearCart();
        setState('success');
      } catch (err) {
        setState('error');
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while verifying your payment.',
        );
      }
    }

    void verify();
  }, [reference, clearCart]);

  // ── Loading ──
  if (state === 'loading') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
          <svg
            className="animate-spin w-8 h-8 text-gold"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Verifying payment"
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
        </div>
        <h2 className="font-display text-2xl text-onyx mb-2">Verifying Your Payment</h2>
        <p className="text-onyx-400 text-sm">
          Please wait while we confirm your payment with Paystack…
        </p>
      </div>
    );
  }

  // ── Success ──
  if (state === 'success') {
    return (
      <div className="text-center py-8 animate-fade-in">
        {/* Checkmark */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-8 h-8 text-green-600"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h2 className="font-display text-2xl text-onyx mb-2">Payment Confirmed!</h2>
        <p className="text-onyx-500 text-sm mb-1">
          Your order has been placed and is now being processed.
        </p>

        {order && (
          <div className="mt-5 mb-7 bg-cream-200 rounded-xl p-5 text-left space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-onyx-500">Order Number</span>
              <span className="font-semibold text-onyx font-mono tracking-wide">
                {order.orderNumber}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-onyx-500">Total Paid</span>
              <span className="font-semibold text-gold">{formatPrice(order.total)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-onyx-500">Email</span>
              <span className="text-onyx">{order.customerEmail}</span>
            </div>
            <div className="border-t border-onyx-100 pt-3">
              <p className="text-xs text-onyx-400">
                Save your order number to track your order anytime.
              </p>
            </div>
          </div>
        )}

        {!order && (
          <p className="text-xs text-onyx-400 mt-2 mb-7">
            Use the email you provided to track your order status.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/track" className="btn-gold">
            Track Your Order
          </Link>
          <Link href="/shop" className="btn-outline-gold">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ── Failed ──
  if (state === 'failed') {
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8 text-amber-600"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        <h2 className="font-display text-2xl text-onyx mb-2">Payment Not Completed</h2>
        <p className="text-onyx-500 text-sm mb-7">{errorMessage}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/checkout" className="btn-gold">
            Try Again
          </Link>
          <Link href="/shop" className="btn-outline-gold">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // ── Error ──
  return (
    <div className="text-center py-8 animate-fade-in">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-8 h-8 text-red-600"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h2 className="font-display text-2xl text-onyx mb-2">Something Went Wrong</h2>
      <p className="text-onyx-500 text-sm mb-7">{errorMessage}</p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/checkout" className="btn-gold">
          Return to Checkout
        </Link>
        <Link href="/track" className="btn-outline-gold">
          Track an Order
        </Link>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Page header */}
      <div className="bg-onyx py-14 text-center">
        <p className="text-gold font-medium tracking-widest uppercase text-xs mb-3">Payment</p>
        <h1 className="font-display text-display-sm text-cream">Payment Verification</h1>
      </div>

      <div className="container-luxury py-12">
        <div className="max-w-md mx-auto bg-white rounded-xl border border-onyx-100 shadow-sm p-8">
          <Suspense
            fallback={
              <div className="text-center py-12">
                <div className="w-12 h-12 mx-auto mb-4 skeleton rounded-full" />
                <div className="skeleton h-6 w-48 mx-auto rounded mb-2" />
                <div className="skeleton h-4 w-64 mx-auto rounded" />
              </div>
            }
          >
            <VerifyContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
