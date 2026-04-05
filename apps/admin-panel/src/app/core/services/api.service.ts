import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { OrderStatus } from '@luxe-scentique/shared-types';
import type {
  IPerfume,
  IPerfumePaginated,
  IOrder,
} from '@luxe-scentique/shared-types';
import type {
  CreateProductDto,
  UpdateProductDto,
  CreateWalkInOrderDto,
} from '@luxe-scentique/shared-types/dtos';
import { environment } from '../../../environments/environment';

type UnknownKeys = string | number | boolean | undefined;

export interface DashboardStats {
  totalSales: number;
  todaySales: number;
  pendingOrders: number;
  totalProducts: number;
  lowStockProducts: number;
}

export interface OrderFilters {
  [key: string]: UnknownKeys;
  status?: OrderStatus;
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface ProductQueryParams {
  [key: string]: UnknownKeys;
  page?: number;
  limit?: number;
  search?: string;
  vibe?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const API_BASE = environment.apiBase;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);

  // ============================================================
  // Products / Inventory
  // ============================================================

  getProducts(query?: ProductQueryParams): Observable<IPerfumePaginated> {
    return this.http.get<IPerfumePaginated>(`${API_BASE}/products`, {
      params: this.buildHttpParams(query),
    });
  }

  createProduct(dto: Omit<CreateProductDto, 'images'>, imageFiles: File[]): Observable<IPerfume> {
    const formData = new FormData();
    (Object.entries(dto) as [string, string][]).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      }
    });
    imageFiles.forEach((file) => formData.append('images', file));
    return this.http.post<IPerfume>(`${API_BASE}/products`, formData);
  }

  updateProduct(id: string, dto: UpdateProductDto): Observable<IPerfume> {
    return this.http.patch<IPerfume>(`${API_BASE}/products/${id}`, dto);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/products/${id}`);
  }

  // ============================================================
  // Orders
  // ============================================================

  getOrders(filters?: OrderFilters): Observable<{ data: IOrder[]; total: number }> {
    return this.http.get<{ data: IOrder[]; total: number }>(`${API_BASE}/orders`, {
      params: this.buildHttpParams(filters),
    });
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<IOrder> {
    return this.http.patch<IOrder>(`${API_BASE}/orders/${id}/status`, { status });
  }

  createWalkInOrder(dto: CreateWalkInOrderDto): Observable<IOrder> {
    return this.http.post<IOrder>(`${API_BASE}/orders/walk-in`, dto);
  }

  // ============================================================
  // Dashboard Stats
  // ============================================================

  getDashboardStats(): Observable<DashboardStats> {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString();

    return forkJoin({
      allOrders: this.getOrders({ limit: 1 }),
      todayOrders: this.getOrders({ startDate: todayStart, endDate: todayEnd, limit: 200 }),
      pendingOrders: this.getOrders({ status: OrderStatus.PENDING, limit: 1 }),
      allProducts: this.getProducts({ limit: 1 }),
      lowStockProducts: this.getProducts({ limit: 200 }),
    }).pipe(
      map(({ allOrders, todayOrders, pendingOrders, allProducts, lowStockProducts }) => {
        const todaySales = todayOrders.data
          .filter((o) => o.status !== OrderStatus.CANCELLED)
          .reduce((sum, o) => sum + (o.total ?? 0), 0);

        const lowStockCount = lowStockProducts.data
          ? (lowStockProducts.data).filter((p) => (p.stock ?? 0) < 10).length
          : 0;

        return {
          totalSales: allOrders.total,
          todaySales,
          pendingOrders: pendingOrders.total,
          totalProducts: allProducts.total,
          lowStockProducts: lowStockCount,
        };
      })
    );
  }

  private buildHttpParams(query?: Record<string, string | number | boolean | undefined>): HttpParams {
    let params = new HttpParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, `${value}`);
        }
      });
    }
    return params;
  }
}
