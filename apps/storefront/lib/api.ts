import type {
  IPerfume,
  IPerfumePaginated,
  IOrder,
  IServiceFeeCalculation,
} from '@luxe-scentique/shared-types';
import type {
  ProductQueryDto,
  CreateOrderDto,
  OrderLookupDto,
} from '@luxe-scentique/shared-types/dtos';
import { getAuthHeaders } from './auth';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(getAuthHeaders() as Record<string, string>),
    ...(options.headers as Record<string, string> | undefined),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `HTTP error ${response.status}`;
    try {
      const errorBody = (await response.json()) as { message?: string };
      if (errorBody.message) {
        message = Array.isArray(errorBody.message)
          ? errorBody.message.join(', ')
          : String(errorBody.message);
      }
    } catch {
      // Response body is not JSON — use status text
      message = response.statusText || message;
    }
    throw new ApiError(response.status, message);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return await response.json() as Promise<T>;
}

function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Fetch a paginated, filtered list of products.
 */
export async function getProducts(query: ProductQueryDto = {}): Promise<IPerfumePaginated> {
  const qs = buildQueryString(query as Record<string, string | number | boolean | undefined>);
  return request<IPerfumePaginated>(`/products${qs}`, {
    next: { revalidate: 60 },
  });
}

/**
 * Fetch a single product by its ID.
 */
export async function getProduct(id: string): Promise<IPerfume> {
  if (!id) throw new Error('Product ID is required');
  return request<IPerfume>(`/products/${encodeURIComponent(id)}`, {
    next: { revalidate: 60 },
  });
}

/**
 * Create a new customer order.
 */
export async function createOrder(dto: CreateOrderDto): Promise<IOrder> {
  return request<IOrder>('/orders', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

/**
 * Look up orders by email, phone number, or order number.
 * Returns an array of matching orders (or a single order).
 */
export async function lookupOrders(identifier: string): Promise<IOrder[]> {
  const body: OrderLookupDto = { identifier };
  const result = await request<IOrder | IOrder[]>('/orders/lookup', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return Array.isArray(result) ? result : [result];
}

/**
 * Calculate service fee for a given subtotal.
 */
export async function calculateFee(subtotal: number): Promise<IServiceFeeCalculation> {
  if (subtotal < 0) throw new Error('Subtotal must be a non-negative number');
  return request<IServiceFeeCalculation>(
    `/payments/fee${buildQueryString({ subtotal })}`,
  );
}
