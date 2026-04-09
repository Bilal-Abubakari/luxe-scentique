import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { FinancialDashboardComponent } from './financial-dashboard/financial-dashboard.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { IncomeComponent } from './income/income.component';
import { PlReportComponent } from './pl-report/pl-report.component';

interface Tab {
  label: string;
  value: string;
  icon: string;
}

@Component({
  selector: 'app-finances',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    FinancialDashboardComponent,
    ExpensesComponent,
    IncomeComponent,
    PlReportComponent,
  ],
  template: `
    <div class="finances-page">
      <div class="page-header">
        <div class="page-title-group">
          <h1 class="page-title">
            <i class="pi pi-wallet"></i>
            Finance &amp; Accounting
          </h1>
          <p class="page-subtitle">Track revenue, expenses, cash flow and profitability</p>
        </div>
      </div>

      <p-tabs class="p-tabs" [value]="activeTab()" (valueChange)="activeTab.set($event + '')">
        <p-tablist>
          @for (tab of tabs; track tab.value) {
            <p-tab [value]="tab.value">
              <i [class]="tab.icon + ' tab-icon'"></i>
              {{ tab.label }}
            </p-tab>
          }
        </p-tablist>
        <p-tabpanels>
          <p-tabpanel value="dashboard">
            <app-financial-dashboard />
          </p-tabpanel>
          <p-tabpanel value="expenses">
            <app-expenses />
          </p-tabpanel>
          <p-tabpanel value="income">
            <app-income />
          </p-tabpanel>
          <p-tabpanel value="reports">
            <app-pl-report />
          </p-tabpanel>
        </p-tabpanels>
      </p-tabs>
    </div>
  `,
  styles: [`
    .finances-page {
      padding: 0;
    }

    .page-header {
      margin-bottom: 1.5rem;
    }

    .page-title-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-gold);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.6rem;

      i { font-size: 1.3rem; }
    }

    .page-subtitle {
      color: var(--color-text-muted);
      font-size: 0.875rem;
      margin: 0;
    }

    :host ::ng-deep {
      .p-tabs .p-tablist {
        background: var(--color-surface);
        border-bottom: 1px solid var(--color-border);
        border-radius: 10px 10px 0 0;
        padding: 0.5rem 0.5rem 0;
        gap: 0.25rem;
      }

      .p-tabs .p-tab {
        color: var(--color-text-secondary);
        border-radius: 8px 8px 0 0;
        font-weight: 500;
        padding: 0.6rem 1.2rem;
        gap: 0.4rem;
        font-size: 0.875rem;

        &[data-p-active="true"] {
          color: var(--color-gold);
          background: rgba(212,175,55,0.08);
          border-bottom: 2px solid var(--color-gold);
        }

        &:hover:not([data-p-active="true"]) {
          color: var(--color-text-primary);
          background: rgba(255,255,255,0.04);
        }
      }

      .p-tabpanels {
        background: transparent;
        padding: 1.5rem 0 0;
      }

      .tab-icon {
        font-size: 0.9rem;
      }
    }
  `],
})
export class FinancesComponent {
  activeTab = signal('dashboard');

  readonly tabs: Tab[] = [
    { label: 'Dashboard', value: 'dashboard', icon: 'pi pi-chart-line' },
    { label: 'Expenses', value: 'expenses', icon: 'pi pi-arrow-down-right' },
    { label: 'Other Income', value: 'income', icon: 'pi pi-arrow-up-right' },
    { label: 'P&L Reports', value: 'reports', icon: 'pi pi-file-export' },
  ];
}

