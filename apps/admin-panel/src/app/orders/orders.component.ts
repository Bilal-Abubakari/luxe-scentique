import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ApiService } from '../core/services/api.service';
import { OrderStatus } from '@luxe-scentique/shared-types';
import type { IOrder } from '@luxe-scentique/shared-types';

interface StatusOption {
  label: string;
  value: OrderStatus | null;
}

interface StatusUpdateOption {
  label: string;
  value: OrderStatus;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    TableModule,
    ButtonModule,
    DialogModule,
    SelectModule,
    TagModule,
    ToastModule,
    SkeletonModule,
    DividerModule,
    CardModule,
    RippleModule,
    InputTextModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly messageService = inject(MessageService);

  orders = signal<IOrder[]>([]);
  totalOrders = signal(0);
  isLoading = signal(true);
  isUpdating = signal<string | null>(null);

  selectedOrder = signal<IOrder | null>(null);
  showDetailDialog = signal(false);

  currentPage = signal(0);
  pageSize = signal(15);
  selectedStatus = signal<OrderStatus | null>(null);
  searchTerm = signal('');

  readonly statusFilterOptions: StatusOption[] = [
    { label: 'All Orders', value: null },
    { label: 'Pending', value: OrderStatus.PENDING },
    { label: 'Processing', value: OrderStatus.PROCESSING },
    { label: 'Shipped', value: OrderStatus.SHIPPED },
    { label: 'Delivered', value: OrderStatus.DELIVERED },
    { label: 'Cancelled', value: OrderStatus.CANCELLED },
  ];

  readonly orderStatusWorkflow: StatusUpdateOption[] = [
    { label: 'Pending', value: OrderStatus.PENDING },
    { label: 'Processing', value: OrderStatus.PROCESSING },
    { label: 'Shipped', value: OrderStatus.SHIPPED },
    { label: 'Delivered', value: OrderStatus.DELIVERED },
    { label: 'Cancelled', value: OrderStatus.CANCELLED },
  ];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(page = 0): void {
    this.isLoading.set(true);
    this.currentPage.set(page);

    this.apiService
      .getOrders({
        page: page + 1,
        limit: this.pageSize(),
        status: this.selectedStatus() ?? undefined,
        search: this.searchTerm() || undefined,
      })
      .subscribe({
        next: (result) => {
          this.orders.set(result.data ?? []);
          this.totalOrders.set(result.total ?? 0);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load orders. Please try again.',
          });
        },
      });
  }

  onStatusFilterChange(status: OrderStatus | null): void {
    this.selectedStatus.set(status);
    this.loadOrders(0);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    this.loadOrders(0);
  }

  onPageChange(event: { first: number; rows: number }): void {
    const page = Math.floor(event.first / event.rows);
    this.pageSize.set(event.rows);
    this.loadOrders(page);
  }

  openOrderDetail(order: IOrder): void {
    this.selectedOrder.set(order);
    this.showDetailDialog.set(true);
  }

  closeOrderDetail(): void {
    this.showDetailDialog.set(false);
    this.selectedOrder.set(null);
  }

  updateOrderStatus(order: IOrder, newStatus: OrderStatus): void {
    if (order.status === newStatus) return;

    this.isUpdating.set(order.id);

    this.apiService.updateOrderStatus(order.id, newStatus).subscribe({
      next: (updatedOrder) => {
        this.orders.update((list) =>
          list.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
        );

        const sel = this.selectedOrder();
        if (sel?.id === updatedOrder.id) {
          this.selectedOrder.set(updatedOrder);
        }

        this.isUpdating.set(null);
        this.messageService.add({
          severity: 'success',
          summary: 'Status Updated',
          detail: `Order #${updatedOrder.orderNumber ?? order.id.slice(-8)} marked as ${newStatus}.`,
        });
      },
      error: () => {
        this.isUpdating.set(null);
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: 'Could not update order status. Please try again.',
        });
      },
    });
  }

  getStatusSeverity(
    status: string
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
      PENDING: 'warn',
      PROCESSING: 'info',
      SHIPPED: 'secondary',
      DELIVERED: 'success',
      CANCELLED: 'danger',
    };
    return map[status];
  }

  getPaymentSeverity(
    method: string
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | undefined {
    const map: Record<string, 'success' | 'info' | 'warn'> = {
      ONLINE: 'info',
      WALK_IN: 'success',
    };
    return map[method?.toUpperCase()] ?? 'info';
  }

  getNextStatuses(currentStatus: string): StatusUpdateOption[] {
    const workflow: Record<string, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };
    const nextStatuses = workflow[currentStatus] ?? [];
    return this.orderStatusWorkflow.filter((s) => nextStatuses.includes(s.value));
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
    }).format(amount);
  }

  getOrderSubtotal(order: IOrder): number {
    if (!order.items) return order.total;
    return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getServiceFee(order: IOrder): number {
    return order.total - this.getOrderSubtotal(order);
  }
}
