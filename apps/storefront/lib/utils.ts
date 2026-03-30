import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { OrderStatus } from '@luxe-scentique/shared-types';

/**
 * Merge Tailwind class names intelligently, resolving conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a numeric amount as a currency string.
 * Defaults to GHS (Ghanaian Cedi).
 *
 * @example formatPrice(1234.5) → "GHS 1,234.50"
 * @example formatPrice(99, 'USD') → "USD 99.00"
 */
export function formatPrice(amount: number, currency = 'GHS'): string {
  const formatted = new Intl.NumberFormat('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${currency} ${formatted}`;
}

/**
 * Format a Date object or ISO date string into a human-readable date.
 *
 * @example formatDate(new Date('2026-03-28')) → "March 28, 2026"
 * @example formatDate('2026-01-01T00:00:00Z') → "January 1, 2026"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * Maps an OrderStatus enum value to a human-readable label.
 */
export function getOrderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'Pending',
    [OrderStatus.PROCESSING]: 'Processing',
    [OrderStatus.SHIPPED]: 'Shipped',
    [OrderStatus.DELIVERED]: 'Delivered',
    [OrderStatus.CANCELLED]: 'Cancelled',
  };
  return labels[status] ?? status;
}

/**
 * Maps an OrderStatus enum value to a Tailwind CSS color class set.
 * Returns a combination of background, text, and border classes suitable
 * for a badge/pill component.
 */
export function getOrderStatusColor(status: OrderStatus): string {
  const colorMap: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]:
      'bg-amber-50 text-amber-700 border border-amber-200',
    [OrderStatus.PROCESSING]:
      'bg-blue-50 text-blue-700 border border-blue-200',
    [OrderStatus.SHIPPED]:
      'bg-purple-50 text-purple-700 border border-purple-200',
    [OrderStatus.DELIVERED]:
      'bg-green-50 text-green-700 border border-green-200',
    [OrderStatus.CANCELLED]:
      'bg-red-50 text-red-700 border border-red-200',
  };
  return colorMap[status] ?? 'bg-gray-50 text-gray-700 border border-gray-200';
}
