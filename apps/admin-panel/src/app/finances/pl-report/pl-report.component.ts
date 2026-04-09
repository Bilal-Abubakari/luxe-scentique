import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../core/services/api.service';
import type { IPLReport } from '@luxe-scentique/shared-types';

interface PeriodPreset { label: string; value: string; days: number }

@Component({
  selector: 'app-pl-report',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    CardModule, ChartModule, ButtonModule, SelectModule, DatePickerModule,
    SkeletonModule, TableModule, TagModule, DividerModule, ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './pl-report.component.html',
  styleUrl: './pl-report.component.scss',
})
export class PlReportComponent implements OnInit {
  private readonly api = inject(ApiService);

  report = signal<IPLReport | null>(null);
  isLoading = signal(false);

  startDate = signal<Date | null>(null);
  endDate = signal<Date | null>(null);
  selectedPreset = signal('30');

  barChartData = signal<Record<string, unknown> | null>(null);
  barChartOptions = signal<Record<string, unknown>>({});

  readonly presets: PeriodPreset[] = [
    { label: 'Last 7 Days', value: '7', days: 7 },
    { label: 'Last 30 Days', value: '30', days: 30 },
    { label: 'Last 3 Months', value: '90', days: 90 },
    { label: 'Last 6 Months', value: '180', days: 180 },
    { label: 'This Year', value: '365', days: 365 },
    { label: 'Custom', value: 'custom', days: 0 },
  ];

  ngOnInit(): void { this.applyPreset('30'); }

  applyPreset(val: string): void {
    this.selectedPreset.set(val);
    if (val !== 'custom') {
      const days = Number.parseInt(val, 10);
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - days);
      this.startDate.set(start);
      this.endDate.set(end);
      this.loadReport();
    }
  }

  loadReport(): void {
    const s = this.startDate();
    const e = this.endDate();
    if (!s || !e) return;
    this.isLoading.set(true);
    this.api.getPLReport({
      startDate: s.toISOString().split('T')[0],
      endDate: e.toISOString().split('T')[0],
    }).subscribe({
      next: (r) => {
        this.report.set(r);
        this.buildChart(r);
        this.isLoading.set(false);
      },
      error: () => { this.isLoading.set(false); },
    });
  }

  private buildChart(r: IPLReport): void {
    const flow = r.cashFlow;
    this.barChartData.set({
      labels: flow.map((f) => f.label),
      datasets: [
        {
          label: 'Revenue', data: flow.map((f) => f.inflow),
          backgroundColor: 'rgba(46,204,113,0.65)', borderColor: 'rgba(46,204,113,1)', borderWidth: 1, borderRadius: 4,
        },
        {
          label: 'Expenses', data: flow.map((f) => f.outflow),
          backgroundColor: 'rgba(231,76,60,0.65)', borderColor: 'rgba(231,76,60,1)', borderWidth: 1, borderRadius: 4,
        },
      ],
    });
    this.barChartOptions.set({
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#b0b0b0', font: { size: 12 } } },
        tooltip: {
          backgroundColor: 'rgba(26,26,46,0.95)', titleColor: '#D4AF37',
          bodyColor: '#fff', borderColor: 'rgba(212,175,55,0.3)', borderWidth: 1, padding: 12,
          callbacks: { label: (ctx: { dataset: { label: string }; parsed: { y: number } }) => ` ${ctx.dataset.label}: ${this.fmt(ctx.parsed.y)}` },
        },
      },
      scales: {
        x: { ticks: { color: '#b0b0b0', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: {
          ticks: { color: '#b0b0b0', font: { size: 11 }, callback: (v: number) => this.fmt(v) },
          grid: { color: 'rgba(255,255,255,0.04)' },
        },
      },
    });
  }

  exportCSV(): void {
    const r = this.report();
    if (!r) return;
    const rows: string[] = [
      'FINANCIAL REPORT',
      `Period: ${this.startDate()?.toLocaleDateString()} - ${this.endDate()?.toLocaleDateString()}`,
      '',
      'SUMMARY',
      `Sales Revenue,${r.summary.salesRevenue}`,
      `Other Income,${r.summary.otherIncome}`,
      `Total Revenue,${r.summary.totalRevenue}`,
      `Total Expenses,${r.summary.totalExpenses}`,
      `Net Profit,${r.summary.netProfit}`,
      `Profit Margin,${r.summary.profitMargin.toFixed(2)}%`,
      '',
      'EXPENSES BY CATEGORY',
      'Category,Amount,Percentage',
      ...r.expensesByCategory.map((e) => `${e.label},${e.amount},${e.percentage.toFixed(2)}%`),
      '',
      'CASH FLOW',
      'Date,Inflow,Outflow,Net',
      ...r.cashFlow.map((c) => `${c.date},${c.inflow},${c.outflow},${c.net}`),
    ];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pl-report-${this.startDate()?.toISOString().split('T')[0]}-to-${this.endDate()?.toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  fmt(v: number): string {
    return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', minimumFractionDigits: 2 }).format(v ?? 0);
  }

  pct(v: number): string { return v.toFixed(1) + '%'; }

  profitColor(v: number): string { return v >= 0 ? '#2ecc71' : '#e74c3c'; }
}

