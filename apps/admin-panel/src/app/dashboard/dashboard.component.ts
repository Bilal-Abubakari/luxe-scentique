import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { ApiService, DashboardStats } from '../core/services/api.service';
import type { IPerfume, IOrder } from '@luxe-scentique/shared-types';
import { RouterLink } from '@angular/router';

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: number;
  borderRadius: number;
}

const STATUS_CONFIG: Array<{ key: string; label: string }> = [
  { key: 'PENDING', label: 'Pending' },
  { key: 'PROCESSING', label: 'Processing' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'DELIVERED', label: 'Delivered' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    CardModule,
    ChartModule,
    TagModule,
    SkeletonModule,
    ButtonModule,
    DividerModule,
    BadgeModule,
    RouterLink,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly apiService = inject(ApiService);

  isLoading = signal(true);
  stats = signal<DashboardStats | null>(null);
  lowStockProducts = signal<IPerfume[]>([]);
  recentOrders = signal<IOrder[]>([]);
  chartData = signal<ChartData | null>(null);
  chartOptions = signal<Record<string, unknown>>({});
  today = new Date();

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading.set(true);

    this.apiService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });

    this.apiService.getProducts({ limit: 50 }).subscribe({
      next: (result) => {
        const products = result.data ?? result;
        const lowStock = products.filter((p) => (p.stock ?? 0) < 10 && p.isActive);
        this.lowStockProducts.set(lowStock.slice(0, 8));
      },
      error: () => {},
    });

    this.apiService.getOrders({ limit: 5 }).subscribe({
      next: (result) => {
        this.recentOrders.set(result.data ?? []);
      },
      error: () => {},
    });

    // Fetch all orders for chart
    this.apiService.getOrders({ limit: 200 }).subscribe({
      next: (result) => {
        this.buildChartData(result.data ?? []);
      },
      error: () => {},
    });
  }

  private buildChartData(orders: IOrder[]): void {
    const statusCounts: Record<string, number> = Object.fromEntries(
      STATUS_CONFIG.map(({ key }) => [key, 0]),
    );

    orders.forEach((order) => {
      const status = order.status as string;
      if (status in statusCounts) {
        statusCounts[status]++;
      }
    });

    this.chartData.set({
      labels: STATUS_CONFIG.map(({ label }) => label),
      datasets: [
        {
          label: 'Orders by Status',
          data: STATUS_CONFIG.map(({ key }) => statusCounts[key]),
          backgroundColor: [
            'rgba(243, 156, 18, 0.7)',
            'rgba(52, 152, 219, 0.7)',
            'rgba(155, 89, 182, 0.7)',
            'rgba(46, 204, 113, 0.7)',
            'rgba(231, 76, 60, 0.7)',
          ],
          borderColor: [
            'rgba(243, 156, 18, 1)',
            'rgba(52, 152, 219, 1)',
            'rgba(155, 89, 182, 1)',
            'rgba(46, 204, 113, 1)',
            'rgba(231, 76, 60, 1)',
          ],
          borderWidth: 2,
          borderRadius: 6,
        },
      ],
    });

    this.chartOptions.set({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(26, 26, 46, 0.95)',
          titleColor: '#D4AF37',
          bodyColor: '#ffffff',
          borderColor: 'rgba(212, 175, 55, 0.3)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#b0b0b0',
            font: { size: 12 },
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
          },
          border: {
            color: 'rgba(212, 175, 55, 0.2)',
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#b0b0b0',
            font: { size: 12 },
            stepSize: 1,
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
          },
          border: {
            color: 'rgba(212, 175, 55, 0.2)',
          },
        },
      },
    });
  }

  getStatusSeverity(
    status: string,
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

  getStockSeverity(stock: number): 'danger' | 'warn' | 'success' {
    if (stock === 0) return 'danger';
    if (stock < 5) return 'danger';
    return 'warn';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
    }).format(amount);
  }
}
