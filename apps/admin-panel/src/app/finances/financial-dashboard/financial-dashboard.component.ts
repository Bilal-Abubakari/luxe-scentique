import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ApiService } from '../../core/services/api.service';
import type { IFinancialSummary, ICashFlowEntry, IPLReport } from '@luxe-scentique/shared-types';

interface PeriodOption { label: string; value: string; days: number }

@Component({
  selector: 'app-financial-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    CardModule,
    ChartModule,
    SkeletonModule,
    ButtonModule,
    SelectModule,
    TagModule,
    DividerModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './financial-dashboard.component.html',
  styleUrl: './financial-dashboard.component.scss',
})
export class FinancialDashboardComponent implements OnInit {
  private readonly api = inject(ApiService);

  isLoading = signal(true);
  summary = signal<IFinancialSummary | null>(null);
  report = signal<IPLReport | null>(null);
  cashFlow = signal<ICashFlowEntry[]>([]);

  cashFlowChartData = signal<Record<string, unknown> | null>(null);
  expensePieData = signal<Record<string, unknown> | null>(null);
  chartOptions = signal<Record<string, unknown>>({});
  pieOptions = signal<Record<string, unknown>>({});

  selectedPeriod = signal('30');
  readonly periodOptions: PeriodOption[] = [
    { label: 'Last 7 Days', value: '7', days: 7 },
    { label: 'Last 30 Days', value: '30', days: 30 },
    { label: 'Last 90 Days', value: '90', days: 90 },
    { label: 'This Year', value: '365', days: 365 },
  ];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    const { startDate, endDate } = this.getDateRange();

    this.api.getPLReport({ startDate, endDate }).subscribe({
      next: (report) => {
        this.report.set(report);
        this.summary.set(report.summary);
        this.cashFlow.set(report.cashFlow);
        this.buildCharts(report);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  onPeriodChange(val: string): void {
    this.selectedPeriod.set(val);
    this.loadData();
  }

  private getDateRange(): { startDate: string; endDate: string } {
    const days = Number.parseInt(this.selectedPeriod(), 10);
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }

  private buildCharts(report: IPLReport): void {
    const flow = report.cashFlow;

    // Cash flow line chart
    this.cashFlowChartData.set({
      labels: flow.map((f) => f.label),
      datasets: [
        {
          label: 'Inflow',
          data: flow.map((f) => f.inflow),
          borderColor: 'rgba(46, 204, 113, 1)',
          backgroundColor: 'rgba(46, 204, 113, 0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
        {
          label: 'Outflow',
          data: flow.map((f) => f.outflow),
          borderColor: 'rgba(231, 76, 60, 1)',
          backgroundColor: 'rgba(231, 76, 60, 0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
        {
          label: 'Net',
          data: flow.map((f) => f.cumulativeNet),
          borderColor: 'rgba(212, 175, 55, 1)',
          backgroundColor: 'rgba(212, 175, 55, 0.08)',
          fill: false,
          tension: 0.4,
          borderDash: [5, 5],
          pointRadius: 2,
        },
      ],
    });

    // Expense pie chart
    const cats = report.expensesByCategory.slice(0, 8);
    const COLORS = [
      '#e74c3c','#e67e22','#f39c12','#2ecc71','#1abc9c',
      '#3498db','#9b59b6','#34495e',
    ];
    this.expensePieData.set({
      labels: cats.map((c) => c.label),
      datasets: [{
        data: cats.map((c) => c.amount),
        backgroundColor: cats.map((_, i) => COLORS[i % COLORS.length]),
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 2,
      }],
    });

    const tooltipBase = {
      backgroundColor: 'rgba(26,26,46,0.95)',
      titleColor: '#D4AF37',
      bodyColor: '#fff',
      borderColor: 'rgba(212,175,55,0.3)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (ctx: { dataset: { label: string }; parsed: { y: number } }) =>
          ` ${ctx.dataset.label}: ${this.fmt(ctx.parsed.y)}`,
      },
    };

    this.chartOptions.set({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { labels: { color: '#b0b0b0', font: { size: 12 } } }, tooltip: tooltipBase },
      scales: {
        x: { ticks: { color: '#b0b0b0', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: {
          ticks: {
            color: '#b0b0b0', font: { size: 11 },
            callback: (v: number) => this.fmt(v),
          },
          grid: { color: 'rgba(255,255,255,0.04)' },
        },
      },
    });

    this.pieOptions.set({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: '#b0b0b0', font: { size: 12 }, padding: 16 } },
        tooltip: {
          ...tooltipBase,
          callbacks: {
            label: (ctx: { label: string; parsed: number }) =>
              ` ${ctx.label}: ${this.fmt(ctx.parsed)}`,
          },
        },
      },
    });
  }

  fmt(amount: number): string {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency', currency: 'GHS', minimumFractionDigits: 2,
    }).format(amount ?? 0);
  }

  get profitClass(): string {
    const net = this.summary()?.netProfit ?? 0;
    return net >= 0 ? 'profit' : 'loss';
  }

  get profitIcon(): string {
    const net = this.summary()?.netProfit ?? 0;
    return net >= 0 ? 'pi pi-trending-up' : 'pi pi-trending-down';
  }
}

