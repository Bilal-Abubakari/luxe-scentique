'use client';

import React, { useState, FormEvent } from 'react';
import { lookupOrders } from '../../lib/api';
import {
  formatPrice,
  formatDate,
  getOrderStatusLabel,
  getOrderStatusColor,
  cn,
} from '../../lib/utils';
import type { IOrder } from '@luxe-scentique/shared-types';
import { OrderStatus } from '@luxe-scentique/shared-types';

const STATUS_STEPS: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
];

function getStepIndex(status: OrderStatus): number {
  if (status === OrderStatus.CANCELLED) return -1;
  return STATUS_STEPS.indexOf(status);
}

interface OrderTimelineProps {
  status: OrderStatus;
}

function OrderTimeline({ status }: Readonly<OrderTimelineProps>) {
  const currentIndex = getStepIndex(status);
  const isCancelled = status === OrderStatus.CANCELLED;

  if (isCancelled) {
    return (
      <output
        className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
        aria-label="Order cancelled"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-red-500 flex-shrink-0"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <p className="text-red-700 font-medium">This order has been cancelled.</p>
      </output>
    );
  }

  return (
    <div className="relative" aria-label="Order status timeline">
      {/* Connecting line */}
      <div className="absolute top-5 left-5 right-5 h-0.5 bg-onyx-100" aria-hidden="true" />
      <div
        className="absolute top-5 left-5 h-0.5 bg-gold transition-all duration-700"
        style={{
          width: currentIndex > 0 ? `${(currentIndex / (STATUS_STEPS.length - 1)) * 100}%` : '0%',
        }}
        aria-hidden="true"
      />

      <ul className="relative flex justify-between">
        {STATUS_STEPS.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const currentSuffix = isCurrent ? ' (current)' : '';
          const completedSuffix = isCompleted ? ' (completed)' : '';
          const stepStatusSuffix = currentSuffix || completedSuffix;

          return (
            <li
              key={step}
              className="flex flex-col items-center gap-2"
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 bg-cream',
                  isCompleted ? 'bg-gold border-gold text-onyx' : 'border-onyx-200 text-onyx-300',
                  isCurrent && 'ring-4 ring-gold/20',
                )}
                aria-label={`${getOrderStatusLabel(step)}${stepStatusSuffix}`}
              >
                {isCompleted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <span className="text-xs font-bold" aria-hidden="true">
                    {index + 1}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium text-center max-w-[70px]',
                  isCompleted ? 'text-gold' : 'text-onyx-400',
                )}
              >
                {getOrderStatusLabel(step)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface OrderCardProps {
  order: IOrder;
}

function OrderCard({ order }: Readonly<OrderCardProps>) {
  return (
    <article
      className="bg-white border border-onyx-100 rounded-xl overflow-hidden shadow-sm"
      aria-label={`Order ${order.orderNumber}`}
    >
      {/* Order Header */}
      <div className="bg-onyx p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-onyx-300 text-xs uppercase tracking-widest mb-1">Order Number</p>
            <p className="text-cream font-display text-xl font-semibold">{order.orderNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-onyx-300 text-xs uppercase tracking-widest mb-1">Placed On</p>
            <p className="text-cream text-sm">{formatDate(order.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Status Timeline */}
        <div>
          <h3 className="font-display text-lg text-onyx mb-4">Order Status</h3>
          <OrderTimeline status={order.status} />
        </div>

        {/* Current Status Badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-onyx-500">Current status:</span>
          <span
            className={cn(
              'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide',
              getOrderStatusColor(order.status),
            )}
          >
            {getOrderStatusLabel(order.status)}
          </span>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="font-display text-lg text-onyx mb-4">Items Ordered</h3>
          <ul className="divide-y divide-onyx-100" aria-label="Ordered items">
            {order.items.map((item) => (
              <li key={item.id} className="py-3 flex items-center gap-4">
                <div className="w-12 h-12 bg-onyx-100 rounded-md flex items-center justify-center flex-shrink-0">
                  {item.productImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.productImage}
                      alt={item.productTitle}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
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
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-onyx truncate">{item.productTitle}</p>
                  <p className="text-xs text-onyx-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-onyx flex-shrink-0">
                  {formatPrice(item.subtotal)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Order Summary */}
        <div className="bg-cream-100 rounded-lg p-5 space-y-2">
          <h3 className="font-display text-base text-onyx mb-3">Order Summary</h3>
          <div className="flex justify-between text-sm">
            <span className="text-onyx-500">Subtotal</span>
            <span className="text-onyx font-medium">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-onyx-500 flex items-center gap-1">
              Service Fee{''}
              <span
                className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-onyx-200 text-onyx text-[10px] cursor-help"
                title="A small processing fee applied to all orders"
                aria-label="Service fee information: A small processing fee applied to all orders"
              >
                ?
              </span>
            </span>
            <span className="text-onyx font-medium">{formatPrice(order.serviceFee)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold border-t border-onyx-200 pt-2 mt-2">
            <span className="text-onyx">Total</span>
            <span className="text-gold">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-onyx-400">
            Payment:{' '}
            <span
              className={order.isPaid ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}
            >
              {order.isPaid ? 'Paid' : 'Pending'}
            </span>
          </span>
          <span className="text-onyx-400 capitalize">
            {order.paymentMethod.replace('_', ' ').toLowerCase()}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function TrackPage() {
  const [identifier, setIdentifier] = useState('');
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = identifier.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const result = await lookupOrders(trimmed);
      setOrders(Array.isArray(result) ? result : [result]);
    } catch (err) {
      setOrders([]);
      if (err instanceof Error) {
        setError(err.message.includes('404')
          ? 'No orders found for this email, phone number, or order number.'
          : 'Unable to look up your order. Please try again.');
      } else {
        setError('Unable to look up your order. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-onyx py-16 text-center">
        <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
          Order Management
        </p>
        <h1 className="font-display text-display-sm text-cream">Track Your Order</h1>
        <p className="text-onyx-300 mt-3 max-w-lg mx-auto text-sm">
          No account needed. Enter your email, phone number, or order number to find your order.
        </p>
      </div>

      <div className="container-luxury py-12 max-w-2xl">
        {/* Search Form */}
        <div className="bg-white rounded-xl border border-onyx-100 p-8 shadow-sm mb-8">
          <h2 className="font-display text-xl text-onyx mb-6">Find Your Order</h2>
          <form onSubmit={handleSubmit} noValidate aria-label="Order lookup form">
            <div className="mb-4">
              <label htmlFor="order-identifier" className="label-luxury">
                Email, Phone Number, or Order Number
              </label>
              <input
                id="order-identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. john@example.com or LS-12345"
                className="input-luxury"
                required
                aria-required="true"
                aria-describedby="identifier-hint"
                autoComplete="email"
              />
              <p id="identifier-hint" className="text-xs text-onyx-400 mt-2">
                You can use the email or phone number you used when placing the order, or your order number.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !identifier.trim()}
              className="w-full btn-gold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              aria-label="Track order"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Searching...
                </>
              ) : (
                'Track Order'
              )}
            </button>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div
            role="alert"
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Results */}
        {hasSearched && !isLoading && orders.length > 0 && (
          <section aria-label="Order results">
            <h2 className="font-display text-xl text-onyx mb-6">
              {orders.length === 1 ? 'Your Order' : `Found ${orders.length} Orders`}
            </h2>
            <div className="space-y-6">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </section>
        )}

        {/* No results state */}
        {hasSearched && !isLoading && !error && orders.length === 0 && (
          <div className="text-center py-12 text-onyx-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-12 h-12 mx-auto mb-4 text-onyx-200"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
            <p className="font-medium text-onyx-500">No orders found</p>
            <p className="text-sm mt-1">
              Try using a different email, phone number, or order number.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
